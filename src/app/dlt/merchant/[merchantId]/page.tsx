"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MarketingStatCard } from "@/app/dlt/components/marketingStatCard";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TokenIcon from "@mui/icons-material/Token";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { AdsPerformanceChart } from "../../components/adsPerformanceChart";
import { LeadPerformanceScore } from "../../components/leadPerformanceScore";
import { ApexOptions } from "apexcharts";
import { useLoading } from "@/app/dlt/contexts/merchantContext";

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
  <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export default function MerchantPage({
  params,
}: {
  params: { merchantId: string };
}) {
  const { isLoading, showLoading, hideLoading } = useLoading();

  // Simulate data loading
  useEffect(() => {
    showLoading("กำลังโหลด...");
    const loadData = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
    };
    loadData();
    hideLoading();
  }, [params.merchantId]);

  // Mock data
  const storeStats = {
    couponCount: {
      total: 1250,
      purchased: 320,
      soldToEndUser: 890,
      pendingUse: 456,
      redeemed: 434,
    },
    couponValue: {
      total: 2500000,
      sold: 1780000,
      pendingUse: 912000,
      redeemed: 868000,
    },
  };

  const endUserStats = {
    total: 4521,
    buyers: 2340,
    couponsSold: 890,
    pendingUsers: 456,
    redeemedUsers: 434,
  };

  const transactionStats = {
    transferPoint: 12500,
    redeemPoint: 8700,
  };

  const pointStats = {
    total: 125000,
    types: ["Loyalty Point", "Bonus Point", "Referral Point"],
  };

  const thbTokenStats = {
    deposited: 5000000,
    usedForPromotion: 1200000,
    usedForRedeem: 3200000,
  };

  // Chart configurations
  const couponDonutOptions: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
    },
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
              formatter: () => storeStats.couponCount.total.toLocaleString(),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#9ca3af",
      },
    },
    stroke: {
      show: false,
    },
    theme: {
      mode: "dark",
    },
  };

  const couponValueBarOptions: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "60%",
      },
    },
    colors: ["#a855f7", "#10b981", "#f59e0b", "#ec4899"],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["มูลค่าทั้งหมด", "ขายแล้ว", "รอใช้", "Redeem แล้ว"],
      labels: {
        style: { colors: "#9ca3af" },
        formatter: (val: string) => `฿${(Number(val) / 1000000).toFixed(1)}M`,
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af" },
      },
    },
    grid: {
      borderColor: "rgba(255,255,255,0.05)",
    },
    theme: {
      mode: "dark",
    },
  };

  const endUserLineOptions: ApexOptions = {
    chart: {
      type: "area",
      background: "transparent",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
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
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      labels: {
        style: { colors: "#9ca3af" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af" },
      },
    },
    grid: {
      borderColor: "rgba(255,255,255,0.05)",
    },
    legend: {
      labels: {
        colors: "#9ca3af",
      },
    },
    theme: {
      mode: "dark",
    },
  };

  const transactionPieOptions: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
    },
    labels: ["โอน Point", "Redeem Point"],
    colors: ["#10b981", "#ec4899"],
    legend: {
      position: "bottom",
      labels: {
        colors: "#9ca3af",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
    },
    stroke: {
      show: false,
    },
    theme: {
      mode: "dark",
    },
  };

  const pointRadialOptions: ApexOptions = {
    chart: {
      type: "radialBar",
      background: "transparent",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "60%",
        },
        dataLabels: {
          name: {
            show: true,
            color: "#9ca3af",
          },
          value: {
            show: true,
            color: "#f59e0b",
            fontSize: "24px",
            fontWeight: "bold",
            formatter: () => pointStats.total.toLocaleString(),
          },
        },
        track: {
          background: "rgba(255,255,255,0.1)",
        },
      },
    },
    colors: ["#f59e0b"],
    labels: ["Point ทั้งหมด"],
    theme: {
      mode: "dark",
    },
  };

  const thbTokenAreaOptions: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        columnWidth: "60%",
      },
    },
    colors: ["#06b6d4", "#a855f7", "#ec4899"],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      labels: {
        style: { colors: "#9ca3af" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af" },
        formatter: (val: number) => `฿${(val / 1000).toFixed(0)}K`,
      },
    },
    grid: {
      borderColor: "rgba(255,255,255,0.05)",
    },
    legend: {
      labels: {
        colors: "#9ca3af",
      },
    },
    theme: {
      mode: "dark",
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MarketingStatCard
          title="Total Transactions"
          value="192,817"
          trend="5.3%"
          isPositive={true}
          icon={<LocalMallOutlinedIcon />}
          iconBgColor="bg-purple-500/20 text-purple-400"
        />
        <MarketingStatCard
          title="Token Volume"
          value="$2.7M"
          trend="8.1%"
          isPositive={true}
          icon={<AssignmentOutlinedIcon />}
          iconBgColor="bg-pink-500/20 text-pink-400"
        />
        <MarketingStatCard
          title="Active Wallets"
          value="4,521"
          trend="12.9%"
          isPositive={true}
          icon={<CachedOutlinedIcon />}
          iconBgColor="bg-emerald-500/20 text-emerald-400"
        />
        <MarketingStatCard
          title="NFTs Minted"
          value="1,289"
          trend="16.2%"
          isPositive={true}
          icon={<AdsClickOutlinedIcon />}
          iconBgColor="bg-cyan-500/20 text-cyan-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
          <AdsPerformanceChart />
        </div>
        <div className="lg:col-span-1 bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
          <LeadPerformanceScore />
        </div>
      </div>

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
                    storeStats.couponCount.total -
                      storeStats.couponCount.soldToEndUser,
                    storeStats.couponCount.soldToEndUser -
                      storeStats.couponCount.pendingUse,
                    storeStats.couponCount.pendingUse,
                    storeStats.couponCount.redeemed,
                  ]}
                  type="donut"
                  height="100%"
                />
              </div>
              <div className="space-y-1">
                <StatsItem
                  label="จำนวนคูปองที่เรามี"
                  value={storeStats.couponCount.total.toLocaleString()}
                  color="text-purple-400"
                />
                <StatsItem
                  label="ขายทั้งหมด"
                  value={storeStats.couponCount.soldToEndUser.toLocaleString()}
                  color="text-emerald-400"
                />
                <StatsItem
                  label="รอใช้งาน"
                  value={storeStats.couponCount.pendingUse.toLocaleString()}
                  color="text-amber-400"
                />
                <StatsItem
                  label="Redeem แล้ว"
                  value={storeStats.couponCount.redeemed.toLocaleString()}
                  color="text-pink-400"
                />
              </div>
            </div>
          </SectionCard>

          {/* Coupon Value with Bar Chart */}
          <SectionCard
            title="มูลค่าคูปอง"
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
                      storeStats.couponValue.total,
                      storeStats.couponValue.sold,
                      storeStats.couponValue.pendingUse,
                      storeStats.couponValue.redeemed,
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
                  {endUserStats.total.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">จำนวนที่เรามี</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {endUserStats.buyers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">คนที่ซื้อ</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {endUserStats.couponsSold.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">คูปองที่ขาย</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">
                  {endUserStats.pendingUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">รอใช้งาน</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center col-span-2 md:col-span-2">
                <p className="text-2xl font-bold text-pink-400">
                  {endUserStats.redeemedUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Redeem แล้ว</p>
              </div>
            </div>
            {/* Area Chart */}
            <div className="h-[200px]">
              <Chart
                options={endUserLineOptions}
                series={[
                  {
                    name: "New Users",
                    data: [420, 532, 601, 834, 920, 1021],
                  },
                  {
                    name: "Active Users",
                    data: [320, 442, 521, 654, 720, 821],
                  },
                ]}
                type="area"
                height="100%"
              />
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
                transactionStats.transferPoint,
                transactionStats.redeemPoint,
              ]}
              type="pie"
              height="100%"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-400">
                {transactionStats.transferPoint.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">โอน Point</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-pink-400">
                {transactionStats.redeemPoint.toLocaleString()}
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
              {pointStats.types.map((type, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* THB Token with Stacked Bar Chart */}
        <SectionCard
          title="THB Token"
          icon={<AccountBalanceWalletIcon className="w-5 h-5" />}
          iconColor="bg-cyan-500/20 text-cyan-400"
        >
          <div className="h-[180px]">
            <Chart
              options={thbTokenAreaOptions}
              series={[
                {
                  name: "เติมเข้า",
                  data: [800, 920, 850, 1100, 980, 1200],
                },
                {
                  name: "ใช้จอง",
                  data: [200, 180, 220, 280, 250, 300],
                },
                {
                  name: "ใช้ Redeem",
                  data: [400, 520, 480, 620, 580, 700],
                },
              ]}
              type="bar"
              height="100%"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-cyan-400">฿5M</p>
              <p className="text-[10px] text-gray-500">เติม</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-purple-400">฿1.2M</p>
              <p className="text-[10px] text-gray-500">จอง</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-pink-400">฿3.2M</p>
              <p className="text-[10px] text-gray-500">Redeem</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
