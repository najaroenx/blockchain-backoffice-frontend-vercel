"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TokenIcon from "@mui/icons-material/Token";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { ApexOptions } from "apexcharts";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";
import { api } from "@/libs/api";

// Dynamic import for ApexCharts (no SSR)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Stats Item Component
const StatsItem = ({
  label,
  value,
  subLabel,
  color = "text-white",
}: {
  label: string;
  value: string | number;
  subLabel?: string;
  color?: string;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      {subLabel && <p className="text-xs text-gray-500 mt-0.5">{subLabel}</p>}
    </div>
    <span className={`text-lg font-semibold ${color}`}>{value}</span>
  </div>
);

// Section Card Component
const SectionCard = ({
  title,
  icon,
  iconColor,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
}) => (
  <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 shadow-xl hover:border-white/10 transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center transform group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
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
  points: {
    total: number;
    types: string[];
  };
  thbToken: {
    deposited: number;
    usedForPromotion: number;
    usedForRedeem: number;
  };
}

export default function MerchantPage({
  params,
}: {
  params: { merchantId: string };
}) {
  const { execute, isExecuting } = useApiWithLoading();
  const [data, setData] = useState<DashboardData | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Calculate date range for the last 30 days or default range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const result = await execute(
        () =>
          api(`/api/${params.merchantId}/dashboard/marketer`, {
            method: "GET",
            queryParams: {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              // granularity: "daily",
            },
          }),
        {
          loadingText: "กำลังโหลดข้อมูล Dashboard...",
          showSuccessOnComplete: false,
        }
      );

      if (result) {
        console.log("result", result);
        setData(result);
      }
    };

    fetchDashboardData();
  }, [params.merchantId]);

  // Default stats if data is loading or null
  const stats = data || {
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
    points: { total: 0, types: [] },
    thbToken: { deposited: 0, usedForPromotion: 0, usedForRedeem: 0 },
  };

  // Chart configurations
  const couponDonutOptions: ApexOptions = {
    chart: { type: "donut", background: "transparent" },
    labels: ["ที่เรามี", "ขายแล้ว", "รอใช้", "Redeem แล้ว"],
    colors: ["#a855f7", "#10b981", "#f59e0b", "#ec4899"],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "รวม",
              color: "#9ca3af",
              formatter: () => stats.couponCount.total.toLocaleString(),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { position: "bottom", labels: { colors: "#9ca3af" } },
    stroke: { show: false },
    theme: { mode: "dark" },
  };

  const couponValueBarOptions: ApexOptions = {
    chart: { type: "bar", background: "transparent", toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 6, barHeight: "60%" },
    },
    colors: ["#a855f7", "#10b981", "#f59e0b", "#ec4899"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["มูลค่าทั้งหมด", "ขายแล้ว", "รอใช้", "Redeem แล้ว"],
      labels: {
        style: { colors: "#9ca3af" },
        formatter: (val: string) => `฿${(Number(val) / 1000000).toFixed(1)}M`,
      },
    },
    yaxis: { labels: { style: { colors: "#9ca3af" } } },
    grid: { borderColor: "rgba(255,255,255,0.05)" },
    theme: { mode: "dark" },
  };

  const endUserLineOptions: ApexOptions = {
    chart: {
      type: "area",
      background: "transparent",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    colors: ["#3b82f6", "#10b981"],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // TODO: dynamic categories
      labels: { style: { colors: "#9ca3af" } },
    },
    yaxis: { labels: { style: { colors: "#9ca3af" } } },
    grid: { borderColor: "rgba(255,255,255,0.05)" },
    legend: { labels: { colors: "#9ca3af" } },
    theme: { mode: "dark" },
  };

  const transactionPieOptions: ApexOptions = {
    chart: { type: "pie", background: "transparent" },
    labels: ["โอน Point", "Redeem Point"],
    colors: ["#10b981", "#ec4899"],
    legend: { position: "bottom", labels: { colors: "#9ca3af" } },
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px" },
    },
    stroke: { show: false },
    theme: { mode: "dark" },
  };

  const pointRadialOptions: ApexOptions = {
    chart: { type: "radialBar", background: "transparent" },
    plotOptions: {
      radialBar: {
        hollow: { size: "60%" },
        dataLabels: {
          name: { show: true, color: "#9ca3af" },
          value: {
            show: true,
            color: "#f59e0b",
            fontSize: "24px",
            fontWeight: "bold",
            formatter: () => stats.points.total.toLocaleString(),
          },
        },
        track: { background: "rgba(255,255,255,0.1)" },
      },
    },
    colors: ["#f59e0b"],
    labels: ["Point ทั้งหมด"],
    theme: { mode: "dark" },
  };

  const thbTokenAreaOptions: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      stacked: true,
    },
    plotOptions: {
      bar: { horizontal: false, borderRadius: 8, columnWidth: "60%" },
    },
    colors: ["#06b6d4", "#a855f7", "#ec4899"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Mock categories for now
      labels: { style: { colors: "#9ca3af" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af" },
        formatter: (val: number) => `฿${(val / 1000).toFixed(0)}K`,
      },
    },
    grid: { borderColor: "rgba(255,255,255,0.05)" },
    legend: { labels: { colors: "#9ca3af" } },
    theme: { mode: "dark" },
  };

  return (
    <div className="space-y-6">
      {/* Store Overview Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
          ข้อมูลภาพรวมร้านของตนเอง
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coupon Count with Donut Chart */}
          <SectionCard
            title="จำนวนคูปอง"
            icon={<ConfirmationNumberIcon className="w-5 h-5" />}
            iconColor="bg-purple-500/20 text-purple-400"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[200px]">
                <Chart
                  options={couponDonutOptions}
                  series={[
                    stats.couponCount.total - stats.couponCount.soldToEndUser,
                    stats.couponCount.soldToEndUser -
                      stats.couponCount.pendingUse,
                    stats.couponCount.pendingUse,
                    stats.couponCount.redeemed,
                  ]}
                  type="donut"
                  height="100%"
                />
              </div>
              <div className="space-y-1">
                <StatsItem
                  label="จำนวนคูปองที่เรามี"
                  value={stats.couponCount.total.toLocaleString()}
                  color="text-purple-400"
                />
                <StatsItem
                  label="ขายทั้งหมด"
                  value={stats.couponCount.soldToEndUser.toLocaleString()}
                  color="text-emerald-400"
                />
                <StatsItem
                  label="รอใช้งาน"
                  value={stats.couponCount.pendingUse.toLocaleString()}
                  color="text-amber-400"
                />
                <StatsItem
                  label="Redeem แล้ว"
                  value={stats.couponCount.redeemed.toLocaleString()}
                  color="text-pink-400"
                />
              </div>
            </div>
          </SectionCard>

          {/* Coupon Value with Bar Chart */}
          <SectionCard
            title="มูลค่าคูปอง (THB)"
            icon={<AccountBalanceWalletIcon className="w-5 h-5" />}
            iconColor="bg-pink-500/20 text-pink-400"
          >
            <div className="h-[200px]">
              <Chart
                options={couponValueBarOptions}
                series={[
                  {
                    name: "มูลค่า",
                    data: [
                      stats.couponValue.total,
                      stats.couponValue.sold,
                      stats.couponValue.pendingUse,
                      stats.couponValue.redeemed,
                    ],
                  },
                ]}
                type="bar"
                height="100%"
              />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* End User Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></span>
          ข้อมูล End User
        </h2>
        <SectionCard
          title="สถิติ End User"
          icon={<PeopleIcon className="w-5 h-5" />}
          iconColor="bg-blue-500/20 text-blue-400"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {stats.endUsers.total.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">จำนวน Users</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {stats.endUsers.buyers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">คนที่ซื้อ</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {stats.endUsers.couponsSold.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">คูปองที่ขาย</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">
                  {stats.endUsers.pendingUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">รอใช้งาน</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center col-span-2 md:col-span-2">
                <p className="text-2xl font-bold text-pink-400">
                  {stats.endUsers.redeemedUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Redeem แล้ว</p>
              </div>
            </div>
            {/* Area Chart - Mocked for now until we have time series per user */}
            <div className="h-[200px]">
              {/* <Chart
                options={endUserLineOptions}
                series={[
                  {
                    name: "Active Users",
                    data: [320, 442, 521, 654, 720, 821], // Mock data
                  },
                ]}
                type="area"
                height="100%"
              /> */}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Transaction, Point, THB Token Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction with Pie Chart */}
        <SectionCard
          title="Transaction"
          icon={<SwapHorizIcon className="w-5 h-5" />}
          iconColor="bg-emerald-500/20 text-emerald-400"
        >
          <div className="h-[200px]">
            <Chart
              options={transactionPieOptions}
              series={[
                stats.transactions.transferPoint,
                stats.transactions.redeemPoint,
              ]}
              type="pie"
              height="100%"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-400">
                {stats.transactions.transferPoint.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">โอน Point</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-pink-400">
                {stats.transactions.redeemPoint.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Redeem Point</p>
            </div>
          </div>
        </SectionCard>

        {/* Point with Radial Chart */}
        <SectionCard
          title="Point"
          icon={<TokenIcon className="w-5 h-5" />}
          iconColor="bg-amber-500/20 text-amber-400"
        >
          <div className="h-[180px]">
            <Chart
              options={pointRadialOptions}
              series={[75]}
              type="radialBar"
              height="100%"
            />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">ประเภท Point</p>
            <div className="flex flex-wrap gap-2">
              {stats.points.types.map((type, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"
                >
                  {type}
                </span>
              ))}
              {stats.points.types.length === 0 && (
                <span className="text-gray-500 text-xs">-</span>
              )}
            </div>
          </div>
        </SectionCard>

        {/* THB Token with Stacked Bar Chart */}
        <SectionCard
          title="THB Token History"
          icon={<AccountBalanceWalletIcon className="w-5 h-5" />}
          iconColor="bg-cyan-500/20 text-cyan-400"
        >
          <div className="h-[180px]">
            <Chart
              options={thbTokenAreaOptions}
              series={[
                {
                  name: "Deposited",
                  data: [stats.thbToken.deposited],
                },
                {
                  name: "Spent",
                  data: [
                    stats.thbToken.usedForPromotion +
                      stats.thbToken.usedForRedeem,
                  ],
                },
              ]}
              type="bar"
              height="100%"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-cyan-400">
                ฿{stats.thbToken.deposited.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-500">Total Deposited</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-pink-400">
                ฿
                {(
                  stats.thbToken.usedForPromotion + stats.thbToken.usedForRedeem
                ).toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-500">Total Spent</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
