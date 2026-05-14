import React from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  History, 
  Receipt, 
  LogOut 
} from "lucide-react";
const logoimage = "/logo.png";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    { id: 'stock', label: 'Inventory', icon: Package },
    { id: 'sales-record', label: 'Sales History', icon: History },
    { id: 'create-slip', label: 'New Sale Slip', icon: Receipt },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#fafafa] border-r border-gray-100 p-8 flex flex-col justify-between z-50">
      <div>
        <div className="mb-12 px-4">
          {/* <h1 className="text-2xl font-serif tracking-tighter text-black uppercase">The Vault</h1>
          <p className="text-[9px] uppercase tracking-[0.5em] text-[#008080] font-black mt-2">Admin Portal</p> */}
          <img src={logoimage} alt="CLE Luxury Logo" className="w-40 h-24 " />
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20" 
                : "text-gray-400 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <item.icon size={18} strokeWidth={2.5} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* <button className="flex items-center gap-4 px-4 py-4 text-gray-400 hover:text-red-500 transition-colors group">
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-black">Sign Out</span>
      </button> */}
    </aside>
  );
};

export default Sidebar;