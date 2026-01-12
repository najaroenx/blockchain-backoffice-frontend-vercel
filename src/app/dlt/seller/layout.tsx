"use client";
import React from "react";
import { SellerSidebar } from "@/components/seller/SellerSidebar";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerProvider } from "@/contexts/SellerDashboardContext";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerProvider>
      <div className="flex min-h-screen bg-[#0a0a14] font-sans">
        <SellerSidebar />
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
          <SellerHeader />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </div>
    </SellerProvider>
  );
}
