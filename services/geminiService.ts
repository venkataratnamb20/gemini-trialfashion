
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
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
    const category = p.category || 'Apparel';
    const type = `[Category: ${category}]`;
    productDescriptions += `\n   - Item ${index + 1} ${type}: ${p.description}`;
  });

  return `
    TASK: Synthesize a high-end photorealistic fashion shot.
    
    INPUTS:
    1. IMAGE_SUBJECT: The "Target Model".
    2. IMAGE_PRODUCTS: The "Apparel".
    
    OBJECTIVE:
    Generate a seamless composite image of the Target Model wearing the Apparel.
    
    --------------------------------------------------------
    GUIDELINES
    --------------------------------------------------------
    1. **MODEL PRESERVATION**: 
       - The Subject in IMAGE_SUBJECT is a specific fashion model. 
       - You MUST preserve their exact body, pose, skin tone, and facial features.
       - **DO NOT** generate new people.
       - **DO NOT** change the pose.
       
    2. **APPAREL TRANSFER**: 
       - Extract the fabric and design from IMAGE_PRODUCTS.
       - Drape it realistically onto the Target Model's body.
       - Account for gravity, tension, and the model's pose.
       - If the product image contains a human or mannequin, IGNORE them. Only take the clothing.
       - **REMOVE GHOST HANDS**: If the product image has a hand touching the cloth, remove it.
       
    3. **COMPOSITION**:
       - The final image must contain **ONLY ONE** person (The Target Model).
       - Background should be neutral or identical to IMAGE_SUBJECT.

    --------------------------------------------------------
    PRODUCT LIST:
    ${productDescriptions}
    --------------------------------------------------------
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
        },
        systemInstruction: {
          parts: [{ text: "You are a professional fashion image compositor. Your job is to digitally dress models in new clothing items while strictly preserving their identity and pose." }]
        },
        // IMPORTANT: Use BLOCK_NONE to prevent false positives on safe fashion content (especially for kids/swimwear)
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }
        ]
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
    
    // Check for finishReason if candidates exist but no content
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason) {
       console.warn(`Gemini generation finished with reason: ${finishReason}`);
       if (finishReason === 'SAFETY') {
           throw new Error("Generation blocked by safety filters. The model detected sensitive content. Please try a different angle or photo.");
       }
    }
    
    // If we reached here without returning, check for text (error or refusal)
    if (response.text) {
      console.warn("Gemini returned text instead of image:", response.text);
      throw new Error("Model returned text instead of image: " + response.text);
    }
    
    throw new Error("No image data found in response. The model may have blocked the request.");

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

    throw error;
  }
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
