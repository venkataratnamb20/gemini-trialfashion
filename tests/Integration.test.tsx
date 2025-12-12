import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { HomePage } from '../pages/HomePage';
import { ProductCard } from '../components/Shop/ProductCard';
import { ShopProvider } from '../context/ShopContext';
import { RAW_SCRAPED_DATASET } from '../constants';

// Declare Jest global types to resolve TypeScript errors
declare const jest: any;
declare const describe: any;
declare const it: any;
declare const expect: any;

// Mocks
jest.mock('../services/productService', () => ({
  ProductService: {
    getAllProducts: jest.fn().mockResolvedValue(RAW_SCRAPED_DATASET),
    scrapeAndPopulateDatabase: jest.fn(),
    clearDatabase: jest.fn()
  }
}));

describe('Integration Tests: Navigation & Content', () => {

  it('Header navigation links should exist and be clickable', () => {
    render(
      <ShopProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ShopProvider>
    );

    const navItems = ['New Arrivals', 'Clothing', 'Accessories', 'Editorial'];
    
    navItems.forEach(item => {
      const link = screen.getByText(item);
      expect(link).toBeInTheDocument();
      // Ensure it's a button now for better access control/testability
      expect(link.tagName).toBe('BUTTON');
    });
  });

  it('Product Cards should handle image errors gracefully', () => {
    const mockProduct = { ...RAW_SCRAPED_DATASET[0], image: 'broken-link.jpg' };
    
    render(
      <ShopProvider>
        <MemoryRouter>
          <ProductCard product={mockProduct} />
        </MemoryRouter>
      </ShopProvider>
    );

    const img = screen.getByAltText(mockProduct.name) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    
    // Simulate error
    fireEvent.error(img);
    
    // Check if source changed to placeholder
    expect(img.src).toContain('via.placeholder.com');
  });

  it('Woman category products should have women in images (Data Validation)', () => {
     // This is a data correctness test based on the fix for "Man in Woman category"
     const womenTee = RAW_SCRAPED_DATASET.find(p => p.id === 'w-west-1');
     expect(womenTee).toBeDefined();
     expect(womenTee?.category).toBe('Women');
     
     // The fix involved changing the image URL. 
     // We verify it is NOT the old man image URL (ending in 6864f9cf17ab)
     expect(womenTee?.image).not.toContain('6864f9cf17ab');
  });

});