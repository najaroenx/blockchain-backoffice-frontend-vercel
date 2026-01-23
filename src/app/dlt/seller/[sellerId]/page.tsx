"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Montserrat } from "next/font/google";
import { ApexOptions } from "apexcharts";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";
import { api } from "@/libs/api";
import DateRangeFilter from "@/app/dlt/components/DateRangeFilter";
import dayjs, { Dayjs } from "dayjs";
import DefaultCardDashboard from "../../components/DefaultCardDashboard";
import PrimaryCardDashboard from "../../components/PrimaryCardDashboard";
import {
  ActivityRow,
  CategoryRow,
  StatCard,
  MiniStatCard,
} from "../../components/dashboard";

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

interface DashboardData {
  dateRange: { startDate: string; endDate: string };
  couponCount: {
    total: number;
    purchased: number;
    soldToEndUser: number;
    pendingUse: number;
    redeemed: number;
  };
  couponValue: {
    total: number;
    sold: number;
    pendingUse: number;
    redeemed: number;
  };
  endUsers: {
    total: number;
    buyers: number;
    couponsSold: number;
    pendingUsers: number;
    redeemedUsers: number;
  };
  transactions: { transferPoint: number; redeemPoint: number };
  points: Ipoints[];
  thbToken: {
    deposited: number;
    usedForPromotion: number;
    usedForRedeem: number;
  };
}

interface Ipoints {
  total: number;
  types: string;
}

export default function DashboardNewPage({
  params,
}: {
  params: { sellerId: string };
}) {
  const { execute } = useApiWithLoading();
  const [data, setData] = useState<DashboardData | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!startDate || !endDate) return;
      const result = await execute(
        () =>
          api(`/api/${params.sellerId}/dashboard/marketer`, {
            method: "GET",
            queryParams: {
              startDate: startDate.startOf("day").toISOString(),
              endDate: endDate.endOf("day").toISOString(),
            },
          }),
        {
          loadingText: "กำลังโหลดข้อมูล Dashboard...",
          showSuccessOnComplete: false,
        },
      );
      if (result) setData(result);
    };
    fetchDashboardData();
  }, [params.sellerId, startDate, endDate]);

  const defaultStats: DashboardData = {
    dateRange: { startDate: "", endDate: "" },
    couponCount: {
      total: 0,
      purchased: 0,
      soldToEndUser: 0,
      pendingUse: 0,
      redeemed: 0,
    },
    couponValue: { total: 0, sold: 0, pendingUse: 0, redeemed: 0 },
    endUsers: {
      total: 0,
      buyers: 0,
      couponsSold: 0,
      pendingUsers: 0,
      redeemedUsers: 0,
    },
    transactions: { transferPoint: 0, redeemPoint: 0 },
    points: [{ total: 0, types: "a" }],
    thbToken: { deposited: 0, usedForPromotion: 0, usedForRedeem: 0 },
  };

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

  const donutChartOptions: ApexOptions = {
    chart: { type: "donut", background: "transparent" },
    labels: data ? data.points.map((v) => v.types) : ["A"],
    colors: ["#6366f1", "#60a5fa", "#f472b6", "#bef264", "#a5b4fc"],
    legend: {
      position: "bottom",
      fontSize: "10px",
      markers: { size: 4 },
      itemMargin: { horizontal: 4, vertical: 2 },
      labels: { colors: "#9ca3af" },
      horizontalAlign: "center",
    },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "50%" } } },
    stroke: { show: false },
    theme: { mode: "dark" },
  };

  const stats = data
    ? {
        ...defaultStats,
        ...data,
        couponCount: {
          ...defaultStats.couponCount,
          ...(data.couponCount || {}),
        },
        couponValue: {
          ...defaultStats.couponValue,
          ...(data.couponValue || {}),
        },
        endUsers: { ...defaultStats.endUsers, ...(data.endUsers || {}) },
        transactions: {
          ...defaultStats.transactions,
          ...(data.transactions || {}),
        },
        points: data.points || [],
        thbToken: { ...defaultStats.thbToken, ...(data.thbToken || {}) },
      }
    : defaultStats;

  return (
    <div className={`min-h-screen p-4 ${montserrat.className}`}>
      <div className="max-w-10xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {/* ============== ROW 1: Stats Cards (4) + Visitors Donut ============== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* 4 Stat Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Followers Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-400"
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
                <span className="text-sm text-gray-400">Total Followers</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">12,432</h3>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p>
                </div>
                <div className="w-20 h-10">
                  <Chart
                    options={{ ...lineChartOptions, colors: ["#a78bfa"] }}
                    series={[{ data: [5, 8, 6, 10, 7, 12, 9] }]}
                    type="line"
                    height="100%"
                  />
                </div>
              </div>
            </div>

            {/* Bounce Rate Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Bounce Rate</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">12,432</h3>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p>
                </div>
                <div className="w-20 h-10">
                  <Chart
                    options={{ ...lineChartOptions, colors: ["#f43f5e"] }}
                    series={[{ data: [8, 5, 9, 6, 11, 8, 10] }]}
                    type="line"
                    height="100%"
                  />
                </div>
              </div>
            </div>

            {/* Conversion Rate Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Conversion Rate</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">12,432</h3>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p>
                </div>
                <div className="w-20 h-10">
                  <Chart
                    options={{ ...lineChartOptions, colors: ["#10b981"] }}
                    series={[{ data: [4, 7, 5, 9, 6, 8, 11] }]}
                    type="line"
                    height="100%"
                  />
                </div>
              </div>
            </div>

            {/* Session Duration Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-cyan-400"
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
                </div>
                <span className="text-sm text-gray-400">Session Duration</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">3hrs</h3>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p>
                </div>
                <div className="w-20 h-10">
                  <Chart
                    options={{ ...lineChartOptions, colors: ["#06b6d4"] }}
                    series={[{ data: [6, 9, 7, 11, 8, 10, 12] }]}
                    type="line"
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visitors Donut Chart */}
          <div className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-2">Visitors</p>
            <div className="h-[200px]">
              <Chart
                options={{
                  chart: { type: "donut", background: "transparent" },
                  labels: ["Online visitors", "Offline visitors"],
                  colors: ["#6366f1", "#f97316"],
                  legend: {
                    position: "bottom",
                    fontSize: "10px",
                    labels: { colors: "#9ca3af" },
                  },
                  dataLabels: { enabled: false },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: "70%",
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: "Total Visitors",
                            fontSize: "12px",
                            color: "#9ca3af",
                            formatter: () => "219147",
                          },
                        },
                      },
                    },
                  },
                  stroke: { show: false },
                  theme: { mode: "dark" },
                }}
                series={[186758, 32389]}
                type="donut"
                height="100%"
              />
            </div>
          </div>
        </div>

        {/* ============== ROW 2: Large Chart (2 cols) + Activity (1 col) + Audience Report (1 col) ============== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Large Bar Chart - Session Duration By Users */}
          <div className="lg:col-span-2 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">
              Session Duration By Users
            </p>
            <div className="h-[300px]">
              <Chart
                options={{
                  chart: {
                    type: "bar",
                    background: "transparent",
                    toolbar: { show: false },
                  },
                  plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
                  dataLabels: { enabled: false },
                  xaxis: {
                    categories: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                    labels: { style: { colors: "#9ca3af" } },
                  },
                  yaxis: { labels: { style: { colors: "#9ca3af" } } },
                  grid: { borderColor: "#374151" },
                  colors: ["#6366f1", "#f97316"],
                  legend: {
                    position: "top",
                    horizontalAlign: "right",
                    labels: { colors: "#9ca3af" },
                  },
                  theme: { mode: "dark" },
                }}
                series={[
                  {
                    name: "Orders",
                    data: [30, 40, 45, 50, 49, 60, 70, 55, 45, 35, 25, 40],
                  },
                  {
                    name: "Sales",
                    data: [20, 35, 40, 45, 35, 55, 60, 50, 40, 30, 20, 35],
                  },
                ]}
                type="bar"
                height="100%"
              />
            </div>
          </div>

          {/* Activity List */}
          <div className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">Activity</p>
            <div className="space-y-1">
              <ActivityRow
                icon={
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                }
                iconBg="bg-purple-500/20"
                title="Total Visits"
                change="1.75%"
                changeType="increase"
                value="23,124"
              />
              <ActivityRow
                icon={
                  <svg
                    className="w-4 h-4 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                }
                iconBg="bg-rose-500/20"
                title="Total Products"
                change="0.85%"
                changeType="decrease"
                value="1.3k"
              />
              <ActivityRow
                icon={
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
                iconBg="bg-emerald-500/20"
                title="Total Sales"
                change="3.74%"
                changeType="increase"
                value="23.89k"
              />
              <ActivityRow
                icon={
                  <svg
                    className="w-4 h-4 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                iconBg="bg-amber-500/20"
                title="Total Revenue"
                change="0.23%"
                changeType="increase"
                value="$187.38k"
              />
              <ActivityRow
                icon={
                  <svg
                    className="w-4 h-4 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                }
                iconBg="bg-cyan-500/20"
                title="Total Profit"
                change="4.95%"
                changeType="decrease"
                value="$84.33k"
              />
            </div>
          </div>

          {/* Audience Report */}
          <div className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-semibold text-white">
                Audience Report
              </p>
              <button className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">12,890</h3>
              <p className="text-sm text-emerald-400">↗ 10.5%</p>
              <p className="text-xs text-gray-400 mt-1">Currently active now</p>
            </div>
            <div className="h-[120px] mt-4">
              <Chart
                options={{
                  chart: {
                    type: "area",
                    sparkline: { enabled: true },
                    background: "transparent",
                  },
                  stroke: { curve: "smooth", width: 2 },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.4,
                      opacityTo: 0.1,
                    },
                  },
                  colors: ["#a78bfa"],
                  theme: { mode: "dark" },
                }}
                series={[
                  { data: [30, 40, 35, 50, 49, 60, 70, 91, 80, 75, 85, 95] },
                ]}
                type="area"
                height="100%"
              />
            </div>
          </div>
        </div>

        {/* ============== ROW 4: Points + Merchants + THB Token ============== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Points */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">Points</p>
            <div className="h-[280px]">
              <Chart
                options={donutChartOptions}
                series={stats.points.map((v) => v.total)}
                type="donut"
                height="100%"
              />
            </div>
          </div>

          {/* Merchants */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-2">
              Our of merchants
            </p>
            <div className="space-y-3">
              <CategoryRow
                name="ร้านป้าส้ม"
                value="$5,000"
                count="5641"
                bgColor="bg-amber-500/20"
                textColor="text-amber-400"
              />
              <CategoryRow
                name="กาแฟ Number9"
                value="$5,000"
                count="10K"
                bgColor="bg-gray-700/50"
                textColor="text-gray-300"
              />
              <CategoryRow
                name="Garden by the bay"
                value="$5,000"
                count="6897"
                bgColor="bg-indigo-500/20"
                textColor="text-indigo-400"
              />
              <CategoryRow
                name="บานี้เบอเกอร์"
                value="$5,000"
                count="4548"
                bgColor="bg-blue-500/20"
                textColor="text-blue-400"
              />
            </div>
          </div>

          {/* THB Token History */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">
              THB Token History
            </p>
            <div className="h-[200px]">
              <SalesBarChartDark
                label="THB Token"
                values={[
                  stats.thbToken.deposited || 100,
                  stats.thbToken.usedForPromotion +
                    stats.thbToken.usedForRedeem || 1000,
                ]}
                labels={[
                  `Total Deposited ${stats.thbToken.deposited || 100}`,
                  `Total spent ${stats.thbToken.usedForPromotion + stats.thbToken.usedForRedeem || 1000}`,
                ]}
              />
            </div>
          </div>
        </div>

        {/* ============== ROW 5: Order + Sales + Total Profit + Total Sales + Revenue Growth ============== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Order Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Order</p>
            <p className="text-xs text-gray-500 mb-3">Last week</p>
            <div className="flex gap-1 mb-3 h-12">
              {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-purple-500 rounded-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-white">124k</h3>
              <span className="text-sm text-emerald-400">+12.6%</span>
            </div>
          </div>

          {/* Sales Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Sales</p>
            <p className="text-xs text-gray-500 mb-3">Last Year</p>
            <div className="h-12 mb-3">
              <Chart
                options={{
                  chart: {
                    type: "area",
                    sparkline: { enabled: true },
                    background: "transparent",
                  },
                  stroke: { curve: "smooth", width: 2 },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.4,
                      opacityTo: 0.1,
                    },
                  },
                  colors: ["#10b981"],
                  theme: { mode: "dark" },
                }}
                series={[{ data: [30, 40, 35, 50, 49, 60, 55, 45, 50, 70] }]}
                type="area"
                height="100%"
              />
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-white">175k</h3>
              <span className="text-sm text-rose-400">-16.2%</span>
            </div>
          </div>

          {/* Total Profit Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <div className="w-10 h-10 rounded-lg bg-rose-500 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Profit</p>
            <p className="text-xs text-gray-500 mb-2">Last week</p>
            <h3 className="text-2xl font-bold text-white mb-1">1.28k</h3>
            <span className="text-sm text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">
              -12.2%
            </span>
          </div>

          {/* Total Sales Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Sales</p>
            <p className="text-xs text-gray-500 mb-2">Last week</p>
            <h3 className="text-2xl font-bold text-white mb-1">24.67k</h3>
            <span className="text-sm text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
              +24.5%
            </span>
          </div>

          {/* Revenue Growth Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">Revenue Growth</p>
            <p className="text-xs text-gray-500 mb-2">Weekly Report</p>
            <div className="flex gap-1 mb-2 h-8">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full ${i === 4 ? "bg-purple-500" : "bg-gray-600"} rounded-sm`}
                    style={{ height: `${30 + i * 8}%` }}
                  />
                  <span className="text-[10px] text-gray-500 mt-1">{d}</span>
                </div>
              ))}
            </div>
            <h3 className="text-2xl font-bold text-white">$4,673</h3>
            <span className="text-sm text-emerald-400">+15.2%</span>
          </div>
        </div>

        {/* ============== ROW 6: Earning Reports + Sales Radar ============== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Earning Reports */}
          <div className="lg:col-span-2 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-semibold text-white">
                  Earning Reports
                </p>
                <p className="text-xs text-gray-400">
                  Yearly Earnings Overview
                </p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { icon: "🛒", label: "Orders", active: true },
                { icon: "📊", label: "Sales", active: false },
                { icon: "💰", label: "Profit", active: false },
                { icon: "💵", label: "Income", active: false },
              ].map((tab, i) => (
                <button
                  key={i}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border ${
                    tab.active
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-700 bg-gray-700/30"
                  }`}
                >
                  <span className="text-xl mb-1">{tab.icon}</span>
                  <span
                    className={`text-xs ${tab.active ? "text-purple-400" : "text-gray-400"}`}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
              <button className="flex items-center justify-center p-3 rounded-xl border border-gray-700 bg-gray-700/30">
                <span className="text-gray-400 text-xl">+</span>
              </button>
            </div>

            {/* Bar Chart */}
            <div className="h-[250px]">
              <Chart
                options={{
                  chart: {
                    type: "bar",
                    background: "transparent",
                    toolbar: { show: false },
                  },
                  plotOptions: { bar: { borderRadius: 4, columnWidth: "40%" } },
                  dataLabels: {
                    enabled: true,
                    offsetY: -20,
                    style: { fontSize: "11px", colors: ["#9ca3af"] },
                  },
                  xaxis: {
                    categories: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                    ],
                    labels: { style: { colors: "#9ca3af" } },
                  },
                  yaxis: {
                    labels: {
                      style: { colors: "#9ca3af" },
                      formatter: (val) => `${val / 1000}k`,
                    },
                  },
                  grid: { borderColor: "#374151" },
                  colors: ["#6366f1"],
                  theme: { mode: "dark" },
                }}
                series={[
                  {
                    name: "Earnings",
                    data: [
                      28000, 10000, 45000, 38000, 15000, 30000, 35000, 30000,
                      8000,
                    ],
                  },
                ]}
                type="bar"
                height="100%"
              />
            </div>
          </div>

          {/* Sales Radar Chart */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-semibold text-white">Sales</p>
                <p className="text-xs text-gray-400">Last 6 Months</p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div className="h-[280px]">
              <Chart
                options={{
                  chart: {
                    type: "radar",
                    background: "transparent",
                    toolbar: { show: false },
                  },
                  xaxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  },
                  yaxis: { show: false },
                  stroke: { width: 2 },
                  fill: { opacity: 0.3 },
                  markers: { size: 4 },
                  colors: ["#6366f1", "#10b981"],
                  legend: { position: "bottom", labels: { colors: "#9ca3af" } },
                  theme: { mode: "dark" },
                }}
                series={[
                  { name: "Sales", data: [80, 90, 70, 85, 75, 95] },
                  { name: "Visits", data: [60, 70, 85, 65, 90, 70] },
                ]}
                type="radar"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
