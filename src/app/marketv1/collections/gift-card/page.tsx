"use client";
import React from "react";
import { Navbar, Footer, ProductCard } from "../../components";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";

export default function GiftCardCollectionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-slate-50 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Gift Card Popular
        </h1>
        {/* Breadcrumb Mockup */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>Home</span>
          <span className="text-[10px]">›</span>
          <span className="text-slate-900 font-medium">Gift Card Popular</span>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[88px] z-40 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 md:px-12 py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Filter */}
          <button className="flex items-center gap-2 font-bold text-slate-900 uppercase text-xs tracking-wider border border-slate-200 px-6 py-3 rounded hover:border-slate-900 transition-colors">
            <FilterListIcon fontSize="small" /> Filter
          </button>

          {/* Grid Toggle (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <button className="hover:text-slate-900 transition-colors">
              <ViewComfyIcon />
            </button>
            <button className="text-slate-900">
              <CalendarViewMonthIcon />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <span className="text-sm text-slate-500 font-medium">
              Showing 6 of 24 products
            </span>
          </div>

          {/* Sort */}
          <div className="relative">
            <button className="flex items-center gap-2 text-sm font-medium text-slate-900 border border-slate-200 px-4 py-3 rounded hover:border-slate-900 transition-colors bg-white min-w-[160px] justify-between">
              Best selling <KeyboardArrowDownIcon fontSize="small" />
            </button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {/* Card 1: Boutique */}
            <ProductCard
              title="Boutique eGift Card"
              price="268.00"
              color="bg-pink-400"
              brandName="Beginning"
            />

            {/* Card 2: AWS */}
            <ProductCard
              title="AWS eGift Card"
              price="121.00"
              color="bg-slate-800"
              brandName="amazon"
              textColor="text-white"
            />

            {/* Card 3: Bodum */}
            <ProductCard
              title="Bodums eGift Card"
              price="33.00"
              color="bg-red-600"
              brandName="bodum"
              textColor="text-white"
            />

            {/* Card 4: Jay Jays */}
            <ProductCard
              title="Jay Jays eGift Card"
              price="10.00"
              color="bg-yellow-400"
              brandName="Jay Jays"
            />

            {/* Card 5: Adventure */}
            <ProductCard
              title="Adventure eGift Card"
              price="10.00"
              color="bg-sky-600"
              brandName="ADVENTURE"
              textColor="text-white"
            />

            {/* Card 6: BP */}
            <ProductCard
              title="Bp eGift Card"
              price="10.00"
              color="bg-emerald-600"
              brandName="bp"
              textColor="text-white"
            />

            {/* Card 7: Placeholder */}
            <ProductCard
              title="Cinema eGift Card"
              price="50.00"
              color="bg-purple-600"
              brandName="Cinema"
              textColor="text-white"
            />

            {/* Card 8: Placeholder */}
            <ProductCard
              title="Spotify Classic"
              price="15.00"
              color="bg-green-500"
              brandName="Spotify"
              textColor="text-white"
            />
          </div>

          {/* Pagination Mockup */}
          <div className="flex justify-center mt-16 gap-2">
            <button className="w-10 h-10 flex items-center justify-center border border-slate-900 bg-slate-900 text-white rounded font-medium">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-600 rounded font-medium hover:bg-slate-50">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-600 rounded font-medium hover:bg-slate-50">
              3
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-600 rounded font-medium hover:bg-slate-50">
              →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
