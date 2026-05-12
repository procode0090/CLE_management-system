
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
const introvideo = "/video.mp4";

export default function VideoIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("cle_intro_seen");
    if (hasSeenIntro) {
      setIsVisible(false);
    }
  }, []);

  // Use this to ensure the video is actually ready and playing
  const handleLoaded = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented, clicking skip will proceed:", error);
      });
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    sessionStorage.setItem("cle_intro_seen", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 4, ease: "easeInOut" } 
          }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden"
        >
          {/* TRANSPARENCY TRICK: 
              'mix-blend-screen' makes black pixels transparent. 
              Works perfectly if your video has a pure black background.
          */}
          <video
            ref={videoRef}
            muted
            playsInline
            onLoadedData={handleLoaded}
            onEnded={handleComplete}
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none"
          >
            <source src={introvideo} type="video/mp4" />
          </video>

          {/* Luxury Overlay Text */}
          <div className="relative z-10 text-center pointer-events-none">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="text-white font-serif text-5xl md:text-8xl tracking-[0.3em] uppercase"
            >
              CLE
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 1 }}
              className="h-[1px] bg-[#D4AF37] mt-4 mx-auto"
            />
          </div>

          <button 
            onClick={handleComplete}
            className="absolute bottom-12 right-12 text-white/30 text-[9px] uppercase tracking-[0.5em] hover:text-[#D4AF37] transition-all z-[10000] border-b border-white/10 pb-1"
          >
            Skip Experience
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}