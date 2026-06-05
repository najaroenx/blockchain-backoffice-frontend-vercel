"use client";
import React from "react";
import { Space_Grotesk, Outfit } from "next/font/google";
import { MerchantProvider } from "@/app/dlt/contexts/merchantContext";

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
    <MerchantProvider value="seller">
      <div
        className={`min-h-screen bg-[#0a0a1a] ${spaceGrotesk.variable} ${outfit.variable}`}
        style={{
          fontFamily:
            "var(--font-outfit), var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        {children}
      </div>
    </MerchantProvider>
  );
}
