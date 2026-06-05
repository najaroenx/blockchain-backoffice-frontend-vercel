"use client";
import React, { useState } from "react";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";

export default function DLTLandingPage() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Determine where "Get Started" should go
  const getStartedLink = session ? "/dlt/merchant" : "/dlt/sign-in";

  const toggleSubmenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 w-[85%] max-w-[320px] h-full bg-[#0a0a1a] transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Link
                href="/dlt"
                className="flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✦</span>
                </div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-white">DLT</span>
                  <span className="text-purple-400">loyalty</span>
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <Link
                href="/dlt"
                className="block px-6 py-4 text-white font-semibold text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </Link>

              {/* Pages Submenu */}
              <div>
                <button
                  onClick={() => toggleSubmenu("pages")}
                  className="w-full flex items-center justify-between px-6 py-4 text-white font-semibold text-lg"
                >
                  PAGES
                  <KeyboardArrowDownIcon
                    className={`w-5 h-5 transition-transform ${
                      expandedMenu === "pages" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenu === "pages" && (
                  <div className="pl-8 pb-2">
                    <Link
                      href="/dlt/about"
                      className="block px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/dlt/help"
                      className="block px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Help Center
                    </Link>
                    <Link
                      href="/dlt/pricing"
                      className="block px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                  </div>
                )}
              </div>

              {/* CMS Submenu */}
              <div>
                <button
                  onClick={() => toggleSubmenu("cms")}
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-500 font-semibold text-lg"
                >
                  CMS
                  <KeyboardArrowDownIcon
                    className={`w-5 h-5 transition-transform ${
                      expandedMenu === "cms" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenu === "cms" && (
                  <div className="pl-8 pb-2">
                    <Link
                      href="/marketplace"
                      className="block px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Marketplace
                    </Link>
                    <Link
                      href="/dlt/seller"
                      className="block px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Seller Dashboard
                    </Link>
                  </div>
                )}
              </div>

              {/* Utility Pages Submenu */}
              <div>
                <button
                  onClick={() => toggleSubmenu("utility")}
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-500 font-semibold text-lg"
                >
                  UTILITY PAGES
                  <KeyboardArrowDownIcon
                    className={`w-5 h-5 transition-transform ${
                      expandedMenu === "utility" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedMenu === "utility" && (
                  <div className="pl-8 pb-2">
                    <Link
                      href={getStartedLink}
                      className="block px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/dlt/sign-up"
                      className="block px-6 py-3 text-gray-400 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* App Store Buttons */}
              <div className="flex gap-3 px-6 mt-6">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h15c.83 0 1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5zm7.5-5.5l2.5-4.5 2.5 4.5h-5z" />
                  </svg>
                  <span className="text-sm font-medium">Play Store</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" />
                  </svg>
                  <span className="text-sm font-medium">App Store</span>
                </a>
              </div>
            </div>

            {/* Contact Section */}
            <div className="p-6 border-t border-white/10">
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-gray-500">Address:</span> Bangkok,
                  Thailand
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Email:</span>{" "}
                  dltloyalty@gmail.com
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Call:</span> +66 81 234 5678
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.374 0 0 5.374 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.626-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dlt" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">✦</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">DLT</span>
              <span className="text-purple-400">loyalty</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dlt"
              className="text-white font-medium hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dlt/about"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/dlt/help"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Help Center
            </Link>
            <Link
              href="/dlt/pricing"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                All Pages
                <KeyboardArrowDownIcon className="w-4 h-4" />
              </button>
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a2e] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                  <Link
                    href="/marketplace"
                    className="block px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Marketplace
                  </Link>
                  <Link
                    href="/dlt/seller"
                    className="block px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Seller Dashboard
                  </Link>
                  <Link
                    href="/portal"
                    className="block px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Portal
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dlt/seller"
              className="px-6 py-2.5 border border-purple-500/50 hover:border-purple-400 text-purple-400 hover:text-purple-300 font-medium rounded-full transition-all"
            >
              Seller
            </Link>
            <Link
              href={getStartedLink}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              Get Started
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://wpriverthemes.com/nexux/wp-content/uploads/2024/12/background.png')`,
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">AI Driven</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">Transform Your Business</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              with AI-Powered Solutions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Our AI platform automates repetitive tasks, streamlines workflows,
            and helps you focus on what matters most.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={getStartedLink}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/dlt/about"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-all hover:border-white/20"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-32 bg-gradient-to-b from-[#0a0a1a] to-[#0f0f24]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-purple-400 font-medium">About Us</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
          </div>

          {/* Section Content */}
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
            <span className="text-white">
              We&apos;re a passionate team of innovators obsessed
            </span>
            <br />
            <span className="text-white">with using AI to </span>
            <span className="text-gray-500">
              streamline content creation. We
            </span>
            <br />
            <span className="text-gray-500">
              believe AI can revolutionise the writing industry by
            </span>
            <br />
            <span className="text-gray-500">
              making high-quality content generation faster
            </span>
            <br />
            <span className="text-gray-500">and more accessible</span>
          </h2>

          {/* CTA Button */}
          <Link
            href="/dlt/about"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 transition-all hover:border-white/20 mt-8"
          >
            Discover Our Story
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-[#0f0f24]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-purple-400 font-medium">Features</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Everything you need to succeed
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Experience blazing fast performance with our optimized
                infrastructure and cutting-edge technology stack.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Secure & Reliable
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Enterprise-grade security with 99.9% uptime guarantee. Your data
                is protected with the latest encryption standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Easy to Use</h3>
              <p className="text-gray-400 leading-relaxed">
                Intuitive interface designed for everyone. No technical
                expertise required to get started and see results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-b from-[#0f0f24] to-[#0a0a1a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of businesses already transforming their operations
            with our AI-powered solutions.
          </p>
          <Link
            href={getStartedLink}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
          >
            Get Started Now
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#0a0a1a] overflow-hidden min-h-[600px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{
            backgroundImage: `url('https://wpriverthemes.com/nexux/wp-content/uploads/2024/12/bg-footer.jpg')`,
          }}
        />

        <div className="relative z-10 h-full flex flex-col">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-6 py-12 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Column 1 - Company Info */}
              <div>
                <Link href="/dlt" className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✦</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    <span className="text-white">DLT</span>
                    <span className="text-purple-400">chain</span>
                  </span>
                </Link>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Revolutionize the writing industry by making high-quality
                  content generation faster
                </p>
              </div>

              {/* Column 2 - Contact Info */}
              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Email</p>
                  <a
                    href="mailto:dltloyalty@gmail.com"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    dltloyalty@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Phone number</p>
                  <p className="text-white">+66 81 234 5678</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Location</p>
                  <p className="text-white">Bangkok, Thailand</p>
                </div>
              </div>

              {/* Column 3 - Newsletter */}
              <div>
                <p className="text-gray-400 text-sm mb-6">
                  Subscribe to your newsletter
                </p>
                {/* Underline Input Style */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                    />
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-transparent hover:bg-white/5 text-white font-medium rounded-full border border-white/30 transition-colors flex items-center gap-2">
                  Submit
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </button>

                {/* Social Icons - Outline Style */}
                <div className="flex items-center gap-3 mt-6">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489-.094-.846-.179-2.144.037-3.067.195-.833 1.249-5.298 1.249-5.298s-.319-.637-.319-1.578c0-1.478.856-2.58 1.923-2.58.906 0 1.343.68 1.343 1.495 0 .91-.58 2.271-.879 3.534-.25 1.056.53 1.917 1.573 1.917 1.889 0 3.339-1.99 3.339-4.866 0-2.544-1.827-4.323-4.435-4.323-3.022 0-4.795 2.266-4.795 4.611 0 .912.352 1.892.791 2.424a.318.318 0 01.073.305c-.08.335-.261 1.056-.296 1.203-.046.193-.153.234-.354.141-1.322-.615-2.148-2.547-2.148-4.099 0-3.337 2.426-6.402 6.996-6.402 3.672 0 6.527 2.616 6.527 6.111 0 3.648-2.299 6.582-5.49 6.582-1.072 0-2.079-.557-2.424-1.215l-.659 2.513c-.238.917-.881 2.066-1.311 2.768a12.03 12.03 0 003.468.509c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="max-w-7xl mx-auto px-6 py-4 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Copyright - DLTloyalty | Designed by{" "}
              <span className="text-purple-400">&quot;DLT Team&quot;</span> |
              License | Powered by{" "}
              <span className="text-purple-400">Next.js</span>
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Back to top
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          </div>

          {/* Large Watermark Text - Much Bigger */}
          <div className="flex-1 flex items-end justify-center pb-8 overflow-hidden">
            <span
              className="text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] font-bold tracking-tight select-none leading-none"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 80px rgba(139, 92, 246, 0.3)",
              }}
            >
              DLTloyalty
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
