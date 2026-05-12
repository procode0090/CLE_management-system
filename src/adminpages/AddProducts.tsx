// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Plus, X, Info, Maximize2, PackageCheck } from "lucide-react";
// import { supabase } from '../utils/supabaseClient'; 

// const AddProducts = () => {
//   const [images, setImages] = useState<File[]>([]);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
  
//   const [formData, setFormData] = useState({
//     brandName: "",
//     receivedDate: new Date().toISOString().split('T')[0],
//     reference: "",
//     model: "",
//     serialNumber: "",
//     accessories: "",
//     description: "",
//     watchBox: "No",
//     papers: "No",
//     price: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files);
//       setImages((prev) => [...prev, ...newFiles].slice(0, 8));
//     }
//   };

//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);

//     try {
//       // Mapping React State to your EXACT SQL Column Names
//       const { data, error } = await supabase
//         .from('products')
//         .insert([
//           {
//             brandname: formData.brandName,      // matches SQL 'brandname'
//             receiveddate: formData.receivedDate, // matches SQL 'receiveddate'
//             reference: formData.reference,
//             model: formData.model,
//             serialnumber: formData.serialNumber, // matches SQL 'serialnumber'
//             accessories: formData.accessories,
//             description: formData.description,
//             watchbox: formData.watchBox,         // matches SQL 'watchbox'
//             papers: formData.papers,
//             price: formData.price,               // matches SQL 'price' (text)
//             images: "",                          // matches SQL 'images' (varchar)
//             timestamp: new Date().getTime()      // matches SQL 'timestamp' (bigint)
//           }
//         ]);

//       if (error) throw error;

//       alert(`Asset "${formData.model}" archived successfully!`);
      
//       // Reset Form
//       setImages([]);
//       setFormData({
//         brandName: "",
//         receivedDate: new Date().toISOString().split('T')[0],
//         reference: "",
//         model: "",
//         serialNumber: "",
//         accessories: "",
//         description: "",
//         watchBox: "No",
//         papers: "No",
//         price: "",
//       });
//     } catch (error: any) {
//       console.error("Supabase Error:", error.message);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20 px-6">
//       <header className="mb-12">
//         <h2 className="text-5xl font-serif tracking-tighter text-black">New Acquisition</h2>
//         <p className="text-gray-400 text-[10px] mt-4 tracking-[0.6em] uppercase font-bold">Archive Entry Protocol</p>
//       </header>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
//         {/* IMAGE SECTION */}
//         <div className="lg:col-span-1 space-y-6">
//           <div className="bg-[#fafafa] p-8 rounded-[32px] border border-gray-100 shadow-inner">
//             <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 block mb-6">Gallery (8 Max)</label>
//             <div className="grid grid-cols-2 gap-4">
//               <AnimatePresence>
//                 {images.map((file, idx) => (
//                   <motion.div 
//                     key={idx} 
//                     initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
//                     className="relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm"
//                   >
//                     <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
//                       <button type="button" onClick={() => setPreviewImage(URL.createObjectURL(file))} className="p-2 bg-white rounded-full text-black hover:scale-110">
//                         <Maximize2 size={14} />
//                       </button>
//                       <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-white rounded-full text-red-500 hover:scale-110">
//                         <X size={14} />
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>

//               {images.length < 8 && (
//                 <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#008080] hover:bg-[#008080]/5 transition-all group">
//                   <Plus className="text-gray-300 group-hover:text-[#008080]" size={28} />
//                   <span className="text-[8px] uppercase tracking-widest text-gray-400 mt-2 font-bold">Upload Asset</span>
//                   <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
//                 </label>
//               )}
//             </div>
//           </div>
//           <div className="p-6 bg-[#008080]/5 rounded-3xl border border-[#008080]/10 flex gap-4">
//             <Info className="text-[#008080] shrink-0" size={20} />
//             <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider italic">
//               Vault Status: Connected to Supabase. Images are currently bypassed.
//             </p>
//           </div>
//         </div>

//         {/* FORM FIELDS */}
//         <div className="lg:col-span-2 bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
//           <div className="space-y-10">
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-2">
//                 <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Brand Name</label>
//                 <input required name="brandName" value={formData.brandName} onChange={handleInputChange} type="text" placeholder="e.g. Rolex" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Received Date</label>
//                 <input required name="receivedDate" value={formData.receivedDate} onChange={handleInputChange} type="date" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-2">
//                 <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Reference</label>
//                 <input required name="reference" value={formData.reference} onChange={handleInputChange} type="text" placeholder="Ref#" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Model</label>
//                 <input required name="model" value={formData.model} onChange={handleInputChange} type="text" placeholder="Watch model" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-2">
//                 <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Serial Number</label>
//                 <input required name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} placeholder="Unique Serial" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm font-mono" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Accessories</label>
//                 <input name="accessories" value={formData.accessories} onChange={handleInputChange} type="text" placeholder="Included items" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Description</label>
//               <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Movement/Condition..." className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm resize-none" />
//             </div>

//             <div className="flex gap-12">
//               <div className="space-y-4">
//                 <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 block ml-1">Watch Box</span>
//                 <div className="flex gap-6">
//                   {['Yes', 'No'].map((opt) => (
//                     <label key={opt} className="flex items-center gap-3 cursor-pointer">
//                       <input type="radio" name="watchBox" value={opt} checked={formData.watchBox === opt} onChange={handleInputChange} className="w-4 h-4 text-[#008080]" />
//                       <span className="text-sm text-gray-600 font-medium">{opt}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 block ml-1">Paper</span>
//                 <div className="flex gap-6">
//                   {['Yes', 'No'].map((opt) => (
//                     <label key={opt} className="flex items-center gap-3 cursor-pointer">
//                       <input type="radio" name="papers" value={opt} checked={formData.papers === opt} onChange={handleInputChange} className="w-4 h-4 text-[#008080]" />
//                       <span className="text-sm text-gray-600 font-medium">{opt}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Price</label>
//               <input required name="price" value={formData.price} onChange={handleInputChange} type="number" step="0.01" placeholder="0.00" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none text-lg font-mono font-bold text-[#008080] focus:ring-2 focus:ring-[#008080]/20" />
//             </div>

//             <motion.button 
//               type="submit"
//               disabled={isSaving}
//               className="w-full bg-black text-white py-6 rounded-[24px] uppercase tracking-[0.4em] font-black text-[11px] shadow-2xl hover:bg-[#008080] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
//             >
//               {isSaving ? "Archiving..." : <><PackageCheck size={18}/> Commit Product to Vault</>}
//             </motion.button>
//           </div>
//         </div>
//       </form>
//     </motion.div>
//   );
// };

// export default AddProducts;





import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Info, Maximize2, PackageCheck } from "lucide-react";
import { supabase } from '../utils/supabaseClient'; 

const AddProducts = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    brandName: "",
    receivedDate: new Date().toISOString().split('T')[0],
    reference: "",
    model: "",
    serialNumber: "",
    accessories: "",
    description: "",
    watchBox: "No",
    papers: "No",
    price: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 8));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "PRODUCTS"); // Your Unsigned Preset Name
    data.append("cloud_name", "dky8oc389");

    const res = await fetch(`https://api.cloudinary.com/v1_1/dky8oc389/image/upload`, {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Upload images in the order they were selected
      const imageUrls: string[] = [];
      for (const image of images) {
        const url = await uploadToCloudinary(image);
        imageUrls.push(url);
      }

      // 2. Prepare Data for Supabase (matching your SQL schema)
      const { error } = await supabase
        .from('products')
        .insert([
          {
            brandname: formData.brandName,
            receiveddate: formData.receivedDate,
            reference: formData.reference,
            model: formData.model,
            serialnumber: formData.serialNumber,
            accessories: formData.accessories,
            description: formData.description,
            watchbox: formData.watchBox,
            papers: formData.papers,
            price: formData.price,
            images: imageUrls, // Stored as text[] array
            timestamp: new Date().getTime()
          }
        ]);

      if (error) throw error;

      alert(`Success: ${formData.model} has been vaulted.`);
      
      // Reset Form
      setImages([]);
      setFormData({
        brandName: "",
        receivedDate: new Date().toISOString().split('T')[0],
        reference: "",
        model: "",
        serialNumber: "",
        accessories: "",
        description: "",
        watchBox: "No",
        papers: "No",
        price: "",
      });
    } catch (error: any) {
      console.error("Vault Error:", error);
      alert(error.message || "An error occurred during the archiving process.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20 px-6">
      <header className="mb-12">
        <h2 className="text-5xl font-serif tracking-tighter text-black">New Acquisition</h2>
        <p className="text-gray-400 text-[10px] mt-4 tracking-[0.6em] uppercase font-bold">Secure Asset Archiving</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* IMAGE UPLOAD SECTION */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#fafafa] p-8 rounded-[32px] border border-gray-100 shadow-inner">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 block mb-6">Gallery (8 Max)</label>
            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence>
                {images.map((file, idx) => (
                  <motion.div 
                    key={idx} 
                    className="relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm"
                  >
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full z-10">{idx + 1}</div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                      <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-white rounded-full text-red-500 hover:scale-110">
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {images.length < 8 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#008080] hover:bg-[#008080]/5 transition-all group">
                  <Plus className="text-gray-300 group-hover:text-[#008080]" size={28} />
                  <span className="text-[8px] uppercase tracking-widest text-gray-400 mt-2 font-bold text-center px-2">Add Image</span>
                  <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>
          </div>
          <div className="p-6 bg-[#008080]/5 rounded-3xl border border-[#008080]/10 flex gap-4">
            <Info className="text-[#008080] shrink-0" size={20} />
            <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-wider italic">
              Cloudinary Sync: Images are uploaded in order of selection.
            </p>
          </div>
        </div>

        {/* DATA ENTRY SECTION */}
        <div className="lg:col-span-2 bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Brand Name</label>
                <input required name="brandName" value={formData.brandName} onChange={handleInputChange} type="text" placeholder="e.g. Rolex" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Received Date</label>
                <input required name="receivedDate" value={formData.receivedDate} onChange={handleInputChange} type="date" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Reference</label>
                <input required name="reference" value={formData.reference} onChange={handleInputChange} type="text" placeholder="Reference ID" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Model</label>
                <input required name="model" value={formData.model} onChange={handleInputChange} type="text" placeholder="Watch Model" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Serial Number</label>
                <input required name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} placeholder="Unique Serial" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm font-mono" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Other Accessories</label>
                <input name="accessories" value={formData.accessories} onChange={handleInputChange} type="text" placeholder="Extra links, tags, etc." className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Condition details..." className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none focus:ring-2 focus:ring-[#008080]/20 text-sm resize-none" />
            </div>

            <div className="flex flex-wrap gap-12">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 block ml-1">Watch Box</span>
                <div className="flex gap-6">
                  {['Yes', 'No'].map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="watchBox" value={opt} checked={formData.watchBox === opt} onChange={handleInputChange} className="w-4 h-4 text-[#008080] border-gray-200" />
                      <span className="text-sm text-gray-600 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 block ml-1">Paper</span>
                <div className="flex gap-6">
                  {['Yes', 'No'].map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="papers" value={opt} checked={formData.papers === opt} onChange={handleInputChange} className="w-4 h-4 text-[#008080] border-gray-200" />
                      <span className="text-sm text-gray-600 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">Price</label>
              <input required name="price" value={formData.price} onChange={handleInputChange} type="number" step="0.01" placeholder="0.00" className="w-full px-6 py-4 bg-[#fafafa] rounded-2xl border-none text-lg font-mono font-bold text-[#008080] focus:ring-2 focus:ring-[#008080]/20" />
            </div>

            <motion.button 
              type="submit"
              disabled={isSaving}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black text-white py-6 rounded-[24px] uppercase tracking-[0.4em] font-black text-[11px] shadow-2xl hover:bg-[#008080] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isSaving ? "Uploading to Cloud..." : <><PackageCheck size={18}/> Commit Product to Vault</>}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProducts;

