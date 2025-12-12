import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CartItem, Product, VTONState, VTONStage } from '../types';

interface ShopContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  
  // Selection Logic for Multi-Item VTON
  selectedProducts: Product[];
  toggleProductSelection: (product: Product) => void;
  clearSelection: () => void;
  
  // VTON Logic
  vtonState: VTONState;
  openVTON: (products: Product[]) => void;
  openGallery: (images: string[], initialIndex: number) => void; // New
  navigateGallery: (direction: 'next' | 'prev') => void; // New
  closeVTON: () => void;
  setVTONOpen: (isOpen: boolean) => void;
  setVTONStage: (stage: VTONStage) => void;
  setVTONUserImage: (image: string) => void;
  setVTONGeneratedImage: (image: string) => void;
  setVTONError: (error: string | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  const [vtonState, setVtonState] = useState<VTONState>({
    isOpen: false,
    products: [],
    userImage: null,
    generatedImage: null,
    stage: VTONStage.IDLE,
    error: null,
    galleryImages: [],
    activeGalleryIndex: 0,
  });

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const toggleProductSelection = useCallback((product: Product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const openVTON = useCallback((products: Product[]) => {
    setVtonState({
      isOpen: true,
      products: products,
      userImage: null,
      generatedImage: null,
      stage: VTONStage.UPLOAD,
      error: null,
      galleryImages: [],
      activeGalleryIndex: 0
    });
  }, []);

  const openGallery = useCallback((images: string[], initialIndex: number) => {
    setVtonState({
      isOpen: true,
      products: [],
      userImage: images[initialIndex],
      generatedImage: images[initialIndex], // Single view mode
      stage: VTONStage.RESULT,
      error: null,
      galleryImages: images,
      activeGalleryIndex: initialIndex
    });
  }, []);

  const navigateGallery = useCallback((direction: 'next' | 'prev') => {
    setVtonState(prev => {
        if (prev.galleryImages.length === 0) return prev;
        let newIndex = prev.activeGalleryIndex;
        if (direction === 'next') {
            newIndex = (prev.activeGalleryIndex + 1) % prev.galleryImages.length;
        } else {
            newIndex = (prev.activeGalleryIndex - 1 + prev.galleryImages.length) % prev.galleryImages.length;
        }
        return {
            ...prev,
            activeGalleryIndex: newIndex,
            userImage: prev.galleryImages[newIndex],
            generatedImage: prev.galleryImages[newIndex]
        };
    });
  }, []);

  const closeVTON = useCallback(() => {
    setVtonState(prev => ({ ...prev, isOpen: false }));
    setTimeout(() => {
      setVtonState({
        isOpen: false,
        products: [],
        userImage: null,
        generatedImage: null,
        stage: VTONStage.IDLE,
        error: null,
        galleryImages: [],
        activeGalleryIndex: 0
      });
    }, 300);
  }, []);

  const setVTONOpen = useCallback((isOpen: boolean) => {
    setVtonState(prev => ({ ...prev, isOpen }));
  }, []);

  const setVTONStage = useCallback((stage: VTONStage) => {
    setVtonState(prev => ({ ...prev, stage }));
  }, []);

  const setVTONUserImage = useCallback((image: string) => {
    setVtonState(prev => ({ ...prev, userImage: image }));
  }, []);

  const setVTONGeneratedImage = useCallback((image: string) => {
    setVtonState(prev => ({ ...prev, generatedImage: image }));
  }, []);
  
  const setVTONError = useCallback((error: string | null) => {
    setVtonState(prev => ({ ...prev, error }));
  }, []);

  return (
    <ShopContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      selectedProducts,
      toggleProductSelection,
      clearSelection,
      vtonState,
      openVTON,
      openGallery,
      navigateGallery,
      closeVTON,
      setVTONOpen,
      setVTONStage,
      setVTONUserImage,
      setVTONGeneratedImage,
      setVTONError
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};