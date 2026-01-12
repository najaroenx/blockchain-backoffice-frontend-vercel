"use client";
import React from "react";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useSellerDashboard } from "@/contexts/SellerDashboardContext";

export const SellerHeader = () => {
  const { toggleSidebar } = useSellerDashboard();

  return (
    <header className="h-16 px-8 flex items-center justify-between bg-[#0f0f1a] border-b border-white/5 sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            className="pl-12 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm text-white placeholder-gray-500 w-64"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1">
          <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white/10">
            <Image
              src="https://flagcdn.com/w40/th.png"
              alt="TH"
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <NotificationsNoneIcon />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#0f0f1a]"></span>
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <SettingsOutlinedIcon />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500/50 transition-all flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
      </div>
    </header>
  );
};
