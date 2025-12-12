
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sparkles, ShoppingBag, Loader2, RefreshCw, LayoutGrid, List, ChevronLeft, ChevronRight, Upload, Camera, Shirt, ArrowRight, User } from 'lucide-react';
import { ProductService } from '../services/productService'; 
import { ProductCard } from '../components/Shop/ProductCard';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/ui/Button';
import { Product, VTONStage } from '../types';

const CATEGORIES = ['All', 'Women', 'Men', 'Kids', 'Accessories'];

// Demo Images for Animation loop in Hero
const DEMO_SCENARIOS = [
    {
      label: "1. Your Photo",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
    },
    {
      label: "2. Virtual Try-On",
      img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
    }
];

export const HomePage: React.FC = () => {
  const { selectedProducts, openVTON, clearSelection, setVTONUserImage, setVTONStage } = useShop();
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);

  // View & Pagination State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // --- VTON LANDING STATE ---
  const [heroModelImage, setHeroModelImage] = useState<string | null>(null);
  const [heroApparelImage, setHeroApparelImage] = useState<string | null>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const apparelInputRef = useRef<HTMLInputElement>(null);
  const [demoIndex, setDemoIndex] = useState(0);

  // Animation Loop for Hero Image
  useEffect(() => {
    const interval = setInterval(() => {
        setDemoIndex(prev => (prev + 1) % DEMO_SCENARIOS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // VTON Upload Handlers
  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'model' | 'apparel') => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            if (type === 'model') setHeroModelImage(result);
            else setHeroApparelImage(result);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleStartVTON = () => {
    if (heroModelImage && heroApparelImage) {
        // Create a temporary product object for the uploaded apparel
        const customProduct: Product = {
            id: 'custom-upload-' + Date.now(),
            name: 'My Uploaded Item',
            price: 0,
            category: 'Custom',
            image: heroApparelImage,
            description: 'Custom uploaded apparel item for virtual try-on.',
            images: [heroApparelImage]
        };

        // CRITICAL: Order matters here.
        // 1. Open VTON first (this resets the state, including userImage to null)
        openVTON([customProduct]);
        
        // 2. Then set the User Image (this updates the state initialized by openVTON)
        setVTONUserImage(heroModelImage);
        
        // 3. Finally set stage to processing to auto-start the generation
        setVTONStage(VTONStage.PROCESSING);
    }
  };


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
      
      {/* =========================================================================
          HERO: VIRTUAL TRIAL ROOM LANDING
         ========================================================================= */}
      <div className="relative bg-[#0a0a0a] text-white overflow-hidden min-h-[600px] flex items-center">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px]"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]"></div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 py-16">
            
            {/* Left Column: Interactions */}
            <div className="flex flex-col justify-center space-y-8 animate-fade-in order-2 lg:order-1">
                <div>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-4 leading-tight">
                        Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Trial Room</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-lg">
                        Experience the future of fashion. Upload your photo and any apparel item to see exactly how it fits before you buy.
                    </p>
                </div>

                {/* Upload Zone */}
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4">
                      {/* Model Uploader */}
                      <div 
                          onClick={() => modelInputRef.current?.click()}
                          className={`group relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
                            ${heroModelImage ? 'border-green-500 bg-black' : 'border-gray-700 bg-gray-900/50 hover:bg-gray-800'}`}
                          data-testid="hero-model-upload"
                      >
                          {heroModelImage ? (
                              <>
                                <img src={heroModelImage} alt="Model" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                <div className="z-10 bg-black/80 p-2 rounded-full backdrop-blur-sm border border-green-500/30">
                                  <User className="w-5 h-5 text-green-400" />
                                </div>
                              </>
                          ) : (
                              <>
                                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                      <User className="w-6 h-6 text-gray-400" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-300">1. Upload You</span>
                              </>
                          )}
                          <input type="file" ref={modelInputRef} className="hidden" accept="image/*" onChange={(e) => handleHeroUpload(e, 'model')} data-testid="file-input-model" />
                      </div>

                      {/* Apparel Uploader */}
                      <div 
                          onClick={() => apparelInputRef.current?.click()}
                          className={`group relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
                            ${heroApparelImage ? 'border-green-500 bg-black' : 'border-gray-700 bg-gray-900/50 hover:bg-gray-800'}`}
                          data-testid="hero-apparel-upload"
                      >
                          {heroApparelImage ? (
                               <>
                                <img src={heroApparelImage} alt="Apparel" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                <div className="z-10 bg-black/80 p-2 rounded-full backdrop-blur-sm border border-green-500/30">
                                  <Shirt className="w-5 h-5 text-green-400" />
                                </div>
                              </>
                          ) : (
                              <>
                                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                      <Shirt className="w-6 h-6 text-gray-400" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-300">2. Upload Clothes</span>
                              </>
                          )}
                          <input type="file" ref={apparelInputRef} className="hidden" accept="image/*" onChange={(e) => handleHeroUpload(e, 'apparel')} data-testid="file-input-apparel" />
                      </div>
                  </div>

                  <Button 
                    size="lg" 
                    disabled={!heroModelImage || !heroApparelImage}
                    onClick={handleStartVTON}
                    className="w-full py-6 text-lg font-bold tracking-wide uppercase shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="hero-generate-btn"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Try-On
                  </Button>
                </div>
            </div>

            {/* Right Column: Demo Animation */}
            <div className="flex items-center justify-center order-1 lg:order-2">
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border border-gray-700 shadow-2xl bg-gray-900">
                     {/* Images Fading */}
                     {DEMO_SCENARIOS.map((scenario, index) => (
                         <div 
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === demoIndex ? 'opacity-100' : 'opacity-0'}`}
                         >
                             <img src={scenario.img} alt={scenario.label} className="w-full h-full object-cover" />
                             
                             {/* Floating Label */}
                             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                <Sparkles className={`w-3 h-3 ${index === 1 ? 'text-yellow-400' : 'text-gray-400'}`} />
                                <span className="text-xs font-bold tracking-wider uppercase">{scenario.label}</span>
                             </div>
                         </div>
                     ))}
                     
                     {/* Scan Line Effect */}
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-pulse pointer-events-none"></div>
                </div>
            </div>
         </div>
      </div>

      {/* =========================================================================
          SHOP SECTION
         ========================================================================= */}
      <div id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${activeCategory === cat 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <button 
                onClick={handleRefreshDatabase}
                disabled={isScraping}
                className="p-2 text-gray-400 hover:text-black transition-colors"
                title="Refresh Catalog"
             >
                <RefreshCw className={`w-5 h-5 ${isScraping ? 'animate-spin' : ''}`} />
             </button>
             <div className="h-4 w-px bg-gray-300 mx-1" />
             <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>

        {/* Global Selection Bar (Floating) */}
        {selectedProducts.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-lg shadow-2xl flex items-center gap-4 animate-fade-in max-w-[90vw]">
             <div className="flex -space-x-2">
                {selectedProducts.map(p => (
                   <img key={p.id} src={p.image} className="w-8 h-8 rounded-full border-2 border-black object-cover" alt="" />
                ))}
             </div>
             <div className="text-sm">
                <span className="font-bold">{selectedProducts.length}</span> items selected
             </div>
             <div className="h-4 w-px bg-gray-700" />
             <button 
               onClick={() => openVTON(selectedProducts)}
               className="flex items-center font-bold text-sm hover:text-gray-200"
             >
               <Sparkles className="w-4 h-4 mr-2 text-yellow-300" /> Try On
             </button>
             <button onClick={clearSelection} className="text-gray-500 hover:text-white ml-2">
               ✕
             </button>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
             <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-gray-900">No products found</h3>
             <p className="text-gray-500 mt-1">Try changing the category or refreshing the catalog.</p>
             <Button onClick={handleRefreshDatabase} className="mt-4" variant="outline">Reload Catalog</Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10" 
              : "grid grid-cols-1 gap-4"
          }>
            {currentItems.map(product => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm font-medium text-gray-600 tracking-widest">
              PAGE {currentPage} OF {totalPages}
            </span>

            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
