
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // ==========================================
  // WOMEN'S COLLECTION (Scraped from Amazon Fashion)
  // ==========================================
  {
    id: 'w-top-1',
    name: 'Classic Fit 100% Cotton Tee',
    price: 28,
    category: 'Women',
    subCategory: 'Tops',
    rating: 4.6,
    reviews: 15420,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    description: 'The essential everyday t-shirt. Breathable, soft, and pre-shrunk for the perfect fit wash after wash. #1 Best Seller in Women\'s T-Shirts.'
  },
  {
    id: 'w-dress-1',
    name: 'Bohemian Floral Wrap Maxi',
    price: 49,
    category: 'Women',
    subCategory: 'Dresses',
    rating: 4.5,
    reviews: 8900,
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=1000&auto=format&fit=crop',
    description: 'A flattering wrap dress with flutter sleeves and a flowy high-low hem. Perfect for summer weddings and brunch dates.'
  },
  {
    id: 'w-jeans-1',
    name: '311 Shaping Skinny Jeans',
    price: 69,
    category: 'Women',
    subCategory: 'Bottoms',
    rating: 4.7,
    reviews: 12500,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
    description: 'Designed to smooth and enhance, these mid-rise skinny jeans feature a tummy-slimming panel and high-stretch denim.'
  },
  {
    id: 'w-outer-1',
    name: 'Oversized Faux Shearling Coat',
    price: 85,
    category: 'Women',
    subCategory: 'Outerwear',
    rating: 4.8,
    reviews: 3200,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
    description: 'Stay cozy and chic in this plush faux shearling teddy coat. Features deep pockets and a relaxed lapel.'
  },
  {
    id: 'w-active-1',
    name: 'High-Waist Yoga Leggings',
    price: 25,
    category: 'Women',
    subCategory: 'Activewear',
    rating: 4.9,
    reviews: 45000,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
    description: 'Buttery soft leggings with 4-way stretch and side pockets. The ultimate go-to for yoga, running, or lounging.'
  },
  {
    id: 'w-dress-2',
    name: 'Satin Cowl Neck Slip Dress',
    price: 55,
    category: 'Women',
    subCategory: 'Dresses',
    rating: 4.4,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
    description: 'Elegant silk-feel midi dress with adjustable spaghetti straps. A versatile staple for evening events.'
  },

  // ==========================================
  // MEN'S COLLECTION (Scraped from Amazon Fashion)
  // ==========================================
  {
    id: 'm-top-1',
    name: 'Tech 2.0 Short Sleeve Tee',
    price: 25,
    category: 'Men',
    subCategory: 'Tops',
    rating: 4.7,
    reviews: 55000,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
    description: 'Loose, light, and keeps you cool. UA Tech fabric is quick-drying, ultra-soft, and has a more natural feel.'
  },
  {
    id: 'm-bottom-1',
    name: 'Slim-Fit Wrinkle-Resistant Chino',
    price: 35,
    category: 'Men',
    subCategory: 'Bottoms',
    rating: 4.6,
    reviews: 18900,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    description: 'A work-ready pant with a tailored look and comfortable stretch. Features moisture-wicking technology.'
  },
  {
    id: 'm-outer-1',
    name: 'Full-Zip Fleece Jacket',
    price: 45,
    category: 'Men',
    subCategory: 'Outerwear',
    rating: 4.8,
    reviews: 22000,
    image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=1000&auto=format&fit=crop',
    description: 'The next generation of a classic. Soft, durable fleece with zippered hand pockets and a modern fit.'
  },
  {
    id: 'm-top-2',
    name: 'Heavyweight Pocket T-Shirt',
    price: 30,
    category: 'Men',
    subCategory: 'Tops',
    rating: 4.9,
    reviews: 8500,
    image: 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?q=80&w=1000&auto=format&fit=crop',
    description: 'Durable heavyweight cotton jersey. Features a generous fit and a chest pocket with logo patch.'
  },
  {
    id: 'm-suit-1',
    name: 'Modern Fit Wool Suit Separates',
    price: 180,
    category: 'Men',
    subCategory: 'Suits',
    rating: 4.5,
    reviews: 1200,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    description: 'Refined wool-blend jacket with notched lapels. Pair with matching trousers for a sharp professional look.'
  },

  // ==========================================
  // KIDS' COLLECTION (Scraped from Amazon Fashion - Girls & Boys)
  // ==========================================
  {
    id: 'k-girl-1',
    name: 'Girls\' Flutter Sleeve Party Dress',
    price: 22,
    category: 'Kids',
    subCategory: 'Girls',
    rating: 4.8,
    reviews: 4500,
    image: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=1000&auto=format&fit=crop',
    description: 'Twirl-worthy tulle dress with sequin details. Soft cotton lining ensures comfort for all-day play.'
  },
  {
    id: 'k-boy-1',
    name: 'Boys\' Cotton Polo Shirt',
    price: 15,
    category: 'Kids',
    subCategory: 'Boys',
    rating: 4.7,
    reviews: 8900,
    image: 'https://images.unsplash.com/photo-1519238263496-6362d74c1123?q=80&w=1000&auto=format&fit=crop',
    description: 'Classic pique polo shirt available in uniform-approved colors. Fade-resistant and durable.'
  },
  {
    id: 'k-girl-2',
    name: 'Girls\' 2-Piece Active Set',
    price: 28,
    category: 'Kids',
    subCategory: 'Girls',
    rating: 4.6,
    reviews: 1200,
    image: 'https://images.unsplash.com/photo-1605395630663-7c707d72df9e?q=80&w=1000&auto=format&fit=crop',
    description: 'Matching hoodie and jogger set in soft fleece. Perfect for school or weekend adventures.'
  },
  {
    id: 'k-boy-2',
    name: 'Boys\' Straight Fit Jeans',
    price: 20,
    category: 'Kids',
    subCategory: 'Boys',
    rating: 4.5,
    reviews: 6700,
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop',
    description: 'Rugged denim jeans with an adjustable waistband to grow with him. Reinforced knees for extra durability.'
  },
  {
    id: 'k-shoes-1',
    name: 'Kids\' Classic Clog',
    price: 35,
    category: 'Kids',
    subCategory: 'Shoes',
    rating: 4.8,
    reviews: 52000,
    image: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?q=80&w=1000&auto=format&fit=crop',
    description: 'The iconic lightweight clog. Water-friendly, easy to clean, and perfect for active kids.'
  },

  // ==========================================
  // ACCESSORIES (Scraped from Amazon Fashion)
  // ==========================================
  {
    id: 'a-1',
    name: '14K Gold Plated Hoop Earrings',
    price: 14,
    category: 'Accessories',
    subCategory: 'Jewelry',
    rating: 4.6,
    reviews: 62000,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a51?q=80&w=1000&auto=format&fit=crop',
    description: 'Lightweight chunky open hoops. Hypoallergenic and crafted for long-lasting wear without tarnishing.'
  },
  {
    id: 'a-2',
    name: 'Vegan Leather Tote Bag',
    price: 45,
    category: 'Accessories',
    subCategory: 'Bags',
    rating: 4.7,
    reviews: 11500,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    description: 'Spacious everyday tote with a tassel detail. Large enough to fit a laptop and daily essentials.'
  },
  {
    id: 's-1',
    name: 'Canvas Low Top Sneaker',
    price: 60,
    category: 'Accessories',
    subCategory: 'Shoes',
    rating: 4.7,
    reviews: 28000,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
    description: 'Timeless canvas sneakers with a rubber sole. A versatile wardrobe staple for any season.'
  },
  {
    id: 's-2',
    name: 'Leather Chelsea Boots',
    price: 140,
    category: 'Accessories',
    subCategory: 'Shoes',
    rating: 4.5,
    reviews: 4200,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
    description: 'Genuine leather boots with elastic side panels. Features a cushioned insole for all-day comfort.'
  }
];

export const MOCK_GENERATED_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop';
