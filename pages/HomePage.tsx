import React, { useState, useMemo } from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from '../components/Shop/ProductCard';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/ui/Button';

const CATEGORIES = ['All', 'Women', 'Men', 'Kids', 'Accessories'];

export const HomePage: React.FC = () => {
  const { selectedProducts, openVTON, clearSelection } = useShop();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-white relative">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white h-[50vh] flex items-center justify-center overflow-hidden mb-8">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
          alt="Fashion Editorial" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight">The Future of Fit</h1>
          <p className="text-base md:text-lg text-gray-200 max-w-xl mx-auto mb-6 font-light">
            Mix and match items to create your perfect look with our AI Stylist.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-xl font-serif font-bold text-gray-900">Latest Collection</h2>
          
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
             {CATEGORIES.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-4 py-1.5 text-xs font-medium uppercase tracking-widest rounded-full transition-colors whitespace-nowrap
                   ${activeCategory === cat 
                     ? 'bg-black text-white' 
                     : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black'
                   }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        {/* Small Card Grid: Starts at 2 cols, goes up to 5 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4 animate-fade-in">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
           <div className="text-center py-20 text-gray-400">
             No products found in this category.
           </div>
        )}
      </div>

      {/* Floating Selection Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-fade-in w-11/12 max-w-lg">
          <div className="bg-black text-white p-3 rounded-xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {selectedProducts.slice(0, 3).map((p, i) => (
                  <img 
                    key={i} 
                    src={p.image} 
                    className="w-8 h-8 rounded-full border-2 border-black object-cover" 
                    alt="" 
                  />
                ))}
                {selectedProducts.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[10px]">
                    +{selectedProducts.length - 3}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs">{selectedProducts.length} Items Selected</span>
                <button onClick={clearSelection} className="text-[10px] text-gray-400 hover:text-white text-left underline">
                  Clear selection
                </button>
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => openVTON(selectedProducts)}
              className="flex items-center gap-2 text-xs"
            >
              <Sparkles className="w-3 h-3" />
              Try On Look
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
