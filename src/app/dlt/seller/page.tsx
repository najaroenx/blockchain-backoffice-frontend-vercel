"use client";
import React from "react";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  trend,
  isPositive,
  icon,
  iconColor,
}: StatCardProps) => (
  <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {isPositive ? (
          <TrendingUpIcon className="w-4 h-4" />
        ) : (
          <TrendingDownIcon className="w-4 h-4" />
        )}
        {trend}
      </div>
    </div>
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-white">{value}</h3>
  </div>
);

export default function SellerPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Marketing Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Overview of your marketing performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Marketing Spend"
          value="฿192,817"
          trend="+5.3%"
          isPositive={true}
          icon={<LocalMallOutlinedIcon className="w-6 h-6" />}
          iconColor="bg-pink-500/20 text-pink-400"
        />
        <StatCard
          title="ROI"
          value="270%"
          trend="+8.1%"
          isPositive={true}
          icon={<AssignmentOutlinedIcon className="w-6 h-6" />}
          iconColor="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          title="Conversion Rate"
          value="4.5%"
          trend="+0.9%"
          isPositive={true}
          icon={<CachedOutlinedIcon className="w-6 h-6" />}
          iconColor="bg-emerald-500/20 text-emerald-400"
        />
        <StatCard
          title="Total Leads"
          value="1,289"
          trend="+16.2%"
          isPositive={true}
          icon={<AdsClickOutlinedIcon className="w-6 h-6" />}
          iconColor="bg-purple-500/20 text-purple-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ads Performance Chart */}
        <div className="lg:col-span-2 bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Ads Performance
              </h3>
              <p className="text-sm text-gray-400">Weekly overview</p>
            </div>
            <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const heights = [60, 80, 45, 90, 70, 55, 85];
              return (
                <div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-lg transition-all hover:opacity-80"
                    style={{ height: `${heights[i]}%` }}
                  />
                  <span className="text-xs text-gray-500">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Performance Score */}
        <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Lead Score</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="352"
                  strokeDashoffset="88"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">75%</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">Average Lead Quality</p>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Hot Leads</span>
              <span className="text-sm font-medium text-emerald-400">324</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Warm Leads</span>
              <span className="text-sm font-medium text-amber-400">512</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Cold Leads</span>
              <span className="text-sm font-medium text-gray-400">453</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
