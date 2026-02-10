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
    unsold: number;
    sold: number;
    unredeemed: number;
    redeemed: number;
  };
  couponValue: {
    total: number;
    unsold: number;
    sold: number;
    unredeemed: number;
    redeemed: number;
  };
  couponValueByCurrency: {
    currency: string;
    total: number;
    unsold: number;
    sold: number;
    unredeemed: number;
    redeemed: number;
  }[];
  endUsers: {
    total: number;
    unredeemedUsers: number;
    redeemedUsers: number;
  };
  transactions: {
    transferPoint: number;
    purchaseCoupon: number;
  };
  points: Ipoints[];
  thbToken: {
    deposited: number;
    balance: number;
    bought: number;
  };
}

interface Ipoints {
  symbol: string;
  total: number;
  balance: number;
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
  const [couponList, setCouponList] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedCouponId, setSelectedCouponId] = useState<string>("all");

  // Fetch coupon list on mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api(
          `/api/${params.merchantId}/dashboard/marketer/coupons`,
          { method: "GET" },
        );
        if (res?.coupons) {
          setCouponList(res.coupons);
        } else if (res?.data?.coupons) {
          setCouponList(res.data.coupons);
        }
      } catch (error) {
        console.error("Error fetching marketer coupons:", error);
      }
    };
    if (params.merchantId) {
      fetchCoupons();
    }
  }, [params.merchantId]);

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
              ...(selectedCouponId !== "all"
                ? { couponIds: selectedCouponId }
                : {}),
            },
          }),
        {
          loadingText: "กำลังโหลดข้อมูล Dashboard...",
          showSuccessOnComplete: false,
        },
      );

      if (result) {
        console.log("result>>>>", result);
        setData(result);
      }
    };

    fetchDashboardData();
  }, [params.merchantId, startDate, endDate, selectedCouponId]);

  // Default stats if data is loading or null
  // Default stats definition to ensure structure safety
  const defaultStats: DashboardData = {
    dateRange: { startDate: "", endDate: "" },
    couponCount: {
      total: 78,
      unsold: 27,
      sold: 51,
      unredeemed: 6,
      redeemed: 0,
    },
    couponValue: {
      total: 11800,
      unsold: 3500,
      sold: 8300,
      unredeemed: 600,
      redeemed: 0,
    },
    couponValueByCurrency: [
      {
        currency: "AB",
        total: 37809,
        unsold: 0,
        sold: 37809,
        unredeemed: 948,
        redeemed: 0,
      },
    ],
    endUsers: {
      total: 2,
      unredeemedUsers: 2,
      redeemedUsers: 0,
    },
    transactions: { transferPoint: 1000, purchaseCoupon: 0 },
    points: [
      {
        symbol: "AB",
        total: 100000,
        balance: 99948,
      },
    ],
    thbToken: { deposited: 11800, balance: 0, bought: 11800 },
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
    labels: data ? data.points.map((v) => v.symbol) : ["A"],
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

  console.log("stats>", stats);
  return (
    <div className={`min-h-screen p-1 ${montserrat.className}`}>
      <div className="max-w-10xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-8"
                value={selectedCouponId}
                onChange={(e) => setSelectedCouponId(e.target.value)}
              >
                <option value="all">All Coupons</option>
                {couponList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          </div>
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
                คูปองที่ยังไม่ได้ตั้งขาย
              </p>
              <h4 className="text-4xl font-bold text-white mt-4">
                {stats.couponCount.unsold
                  ? stats.couponCount.unsold.toLocaleString()
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

              <p className="text-lg text-white font-bold">
                จำนวนคูปองที่ขายทั้งหมด
              </p>

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
                {stats.couponCount.sold
                  ? stats.couponCount.sold.toLocaleString()
                  : "0"}
              </h3>
            </div>

            {/* Store Product Section (Dark) */}
            <div className="grid grid-cols-2">
              <div className="bg-gray-800/80 backdrop-blur-sm p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 font-medium">
                    จำนวนคูปองที่ End User ซื้อแต่ยังไม่ใช้
                  </p>
                  <p className="text-4xl font-bold text-white mt-1">
                    {stats.couponCount.unredeemed
                      ? stats.couponCount.unredeemed.toLocaleString()
                      : "0"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-400 flex items-center gap-1 font-medium">
                    จำนวนคูปองที่ End User redeem แล้วจริง ๆ
                  </p>
                  <p className="text-4xl font-bold text-white mt-1">
                    {stats.couponCount.redeemed
                      ? stats.couponCount.redeemed.toLocaleString()
                      : "0"}
                  </p>
                </div>
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
                  stats.couponValue.total,
                  stats.couponValue.unsold,
                  stats.couponValue.sold,
                  stats.couponValue.unredeemed,
                  stats.couponValue.redeemed,
                ]}
                labels={[
                  "มูลค่าคูปองทั้งหมด",
                  "มูลค่าคูปองที่ยังไม่ได้ตั้งขาย",
                  "มูลค่าคูปองที่ขายทั้งหมด THB",
                  "มูลค่าคูปองที่ End User ซื้อแต่ยังไม่ใช้ THB",
                  "มูลค่าคูปองที่ End User redeem แล้วจริง ๆ THB",
                ]}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Top Products, Sales by Country, Customer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 border border-gray-700/50 flex flex-col h-full">
            <p className="text-lg font-semibold text-white mb-4">
              Transactions
            </p>
            <div className="flex-1 min-h-[200px]">
              <Chart
                options={donutChartOptionsTransaction}
                series={[
                  stats.transactions.transferPoint,
                  stats.transactions.purchaseCoupon,
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
                title="จำนวน End User ที่ซื้อทั้งหมด"
                value={
                  stats.endUsers.total
                    ? stats.endUsers.total.toLocaleString()
                    : "0"
                }
                icon="/images/icons/man.png"
              />
              <StatCard
                title="จำนวน End User ซื้อแต่ยังไม่ใช้"
                value={
                  stats.endUsers.unredeemedUsers
                    ? stats.endUsers.unredeemedUsers.toLocaleString()
                    : "0"
                }
                icon="/images/icons/buy-and-sell.png"
              />
              <StatCard
                title="จำนวน End User redeem แล้วจริง ๆ"
                value={
                  stats.endUsers.redeemedUsers
                    ? stats.endUsers.redeemedUsers.toLocaleString()
                    : "0"
                }
                icon="/images/icons/coupon.png"
              />
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
              <p className="text-lg font-semibold text-white">Transactions</p>
            </div>
            <div className="space-y-3">
              <CategoryRow
                name="ซื้อคูปองด้วย Point"
                value={stats.transactions.purchaseCoupon.toLocaleString()}
                count=""
                bgColor="bg-amber-500/20"
                textColor="text-amber-400"
              />
              <CategoryRow
                name="โอน Point"
                value={stats.transactions.transferPoint.toLocaleString()}
                count=""
                bgColor="bg-gray-700/50"
                textColor="text-gray-300"
              />
            </div>
          </div>

          {/* Overview */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-black/20 lg:col-span-1 border border-gray-700/50">
            <p className="text-lg font-semibold text-white mb-4">
              THB Token History
            </p>
            {/*  */}
            <div className="h-[200px] w-full">
              <SalesBarChartDark
                label="THB Token"
                values={[
                  stats.thbToken.deposited || 0,
                  stats.thbToken.balance || 0,
                  stats.thbToken.bought || 0,
                ]}
                labels={[
                  `THB Token ที่เติมเข้าไปทั้งหมด`,
                  `THB Token ที่เหลือ Balance`,
                  `THB Token ที่ใช้จองคูปอง จาก Promotion Seller`,
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
