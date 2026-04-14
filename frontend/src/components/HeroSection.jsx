import React from 'react';

export default function HeroSection() {
  return (
    <div className="bg-forestGreen text-cream py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-4 border-cream/30"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full border-2 border-teal"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 text-cream leading-tight">
          Purity, Heritage & Trust
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-cream/90 font-medium italic">
          "Kheti Se Bazaar Tak Purity - Sahi Daam Mein Sahi Aur Shudh Saaman"
        </p>
        <button className="bg-cream text-forestGreen font-bold py-4 px-10 rounded-sm hover:bg-teal hover:text-cream transition-all duration-300 transform hover:-translate-y-1 shadow-lg tracking-wider text-lg">
          SHOP PURE GOODS
        </button>
      </div>
    </div>
  );
}
