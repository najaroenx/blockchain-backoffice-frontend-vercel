"use client";
import React from "react";
import { Space_Grotesk, Outfit } from "next/font/google";
import { MerchantProvider } from "../../contexts/merchantContext";
import { MerchantHeader } from "../../components/merchantHeader";
import { MerchantSidebar } from "../../components/merchantSidebar";

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

export default function MerchantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ merchantId: string }>;
}) {
  const { merchantId } = React.use(params);

  return (
    <MerchantProvider value={merchantId}>
      <div
        className={`flex min-h-screen bg-[#0f0f24] ${spaceGrotesk.variable} ${outfit.variable} font-outfit`}
        style={{
          fontFamily:
            "var(--font-outfit), var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
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
