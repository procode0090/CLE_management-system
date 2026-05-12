
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const showcaseItems = [
  { id: 1, name: "Chronos Gold", price: "$2,400", year: 2026, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200", desc: "Hand-crafted 24k gold bezel with precision movement." },
  { id: 2, name: "Silver Phantom", price: "$1,850", year: 2025, image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200", desc: "Surgical grade stainless steel with deep brushed finish." },
  { id: 3, name: "Midnight Onyx", price: "$3,100", year: 2026, image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1200", desc: "A rare onyx face with luminescent mechanical hands." },
  { id: 4, name: "Rose Heritage", price: "$2,200", year: 2026, image: "https://images.unsplash.com/photo-1508685096489-77359d39707a?w=1200", desc: "Vintage-inspired rose gold case with Italian leather strap." },
  { id: 5, name: "Azure Marine", price: "$2,750", year: 2025, image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?w=1200", desc: "Professional grade water resistance meet elegant design." },
];

const DetailsPage = ({ item, onClose }: any) => (
  <motion.div 
    initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
    className="fixed inset-0 z-[1000] bg-white flex flex-col lg:flex-row overflow-hidden"
  >
    <button onClick={onClose} className="fixed top-8 right-8 z-[1010] text-black text-xs font-bold uppercase tracking-widest border border-black px-6 py-2 hover:bg-black hover:text-white transition-all">Close</button>
    
    <div className="lg:w-1/2 h-1/2 lg:h-full bg-gray-50">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
    </div>

    <div className="lg:w-1/2 p-10 lg:p-24 flex flex-col justify-center">
      <span className="text-gold tracking-[0.4em] uppercase text-[10px] font-black mb-4">Limited Edition</span>
      <h2 className="text-5xl lg:text-7xl font-serif text-black mb-6">{item.name}</h2>
      <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">{item.desc}</p>
      
      <div className="flex items-center gap-8 pt-8 border-t border-gray-100">
        <span className="text-3xl font-serif">{item.price}</span>
        <button className="bg-black text-white px-10 py-4 uppercase tracking-widest text-[11px] font-bold shadow-2xl hover:bg-gold transition-colors">
          Add To Cart
        </button>
      </div>
    </div>
  </motion.div>
);

const StaggeredRevealCard = ({ item, index, activeIndex, setActiveIndex, onOpen }: any) => {
  const isHovered = activeIndex === index;
  const staggeredAngle = [12, 6, 0, -6, -12][index]; 
  const staggeredX = [240, 120, 0, -120, -240][index]; 
  const zIndexBase = [10, 20, 30, 20, 10][index];

  return (
    <motion.div
      onMouseEnter={() => setActiveIndex(index)}
      onClick={() => onOpen(item)}
      animate={{
        rotate: isHovered ? 0 : staggeredAngle,
        x: isHovered ? 0 : staggeredX,
        y: isHovered ? -40 : 0, 
        scale: isHovered ? 1.12 : 1,
        zIndex: isHovered ? 500 : zIndexBase,
        filter: (activeIndex !== null && !isHovered) ? "brightness(0.5) blur(1px)" : "none"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute h-[480px] w-[300px] bg-white rounded-[30px] border-[6px] border-white shadow-2xl cursor-pointer overflow-hidden origin-bottom"
    >
      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      <div className={`absolute inset-0 bg-black/60 p-8 flex flex-col justify-end transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-white font-serif text-3xl mb-1">{item.name}</h3>
        <p className="text-white/60 text-xs tracking-widest">Click to View</p>
      </div>
    </motion.div>
  );
};

export default function StaggeredOverlappedCollection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // --- AUTO-PLAY LOOP LOGIC ---
  useEffect(() => {
    if (!isAutoPlaying || selectedProduct) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev === null || prev >= showcaseItems.length - 1) return 0;
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, selectedProduct]);

  return (
    <section className="min-h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden py-20 relative">
      
      {/* Background Text Accent */}
      <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif text-white/[0.02] pointer-events-none select-none">
        CLE
      </h1>

      <AnimatePresence>
        {selectedProduct && <DetailsPage item={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </AnimatePresence>

      <div 
        className="relative flex justify-center items-center h-[600px] w-full"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => {
          setIsAutoPlaying(true);
          setActiveIndex(null);
        }}
      >
        {showcaseItems.map((item, index) => (
          <StaggeredRevealCard 
            key={item.id} 
            item={item} 
            index={index} 
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onOpen={setSelectedProduct}
          />
        ))}
      </div>
    </section>
  );
}

