



import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const logo = "/logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If scroll is more than 20px, apply the background
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 flex justify-center items-center gap-x-[800px] md:px-24 py-5 transition-all duration-500 ${
        isScrolled 
          ? "backdrop-blur-md bg-white/80 border-b border-gray-100 py-4" 
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      {/* LOGO */}
      <div className="flex items-center">
        <img 
          src={logo} 
          alt="CLE Luxury Logo" 
          className={`w-32 h-16 transition-all duration-500 ${isScrolled ? "scale-90" : "scale-100"}`} 
        />
      </div>
      
      {/* NAV LINKS */}
      <ul className={`hidden md:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${
        isScrolled ? "text-gray-600" : "text-white"
      }`}>
        <li className="hover:text-[#006666] cursor-pointer text-[15px] transition-colors">Collections</li>
        <li className="hover:text-[#006666] cursor-pointer text-[15px] transition-colors">Craftsmanship</li>
        <li className="hover:text-[#006666] cursor-pointer text-[15px] transition-colors">Heritage</li>
      </ul>

     
    </motion.nav>
  );
};

export default Navbar;