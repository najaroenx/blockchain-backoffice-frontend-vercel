"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import { ApexOptions } from "apexcharts";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";
import { api } from "@/libs/api";
import DateRangeFilter from "@/app/dlt/components/DateRangeFilter";
import dayjs, { Dayjs } from "dayjs";

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
      <span className="text-base font-semibold text-gray-100">{name}</span>
      <span className="text-base font-semibold text-gray-100">{`1000 PTS`}</span>
      <span className="text-base font-semibold text-gray-100">{`Transfer`}</span>
    </div>
    <button className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700 transition-colors">
      <AddIcon className="w-4 h-4 text-gray-400" />
    </button>
  </div>
);

// Stat Card Component (Dark Theme with Hover Effect)
const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) => (
  <div className="group relative bg-gray-700/50 rounded-xl p-4 text-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex flex-col items-center justify-center overflow-hidden h-full cursor-pointer border border-transparent hover:border-purple-400/30">
    {/* Globe watermark - visible on hover */}
    <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
      <span className="text-6xl">🌐</span>
    </div>
    {/* Online indicator - visible on hover */}
    <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

    <div className="relative z-10 flex flex-col items-center justify-center h-full">
      <div style={{ width: "60px", height: "60px" }} className="relative mb-2">
        <Image
          src={icon}
          alt={title}
          width={60}
          height={60}
          style={{ objectFit: "contain" }}
        />
      </div>
      <p className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors">
        {title}
      </p>
      <p className="text-sm text-gray-400 group-hover:text-purple-200 transition-colors mt-1">
        {value}
      </p>
    </div>
  </div>
);
interface DashboardData {
  dateRange: {
    startDate: string;
    endDate: string;
  };
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
  transactions: {
    transferPoint: number;
    redeemPoint: number;
  };
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
  params: { merchantId: string };
}) {
  const { execute, isExecuting } = useApiWithLoading();
  const [data, setData] = useState<DashboardData | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!startDate || !endDate) return;

      const result = await execute(
        () =>
          api(`/api/${params.merchantId}/dashboard/marketer`, {
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

      if (result) {
        console.log("result", result);
        setData(result);
      }
    };

    fetchDashboardData();
  }, [params.merchantId, startDate, endDate]);

  // Default stats if data is loading or null
  // Default stats definition to ensure structure safety
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
    labels: data ? data.points.map((v) => v.types) : ["A"],
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
      markers: { size: 10 },
      itemMargin: { horizontal: 8 },
      labels: { colors: "#9ca3af" },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: { size: "70%" },
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
  const stats = data
    ? {
        ...defaultStats,
        ...data,
        // Ensure nested objects are also safe if data partially exists
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

  console.log("stats", stats);
  return (
    <div className={`min-h-screen p-1 ${montserrat.className}`}>
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
                  <h3 className="text-4xl font-bold text-white">
                    {stats.couponCount.total
                      ? stats.couponCount.total.toLocaleString()
                      : "0"}
                  </h3>
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
              <h4 className="text-4xl font-bold text-white mt-4">
                {stats.couponCount.total
                  ? stats.couponCount.total.toLocaleString()
                  : "0"}
              </h4>

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

              <p className="text-lg text-white font-bold">ขายทั้งหมด</p>

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

              <h3 className="text-4xl font-bold text-white mt-3">
                {stats.couponCount.soldToEndUser
                  ? stats.couponCount.soldToEndUser.toLocaleString()
                  : "0"}
              </h3>
              {/* <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-pink-100">Last Week</span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded">
                  -45%
                </span>
              </div> */}
            </div>

            {/* Store Product Section (Dark) */}
            <div className="grid grid-cols-2">
              <div className="bg-gray-800/80 backdrop-blur-sm p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 font-medium">
                    📁 รอใช้งาน
                  </p>
                  <p className="text-4xl font-bold text-white mt-1">
                    {stats.couponCount.pendingUse
                      ? stats.couponCount.pendingUse.toLocaleString()
                      : "0"}
                  </p>
                </div>
                {/* Circular Progress */}
                {/* <div className="w-16 h-16">
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
                </div> */}
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 font-medium">
                    📁 Redeem แล้ว
                  </p>
                  <p className="text-4xl font-bold text-white mt-1">
                    {stats.couponCount.redeemed
                      ? stats.couponCount.redeemed.toLocaleString()
                      : "0"}
                  </p>
                </div>
                {/* Circular Progress */}
                {/* <div className="w-16 h-16">
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
                </div> */}
              </div>
            </div>
          </div>

          {/* Sales Chart - Using Chart.js with patterns */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 col-span-1 lg:col-span-2 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-3">
              มูลค่าคูปอง (THB)
            </p>
            <div className="h-[180px]">
              <SalesBarChartDark
                label="THB Token"
                values={[
                  stats.couponValue.total || 100,
                  stats.couponValue.sold || 20,
                  stats.couponValue.pendingUse || 10,
                  stats.couponValue.redeemed || 5,
                ]}
                labels={["มูลค่าทั้งหมด", "ขายแล้ว", "รอใช้", "Redeem แล้ว"]}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Top Products, Sales by Country, Customer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50 flex flex-col h-full">
            <p className="text-lg font-semibold text-white mb-4">
              Transactions
            </p>
            <div className="flex-1 min-h-[200px]">
              <Chart
                options={donutChartOptionsTransaction}
                series={[
                  stats.transactions.transferPoint || 100,
                  stats.transactions.redeemPoint || 10,
                ]}
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
              <StatCard
                title="จำนวน Users"
                value={
                  stats.endUsers.total
                    ? stats.endUsers.total.toLocaleString()
                    : "0"
                }
                icon="/images/icons/man.png"
              />
              <StatCard
                title="คนที่ซื้อ"
                value={
                  stats.endUsers.buyers
                    ? stats.endUsers.buyers.toLocaleString()
                    : "0"
                }
                icon="/images/icons/buy-and-sell.png"
              />
              <StatCard
                title="คูปองที่ขาย"
                value={
                  stats.endUsers.couponsSold
                    ? stats.endUsers.couponsSold.toLocaleString()
                    : "0"
                }
                icon="/images/icons/coupon.png"
              />
              <StatCard
                title="รอใช้งาน"
                value={
                  stats.endUsers.pendingUsers
                    ? stats.endUsers.pendingUsers.toLocaleString()
                    : "0"
                }
                icon="/images/icons/queue2.png"
              />
              <StatCard
                title="Redeem แล้ว"
                value={
                  stats.endUsers.redeemedUsers
                    ? stats.endUsers.redeemedUsers.toLocaleString()
                    : "0"
                }
                icon="/images/icons/redeem-points.png"
              />
            </div>
          </div>

          {/* Customer */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">Last Redeem</p>
            <div className="space-y-2">
              <CustomerRow
                name="098xxx0421"
                initial="D"
                color="bg-purple-500"
              />
              <CustomerRow
                name="088xxx1394"
                initial="AD"
                color="bg-amber-500"
              />
              <CustomerRow name="084xxx5453" initial="AD" color="bg-pink-500" />
              <CustomerRow
                name="095xxx1233"
                initial="AD"
                color="bg-emerald-500"
              />
              <CustomerRow name="081xxx1987" initial="AD" color="bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Row 3: Sale Report, Product Category, Overview, Transaction */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sale Report */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">Points</p>
            <div className="h-[200px]">
              <Chart
                options={donutChartOptions}
                series={stats.points.map((v) => v.total)}
                type="donut"
                height="100%"
              />
            </div>
          </div>

          {/* Product Category */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-semibold text-white">
                Our of merchants
              </p>
            </div>
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

          {/* Overview */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 lg:col-span-1 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">
              THB Token History
            </p>
            {/*  */}
            <div className="h-[150px] w-[200px]">
              <SalesBarChartDark
                label="THB Token"
                values={[
                  stats.thbToken.deposited || 100,
                  stats.thbToken.usedForPromotion +
                    stats.thbToken.usedForRedeem || 1000,
                ]}
                labels={[
                  `Total Deposited ${stats.thbToken.deposited || 100}`,
                  `Total spent ${
                    stats.thbToken.usedForPromotion +
                      stats.thbToken.usedForRedeem || 1000
                  }`,
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
