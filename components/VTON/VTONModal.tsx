import React, { useRef, useState, useEffect } from 'react';
import { Upload, Sparkles, AlertCircle, ShoppingBag, Plus, Minus, RotateCcw, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useShop } from '../../context/ShopContext';
import { VTONStage } from '../../types';
import { generateTryOn, imageUrlToBase64 } from '../../services/geminiService';
import { BeforeAfterSlider } from './BeforeAfterSlider';

// A default model image for users who don't want to upload
const DEFAULT_MODEL_IMAGE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop';

export const VTONModal: React.FC = () => {
  const { 
    vtonState, 
    closeVTON, 
    setVTONStage, 
    setVTONUserImage, 
    setVTONGeneratedImage, 
    setVTONError,
    addToCart,
    navigateGallery
  } = useShop();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  // Reset zoom when navigating gallery (when image changes)
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [vtonState.generatedImage, vtonState.activeGalleryIndex]);

  // Keyboard Navigation for Gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (vtonState.isOpen && vtonState.stage === VTONStage.RESULT && vtonState.galleryImages.length > 1) {
        if (e.key === 'ArrowLeft') {
          navigateGallery('prev');
        } else if (e.key === 'ArrowRight') {
          navigateGallery('next');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vtonState.isOpen, vtonState.stage, vtonState.galleryImages.length, navigateGallery]);

  // Main Logic for interacting with Gemini Service
  const startProcessing = async (userImage: string) => {
    if (vtonState.products.length === 0) return;

    setVTONStage(VTONStage.PROCESSING);
    setVTONError(null);
    setZoom(1); 
    setPan({ x: 0, y: 0 });

    try {
      // 1. Convert all products to Base64
      const productInputs = await Promise.all(
        vtonState.products.map(async (p) => ({
          image: await imageUrlToBase64(p.image),
          description: p.description,
          category: p.category // Pass category for better prompting
        }))
      );
      
      // 2. Call Gemini Service
      const resultImage = await generateTryOn(
        userImage, 
        productInputs
      );

      setVTONGeneratedImage(resultImage);
      setVTONStage(VTONStage.RESULT);
    } catch (err) {
      console.error(err);
      setVTONError('Failed to generate virtual try-on. Please try again.');
      setVTONStage(VTONStage.UPLOAD);
    }
  };

  const useDefaultModel = async () => {
    try {
        const base64 = await imageUrlToBase64(DEFAULT_MODEL_IMAGE);
        setVTONUserImage(base64);
        startProcessing(base64);
    } catch (e) {
        setVTONError("Could not load model image.");
    }
  };

  // Auto-start if opened in PROCESSING mode with image
  useEffect(() => {
    if (vtonState.isOpen && vtonState.stage === VTONStage.PROCESSING && vtonState.userImage && !vtonState.generatedImage) {
        const timer = setTimeout(() => {
            startProcessing(vtonState.userImage!);
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [vtonState.isOpen, vtonState.stage, vtonState.userImage]);


  // Handle File Upload (Manual within Modal)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setVTONError('Please upload a valid image file (JPEG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = event.target?.result as string;
      setVTONUserImage(img);
      startProcessing(img);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Zoom Helpers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPan({ x: 0, y: 0 }); 
      return newZoom;
    });
  };
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsPanning(true);
      startPanRef.current = { 
        x: e.clientX - pan.x, 
        y: e.clientY - pan.y 
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      e.preventDefault();
      const newX = e.clientX - startPanRef.current.x;
      const newY = e.clientY - startPanRef.current.y;
      setPan({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => setIsPanning(false);
  const handleMouseLeave = () => setIsPanning(false);

  // --- RENDER HELPERS ---

  const renderProductList = () => (
    <div className="flex -space-x-3 overflow-hidden mb-4 justify-center">
      {vtonState.products.map((p, i) => (
        <img 
          key={i} 
          src={p.image} 
          alt={p.name}
          className="inline-block w-12 h-12 rounded-full border-2 border-white object-cover ring-1 ring-gray-200" 
          title={p.name}
        />
      ))}
    </div>
  );

  const renderUploadState = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50">
      <h2 className="text-3xl font-serif font-bold mb-2">Virtual Fitting Room</h2>
      
      <p className="text-gray-500 mb-6 max-w-md">
        Try on {vtonState.products.length > 1 
          ? <span className="font-semibold text-black">{vtonState.products.length} items</span> 
          : <span className="font-semibold text-black">{vtonState.products[0]?.name}</span>
        }
      </p>

      {vtonState.products.length > 0 && renderProductList()}

      <div 
        className={`w-full max-w-lg h-56 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer bg-white mb-4
          ${isDragOver ? 'border-accent bg-accent/5' : 'border-gray-300 hover:border-gray-400'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Upload className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-lg font-medium">Click to upload or drag photo</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>

      <div className="relative w-full max-w-lg flex items-center gap-4 mb-6">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-xs text-gray-400 font-medium">OR</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <Button variant="outline" onClick={useDefaultModel} className="w-full max-w-lg py-6 group">
         <User className="w-5 h-5 mr-2 text-gray-500 group-hover:text-black" />
         Try with Model (Random)
      </Button>

      <div className="mt-8 flex gap-4 text-xs text-gray-400">
        <span className="flex items-center"><Sparkles className="w-3 h-3 mr-1" /> Multi-Item Layering</span>
        <span className="flex items-center">🔒 Privacy First Processing</span>
      </div>
    </div>
  );

  const renderProcessingState = () => (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white p-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-t-2 border-r-2 border-white animate-spin"></div>
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent animate-pulse" />
      </div>
      <h3 className="text-2xl font-serif mt-8 animate-pulse-slow">Composing Your Look...</h3>
      <p className="text-gray-400 mt-2 text-center max-w-xs">
        Layering {vtonState.products.map(p => p.name).join(', ')} onto your photo.
      </p>
    </div>
  );

  const renderResultState = () => (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 relative bg-gray-900 overflow-hidden flex flex-col">
        {/* Navigation Arrows (Only if gallery has multiple images) */}
        {vtonState.galleryImages.length > 1 && (
            <>
                <button 
                    onClick={(e) => { e.stopPropagation(); navigateGallery('prev'); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-lg group"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); navigateGallery('next'); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-md transition-all border border-white/10 shadow-lg group"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
            </>
        )}

        <div 
          className="flex-1 w-full h-full overflow-hidden flex items-center justify-center p-8"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
        >
          <div 
             style={{ 
               aspectRatio: '3/4',
               height: '100%',
               width: 'auto',
               maxWidth: '100%',
               maxHeight: '100%',
               transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
               transition: isPanning ? 'none' : 'transform 0.2s ease-out',
             }}
             className="relative shadow-2xl origin-center"
          >
            {vtonState.userImage && vtonState.generatedImage && (
              <BeforeAfterSlider 
                beforeImage={vtonState.userImage} 
                afterImage={vtonState.generatedImage} 
              />
            )}
          </div>
        </div>
        
        {/* Floating Zoom Controls & Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-full text-white shadow-xl z-30 border border-white/10">
          
          {/* Image Counter */}
          {vtonState.galleryImages.length > 1 && (
            <div className="flex items-center pl-2 pr-3 mr-1 border-r border-white/20 h-5">
              <span className="text-xs font-mono font-medium select-none text-gray-200">
                {vtonState.activeGalleryIndex + 1}<span className="text-gray-500">/</span>{vtonState.galleryImages.length}
              </span>
            </div>
          )}

          <button 
            onClick={handleZoomOut} 
            disabled={zoom <= 1}
            className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50 transition-colors"
            title="Zoom Out"
          >
            <Minus size={16} />
          </button>
          <span className="text-xs font-mono font-medium min-w-[3ch] text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button 
            onClick={handleZoomIn} 
            disabled={zoom >= 4}
            className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50 transition-colors"
            title="Zoom In"
          >
            <Plus size={16} />
          </button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <button 
            onClick={handleResetZoom} 
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Reset View"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="h-auto p-6 bg-white border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 z-40 relative">
        <div className="flex items-center gap-4">
           {vtonState.products.length > 0 && renderProductList()}
           <div>
             <h3 className="font-serif text-lg font-bold">
                 {vtonState.galleryImages.length > 0 && vtonState.products.length === 0 
                    ? "Gallery View" 
                    : "Complete Look"
                 }
             </h3>
             {vtonState.products.length > 0 && (
                 <p className="text-green-600 text-sm font-medium">
                  <Sparkles className="w-3 h-3 inline mr-1" /> Generated with Gemini AI
                 </p>
             )}
           </div>
        </div>
        
        {/* Actions are only relevant if we are actually doing VTON, not just gallery viewing */}
        {vtonState.products.length > 0 && (
            <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" onClick={() => setVTONStage(VTONStage.UPLOAD)} className="flex-1 md:flex-none">
                Try Another Photo
            </Button>
            <Button 
                onClick={() => {
                vtonState.products.forEach(p => addToCart(p));
                closeVTON();
                }}
                className="flex-1 md:flex-none"
            >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add All to Cart
            </Button>
            </div>
        )}
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={vtonState.isOpen} 
      onClose={closeVTON} 
      fullScreen 
      className="bg-white"
    >
       {vtonState.error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 text-red-600 px-4 py-3 rounded-lg shadow-lg flex items-center border border-red-100">
          <AlertCircle className="w-5 h-5 mr-2" />
          {vtonState.error}
          <button onClick={() => setVTONError(null)} className="ml-4 font-bold hover:text-red-800">Dismiss</button>
        </div>
      )}

      {vtonState.stage === VTONStage.UPLOAD && renderUploadState()}
      {vtonState.stage === VTONStage.PROCESSING && renderProcessingState()}
      {vtonState.stage === VTONStage.RESULT && renderResultState()}
    </Modal>
  );
};