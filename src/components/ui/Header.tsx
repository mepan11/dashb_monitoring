import React from "react";
import { Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-slate-200/50 px-8 flex items-center justify-between bg-white shrink-0">
      {/* Search Input */}
      <div className="relative w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </span>
        <input
          type="text"
          placeholder="Cari data siswa, guru, atau laporan..."
          className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-100 bg-[#f4f7fc] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent transition-all"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Portal Sekolah Button */}
        <Button
          variant="secondary"
          className="!py-1.5 !px-4 !w-auto text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 border-none font-semibold rounded-lg focus:ring-blue-200"
        >
          Portal Sekolah
        </Button>

        {/* Icons */}
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
