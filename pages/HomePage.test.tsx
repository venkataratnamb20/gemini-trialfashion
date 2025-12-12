import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HomePage } from './HomePage';
import { ShopProvider } from '../context/ShopContext';
import { ProductService } from '../services/productService';
import { VTONStage } from '../types';

// Declare Jest global types to resolve TypeScript errors
declare const jest: any;
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;

// Mock ProductService
jest.mock('../services/productService', () => ({
  ProductService: {
    getAllProducts: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Test Product',
        price: 100,
        category: 'Men',
        image: 'test.jpg',
        description: 'Test description'
      }
    ]),
    scrapeAndPopulateDatabase: jest.fn(),
    clearDatabase: jest.fn()
  }
}));

// Mock Shop Context
const mockOpenVTON = jest.fn();
const mockSetVTONUserImage = jest.fn();
const mockSetVTONStage = jest.fn();

jest.mock('../context/ShopContext', () => ({
  ...jest.requireActual('../context/ShopContext'),
  useShop: () => ({
    selectedProducts: [],
    openVTON: mockOpenVTON,
    clearSelection: jest.fn(),
    setVTONUserImage: mockSetVTONUserImage,
    setVTONStage: mockSetVTONStage,
    vtonState: {
        isOpen: false,
        products: [],
        stage: VTONStage.IDLE
    }
  }),
  ShopProvider: ({ children }: any) => <div>{children}</div>
}));

describe('HomePage Virtual Trial Room', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Hero section with Virtual Trial Room title', async () => {
    render(
      <ShopProvider>
        <HomePage />
      </ShopProvider>
    );

    expect(screen.getByText(/Virtual/i)).toBeInTheDocument();
    expect(screen.getByText(/Trial Room/i)).toBeInTheDocument();
  });

  it('initially has Generate Try-On button disabled', async () => {
    render(
      <ShopProvider>
        <HomePage />
      </ShopProvider>
    );
    
    const generateBtn = screen.getByTestId('hero-generate-btn');
    expect(generateBtn).toBeDisabled();
  });

  it('enables button and triggers VTON when images are uploaded', async () => {
    render(
      <ShopProvider>
        <HomePage />
      </ShopProvider>
    );

    const modelInput = screen.getByTestId('file-input-model');
    const apparelInput = screen.getByTestId('file-input-apparel');

    // Simulate file uploads
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    
    // We need to verify that state updates within the component enable the button
    // Note: Since we are mocking FileReader, we might need a more complex setup or just assume the inputs work.
    // For this test, we can trust the logic if we check the interactions.
    
    // However, in a real integration test we would fire change events:
    fireEvent.change(modelInput, { target: { files: [file] } });
    fireEvent.change(apparelInput, { target: { files: [file] } });

    // Wait for button to be enabled (async due to file reading)
    await waitFor(() => {
        const generateBtn = screen.getByTestId('hero-generate-btn');
        expect(generateBtn).not.toBeDisabled();
    });

    const generateBtn = screen.getByTestId('hero-generate-btn');
    fireEvent.click(generateBtn);

    // Verify critical sequence of calls
    expect(mockOpenVTON).toHaveBeenCalled();
    expect(mockSetVTONUserImage).toHaveBeenCalled();
    expect(mockSetVTONStage).toHaveBeenCalledWith(VTONStage.PROCESSING);
    
    // Verify Order: openVTON should be called before setVTONUserImage
    const openVTONCallOrder = mockOpenVTON.mock.invocationCallOrder[0];
    const setUserImageCallOrder = mockSetVTONUserImage.mock.invocationCallOrder[0];
    
    expect(openVTONCallOrder).toBeLessThan(setUserImageCallOrder);
  });
});