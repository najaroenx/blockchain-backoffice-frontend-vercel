"use client";
import React, { useState } from "react";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function DLTAboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
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
              <span className="text-purple-400">chain</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dlt"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dlt/about"
              className="text-white font-medium hover:text-purple-400 transition-colors"
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

          {/* CTA Button */}
          <Link
            href="/dlt/sign-in"
            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 transition-all"
          >
            Get Started
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
      <section className="relative pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-purple-400 font-medium">About Us</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="text-white">Experts Driven by Passion</span>
            <br />
            <span className="text-white">and Purpose</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Explore our journey, expertise, and commitment to delivering
            exceptional results over years.
          </p>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full">
            <svg
              className="w-4 h-4 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-gray-300">
              Delivering Excellence for Over 8+ Years
            </span>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#0a0a1a] to-[#0f0f24]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Main Content */}
          <p className="text-2xl md:text-3xl leading-relaxed mb-12">
            <span className="text-white font-medium">
              We&apos;re a passionate team of innovators obsessed with
            </span>
            <br />
            <span className="text-white font-medium">
              using AI to streamline content creation. We believe AI can
            </span>
            <br />
            <span className="text-purple-400">revolu</span>
            <span className="text-gray-500">
              tionise the writing industry by making high-quality
            </span>
            <br />
            <span className="text-gray-500">
              content generation faster and more accessible
            </span>
          </p>

          {/* Mission Statement */}
          <p className="text-xl md:text-2xl leading-relaxed">
            <span className="text-white font-medium">
              Our mission is to address these
            </span>
            <span className="text-gray-500"> challenges head-on by</span>
            <br />
            <span className="text-gray-500">
              developing cutting-edge AI tools that enhance the
            </span>
            <br />
            <span className="text-gray-500">writing process</span>
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-[#0f0f24]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                8+
              </div>
              <p className="text-gray-400 text-sm">Years of Experience</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-gray-400 text-sm">Happy Clients</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                1M+
              </div>
              <p className="text-gray-400 text-sm">Content Generated</p>
            </div>

            {/* Stat 4 */}
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <p className="text-gray-400 text-sm">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#0f0f24] to-[#0a0a1a]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-purple-400 font-medium">Our Team</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Meet the experts behind the magic
            </h2>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center group">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">John Smith</h3>
              <p className="text-purple-400 text-sm mb-2">CEO & Founder</p>
              <p className="text-gray-500 text-sm">
                Visionary leader with 15+ years in tech
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center group">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-4xl">👩‍💻</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Sarah Chen</h3>
              <p className="text-blue-400 text-sm mb-2">CTO</p>
              <p className="text-gray-500 text-sm">
                AI/ML expert and tech innovator
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center group">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-4xl">👨‍🎨</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Mike Johnson
              </h3>
              <p className="text-green-400 text-sm mb-2">Head of Design</p>
              <p className="text-gray-500 text-sm">
                Creative genius with an eye for detail
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 bg-[#0a0a1a]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-purple-400 font-medium">Our Values</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What drives us every day
            </h2>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Value 1 */}
            <div className="p-8 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
              <p className="text-gray-400">
                We constantly push boundaries and explore new possibilities to
                deliver cutting-edge solutions.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-8 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Collaboration
              </h3>
              <p className="text-gray-400">
                We believe great things happen when brilliant minds work
                together towards a common goal.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-8 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Excellence</h3>
              <p className="text-gray-400">
                We strive for excellence in everything we do, from code quality
                to customer support.
              </p>
            </div>

            {/* Value 4 */}
            <div className="p-8 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-pink-400"
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
              <h3 className="text-xl font-bold text-white mb-2">Integrity</h3>
              <p className="text-gray-400">
                We operate with transparency and honesty, building trust with
                every interaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#0a0a1a] to-[#0f0f24]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to join our journey?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Partner with us and experience the future of AI-powered solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dlt/sign-in"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link
              href="/dlt"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-all hover:border-white/20"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f24] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/dlt" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">✦</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">DLT</span>
                <span className="text-purple-400">chain</span>
              </span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/dlt" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/dlt/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/dlt/pricing"
                className="hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/dlt/help"
                className="hover:text-white transition-colors"
              >
                Help Center
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © 2026 DLTloyalty. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
