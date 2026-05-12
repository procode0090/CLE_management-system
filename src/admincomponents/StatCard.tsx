import React from "react";
import {type  LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
}

const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => (
  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-[#008080]/5 rounded-2xl text-[#008080]">
        <Icon size={24} />
      </div>
      <span className="text-[10px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">{trend}</span>
    </div>
    <h3 className="text-gray-400 text-[9px] uppercase tracking-[0.4em] font-black mb-2">{title}</h3>
    <p className="text-4xl font-serif text-black">{value}</p>
  </div>
);

export default StatCard;