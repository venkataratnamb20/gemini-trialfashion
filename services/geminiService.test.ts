
import { generateTryOn, constructVTONPrompt, ProductInput } from './geminiService';
import { RAW_SCRAPED_DATASET } from '../constants';
import { GoogleGenAI } from "@google/genai";

// Declare Jest global types to resolve TypeScript errors
declare const jest: any;
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;
declare const global: any;

// Mock the GoogleGenAI library
jest.mock("@google/genai", () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: jest.fn()
      }
    }))
  };
});

// Mock Global Window properties
const mockOpenSelectKey = jest.fn();
const mockHasSelectedApiKey = jest.fn().mockResolvedValue(true);

Object.defineProperty(global, 'window', {
  value: {
    aistudio: {
      openSelectKey: mockOpenSelectKey,
      hasSelectedApiKey: mockHasSelectedApiKey
    }
  },
  writable: true
});

describe('Gemini VTON Service', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructVTONPrompt', () => {
    it('should generate a prompt containing critical safety instructions', () => {
      const products: ProductInput[] = [{ 
        image: 'base64...', 
        description: 'A blue silk saree', 
        category: 'Women' 
      }];
      
      const prompt = constructVTONPrompt(products);
      
      expect(prompt).toContain('SUBJECT IS HOLY');
      expect(prompt).toContain('GHOST LIMB REMOVAL');
      expect(prompt).toContain('Category: Women');
      expect(prompt).toContain('A blue silk saree');
    });

    it('should include specific draping instructions to prevent fold artifacts', () => {
      const prompt = constructVTONPrompt([{ image: 'img', description: 'desc' }]);
      // Verifies the fix for "Saree is folded according the the model in the product"
      expect(prompt).toContain('RE-DRAPE THE FABRIC');
      expect(prompt).toContain('ADAPT TO TARGET');
    });

    it('should handle multiple products correctly', () => {
      const products: ProductInput[] = [
        { image: 'b1', description: 'Shirt', category: 'Top' },
        { image: 'b2', description: 'Jeans', category: 'Bottom' }
      ];
      
      const prompt = constructVTONPrompt(products);
      expect(prompt).toContain('Item 1 [Category: Top]: Shirt');
      expect(prompt).toContain('Item 2 [Category: Bottom]: Jeans');
    });

    it('should robustly handle missing categories', () => {
      const products: ProductInput[] = [
        { image: 'b1', description: 'Mystery Item' }
      ];
      const prompt = constructVTONPrompt(products);
      expect(prompt).toContain('[Category: Apparel]');
    });
  });

  describe('generateTryOn API Interaction', () => {
    it('should verify API key presence before calling API', async () => {
       await generateTryOn('userBase64', [{ image: 'prodBase64', description: 'desc' }]);
       expect(mockHasSelectedApiKey).toHaveBeenCalled();
    });

    it('should call GoogleGenAI with correct model and inputs', async () => {
       const userImg = 'data:image/jpeg;base64,USER_IMG_DATA';
       const prodImg = 'data:image/png;base64,PROD_IMG_DATA';
       
       // Setup Mock
       const mockGenerateContent = jest.fn().mockResolvedValue({
         candidates: [{ content: { parts: [{ inlineData: { data: 'RESULT_B64' } }] } }]
       });
       
       (GoogleGenAI as unknown as any).mockImplementation(() => ({
          models: { generateContent: mockGenerateContent }
       }));

       await generateTryOn(userImg, [{ image: prodImg, description: 'Test Item' }]);

       // Verify Call
       expect(mockGenerateContent).toHaveBeenCalledTimes(1);
       const callArgs = mockGenerateContent.mock.calls[0][0];
       
       // Check Model
       expect(callArgs.model).toBe('gemini-3-pro-image-preview');
       
       // Check Parts: 1 text + 1 user image + 1 product image = 3 parts
       expect(callArgs.contents.parts).toHaveLength(3);
       
       // Verify User Image Stripping
       expect(callArgs.contents.parts[1].inlineData.data).toBe('USER_IMG_DATA');
       expect(callArgs.contents.parts[1].inlineData.mimeType).toBe('image/jpeg');

       // Verify Product Image Stripping
       expect(callArgs.contents.parts[2].inlineData.data).toBe('PROD_IMG_DATA');
    });

    it('should handle API errors gracefully and return fallback', async () => {
       (GoogleGenAI as unknown as any).mockImplementation(() => ({
          models: { generateContent: jest.fn().mockRejectedValue(new Error('API Failure')) }
       }));

       const result = await generateTryOn('u', [{ image: 'p', description: 'd' }]);
       
       // Should return mock image from constants on failure
       expect(result).toContain('https://images.unsplash.com'); 
    });
  });

  describe('Dataset Robustness Test', () => {
    it('should successfully construct prompts for ALL items in raw dataset', () => {
       // This ensures no weird characters or missing fields in our dataset crash the prompt generator
       RAW_SCRAPED_DATASET.forEach(product => {
          const input: ProductInput = {
              image: 'dummy',
              description: product.description,
              category: product.category
          };
          
          const prompt = constructVTONPrompt([input]);
          expect(prompt).toBeTruthy();
          expect(prompt).toContain(product.description);
          expect(prompt).toContain(product.category);
          
          // Verify critical safety instructions are always present
          expect(prompt).toContain('SUBJECT IS HOLY');
          expect(prompt).toContain('GHOST LIMB REMOVAL');
       });
    });
  });

});
