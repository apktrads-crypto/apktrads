import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/AdminDashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/products';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admin'
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cartCount} onNavigate={setCurrentView} currentView={currentView} />
      
      <main className="flex-grow pt-20">
        {currentView === 'home' ? (
          <>
            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Heritage Collection</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500 italic">No products available. Please add some from the Admin Dashboard.</p>
                ) : (
                  products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <AdminDashboard products={products} onProductAdded={fetchProducts} />
        )}
      </main>

      <footer className="bg-forestGreen text-cream py-8 text-center mt-auto">
        <p className="font-heading italic">APK Traders &copy; {new Date().getFullYear()} - Sahi Daam Mein Sahi Aur Shudh Saaman</p>
      </footer>
    </div>
  );
}

export default App;
