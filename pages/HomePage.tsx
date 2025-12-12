
import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, ShoppingBag, Loader2, RefreshCw, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductService } from '../services/productService'; 
import { ProductCard } from '../components/Shop/ProductCard';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/ui/Button';
import { Product } from '../types';

const CATEGORIES = ['All', 'Women', 'Men', 'Kids', 'Accessories'];

export const HomePage: React.FC = () => {
  const { selectedProducts, openVTON, clearSelection } = useShop();
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);

  // View & Pagination State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Initial Fetch (Read from DB or Scrape)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const handleRefreshDatabase = async () => {
    setIsScraping(true);
    setLoading(true);
    try {
      ProductService.clearDatabase();
      await ProductService.scrapeAndPopulateDatabase();
      const data = await ProductService.getAllProducts();
      setProducts(data);
      setCurrentPage(1);
    } finally {
      setIsScraping(false);
      setLoading(false);
    }
  };

  // Filter Data
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white relative">
      {/* Rebranded Hero Section */}
      <div className="relative bg-black text-white h-[45vh] flex items-center justify-center overflow-hidden mb-10">
        <img 
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop" 
          alt="Fashion Studio" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tighter">
            TRIAL FASHION
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 font-light tracking-wide">
            Your Style. Your Virtual Trial Room.
          </p>
          <Button 
            onClick={() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-3"
          >
            Start Shopping
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Controls Toolbar */}
        <div className="flex flex-col gap-6 mb-8 border-b border-gray-100 pb-6">
          
          {/* Top Row: Title + Scrape Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-gray-900">New Arrivals</h2>
            <button 
                  onClick={handleRefreshDatabase}
                  disabled={isScraping}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                  title="Reload all products from source"
              >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
                  {isScraping ? 'Updating Catalog...' : 'Update Catalog'}
              </button>
          </div>

          {/* Bottom Row: Filters & View Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
               {CATEGORIES.map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`px-5 py-2 text-xs font-medium uppercase tracking-widest rounded-full transition-all whitespace-nowrap border
                     ${activeCategory === cat 
                       ? 'bg-black text-white border-black' 
                       : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                     }`}
                 >
                   {cat}
                 </button>
               ))}
            </div>

            {/* View & Sort Controls */}
            <div className="flex items-center gap-4 ml-auto">
               
               {/* Items Per Page */}
               <div className="flex items-center gap-2">
                 <span className="text-xs text-gray-400 uppercase tracking-wide hidden sm:inline">Show:</span>
                 <select 
                   value={itemsPerPage}
                   onChange={(e) => {
                     setItemsPerPage(Number(e.target.value));
                     setCurrentPage(1);
                   }}
                   className="text-xs font-medium border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:border-black cursor-pointer"
                 >
                   <option value={8}>8</option>
                   <option value={12}>12</option>
                   <option value={24}>24</option>
                   <option value={48}>48</option>
                 </select>
               </div>

               <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

               {/* View Toggle */}
               <div className="flex items-center bg-gray-100 rounded-md p-1">
                 <button 
                   onClick={() => setViewMode('grid')}
                   className={`p-1.5 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                   title="Grid View"
                 >
                   <LayoutGrid className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={`p-1.5 rounded-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                   title="List View"
                 >
                   <List className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </div>
          
          {/* Result Count */}
          <div className="text-xs text-gray-400">
             Showing <span className="text-black font-medium">{filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}</span> - <span className="text-black font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="text-black font-medium">{filteredProducts.length}</span> results
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
              <p className="text-sm text-gray-500 uppercase tracking-widest">
                Loading Collection...
              </p>
           </div>
        ) : (
          <>
            {/* Products Container */}
            <div className={`animate-fade-in ${
              viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-y-10 gap-x-6' 
                : 'flex flex-col gap-4 max-w-3xl mx-auto'
            }`}>
              {currentItems.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                No products found in this category.
              </div>
            )}

            {/* Pagination Controls */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-gray-100">
                <button 
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-md hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex gap-1 mx-2">
                  {[...Array(totalPages)].map((_, idx) => {
                    const page = idx + 1;
                    // Simple logic to show strictly limited page numbers for cleaner UI
                    if (totalPages > 7 && (page > 2 && page < totalPages - 1 && Math.abs(currentPage - page) > 1)) {
                        if (page === 3 || page === totalPages - 2) return <span key={page} className="text-gray-300 self-end px-1">...</span>;
                        return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all
                          ${currentPage === page 
                            ? 'bg-black text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button 
                   onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                   disabled={currentPage === totalPages}
                   className="p-2 border border-gray-200 rounded-md hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
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
