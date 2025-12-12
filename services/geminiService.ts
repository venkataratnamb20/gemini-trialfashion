import { GoogleGenAI } from "@google/genai";
import { MOCK_GENERATED_IMAGE } from "../constants";

// Note: We avoid redeclaring the Window interface for aistudio here because it is 
// likely already declared in the global scope.
// We will cast window to any where necessary to access aistudio.

interface ProductInput {
  image: string; // Base64
  description: string;
  category?: string;
}

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
    let prompt = `
      ACT AS: An Expert Professional Fashion Retoucher and Compositor.
      
      TASK: Perform a high-fidelity Virtual Try-On (VTON) where the "Subject" wears the "Apparel Items".
      
      INPUTS provided in order:
      1. IMAGE_SUBJECT: The user photo (The Subject).
      2. IMAGE_PRODUCTS: One or more product images to be worn.
      
      PRODUCT DETAILS:
    `;
    
    products.forEach((p, index) => {
      const type = p.category ? `[Type: ${p.category}]` : '[Type: Apparel/Accessory]';
      prompt += `\n   - Item ${index + 1} ${type}: ${p.description}`;
    });

    prompt += `
      
      STRICT EXECUTION GUIDELINES:
      
      1. ***IDENTITY PRESERVATION (CRITICAL)***: 
         - You MUST NOT generate a new face or body.
         - You MUST strictly preserve the Subject's facial features, identity, expression, hair, skin tone, and body proportions exactly as they appear in IMAGE_SUBJECT.
         - Do not change the Subject's pose or background.
         
      2. ***NO ARTIFACTS / NO GHOST LIMBS (EXTREMELY IMPORTANT)***:
         - The IMAGE_PRODUCTS inputs often contain models, mannequins, or visible body parts (hands, arms, legs, necks).
         - **YOU MUST COMPLETELY IGNORE** any body parts visible in the IMAGE_PRODUCTS.
         - **ONLY TRANSFER THE CLOTHING ITEM ITSELF.**
         - **DO NOT** copy hands, arms, or extra limbs from the product image to the subject image.
         - If the product image shows a hand resting on the garment, **REMOVE THE HAND** in the generated output and reconstruct the fabric texture underneath it.
         - The final image must ONLY show the Subject's original limbs. Do not add extra hands.
         
      3. ***REALISTIC SCALING & ANATOMY***:
         - **Jewelry**: Scale earrings/necklaces to realistic human proportions. 
         - **Clothing**: Warp the fabric to follow the curvature of the Subject's body. Account for gravity and tension folds.
         
      4. ***COMPOSITION***:
         - Maintain the exact framing of IMAGE_SUBJECT. Do not crop the head or feet if they are visible.
         
      GENERATE: A single, photorealistic output image of the Subject wearing the items.
    `;

    // Construct request parts
    const parts: any[] = [{ text: prompt }];

    // Add User Image (Subject)
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