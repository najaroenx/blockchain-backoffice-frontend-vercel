"use client";
import React from "react";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";

// Mock sellers data - in real app this would come from API
const mockSellers = [
  {
    id: "seller-001",
    name: "Premium Coffee Shop",
    description: "Specialty coffee and pastries",
    imageUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
    walletAddress: "0x1234...5678",
  },
  {
    id: "seller-002",
    name: "Fashion Boutique",
    description: "Trendy clothing and accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
    walletAddress: "0xabcd...efgh",
  },
  {
    id: "seller-003",
    name: "Tech Store",
    description: "Electronics and gadgets",
    imageUrl:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400",
    walletAddress: "0x9876...5432",
  },
];

export default function SellerPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url('https://wpriverthemes.com/nexux/wp-content/uploads/2024/12/background.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[#0a0a1a]/70"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className="text-white">Seller</span>{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Portal
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Manage your products, track sales, and grow your business with
              DLT-powered marketplace
            </p>
          </div>
        </div>
      </section>

      {/* Sellers Grid */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a1a] to-[#0f0f24]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Your Seller Accounts
              </h2>
              <p className="text-gray-400">Select a seller account to manage</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Add Seller Card */}
            <Link
              href="/dlt/seller/create"
              className="group bg-[#1a1a2e] rounded-xl border-2 border-dashed border-white/20 hover:border-purple-500/50 overflow-hidden transition-all hover:scale-[1.02] flex flex-col h-full"
            >
              <div className="aspect-square flex items-center justify-center bg-[#12122a]">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-3 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                    <AddIcon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">
                    Add Seller
                  </p>
                  <p className="text-gray-500 text-xs">Create new seller</p>
                </div>
              </div>
              <div className="p-3 flex-1">
                <p className="text-[10px] text-purple-400/50 mb-0.5">
                  New Seller
                </p>
                <h3 className="text-white/50 font-semibold text-sm mb-0.5">
                  Click to create
                </h3>
                <p className="text-gray-600 text-xs mb-2">Add your business</p>
                <span className="inline-block px-2 py-0.5 bg-purple-500/30 text-purple-300 text-[10px] font-medium rounded-full">
                  + New
                </span>
              </div>
            </Link>

            {/* Seller Cards */}
            {mockSellers.map((seller) => (
              <Link
                key={seller.id}
                href={`/dlt/seller/${seller.id}`}
                className="group bg-[#1a1a2e] rounded-xl border border-white/5 hover:border-purple-500/30 overflow-hidden transition-all hover:scale-[1.02] flex flex-col h-full"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={seller.imageUrl}
                    alt={seller.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 flex-1">
                  <p className="text-[10px] text-purple-400 mb-0.5 truncate">
                    {seller.walletAddress}
                  </p>
                  <h3 className="text-white font-semibold text-sm mb-0.5 group-hover:text-purple-400 transition-colors truncate">
                    {seller.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-1">
                    {seller.description}
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-purple-500 text-white text-[10px] font-medium rounded-full">
                    Manage
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a1a] border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 DLTloyalty. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
