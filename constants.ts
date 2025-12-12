
import { Product } from './types';

// This represents the raw HTML/Data found at the Amazon URLs before filtering.
// The Service will filter this based on the business logic (Rating > 4, Reviews > 100).
export const RAW_SCRAPED_DATASET: Product[] = [
  
  // =========================================================================
  // URL: amazon.com/s?i=fashion-womens (Women's Fashion)
  // Categories: Western Wear, Ethnic Wear, Lingerie & Nightwear
  // =========================================================================
  {
    id: 'w-west-1',
    name: 'Classic Fit 100% Cotton Tee',
    price: 28,
    category: 'Women',
    subCategory: 'Western Wear',
    rating: 4.6,
    reviews: 15420,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1000&auto=format&fit=crop',
    ],
    description: 'The essential everyday t-shirt. Breathable, soft, and pre-shrunk for the perfect fit wash after wash. #1 Best Seller in Women\'s T-Shirts.'
  },
  {
    id: 'w-west-2',
    name: '311 Shaping Skinny Jeans',
    price: 69,
    category: 'Women',
    subCategory: 'Western Wear',
    rating: 4.7,
    reviews: 12500,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Designed to smooth and enhance, these mid-rise skinny jeans feature a tummy-slimming panel and high-stretch denim.'
  },
  {
    id: 'w-eth-1',
    name: 'Georgette Anarkali Kurta Set',
    price: 55,
    category: 'Women',
    subCategory: 'Ethnic Wear',
    rating: 4.5,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1583391733952-4c310280b88c?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1583391733952-4c310280b88c?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583391733975-04536769062b?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Elegant floor-length Anarkali kurta with embroidery. Includes matching dupatta and leggings. Perfect for festive occasions.'
  },
  {
    id: 'w-eth-2',
    name: 'Banarasi Art Silk Saree',
    price: 42,
    category: 'Women',
    subCategory: 'Ethnic Wear',
    rating: 4.3,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Traditional woven silk saree with zari border. Soft fabric with a rich look, ideal for weddings.'
  },
  {
    id: 'w-ling-1',
    name: 'Satin Silk Pajama Set',
    price: 35,
    category: 'Women',
    subCategory: 'Lingerie & Nightwear',
    rating: 4.8,
    reviews: 5400,
    image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518552722881-22929424d626?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Luxurious two-piece sleepwear set. Button-down top and elastic waist pants in silky smooth satin.'
  },
  {
    id: 'w-ling-2',
    name: 'Cotton Lace Bralette',
    price: 22,
    category: 'Women',
    subCategory: 'Lingerie & Nightwear',
    rating: 4.6,
    reviews: 980,
    image: 'https://images.unsplash.com/photo-1618151313441-bc79b11e5090?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1618151313441-bc79b11e5090?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594411130638-349f75a7c936?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Wireless comfort bralette with delicate lace details. Lightly lined for shape and support.'
  },

  // =========================================================================
  // URL: amazon.com/s?i=fashion-mens (Men's Fashion)
  // Categories: Western Wear (Shirts, Jeans, Suits)
  // =========================================================================
  {
    id: 'm-west-1',
    name: 'Tech 2.0 Short Sleeve Tee',
    price: 25,
    category: 'Men',
    subCategory: 'Western Wear',
    rating: 4.7,
    reviews: 55000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Loose, light, and keeps you cool. UA Tech fabric is quick-drying, ultra-soft, and has a more natural feel.'
  },
  {
    id: 'm-west-2',
    name: 'Slim-Fit Wrinkle-Resistant Chino',
    price: 35,
    category: 'Men',
    subCategory: 'Western Wear',
    rating: 4.6,
    reviews: 18900,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'A work-ready pant with a tailored look and comfortable stretch. Features moisture-wicking technology.'
  },
  {
    id: 'm-west-3',
    name: 'Modern Fit Wool Suit Separates',
    price: 180,
    category: 'Men',
    subCategory: 'Western Wear',
    rating: 4.5,
    reviews: 1200,
    image: 'https://images.unsplash.com/photo-1593032465175-d81f0f53d35c?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1593032465175-d81f0f53d35c?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Refined wool-blend jacket with notched lapels. Pair with matching trousers for a sharp professional look.'
  },

  // =========================================================================
  // URL: amazon.com/s?i=fashion-girls (Kids - Girls)
  // Categories: Girls
  // =========================================================================
  {
    id: 'k-girl-1',
    name: 'Girls\' Flutter Sleeve Party Dress',
    price: 22,
    category: 'Kids',
    subCategory: 'Girls',
    rating: 4.8,
    reviews: 4500,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Twirl-worthy tulle dress with sequin details. Soft cotton lining ensures comfort for all-day play.'
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
    images: [
        'https://images.unsplash.com/photo-1605395630663-7c707d72df9e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605395630663-7c707d72df9e?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Matching hoodie and jogger set in soft fleece. Perfect for school or weekend adventures.'
  },

  // =========================================================================
  // URL: amazon.com/s?i=fashion-boys (Kids - Boys)
  // Categories: Boys
  // =========================================================================
  {
    id: 'k-boy-1',
    name: 'Boys\' Cotton Polo Shirt',
    price: 15,
    category: 'Kids',
    subCategory: 'Boys',
    rating: 4.7,
    reviews: 8900,
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519238263496-6362d74c1123?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Classic pique polo shirt available in uniform-approved colors. Fade-resistant and durable.'
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
    images: [
        'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Rugged denim jeans with an adjustable waistband to grow with him. Reinforced knees for extra durability.'
  },

  // =========================================================================
  // Accessories (Cross Category)
  // =========================================================================
  {
    id: 'a-1',
    name: '14K Gold Plated Hoop Earrings',
    price: 14,
    category: 'Accessories',
    subCategory: 'Jewelry',
    rating: 4.6,
    reviews: 62000,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1630019852942-f89202989a51?q=80&w=1000&auto=format&fit=crop'
    ],
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
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Spacious everyday tote with a tassel detail. Large enough to fit a laptop and daily essentials.'
  }
];

// Using the Purple Saree image as the mock result to match the demo scenario (Maroon + Purple -> Purple Result)
export const MOCK_GENERATED_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop';
