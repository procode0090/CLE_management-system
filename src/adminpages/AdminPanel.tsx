


import React from "react";
import { useRouter } from "next/router";
import { LayoutDashboard, Plus, History, ChevronLeft, LogOut, Package, Receipt } from "lucide-react";
import SidebarLink from "../admincomponents/SidebarLink";

const AdminPanel = ({ mode, children }: { mode: 'inventory' | 'repairs'; children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR */}
      <aside className="w-80 border-r border-gray-100 flex flex-col sticky top-0 h-screen bg-white">
        <div className="pt-12 px-10 mb-16">
          <h1 className="text-3xl font-serif tracking-tighter text-black">CLÉ</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${mode === 'inventory' ? 'bg-[#008080]' : 'bg-[#D4AF37]'}`} />
            <p className="text-[8px] uppercase tracking-[0.4em] text-gray-400 font-black">
              {mode === 'inventory' ? 'Vault Admin' : 'Repair Center'}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {mode === 'inventory' ? (
            <>
              <SidebarLink to="/admin/dashboard" label="Overview" icon={<LayoutDashboard />} />
              <SidebarLink to="/admin/add-product" label="Add Product" icon={<Plus />} />
               <SidebarLink to="/admin/inventory" label="Inventory" icon={<Package />} />
              <SidebarLink to="/admin/sales" label="Sales History" icon={<History />} />
              <SidebarLink to="/admin/saleslip" label="New Sale Slip" icon={<Receipt />} />
              {/* saleslip */}
            </>
          ) : (
            <>
              <SidebarLink to="/repair-center/repair" label="Active Repairs" icon={<LayoutDashboard />} />
              <SidebarLink to="/repair-center/intake" label="New Intake" icon={<Plus />} />
            </>
          )}
        </nav>

        <div className="p-10 border-t border-gray-50 space-y-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-4 text-gray-400 hover:text-black transition-colors">
            <ChevronLeft size={18} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-black">Exit Department</span>
          </button>
          {/* <button className="flex items-center gap-4 text-red-400 hover:text-red-600">
            <LogOut size={18} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-black">Sign Out</span>
          </button> */}
        </div>
      </aside>

      <main className="flex-1 bg-[#F9FAFB] p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminPanel;