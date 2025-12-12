import React from 'react';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

export const Header: React.FC = () => {
  const { cart } = useShop();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button className="p-2 -ml-2 mr-2 md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="text-2xl font-serif font-bold tracking-tighter">
              LUMIÈRE
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-widest text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">New Arrivals</Link>
            <Link to="/" className="hover:text-black transition-colors">Clothing</Link>
            <Link to="/" className="hover:text-black transition-colors">Accessories</Link>
            <Link to="/" className="hover:text-black transition-colors">Editorial</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};