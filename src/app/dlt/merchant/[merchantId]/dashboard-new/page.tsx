"use client";
import { useState, useEffect } from "react";
import { Montserrat } from "next/font/google";
import dynamic from "next/dynamic";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import { ApexOptions } from "apexcharts";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";
import { api } from "@/libs/api";
import DateRangeFilter from "@/app/dlt/components/DateRangeFilter";
import dayjs, { Dayjs } from "dayjs";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

// Dynamic import for Chart.js Bar (no SSR)
const SalesBarChartDark = dynamic(
  () => import("@/app/dlt/components/SalesBarChartDark"),
  { ssr: false },
);

// Dynamic import for ApexCharts (no SSR)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Product Row (Dark Theme)
const ProductRow = ({
  name,
  unitsSold,
  sales,
  rating,
  badgeColor = "bg-emerald-500/20 text-emerald-400",
}: {
  name: string;
  unitsSold: number;
  sales: string;
  rating: number;
  badgeColor?: string;
}) => (
  <div className="flex items-center py-4 border-b border-gray-700/50 last:border-b-0">
    <p className="text-sm text-gray-300 font-medium flex-1">{name}</p>
    <div className="w-20 flex justify-center">
      <span
        className={`${badgeColor} px-4 py-1 rounded-md text-xs font-semibold`}
      >
        {unitsSold}
      </span>
    </div>
    <p className="text-sm text-gray-300 w-20 text-center">
      ${sales.replace("$", "")}
    </p>
    <div className="flex items-center gap-1 w-16 justify-end">
      <StarIcon className="w-4 h-4 text-amber-400" />
      <span className="text-sm text-gray-300">{rating}</span>
    </div>
  </div>
);

// Category Row (Dark Theme)
const CategoryRow = ({
  name,
  value,
  count,
  bgColor,
  textColor,
}: {
  name: string;
  value: string;
  count: string;
  bgColor: string;
  textColor: string;
}) => (
  <div
    className={`flex items-center justify-between py-3 px-4 rounded-full ${bgColor}`}
  >
    <span className={`text-sm font-semibold ${textColor}`}>{name}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-100">{value}</span>
      <span className="text-xs text-gray-400">{count}</span>
    </div>
  </div>
);

// Customer Row (Dark Theme)
const CustomerRow = ({
  name,
  initial,
  color,
}: {
  name: string;
  initial: string;
  color: string;
}) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-sm font-medium`}
      >
        {initial}
      </div>
      <span className="text-sm text-gray-300">{name}</span>
    </div>
    <button className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700 transition-colors">
      <AddIcon className="w-4 h-4 text-gray-400" />
    </button>
  </div>
);

export default function DashboardNewPage({
  params,
}: {
  params: { merchantId: string };
}) {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  // Line Chart Options (Dark Theme)
  const lineChartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: true },
      background: "transparent",
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 },
    },
    colors: ["#a78bfa"],
    tooltip: { enabled: false },
    theme: { mode: "dark" },
  };
  // Donut Chart Options (Dark Theme)
  const donutChartOptions: ApexOptions = {
    chart: { type: "donut", background: "transparent" },
    labels: ["Cake", "Donut", "Bread", "US Point", "Brue Point", "Horror"],
    colors: ["#6366f1", "#60a5fa", "#f472b6", "#bef264", "#a5b4fc"],
    legend: {
      position: "bottom",
      fontSize: "11px",
      markers: { size: 5 },
      itemMargin: { horizontal: 8 },
      labels: { colors: "#9ca3af" },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: { size: "55%" },
      },
    },
    stroke: { show: false },
    theme: { mode: "dark" },
    fill: {
      type: ["pattern", "solid", "solid", "solid", "solid"],
      pattern: {
        style: [
          "verticalLines",
          "horizontalLines",
          "horizontalLines",
          "horizontalLines",
          "horizontalLines",
        ],
        width: 4,
        height: 4,
        strokeWidth: 2,
      },
    },
  };
  // Donut Chart Options (Dark Theme)
  const donutChartOptionsTransaction: ApexOptions = {
    chart: { type: "donut", background: "transparent" },
    labels: ["Transfer", "Redeem Point"],
    colors: ["#6366f1", "#60a5fa", "#f472b6", "#bef264", "#a5b4fc"],
    legend: {
      position: "bottom",
      fontSize: "11px",
      markers: { size: 5 },
      itemMargin: { horizontal: 8 },
      labels: { colors: "#9ca3af" },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: { size: "55%" },
      },
    },
    stroke: { show: false },
    theme: { mode: "dark" },
    fill: {
      type: ["pattern", "solid", "solid", "solid", "solid"],
      pattern: {
        style: [
          "verticalLines",
          "horizontalLines",
          "horizontalLines",
          "horizontalLines",
          "horizontalLines",
        ],
        width: 4,
        height: 4,
        strokeWidth: 2,
      },
    },
  };
  // Overview Bar Chart (Dark Theme)
  const overviewChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      background: "transparent",
    },
    labels: ["26 Feb", "29 Feb", "1 Mar", "2 Mar", "3 Mar", "4 Mar"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        columnWidth: "40%",
      },
    },
    colors: ["#a78bfa", "#fbbf24", "#4ade80"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["A", "B", "C", "D", "E", "F", "G", "H", "D", "D"],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    legend: { show: false },
    theme: { mode: "dark" },
  };

  return (
    <div className={`min-h-screen p-6 ${montserrat.className}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {/* Row 1: Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Orders Provided */}
          <div className="rounded-2xl shadow-lg shadow-black/20 overflow-hidden border border-gray-800 flex flex-col h-full">
            {/* Top section - Orders Provided (Dark) */}
            <div className="bg-gray-800/80 backdrop-blur-sm p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📊</span>
                    <p className="text-lg text-white font-semibold">
                      จำนวนคูปอง ทั้งหมด
                    </p>
                  </div>
                  <h3 className="text-4xl font-bold text-white">2.36k</h3>
                </div>
                {/* Mini line chart */}
                <div className="w-20 h-10">
                  <Chart
                    options={{
                      ...lineChartOptions,
                      colors: ["#a78bfa"],
                      stroke: { curve: "smooth", width: 2 },
                      fill: { type: "solid", opacity: 0 },
                    }}
                    series={[{ data: [8, 15, 10, 18, 12, 20, 15] }]}
                    type="line"
                    height="100%"
                  />
                </div>
              </div>
            </div>

            {/* Order Import Section (Purple Gradient) */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-5 rounded-t-3xl -mt-4 flex-1">
              <p className="text-lg text-white font-semibold">
                จำนวนคูปองที่เรามี
              </p>
              <p className="text-xs text-purple-200 flex items-center gap-1 mt-1">
                📅 {startDate?.toISOString().split("T")[0]} -{" "}
                {endDate?.toISOString().split("T")[0]}
              </p>
              <h4 className="text-4xl font-bold text-white mt-4">2,450</h4>

              {/* Progress Bar */}
              <div className="mt-5">
                <div className="h-2 flex gap-1">
                  <div className="h-full bg-purple-900/80 rounded-full w-[50%]" />
                  <div className="h-full bg-purple-400/80 rounded-full w-[35%]" />
                  <div className="h-full bg-purple-300/60 rounded-full w-[15%]" />
                </div>
                <div className="flex justify-between text-[11px] text-white mt-2">
                  <span>Productive</span>
                  <span>Middle</span>
                  <span>Idle</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Sold */}
          <div className="rounded-2xl shadow-lg shadow-black/20 overflow-hidden border border-gray-800">
            {/* Top section - Pink/Purple gradient */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-5 pt-6 pb-6 relative">
              {/* Arrow button */}
              <button className="absolute top-3 right-3 w-9 h-9 bg-pink-400/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-md hover:bg-pink-400/70 transition-colors">
                <span className="text-lg">↗</span>
              </button>

              <p className="text-base text-white font-bold">ขายทั้งหมด</p>

              {/* Line Chart */}
              <div className="h-14 mt-3">
                <Chart
                  options={{
                    ...lineChartOptions,
                    colors: ["#831843"],
                    stroke: { curve: "smooth", width: 2 },
                    fill: { type: "solid", opacity: 0 },
                  }}
                  series={[{ data: [12, 18, 10, 22, 8, 15, 25, 12, 20] }]}
                  type="line"
                  height="100%"
                />
              </div>

              <h3 className="text-4xl font-bold text-white mt-3">$6.56k</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-pink-100">Last Week</span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded">
                  -45%
                </span>
              </div>
            </div>

            {/* Store Product Section (Dark) */}
            <div className="grid grid-cols-2">
              <div className="bg-gray-800/80 backdrop-blur-sm p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 font-medium">
                    📁 รอใช้งาน
                  </p>
                  <p className="text-4xl font-bold text-white mt-1">-6,876</p>
                </div>
                {/* Circular Progress */}
                <div className="w-16 h-16">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="62, 88"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 font-medium">
                    📁 Redeem แล้ว
                  </p>
                  <p className="text-4xl font-bold text-white mt-1">-6,876</p>
                </div>
                {/* Circular Progress */}
                <div className="w-16 h-16">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="62, 88"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart - Using Chart.js with patterns */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 col-span-1 lg:col-span-2 border border-gray-700/50">
            <p className="text-sm font-semibold text-white mb-3">
              มูลค่าคูปอง (THB)
            </p>
            <div className="h-[180px]">
              <SalesBarChartDark
                label="THB Token"
                values={[100, 200, 150, 100]}
                labels={["มูลค่าทั้งหมด", "ขายแล้ว", "รอใช้", "Redeem แล้ว"]}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Top Products, Sales by Country, Customer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50">
            <p className="text-sm font-semibold text-white mb-4">
              Transactions
            </p>
            <div className="h-[200px]">
              <Chart
                options={donutChartOptionsTransaction}
                series={[35, 25]}
                type="donut"
                height="100%"
              />
            </div>
          </div>

          {/* Sales by Country */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">
              ข้อมูล End User
            </p>
            <div className="grid grid-cols-3 gap-3 auto-rows-[200px]">
              {/* Germany */}
              <div className="bg-gray-700/50 rounded-xl p-4 text-center hover:bg-gray-700/80 transition-colors flex flex-col items-center justify-center">
                <div
                  className="flex items-center justify-center"
                  style={{ width: "70px", height: "70px" }}
                >
                  <DotLottiePlayer
                    src="/images/FemaleAvatar.lottie" // ใส่ path ของไฟล์ในโฟลเดอร์ public
                    autoplay
                    loop
                  ></DotLottiePlayer>
                </div>
                <p className="text-sm font-semibold text-gray-100 mt-2">
                  จำนวน Users
                </p>
                <p className="text-sm text-gray-400">100</p>
              </div>

              {/* Australia - Highlighted */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-center relative overflow-hidden shadow-lg shadow-purple-500/20 flex flex-col items-center justify-center">
                {/* Globe watermark */}
                <div className="absolute -right-4 -bottom-4 opacity-20">
                  <span className="text-6xl">🌐</span>
                </div>
                {/* Online indicator */}
                <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div
                  className="flex items-center justify-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <DotLottiePlayer
                    src="/images/Buying.lottie" // ใส่ path ของไฟล์ในโฟลเดอร์ public
                    autoplay
                    loop
                  ></DotLottiePlayer>
                </div>
                <p className="text-sm font-semibold text-white mt-2">
                  คนที่ซื้อ
                </p>
                <p className="text-sm text-purple-200">43</p>
              </div>

              {/* Canada */}
              <div className="bg-gray-700/50 rounded-xl p-4 text-center hover:bg-gray-700/80 transition-colors flex flex-col items-center justify-center">
                <div
                  className="flex items-center justify-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <DotLottiePlayer
                    src="/images/Coupon.lottie" // ใส่ path ของไฟล์ในโฟลเดอร์ public
                    autoplay
                    loop
                  ></DotLottiePlayer>
                </div>
                <p className="text-sm font-semibold text-gray-100 mt-2">
                  คูปองที่ขาย
                </p>
                <p className="text-sm text-gray-400">1000</p>
              </div>

              {/* France */}
              <div className="bg-gray-700/50 rounded-xl p-4 text-center hover:bg-gray-700/80 transition-colors flex flex-col items-center justify-center">
                <div
                  className="flex items-center justify-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <DotLottiePlayer
                    src="/images/Coupon.lottie" // ใส่ path ของไฟล์ในโฟลเดอร์ public
                    autoplay
                    loop
                  ></DotLottiePlayer>
                </div>
                <p className="text-sm font-semibold text-gray-100 mt-2">
                  รอใช้งาน
                </p>
                <p className="text-sm text-gray-400">480</p>
              </div>

              {/* USA */}
              <div className="bg-gray-700/50 rounded-xl p-4 text-center hover:bg-gray-700/80 transition-colors flex flex-col items-center justify-center">
                <div style={{ width: "80px", height: "80px" }}>
                  <DotLottiePlayer
                    src="/images/RewardRecieved.lottie"
                    autoplay
                    loop
                  />
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold text-gray-100">
                    Redeem แล้ว
                  </p>
                  <p className="text-sm text-gray-400">339</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50">
            <p className="text-sm font-semibold text-white mb-4">Customer</p>
            <div className="space-y-2">
              <CustomerRow
                name="Emily Johnson"
                initial="D"
                color="bg-purple-500"
              />
              <CustomerRow
                name="Emily Johnson"
                initial="AD"
                color="bg-amber-500"
              />
              <CustomerRow
                name="Emily Johnson"
                initial="AD"
                color="bg-pink-500"
              />
              <CustomerRow
                name="Emily Johnson"
                initial="AD"
                color="bg-emerald-500"
              />
              <CustomerRow
                name="Emily Johnson"
                initial="AD"
                color="bg-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Sale Report, Product Category, Overview, Transaction */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sale Report */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50">
            <p className="text-sm font-semibold text-white mb-4">Points</p>
            <div className="h-[200px]">
              <Chart
                options={donutChartOptions}
                series={[35, 25, 20, 12, 8]}
                type="donut"
                height="100%"
              />
            </div>
          </div>

          {/* Product Category */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-semibold text-white">
                Product Category
              </p>
            </div>
            <div className="space-y-3">
              <CategoryRow
                name="Clothing & Accessories"
                value="$5,000"
                count="5641"
                bgColor="bg-amber-500/20"
                textColor="text-amber-400"
              />
              <CategoryRow
                name="Home & Kitchen"
                value="$5,000"
                count="10K"
                bgColor="bg-gray-700/50"
                textColor="text-gray-300"
              />
              <CategoryRow
                name="Electronics"
                value="$5,000"
                count="6897"
                bgColor="bg-indigo-500/20"
                textColor="text-indigo-400"
              />
              <CategoryRow
                name="Jewellery"
                value="$5,000"
                count="4548"
                bgColor="bg-blue-500/20"
                textColor="text-blue-400"
              />
            </div>
          </div>

          {/* Overview */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 lg:col-span-1 border border-gray-700/50">
            <p className="text-sm font-semibold text-white mb-4">
              THB Token History
            </p>
            <div className="h-[150px] w-[200px]">
              <SalesBarChartDark
                label="THB Token"
                values={[100, 200]}
                labels={[`Total Deposited${100}`, `Total spent${200}`]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
