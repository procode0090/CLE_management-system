import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid, Layout, Maximize } from "lucide-react";

// --- SUB-COMPONENT: FULL-BLEED PRODUCT CARD ---
const ProductCard = ({ name, price, images, initialImageIndex = 0 }: any) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev:any) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev:any) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group relative aspect-[3/4] w-full bg-[#111] overflow-hidden cursor-pointer"
    >
      {/* --- IMAGE LAYER (Zero Spacing) --- */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
      </AnimatePresence>

      {/* --- NAVIGATION ARROWS (Hover Only) --- */}
      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <button 
          onClick={prevImage}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextImage}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* --- BOTTOM INFO OVERLAY --- */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
        <motion.div 
          initial={{ y: 20 }} 
          whileInView={{ y: 0 }}
          className="transform translate-y-4 group-hover:translate-y-0 transition-transform"
        >
          <h3 className="text-white font-serif text-xl tracking-tight">{name}</h3>
          <p className="text-[#D4AF37] text-xs font-bold mt-1 uppercase tracking-widest">{price}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- MAIN CATALOG ---
const ProductCatalog = () => {
  const [viewMode, setViewMode] = useState("compact"); // cinema, standard, compact

  // Define grid classes based on viewMode
  const gridClasses = {
    cinema: "grid-cols-1 md:grid-cols-2",
    standard: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    compact: "grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  };

  const products = Array.from({ length: 32 }).map((_, i) => ({
    id: i,
    name: `Model ${String.fromCharCode(65 + (i % 26))}-${100 + i}`,
    price: `$${(Math.random() * 4000 + 800).toLocaleString()}`,
    // Mocking multiple images for the < > cycle feature
    images: [
      `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800`,
      `https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800`,
      `https://images.unsplash.com/photo-1508685096489-77359d39707a?auto=format&fit=crop&q=80&w=800`
    ]
  }));

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-10">
        
        {/* --- VIEW CONTROLS --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6  ">
          <h2 className="text-white font-serif text-4xl tracking-tighter">The Vault</h2>
          
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setViewMode("cinema")}
              className={`p-2 rounded-md transition-all ${viewMode === 'cinema' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              <Maximize size={18} />
            </button>
            <button 
              onClick={() => setViewMode("standard")}
              className={`p-2 rounded-md transition-all ${viewMode === 'standard' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              <Layout size={18} />
            </button>
            <button 
              onClick={() => setViewMode("compact")}
              className={`p-2 rounded-md transition-all ${viewMode === 'compact' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              <Grid size={18} />
            </button>
          </div>
        </div>

        {/* --- DYNAMIC GRID --- */}
        <motion.div 
          layout
          className={`grid ${gridClasses[viewMode as keyof typeof gridClasses]} gap-1`}
        >
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </motion.div>

        <div className="mt-20 text-center">
          <button className="text-white/30 hover:text-white uppercase text-[10px] tracking-[0.6em] transition-all border-b border-white/10 pb-2">
            Load Master Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;




