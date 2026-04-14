import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-teal/10 flex flex-col h-full group">
      
      <div className="h-64 w-full bg-cream relative overflow-hidden flex-shrink-0">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#E8F3EF] flex flex-col items-center justify-center border-b-4 border-teal/20 p-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-forestGreen/10 border-2 border-forestGreen/30 rounded flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <span className="font-heading font-black text-4xl sm:text-5xl text-forestGreen tracking-tighter shadow-sm">
                APK
              </span>
            </div>
            <span className="mt-4 text-xs font-bold uppercase tracking-widest text-teal bg-white px-3 py-1 rounded-full shadow-sm">
              Image Coming Soon
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-bold text-teal tracking-wider uppercase mb-2">
          {product.category}
        </span>
        <h3 className="text-xl font-bold mb-2 flex-grow text-gray-800 font-heading">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-black text-forestGreen">
            ₹{product.price}
          </span>
          <button 
            onClick={onAddToCart}
            className="bg-forestGreen text-white px-4 py-2 rounded font-semibold hover:bg-teal transition-colors shadow-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
