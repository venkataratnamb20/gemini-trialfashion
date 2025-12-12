import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { VTONModal } from './components/VTON/VTONModal';

const App: React.FC = () => {
  return (
    <ShopProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
          </main>
          <VTONModal />
          
          <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
              <p className="font-serif italic text-lg mb-4 text-gray-900">TRIAL FASHION</p>
              <p>&copy; {new Date().getFullYear()} Trial Fashion. Powered by Google Gemini.</p>
            </div>
          </footer>
        </div>
      </HashRouter>
    </ShopProvider>
  );
};

export default App;