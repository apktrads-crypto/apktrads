import React from 'react';
import { ShoppingCart, LayoutDashboard, Home } from 'lucide-react';

export default function Navbar({ cartCount, onNavigate, currentView }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-sm border-b transition-all duration-300 bg-white" style={{ borderBottomColor: 'rgba(0,0,0,0.1)' }}>
      <style>{`
        .nav-link-active { color: var(--primary); font-weight: 700; border-bottom: 2px solid var(--primary); }
        .nav-link { color: var(--text); opacity: 0.7; }
        .nav-link:hover { opacity: 1; color: var(--primary); }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
            <span className="font-heading font-black text-2xl tracking-tight transition-transform group-hover:scale-105" style={{color: 'var(--primary)'}}>APK TRADERS</span>
          </div>
          
          <div className="flex items-center space-x-6 sm:space-x-8">
            <button 
              onClick={() => onNavigate('home')}
              className={`flex items-center space-x-1 py-2 transition-all ${currentView === 'home' ? 'nav-link-active' : 'nav-link'}`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Shop</span>
            </button>
            <button 
              onClick={() => onNavigate('admin')}
              className={`flex items-center space-x-1 py-2 transition-all ${currentView === 'admin' ? 'nav-link-active' : 'nav-link'}`}
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Admin</span>
            </button>
            
            <div className="relative group cursor-pointer" style={{color: 'var(--primary)'}}>
              <div className="p-2 rounded-full transition-colors hover:bg-gray-100">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg transform transition-transform group-hover:scale-110" style={{backgroundColor: 'var(--secondary)'}}>
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
