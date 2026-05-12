





import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MessageSquare, CreditCard, Package, CheckCircle, FileText, Upload, X } from "lucide-react";
import { supabase } from '../utils/supabaseClient';

const CreateSaleSlip = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    price: "",
    reference: "",
    serialNumber: "",
    model: "",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    remarks: "",
  });

  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "PRODUCTS");
    data.append("cloud_name", "dky8oc389");

    const res = await fetch(`https://api.cloudinary.com/v1_1/dky8oc389/auto/upload`, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }
    
    const fileData = await res.json();
    return fileData.secure_url;
  };

  // --- CORE LOGIC: SYNC AVAILABLE ITEMS ---
  const syncAvailableAssets = async () => {
    try {
      const [allInventoryRes, allSalesRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('sales').select('*')
      ]);

      const allInventory = allInventoryRes.data || [];
      const allSales = allSalesRes.data || [];

      // Filter out items that already exist in the sales store
      const soldIds = allSales.map(sale => sale.productid?.toString()).filter(Boolean);
      const available = allInventory.filter(item => !soldIds.includes(item.id?.toString()));
      
      setInventory(available);
    } catch (error) {
      console.error("Sync Error:", error);
    }
  };

  useEffect(() => {
    syncAvailableAssets();
  }, []);

  // Auto-fill price/ref when product is selected
  useEffect(() => {
    const product = inventory.find(p => p.id.toString() === selectedProductId);
    if (product) {
      setFormData(prev => ({
        ...prev,
        price: product.price,
        reference: product.reference,
        serialNumber: product.serialnumber,
        model: product.model
      }));
    }
  }, [selectedProductId, inventory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Maximum size is 10MB.");
        e.target.value = '';
        return;
      }
      setDeliveryNote(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return alert("Please select a product");
    if (!formData.buyerName.trim()) return alert("Please enter buyer name");
    if (!formData.price.trim()) return alert("Please enter price");

    try {
      let deliveryNoteUrl = null;
      if (deliveryNote) {
        if (deliveryNote.size > 10 * 1024 * 1024) {
          alert("Delivery note file is too large. Maximum size is 10MB.");
          return;
        }
        deliveryNoteUrl = await uploadToCloudinary(deliveryNote);
      }

      const saleData = {
        productid: parseInt(selectedProductId, 10),
        price: formData.price.toString(),
        reference: formData.reference || null,
        serialnumber: formData.serialNumber || null,
        model: formData.model || null,
        buyername: formData.buyerName,
        buyeremail: formData.buyerEmail || null,
        buyerphone: formData.buyerPhone || null,
        remarks: formData.remarks || null,
        deliverynote: deliveryNoteUrl,
        date: new Date().toISOString(),
        status: "Finalized"
      };

      console.log("Submitting sale data:", saleData);

      const { data, error } = await supabase
        .from('sales')
        .insert([saleData]);

      if (error) {
        console.error("Supabase Error Details:", error);
        throw new Error(error.message || "Failed to save sale record");
      }

      alert(`Sale recorded successfully for ${formData.buyerName}!`);

      // CRITICAL: Refresh the local state so the item disappears from dropdown
      await syncAvailableAssets();
      
      // RESET FORM
      setSelectedProductId("");
      setDeliveryNote(null);
      setFormData({
        price: "",
        reference: "",
        serialNumber: "",
        model: "",
        buyerName: "",
        buyerEmail: "",
        buyerPhone: "",
        remarks: "",
      });

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error: any) {
      console.error("Sale Record Error:", error);
      alert(`Error: ${error.message || "Failed to save transaction. Please check the console for details."}`);
    }
  };

  const selectedProduct = inventory.find(p => p.id.toString() === selectedProductId);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-6 pb-20">
      <header className="mb-12">
        <h2 className="text-5xl font-serif tracking-tighter text-black">Sales Slip</h2>
        <p className="text-gray-400 text-[10px] mt-4 tracking-[0.6em] uppercase font-bold">Transaction Generation Protocol</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT: Product Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#fafafa] p-8 rounded-[32px] border border-gray-100 shadow-inner">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 block mb-6">Select Asset from Vault</label>
            
            <div className="relative mb-8">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-[#008080]" size={18} />
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm appearance-none cursor-pointer shadow-sm"
              >
                <option value="">Choose item...</option>
                {inventory.map(p => (
                  <option key={p.id} value={p.id}>{p.brandName} - {p.model}</option>
                ))}
              </select>
            </div>

            <AnimatePresence mode="wait">
              {selectedProduct ? (
                <motion.div key={selectedProduct.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center">
                  <div className="bg-white rounded-[24px] p-4 mb-4 shadow-sm border border-gray-50 aspect-square flex items-center justify-center overflow-hidden">
                    {selectedProduct.images?.[0] ? (
                        <img src={selectedProduct.images[0]} className="w-full h-full object-cover rounded-xl" alt="asset" />
                    ) : <Package size={48} className="text-gray-100" />}
                  </div>
                  <h4 className="font-serif text-xl mb-1 text-black">{selectedProduct.model}</h4>
                  <p className="text-[#008080] text-[10px] uppercase font-black tracking-[0.2em]">{selectedProduct.reference}</p>
                </motion.div>
              ) : (
                <div className="h-60 border-2 border-dashed border-gray-100 rounded-[24px] flex items-center justify-center text-gray-300 text-[10px] uppercase tracking-widest text-center px-6">
                  Select a product to view asset details
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-[#fafafa] p-8 rounded-[32px] border border-gray-100">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 block mb-6">Delivery Documentation</label>
            {!deliveryNote ? (
              <label className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-[#008080]/5 hover:border-[#008080] transition-all group">
                <Upload className="text-gray-300 group-hover:text-[#008080] mb-2" size={24} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Upload Delivery Note</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#008080]/20 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="text-[#008080] shrink-0" size={20} />
                  <span className="text-[10px] font-bold text-gray-600 truncate uppercase tracking-tight">{deliveryNote.name}</span>
                </div>
                <button type="button" onClick={() => setDeliveryNote(null)} className="p-1 hover:bg-red-50 rounded-full text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Financials & Buyer Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-300 mb-8 flex items-center gap-3">
              <CreditCard size={14} className="text-[#008080]" /> Financial Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Final Agreed Price</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-[#008080] text-lg">$</span>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full pl-12 pr-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-xl font-mono font-bold text-[#008080]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Reference</label>
                <input type="text" value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})} className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm font-bold text-black" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Serial Number</label>
                <input type="text" value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})} className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm font-mono" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Model</label>
                <input type="text" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-300 mb-8 flex items-center gap-3">
              <User size={14} className="text-[#008080]" /> Buyer Dossier
            </h3>
            <div className="space-y-6">
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input type="text" placeholder="Full Legal Name" value={formData.buyerName} className="w-full pl-14 pr-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" onChange={(e) => setFormData({...formData, buyerName: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input type="email" placeholder="Email Address" value={formData.buyerEmail} onChange={(e) => setFormData({...formData, buyerEmail: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input type="tel" placeholder="Contact Number" value={formData.buyerPhone} onChange={(e) => setFormData({...formData, buyerPhone: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
                </div>
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-5 top-6 text-gray-300" size={16} />
                <textarea placeholder="Transaction remarks..." value={formData.remarks} rows={4} onChange={(e) => setFormData({...formData, remarks: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-[#fafafa] rounded-3xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm resize-none" />
              </div>
            </div>
          </div>

          <motion.button 
            disabled={isSubmitted} 
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.98 }} 
            className={`w-full py-6 rounded-[24px] uppercase tracking-[0.4em] font-black text-[11px] shadow-xl transition-all duration-500 flex items-center justify-center gap-4 ${isSubmitted ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-[#008080]'}`}
          >
            {isSubmitted ? <><CheckCircle size={18} /> Transaction Finalized</> : "Generate Official Sales Slip"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateSaleSlip;