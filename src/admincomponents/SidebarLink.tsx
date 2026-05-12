import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
const SidebarLink = ({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === to;

  return (
    <Link
      href={to}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
        isActive
          ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20"
          : "text-[#A0A0A0] hover:bg-gray-50 hover:text-black"
      }`}
    >
      <span className={isActive ? "text-white" : "text-[#A0A0A0]"}>
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </span>
      <span className="text-[10px] uppercase tracking-[0.25em] font-black">
        {label}
      </span>
    </Link>
  );
};
export default SidebarLink;