"use client";
import React, { useState } from "react";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular: boolean;
  buttonText: string;
  buttonStyle: "primary" | "secondary" | "outline";
  iconColor: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description:
      "Harnessing the power of Artificial Intelligence to revolutionize industries and enhance human experiences.",
    monthlyPrice: 39.99,
    yearlyPrice: 399.99,
    features: [
      "30+ Features",
      "Priority Support",
      "8 Team Members",
      "Premium Features",
      "Data Insights",
    ],
    isPopular: false,
    buttonText: "Get Started",
    buttonStyle: "outline",
    iconColor: "from-purple-400 to-purple-600",
  },
  {
    id: "standard",
    name: "Standard",
    description:
      "Harnessing the power of artificial intelligence to revolutionize industries and enhance human experiences.",
    monthlyPrice: 69.99,
    yearlyPrice: 699.99,
    features: [
      "50+ Features",
      "Get mixed Support",
      "12 Team Members",
      "Premium Features",
      "Data Insights",
    ],
    isPopular: true,
    buttonText: "Get Started",
    buttonStyle: "primary",
    iconColor: "from-blue-400 to-cyan-400",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "Harnessing the power of artificial intelligence to revolutionize industries and enhance human experiences.",
    monthlyPrice: 89.99,
    yearlyPrice: 899.99,
    features: [
      "100+ Features",
      "Lifetime Support",
      "100 Team Members",
      "All templates unlocked",
      "In-Depth Data Insights",
    ],
    isPopular: false,
    buttonText: "Contact Us",
    buttonStyle: "outline",
    iconColor: "from-orange-400 to-yellow-400",
  },
];

export default function DLTPricingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
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
              className="text-gray-400 hover:text-white transition-colors"
            >
              Help Center
            </Link>
            <Link
              href="/dlt/pricing"
              className="text-white font-medium hover:text-purple-400 transition-colors"
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
            <span className="text-purple-400 font-medium">Subscription</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="text-white">Get Your Package Tailored</span>
            <br />
            <span className="text-white">to Your Unique Needs</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Pick your <span className="text-purple-400 font-medium">Plan</span>{" "}
            and Start Limitless your Creativity from now
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-[#1a1a2e] rounded-full p-1 border border-white/10">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "annual"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Annual
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 rounded-3xl border transition-all ${
                  plan.isPopular
                    ? "bg-[#1a1a2e] border-purple-500/50 scale-105 shadow-2xl shadow-purple-500/10 z-10"
                    : "bg-[#0f0f24] border-white/5 hover:border-white/10"
                }`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                      plan.iconColor
                    } flex items-center justify-center shadow-lg ${
                      plan.isPopular ? "shadow-purple-500/30" : ""
                    }`}
                  >
                    <svg
                      className="w-7 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>

                {/* Plan Name */}
                <h3
                  className={`text-xl font-bold mb-3 ${
                    plan.isPopular ? "text-white" : "text-white"
                  }`}
                >
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.isPopular
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-white/5 text-gray-400"
                        }`}
                      >
                        <CheckIcon className="w-3 h-3" />
                      </div>
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className={`text-4xl font-bold ${
                      plan.isPopular ? "text-white" : "text-white"
                    }`}
                  >
                    $
                    {billingPeriod === "monthly"
                      ? plan.monthlyPrice
                      : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-500 text-sm">
                    /{billingPeriod === "monthly" ? "per month" : "per year"}
                  </span>
                </div>

                {/* Button */}
                <Link
                  href="/dlt/sign-in"
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    plan.buttonStyle === "primary"
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  {plan.buttonText}
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

                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="relative py-20 bg-gradient-to-b from-[#0a0a1a] to-[#0f0f24]">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-purple-400 font-medium">Compare Plans</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What&apos;s included in each plan
            </h2>
          </div>

          {/* Comparison Table */}
          <div className="bg-[#1a1a2e] rounded-3xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-4 text-center border-b border-white/5">
              <div className="p-4"></div>
              <div className="p-4 text-white font-medium">Basic</div>
              <div className="p-4 text-purple-400 font-medium">Standard</div>
              <div className="p-4 text-white font-medium">Enterprise</div>
            </div>

            <ComparisonRow
              feature="API Access"
              basic={true}
              standard={true}
              enterprise={true}
            />
            <ComparisonRow
              feature="Custom Integrations"
              basic={false}
              standard={true}
              enterprise={true}
            />
            <ComparisonRow
              feature="Priority Support"
              basic={false}
              standard={true}
              enterprise={true}
            />
            <ComparisonRow
              feature="Advanced Analytics"
              basic={false}
              standard={false}
              enterprise={true}
            />
            <ComparisonRow
              feature="Dedicated Account Manager"
              basic={false}
              standard={false}
              enterprise={true}
            />
            <ComparisonRow
              feature="SLA Guarantee"
              basic={false}
              standard={false}
              enterprise={true}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 bg-[#0f0f24]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Questions about pricing?
            </h2>
            <p className="text-gray-400 mt-4">
              Contact our sales team for custom enterprise solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="mailto:sales@dltloyalty.com"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
            >
              Contact Sales
            </Link>
            <Link
              href="/dlt/help"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-all hover:border-white/20"
            >
              Visit Help Center
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

// Comparison Row Component
function ComparisonRow({
  feature,
  basic,
  standard,
  enterprise,
}: {
  feature: string;
  basic: boolean;
  standard: boolean;
  enterprise: boolean;
}) {
  return (
    <div className="grid grid-cols-4 text-center border-b border-white/5 last:border-b-0">
      <div className="p-4 text-left text-gray-400 text-sm">{feature}</div>
      <div className="p-4">
        {basic ? (
          <CheckIcon className="w-5 h-5 text-green-400 mx-auto" />
        ) : (
          <span className="text-gray-600">—</span>
        )}
      </div>
      <div className="p-4 bg-purple-500/5">
        {standard ? (
          <CheckIcon className="w-5 h-5 text-purple-400 mx-auto" />
        ) : (
          <span className="text-gray-600">—</span>
        )}
      </div>
      <div className="p-4">
        {enterprise ? (
          <CheckIcon className="w-5 h-5 text-green-400 mx-auto" />
        ) : (
          <span className="text-gray-600">—</span>
        )}
      </div>
    </div>
  );
}
