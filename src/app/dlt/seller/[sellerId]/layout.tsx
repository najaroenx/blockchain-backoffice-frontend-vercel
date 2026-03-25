"use client";
import React from "react";
import { Space_Grotesk, Outfit } from "next/font/google";
import { SellerProvider } from "../../contexts/sellerContext";
import { SellerProvider as SellerDashboardProvider } from "@/contexts/SellerDashboardContext";
import { SellerSidebar } from "@/components/seller/SellerSidebar";
import { SellerHeader } from "@/components/seller/SellerHeader";

// Modern fonts for DLT theme
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export default function SellerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sellerId: string }>;
}) {
  const { sellerId } = React.use(params);

  return (
    <SellerProvider value={sellerId}>
      <SellerDashboardProvider>
        <div
          className={`flex min-h-screen bg-[#0f0f24] ${spaceGrotesk.variable} ${outfit.variable} font-outfit`}
          style={{
            fontFamily:
              "var(--font-outfit), var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          <SellerSidebar />
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
            <SellerHeader />
            <main className="flex-1 overflow-auto p-8 text-white">
              {children}
            </main>
          </div>
        </div>
      </SellerDashboardProvider>
    </SellerProvider>
  );
}
