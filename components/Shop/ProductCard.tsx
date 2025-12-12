import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Plus } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openVTON, toggleProductSelection, selectedProducts } = useShop();

  const isSelected = selectedProducts.some(p => p.id === product.id);

  const handleSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleProductSelection(product);
  };

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
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
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