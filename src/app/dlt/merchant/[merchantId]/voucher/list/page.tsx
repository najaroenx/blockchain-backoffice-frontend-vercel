"use client";

import { useLoading, useMerchantId } from "@/app/dlt/contexts/merchantContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";
import { useEffect, useState } from "react";
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
}
export default function VoucherListPage() {
  const merchantId = useMerchantId();
  const { showLoading, hideLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const vouchers = [
    {
      id: "VCH-001",
      name: "Welcome Bonus",
      discount: "20%",
      type: "Percentage",
      usage: "156/500",
      validUntil: "Jan 31, 2026",
      status: "Active",
    },
    {
      id: "VCH-002",
      name: "New Year Special",
      discount: "฿100",
      type: "Fixed",
      usage: "89/200",
      validUntil: "Feb 15, 2026",
      status: "Active",
    },
    {
      id: "VCH-003",
      name: "Member Exclusive",
      discount: "15%",
      type: "Percentage",
      usage: "200/200",
      validUntil: "Dec 31, 2025",
      status: "Inactive",
    },
    {
      id: "VCH-004",
      name: "Flash Sale",
      discount: "฿50",
      type: "Fixed",
      usage: "0/100",
      validUntil: "Jan 20, 2026",
      status: "Inactive",
    },
  ];

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
          status: v.status || "active",
          createdAt: new Date(v.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));

        setRewards(mappedRewards.filter((v) => v.status === "active"));
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        hideLoading();
      }
    };

    fetchRewards();
  }, [merchantId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Vouchers</h1>
        <p className="text-gray-400 mt-1">
          Manage vouchers for merchant {merchantId}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Vouchers</p>
          <h3 className="text-2xl font-bold text-white">{rewards.length}</h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Inactive</p>
          <h3 className="text-2xl font-bold text-gray-400">
            {rewards.filter((r) => r.status === "inactive").length}
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Redeemed</p>
          <h3 className="text-2xl font-bold text-purple-400">
            {rewards.reduce((acc, r) => acc + r.redeemed, 0).toLocaleString()}
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <h3 className="text-2xl font-bold text-emerald-400">
            {rewards.filter((r) => r.status === "active").length}
          </h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["all", "active", "inactive"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedStatus(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
              selectedStatus === tab
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Voucher
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Valid Until
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
              {rewards
                .filter(
                  (r) =>
                    selectedStatus === "all" ||
                    r.status.toLowerCase() === selectedStatus.toLowerCase()
                )
                .map((reward) => (
                  <tr
                    key={reward.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                          <Image
                            src={reward.imageUrl}
                            alt={reward.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {reward.name}
                          </p>
                          <p className="text-xs text-gray-500">{reward.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-purple-400">
                      {reward.value}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {reward.type}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{
                              width: `${
                                reward.totalIssued > 0
                                  ? (reward.redeemed / reward.totalIssued) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {reward.redeemed}/{reward.totalIssued}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {reward.pointsCost > 0
                        ? `${reward.pointsCost.toLocaleString()} pts`
                        : "Free"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          reward.status.toLowerCase() === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
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
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
