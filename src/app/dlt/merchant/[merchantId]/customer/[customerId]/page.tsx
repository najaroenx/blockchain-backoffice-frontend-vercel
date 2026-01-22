"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import TokenIcon from "@mui/icons-material/Token";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";
import { api } from "@/libs/api";
import { ApexOptions } from "apexcharts";

// Dynamic import for ApexCharts (no SSR)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CustomerData {
  id: string;
  email?: string;
  walletAddress?: string;
  firstName?: string;
  lastName?: string;
  wallet?: {
    id: string;
    status: string;
    phoneNumber?: string;
    balance?: number;
  };
  customerPoints?: Array<{
    id: string;
    pointId: string;
    balance: number;
    point?: {
      name: string;
    };
    name: string;
    symbol: string;
    contractAddress: string;
    decimal: number;
    merchantId: string;
    balances: number;
  }>;
  transactions?: Array<{
    id: string;
    type: string;
    amount: number;
    createdAt: string;
    transactionTypeId: string;
    receiverType: string;
  }>;
}

// Skeleton Component
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
);

// Stats Card Component
const StatsCard = ({
  title,
  value,
  icon,
  color,
  trend,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  isLoading?: boolean;
}) => (
  <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all">
    <div className="flex items-center justify-between">
      <div
        className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-400 text-sm">
          <TrendingUpIcon className="w-4 h-4" />
          {trend}
        </div>
      )}
    </div>
    <p className="text-gray-400 text-sm mt-4">{title}</p>
    {isLoading ? (
      <Skeleton className="h-8 w-24 mt-1" />
    ) : (
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
    )}
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
  <div className="rounded-2xl border border-white/5 p-6 shadow-xl hover:border-white/10 transition-all duration-300">
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

export default function CustomerDetailPage() {
  const params = useParams();
  const merchantId = params.merchantId as string;
  const customerId = params.customerId as string;

  const { execute, isExecuting } = useApiWithLoading();
  const [customer, setCustomer] = useState<CustomerData | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      const result = await execute(
        () =>
          api(`/api/${merchantId}/customer/${customerId}`, {
            method: "GET",
          }),
        {
          loadingText: "กำลังโหลดข้อมูลลูกค้า...",
          showSuccessOnComplete: false,
        }
      );

      if (result) {
        console.log(result);
        setCustomer(result);
      }
    };

    if (merchantId && customerId) {
      fetchCustomer();
    }
  }, [merchantId, customerId]);

  // Generate avatar from name
  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "Customer"
    )}&background=7c3aed&color=fff&size=200`;
  };

  // Mask wallet address
  const maskWallet = (address?: string) => {
    if (!address) return "N/A";
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const customerName =
    customer?.firstName && customer?.lastName
      ? `${customer.firstName} ${customer.lastName}`
      : customer?.wallet?.phoneNumber || "Unknown Customer";

  // Calculate stats
  const totalPoints =
    customer?.customerPoints?.reduce(
      (sum, cp) => sum + (cp.balances || 0),
      0
    ) || 0;
  const totalTransactions = customer?.transactions?.length || 0;
  const totalSpent =
    customer?.transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

  // Points Donut Chart Options
  const pointsDonutOptions: ApexOptions = {
    chart: { type: "donut", background: "transparent" },
    labels: customer?.customerPoints?.map((cp) => cp.name || "Point") || [],
    colors: ["#a855f7", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Points",
              color: "#9ca3af",
              formatter: () => totalPoints.toLocaleString(),
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

  const pointsDonutSeries =
    customer?.customerPoints?.map((cp) => cp.balances || 0) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/dlt/merchant/${merchantId}/customer/list`}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowBackIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white dlt-heading">
              Customer Detail
            </h1>
            <p className="text-gray-400 mt-1">รายละเอียดลูกค้า</p>
          </div>
        </div>
        <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <EditIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Customer Profile Card - Full Width */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
        <div className="flex flex-wrap items-center gap-6">
          {/* Avatar */}
          {isExecuting ? (
            <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-500/30 shrink-0">
              <Image
                src={getAvatarUrl(customerName)}
                alt={customerName}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Customer Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              {isExecuting ? (
                <Skeleton className="h-7 w-48" />
              ) : (
                <h2 className="text-xl font-bold text-white">{customerName}</h2>
              )}
              {!isExecuting && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    customer?.wallet?.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {customer?.wallet?.status || "Unknown"}
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-gray-400">
                <PhoneIcon className="w-4 h-4" />
                <span className="text-sm text-white">
                  {isExecuting ? (
                    <Skeleton className="h-4 w-24 inline-block" />
                  ) : (
                    customer?.wallet?.phoneNumber || "N/A"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <EmailIcon className="w-4 h-4" />
                <span className="text-sm text-white truncate">
                  {isExecuting ? (
                    <Skeleton className="h-4 w-32 inline-block" />
                  ) : (
                    customer?.email || "N/A"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <AccountBalanceWalletIcon className="w-4 h-4" />
                <span className="text-sm text-purple-400 font-mono">
                  {isExecuting ? (
                    <Skeleton className="h-4 w-28 inline-block" />
                  ) : (
                    maskWallet(customer?.walletAddress)
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-xs">ID:</span>
                <span className="text-sm text-gray-300 font-mono truncate">
                  {isExecuting ? (
                    <Skeleton className="h-4 w-24 inline-block" />
                  ) : (
                    customer?.id?.substring(0, 12) + "..."
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Points"
          value={totalPoints.toLocaleString()}
          icon={<TokenIcon className="w-6 h-6" />}
          color="bg-amber-500/20 text-amber-400"
          isLoading={isExecuting}
        />
        <StatsCard
          title="Point Types"
          value={customer?.customerPoints?.length || 0}
          icon={<LocalMallOutlinedIcon className="w-6 h-6" />}
          color="bg-purple-500/20 text-purple-400"
          isLoading={isExecuting}
        />
        <StatsCard
          title="Transactions"
          value={totalTransactions.toLocaleString()}
          icon={<SwapHorizIcon className="w-6 h-6" />}
          color="bg-emerald-500/20 text-emerald-400"
          isLoading={isExecuting}
        />
        <StatsCard
          title="Total Amount"
          value={totalSpent.toLocaleString()}
          icon={<ConfirmationNumberIcon className="w-6 h-6" />}
          color="bg-pink-500/20 text-pink-400"
          isLoading={isExecuting}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points Section with Donut Chart */}
        <SectionCard
          title="Customer Points"
          icon={<TokenIcon className="w-5 h-5" />}
          iconColor="bg-amber-500/20 text-amber-400"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donut Chart */}
            <div className="h-[200px]">
              {isExecuting ? (
                <Skeleton className="w-full h-full" />
              ) : pointsDonutSeries.length > 0 ? (
                <Chart
                  options={pointsDonutOptions}
                  series={pointsDonutSeries}
                  type="donut"
                  height="100%"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No points data
                </div>
              )}
            </div>

            {/* Points List */}
            <div className="space-y-3">
              {isExecuting ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : customer?.customerPoints &&
                customer.customerPoints.length > 0 ? (
                customer.customerPoints.map((cp) => (
                  <div
                    key={cp.id}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0"
                  >
                    <span className="text-sm text-gray-400">
                      {cp.name || "Point"}
                    </span>
                    <span className="text-lg font-semibold text-amber-400">
                      {cp.balances?.toLocaleString() || "0"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  ไม่พบข้อมูล
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Wallet Info Section */}
        <SectionCard
          title="Wallet Information"
          icon={<AccountBalanceWalletIcon className="w-5 h-5" />}
          iconColor="bg-cyan-500/20 text-cyan-400"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-gray-400">Wallet ID</span>
              {isExecuting ? (
                <Skeleton className="h-5 w-48" />
              ) : (
                <span className="text-sm text-white font-mono">
                  {customer?.wallet?.id || "N/A"}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-gray-400">Wallet Address</span>
              {isExecuting ? (
                <Skeleton className="h-5 w-40" />
              ) : (
                <span className="text-sm text-purple-400 font-mono">
                  {maskWallet(customer?.walletAddress)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-gray-400">Status</span>
              {isExecuting ? (
                <Skeleton className="h-6 w-20 rounded-full" />
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    customer?.wallet?.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {customer?.wallet?.status || "Unknown"}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-400">Phone Number</span>
              {isExecuting ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                <span className="text-sm text-white">
                  {customer?.wallet?.phoneNumber || "N/A"}
                </span>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Transaction History - Full Width */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
          Transaction History
        </h2>
        <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Type
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Receiver Type
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Amount
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isExecuting ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="p-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    </tr>
                  ))
                ) : customer?.transactions &&
                  customer.transactions.length > 0 ? (
                  customer.transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-sm text-white">
                        {tx.transactionTypeId}
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {tx.receiverType || "-"}
                      </td>
                      <td className="p-4 text-sm text-emerald-400 font-medium">
                        {tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString("th-TH")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      ไม่พบข้อมูล Transaction
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 bg-white/5 border border-white/10 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/10 hover:border-red-500/30 transition-colors">
          Delete Customer
        </button>
      </div>
    </div>
  );
}
