"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CampaignIcon from "@mui/icons-material/CampaignOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useSellerDashboard } from "@/contexts/SellerDashboardContext";

interface MenuItemProps {
  icon: any;
  label: string;
  href?: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  subItems?: { label: string; href: string }[];
  isCollapsed: boolean;
}

const MenuItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  hasSubmenu = false,
  subItems,
  isCollapsed,
}: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isSubActive =
    subItems?.some((item) => pathname === item.href) || isActive;

  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  const handleClick = () => {
    if (hasSubmenu && !isCollapsed) {
      setIsOpen(!isOpen);
    }
  };

  const Content = (
    <div
      onClick={handleClick}
      className={`flex items-center px-4 py-3 cursor-pointer group transition-all duration-300 relative overflow-hidden whitespace-nowrap rounded-xl mx-2 ${
        isSubActive && !hasSubmenu
          ? "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      } ${isCollapsed ? "justify-center px-2" : "justify-between"}`}
      title={isCollapsed ? label : ""}
    >
      <div
        className={`flex items-center gap-3 ${
          isCollapsed ? "justify-center w-full" : ""
        }`}
      >
        <Icon
          className={`w-5 h-5 shrink-0 ${isSubActive ? "text-white" : ""}`}
        />
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
          }`}
        >
          {label}
        </span>
      </div>
      {!isCollapsed &&
        hasSubmenu &&
        (isOpen ? (
          <KeyboardArrowDownIcon className="w-4 h-4 text-gray-500 shrink-0" />
        ) : (
          <KeyboardArrowRightIcon className="w-4 h-4 text-gray-500 shrink-0" />
        ))}
    </div>
  );

  return (
    <>
      {href && !hasSubmenu ? <Link href={href}>{Content}</Link> : Content}

      {!isCollapsed && hasSubmenu && isOpen && (
        <div className="py-1 transition-all ml-4">
          {subItems?.map((item) => {
            const isItemActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center pl-8 py-2 text-sm font-medium transition-colors rounded-lg mx-2 ${
                  isItemActive
                    ? "text-purple-400"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-3 ${
                    isItemActive ? "bg-purple-500" : "bg-gray-600"
                  }`}
                ></div>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export const SellerSidebar = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useSellerDashboard();

  return (
    <aside
      className={`${
        isSidebarCollapsed ? "w-20" : "w-64"
      } bg-[#0f0f1a] border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto scrollbar-thin transition-all duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div
        className={`p-6 flex items-center ${
          isSidebarCollapsed ? "justify-center" : "gap-3"
        } transition-all`}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/30">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ${
            isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          <span className="text-xl font-bold text-white whitespace-nowrap">
            DLT<span className="text-purple-400">loyalty</span>
          </span>
          <span className="text-xs text-white font-semibold">
            Seller Portal
          </span>
        </div>
      </div>

      <div className="flex-1 py-4">
        <div
          className={`px-6 mb-4 transition-opacity duration-300 ${
            isSidebarCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Dashboard
          </p>
        </div>
        <nav className="space-y-1">
          <MenuItem
            icon={CampaignIcon}
            label="Marketing"
            href="/dlt/seller"
            isActive={pathname === "/dlt/seller" || pathname === "/dlt/seller/"}
            isCollapsed={isSidebarCollapsed}
          />
        </nav>
        <div
          className={`px-6 mt-8 mb-4 transition-opacity duration-300 ${
            isSidebarCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Marketplace
          </p>
        </div>
        <nav className="space-y-1">
          <MenuItem
            icon={PeopleIcon}
            label="Marketplace"
            hasSubmenu
            isActive={pathname.startsWith("/dlt/seller/marketplace")}
            subItems={[
              { label: "List", href: "/dlt/seller/marketplace/list" },
              { label: "Create", href: "/dlt/seller/marketplace/create" },
            ]}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={ReceiptIcon}
            label="Products"
            hasSubmenu
            isActive={pathname.startsWith("/dlt/seller/products")}
            subItems={[
              { label: "List", href: "/dlt/seller/products/list" },
              { label: "Create", href: "/dlt/seller/products/create" },
            ]}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={ReceiptIcon}
            label="Transactions"
            hasSubmenu
            isActive={pathname.startsWith("/dlt/seller/orders")}
            subItems={[{ label: "List", href: "/dlt/seller/orders/list" }]}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={AccountCircleIcon}
            label="Account"
            hasSubmenu
            isCollapsed={isSidebarCollapsed}
          />
        </nav>
      </div>

      {/* Footer */}
      <div
        className={`p-4 border-t border-white/5 transition-opacity duration-300 ${
          isSidebarCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
            S
          </div>
          <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ${
              isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <span className="text-sm font-medium text-white">Seller</span>
            <span className="text-xs text-gray-500">Powered by DLTloyalty</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
