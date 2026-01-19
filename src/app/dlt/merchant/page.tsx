"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";
import { api } from "@/libs/api";

const heroSlides = [
  {
    title: "Unlock Digital\nRewards",
    subtitle:
      "Discover exclusive vouchers and digital assets on the blockchain",
    cta: "Shop Collection",
    image: "🎫",
  },
  {
    title: "Premium\nMemberships",
    subtitle: "Get unlimited access to exclusive benefits and rewards",
    cta: "Get Started",
    image: "👑",
  },
  {
    title: "Digital Gift\nCards",
    subtitle: "The perfect gift for friends and family",
    cta: "Browse Gifts",
    image: "🎁",
  },
];

export default function MerchantPage() {
  const { execute } = useApiWithLoading();
  const [merchants, setMerchants] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch merchants on mount
  useEffect(() => {
    const fetchMerchants = async () => {
      const data = await execute(
        () => api("/api/merchant", { method: "GET" }),
        {
          loadingText: "กำลังโหลดข้อมูล Merchant...",
          showSuccessOnComplete: false,
          redirectDelay: 5000,
        }
      );
      if (data) {
        setMerchants(data);
      }
    };
    fetchMerchants();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Hero Carousel */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url('https://wpriverthemes.com/nexux/wp-content/uploads/2024/12/background.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-[#0a0a1a]/70"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 whitespace-pre-line">
                <span className="text-white">
                  {heroSlides[currentSlide].title.split("\n")[0]}
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {heroSlides[currentSlide].title.split("\n")[1]}
                </span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-md">
                {heroSlides[currentSlide].subtitle}
              </p>
              <Link
                href="/dlt/merchant/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
              >
                {heroSlides[currentSlide].cta}
                <span className="text-lg">→</span>
              </Link>

              {/* Slide Indicators */}
              <div className="flex items-center gap-2 mt-8">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-purple-500 w-8"
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Our merchant */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a1a] to-[#0f0f24]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Our Merchants
              </h2>
              <p className="text-gray-400">
                Check out our new arrivals for the latest treats
              </p>
            </div>
            <Link
              href="/dlt/merchant/products"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 transition-all"
            >
              View All
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Add Merchant Card */}
            <Link
              href="/dlt/merchant/create"
              className="group bg-[#1a1a2e] rounded-xl border-2 border-dashed border-white/20 hover:border-purple-500/50 overflow-hidden transition-all hover:scale-[1.02] flex flex-col h-full"
            >
              {/* Placeholder for image area - same aspect as merchant cards */}
              <div className="aspect-square flex items-center justify-center bg-[#12122a]">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-3 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                    <AddIcon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">
                    Add Merchant
                  </p>
                  <p className="text-gray-500 text-xs">Create new store</p>
                </div>
              </div>
              {/* Placeholder for info area */}
              <div className="p-3 flex-1">
                <p className="text-[10px] text-purple-400/50 mb-0.5">
                  New Store
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

            {merchants &&
              merchants.map((merchant: any) => (
                <div
                  key={merchant.id}
                  className="group bg-[#1a1a2e] rounded-xl border border-white/5 hover:border-purple-500/30 overflow-hidden transition-all hover:scale-[1.02] flex flex-col h-full"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={merchant.imageUrl}
                      alt={merchant.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex-1">
                    <p className="text-[10px] text-purple-400 mb-0.5 truncate">
                      {merchant.walletAddress?.slice(0, 12)}...
                    </p>
                    <h3 className="text-white font-semibold text-sm mb-0.5 group-hover:text-purple-400 transition-colors truncate">
                      {merchant.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-2 line-clamp-1">
                      {merchant.description}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/dlt/merchant/${merchant.id}`}
                        target="_blank"
                      >
                        <span className="inline-block px-2 py-0.5 bg-purple-500 text-white text-[10px] font-medium rounded-full">
                          Manage Merchant
                        </span>
                      </Link>
                      <Link href={`/dlt/seller/${merchant.id}`} target="_blank">
                        <span className="inline-block px-2 py-0.5 bg-purple-500 text-white text-[10px] font-medium rounded-full">
                          Manage Seller
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/dlt/merchant/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 transition-all"
            >
              View All Merchants
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-20 bg-[#0f0f24]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://wpriverthemes.com/nexux/wp-content/uploads/2024/12/background.png')`,
              }}
            />
            <div className="relative z-10 p-12 md:p-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Get 20% Off Your First Order
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Sign up today and receive an exclusive discount on your first
                purchase
              </p>
              <Link
                href="/dlt/sign-up"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full transition-all hover:scale-105"
              >
                Sign Up Now
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a1a] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Link href="/dlt" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✦</span>
                </div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-white">DLT</span>
                  <span className="text-purple-400">chain</span>
                </span>
              </Link>
              <p className="text-gray-500 text-sm max-w-md">
                Your trusted marketplace for digital vouchers, gift cards, and
                exclusive memberships powered by blockchain technology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/dlt/merchant/products"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dlt/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dlt/help"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dlt/pricing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>dltloyalty@gmail.com</li>
                <li>+66 81 234 5678</li>
                <li>Bangkok, Thailand</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
            © 2026 DLTloyalty. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
