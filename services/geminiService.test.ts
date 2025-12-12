
import { generateTryOn, constructVTONPrompt, ProductInput } from './geminiService';
import { RAW_SCRAPED_DATASET } from '../constants';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

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
    })),
    HarmCategory: {
        HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
        HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT'
    },
    HarmBlockThreshold: {
        BLOCK_NONE: 'BLOCK_NONE',
        BLOCK_ONLY_HIGH: 'BLOCK_ONLY_HIGH'
    }
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
      
      expect(prompt).toContain('Target Model');
      expect(prompt).toContain('REMOVE GHOST HANDS');
      expect(prompt).toContain('Category: Women');
      expect(prompt).toContain('A blue silk saree');
    });

    it('should include specific draping instructions to prevent fold artifacts', () => {
      const prompt = constructVTONPrompt([{ image: 'img', description: 'desc' }]);
      expect(prompt).toContain('APPAREL TRANSFER');
      expect(prompt).toContain('Drape it realistically');
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
  });

  describe('generateTryOn API Interaction', () => {
    it('should verify API key presence before calling API', async () => {
       await generateTryOn('userBase64', [{ image: 'prodBase64', description: 'desc' }]);
       expect(mockHasSelectedApiKey).toHaveBeenCalled();
    });

    it('should call GoogleGenAI with correct model, inputs, and BLOCK_NONE SAFETY SETTINGS', async () => {
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
       
       // Check System Instruction
       expect(callArgs.config.systemInstruction).toBeDefined();
       
       // Verify Safety Settings were passed as BLOCK_NONE
       expect(callArgs.config.safetySettings).toBeDefined();
       expect(callArgs.config.safetySettings[0].threshold).toBe('BLOCK_NONE');

       // Verify User Image Stripping
       expect(callArgs.contents.parts[1].inlineData.data).toBe('USER_IMG_DATA');
       expect(callArgs.contents.parts[1].inlineData.mimeType).toBe('image/jpeg');

       // Verify Product Image Stripping
       expect(callArgs.contents.parts[2].inlineData.data).toBe('PROD_IMG_DATA');
    });

    it('should THROW ERROR on API failure', async () => {
       (GoogleGenAI as unknown as any).mockImplementation(() => ({
          models: { generateContent: jest.fn().mockRejectedValue(new Error('API Failure')) }
       }));

       // Expect the promise to reject with the error
       await expect(generateTryOn('u', [{ image: 'p', description: 'd' }]))
         .rejects
         .toThrow('API Failure');
    });
  });

});
