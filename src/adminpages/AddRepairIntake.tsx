

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, User, Phone, Wrench, Info, X, Maximize2, Mail } from "lucide-react";
import { addRepair, uploadImage, getImageUrl } from '../utils/db';

// --- ISOLATED EMAIL SERVICE PROVIDER ---
export const sendClientConfirmationEmail = async (formData: any) => {
  console.log("[Email Service] Initiating email sending process...");
  console.log("[Email Service] Target Email Address: ", formData.customerEmail);

  const emailPayload = {
    to: formData.customerEmail,
    from: "Operations@werecle.com",
    subject: `Service Intake Confirmation - ${formData.brandName} ${formData.model}`,
    templateData: {
      customerName: formData.customerName,
      reference: formData.reference,
      serialNumber: formData.serialNumber,
      model: formData.model,
      brandName: formData.brandName,
      diagnosis: formData.diagnosis,
      receivedDate: formData.receivedDate,
    }
  };

  try {
    const response = await fetch('/api/send-repair-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    console.log("[Email Service] Email sent successfully via backend API!");
    return { success: true, error: null };
  } catch (error: any) {
    console.warn("[Email Service] Failed to send email via endpoint:", error.message);
    
    // Returning structured error object instead of failing silently
    return { success: false, error: error.message };
  }
};

const InputField = ({ label, placeholder, icon: Icon, type = "text", name, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 pl-1">{label}</label>
    <div className="relative group">
      {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#008080]"><Icon size={14} /></div>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3.5 bg-[#fafafa] rounded-2xl outline-none border border-transparent focus:border-[#008080]/20 focus:bg-white transition-all text-xs text-black placeholder:text-gray-300 shadow-inner`}
      />
    </div>
  </div>
);

const CompactRepairIntake = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerContact: "",
    customerEmail: "",
    brandName: "",
    receivedDate: new Date().toISOString().split('T')[0],
    reference: "",
    model: "",
    serialNumber: "",
    diagnosis: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles].slice(0, 8));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!formData.customerEmail) {
      alert("Please enter a customer email address before committing the repair slip.");
      setIsSaving(false);
      return;
    }

    try {
      // Upload images to Supabase storage
      const imageUrls: string[] = [];
      for (const image of images) {
        const path = `repairs/${Date.now()}-${image.name}`;
        await uploadImage(image, path);
        const url = getImageUrl(path);
        imageUrls.push(url);
      }

      const repairToSave = {
        ...formData,
        images: imageUrls,
        timestamp: new Date().getTime(),
      };

      // 1. Save data to Supabase
      await addRepair(repairToSave);
      console.log("[DB] Repair slip successfully saved to Supabase.");

      // 2. Trigger the separated email function
      const emailResult = await sendClientConfirmationEmail(formData);

      if (emailResult.success) {
        alert("Slip logged successfully! Confirmation email sent to client.");
      } else {
        alert(`Slip logged to database, but email failed: ${emailResult.error}. Please verify server/API implementation.`);
      }

      // Reset Form State
      setImages([]);
      setFormData({
        customerName: "",
        customerContact: "",
        customerEmail: "",
        brandName: "",
        receivedDate: new Date().toISOString().split('T')[0],
        reference: "",
        model: "",
        serialNumber: "",
        diagnosis: "",
      });
    } catch (error) {
      console.error("Vault DB Error:", error);
      alert("Error: Could not log repair. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[1400px] mx-auto px-6 pb-20"
    >
      <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-5xl font-serif tracking-tighter text-black">Service Intake</h2>
          <p className="text-gray-400 text-[10px] mt-4 tracking-[0.6em] uppercase font-bold">HOROLOGICAL PROTOCOL</p>
        </div>
        <div className="flex items-center gap-2 bg-[#fafafa] px-6 py-4 rounded-2xl text-gray-400 border border-gray-100 shadow-sm">
          <Wrench size={16} className="text-[#008080]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
            Internal Repair Protocol
          </span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        {/* LEFT COLUMN - ASSET FILE UPLOAD & CLIENT DOSSIER */}
        <div className="md:col-span-1 space-y-8">
          {/* Images Section */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h4 className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 mb-6 flex items-center gap-2">
              <UploadCloud size={14} className="text-[#008080]" /> Asset File Gallery
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence>
                {images.map((file, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm"
                  >
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                      <button type="button" onClick={() => setPreviewImage(URL.createObjectURL(file))} className="p-1.5 bg-white rounded-full text-black hover:scale-110">
                        <Maximize2 size={12} />
                      </button>
                      <button type="button" onClick={() => removeImage(idx)} className="p-1.5 bg-white rounded-full text-red-500 hover:scale-110">
                        <X size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {images.length < 8 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#008080] hover:bg-[#008080]/5 transition-all group">
                  <UploadCloud size={20} className="text-gray-300 group-hover:text-[#008080]" />
                  <span className="text-[8px] uppercase tracking-[0.1em] font-black text-gray-400 mt-2">Upload File</span>
                  <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* Client Info Section */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
            <h4 className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 mb-2 flex items-center gap-2">
              <User size={14} className="text-[#008080]" /> Client Dossier
            </h4>
            <InputField 
              label="Full Name" 
              placeholder="Client Name" 
              icon={User} 
              name="customerName" 
              value={formData.customerName} 
              onChange={handleInputChange} 
            />
            <InputField 
              label="Contact Info (Phone)" 
              placeholder="+1 000 000 0000" 
              icon={Phone} 
              name="customerContact" 
              value={formData.customerContact} 
              onChange={handleInputChange} 
            />
            <InputField 
              label="Client Email" 
              placeholder="name@company.com" 
              icon={Mail} 
              type="email" 
              name="customerEmail" 
              value={formData.customerEmail} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="p-6 bg-[#008080]/5 rounded-[32px] border border-[#008080]/10 flex items-start gap-4">
            <Info className="text-[#008080] shrink-0 mt-0.5" size={18} />
            <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider italic">
              Data entered here is stored locally via IndexedDB, and the client will be notified at the specified address.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN - LOGS, MODEL, DIAGNOSIS DETAILS */}
        <div className="md:col-span-2 bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField 
              label="Brand Name" 
              placeholder="e.g. Rolex" 
              name="brandName" 
              value={formData.brandName} 
              onChange={handleInputChange} 
            />
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 pl-1">Received Date</label>
              <input 
                type="date" 
                name="receivedDate" 
                value={formData.receivedDate} 
                onChange={handleInputChange} 
                className="w-full px-5 py-3.5 bg-[#fafafa] rounded-2xl outline-none border border-transparent focus:border-[#008080]/20 text-xs text-black" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField 
              label="Reference #" 
              placeholder="e.g. B020-TITAN" 
              name="reference" 
              value={formData.reference} 
              onChange={handleInputChange} 
            />
            <InputField 
              label="Model" 
              placeholder="Product Model Name" 
              name="model" 
              value={formData.model} 
              onChange={handleInputChange} 
            />
          </div>

          <InputField 
            label="Serial Number" 
            placeholder="Unique Serial Number" 
            name="serialNumber" 
            value={formData.serialNumber} 
            onChange={handleInputChange} 
          />

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-[0.15em] font-black text-gray-400 pl-1">Diagnosis Notes</label>
            <textarea 
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              placeholder="Detailed diagnostics, repair notes, and parts requirement..." 
              rows={5}
              className="w-full px-6 py-5 bg-[#fafafa] rounded-[28px] outline-none border border-transparent focus:border-[#008080]/20 focus:bg-white transition-all text-xs resize-none text-black placeholder:text-gray-300"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSaving} 
            className="w-full bg-black text-white py-6 rounded-[24px] uppercase tracking-[0.4em] font-black text-[11px] shadow-2xl hover:bg-[#008080] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {isSaving ? "Logging Entry..." : (
              <>
                <Wrench size={16} />
                Commit Repair Slip
              </>
            )}
          </button>
        </div>
      </form>

      {/* MODAL PREVIEW FOR IMAGES */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setPreviewImage(null)} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-10 cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              src={previewImage} 
              className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl" 
              alt="Preview File" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompactRepairIntake;