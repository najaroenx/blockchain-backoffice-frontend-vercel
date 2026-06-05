"use client";
import React, { useState } from "react";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  articles: number;
  icon: React.ReactNode;
  color: string;
}

const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Quick setup guide to help you navigate our platform effortlessly.",
    articles: 12,
    icon: <RocketLaunchOutlinedIcon className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "Customize your dashboard for easy access to metrics and tools.",
    articles: 8,
    icon: <DashboardOutlinedIcon className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "contract",
    title: "Contract",
    description:
      "Understand your service agreement, including terms and conditions.",
    articles: 6,
    icon: <DescriptionOutlinedIcon className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Track performance and generate reports to make decisions easily.",
    articles: 14,
    icon: <BarChartOutlinedIcon className="w-5 h-5" />,
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "budgeting",
    title: "Budgeting",
    description:
      "Create and manage budgets to stay on top of your financial goals.",
    articles: 5,
    icon: <AccountBalanceWalletOutlinedIcon className="w-5 h-5" />,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "accounts",
    title: "Accounts",
    description:
      "Manage user accounts and security settings to ensure data protection.",
    articles: 9,
    icon: <PersonOutlineIcon className="w-5 h-5" />,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "transaction",
    title: "Transaction",
    description:
      "View and categorize transactions for streamlined financial tracking.",
    articles: 7,
    icon: <ReceiptOutlinedIcon className="w-5 h-5" />,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "troubleshoot",
    title: "Troubleshoot",
    description:
      "Find quick solutions to common issues for a seamless experience.",
    articles: 15,
    icon: <BuildOutlinedIcon className="w-5 h-5" />,
    color: "from-red-500 to-orange-500",
  },
];

export default function DLTHelpCenterPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = helpCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/dlt/help"
              className="text-white font-medium hover:text-purple-400 transition-colors"
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
      <section className="relative pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-purple-400 font-medium">Help Center</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="text-white">All-in-One Intellectual</span>
            <br />
            <span className="text-white">Resource Hub</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            A centralized platform with articles, tutorials, and community
            insights.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative flex items-center bg-[#1a1a2e] rounded-full border border-white/10 overflow-hidden">
              <div className="pl-5">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
              <button className="px-6 py-2.5 m-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories Grid */}
      <section className="relative py-16 bg-gradient-to-b from-[#0a0a1a] to-[#0f0f24]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/dlt/help/${category.id}`}
                className="group p-6 bg-[#1a1a2e] rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all hover:scale-[1.02]"
              >
                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {category.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {category.articles} Articles
                  </span>
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {category.icon}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                No results found for &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 bg-[#0f0f24]">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-purple-400 font-medium">FAQ</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            <FAQItem
              question="How do I get started with DLTloyalty?"
              answer="Getting started is easy! Simply create an account, verify your email, and follow our quick setup guide. You'll be up and running in minutes."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum."
            />
            <FAQItem
              question="Is there a free trial available?"
              answer="Yes! We offer a 14-day free trial with full access to all features. No credit card required."
            />
            <FAQItem
              question="How can I contact support?"
              answer="You can reach our support team 24/7 via live chat, email at support@dltloyalty.com, or through our ticket system."
            />
            <FAQItem
              question="Can I upgrade or downgrade my plan?"
              answer="Absolutely! You can change your plan at any time from your account settings. Changes take effect immediately."
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#0f0f24] to-[#0a0a1a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still need help?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="mailto:support@dltloyalty.com"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
            >
              Contact Support
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
      <footer className="bg-[#0a0a1a] border-t border-white/5 py-12">
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

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-white">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-gray-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
