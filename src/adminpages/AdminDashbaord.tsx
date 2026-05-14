
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { TrendingUp, Users, Box, Loader2, Package } from "lucide-react";
// import StatCard from "../admincomponents/StatCard";
// import { supabase } from '../utils/supabaseClient'; // Ensure this path is correct

// const AdminDashboard = () => {
//   const [metrics, setMetrics] = useState({
//     monthlyRevenue: 0,
//     stockCount: 0,
//     uniqueClients: 0
//   });
//   const [recentSales, setRecentSales] = useState<any[]>([]);
//   const [inventoryMap, setInventoryMap] = useState<Record<string, any>>({});
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true);

//         // 1. Fetch Sales and Products in parallel from Supabase
//         const [salesResponse, productsResponse] = await Promise.all([
//           supabase.from('sales').select('*').order('date', { ascending: false }),
//           supabase.from('products').select('*')
//         ]);

//         if (salesResponse.error) throw salesResponse.error;
//         if (productsResponse.error) throw productsResponse.error;

//         const allSales = salesResponse.data || [];
//         const allInventory = productsResponse.data || [];

//         // 2. Create a map for quick lookups of product details (Images/Model names)
//         const invMap = allInventory.reduce((acc, item) => {
//           acc[item.id.toString()] = item;
//           return acc;
//         }, {});
//         setInventoryMap(invMap);

//         // 3. Calculate Monthly Revenue (Current Month)
//         const now = new Date();
//         const currentMonth = now.getMonth();
//         const currentYear = now.getFullYear();
        
//         const thisMonthRevenue = allSales.reduce((acc, sale) => {
//           const saleDate = new Date(sale.date);
//           if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
//             return acc + (parseFloat(sale.price) || 0);
//           }
//           return acc;
//         }, 0);

//         // 4. Count Unique Clients (Based on buyeremail from your sales table)
//         const uniqueEmails = new Set(
//           allSales
//             .map(sale => sale.buyeremail?.toLowerCase().trim())
//             .filter(email => email) // Remove undefined/nulls
//         );
        
//         // 5. Calculate Items in Stock (Total Products - Sold Products)
//         // We assume a product is "Sold" if its ID exists in the sales table
//         const soldProductIds = new Set(allSales.map(s => s.productid?.toString()));
//         const availableStock = allInventory.filter(item => !soldProductIds.has(item.id.toString())).length;

//         setMetrics({
//           monthlyRevenue: thisMonthRevenue,
//           stockCount: availableStock,
//           uniqueClients: uniqueEmails.size
//         });

//         // 6. Set Recent Sales (Top 5 newest)
//         setRecentSales(allSales.slice(0, 5));

//       } catch (error) {
//         console.error("Dashboard Fetch Error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 gap-4">
//         <Loader2 className="animate-spin text-[#008080]" size={32} />
//         <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Syncing Ledger...</p>
//       </div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-6xl mx-auto px-6 pb-20"
//     >
//       {/* Header */}
//       <div className="mb-16">
//         <h2 className="text-5xl font-serif tracking-tighter text-black">Performance</h2>
//         <p className="text-gray-400 text-[10px] mt-4 tracking-[0.6em] uppercase font-bold">Real-time metrics & archival data</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//         <StatCard 
//           title="Monthly Revenue" 
//           value={`$${metrics.monthlyRevenue.toLocaleString()}`} 
//           icon={TrendingUp} 
//           trend="Current Month" 
//         />
//         <StatCard 
//           title="Items in Stock" 
//           value={metrics.stockCount.toString()} 
//           icon={Box} 
//           trend="Available" 
//         />
//         <StatCard 
//           title="Total Clients" 
//           value={metrics.uniqueClients.toString()} 
//           icon={Users} 
//           trend="Unique Buyers" 
//         />
//       </div>

//       {/* Recent Sales List */}
//       <div className="bg-[#fafafa] rounded-[40px] p-12 border border-gray-100 shadow-inner">
//         <div className="flex justify-between items-center mb-10">
//           <h3 className="font-serif text-2xl tracking-tight">Recent Transactions</h3>
//           <button className="text-[#008080] text-[10px] uppercase tracking-[0.3em] font-black border-b-2 border-[#008080] pb-1 transition-all hover:shadow-sm">
//             View Full Archives
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           {recentSales.length > 0 ? recentSales.map((sale) => {
//             // Match the sale to its product details using the map
//             const product = inventoryMap[sale.productid];
//             return (
//               <motion.div 
//                 key={sale.id} 
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-50 transition-all hover:shadow-md"
//               >
//                 <div className="flex items-center gap-6">
//                   <div className="w-14 h-14 bg-[#fafafa] rounded-2xl p-1 overflow-hidden flex items-center justify-center border border-gray-50">
//                     {product?.images?.[0] ? (
//                       <img 
//                         src={product.images[0]} 
//                         className="w-full h-full object-cover rounded-lg" 
//                         alt="watch" 
//                       />
//                     ) : (
//                       <Package size={20} className="text-gray-200" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-serif text-lg text-black leading-none">
//                       {product?.model || "Unknown Model"}
//                     </p>
//                     <p className="text-gray-400 text-[9px] uppercase tracking-widest mt-2">
//                       Buyer: {sale.buyername || 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-mono font-bold text-[#008080] text-lg">
//                     ${parseFloat(sale.price).toLocaleString()}
//                   </p>
//                   <p className="text-[8px] text-gray-300 uppercase tracking-tighter">
//                     {new Date(sale.date).toLocaleDateString()}
//                   </p>
//                 </div>
//               </motion.div>
//             );
//           }) : (
//             <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
//                <p className="text-[10px] uppercase tracking-widest text-gray-300">No transactions recorded yet</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, Users, Box, Loader2, Package, 
  History, ShieldCheck, Download, Activity, BarChart3, Settings
} from "lucide-react";
import StatCard from "../admincomponents/StatCard";
import { supabase } from '../utils/supabaseClient';
import DemoTimer from "../admincomponents/DemoTimer";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ monthlyRevenue: 0, stockCount: 0, uniqueClients: 0 });
  const [allSales, setAllSales] = useState<any[]>([]);
  const [allInventory, setAllInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [salesRes, productsRes] = await Promise.all([
        supabase.from('sales').select('*').order('date', { ascending: false }),
        supabase.from('products').select('*')
      ]);

      const sales = salesRes.data || [];
      const products = productsRes.data || [];

      setAllSales(sales);
      setAllInventory(products);

      const soldIds = new Set(sales.map(s => s.productid?.toString()));
      const available = products.filter(item => !soldIds.has(item.id.toString()));

      const now = new Date();
      const rev = sales.reduce((acc, s) => {
        const d = new Date(s.date);
        return (d.getMonth() === now.getMonth()) ? acc + (parseFloat(s.price) || 0) : acc;
      }, 0);

      setMetrics({
        monthlyRevenue: rev,
        stockCount: available.length,
        uniqueClients: new Set(sales.map(s => s.buyeremail)).size
      });
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  // --- BRAND DATA: FIXED FOR VISUAL HEIGHT ---
  const brandStockData = useMemo(() => {
    const counts: Record<string, number> = {};
    const soldIds = new Set(allSales.map(s => s.productid?.toString()));
    const inStockItems = allInventory.filter(item => !soldIds.has(item.id.toString()));

    if (inStockItems.length === 0) return [];

    inStockItems.forEach(p => {
      const bName = (p.brandname || "UNKNOWN").toUpperCase();
      counts[bName] = (counts[bName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [allInventory, allSales]);

  // --- DISPLAY LOGIC FOR LEDGER ---
  const displayItems = useMemo(() => {
    const soldIds = new Set(allSales.map(s => s.productid?.toString()));
    
    switch (activeFilter) {
      case "RECENT SALES": 
        return allSales.slice(0, 8).map(s => ({ ...s, type: 'SALE' }));
      case "HIGH VALUE": 
        return allSales.filter(s => parseFloat(s.price) > 50000).map(s => ({ ...s, type: 'SALE' }));
      case "IN VAULT": 
        return allInventory
          .filter(item => !soldIds.has(item.id.toString()))
          .map(item => ({ 
            id: item.id, 
            buyername: `${item.brandname} ${item.model}`,
            date: new Date().toISOString(), 
            price: item.price, 
            type: 'STOCK' 
          }));
      default: 
        return allSales.slice(0, 8).map(s => ({ ...s, type: 'SALE' }));
    }
  }, [allSales, allInventory, activeFilter]);

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#008080]" size={40} />
      <p className="text-[10px] uppercase tracking-[1em] text-gray-400 font-black mt-4">Syncing Vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen  pb-20">
      <DemoTimer />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-8 py-12">
        
        {/* HEADER */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={14} className="text-[#008080] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-400">Market Intelligence</span>
          </div>
          <h2 className="text-7xl font-serif tracking-tighter text-black leading-none">CLE Dashboard</h2>
        </header>

        {/* STATS */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard title="Current Revenue" value={`$${metrics.monthlyRevenue.toLocaleString()}`} icon={TrendingUp} trend="Monthly Accrual" />
          <StatCard title="Active Holdings" value={metrics.stockCount} icon={Box} trend="In-Vault Units" />
          <StatCard title="Client Base" value={metrics.uniqueClients} icon={Users} trend="Verified Entities" />
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
  <StatCard 
    title="Current Revenue" 
    value={`$${metrics.monthlyRevenue.toLocaleString()}`} 
    icon={TrendingUp} 
    trend="Monthly Accrual" 
  />
  <StatCard 
    title="Active Holdings" 
    value={String(metrics.stockCount ?? 0)} // Convert number to string and handle nulls
    icon={Box} 
    trend="In-Vault Units" 
  />
  <StatCard 
    title="Client Base" 
    value={String(metrics.uniqueClients ?? 0)} // Convert number to string and handle nulls
    icon={Users} 
    trend="Verified Entities" 
  />
</div>

        {/* GRAPHS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Inventory Distribution - FIXED HEIGHT CONTAINER */}
          <div className="bg-[#fcfcfc] border border-gray-100 rounded-[45px] p-10 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Inventory Distribution</h4>
                <p className="text-[8px] text-gray-400 uppercase mt-1">Relative brand presence in vault</p>
              </div>
              <BarChart3 size={16} className="text-gray-300" />
            </div>
            
            {/* THIS DIV HAS FIXED HEIGHT NOW */}
            <div className="flex items-end gap-6 h-64 mt-auto px-4 w-full">
              {brandStockData.length > 0 ? brandStockData.map((item, i) => {
                const maxCount = Math.max(...brandStockData.map(d => d.count));
                // If only 1 item exists, count/maxCount = 1 (100% height)
                const heightPref = (item.count / maxCount) * 100;

                return (
                  <div key={item.name} className="flex-1 flex flex-col items-center gap-4 group relative h-full">
                    <div className="w-full flex items-end justify-center h-full">
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${heightPref}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`w-full max-w-[50px] rounded-t-xl transition-all duration-500 relative ${i === 0 ? 'bg-black' : 'bg-[#008080]/40 hover:bg-[#008080]'}`}
                      >
                         {/* Hover Tooltip */}
                         <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <div className="bg-white border border-gray-100 px-3 py-2 rounded-xl shadow-xl whitespace-nowrap">
                               <p className="text-[10px] font-black uppercase text-black">{item.count} Unit{item.count > 1 ? 's' : ''}</p>
                            </div>
                         </div>
                      </motion.div>
                    </div>
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest text-center whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                );
              }) : (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[32px]">
                   <Box size={24} className="text-gray-200 mb-2" />
                   <p className="text-[10px] uppercase tracking-widest text-gray-300">Vault Empty</p>
                </div>
              )}
            </div>
          </div>

          {/* Sales Mix Card */}
          <div className="bg-white border border-gray-100 rounded-[45px] p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Sales Volume</h4>
              <TrendingUp size={16} className="text-[#008080]" />
            </div>
            <div className="space-y-8">
              {allSales.length > 0 ? Object.entries(
                allSales.reduce((acc: any, s) => {
                  const p = allInventory.find(inv => inv.id.toString() === s.productid?.toString());
                  const b = (p?.brandname || "OTHER").toUpperCase();
                  acc[b] = (acc[b] || 0) + 1;
                  return acc;
                }, {})
              ).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([name, count]: any, i) => (
                <div key={name} className="space-y-3">
                  <div className="flex justify-between text-[10px] uppercase font-black">
                    <span className="text-gray-400 tracking-widest">{name}</span>
                    <span className="text-black">{count} Sold</span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(count / allSales.length) * 100}%` }}
                      className="h-full bg-[#008080] rounded-full"
                    />
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center text-gray-200 uppercase text-[10px] tracking-widest">No Sales Recorded</div>
              )}
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-4 mb-8">
          {["ALL", "RECENT SALES", "HIGH VALUE", "IN VAULT"].map((f) => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-8 py-4 rounded-2xl text-[9px] uppercase tracking-[0.4em] font-black transition-all border ${
                activeFilter === f 
                ? 'bg-[#008080] border-[#008080] text-white shadow-xl shadow-[#008080]/20' 
                : 'bg-white border-gray-100 text-gray-400 hover:text-black hover:border-black'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* DYNAMIC LEDGER */}
        <div className="bg-[#fafafa] rounded-[55px] p-12 border border-gray-100 min-h-[500px]">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-4xl font-serif tracking-tight">
              {activeFilter === "IN VAULT" ? "Inventory Status" : "Transaction Ledger"}
            </h3>
            <div className="flex gap-3">
              <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-black shadow-sm transition-all"><Download size={18} /></button>
              <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-black shadow-sm transition-all"><Settings size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <AnimatePresence mode="popLayout">
              {displayItems.length > 0 ? displayItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  key={item.id}
                  className="flex items-center justify-between p-8 bg-white rounded-[40px] border border-transparent hover:border-gray-100 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-8">
                     <div className="w-16 h-16 bg-[#fafafa] rounded-[24px] flex items-center justify-center border border-gray-50 text-gray-300 group-hover:text-[#008080] transition-colors group-hover:bg-[#008080]/5">
                        {item.type === 'STOCK' ? <Box size={24} /> : <History size={24} />}
                     </div>
                     <div>
                        <p className="text-lg font-bold tracking-tight text-black">{item.buyername || "Anonymous Entry"}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mt-1">
                          {item.type === 'STOCK' ? 'In-Vault Asset' : new Date(item.date).toDateString()}
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-mono font-bold text-black tracking-tighter">${(parseFloat(item.price) || 0).toLocaleString()}</p>
                     <div className="flex items-center justify-end gap-2 text-[#008080] mt-1.5">
                        <span className="text-[8px] font-black uppercase tracking-widest">
                          {item.type === 'STOCK' ? 'Verified Stock' : 'Sale Complete'}
                        </span>
                        <ShieldCheck size={12} />
                     </div>
                  </div>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center py-32 text-gray-200">
                  <Package size={60} strokeWidth={1} className="mb-6 opacity-30" />
                  <p className="text-[11px] uppercase tracking-[0.6em] font-black">No Records Available</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default AdminDashboard;

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   TrendingUp, Users, Box, Loader2, Package, 
//   Plus, History, ShieldCheck, ArrowUpRight, 
//   Settings, Download
// } from "lucide-react";
// import StatCard from "../admincomponents/StatCard";
// import { supabase } from '../utils/supabaseClient';

// const AdminDashboard = () => {
//   const [metrics, setMetrics] = useState({
//     monthlyRevenue: 0,
//     stockCount: 0,
//     uniqueClients: 0
//   });
//   const [recentSales, setRecentSales] = useState<any[]>([]);
//   const [inventoryMap, setInventoryMap] = useState<Record<string, any>>({});
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true);
//         const [salesResponse, productsResponse] = await Promise.all([
//           supabase.from('sales').select('*').order('date', { ascending: false }),
//           supabase.from('products').select('*')
//         ]);

//         if (salesResponse.error) throw salesResponse.error;
//         if (productsResponse.error) throw productsResponse.error;

//         const allSales = salesResponse.data || [];
//         const allInventory = productsResponse.data || [];

//         const invMap = allInventory.reduce((acc, item) => {
//           acc[item.id.toString()] = item;
//           return acc;
//         }, {});
//         setInventoryMap(invMap);

//         const now = new Date();
//         const thisMonthRevenue = allSales.reduce((acc, sale) => {
//           const saleDate = new Date(sale.date);
//           if (saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()) {
//             return acc + (parseFloat(sale.price) || 0);
//           }
//           return acc;
//         }, 0);

//         const uniqueEmails = new Set(allSales.map(sale => sale.buyeremail?.toLowerCase().trim()).filter(e => e));
//         const soldProductIds = new Set(allSales.map(s => s.productid?.toString()));
//         const availableStock = allInventory.filter(item => !soldProductIds.has(item.id.toString())).length;

//         setMetrics({
//           monthlyRevenue: thisMonthRevenue,
//           stockCount: availableStock,
//           uniqueClients: uniqueEmails.size
//         });
//         setRecentSales(allSales.slice(0, 5));
//       } catch (error) {
//         console.error("Dashboard Fetch Error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-6 bg-white">
//         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
//           <Loader2 className="text-[#008080]" size={40} />
//         </motion.div>
//         <p className="text-[10px] uppercase tracking-[0.8em] text-gray-400 font-black animate-pulse pl-4">Decrypting Ledger...</p>
//       </div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }} 
//       animate={{ opacity: 1 }}
//       className="max-w-7xl mx-auto px-8 pb-32 pt-10"
//     >
//       {/* 1. ARCHITECTURAL HEADER */}
//       <header className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
//         <div>
//           <div className="flex items-center gap-3 mb-4">
//             <span className="w-10 h-[1px] bg-[#008080]" />
//             <p className="text-[#008080] text-[10px] uppercase tracking-[0.5em] font-black">Command Center</p>
//           </div>
//           <h2 className="text-7xl font-serif tracking-tighter text-black leading-none">Vault Overview</h2>
//         </div>
        
//         {/* Quick Action Buttons */}
//         <div className="flex gap-4">
//           <button className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl hover:bg-[#008080] transition-all duration-500 group shadow-xl shadow-black/10">
//             <Plus size={18} className="group-hover:rotate-90 transition-transform" />
//             <span className="text-[10px] uppercase tracking-[0.3em] font-black">New Entry</span>
//           </button>
//           <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-black hover:border-black transition-all">
//             <Download size={18} />
//           </button>
//         </div>
//       </header>

//       {/* 2. STATS GRID WITH STAGGERED ENTRANCE */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//         {[
//           { title: "Monthly Revenue", val: `$${metrics.monthlyRevenue.toLocaleString()}`, icon: TrendingUp, trend: "Target: $500k" },
//           { title: "Active Inventory", val: metrics.stockCount, icon: Box, trend: "High Value Assets" },
//           { title: "Client Network", val: metrics.uniqueClients, icon: Users, trend: "Unique Global Buyers" }
//         ].map((stat, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1, duration: 0.8 }}
//           >
//             <StatCard 
//               title={stat.title} 
//               value={stat.val.toString()} 
//               icon={stat.icon} 
//               trend={stat.trend} 
//             />
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-12">
        
//         {/* 3. RECENT TRANSACTIONS */}
//         <section className="bg-white rounded-[50px] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50">
//           <div className="flex justify-between items-center mb-12">
//             <div>
//               <h3 className="font-serif text-3xl tracking-tight mb-2">Recent Archives</h3>
//               <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold">Logistics History</p>
//             </div>
//             <button className="p-3 bg-[#fafafa] rounded-full hover:bg-[#008080]/10 transition-colors">
//               <History size={18} className="text-gray-400" />
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             <AnimatePresence>
//               {recentSales.map((sale, i) => {
//                 const product = inventoryMap[sale.productid];
//                 return (
//                   <motion.div 
//                     key={sale.id} 
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.4 + (i * 0.1) }}
//                     className="flex items-center justify-between p-6 bg-[#FBFBFB] rounded-[32px] border border-transparent hover:border-gray-200 hover:bg-white transition-all duration-500 group"
//                   >
//                     <div className="flex items-center gap-6">
//                       <div className="w-16 h-16 bg-white rounded-2xl p-1 overflow-hidden flex items-center justify-center shadow-sm border border-gray-50 relative">
//                         {product?.images?.[0] ? (
//                           <img src={product.images[0]} className="w-full h-full object-cover rounded-xl" alt="watch" />
//                         ) : (
//                           <Package size={20} className="text-gray-200" />
//                         )}
//                         <div className="absolute inset-0 bg-[#008080]/0 group-hover:bg-[#008080]/10 transition-colors" />
//                       </div>
//                       <div>
//                         <p className="font-serif text-xl text-black leading-none mb-2">{product?.model || "Asset Unit"}</p>
//                         <div className="flex items-center gap-3">
//                           <p className="text-gray-400 text-[9px] uppercase tracking-widest flex items-center gap-2">
//                              <Users size={10} /> {sale.buyername || 'Anonymous'}
//                           </p>
//                           <span className="w-1 h-1 rounded-full bg-gray-200" />
//                           <p className="text-gray-300 text-[8px] uppercase tracking-widest">{new Date(sale.date).toLocaleDateString()}</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                       <p className="font-mono font-bold text-black text-xl tracking-tighter">
//                         ${parseFloat(sale.price).toLocaleString()}
//                       </p>
//                       <div className="flex items-center gap-1 text-[#008080] opacity-0 group-hover:opacity-100 transition-opacity">
//                          <span className="text-[8px] uppercase font-black tracking-widest">Receipt</span>
//                          <ArrowUpRight size={10} />
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         </section>

//         {/* 4. SIDEBAR OPTIONS & HEALTH */}
//         <aside className="space-y-8">
//           {/* Security Status Card */}
//           <div className="bg-black rounded-[40px] p-10 text-white relative overflow-hidden group">
//             <ShieldCheck size={100} className="absolute -bottom-4 -right-4 text-white/5 group-hover:text-[#008080]/20 transition-colors duration-700" />
//             <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#008080] mb-4">Security Protocol</h4>
//             <p className="text-2xl font-serif leading-tight mb-8">All transactions are encrypted and verified via Supreme Ledger.</p>
//             <div className="flex items-center gap-3">
//                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">System Online</span>
//             </div>
//           </div>

//           {/* Quick Configs */}
//           <div className="bg-[#EBF7FF] border border-[#BDE0FF] rounded-[40px] p-10">
//             <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#0066CC] mb-8">Management</h4>
//             <div className="space-y-4">
//               {[
//                 { label: "Vault Settings", icon: Settings },
//                 { label: "Download Audit", icon: Download },
//                 { label: "Access Logs", icon: History }
//               ].map((item, i) => (
//                 <button key={i} className="w-full flex items-center justify-between p-5 bg-white/50 rounded-2xl hover:bg-white transition-all text-[#0066CC] group">
//                   <span className="text-[10px] uppercase tracking-widest font-black">{item.label}</span>
//                   <item.icon size={16} className="group-hover:rotate-12 transition-transform" />
//                 </button>
//               ))}
//             </div>
//           </div>
//         </aside>

//       </div>
//     </motion.div>
//   );
// };

// export default AdminDashboard;