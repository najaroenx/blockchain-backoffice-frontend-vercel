"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SellerDashboardContextProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const SellerDashboardContext = createContext<
  SellerDashboardContextProps | undefined
>(undefined);

export const SellerProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <SellerDashboardContext.Provider
      value={{ isSidebarCollapsed, toggleSidebar }}
    >
      {children}
    </SellerDashboardContext.Provider>
  );
};

export const useSellerDashboard = () => {
  const context = useContext(SellerDashboardContext);
  if (!context) {
    throw new Error("useSellerDashboard must be used within a SellerProvider");
  }
  return context;
};
