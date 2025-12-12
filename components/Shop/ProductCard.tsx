
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Plus, Star } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { openVTON, toggleProductSelection, selectedProducts } = useShop();
  const [imgSrc, setImgSrc] = useState(product.image);

  const isSelected = selectedProducts.some(p => p.id === product.id);

  const handleSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleProductSelection(product);
  };

  const handleError = () => {
    setImgSrc('https://via.placeholder.com/400x600?text=Image+Not+Found');
  };

  if (viewMode === 'list') {
    return (
      <div className={`group relative flex flex-row gap-4 p-4 border border-gray-100 rounded-lg bg-white hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-accent' : ''}`}>
        {/* Image Section */}
        <div className="relative w-32 h-40 flex-shrink-0 overflow-hidden bg-gray-100 rounded-md">
           <img 
            src={imgSrc} 
            alt={product.name} 
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={handleError}
          />
           <button 
            onClick={handleSelection}
            className={`absolute top-2 left-2 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
              ${isSelected 
                ? 'bg-black text-white' 
                : 'bg-white/80 text-gray-400 hover:bg-white hover:text-black'
              }`}
            title={isSelected ? "Remove from Look" : "Add to Look"}
          >
            {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </button>
        </div>

        {/* Details Section */}
        <div className="flex flex-col flex-grow justify-between py-1">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
                <h3 className="text-lg font-medium text-gray-900">
                  <Link to={`/product/${product.id}`} className="hover:underline">
                    {product.name}
                  </Link>
                </h3>
              </div>
              <p className="text-lg font-semibold text-gray-900">${product.price}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
             <Button 
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  openVTON([product]); 
                }}
                className="bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 text-xs h-9 px-4"
              >
                <Sparkles className="w-3 h-3 text-yellow-300" />
                Try On
              </Button>
              <Link to={`/product/${product.id}`}>
                 <Button variant="outline" size="sm" className="text-xs h-9">View Details</Button>
              </Link>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW (Default)
  return (
    <div className={`group relative flex flex-col ${isSelected ? 'ring-2 ring-accent ring-offset-2 rounded-sm' : ''}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm mb-2">
        {/* Selection Toggle */}
        <button 
          onClick={handleSelection}
          className={`absolute top-2 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm
            ${isSelected 
              ? 'bg-black text-white' 
              : 'bg-white/80 text-gray-400 hover:bg-white hover:text-black'
            }`}
          title={isSelected ? "Remove from Look" : "Add to Look"}
        >
          {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </button>

        <img 
          src={imgSrc} 
          alt={product.name} 
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={handleError}
        />
        
        {/* Quick VTON Action */}
        <div className="absolute bottom-2 left-2 right-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            fullWidth 
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              openVTON([product]); // Open just for this product
            }}
            className="bg-white/90 text-black hover:bg-white backdrop-blur-sm shadow-lg flex items-center justify-center gap-1 text-xs h-8 px-2"
          >
            <Sparkles className="w-3 h-3 text-accent" />
            Try On
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-xs md:text-sm font-medium text-gray-900 truncate">
          <Link to={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0 z-0" />
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-gray-500">{product.category}</p>
          <p className="text-xs font-semibold text-gray-900">${product.price}</p>
        </div>
      </div>
    </div>
  );
};
