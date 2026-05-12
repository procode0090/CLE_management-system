

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { motion } from "framer-motion";
// import { MoveRight, Loader2, Package, ArrowLeft } from "lucide-react";
// import { supabase } from '../utils/supabaseClient'; // Import your client
// import Footer from "../components/Footer";

// const ProductDetails = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [product, setProduct] = useState<any>(null);
//   const [isSold, setIsSold] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Only run if the 'id' is available in the URL
//     if (!id) return;

//     const fetchProductData = async () => {
//       try {
//         setIsLoading(true);

//         // 1. Fetch the specific product and check if it's in the sales table
//         const [productRes, saleRes] = await Promise.all([
//           supabase.from('products').select('*').eq('id', id).single(),
//           supabase.from('sales').select('id').eq('productid', id)
//         ]);

//         if (productRes.error) throw productRes.error;

//         setProduct(productRes.data);
//         // If there's any record in the sales table for this product ID, it's sold
//         // setIsSold(saleRes.data && saleRes.data.length > 0);

//       } catch (error) {
//         console.error("Vault retrieval error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProductData();
//   }, [id]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
//         <Loader2 className="animate-spin text-[#006666]" size={40} />
//         <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">Deciphering Archive...</p>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
//         <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">Record Not Found</p>
//         <button onClick={() => router.back()} className="text-xs border-b border-black pb-1">Return to Catalog</button>
//       </div>
//     );
//   }

//   // Matching your Supabase lowercase column names
//   const specs = [
//     { label: "Reference", value: product.reference },
//     { label: "Serial", value: product.serialnumber }, // Lowercase
//     { label: "Box", value: product.watchbox === "Yes" ? "Original Included" : "Not Included" }, // Lowercase
//     { label: "Papers", value: product.papers === "Yes" ? "Certificate Included" : "Not Included" },
//     { label: "Accessories", value: product.accessories || "Standard Set" },
//   ];

//   // Supabase stores URLs as strings, no need for createObjectURL
//   const mainImage = product.images?.[0] || null;
//   const secondaryImage = product.images?.[1] || null;

//   return (
//     <div className="min-h-screen bg-white text-black selection:bg-[#006666]/20">
      
//       {/* NAVIGATION OVERLAY */}
//       <button 
//         onClick={() => router.back()} 
//         className="fixed top-10 left-10 z-50 flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-black transition-colors"
//       >
//         <ArrowLeft size={14} /> Back
//       </button>

//       {/* 1. HERO SECTION */}
//       <section className="flex flex-col lg:flex-row min-h-screen border-b border-gray-100">
//         <div className="w-full lg:w-1/2 bg-[#fcfcfc] flex items-center justify-center p-12 relative overflow-hidden">
//           <div className="absolute top-10 left-20 text-[10px] tracking-[0.8em] text-gray-300 uppercase vertical-text hidden lg:block">
//             Vault Acquisition {product.serialnumber}
//           </div>
          
//           {mainImage ? (
//             <motion.img 
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
//               src={mainImage} 
//               className={`w-full max-w-xl object-contain drop-shadow-2xl ${isSold ? 'grayscale-[0.4]' : ''}`}
//               alt={product.model}
//             />
//           ) : (
//             <Package size={120} className="text-gray-100" />
//           )}

//           {isSold && (
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] border-4 border-[#006666] text-[#006666] px-10 py-4 font-black text-4xl uppercase tracking-[0.2em] opacity-30 pointer-events-none">
//               Archived
//             </div>
//           )}
//         </div>

//         <div className="w-full lg:w-1/2 p-8 md:p-20 lg:p-32 flex flex-col justify-center">
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
//             <p className="text-[#006666] text-[10px] uppercase tracking-[0.5em] font-black mb-4">{product.brandname}</p>
//             <h1 className="text-7xl font-serif tracking-tighter mb-4">{product.model}</h1>
//             <p className="text-black font-bold text-2xl mb-8 font-mono">
//               ${parseFloat(product.price).toLocaleString()}
//             </p>
            
//             <div className="w-20 h-[2px] bg-[#006666] mb-10" />
            
//             <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-md font-light">
//               {product.description || "Technical specifications are verified and archived in the secure vault."}
//             </p>

//             <div className="flex flex-col gap-4">
//               <button 
//                 disabled={isSold}
//                 className={`px-12 py-6 flex items-center justify-between group transition-all duration-500 ${
//                   isSold ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-[#006666]'
//                 }`}
//               >
//                 <span className="uppercase tracking-[0.3em] text-[11px] font-black">
//                   {isSold ? "Asset Sold Out" : "Enquire About Asset"}
//                 </span>
//                 {!isSold && <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* 2. TECHNICAL SHOWCASE SECTION */}
//       <section className="py-32 px-8 md:px-20 max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
//           <div>
//             <h2 className="text-4xl font-serif mb-12 tracking-tight">Verified Technical Dossier</h2>
//             <p className="text-gray-400 text-sm mb-16 tracking-widest uppercase font-bold">Authentication meets logistical precision.</p>
            
//             <div className="space-y-8">
//               {specs.map((spec, i) => (
//                 <div key={i} className="flex justify-between border-b border-gray-100 pb-4">
//                   <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">{spec.label}</span>
//                   <span className="text-sm font-medium">{spec.value || "---"}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div className="relative">
//             <div className="absolute -top-10 -left-10 w-40 h-40 border-t border-l border-[#006666]/30 hidden lg:block" />
//             <div className="rounded-3xl w-full aspect-square bg-[#fafafa] flex items-center justify-center overflow-hidden border border-gray-50 shadow-2xl">
//               <img 
//                 src={secondaryImage || mainImage} 
//                 className="w-full h-full object-cover transition-all duration-1000" 
//                 alt="Detail Perspective" 
//               />
//             </div>
//             <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mt-6 text-right font-bold">
//               Archive Perspective // Detail Extraction
//             </p>
//           </div>
//         </div>
//       </section>

//       <style jsx>{`
//         .vertical-text {
//           writing-mode: vertical-rl;
//           text-orientation: mixed;
//         }
//       `}</style>
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetails;




import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  MoveRight, Loader2, Package, ArrowLeft, 
  ShieldCheck, Sparkles, Box, Maximize2 
} from "lucide-react";
import { supabase } from '../utils/supabaseClient';
import Footer from "../components/Footer";

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [isSold, setIsSold] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll Parallax for Hero
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, -80]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    if (!id) return;
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const [productRes, saleRes] = await Promise.all([
          supabase.from('products').select('*').eq('id', id).single(),
          supabase.from('sales').select('id').eq('productid', id)
        ]);

        if (productRes.error) throw productRes.error;
        setProduct(productRes.data);
        setIsSold(saleRes.data && saleRes.data.length > 0);
      } catch (error) {
        console.error("Vault retrieval error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="text-[#006666]" size={40} />
        </motion.div>
        <p className="text-[10px] uppercase tracking-[1em] text-gray-300 font-black animate-pulse pl-4">
          Accessing Secure Archive
        </p>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];
  const hasImages = images.length > 0;
  const heroImage = hasImages ? images[0] : null;

  const specs = [
    { label: "Reference", value: product.reference },
    { label: "Serial", value: product.serialnumber },
    { label: "Box", value: product.watchbox === "Yes" ? "Original Present" : "None" },
    { label: "Papers", value: product.papers === "Yes" ? "Authenticated" : "None" },
    { label: "Date Added", value: product.receiveddate },
    { label: "Storage Status", value: isSold ? "Archived/Sold" : "In Vault" },
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#006666]/20 overflow-x-hidden">
      
      {/* 0. NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center mix-blend-difference pointer-events-none">
        <button 
          onClick={() => router.back()} 
          className="pointer-events-auto flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-black text-white hover:text-[#006666] transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
          Back to Catalog
        </button>
        <div className="text-white text-[9px] uppercase tracking-[0.6em] font-bold opacity-40 hidden md:block">
          REF_{product?.id?.toString().padStart(4, '0')} // ARCHIVE UNIT
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col lg:flex-row min-h-screen border-b border-gray-50">
        <div className="w-full lg:w-7/12 bg-[#FBFBFB] flex items-center justify-center p-12 relative overflow-hidden h-[80vh] lg:h-auto">
          <motion.div style={{ y: yHero, opacity: opacityHero }} className="relative z-10 w-full flex justify-center">
            {heroImage ? (
              <motion.img 
                initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                src={heroImage} 
                className={`w-full max-w-2xl object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.12)] ${isSold ? 'grayscale' : ''}`}
                alt={product.model}
              />
            ) : (
              <Package size={160} className="text-gray-100 animate-pulse" />
            )}
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <h2 className="text-[22vw] font-serif font-black text-black/[0.02] leading-none">
              {product.brandname}
            </h2>
          </div>
        </div>

        <div className="w-full lg:w-5/12 p-10 md:p-24 flex flex-col justify-center bg-white border-l border-gray-50">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-[1px] bg-[#006666]" />
               <p className="text-[#006666] text-[11px] uppercase tracking-[0.7em] font-black">{product.brandname}</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-8 leading-[0.9]">
              {product.model}
            </h1>
            <p className="text-4xl font-mono tracking-tighter mb-12 font-bold">
              ${parseFloat(product.price).toLocaleString()}
            </p>
            <div className="space-y-6 mb-16">
              <p className="text-gray-400 text-[11px] uppercase tracking-[0.3em] font-bold">Verification Note</p>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm font-light italic border-l-2 border-[#006666]/20 pl-6">
                "{product.description || "Archived technical specifications verified by our master horologists."}"
              </p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSold}
              className={`w-full py-8 rounded-none flex items-center justify-between px-10 group relative overflow-hidden transition-all duration-700 ${
                isSold ? 'bg-gray-100 text-gray-400' : 'bg-black text-white'
              }`}
            >
              <span className="relative z-10 uppercase tracking-[0.5em] text-[11px] font-black">
                {isSold ? "Asset Withdrawn" : "Inquire for Purchase"}
              </span>
              {!isSold && <MoveRight className="relative z-10 group-hover:translate-x-3 transition-transform duration-500" />}
              <div className="absolute inset-0 bg-[#006666] translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-out" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 2. DYNAMIC GALLERY & TECHNICAL DATA */}
      <section className="py-40 px-6 md:px-20 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[450px,1fr] gap-24 items-start">
          
          {/* STICKY SPECS */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="lg:sticky lg:top-40"
          >
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="text-[#006666]" size={20} />
              <h3 className="text-[10px] uppercase tracking-[0.5em] font-black">Technical Dossier</h3>
            </div>
            <h2 className="text-5xl font-serif mb-12 tracking-tight">Full Archive <br/>Details</h2>
            <div className="space-y-8">
              {specs.map((spec, i) => (
                <div key={i} className="flex justify-between border-b border-gray-100 pb-5 group hover:border-black transition-colors duration-500">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 group-hover:text-[#006666]">{spec.label}</span>
                  <span className="text-[13px] font-medium tracking-tight uppercase">{spec.value || "---"}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* DYNAMIC IMAGE GRID (MASONRY STYLE) */}
          <div className="space-y-6">
            {hasImages ? (
              <div className="columns-1 md:columns-2 gap-6 space-y-6">
                {images.map((img: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="relative group rounded-3xl overflow-hidden bg-[#F9F9F9] border border-gray-100"
                  >
                    <img 
                      src={img} 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000" 
                      alt={`Archival View ${idx}`} 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Maximize2 className="text-white" size={32} />
                    </div>
                    <div className="absolute top-6 left-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="bg-white/90 backdrop-blur text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                         View Angle_{idx + 1}
                       </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-[600px] bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                 <Box size={48} className="text-gray-200 mb-6" />
                 <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">No imagery in archive</p>
              </div>
            )}
            <div className="flex justify-between items-center pt-10 border-t border-gray-100">
               <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-300">Vault Acquisition Catalog // Visual Data 0.1</p>
               <Sparkles className="text-[#006666]" size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOGO MARQUEE */}
      <div className="py-24 border-y border-gray-50 overflow-hidden bg-white">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="text-[14vh] font-serif font-black text-black/[0.015] uppercase flex gap-20 whitespace-nowrap"
        >
          <span>{product.brandname} {product.model} </span>
          <span>{product.brandname} {product.model} </span>
          <span>{product.brandname} {product.model} </span>
        </motion.div>
      </div>

      <Footer />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');
        :global(.font-serif) { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
};

export default ProductDetails;