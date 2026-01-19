"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { WalletOutlined } from "@mui/icons-material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMerchantContext } from "@/app/dlt/contexts/merchantContext";
import { signOut } from "next-auth/react";
import WalletCustomComponent from "./walletCustomComponent";

export const MerchantHeader = () => {
  const { toggleSidebar } = useMerchantContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/dlt/sign-in" });
  };

  const menuItems = [
    { icon: PersonOutlineIcon, label: "Profile", href: "#" },
    { icon: ManageAccountsOutlinedIcon, label: "Account Setting", href: "#" },
    { icon: HistoryIcon, label: "Activity Log", href: "#" },
  ];

  return (
    <header className="h-16 px-8 flex items-center justify-between bg-[#0f0f24]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            className="pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all text-sm w-48 focus:w-64 text-white placeholder-gray-500"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden sm:flex items-center gap-1">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 hover:border-purple-400/50 transition-colors cursor-pointer">
            <Image
              src="https://flagcdn.com/w40/th.png"
              alt="TH"
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Wallet with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsWalletOpen(!isWalletOpen)}
            className="relative text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <WalletOutlined />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
          </button>

          {/* Wallet Popup Dropdown */}
          {isWalletOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsWalletOpen(false)}
              />
              <div className="absolute right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <WalletCustomComponent />
              </div>
            </>
          )}
        </div>
        <button className="relative text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
          <NotificationsNoneIcon />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
        </button>
        <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
          <SettingsOutlinedIcon />
        </button>

        {/* User Avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition-all shadow-lg shadow-purple-500/20"
          >
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Info */}
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">John Doe</p>
                    <p className="text-gray-500 text-sm">
                      admin@dltloyalty.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                ))}
              </div>

              {/* Sign Out */}
              <div className="py-2 border-t border-gray-100">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors w-full"
                >
                  <LogoutIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
