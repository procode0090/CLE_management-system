


import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Clock, TrendingUp, Search, Package, User, Calendar, X, FileText, Download } from "lucide-react";
import { supabase } from '../utils/supabaseClient';

const RepairDashboard = () => {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [selectedRepair, setSelectedRepair] = useState<any | null>(null);
  const [metrics, setMetrics] = useState({
    totalInRepair: 0,
    pending: 0,
    totalValue: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRepairData = async () => {
      try {
        const { data: allRepairs, error } = await supabase
          .from('repairs')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) {
          throw error;
        }

        const repairList = allRepairs || [];

        const stats = repairList.reduce(
          (acc, curr: any) => {
            acc.totalInRepair++;
            acc.pending++;
            acc.totalValue += Number(curr.estimatedcost || curr.estimatedCost || 2300);
            return acc;
          },
          { totalInRepair: 0, pending: 0, totalValue: 0 }
        );

        setMetrics(stats);
        setRepairs(repairList);
      } catch (error) {
        console.error("Failed to fetch repair data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepairData();
  }, []);

  const filteredRepairs = repairs.filter(
    (repair) =>
      repair.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto px-6 pb-20">
      {/* Header Section */}
      <header>
        <h2 className="text-5xl font-serif tracking-tighter text-black">Service Performance</h2>
        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mt-4 font-bold">Technical Diagnostics & Unit Tracking</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Units in Service" 
          value={metrics.totalInRepair.toString()} 
          subtext="Total Stock for Repair"
          icon={<Wrench size={24} />}
          color="#D4AF37"
        />
        <StatCard 
          title="Pending Diagnosis" 
          value={metrics.pending.toString()} 
          subtext="Awaiting Technician"
          icon={<Clock size={24} />}
          color="#008080"
        />
        <StatCard 
          title="Service Revenue" 
          value={`$${metrics.totalValue.toLocaleString()}`} 
          subtext="Estimated Labor Value"
          icon={<TrendingUp size={24} />}
          color="#000000"
        />
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search by repair model, customer name, or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-[#D4AF37]/20 focus:ring-2 focus:ring-[#D4AF37]/10 text-xs text-black placeholder:text-gray-400 shadow-sm transition-all"
        />
      </div>

      {/* Active Technical Dossiers Table */}
      <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
          <div>
            <h3 className="text-2xl font-serif text-black">Active Technical Dossiers</h3>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1 font-bold">Real-time registry from IndexedDB</p>
          </div>
          <span className="bg-[#FAF8F5] border border-[#E9E1D3] text-[#D4AF37] px-4 py-2 rounded-2xl text-[8px] font-black uppercase tracking-[0.1em]">
            Active Vault Status
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400 uppercase tracking-widest text-xs">
            Loading registry data...
          </div>
        ) : filteredRepairs.length === 0 ? (
          <div className="text-center py-20 text-gray-300 italic font-medium text-xs">
            No active repair records found in the vault.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] text-[8px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Asset</th>
                  <th className="px-6 py-5">Serial Number</th>
                  <th className="px-6 py-5">Date Received</th>
                  <th className="px-6 py-5">Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRepairs.map((repair) => (
                  <tr 
                    key={repair.id} 
                    onClick={() => setSelectedRepair(repair)}
                    className="hover:bg-gray-50/40 transition-all text-xs font-medium text-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-black font-bold text-[11px]">{repair.customername}</span>
                        <span className="text-gray-400 text-[10px] mt-0.5">{repair.customercontact}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#fafafa] rounded-xl flex items-center justify-center overflow-hidden border border-gray-50">
                        {repair.images && repair.images[0] ? (
                          <img 
                            src={repair.images[0]} 
                            className="w-full h-full object-cover" 
                            alt="asset" 
                          />
                        ) : (
                          <Package className="text-gray-300" size={18} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-black font-bold text-[10px] uppercase">
                          {repair.brandname} - {repair.model}
                        </span>
                        <span className="text-gray-400 text-[9px] mt-0.5 tracking-wider">Ref: {repair.reference || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-mono text-gray-400 text-[11px]">{repair.serialnumber || "—"}</td>
                    <td className="px-6 py-6 text-gray-500">{repair.receiveddate}</td>
                    <td className="px-6 py-6 max-w-xs truncate text-gray-500 italic">{repair.diagnosis || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedRepair && (
          <RepairDetailModal 
            repair={selectedRepair} 
            onClose={() => setSelectedRepair(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- DETAIL MODAL SUB-COMPONENT ---
const RepairDetailModal = ({ repair, onClose }: { repair: any; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
          <X size={20} />
        </button>

        {/* Modal Left Side */}
        <div className="w-full md:w-2/5 bg-[#fafafa] p-12 flex flex-col items-center justify-center border-r border-gray-100">
          {repair.images && repair.images[0] ? (
            <img 
              src={repair.images[0]} 
              className="w-full max-w-[280px] object-contain drop-shadow-2xl rounded-2xl mb-8" 
              alt="Asset" 
            />
          ) : (
            <Package size={100} className="text-gray-100 mb-8" />
          )}
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.6em] text-[#008080] font-black mb-2">Authenticated Asset</p>
            <h3 className="text-3xl font-serif tracking-tighter text-black">{repair.model || "Unknown Unit"}</h3>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">{repair.brandname} - {repair.reference}</p>
          </div>
        </div>

        {/* Modal Right Side */}
        <div className="w-full md:w-3/5 p-12 overflow-y-auto">
          <div className="mb-12 flex justify-between items-baseline border-b border-gray-50 pb-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gray-300 font-black italic">Dossier: {repair.id}</span>
            <div className="text-right">
              <span className="text-3xl font-serif text-[#D4AF37]">{repair.serialnumber || "—"}</span>
              <p className="text-[8px] uppercase tracking-widest text-gray-400 mt-1">Serial Number</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h5 className="text-[10px] uppercase tracking-widest font-black text-black flex items-center gap-2">
                <User size={14} className="text-[#D4AF37]" /> Client Dossier
              </h5>
              <div className="space-y-5">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Customer Name</span>
                  <span className="text-sm font-medium text-gray-800">{repair.customername}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Contact Number</span>
                  <span className="text-sm text-gray-600 font-mono">{repair.customercontact}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="text-[10px] uppercase tracking-widest font-black text-black flex items-center gap-2">
                <Calendar size={14} className="text-[#D4AF37]" /> Logistical Data
              </h5>
              <div className="space-y-5">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter">Date Received</span>
                  <span className="text-sm text-gray-800">{repair.receiveddate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-[#fafafa] rounded-[32px] border border-gray-100">
            <h5 className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-4 flex items-center gap-2">
              <FileText size={12} /> Diagnosis Notes
            </h5>
            <p className="text-xs text-gray-500 italic leading-relaxed">
              {repair.diagnosis || "No diagnostics or repair details were recorded for this unit."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Internal StatCard Component
const StatCard = ({ title, value, subtext, icon, color }: any) => (
  <motion.div 
    whileHover={{ scale: 1.01 }}
    className="bg-white border border-gray-100 p-8 rounded-[35px] shadow-sm hover:shadow-md transition-all"
  >
    <div className="flex justify-between items-start mb-6">
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${color}10`, color: color }}
      >
        {icon}
      </div>
      <span 
        className="text-[8px] font-black uppercase tracking-widest px-3 py-1 border rounded-full"
        style={{ backgroundColor: `${color}06`, color: color, borderColor: `${color}20` }}
      >
        Live
      </span>
    </div>
    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">{title}</p>
    <h4 className="text-4xl font-serif text-black mb-2 tracking-tighter">{value}</h4>
    <p className="text-[9px] text-gray-400 font-medium tracking-wide leading-tight">{subtext}</p>
  </motion.div>
);

export default RepairDashboard;