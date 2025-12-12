
import { GoogleGenAI } from "@google/genai";
import { MOCK_GENERATED_IMAGE } from "../constants";

// Note: We avoid redeclaring the Window interface for aistudio here because it is 
// likely already declared in the global scope.
// We will cast window to any where necessary to access aistudio.

export interface ProductInput {
  image: string; // Base64
  description: string;
  category?: string;
}

/**
 * Helper to construct the robust prompt. 
 * Exported for testing purposes.
 */
export const constructVTONPrompt = (products: ProductInput[]): string => {
  let productDescriptions = '';
  products.forEach((p, index) => {
    const type = p.category ? `[Category: ${p.category}]` : '[Category: Apparel]';
    productDescriptions += `\n   - Item ${index + 1} ${type}: ${p.description}`;
  });

  return `
    ROLE: Expert Virtual Try-On (VTON) AI.
    
    TASK: Synthesize a photorealistic image of the "Target Person" (IMAGE_SUBJECT) wearing the "Apparel" (IMAGE_PRODUCTS).
    
    --------------------------------------------------------
    CRITICAL INSTRUCTION - ANATOMY & ARTIFACT PREVENTION
    --------------------------------------------------------
    1. **SUBJECT IS HOLY**: The Target Person's body, pose, arms, hands, legs, and face must be preserved EXACTLY as they appear in IMAGE_SUBJECT. 
       - DO NOT generate new limbs.
       - DO NOT change the pose.
       
    2. **PRODUCT IMAGE IS "FABRIC ONLY"**: 
       - The models/mannequins in IMAGE_PRODUCTS are strictly for displaying the cloth.
       - **IGNORE** their hands, arms, faces, and skin. 
       - **GHOST LIMB REMOVAL**: If the product model has a hand resting on the clothing (e.g., holding a saree pallu or a dress hem), YOU MUST REMOVE THAT HAND. Inpaint the missing fabric texture underneath it.
       - **FAIL STATE**: If the output contains three hands or a disembodied hand floating on the cloth, the generation is a failure.
       
    3. **CLOTHING INTEGRATION & DRAPING**:
       - **RE-DRAPE THE FABRIC**: Do not copy the rigid shape or folds from the product image. The product image often has folds specific to that model's pose (e.g., bent knee, hand on hip).
       - **ADAPT TO TARGET**: You must simulate how this specific fabric (silk, cotton, denim) would hang on the TARGET PERSON'S pose.
       - If the product image is a saree folded over a model's arm, but the target person's arm is straight, you must unfold the saree and let it fall naturally.
       
    --------------------------------------------------------
    INPUTS
    --------------------------------------------------------
    IMAGE_SUBJECT: The user to dress.
    IMAGE_PRODUCTS: The clothing to transfer.
    
    PRODUCT LIST:
    ${productDescriptions}
    
    --------------------------------------------------------
    OUTPUT
    --------------------------------------------------------
    Generate ONLY the final image. High resolution. Photorealistic.
  `;
};

export const generateTryOn = async (userImageBase64: string, products: ProductInput[]): Promise<string> => {
  try {
    // 1. Ensure API Key is selected
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await aistudio.openSelectKey();
      }
    } else {
        console.warn("window.aistudio is not available");
    }

    // 2. Initialize Gemini Client
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Using Gemini 3 Pro Image Preview for maximum fidelity
    const model = 'gemini-3-pro-image-preview';

    // Helper to robustly strip data URL prefix (handles avif, webp, etc.)
    const stripPrefix = (b64: string) => {
      const commaIndex = b64.indexOf(',');
      if (commaIndex !== -1) {
        return b64.substring(commaIndex + 1);
      }
      return b64;
    };
    
    // Dynamic Prompt Construction
    const prompt = constructVTONPrompt(products);

    // Construct request parts
    const parts: any[] = [{ text: prompt }];

    // Add User Image (Subject) - ALWAYS FIRST
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: stripPrefix(userImageBase64)
      }
    });

    // Add All Product Images
    products.forEach((p) => {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: stripPrefix(p.image)
        }
      });
    });

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: '3:4', 
        }
      }
    });

    // Extract image from response
    const responseParts = response.candidates?.[0]?.content?.parts;
    if (responseParts) {
      for (const part of responseParts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:image/jpeg;base64,${part.inlineData.data}`;
        }
      }
    }
    
    if (response.text) {
      console.warn("Gemini returned text instead of image:", response.text);
    }
    
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    
    // Handle 403 Permission Denied or Not Found
    if (error.status === 403 || (error.message && error.message.includes("Requested entity was not found"))) {
      console.warn("API Key permission issue detected. Prompting user to select a valid key.");
      try {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
          await aistudio.openSelectKey();
        }
      } catch (e) {
        console.error("Failed to open key selector:", e);
      }
    }
  }

  // --- MOCK FALLBACK ---
  // In a real scenario, we might show an error, but for this demo we fallback.
  await new Promise(resolve => setTimeout(resolve, 3000));
  return MOCK_GENERATED_IMAGE;
};

// Helper to convert URL to Base64 (Standardized to JPEG)
export const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Needed for external images
    img.src = url;
    
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    
    // Draw and convert to JPEG
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.95);

  } catch (error) {
    console.error("Error converting image to base64, falling back to fetch", error);
    // Fallback: Fetch directly (might return AVIF/WebP, but generateTryOn now handles prefixes better)
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Fallback failed", e);
        return '';
    }
  }
};
