"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import FolderIcon from "@mui/icons-material/FolderOutlined";
import CampaignIcon from "@mui/icons-material/CampaignOutlined";
import TimelineIcon from "@mui/icons-material/TimelineOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined";
import FolderOpenIcon from "@mui/icons-material/FolderOpenOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlineOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
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
      className={`flex items-center px-4 py-3 cursor-pointer group transition-all duration-300 relative overflow-hidden whitespace-nowrap ${
        isSubActive && !hasSubmenu
          ? "text-blue-600 bg-blue-50/50 border-r-2 border-blue-600"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
      } ${isCollapsed ? "justify-center px-2" : "justify-between"}`}
      title={isCollapsed ? label : ""}
    >
      <div
        className={`flex items-center gap-3 ${
          isCollapsed ? "justify-center w-full" : ""
        }`}
      >
        <Icon
          className={`w-5 h-5 shrink-0 ${isSubActive ? "text-blue-600" : ""}`}
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
          <KeyboardArrowDownIcon className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <KeyboardArrowRightIcon className="w-4 h-4 text-slate-400 shrink-0" />
        ))}
    </div>
  );

  return (
    <>
      {href && !hasSubmenu ? <Link href={href}>{Content}</Link> : Content}

      {!isCollapsed && hasSubmenu && isOpen && (
        <div className="bg-slate-50/50 py-1 transition-all">
          {subItems?.map((item) => {
            const isItemActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center pl-12 py-2 text-sm font-medium transition-colors ${
                  isItemActive
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-3 ${
                    isItemActive ? "bg-blue-600" : "bg-slate-300"
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
      } bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 overflow-y-auto scrollbar-thin transition-all duration-300 ease-in-out`}
    >
      <div
        className={`p-6 flex items-center ${
          isSidebarCollapsed ? "justify-center" : "gap-2"
        } transition-all`}
      >
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
          <RocketLaunchIcon fontSize="small" />
        </div>
        <span
          className={`text-xl font-bold text-slate-900 whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          Ecme
        </span>
      </div>

      <div className="flex-1 py-4">
        <div
          className={`px-4 mb-2 transition-opacity duration-300 ${
            isSidebarCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Dashboard
          </p>
        </div>
        <nav className="space-y-1">
          <MenuItem
            icon={ShoppingCartIcon}
            label="Ecommerce"
            href="/seller/ecommerce"
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={FolderIcon}
            label="Project"
            href="/seller/project"
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={CampaignIcon}
            label="Marketing"
            href="/seller"
            isActive={pathname === "/seller" || pathname === "/seller/"}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={TimelineIcon}
            label="Analytic"
            href="/seller/analytic"
            isCollapsed={isSidebarCollapsed}
          />
        </nav>

        <div
          className={`px-4 mt-8 mb-2 transition-opacity duration-300 ${
            isSidebarCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Concepts
          </p>
        </div>
        <nav className="space-y-1">
          <MenuItem
            icon={AutoAwesomeIcon}
            label="AI"
            hasSubmenu
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={FolderIcon}
            label="Projects"
            hasSubmenu
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={PeopleIcon}
            label="Customer"
            hasSubmenu
            isActive={pathname.startsWith("/seller/customer")}
            subItems={[
              { label: "List", href: "/seller/customer/list" },
              { label: "Edit", href: "/seller/customer/edit" },
              { label: "Create", href: "/seller/customer/create" },
              { label: "Details", href: "/seller/customer/details" },
            ]}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={InventoryIcon}
            label="Products"
            hasSubmenu
            isActive={pathname.startsWith("/seller/products")}
            subItems={[
              { label: "List", href: "/seller/products/list" },
              { label: "Edit", href: "/seller/products/edit" },
              { label: "Create", href: "/seller/products/create" },
            ]}
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={ReceiptIcon}
            label="Orders"
            hasSubmenu
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={AccountCircleIcon}
            label="Account"
            hasSubmenu
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={HelpOutlineIcon}
            label="Help Center"
            hasSubmenu
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={CalendarTodayIcon}
            label="Calendar"
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={FolderOpenIcon}
            label="File Manager"
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={MailOutlineIcon}
            label="Mail"
            isCollapsed={isSidebarCollapsed}
          />
          <MenuItem
            icon={ChatBubbleOutlineIcon}
            label="Chat"
            isCollapsed={isSidebarCollapsed}
          />
        </nav>
      </div>
    </aside>
  );
};
