"use client";
import React from "react";
import { Space_Grotesk, Outfit } from "next/font/google";
import { SellerSidebar } from "@/components/seller/SellerSidebar";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerProvider } from "@/contexts/SellerDashboardContext";

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

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerProvider>
      <div
        className={`flex min-h-screen bg-[#0a0a14] ${spaceGrotesk.variable} ${outfit.variable}`}
        style={{
          fontFamily:
            "var(--font-outfit), var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        <SellerSidebar />
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
          <SellerHeader />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </div>
    </SellerProvider>
  );
}
