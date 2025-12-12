
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // e.g., 'Women', 'Men'
  subCategory?: string; // e.g., 'Western Wear', 'Ethnic Wear', 'Shoes'
  image: string; // Main display image
  images?: string[]; // All scraped images for gallery
  description: string;
  rating?: number; // 1-5
  reviews?: number; // Count
}

export interface CartItem extends Product {
  quantity: number;
}

export enum VTONStage {
  IDLE = 'IDLE',
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface VTONState {
  isOpen: boolean;
  products: Product[]; // Array of products to try on
  userImage: string | null; // Base64 string
  generatedImage: string | null; // Base64 string
  stage: VTONStage;
  error: string | null;
  // Gallery Support
  galleryImages: string[];
  activeGalleryIndex: number;
}
