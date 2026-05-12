// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Search, Edit3, MoreVertical, Box, ImageOff, Loader2 } from "lucide-react";
// import { getAllProducts } from '../utils/db';

// const Inventory = () => {
//   const [search, setSearch] = useState("");
//   const [inventoryItems, setInventoryItems] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // --- CORE LOGIC: FETCH & FILTER UNSOLD ITEMS ---
//   // const loadInventory = async () => {
//   //   setIsLoading(true);
//   //   try {
//   //     const [allItems, allSales] = await Promise.all([
//   //       getAllProducts(),
//   //       getAllSales()
//   //     ]);

//   //     // Identify IDs of items already sold
//   //     const soldIds = allSales.map(sale => sale.productId.toString());

//   //     // Filter: Only keep items that are NOT in the sold list
//   //     const inStockItems = allItems.filter(
//   //       item => !soldIds.includes(item.id.toString())
//   //     );

//   //     // Show newest first
//   //     setInventoryItems(inStockItems.reverse());
//   //   } catch (error) {
//   //     console.error("Failed to load inventory:", error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   const loadInventory = async () => {
//   setIsLoading(true);

//   try {
//     const allItems = await getAllProducts();

//     // Show newest first
//     setInventoryItems(allItems.reverse());

//   } catch (error) {
//     console.error("Failed to load inventory:", error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   useEffect(() => {
//     loadInventory();
//   }, []);

//   // SAFE FILTERING: Default to empty string if a property is undefined
//   const filteredItems = inventoryItems.filter(item => 
//     (item.brandName || "").toLowerCase().includes(search.toLowerCase()) ||
//     (item.model || "").toLowerCase().includes(search.toLowerCase()) ||
//     (item.reference || "").toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }} 
//       animate={{ opacity: 1 }} 
//       className="max-w-350 mx-auto px-6 pb-20"
//     >
//       <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
//         <div>
//           <h2 className="text-5xl font-serif tracking-tighter text-black">Inventory</h2>
//           <p className="text-gray-400 text-[10px] mt-4 tracking-[0.6em] uppercase font-bold">Available Stock & Vault</p>
//         </div>

//         <div className="flex gap-4 w-full md:w-auto">
//           <div className="relative flex-1 md:w-80">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search available assets..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-12 pr-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm shadow-inner"
//             />
//           </div>
//           <button 
//             onClick={loadInventory}
//             className="p-4 bg-[#fafafa] rounded-2xl text-gray-400 hover:text-[#008080] transition-all border border-gray-50"
//           >
//             <Loader2 className={isLoading ? "animate-spin" : ""} size={20} />
//           </button>
//         </div>
//       </header>

//       {isLoading ? (
//         <div className="flex flex-col justify-center items-center h-64 gap-4">
//            <Loader2 className="animate-spin text-[#008080]" size={32} />
//            <p className="text-[10px] uppercase tracking-widest text-gray-400">Scanning Vault...</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredItems.map((item, idx) => (
//             <motion.div 
//               key={item.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: idx * 0.05 }}
//               className="group bg-white border border-gray-100 rounded-4xl p-6 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500"
//             >
//               {/* Product Image Section */}
//               <div className="relative h-72 bg-[#fcfcfc] rounded-4xl mb-6 overflow-hidden flex items-center justify-center border border-gray-50">
//                 {item.images && item.images.length > 0 ? (
//                   <img 
//                     src={URL.createObjectURL(item.images[0])} 
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
//                     alt={item.model} 
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center gap-2 text-gray-200">
//                     <ImageOff size={40} />
//                     <span className="text-[8px] uppercase tracking-[0.3em]">No Visual Data</span>
//                   </div>
//                 )}
                
//                 <div className="absolute top-4 right-4">
//                   <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-black shadow-sm border border-gray-100">
//                     SN: {item.serialNumber}
//                   </span>
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="flex justify-between items-start mb-4 px-2">
//                 <div>
//                   <p className="text-[10px] text-[#008080] font-bold uppercase tracking-widest mb-1">
//                     {item.brandName || "Unknown Brand"} — {item.reference || "N/A"}
//                   </p>
//                   <h3 className="text-xl font-serif text-black">{item.model || "Unknown Model"}</h3>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-mono font-bold text-lg text-black">
//                     ${item.price || "0.00"}
//                   </p>
//                   <p className="text-[8px] text-gray-400 uppercase tracking-tighter">Market Value</p>
//                 </div>
//               </div>

//               {/* Footer / Actions */}
//               <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50 px-2">
//                 <div className="flex items-center gap-2">
//                   <Box size={14} className="text-gray-400" />
//                   <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
//                     {item.watchBox === 'Yes' ? 'Box' : 'No Box'} 
//                     <span className="text-gray-200 mx-2">|</span>
//                     {item.papers === 'Yes' ? 'Papers' : 'No Papers'}
//                   </span>
//                 </div>
                
//                 <div className="flex gap-2">
//                   <button className="p-3 bg-[#fafafa] rounded-xl text-gray-400 hover:text-[#008080] hover:bg-[#008080]/5 transition-all">
//                     <Edit3 size={16} />
//                   </button>
//                   <button className="p-3 bg-[#fafafa] rounded-xl text-gray-400 hover:text-black transition-all">
//                     <MoreVertical size={16} />
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {filteredItems.length === 0 && !isLoading && (
//         <div className="text-center py-20 border-2 border-dashed border-gray-50 rounded-[40px]">
//           <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em]">No Available Assets in Stock</p>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default Inventory;


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit3, MoreVertical, Box, ImageOff, Loader2 } from "lucide-react";
import { supabase } from '../utils/supabaseClient'; 

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setInventoryItems(data || []);
    } catch (error) {
      console.error("Vault Access Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredItems = inventoryItems.filter(item => 
    (item.brandname || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.model || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.serialnumber || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.reference || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto px-6 pb-20"
    >
      <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-serif tracking-tighter text-black">Inventory</h2>
          <p className="text-gray-400 text-[10px] mt-4 tracking-[0.6em] uppercase font-bold">Secure Asset Archiving</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm shadow-inner"
            />
          </div>
          <button 
            onClick={loadInventory}
            className="p-4 bg-[#fafafa] rounded-2xl text-gray-400 hover:text-[#008080] transition-all border border-gray-50"
          >
            <Loader2 className={isLoading ? "animate-spin" : ""} size={20} />
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
           <Loader2 className="animate-spin text-[#008080]" size={32} />
           <p className="text-[10px] uppercase tracking-widest text-gray-400">Syncing Vault...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white border border-gray-100 rounded-[40px] p-6 hover:shadow-xl transition-all duration-500"
            >
              <div className="relative h-72 bg-[#fafafa] rounded-[32px] mb-6 overflow-hidden flex items-center justify-center border border-gray-50">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.model} />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-200">
                    <ImageOff size={40} />
                    <span className="text-[8px] uppercase tracking-[0.3em]">No Imagery</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[7px] font-bold uppercase tracking-widest text-white">
                    {item.receiveddate}
                  </span>
                </div>
              </div>

              <div className="space-y-1 px-2">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] text-[#008080] font-black uppercase tracking-[0.2em]">{item.brandname}</p>
                  <p className="font-mono font-bold text-lg text-black">${Number(item.price).toLocaleString()}</p>
                </div>
                <h3 className="text-2xl font-serif text-black leading-tight">{item.model}</h3>
                <p className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">Ref: {item.reference} / SN: {item.serialnumber}</p>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50 px-2">
                <span className="text-[10px] font-black text-gray-800 uppercase">
                  {item.watchbox === 'Yes' ? 'Box' : 'No Box'} • {item.papers === 'Yes' ? 'Papers' : 'No Papers'}
                </span>
                <div className="flex gap-2">
                  <button className="p-3 bg-[#fafafa] rounded-xl text-gray-400 hover:text-[#008080] transition-all"><Edit3 size={16} /></button>
                  <button className="p-3 bg-[#fafafa] rounded-xl text-gray-400 hover:text-black transition-all"><MoreVertical size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Inventory;