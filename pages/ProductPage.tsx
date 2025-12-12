
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Lock, Sparkles, ChevronDown, Share2, Upload, Maximize2, Camera, Truck, RotateCcw, ShieldCheck, Loader2 } from 'lucide-react';
import { ProductService } from '../services/productService'; // Use Service
import { useShop } from '../context/ShopContext';
import { Button } from '../components/ui/Button';
import { VTONStage, Product } from '../types';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    addToCart, 
    openVTON, 
    toggleProductSelection, 
    selectedProducts, 
    vtonState,
    setVTONOpen,
    setVTONStage,
    setVTONGeneratedImage,
    setVTONUserImage,
    openGallery
  } = useShop();
  
  const [activeThumb, setActiveThumb] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for Async Data
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await ProductService.getProductById(id);
            setProduct(data || null);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchProduct();
  }, [id]);

  const isSelected = product ? selectedProducts.some(p => p.id === product.id) : false;

  // --- 1. Gallery Logic: Include Generated Images & Scraped Images ---
  const thumbnails = useMemo(() => {
    if (!product) return [];
    
    const list: string[] = [];

    // 1. The User's Result (if exists) - Only real generated results
    if (vtonState.generatedImage) {
      list.push(vtonState.generatedImage);
    }

    // 2. Scraped Product Images
    if (product.images && product.images.length > 0) {
      // Use the new scraped images array
      list.push(...product.images);
    } else {
      // Fallback if no images array (backward compat)
      list.push(product.image);
      list.push(product.image); // Duplicates for UI effect if only 1 exists
    }
    
    // Cap at 6 images max
    return list.slice(0, 6);
  }, [product, vtonState.generatedImage]);

  // Reset active thumb if generated image changes
  useEffect(() => {
    if (vtonState.generatedImage) {
        setActiveThumb(0);
    }
  }, [vtonState.generatedImage]);

  if (loading) {
     return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
        </div>
     );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Button onClick={() => navigate('/')} className="mt-4">Back to Shop</Button>
        </div>
      </div>
    );
  }

  // --- 2. Maximize Logic ---
  const handleMaximize = () => {
    openGallery(thumbnails, activeThumb);
  };

  // --- 3. Direct Upload Logic ---
  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        // Set state for VTON
        setVTONUserImage(base64);
        
        // Setup context for processing
        openVTON([product]); 
        
        // Auto-start processing
        setVTONStage(VTONStage.PROCESSING);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const discount = 57;
  const mrp = Math.floor(product.price * (100 / (100 - discount)));
  const rating = product.rating || 4.5;
  const reviews = product.reviews || 120;

  return (
    <div className="bg-white h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden">
      
      {/* Hidden File Input for Direct Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
        data-testid="hidden-file-input"
      />

      {/* LEFT COLUMN: IMAGES */}
      <div className="flex-1 bg-white relative flex flex-row h-full overflow-hidden">
        {/* Thumbnails Strip */}
        <div className="hidden md:flex flex-col gap-3 p-4 w-20 overflow-y-auto no-scrollbar">
          {thumbnails.map((img, idx) => (
            <button 
              key={idx}
              onMouseEnter={() => setActiveThumb(idx)}
              className={`w-14 h-16 rounded-lg border overflow-hidden flex-shrink-0 relative transition-all ${activeThumb === idx ? 'ring-2 ring-accent border-transparent scale-105' : 'border-gray-300 hover:border-gray-400 opacity-80 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              {/* Badge for generated images */}
              {(vtonState.generatedImage && img === vtonState.generatedImage) && (
                 <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[2px] text-[7px] font-bold text-white text-center py-0.5 tracking-wider">
                   AI LOOK
                 </div>
              )}
            </button>
          ))}
        </div>

        {/* Main Image Stage */}
        <div className="flex-1 relative flex items-center justify-center bg-gray-50 p-4 pb-28">
          <button 
            onClick={() => navigate('/')} 
            className="absolute top-4 left-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
             <button className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors text-gray-700 shadow-sm">
                <Share2 className="w-5 h-5" />
             </button>
             <button 
                onClick={handleMaximize}
                className="p-2 bg-accent text-white hover:bg-accent/90 rounded-full transition-all shadow-md group"
                title="Maximize & Compare"
            >
                <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="relative group max-h-full max-w-full flex items-center justify-center h-full">
            <img 
                src={thumbnails[activeThumb]} 
                alt={product.name} 
                className="max-h-full w-auto object-contain shadow-lg rounded-sm" 
            />
          </div>

          {/* VTON BANNER */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[#111827] text-white shadow-2xl rounded-xl border border-gray-800 backdrop-blur-md z-20 overflow-hidden animate-fade-in">
             <div className="p-3.5 flex items-center justify-between gap-3">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white/10 rounded-full border border-white/10 shrink-0">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-sm leading-tight text-white whitespace-nowrap">Virtual Try-On</p>
                        <p className="text-[10px] text-gray-400 truncate">See it on you in seconds</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 shrink-0">
                    <button 
                        onClick={handleUploadClick}
                        className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                        title="Direct Upload"
                    >
                        <Camera className="w-4 h-4" />
                    </button>

                    <button 
                        onClick={() => openVTON([product])}
                        className="bg-white text-black font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all shadow-sm flex items-center gap-2 uppercase tracking-wide whitespace-nowrap"
                        data-testid="vton-trigger-btn"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        TRY ON
                    </button>
                 </div>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: DETAILS & BUY BOX (Lumière Style) */}
      <div className="w-full md:w-[420px] lg:w-[480px] h-full overflow-y-auto bg-white p-8 md:p-12 z-20 flex flex-col no-scrollbar border-l border-gray-100">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center text-xs font-medium uppercase tracking-widest text-gray-400 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Collection
        </button>

        <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400">
            <span>{product.category}</span>
            {product.subCategory && (
                <>
                <span>•</span>
                <span>{product.subCategory}</span>
                </>
            )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-primary mb-3 leading-tight">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl font-medium font-serif text-primary">${product.price}</span>
          <span className="text-base text-gray-400 line-through decoration-1">${mrp}</span>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 uppercase tracking-wide">-{discount}% Off</span>
        </div>

        {/* Reviews */}
        <div className="flex items-center gap-2 mb-8 pb-8 border-b border-gray-100">
           <div className="flex text-primary">
               {[...Array(5)].map((_, i) => (
                   <Star 
                     key={i} 
                     className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'fill-black' : 'text-gray-200'}`} 
                   />
               ))}
           </div>
           <span className="text-xs font-medium text-gray-500 underline underline-offset-4">{reviews.toLocaleString()} Reviews</span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          {product.description}
        </p>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-6 text-xs font-medium tracking-wide">
             <div className="w-2 h-2 rounded-full bg-green-600"></div>
             <span className="text-green-800">In Stock</span>
             <span className="text-gray-300 mx-2">|</span>
             <span className="text-gray-500">Ships within 24 hours</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <Button 
            onClick={() => addToCart(product)}
            className="w-full h-12 text-xs uppercase tracking-[0.2em] font-medium bg-primary text-white hover:bg-gray-900 rounded-none"
          >
            Add to Bag
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => addToCart(product)}
            className="w-full h-12 text-xs uppercase tracking-[0.2em] font-medium border-gray-300 hover:bg-gray-50 hover:text-black rounded-none"
          >
            Buy Now
          </Button>
        </div>

        <div className="flex justify-center mb-10">
           <button 
             onClick={() => toggleProductSelection(product)}
             className={`group flex items-center gap-2 text-xs font-medium uppercase tracking-widest transition-colors ${isSelected ? 'text-black' : 'text-gray-400 hover:text-black'}`}
           >
              <span className={`flex items-center justify-center w-5 h-5 border transition-colors ${isSelected ? 'border-black bg-black text-white' : 'border-gray-300 group-hover:border-black'}`}>
                  {isSelected ? <Sparkles className="w-3 h-3" /> : <span className="leading-none text-sm">+</span>}
              </span>
              {isSelected ? 'Saved to Look' : 'Add to Wishlist'}
           </button>
        </div>

        {/* Service Perks */}
        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
            <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-wider font-medium text-gray-500">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-wider font-medium text-gray-500">30 Day Returns</span>
            </div>
             <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-wider font-medium text-gray-500">Secure Payment</span>
            </div>
        </div>

      </div>
    </div>
  );
};
