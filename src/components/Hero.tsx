


import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const backgroundImages = [

    "/one.jpg",
     "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ,
    "/two.png",
    "/three.png"
    // "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1600&q=80",
    // "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1600&q=80",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  return (
    <section className="relative h-screen w-full flex items-center bg-black overflow-hidden">
      
      {/* --- BACKGROUND SLIDER --- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ 
              duration: 1.8, 
              ease: [0.645, 0.045, 0.355, 1.0] 
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* The Image Fix */}
            <motion.img
              src={backgroundImages[index]}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "linear" }}
              // object-cover is the magic fix for "not looking good"
              className="w-full h-full object-cover"
              alt="Luxury Background"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        </AnimatePresence>

        {/* Static Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 items-center h-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="max-w-xl text-white"
        >
          <p className="text-[#006666] uppercase text-[11px] mb-6 font-black tracking-[1em]">
            THE VAULT
          </p>
          
          <h1 className="text-8xl md:text-[10rem] font-serif leading-[0.8] mb-8 tracking-tighter text-white">
            CLE
          </h1>
          
          <div className="h-[2px] w-24 bg-[#006666] mb-12" />
          
          <p className="text-gray-300 font-light text-xl md:text-2xl mb-14 leading-relaxed max-w-md">
            Architectural precision <br/> 
            <span className="text-white font-semibold tracking-tight">
              meets timeless luxury.
            </span>
          </p>
          
          <div className="flex gap-6">
             <motion.button 
               whileHover={{ scale: 1.05, backgroundColor: "#005555" }}
               whileTap={{ scale: 0.95 }}
               className="bg-[#006666] text-white px-14 py-5 text-[10px] uppercase tracking-[0.4em] font-black transition-all shadow-2xl"
             >
               Enter Gallery
             </motion.button>
             <button className="border border-white/20 text-white px-10 py-5 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white hover:text-black transition-all">
               Our Story
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;