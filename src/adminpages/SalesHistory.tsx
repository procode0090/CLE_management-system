

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, User, Mail, Phone, X, Download, FileText, Package, Loader2 } from "lucide-react";
import { supabase } from '../utils/supabaseClient';

// --- TYPES ---
interface SaleRecord {
  id: number;
  date: string;
  productid: string;
  reference: string;
  price: string;
  serialnumber: string;
  model: string;
  buyername: string;
  buyeremail: string;
  buyerphone: string;
  remarks: string;
  deliverynote: string | null;
  productDetails?: any;
}

const SalesHistory = () => {
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [salesData, setSalesData] = useState<SaleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the exact same init logic as CreateSaleSlip
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [salesRes, inventoryRes] = await Promise.all([
        supabase.from('sales').select('*'),
        supabase.from('products').select('*')
      ]);

      const sales = salesRes.data || [];
      const inventory = inventoryRes.data || [];

      // Map inventory details to sales records
      const enrichedSales = sales.map(sale => ({
        ...sale,
        productDetails: inventory.find(item => item.id?.toString() === sale.productid?.toString())
      }));

      // Sort by latest date
      setSalesData(enrichedSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Archive Access Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSales = salesData.filter(sale => 
    sale.buyername?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.productDetails?.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1400px] mx-auto px-6 pb-20">
      
      <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-5xl font-serif tracking-tighter text-black">Archives</h2>
          <p className="text-gray-400 text-[10px] mt-4 tracking-[0.6em] uppercase font-bold">Sales Ledger & Client History</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[450px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    placeholder="Search by Product, Buyer, or Ref..."
                    className="w-full pl-14 pr-6 py-5 bg-[#fafafa] rounded-[24px] border-none focus:ring-2 focus:ring-[#008080]/20 text-sm shadow-inner"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button 
                onClick={loadData}
                className="p-5 bg-[#fafafa] rounded-2xl hover:bg-gray-100 transition-colors text-gray-400"
                title="Refresh Archives"
            >
                <Loader2 className={isLoading ? "animate-spin" : ""} size={20} />
            </button>
        </div>
      </header>

      {/* SALES LIST */}
      <div className="space-y-4">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[#008080]" size={40} />
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Accessing Secure Vault...</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-5 px-10 mb-4 text-[9px] uppercase tracking-[0.4em] font-black text-gray-300">
                    <div className="col-span-2">Product / Reference</div>
                    <div>Buyer</div>
                    <div>Date</div>
                    <div className="text-right">Final Amount</div>
                </div>

                {filteredSales.map((sale) => (
                    <motion.div 
                        key={sale.id}
                        whileHover={{ scale: 1.005, backgroundColor: "#fcfcfc" }}
                        onClick={() => setSelectedSale(sale)}
                        className="grid grid-cols-5 items-center px-8 py-6 bg-white border border-gray-100 rounded-[30px] cursor-pointer transition-all group shadow-sm hover:shadow-md"
                    >
                        <div className="col-span-2 flex items-center gap-6">
                            <div className="w-16 h-16 bg-[#fafafa] rounded-2xl flex items-center justify-center overflow-hidden border border-gray-50">
                                {sale.productDetails?.images?.[0] ? (
                                    <img src={sale.productDetails.images[0]} className="w-full h-full object-cover" alt="asset" />
                                ) : <Package className="text-gray-200" size={24} />}
                            </div>
                            <div>
                                <h4 className="font-serif text-lg text-black group-hover:text-[#008080] transition-colors">
                                    {sale.productDetails?.model || "Unknown Product"}
                                </h4>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">{sale.reference}</p>
                            </div>
                        </div>
                        
                        <div className="text-sm font-medium text-gray-600">{sale.buyername}</div>
                        <div className="text-[11px] text-gray-400 font-mono uppercase">{new Date(sale.date).toLocaleDateString()}</div>
                        <div className="text-right font-mono font-bold text-[#008080] text-lg">${sale.price}</div>
                    </motion.div>
                ))}

                {filteredSales.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-gray-50 rounded-[40px]">
                        <p className="text-gray-300 text-[10px] uppercase tracking-widest">No matching records found in archives</p>
                    </div>
                )}
            </>
        )}
      </div>

      <AnimatePresence>
        {selectedSale && (
          <Modal sale={selectedSale} onClose={() => setSelectedSale(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- MODAL SUB-COMPONENT ---
const Modal = ({ sale, onClose }: { sale: SaleRecord; onClose: () => void }) => {
  const handleDownload = () => {
    if (!sale.deliverynote) return;
    const link = document.createElement('a');
    link.href = sale.deliverynote;
    link.download = `DeliveryNote_${sale.buyername.replace(/\s+/g, '_')}_${sale.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
          <X size={20} />
        </button>

        {/* Modal Content - Left Side */}
        <div className="w-full md:w-2/5 bg-[#fafafa] p-12 flex flex-col items-center justify-center border-r border-gray-100">
            {sale.productDetails?.images?.[0] ? (
              <img src={sale.productDetails.images[0]} className="w-full max-w-[280px] object-contain drop-shadow-2xl mb-8" alt="asset" />
            ) : <Package size={100} className="text-gray-100 mb-8" />}
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.6em] text-[#008080] font-black mb-2">Authenticated Asset</p>
            <h3 className="text-3xl font-serif tracking-tighter text-black">{sale.productDetails?.model || "Item Detail Missing"}</h3>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">{sale.reference}</p>
          </div>
        </div>

        {/* Modal Content - Right Side */}
        <div className="w-full md:w-3/5 p-12 overflow-y-auto">
          <div className="mb-12 flex justify-between items-baseline border-b border-gray-50 pb-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gray-300 font-black italic">Record Entry #{sale.id}</span>
            <div className="text-right">
              <span className="text-3xl font-serif text-[#008080]">${sale.price}</span>
              <p className="text-[8px] uppercase tracking-widest text-gray-400 mt-1">Transaction Total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h5 className="text-[10px] uppercase tracking-widest font-black text-black flex items-center gap-2">
                <User size={14} className="text-[#008080]" /> Client Dossier
              </h5>
              <div className="space-y-5">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Full Name</span>
                    <span className="text-sm font-medium text-gray-800">{sale.buyername}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Email Address</span>
                    <span className="text-sm text-gray-600 font-mono">{sale.buyeremail}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Contact</span>
                    <span className="text-sm text-gray-600">{sale.buyerphone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="text-[10px] uppercase tracking-widest font-black text-black flex items-center gap-2">
                <Calendar size={14} className="text-[#008080]" /> Logistical Data
              </h5>
              <div className="space-y-5">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Date of Sale</span>
                    <span className="text-sm text-gray-800">{new Date(sale.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Documentation</span>
                    {sale.deliverynote ? (
                        <button 
                          onClick={handleDownload}
                          className="flex items-center gap-2 mt-2 px-4 py-2 bg-[#008080]/5 hover:bg-[#008080] hover:text-white text-[#008080] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-fit border border-[#008080]/10"
                        >
                            <Download size={14} /> Download Note
                        </button>
                    ) : (
                        <span className="text-xs text-gray-300 italic mt-1 font-medium">No Delivery Note Attached</span>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-[#fafafa] rounded-[32px] border border-gray-100">
            <h5 className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-4 flex items-center gap-2">
                <FileText size={12} /> Transaction Remarks
            </h5>
            <p className="text-xs text-gray-500 italic leading-relaxed">
                {sale.remarks || "No additional remarks were recorded for this transaction."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalesHistory;