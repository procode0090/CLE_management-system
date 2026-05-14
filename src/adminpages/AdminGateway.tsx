import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Box, Wrench, ArrowRight, Shield, Bell, UserCircle } from "lucide-react";
const logo = "/logo.png";
const AdminGateway = () => {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState<string | null>(null);

  // User Data
  const user = {
    name: "ADMINISTRATOR",
    role: "Admin",
  };

  const options = [
    {
      id: "inventory",
      title: "Commercial Vault",
      subtitle: "Inventory & Sales",
      description: "Manage high-precision timepieces, track global sales, and curate the archival public catalog.",
      path: "/admin/dashboard",
      color: "#008080",
      stats: "1,284 Items"
    },
    {
      id: "repairs",
      title: "Service Center",
      subtitle: "Technical Maintenance",
      description: "Log master-level horological repairs, track component status, and automate customer dossiers.",
      path: "/repair-center/repair",
      color: "#D4AF37",
      stats: "24 Active Jobs"
    }
  ];

  const handleChoice = (id: string, path: string) => {
    setIsExiting(id);
    setTimeout(() => {
      router.push(path);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden selection:bg-[#008080]/10">
      
      {/* 1. AMBIENT BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] border border-[#008080]/20 rounded-full"
        />
      </div>

      {/* 2. TOP NAV (Logo & User Info) */}
      <nav className="w-full px-12 pb-2 pt-8 flex justify-between items-center z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
            <img src={logo} alt="Clé Logo" className="w-32 h-auto" />

        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest font-black text-black">{user.name}</span>
            <span className="text-[8px] uppercase tracking-widest text-[#008080] font-black">Authorized</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
             <UserCircle size={22} className="text-gray-300" />
          </div>
        </motion.div>
      </nav>

      {/* 3. MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center pt-2 p-6 z-10">
        <div className="max-w-6xl w-full">
          <header className="text-center mb-12">
            {/* <motion.div
              animate={isExiting ? { opacity: 0, scale: 0.95 } : { opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-100 bg-gray-50/50 mb-6"
            >
              <Shield size={12} className="text-[#008080]" />
              <span className="text-[8px] uppercase tracking-[0.3em] font-black text-gray-400">Vault Security Protocol Active</span>
            </motion.div> */}
            
            <motion.h2 
              animate={isExiting ? { opacity: 0, y: -20 } : { opacity: 1 }}
              className="text-7xl font-serif tracking-tighter text-black leading-tight"
            >
              Welcome back, <br /> 
              <span className="italic font-light opacity-40 text-[#008080]">Architect of the CLE.</span>
            </motion.h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {options.map((opt) => (
              <motion.div
                key={opt.id}
                style={{ transformOrigin: "top left" }} 
                animate={isExiting === opt.id ? { 
                  rotate: [0, 15, 60, 95], 
                  y: [0, 10, 300, 1000],
                  opacity: [1, 1, 1, 0],
                  transition: { duration: 1.1, times: [0, 0.2, 0.5, 1], ease: "easeInOut" }
                } : isExiting && isExiting !== opt.id ? {
                  opacity: 0,
                  scale: 0.9,
                  filter: "blur(4px)",
                  transition: { duration: 0.4 }
                } : { opacity: 1 }}
                
                whileHover={!isExiting ? { y: -15, boxShadow: "0 40px 80px -20px rgba(0,0,0,0.08)" } : {}}
                onClick={() => !isExiting && handleChoice(opt.id, opt.path)}
                className="group relative bg-white border border-gray-100 p-12 rounded-[50px] cursor-pointer shadow-sm transition-all duration-700 overflow-hidden"
              >
                {/* Colored Icon Cap */}
                <div 
                  className="w-16 h-16 rounded-[22px] flex items-center justify-center mb-10 transition-all duration-700 group-hover:scale-110 shadow-lg"
                  style={{ backgroundColor: opt.color, color: 'white' }}
                >
                  {opt.id === 'inventory' ? <Box size={28} /> : <Wrench size={28} />}
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black">{opt.subtitle}</p>
                  <span className="text-[9px] font-mono text-gray-200 font-bold">{opt.stats}</span>
                </div>
                
                <h3 className="text-4xl font-serif text-black mb-6 tracking-tight">{opt.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-[280px] font-light italic">
                  {opt.description}
                </p>

                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black group-hover:text-black text-gray-300 transition-all">
                  <div className="h-[1px] w-8 bg-gray-200 group-hover:w-14 group-hover:bg-[#008080] transition-all duration-500" />
                  Initialize Access
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FOOTER */}
      <footer className="w-full px-12 py-8 flex justify-between items-center text-[8px] uppercase tracking-[0.6em] text-gray-300 font-black z-20">
        <p>© 2026 CLÉ MANAGEMENT INTERFACE</p>
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#008080] rounded-full animate-pulse" />
          System Status: Optimal
        </p>
      </footer>
    </div>
  );
};

export default AdminGateway;