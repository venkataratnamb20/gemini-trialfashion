
import { Product } from '../types';
import { RAW_SCRAPED_DATASET } from '../constants';

// --- DATABASE SIMULATION ---
// In a real app, this would be a MongoDB or PostgreSQL connection.
// Here we use localStorage to persist the "scraped" data.
// UPDATED: Version 3 to invalidate old cache with broken images and new array structure.
const DB_KEY = 'trial_fashion_db_v3';

export const ProductService = {
  
  /**
   * Business Logic: Scrape data from provided Amazon URLs.
   * Simulates network latency and parsing.
   */
  async scrapeAndPopulateDatabase(): Promise<void> {
    console.log("Initiating Scraper Bot...");
    
    // 1. Define Target URLs (from requirements)
    const targets = [
      { url: 'https://www.amazon.com/s?i=fashion-womens...', category: 'Women' },
      { url: 'https://www.amazon.com/s?i=fashion-mens...', category: 'Men' },
      { url: 'https://www.amazon.com/s?i=fashion-girls...', category: 'Kids' }, // Girls mapped to Kids
      { url: 'https://www.amazon.com/s?i=fashion-boys...', category: 'Kids' }  // Boys mapped to Kids
    ];

    // Simulate network delay for scraping
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 2. "Scrape" Logic: Extract data matching the URLs from our raw dataset
    // In a real script, this would use Puppeteer/Cheerio to parse HTML.
    let extractedProducts: Product[] = [...RAW_SCRAPED_DATASET];

    // 3. APPLY BUSINESS CRITERIA - UPDATED: NO FILTER
    // Original criteria (Rating > 4, Reviews > 100) removed to show all items.
    const validProducts = extractedProducts;

    console.log(`Scraping complete. Found ${validProducts.length} items.`);

    // 4. Write to Database
    localStorage.setItem(DB_KEY, JSON.stringify(validProducts));
  },

  /**
   * Database Read: Get all products.
   * Checks if DB is empty and triggers scrape if needed.
   */
  async getAllProducts(): Promise<Product[]> {
    const stored = localStorage.getItem(DB_KEY);
    
    if (!stored) {
      // Database empty, run initial scrape
      await this.scrapeAndPopulateDatabase();
      return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    }

    // Simulate DB query latency
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(stored);
  },

  /**
   * Database Read: Get single product by ID.
   */
  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getAllProducts();
    return products.find(p => p.id === id);
  },

  /**
   * Utility: Clear DB (for debugging)
   */
  clearDatabase() {
    localStorage.removeItem(DB_KEY);
  }
};
