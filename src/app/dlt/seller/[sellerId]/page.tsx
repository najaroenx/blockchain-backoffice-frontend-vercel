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
import { SellerDashboardResponse } from "@/app/api/seller/address/[walletAddress]/route";

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
  const [data, setData] = useState<SellerDashboardResponse | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>("all");
  const [selectedMerchantInfo, setSelectedMerchantInfo] = useState<{
    merchantName: string;
    merchantId: string;
    couponCount: {
      total: number;
      unsold: number;
      sold: number;
      unreserved: number;
      reserved: number;
      unredeemed: number;
      redeemed: number;
    };
    couponValue: {
      sold: number;
      unreserved: number;
      reserved: number;
      unredeemed: number;
      redeemed: number;
    };
  } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!startDate || !endDate) return;

      const result = await execute(
        async () => {
          // 1. Fetch Merchant Info first to get walletAddress
          const merchant = await api(`/api/dlt/merchant/${params.sellerId}`, {
            method: "GET",
          });

          if (!merchant || !merchant?.wallet?.walletAddress) {
            throw new Error("Merchant wallet address not found");
          }

          // 2. Fetch Dashboard data using walletAddress
          const dashboard = await api(
            `/api/seller/address/${merchant.wallet.walletAddress}`,
            {
              method: "GET",
              queryParams: {
                startDate: startDate.startOf("day").toISOString(),
                endDate: endDate.endOf("day").toISOString(),
              },
            },
          );
          return { dashboard, merchant };
        },
        {
          loadingText: "กำลังโหลดข้อมูล Dashboard...",
          showSuccessOnComplete: false,
        },
      );
      console.log("result:", result);
      if (result && result.dashboard && result.dashboard.data) {
        // Map new API response to SellerDashboardResponse structure
        const apiData = result.dashboard.data;
        const mappedData: SellerDashboardResponse = {
          dateRange: apiData.dateRange || { startDate: "", endDate: "" },
          overallSummary: {
            couponCount: apiData.overallSummary?.couponCount || {
              total: 0,
              unsold: 0,
              sold: 0,
              unreserved: 0,
              reserved: 0,
              unredeemed: 0,
              redeemed: 0,
            },
            couponValue: apiData.overallSummary?.couponValue || {
              sold: 0,
              unsold: 0,
              unreserved: 0,
              reserved: 0,
              unredeemed: 0,
              redeemed: 0,
            },
          },
          merchants: apiData.merchants || [],
        };
        setData(mappedData);
      }
    };
    fetchDashboardData();
  }, [params.sellerId, startDate, endDate]);

  const defaultStats: SellerDashboardResponse = {
    dateRange: { startDate: "", endDate: "" },
    overallSummary: {
      couponCount: {
        total: 0,
        unsold: 0,
        sold: 0,
        unreserved: 0,
        reserved: 0,
        unredeemed: 0,
        redeemed: 0,
      },
      couponValue: {
        sold: 0,
        unsold: 0,
        unreserved: 0,
        reserved: 0,
        unredeemed: 0,
        redeemed: 0,
      },
    },
    merchants: [
      {
        merchantName: "Merchant 1",
        merchantId: "merchantId",
        couponCount: {
          total: 10,
          unsold: 5,
          sold: 5,
          unreserved: 2,
          reserved: 2,
          unredeemed: 1,
          redeemed: 1,
        },
        couponValue: {
          sold: 100,
          unsold: 50,
          unreserved: 20,
          reserved: 20,
          unredeemed: 10,
          redeemed: 10,
        },
      },
      {
        merchantName: "Merchant 2",
        merchantId: "merchantId 2",
        couponCount: {
          total: 100,
          unsold: 90,
          sold: 100,
          unreserved: 4,
          reserved: 4,
          unredeemed: 3,
          redeemed: 1,
        },
        couponValue: {
          sold: 1000,
          unsold: 900,
          unreserved: 200,
          reserved: 200,
          unredeemed: 100,
          redeemed: 100,
        },
      },
    ],
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
    labels: ["A"], // Placeholder as 'points' is missing
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

  const stats = data || defaultStats;

  console.log("stats", stats);
  console.log("selectedMerchantInfo", selectedMerchantInfo);
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

        {/* ============== Coupon Stats============== */}
        <p className="text-2xl font-bold text-white mb-1">จำนวนคูปอง</p>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* 4 Stat Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Followers Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-base font-semibold text-white">
                  จำนวน คูปองที่เรามี
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.overallSummary?.couponCount?.total}
                  </h3>
                  {/* <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p> */}
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

            {/* Unsold Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-base font-semibold text-white">
                  จำนวน คูปองที่ยังไม่ขาย
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.overallSummary?.couponCount?.unsold}
                  </h3>
                  {/* <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p> */}
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

            {/* Unreserved Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-base font-semibold text-white">
                  จำนวน คูปองที่ขายทั้งหมดแล้ว Marketer ยังไม่เข้ามาจอง
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.overallSummary?.couponCount?.unreserved}
                  </h3>
                  {/* <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p> */}
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

            {/* Reserved Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-base font-semibold text-white">
                  จำนวน คูปองที่ขายทั้งหมดแล้ว Marketer เข้ามาจอง
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.overallSummary?.couponCount?.reserved}
                  </h3>
                  {/* <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p> */}
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
            {/* Unredeemed Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-base font-semibold text-white">
                  จำนวน คูปองที่ขายทั้งหมดแล้ว End User ยังไม่ redeem
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.overallSummary?.couponCount?.unredeemed}
                  </h3>
                  {/* <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p> */}
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

            {/* Redeemed Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-base font-semibold text-white">
                  จำนวน คูปองที่ขายทั้งหมดแล้ว End User redeem แล้ว
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.overallSummary?.couponCount?.redeemed}
                  </h3>
                  {/* <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                    <span>↗</span> +0.892 Increased
                  </p> */}
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
          </div>

          {/* Visitors Donut Chart */}
          <div className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-2">จำนวนคูปอง</p>
            <div className="h-[200px]">
              <Chart
                options={{
                  chart: { type: "donut", background: "transparent" },
                  labels: [
                    "จำนวน คูปองที่เรามี",
                    "จำนวน คูปองที่ยังไม่ขาย",
                    "จำนวน คูปองที่ขายทั้งหมดแล้ว Marketer ยังไม่เข้ามาจอง",
                    "จำนวน คูปองที่ขายทั้งหมดแล้ว Marketer เข้ามาจอง",
                    "จำนวน คูปองที่ขายทั้งหมดแล้ว End User ยังไม่ redeem",
                    "จำนวน คูปองที่ขายทั้งหมดแล้ว End User redeem แล้ว",
                  ],
                  colors: [
                    "#6366f1",
                    "#f97316",
                    "#f43f5e",
                    "#1dbea8ff",
                    "#e437a5ff",
                    "#f1db4dff",
                  ],
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
                        // labels: {
                        //   show: true,
                        //   total: {
                        //     show: true,
                        //     label: "Total Visitors",
                        //     fontSize: "12px",
                        //     color: "#9ca3af",
                        //     formatter: () => "219147",
                        //   },
                        // },
                      },
                    },
                  },
                  stroke: { show: false },
                  theme: { mode: "dark" },
                }}
                series={[
                  stats?.overallSummary?.couponCount?.total,
                  stats?.overallSummary?.couponCount?.unsold,
                  stats?.overallSummary?.couponCount?.unreserved,
                  stats?.overallSummary?.couponCount?.reserved,
                  stats?.overallSummary?.couponCount?.unredeemed,
                  stats?.overallSummary?.couponCount?.redeemed,
                ]}
                type="donut"
                height="100%"
              />
            </div>
          </div>
        </div>
        {/* Our of value coupons */}
        <p className="text-2xl font-bold text-white mb-1">มูลค่าคูปอง</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Order Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-base font-semibold text-white mb-1">
              มูลค่า คูปองที่ขายทั้งหมด
            </p>
            {/* <p className="text-xs text-gray-500 mb-3">Last Year</p> */}
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
              <h3 className="text-2xl font-bold text-white">0 ยัง mock</h3>
              {/* <span className="text-sm text-rose-400">-16.2%</span> */}
            </div>
          </div>

          {/* Sales Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-base font-semibold text-white mb-1">
              มูลค่า คูปองที่ขายทั้งหมดแล้ว Marketer ยังไม่เข้ามาจอง
            </p>
            {/* <p className="text-xs text-gray-500 mb-3">Last Year</p> */}
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
              <h3 className="text-2xl font-bold text-white">
                {stats?.overallSummary?.couponValue?.unreserved}
              </h3>
              {/* <span className="text-sm text-rose-400">-16.2%</span> */}
            </div>
          </div>

          {/* Total Profit Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-base font-semibold text-white mb-1">
              มูลค่า คูปองที่ขายทั้งหมดแล้ว Marketer เข้ามาจอง
            </p>
            {/* <p className="text-xs text-gray-500 mb-3">Last Year</p> */}
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
              <h3 className="text-2xl font-bold text-white">
                {stats?.overallSummary?.couponValue?.reserved}
              </h3>
              {/* <span className="text-sm text-rose-400">-16.2%</span> */}
            </div>
          </div>

          {/* Va-----s */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-base font-semibold text-white mb-1">
              มูลค่า คูปองที่ขายทั้งหมดแล้ว End User ยังไม่ redeem
            </p>
            {/* <p className="text-xs text-gray-500 mb-3">Last Year</p> */}
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
              <h3 className="text-2xl font-bold text-white">
                {stats?.overallSummary?.couponValue?.unredeemed}
              </h3>
              {/* <span className="text-sm text-rose-400">-16.2%</span> */}
            </div>
          </div>

          {/* Revenue Growth Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-base font-semibold text-white mb-1">
              มูลค่า คูปองที่ขายทั้งหมดแล้ว End User redeem แล้ว
            </p>
            {/* <p className="text-xs text-gray-500 mb-3">Last Year</p> */}
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
              <h3 className="text-2xl font-bold text-white">
                {stats?.overallSummary?.couponValue?.redeemed}
              </h3>
              {/* <span className="text-sm text-rose-400">-16.2%</span> */}
            </div>
          </div>
        </div>

        {/* ============== ROW 4: Points + Merchants + THB Token ============== */}
        <div className="flex items-center justify-start gap-4 mb-4">
          <p className="text-2xl font-bold text-white">ข้อมูล By Merchant</p>
          <select
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedMerchantId}
            onChange={(e) => {
              setSelectedMerchantId(e.target.value);
              const find = stats?.merchants?.find(
                (m) => m.merchantId === e.target.value,
              );
              setSelectedMerchantInfo(find ? find : null);
            }}
          >
            <option value="all">Check All</option>
            {stats?.merchants?.map((m) => (
              <option key={m.merchantId} value={m.merchantId}>
                {m.merchantName}
              </option>
            ))}
          </select>
        </div>
        <p>Merchant: {selectedMerchantId}</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Points */}
          {/* <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">Points</p>
            <div className="h-[280px]">
              <Chart
                options={donutChartOptions}
                series={[100, 200]}
                type="donut"
                height="100%"
              />
            </div>
          </div> */}
          {/* Merchants */}

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-2">จำนวนคูปอง</p>
            <div className="space-y-3">
              <CategoryRow
                name="จำนวน คูปองที่เรามี"
                value={selectedMerchantInfo?.couponCount?.total || "0"}
                count="5641"
                bgColor="bg-amber-500/20"
                textColor="text-amber-400"
              />
              <CategoryRow
                name="จำนวน คูปองที่ยังไม่ขาย"
                value={selectedMerchantInfo?.couponCount?.unsold || "0"}
                count="10K"
                bgColor="bg-gray-700/50"
                textColor="text-gray-300"
              />
              <CategoryRow
                name="จำนวน คูปองที่ขายทั้งหมด"
                value={selectedMerchantInfo?.couponCount?.sold || "0"}
                count="6897"
                bgColor="bg-indigo-500/20"
                textColor="text-indigo-400"
              />
              <CategoryRow
                name="จำนวน คูปองที่ขายทั้งหมดแล้ว Marketer ยังไม่เข้ามาจอง"
                value={selectedMerchantInfo?.couponCount?.unreserved || "0"}
                count="4548"
                bgColor="bg-blue-500/20"
                textColor="text-blue-400"
              />
              <CategoryRow
                name="จำนวน คูปองที่ขายทั้งหมดแล้ว Marketer เข้ามาจอง"
                value={selectedMerchantInfo?.couponCount?.reserved || "0"}
                count="4548"
                bgColor="bg-green-500/20"
                textColor="text-blue-400"
              />
              <CategoryRow
                name="จำนวน คูปองที่ขายทั้งหมดแล้ว End User ยังไม่ redeem"
                value={selectedMerchantInfo?.couponCount?.unredeemed || "0"}
                count="4548"
                bgColor="bg-red-500/20"
                textColor="text-blue-400"
              />
              <CategoryRow
                name="จำนวน คูปองที่ขายทั้งหมดแล้ว End User redeem แล้ว"
                value={selectedMerchantInfo?.couponCount?.redeemed || "0"}
                count="4548"
                bgColor="bg-pink-500/20"
                textColor="text-blue-400"
              />
            </div>
          </div>

          {/* Merchants */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-2">มูลค่าคูปอง</p>
            <div className="space-y-3">
              <CategoryRow
                name="มูลค่า คูปองที่เรามี"
                value="0"
                count="5641"
                bgColor="bg-amber-500/20"
                textColor="text-amber-400"
              />
              <CategoryRow
                name="มูลค่า คูปองที่ยังไม่ขาย"
                value="0"
                count="10K"
                bgColor="bg-gray-700/50"
                textColor="text-gray-300"
              />
              <CategoryRow
                name="มูลค่า คูปองที่ขายทั้งหมด"
                value={selectedMerchantInfo?.couponValue?.sold || "0"}
                count="6897"
                bgColor="bg-indigo-500/20"
                textColor="text-indigo-400"
              />
              <CategoryRow
                name="มูลค่า คูปองที่ขายทั้งหมดแล้ว Marketer ยังไม่เข้ามาจอง"
                value={selectedMerchantInfo?.couponValue?.unreserved || "0"}
                count="4548"
                bgColor="bg-blue-500/20"
                textColor="text-blue-400"
              />
              <CategoryRow
                name="มูลค่า คูปองที่ขายทั้งหมดแล้ว Marketer เข้ามาจอง"
                value={selectedMerchantInfo?.couponValue?.reserved || "0"}
                count="4548"
                bgColor="bg-cyan-500/20"
                textColor="text-blue-400"
              />
              <CategoryRow
                name="มูลค่า คูปองที่ขายทั้งหมดแล้ว End User ยังไม่ redeem"
                value={selectedMerchantInfo?.couponValue?.unredeemed || "0"}
                count="4548"
                bgColor="bg-yellow-500/20"
                textColor="text-blue-400"
              />
              <CategoryRow
                name="มูลค่า คูปองที่ขายทั้งหมดแล้ว End User redeem แล้ว"
                value={selectedMerchantInfo?.couponValue?.redeemed || "0"}
                count="4548"
                bgColor="bg-green-500/20"
                textColor="text-blue-400"
              />
            </div>
          </div>

          {/* THB Token History */}
          {/* <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">
              THB Token History
            </p>
            <div className="h-[200px]">
              <SalesBarChartDark
                label="THB Token"
                values={[100, 1000]}
                labels={[`Total Deposited 100`, `Total spent 1000`]}
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
