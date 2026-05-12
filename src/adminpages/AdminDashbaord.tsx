
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { TrendingUp, Users, Box, Loader2, Package } from "lucide-react";
// import StatCard from "../admincomponents/StatCard";
// import {getAllProducts } from '../utils/db';
// // At the top of your AdminDashboard file
// import { getAllSales } from '@/lib/api'; // Replace with your actual path

// const AdminDashboard = () => {
//   const [metrics, setMetrics] = useState({
//     monthlyRevenue: 0,
//     stockCount: 0,
//     uniqueClients: 0
//   });
//   const [recentSales, setRecentSales] = useState<any[]>([]);
//   const [inventoryMap, setInventoryMap] = useState<Record<string, any>>({});
//   const [isLoading, setIsLoading] = useState(true);

//   // useEffect(() => {
//   //   const fetchDashboardData = async () => {
//   //     try {
//   //       // 1. Fetch all raw data
//   //       const [allSales, allInventory] = await Promise.all([
//   //         // getAllSales(),
//   //         getAllProducts()
//   //       ]);
//   //       // console.log("admin",allSales)

//   //       // Create a map for quick lookups of product details (names/images) in the sales list
//   //       const invMap = allInventory.reduce((acc, item) => {
//   //         acc[item.id.toString()] = item;
//   //         return acc;
//   //       }, {});
//   //       setInventoryMap(invMap);

//   //       // 2. Calculate Monthly Revenue (Current Month)
//   //       const currentMonth = new Date().getMonth() -1;
//   //       const currentYear = new Date().getFullYear();
        
//   //       const thisMonthRevenue = allSales.reduce((acc, sale) => {
//   //         const saleDate = new Date(sale.date);
//   //         if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
            
//   //           return acc + (parseFloat(sale.price) || 0);
            
//   //         }
//   //         return acc;
//   //       }, 0);

//   //       console.log("recnuew",thisMonthRevenue)

//   //       // 3. Count Unique Clients
//   //       // We use a Set to automatically handle duplicates based on email
//   //       const uniqueEmails = new Set(allSales.map(sale => sale.buyerEmail?.toLowerCase().trim()));
        
//   //       // 4. Calculate Items in Stock (Unsold)
//   //       const soldIds = allSales.map(s => s.productId.toString());
//   //       const availableStock = allInventory.filter(item => !soldIds.includes(item.id.toString())).length;

//   //       setMetrics({
//   //         monthlyRevenue: thisMonthRevenue,
//   //         stockCount: availableStock,
//   //         uniqueClients: uniqueEmails.size
//   //       });

//   //       // 5. Get Recent Sales (Last 5)
//   //       setRecentSales(allSales.reverse().slice(0, 5));

//   //     } catch (error) {
//   //       console.error("Dashboard Fetch Error:", error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   fetchDashboardData();
//   // }, []);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // 1. Fetch only Inventory for now
//         // We set allSales to an empty array so the rest of the logic doesn't crash
//         const [allInventory] = await Promise.all([
//           getAllProducts()
//         ]);
        
//         const allSales = []; // Temporary placeholder until you implement getAllSales()

//         // Create a map for quick lookups of product details
//         const invMap = allInventory.reduce((acc, item) => {
//           acc[item.id.toString()] = item;
//           return acc;
//         }, {});
//         setInventoryMap(invMap);

//         // 2. Monthly Revenue (Will be 0 for now)
//         const currentMonth = new Date().getMonth(); 
//         const currentYear = new Date().getFullYear();
        
//         const thisMonthRevenue = allSales.reduce((acc, sale) => {
//           const saleDate = new Date(sale.date);
//           if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
//             return acc + (parseFloat(sale.price) || 0);
//           }
//           return acc;
//         }, 0);

//         // 3. Count Unique Clients (Will be 0 for now)
//         const uniqueEmails = new Set(allSales.map(sale => sale.buyerEmail?.toLowerCase().trim()));
        
//         // 4. Calculate Items in Stock
//         // Since allSales is empty, this will correctly show all products as "in stock"
//         const soldIds = allSales.map(s => s.productId.toString());
//         const availableStock = allInventory.filter(item => !soldIds.includes(item.id.toString())).length;

//         setMetrics({
//           monthlyRevenue: thisMonthRevenue,
//           stockCount: availableStock,
//           uniqueClients: uniqueEmails.size
//         });

//         // 5. Recent Sales
//         setRecentSales(allSales.reverse().slice(0, 5));

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
//           <button className="text-[#008080] text-[10px] uppercase tracking-[0.3em] font-black border-b-2 border-[#008080] pb-1 transition-all hover:tracking-[0.5em]">
//             View Full Archives
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           {recentSales.length > 0 ? recentSales.map((sale) => {
//             const product = inventoryMap[sale.productId];
//             return (
//               <motion.div 
//                 key={sale.id} 
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-50 transition-all hover:shadow-md hover:border-[#008080]/20"
//               >
//                 <div className="flex items-center gap-6">
//                   <div className="w-14 h-14 bg-[#fafafa] rounded-2xl p-1 overflow-hidden flex items-center justify-center border border-gray-50">
//                     {product?.images?.[0] ? (
//                       <img src={URL.createObjectURL(product.images[0])} className="w-full h-full object-cover rounded-lg" alt="watch" />
//                     ) : (
//                       <Package size={20} className="text-gray-200" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-serif text-lg text-black leading-none">
//                       {product?.model || "Unknown Product"}
//                     </p>
//                     <p className="text-gray-400 text-[9px] uppercase tracking-widest mt-2">
//                       Buyer: {sale.buyerName}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-mono font-bold text-[#008080] text-lg">
//                     ${parseFloat(sale.price).toLocaleString()}
//                   </p>
//                   <p className="text-[8px] text-gray-300 uppercase tracking-tighter">
//                     {new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Box, Loader2, Package } from "lucide-react";
import StatCard from "../admincomponents/StatCard";
import { supabase } from '../utils/supabaseClient'; // Ensure this path is correct

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    monthlyRevenue: 0,
    stockCount: 0,
    uniqueClients: 0
  });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [inventoryMap, setInventoryMap] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch Sales and Products in parallel from Supabase
        const [salesResponse, productsResponse] = await Promise.all([
          supabase.from('sales').select('*').order('date', { ascending: false }),
          supabase.from('products').select('*')
        ]);

        if (salesResponse.error) throw salesResponse.error;
        if (productsResponse.error) throw productsResponse.error;

        const allSales = salesResponse.data || [];
        const allInventory = productsResponse.data || [];

        // 2. Create a map for quick lookups of product details (Images/Model names)
        const invMap = allInventory.reduce((acc, item) => {
          acc[item.id.toString()] = item;
          return acc;
        }, {});
        setInventoryMap(invMap);

        // 3. Calculate Monthly Revenue (Current Month)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const thisMonthRevenue = allSales.reduce((acc, sale) => {
          const saleDate = new Date(sale.date);
          if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
            return acc + (parseFloat(sale.price) || 0);
          }
          return acc;
        }, 0);

        // 4. Count Unique Clients (Based on buyeremail from your sales table)
        const uniqueEmails = new Set(
          allSales
            .map(sale => sale.buyeremail?.toLowerCase().trim())
            .filter(email => email) // Remove undefined/nulls
        );
        
        // 5. Calculate Items in Stock (Total Products - Sold Products)
        // We assume a product is "Sold" if its ID exists in the sales table
        const soldProductIds = new Set(allSales.map(s => s.productid?.toString()));
        const availableStock = allInventory.filter(item => !soldProductIds.has(item.id.toString())).length;

        setMetrics({
          monthlyRevenue: thisMonthRevenue,
          stockCount: availableStock,
          uniqueClients: uniqueEmails.size
        });

        // 6. Set Recent Sales (Top 5 newest)
        setRecentSales(allSales.slice(0, 5));

      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-[#008080]" size={32} />
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Syncing Ledger...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 pb-20"
    >
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-5xl font-serif tracking-tighter text-black">Performance</h2>
        <p className="text-gray-400 text-[10px] mt-4 tracking-[0.6em] uppercase font-bold">Real-time metrics & archival data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <StatCard 
          title="Monthly Revenue" 
          value={`$${metrics.monthlyRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          trend="Current Month" 
        />
        <StatCard 
          title="Items in Stock" 
          value={metrics.stockCount.toString()} 
          icon={Box} 
          trend="Available" 
        />
        <StatCard 
          title="Total Clients" 
          value={metrics.uniqueClients.toString()} 
          icon={Users} 
          trend="Unique Buyers" 
        />
      </div>

      {/* Recent Sales List */}
      <div className="bg-[#fafafa] rounded-[40px] p-12 border border-gray-100 shadow-inner">
        <div className="flex justify-between items-center mb-10">
          <h3 className="font-serif text-2xl tracking-tight">Recent Transactions</h3>
          <button className="text-[#008080] text-[10px] uppercase tracking-[0.3em] font-black border-b-2 border-[#008080] pb-1 transition-all hover:shadow-sm">
            View Full Archives
          </button>
        </div>
        
        <div className="space-y-4">
          {recentSales.length > 0 ? recentSales.map((sale) => {
            // Match the sale to its product details using the map
            const product = inventoryMap[sale.productid];
            return (
              <motion.div 
                key={sale.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-50 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#fafafa] rounded-2xl p-1 overflow-hidden flex items-center justify-center border border-gray-50">
                    {product?.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        className="w-full h-full object-cover rounded-lg" 
                        alt="watch" 
                      />
                    ) : (
                      <Package size={20} className="text-gray-200" />
                    )}
                  </div>
                  <div>
                    <p className="font-serif text-lg text-black leading-none">
                      {product?.model || "Unknown Model"}
                    </p>
                    <p className="text-gray-400 text-[9px] uppercase tracking-widest mt-2">
                      Buyer: {sale.buyername || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-[#008080] text-lg">
                    ${parseFloat(sale.price).toLocaleString()}
                  </p>
                  <p className="text-[8px] text-gray-300 uppercase tracking-tighter">
                    {new Date(sale.date).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            );
          }) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
               <p className="text-[10px] uppercase tracking-widest text-gray-300">No transactions recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;