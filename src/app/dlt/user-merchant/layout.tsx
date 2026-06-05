"use client";
import React, { Suspense } from "react";
import { Space_Grotesk, Outfit } from "next/font/google";
import { UserMerchantSidebar } from "../components/userMerchantSidebar";

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

// Simple Header for User Merchant - Light Theme
const UserMerchantHeader = () => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
    <div>
      <h1 className="text-lg font-semibold text-gray-800">
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          DLT
        </span>
        <span className="text-gray-700">loyalty</span>
        <span className="text-gray-400 mx-2">|</span>
        <span className="text-gray-600">ร้านค้า Dashboard</span>
      </h1>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/25">
        ร
      </div>
    </div>
  </header>
);

export default function UserMerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex min-h-screen bg-gray-50 ${spaceGrotesk.variable} ${outfit.variable} font-outfit`}
      style={{
        fontFamily:
          "var(--font-outfit), var(--font-space-grotesk), system-ui, sans-serif",
      }}
    >
      <Suspense fallback={<div className="w-64 bg-white" />}>
        <UserMerchantSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <UserMerchantHeader />
        <main className="flex-1 overflow-auto p-8">
          <Suspense
            fallback={
              <div className="animate-pulse text-gray-500">Loading...</div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
