"use client";
import React from "react";
import { MerchantProvider } from "../../contexts/merchantContext";
import { MerchantHeader } from "../../components/merchantHeader";
import { MerchantSidebar } from "../../components/merchantSidebar";

export default function MerchantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { merchantId: string };
}) {
  const { merchantId } = params;

  return (
    <MerchantProvider value={merchantId}>
      <div className="flex min-h-screen bg-[#0f0f24] font-sans">
        <MerchantSidebar />
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
          <MerchantHeader />
          <main className="flex-1 overflow-auto p-8 text-white">
            {children}
          </main>
        </div>
      </div>
    </MerchantProvider>
  );
}
