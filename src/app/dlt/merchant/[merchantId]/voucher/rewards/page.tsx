"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMerchantId, useLoading } from "@/app/dlt/contexts/merchantContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface Reward {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  value: string;
  pointsCost: number;
  totalIssued: number;
  redeemed: number;
  remaining: number;
  status: string;
  createdAt: string;
  endDate: string;
  isExpired: boolean;
}

export default function OurRewardsPage() {
  const merchantId = useMerchantId();
  const { showLoading, hideLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [rewards, setRewards] = useState<Reward[]>([]);

  // Fetch logic
  useEffect(() => {
    const fetchRewards = async () => {
      if (!merchantId) return;

      showLoading("กำลังโหลดข้อมูล Rewards...");
      try {
        const response = await fetch(`/api/${merchantId}/voucher`);
        if (!response.ok) {
          throw new Error("Failed to fetch vouchers");
        }
        const data = await response.json();

        console.log("Raw Rewards Data:", data);
        // Map API data to Reward structure
        const mappedRewards: Reward[] = data.map((v: any) => ({
          id: v.id,
          name: v.name,
          imageUrl:
            v.imageUrl || "https://placehold.co/100x100/purple/white?text=RWD",
          type: "Voucher", // Assuming API returns vouchers
          value: v.valueType === "FIXED" ? `฿${v.value}` : `${v.value}%`,
          pointsCost: v.pointsCost || 0,
          totalIssued: v.totalIssued || 0,
          redeemed: v.totalRedeemed || 0,
          remaining: (v.totalIssued || 0) - (v.totalRedeemed || 0),
          status: v.status || "Inactive",
          endDate: v.endDate,
          isExpired: new Date(v.endDate).getTime() < Date.now(),
          createdAt: new Date(v.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));

        setRewards(mappedRewards.filter((v) => v.status === "upcoming"));
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        hideLoading();
      }
    };

    fetchRewards();
  }, [merchantId]);

  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch =
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      reward.status.toLowerCase().replace(" ", "-") ===
        selectedStatus.toLowerCase(); // Adjusted logic
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/20 text-emerald-400";
      case "Low Stock":
        return "bg-amber-500/20 text-amber-400";
      case "Out of Stock":
        return "bg-red-500/20 text-red-400";
      case "Inactive":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };
  console.log(rewards);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">
            Manage all products for merchant {merchantId}
          </p>
        </div>
        <Link
          href={`/dlt/merchant/${merchantId}/marketplace`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/25"
        >
          Shopping product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Rewards</p>
          <h3 className="text-2xl font-bold text-white">{rewards.length}</h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <h3 className="text-2xl font-bold text-emerald-400">
            {rewards.filter((r) => r.status === "Active").length}
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Redeemed</p>
          <h3 className="text-2xl font-bold text-purple-400">
            {rewards.reduce((sum, r) => sum + r.redeemed, 0).toLocaleString()}
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Low Stock</p>
          <h3 className="text-2xl font-bold text-amber-400">
            {
              rewards.filter(
                (r) =>
                  r.status === "Low Stock" ||
                  r.status === "Out of Stock" ||
                  (r.remaining < 10 && r.remaining > 0),
              ).length
            }
          </h3>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rewards..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer min-w-[150px]"
        >
          <option value="all" className="bg-[#1a1a2e]">
            All Status
          </option>
          <option value="active" className="bg-[#1a1a2e]">
            Active
          </option>
          <option value="low-stock" className="bg-[#1a1a2e]">
            Low Stock
          </option>
          <option value="out-of-stock" className="bg-[#1a1a2e]">
            Out of Stock
          </option>
          <option value="inactive" className="bg-[#1a1a2e]">
            Inactive
          </option>
        </select>
        <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <FilterListIcon />
        </button>
        <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <FileDownloadIcon />
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Reward
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Expire
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRewards.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No rewards found
                  </td>
                </tr>
              ) : (
                filteredRewards.map((reward) => (
                  <tr
                    key={reward.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                          {reward.imageUrl ? (
                            <Image
                              src={reward.imageUrl}
                              alt={reward.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xs">
                              🎁
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {reward.name}
                          </p>
                          <p className="text-xs text-gray-500">{reward.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400">
                        {reward.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {reward.value}
                    </td>
                    <td className="px-6 py-4">
                      {reward.isExpired ? (
                        <span className="text-sm font-medium text-red-400">หมดอายุ</span>
                      ) : (
                        <span className="text-sm font-medium text-green-400">ใช้งานได้</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              reward.remaining / reward.totalIssued > 0.5
                                ? "bg-emerald-500"
                                : reward.remaining / reward.totalIssued > 0.2
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${
                                reward.totalIssued > 0
                                  ? (reward.remaining / reward.totalIssued) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {reward.remaining}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          reward.status,
                        )}`}
                      >
                        {reward.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <MoreVertIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {filteredRewards.length} of {rewards.length} rewards
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg">
              1
            </button>
            <button className="px-4 py-2 text-sm text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              2
            </button>
            <button className="px-4 py-2 text-sm text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
