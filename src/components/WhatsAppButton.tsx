import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 400px (adjust based on your Hero height)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const openWhatsApp = () => {
    const phoneNumber = "923XXXXXXXXX"; // Replace with your actual WhatsApp number
    const message = "Hello, I am interested in an asset from The Vault.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openWhatsApp}
          className="fixed bottom-10 right-10 z-[100] bg-[#25D366] text-white p-5 rounded-full shadow-2xl shadow-[#25D366]/30 flex items-center justify-center group"
          aria-label="Contact on WhatsApp"
        >
          <MessageCircle size={28} fill="currentColor" />
          
          {/* Subtle Label on Hover */}
          <span className="absolute right-full mr-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-black px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Inquire via WhatsApp
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;