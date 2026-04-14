import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border flex flex-col h-full group transform hover:-translate-y-1" style={{borderColor: 'rgba(var(--primary), 0.1)'}}>
      
      <div className="h-64 w-full relative overflow-hidden flex-shrink-0" style={{backgroundColor: 'var(--accent)'}}>
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg flex items-center justify-center transform rotate-6 group-hover:rotate-0 transition-transform duration-500 border-2" style={{backgroundColor: 'rgba(var(--primary), 0.1)', borderColor: 'var(--primary)'}}>
              <span className="font-heading font-black text-4xl sm:text-5xl tracking-tighter" style={{color: 'var(--primary)'}}>
                APK
              </span>
            </div>
            <span className="mt-6 text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm bg-white" style={{color: 'var(--secondary)'}}>
              Image Coming Soon
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 text-[10px] font-black px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter" style={{backgroundColor: 'var(--primary)', color: 'var(--bg)'}}>
          APK Quality Seal
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-bold tracking-widest uppercase mb-2 opacity-60">
          {product.category}
        </span>
        <h3 className="text-xl font-bold mb-4 flex-grow font-heading" style={{color: 'var(--text)'}}>
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-black" style={{color: 'var(--primary)'}}>
            ₹{product.price}
          </span>
          <button 
            onClick={onAddToCart}
            className="px-5 py-2.5 rounded-lg font-bold text-white transition-all hover:shadow-lg active:scale-95 shadow-sm"
            style={{backgroundColor: 'var(--primary)'}}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
