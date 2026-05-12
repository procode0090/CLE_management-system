// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import { getAllProducts } from '../utils/db';

// // --- INTERNAL SUB-COMPONENT: PRODUCT CARD ---
// const ProductCard = ({ name, price, image, isSold }: any) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div 
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className="relative w-full h-[400px] bg-white rounded-[24px] overflow-hidden cursor-pointer transition-all duration-500 shadow-sm"
//     >
//       {/* SOLD OUT TAG */}
//       {isSold && (
//         <div className="absolute top-6 left-6 z-20">
//           <motion.div 
//             initial={{ opacity: 0, x: -10 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="bg-[#006666] text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-lg backdrop-blur-md"
//           >
//             Sold Out
//           </motion.div>
//         </div>
//       )}

//       {/* 1. Full Div Image */}
//       <motion.div className="w-full h-full">
//         <motion.img
//           src={image}
//           alt={name}
//           animate={{ scale: isHovered ? 1.05 : 1 }}
//           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//           className={`w-full h-full object-cover ${isSold ? 'grayscale-[0.5]' : ''}`}
//           onError={(e) => {
//             (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop";
//           }}
//         />
//       </motion.div>
      
//       {/* 2. Blackish Overlay on Hover */}
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: isHovered ? 1 : 0 }}
//         className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-500"
//       />

//       {/* 3. Bottom Aligned Title & Price */}
//       <AnimatePresence>
//         {isHovered && (
//           <motion.div 
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 15 }}
//             className="absolute inset-x-0 bottom-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"
//           >
//             <motion.h3 
//               initial={{ y: 10, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.1 }}
//               className="text-white font-serif text-3xl tracking-tight"
//             >
//               {name}
//             </motion.h3>
            
//             <motion.p 
//               initial={{ y: 10, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-[#D4AF37] text-[12px] font-bold uppercase tracking-[0.4em] mt-3"
//             >
//               {price}
//             </motion.p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // --- MAIN COMPONENT: PRODUCT CATALOG ---
// const ProductCatalog = () => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // useEffect(() => {
//   //   const loadVault = async () => {
//   //     try {
//   //       const [inventory, sales] = await Promise.all([
//   //         getAllProducts(),
//   //         getAllSales()
//   //       ]);

//   //       // Map sales for quick lookup
//   //       const soldIds = new Set(sales.map(s => s.productId.toString()));

//   //       // Merge and determine status
//   //       const catalogData = inventory.map(item => ({
//   //         id: item.id,
//   //         name: `${item.brandName} ${item.model}`,
//   //         price: item.price ? `$${parseFloat(item.price).toLocaleString()}` : "Price on Request",
//   //         image: item.images?.[0] || null,
//   //         isSold: soldIds.has(item.id.toString())
//   //       }));

//   //       setProducts(catalogData.reverse()); // Show newest additions first
//   //     } catch (error) {
//   //       console.error("Vault loading error:", error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   loadVault();
//   // }, []);

//   useEffect(() => {
//   const loadVault = async () => {
//     try {
//       const inventory = await getAllProducts();

//       const catalogData = inventory.map(item => ({
//         id: item.id,
//         name: `${item.brandName} ${item.model}`,
//         price: item.price
//           ? `$${parseFloat(item.price).toLocaleString()}`
//           : "Price on Request",
//         image:
//           item.images?.[0] ||
//           "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop",
//         isSold: false
//       }));

//       setProducts(catalogData.reverse());
//     } catch (error) {
//       console.error("Vault loading error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   loadVault();
// }, []);

//   return (
//     <div className="min-h-screen bg-white py-24 px-6 ">
//       <header className="max-w-[1400px] mx-auto mb-20 text-center md:text-left">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <h2 className="text-6xl md:text-7xl font-serif text-black tracking-tighter">The Vault</h2>
//           <p className="text-gray-400 text-[10px] uppercase tracking-[0.8em] mt-6 ml-1">Total Collection Archive</p>
//         </motion.div>
//       </header>

//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//            <p className="text-[10px] uppercase tracking-widest text-gray-400 animate-pulse">Unlocking Vault...</p>
//         </div>
//       ) : (
//         <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-3">
//           {products.map((product, idx) => (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.05 }}
//               key={product.id}
//             >
//               <Link href={`/product/${product.id}`} className="block">
//                 <ProductCard {...product} />
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {products.length === 0 && !isLoading && (
//         <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-[40px]">
//           <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em]">The Vault is Empty</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductCatalog;







import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from '../utils/supabaseClient'; // Direct supabase client

// --- INTERNAL SUB-COMPONENT: PRODUCT CARD ---
const ProductCard = ({ name, price, image, isSold }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[450px] bg-white rounded-[32px] overflow-hidden cursor-pointer transition-all duration-700 shadow-sm border border-gray-50"
    >
      {/* SOLD OUT TAG */}
      {isSold && (
        <div className="absolute top-6 left-6 z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 text-white text-[9px] font-black uppercase tracking-[0.4em] px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-white/10"
          >
            Sold
          </motion.div>
        </div>
      )}

      {/* 1. Image Layer */}
      <motion.div className="w-full h-full">
        <motion.img
          src={image}
          alt={name}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full h-full object-cover transition-all duration-1000 ${isSold ? 'grayscale' : ''}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop";
          }}
        />
      </motion.div>
      
      {/* 2. Hover Gradient Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-opacity duration-500"
      />

      {/* 3. Bottom Text Layer */}
      <div className="absolute inset-x-0 bottom-0 p-10 z-10">
         <motion.div
           animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.9 }}
           transition={{ duration: 0.4 }}
         >
            <h3 className={`font-serif text-3xl tracking-tight transition-colors duration-500 ${isHovered ? 'text-white' : 'text-transparent'}`}>
              {name}
            </h3>
            <p className={`text-[11px] font-bold uppercase tracking-[0.4em] mt-3 transition-colors duration-500 ${isHovered ? 'text-[#D4AF37]' : 'text-transparent'}`}>
              {price}
            </p>
         </motion.div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: PRODUCT CATALOG ---
const ProductCatalog = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVault = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch both tables from Supabase
        const [inventoryRes, salesRes] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('sales').select('productid') // Only need IDs to check sold status
        ]);

        if (inventoryRes.error) throw inventoryRes.error;
        const inventory = inventoryRes.data || [];
        
        // 2. Map sold IDs for quick lookup
        const soldIds = new Set(salesRes.data?.map(s => s.productid?.toString()));

        // 3. Format the data for the UI
        const catalogData = inventory.map(item => ({
          id: item.id,
          // Combining brand and model for the display name
          name: `${item.brandname || ''} ${item.model || ''}`, 
          price: item.price 
            ? `$${parseFloat(item.price).toLocaleString()}` 
            : "Price on Request",
          // Use the first image from the array stored in Supabase
          image: item.images?.[0] || "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop",
          isSold: soldIds.has(item.id.toString())
        }));

        // 4. Sort: Show available items first, then newest additions
        const sortedData = catalogData.sort((a, b) => {
          if (a.isSold === b.isSold) return b.id - a.id; 
          return a.isSold ? 1 : -1;
        });

        setProducts(sortedData);
      } catch (error) {
        console.error("Vault loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVault();
  }, []);

  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <header className="max-w-[1400px] mx-auto mb-24 text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-7xl md:text-8xl font-serif text-black tracking-tighter">The Vault</h2>
          <p className="text-gray-400 text-[10px] uppercase tracking-[1em] mt-8 block">Curated Collection Archive</p>
        </motion.div>
      </header>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-96 gap-4">
           <div className="w-12 h-[1px] bg-gray-200 animate-pulse" />
           <p className="text-[9px] uppercase tracking-[0.5em] text-gray-400">Inventory Syncing</p>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.8 }}
              key={product.id}
            >
              <Link href={`/product/${product.id}`} className="block">
                <ProductCard {...product} />
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-40 border-t border-gray-100">
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em]">Collection empty</p>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;