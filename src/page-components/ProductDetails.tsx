

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { MoveRight, Loader2, Package, ArrowLeft } from "lucide-react";
import { supabase } from '../utils/supabaseClient'; // Import your client
import Footer from "../components/Footer";

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [isSold, setIsSold] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run if the 'id' is available in the URL
    if (!id) return;

    const fetchProductData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch the specific product and check if it's in the sales table
        const [productRes, saleRes] = await Promise.all([
          supabase.from('products').select('*').eq('id', id).single(),
          supabase.from('sales').select('id').eq('productid', id)
        ]);

        if (productRes.error) throw productRes.error;

        setProduct(productRes.data);
        // If there's any record in the sales table for this product ID, it's sold
        // setIsSold(saleRes.data && saleRes.data.length > 0);

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-[#006666]" size={40} />
        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">Deciphering Archive...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">Record Not Found</p>
        <button onClick={() => router.back()} className="text-xs border-b border-black pb-1">Return to Catalog</button>
      </div>
    );
  }

  // Matching your Supabase lowercase column names
  const specs = [
    { label: "Reference", value: product.reference },
    { label: "Serial", value: product.serialnumber }, // Lowercase
    { label: "Box", value: product.watchbox === "Yes" ? "Original Included" : "Not Included" }, // Lowercase
    { label: "Papers", value: product.papers === "Yes" ? "Certificate Included" : "Not Included" },
    { label: "Accessories", value: product.accessories || "Standard Set" },
  ];

  // Supabase stores URLs as strings, no need for createObjectURL
  const mainImage = product.images?.[0] || null;
  const secondaryImage = product.images?.[1] || null;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#006666]/20">
      
      {/* NAVIGATION OVERLAY */}
      <button 
        onClick={() => router.back()} 
        className="fixed top-10 left-10 z-50 flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-black transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* 1. HERO SECTION */}
      <section className="flex flex-col lg:flex-row min-h-screen border-b border-gray-100">
        <div className="w-full lg:w-1/2 bg-[#fcfcfc] flex items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-10 left-20 text-[10px] tracking-[0.8em] text-gray-300 uppercase vertical-text hidden lg:block">
            Vault Acquisition {product.serialnumber}
          </div>
          
          {mainImage ? (
            <motion.img 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              src={mainImage} 
              className={`w-full max-w-xl object-contain drop-shadow-2xl ${isSold ? 'grayscale-[0.4]' : ''}`}
              alt={product.model}
            />
          ) : (
            <Package size={120} className="text-gray-100" />
          )}

          {isSold && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] border-4 border-[#006666] text-[#006666] px-10 py-4 font-black text-4xl uppercase tracking-[0.2em] opacity-30 pointer-events-none">
              Archived
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-20 lg:p-32 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <p className="text-[#006666] text-[10px] uppercase tracking-[0.5em] font-black mb-4">{product.brandname}</p>
            <h1 className="text-7xl font-serif tracking-tighter mb-4">{product.model}</h1>
            <p className="text-black font-bold text-2xl mb-8 font-mono">
              ${parseFloat(product.price).toLocaleString()}
            </p>
            
            <div className="w-20 h-[2px] bg-[#006666] mb-10" />
            
            <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-md font-light">
              {product.description || "Technical specifications are verified and archived in the secure vault."}
            </p>

            <div className="flex flex-col gap-4">
              <button 
                disabled={isSold}
                className={`px-12 py-6 flex items-center justify-between group transition-all duration-500 ${
                  isSold ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-[#006666]'
                }`}
              >
                <span className="uppercase tracking-[0.3em] text-[11px] font-black">
                  {isSold ? "Asset Sold Out" : "Enquire About Asset"}
                </span>
                {!isSold && <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TECHNICAL SHOWCASE SECTION */}
      <section className="py-32 px-8 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-4xl font-serif mb-12 tracking-tight">Verified Technical Dossier</h2>
            <p className="text-gray-400 text-sm mb-16 tracking-widest uppercase font-bold">Authentication meets logistical precision.</p>
            
            <div className="space-y-8">
              {specs.map((spec, i) => (
                <div key={i} className="flex justify-between border-b border-gray-100 pb-4">
                  <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">{spec.label}</span>
                  <span className="text-sm font-medium">{spec.value || "---"}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t border-l border-[#006666]/30 hidden lg:block" />
            <div className="rounded-3xl w-full aspect-square bg-[#fafafa] flex items-center justify-center overflow-hidden border border-gray-50 shadow-2xl">
              <img 
                src={secondaryImage || mainImage} 
                className="w-full h-full object-cover transition-all duration-1000" 
                alt="Detail Perspective" 
              />
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mt-6 text-right font-bold">
              Archive Perspective // Detail Extraction
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default ProductDetails;