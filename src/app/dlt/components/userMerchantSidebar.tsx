"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

// Menu Item Component - Light Theme with DLT accent
const MenuItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  isCollapsed,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}) => {
  const Content = (
    <div
      className={`flex items-center px-4 py-3 cursor-pointer group transition-all duration-300 relative overflow-hidden whitespace-nowrap rounded-xl mx-2 ${
        isActive
          ? "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25"
          : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
      } ${isCollapsed ? "justify-center px-2 mx-1" : "justify-between"}`}
      title={isCollapsed ? label : ""}
    >
      <div
        className={`flex items-center gap-3 ${
          isCollapsed ? "justify-center w-full" : ""
        }`}
      >
        <Icon
          className={`w-5 h-5 shrink-0 ${
            isActive ? "text-white" : "group-hover:text-purple-500"
          }`}
        />
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );

  return <Link href={href}>{Content}</Link>;
};

export const UserMerchantSidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId") || "";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const basePath = "/dlt/user-merchant";

  return (
    <aside
      className={`${
        isSidebarCollapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out shadow-sm`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <span
          className={`text-xl font-bold flex items-center gap-2 overflow-hidden transition-all duration-300 ${
            isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-xl font-bold whitespace-nowrap">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                DLT
              </span>
              <span className="text-gray-700">loyalty</span>
            </span>
            <span className="text-xs text-gray-500 font-medium">
              ร้านค้า Portal
            </span>
          </div>
        </span>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors shrink-0"
        >
          {isSidebarCollapsed ? (
            <MenuIcon className="w-5 h-5" />
          ) : (
            <MenuOpenIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {/* Dashboard Section */}
        <div className="mb-4">
          {!isSidebarCollapsed && (
            <p className="px-4 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              เมนู
            </p>
          )}
          <MenuItem
            icon={DashboardIcon}
            label="Dashboard"
            href={
              merchantId ? `${basePath}?merchantId=${merchantId}` : basePath
            }
            isActive={pathname === basePath}
            isCollapsed={isSidebarCollapsed}
          />
        </div>
      </nav>

      {/* Merchant ID Info */}
      {merchantId && !isSidebarCollapsed && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400 mb-1">Merchant ID</p>
          <p
            className="text-sm font-mono truncate bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium"
            title={merchantId}
          >
            {merchantId.substring(0, 16)}...
          </p>
        </div>
      )}
    </aside>
  );
};

export default UserMerchantSidebar;
