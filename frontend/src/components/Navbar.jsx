import React from 'react';
import { ShoppingCart, LayoutDashboard, Home } from 'lucide-react';

export default function Navbar({ cartCount, onNavigate, currentView }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md shadow-sm border-b border-teal/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="font-heading font-black text-2xl text-forestGreen tracking-tight">APK TRADERS</span>
          </div>
          
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('home')}
              className={`font-semibold hover:text-teal transition-colors flex items-center space-x-1 ${currentView === 'home' ? 'text-forestGreen' : 'text-gray-600'}`}
            >
              <Home size={18} />
              <span>Shop</span>
            </button>
            <button 
              onClick={() => onNavigate('admin')}
              className={`font-semibold hover:text-teal transition-colors flex items-center space-x-1 ${currentView === 'admin' ? 'text-forestGreen' : 'text-gray-600'}`}
            >
              <LayoutDashboard size={18} />
              <span>Admin</span>
            </button>
            
            <div className="relative">
              <button className="text-forestGreen hover:text-teal transition-colors focus:outline-none">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-teal text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
