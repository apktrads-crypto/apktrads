import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/AdminDashboard';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTheme, setActiveTheme] = useState('vintage');
  const [cartCount, setCartCount] = useState(0);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) setProducts(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const data = await res.json();
        setActiveTheme(data.activeTheme || 'vintage');
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSettings();
  }, []);

  const handleAddToCart = () => setCartCount(prev => prev + 1);

  return (
    <div className={`min-h-screen flex flex-col theme-${activeTheme}`}>
      <Navbar cartCount={cartCount} onNavigate={setCurrentView} currentView={currentView} />
      
      <main className="flex-grow pt-20">
        {currentView === 'home' ? (
          <>
            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-3xl font-bold mb-8 text-center sm:text-left border-b-2 border-teal/10 pb-4">Our Heritage Collection</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500 italic py-12">No products available. Please add some from the Admin Dashboard.</p>
                ) : (
                  products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <AdminDashboard 
            products={products} 
            onProductAdded={fetchProducts} 
            dynamicCategories={categories}
            refreshCategories={fetchCategories}
            activeTheme={activeTheme}
            onThemeChange={(newTheme) => {
              setActiveTheme(newTheme);
              fetch(`${API_BASE}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activeTheme: newTheme })
              });
            }}
          />
        )}
      </main>

      <footer className="bg-forestGreen text-cream py-8 text-center mt-auto secondary-bg" style={{backgroundColor: 'var(--primary)'}}>
        <p className="font-heading italic" style={{color: 'var(--bg)'}}>APK Traders &copy; {new Date().getFullYear()} - Sahi Daam Mein Sahi Aur Shudh Saaman</p>
      </footer>
    </div>
  );
}

export default App;
