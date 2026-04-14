import React from 'react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden transition-all duration-500 py-24 px-4" style={{backgroundColor: 'var(--primary)', color: 'var(--bg)'}}>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-4" style={{borderColor: 'var(--bg)'}}></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full border-2" style={{borderColor: 'var(--secondary)'}}></div>
        {/* Festive theme patterns */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-around items-center opacity-30 select-none">
          <span className="text-[200px] font-black pointer-events-none">APK</span>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight drop-shadow-md" style={{color: 'var(--bg)'}}>
          Purity, Heritage & Trust
        </h1>
        <p className="text-xl md:text-2xl mb-10 font-medium italic opacity-90">
          "Kheti Se Bazaar Tak Purity - Sahi Daam Mein Sahi Aur Shudh Saaman"
        </p>
        <button 
          className="font-bold py-4 px-10 rounded shadow-2xl transition-all hover:scale-105 active:scale-95 group relative overflow-hidden" 
          style={{backgroundColor: 'var(--bg)', color: 'var(--primary)'}}
        >
          <span className="relative z-10 uppercase tracking-widest text-lg">SHOP PURE GOODS</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{backgroundColor: 'var(--primary)'}}></div>
        </button>
      </div>
    </div>
  );
}
