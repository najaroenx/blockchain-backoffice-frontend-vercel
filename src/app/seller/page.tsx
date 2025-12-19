"use client";
import React from "react";
import { MarketingStatCard } from "@/components/seller/MarketingStatCard";
import { AdsPerformanceChart } from "@/components/seller/charts/AdsPerformanceChart";
import { LeadPerformanceScore } from "@/components/seller/charts/LeadPerformanceScore";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";

export default function SellerPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MarketingStatCard
          title="Total marketing spend"
          value="$192,817"
          trend="5.3%"
          isPositive={true}
          icon={<LocalMallOutlinedIcon />}
          iconBgColor="bg-pink-100/50 text-pink-500"
        />
        <MarketingStatCard
          title="ROI"
          value="270%"
          trend="8.1%"
          isPositive={true}
          icon={<AssignmentOutlinedIcon />}
          iconBgColor="bg-blue-100/50 text-blue-500"
        />
        <MarketingStatCard
          title="Conversion rates"
          value="4.5%"
          trend="0.9%"
          isPositive={true}
          icon={<CachedOutlinedIcon />}
          iconBgColor="bg-emerald-100/50 text-emerald-500"
        />
        <MarketingStatCard
          title="Total leads"
          value="1,289"
          trend="16.2%"
          isPositive={true}
          icon={<AdsClickOutlinedIcon />}
          iconBgColor="bg-purple-100/50 text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <AdsPerformanceChart />
        </div>
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <LeadPerformanceScore />
        </div>
      </div>
    </div>
  );
}
