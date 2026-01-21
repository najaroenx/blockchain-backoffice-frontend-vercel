"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import {
  PointOfSaleOutlined,
  ReceiptLongOutlined,
  ApiSharp,
  Code,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useMerchantContext } from "../contexts/merchantContext";

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
        isActive || isSubActive
          ? "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25"
          : "text-gray-400 hover:text-white hover:bg-white/5"
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
            isActive || isSubActive
              ? "text-white"
              : "group-hover:text-purple-400"
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
      {!isCollapsed &&
        hasSubmenu &&
        (isOpen ? (
          <KeyboardArrowDownIcon
            className={`w-4 h-4 shrink-0 ${
              isActive || isSubActive ? "text-white/70" : "text-gray-500"
            }`}
          />
        ) : (
          <KeyboardArrowRightIcon
            className={`w-4 h-4 shrink-0 ${
              isActive || isSubActive ? "text-white/70" : "text-gray-500"
            }`}
          />
        ))}
    </div>
  );

  return (
    <>
      {href && !hasSubmenu ? <Link href={href}>{Content}</Link> : Content}

      {!isCollapsed && hasSubmenu && isOpen && (
        <div className="py-1 transition-all ml-2">
          {subItems?.map((item) => {
            const isItemActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center pl-12 py-2.5 text-sm font-medium transition-colors rounded-lg mx-2 ${
                  isItemActive
                    ? "text-purple-400 bg-purple-500/10"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-3 ${
                    isItemActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-gray-600"
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

export const MerchantSidebar = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, merchantId } = useMerchantContext();

  // Base path for merchant routes
  const basePath = `/dlt/merchant/${merchantId || "1"}`;

  return (
    <aside
      className={`${
        isSidebarCollapsed ? "w-20" : "w-64"
      } bg-[#0a0a1a] border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent transition-all duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div
        className={`p-6 flex items-center ${
          isSidebarCollapsed ? "justify-center" : "gap-2"
        } transition-all border-b border-white/5`}
      >
        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/20">
          <span className="font-bold text-sm">✦</span>
        </div>
        <span
          className={`text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white whitespace-nowrap">
              DLT<span className="text-purple-400">loyalty</span>
            </span>
            <span className="text-xs text-white font-semibold">
              Merchant Portal
            </span>
          </div>
        </span>
      </div>

      <div className="flex-1 py-6">
        {/* Dashboard Section */}
        <div
          className={`px-4 mb-3 transition-opacity duration-300 ${
            isSidebarCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Dashboard
          </p>
        </div>
        <nav className="space-y-1">
          <MenuItem
            icon={DashboardIcon}
            label="Overview"
            href={basePath}
            isActive={pathname === basePath}
            isCollapsed={isSidebarCollapsed}
          />
        </nav>
        {/* Loyalty Section */}
        <div
          className={`px-4 mt-8 mb-3 transition-opacity duration-300 ${
            isSidebarCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Loyalty
          </p>
        </div>
        <nav className="space-y-1">
          <MenuItem
            icon={PointOfSaleOutlined}
            label="Points"
            hasSubmenu
            isActive={pathname.startsWith(`${basePath}/point`)}
            subItems={[
              { label: "List", href: `${basePath}/point/list` },
              { label: "Create", href: `${basePath}/point/create` },
              { label: "Transfer", href: `${basePath}/point/transfer` },
            ]}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={ReceiptLongOutlined}
            label="Campaign"
            hasSubmenu
            isActive={pathname.startsWith(`${basePath}/voucher`)}
            subItems={[
              { label: "Products", href: `${basePath}/voucher/list` },
              {
                label: "Set Product price",
                href: `${basePath}/voucher/create`,
              },
              { label: "Coupons", href: `${basePath}/voucher/rewards` },
            ]}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={ReceiptLongOutlined}
            label="Transactions"
            hasSubmenu
            isActive={pathname.startsWith(`${basePath}/transaction`)}
            subItems={[{ label: "List", href: `${basePath}/transaction/list` }]}
            isCollapsed={isSidebarCollapsed}
          />
        </nav>

        {/* Management Section */}
        <div
          className={`px-4 mt-8 mb-3 transition-opacity duration-300 ${
            isSidebarCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Management
          </p>
        </div>
        <nav className="space-y-1">
          <MenuItem
            icon={PeopleIcon}
            label="Customer"
            hasSubmenu
            isActive={pathname.startsWith(`${basePath}/customer`)}
            subItems={[{ label: "List", href: `${basePath}/customer/list` }]}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={AccountCircleIcon}
            label="Account"
            hasSubmenu
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={Code}
            label="Developer"
            hasSubmenu
            isActive={pathname.startsWith(`${basePath}/developer`)}
            subItems={[{ label: "APIs", href: `${basePath}/developer/list` }]}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={ApiSharp}
            label="API Key"
            hasSubmenu
            isActive={pathname.startsWith(`${basePath}/api-key`)}
            subItems={[{ label: "List", href: `${basePath}/api-key/list` }]}
            isCollapsed={isSidebarCollapsed}
          />
        </nav>
      </div>

      {/* Footer */}
      <div
        className={`p-4 border-t border-white/5 ${
          isSidebarCollapsed ? "hidden" : ""
        }`}
      >
        <div className="px-2 py-3 rounded-xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20">
          <p className="text-xs text-gray-400 mb-1">Powered by</p>
          <p className="text-sm font-semibold text-white">
            DLT<span className="text-purple-400">loyalty</span> Platform
          </p>
        </div>
      </div>
    </aside>
  );
};
