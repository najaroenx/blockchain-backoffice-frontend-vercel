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
    <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-50 sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            disabled
            className="pl-10 pr-4 py-2 rounded-full border border-transparent bg-transparent hover:bg-slate-50 focus:bg-white focus:border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all text-sm w-48 focus:w-64 cursor-not-allowed"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 hidden sm:flex">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200">
            <Image
              src="https://flagcdn.com/w40/us.png"
              alt="US"
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <NotificationsNoneIcon />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <SettingsOutlinedIcon />
        </button>
        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-100 cursor-pointer hover:ring-2 hover:ring-slate-200 transition-all">
          {/* User Avatar Placeholder */}
          <div className="w-full h-full bg-gradient-to-tr from-amber-200 to-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};
