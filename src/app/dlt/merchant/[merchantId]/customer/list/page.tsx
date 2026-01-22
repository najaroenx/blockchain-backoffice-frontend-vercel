"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useCustomers } from "@/app/dlt/hooks/useCustomers";

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
  <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
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

// Table Row Skeleton
const TableRowSkeleton = () => (
  <tr className="border-b border-white/5">
    <td className="p-4">
      <Skeleton className="w-4 h-4" />
    </td>
    <td className="p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-40" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-28" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-16" />
    </td>
    <td className="p-4">
      <Skeleton className="h-6 w-16 rounded-full" />
    </td>
    <td className="p-4">
      <Skeleton className="w-8 h-8" />
    </td>
  </tr>
);

export default function CustomerListPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params.merchantId as string;

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { customers, total, isLoading, isError, mutate } = useCustomers({
    merchantId,
    start: (page - 1) * pageSize,
    end: page * pageSize,
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleSelectAll = () => {
    if (selectedIds.size === customers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(customers.map((c) => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      (customer.name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (customer.email?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (customer.phone || "").includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(total / pageSize);

  // Generate avatar from name
  const getAvatarUrl = (name: string) => {
    const initial = name?.charAt(0)?.toUpperCase() || "U";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=7c3aed&color=fff&size=100`;
  };

  // Mask wallet address
  const maskWallet = (address?: string) => {
    if (!address) return "N/A";
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white dlt-heading">
            Customers
          </h1>
          <p className="text-gray-400 mt-1">จัดการข้อมูลลูกค้าของคุณ</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => mutate()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <RefreshIcon
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors">
            <FileDownloadOutlinedIcon className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/25">
            <PersonAddIcon className="w-5 h-5" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
          เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Customers"
          value={total.toLocaleString()}
          icon={<PeopleIcon className="w-6 h-6" />}
          color="bg-purple-500/20 text-purple-400"
          trend="+12.5%"
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Customers"
          value={customers
            .filter((c) => c.status === "active")
            .length.toLocaleString()}
          icon={<LocalMallOutlinedIcon className="w-6 h-6" />}
          color="bg-emerald-500/20 text-emerald-400"
          trend="+8.3%"
          isLoading={isLoading}
        />
        <StatsCard
          title="This Page"
          value={customers.length.toLocaleString()}
          icon={<TrendingUpIcon className="w-6 h-6" />}
          color="bg-amber-500/20 text-amber-400"
          isLoading={isLoading}
        />
        <StatsCard
          title="Inactive"
          value={customers
            .filter((c) => c.status === "inactive")
            .length.toLocaleString()}
          icon={<ConfirmationNumberOutlinedIcon className="w-6 h-6" />}
          color="bg-pink-500/20 text-pink-400"
          isLoading={isLoading}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["all", "active", "inactive"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
              statusFilter === status
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {status === "all"
              ? "ทั้งหมด"
              : status === "active"
              ? "Active"
              : "Inactive"}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 border-b border-white/5">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหาลูกค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">
            <FilterListIcon className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    ไม่พบข้อมูลลูกค้า
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() =>
                      router.push(
                        `/dlt/merchant/${merchantId}/customer/${customer.id}`
                      )
                    }
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
                          <Image
                            src={getAvatarUrl(customer.name)}
                            alt={customer.name || "Customer"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {customer.wallet.phoneNumber || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {customer.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-purple-400 font-mono">
                        {maskWallet(customer.walletAddress)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          customer.wallet.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {customer.wallet.status || "unknown"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString(
                            "th-TH"
                          )
                        : "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/dlt/merchant/${merchantId}/customer/${customer.id}`
                          );
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <VisibilityOutlinedIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            แสดง {filteredCustomers.length} จาก {total} รายการ (หน้า {page}/
            {totalPages || 1})
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ก่อนหน้า
            </button>
            <button className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg">
              {page}
            </button>
            <button
              className="px-4 py-2 text-sm text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
