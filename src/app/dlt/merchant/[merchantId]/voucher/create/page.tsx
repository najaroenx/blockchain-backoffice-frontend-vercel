"use client";

import { useState, useEffect, useCallback } from "react";
import { useMerchantId } from "@/app/dlt/contexts/merchantContext";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PercentIcon from "@mui/icons-material/Percent";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarsIcon from "@mui/icons-material/Stars";

type CampaignType = "voucher" | "discount" | "points" | "gift";
interface Point {
  id: string;
  name: string;
  symbol: string;
  initialSupply: number;
  decimal: number;
  imageUrl?: string;
  startDate?: number;
  endDate?: number;
  createdAt?: string;
}
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
const campaignTypes = [
  {
    id: "voucher" as CampaignType,
    name: "Voucher",
    description: "Create redeemable voucher codes",
    icon: LocalOfferIcon,
    color: "purple",
  },
  {
    id: "discount" as CampaignType,
    name: "Discount",
    description: "Offer percentage or fixed discounts",
    icon: PercentIcon,
    color: "pink",
  },
  {
    id: "points" as CampaignType,
    name: "Bonus Points",
    description: "Reward customers with extra points",
    icon: StarsIcon,
    color: "amber",
  },
  {
    id: "gift" as CampaignType,
    name: "Free Gift",
    description: "Give away products or services",
    icon: CardGiftcardIcon,
    color: "emerald",
  },
];

export default function CampaignCreatePage() {
  const merchantId = useMerchantId();
  const [error, setError] = useState<string | null>(null);
  const { execute } = useApiWithLoading();

  const [points, setPoints] = useState<Point[]>([]);
  const [isPointDropdownOpen, setIsPointDropdownOpen] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isRewardDropdownOpen, setIsRewardDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    campaignType: "voucher" as CampaignType,
    name: "",
    description: "",
    image: null as File | null,
    // Step 2: Campaign Details
    selectedCoupon: "",
    selectedPointProgram: "",
    pointsRequired: "",
    pointsType: "fixed", // fixed or range
    pointsMin: "",
    pointsMax: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    maxUsage: "",
    usagePerUser: "1",
    // Step 3: Schedule & Targeting
    validFrom: "",
    validUntil: "",
    targetAudience: "all",
    memberTiers: [] as string[],
  });

  // Mock available point programs
  const availablePointPrograms = [
    {
      id: "PTS-001",
      name: "Loyalty Points",
      symbol: "LP",
      balance: 125000,
      icon: "🪙",
      color: "amber",
    },
    {
      id: "PTS-002",
      name: "Reward Coins",
      symbol: "RC",
      balance: 50000,
      icon: "💰",
      color: "emerald",
    },
    {
      id: "PTS-003",
      name: "DLT Tokens",
      symbol: "DLT",
      balance: 10000,
      icon: "⭐",
      color: "purple",
    },
    {
      id: "PTS-004",
      name: "Cashback Credits",
      symbol: "CB",
      balance: 75000,
      icon: "💎",
      color: "cyan",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      pointsCost: +formData.pointsRequired,
      amount: +formData.maxUsage,
      pointId: formData.selectedPointProgram,
      currency: points.find(
        (point) => point.id === formData.selectedPointProgram
      )?.symbol,
    };

    await execute(
      async () => {
        const response = await fetch(
          `/api/${merchantId}/voucher/activate/${formData.selectedCoupon}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to activate voucher");
        }

        return response.json();
      },
      {
        loadingText: "กำลังเปิดใช้งาน Voucher...",
        successText: "Voucher activated successfully",
        errorText: "ไม่สามารถเปิดใช้งาน Voucher ได้",
        redirectOnSuccess: `/dlt/merchant/${merchantId}/voucher/list`,
        redirectDelay: 3000,
      }
    );
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string }> =
      {
        purple: {
          bg: isSelected ? "bg-purple-500/20" : "bg-white/5",
          border: isSelected ? "border-purple-500" : "border-white/10",
          text: "text-purple-400",
        },
        pink: {
          bg: isSelected ? "bg-pink-500/20" : "bg-white/5",
          border: isSelected ? "border-pink-500" : "border-white/10",
          text: "text-pink-400",
        },
        amber: {
          bg: isSelected ? "bg-amber-500/20" : "bg-white/5",
          border: isSelected ? "border-amber-500" : "border-white/10",
          text: "text-amber-400",
        },
        emerald: {
          bg: isSelected ? "bg-emerald-500/20" : "bg-white/5",
          border: isSelected ? "border-emerald-500" : "border-white/10",
          text: "text-emerald-400",
        },
      };
    return colors[color];
  };

  // Fetch data on mount
  const fetchData = useCallback(async () => {
    if (!merchantId) return;

    // Fetch Points
    try {
      const pointsData = await execute(
        async () => {
          const response = await fetch(`/api/${merchantId}/point`);
          if (!response.ok) throw new Error("Failed to fetch points");
          return response.json();
        },
        {
          loadingText: "กำลังโหลดข้อมูล...",
          showSuccessOnComplete: false,
          showErrorOnFail: false,
        }
      );
      if (pointsData) {
        setPoints(pointsData);
      }
    } catch (err) {
      console.error("Error fetching points:", err);
    }

    // Fetch Rewards
    try {
      const rewardsData = await execute(
        async () => {
          const response = await fetch(`/api/${merchantId}/voucher`);
          if (!response.ok) throw new Error("Failed to fetch vouchers");
          return response.json();
        },
        {
          loadingText: "กำลังโหลดข้อมูล Rewards...",
          showSuccessOnComplete: false,
          showErrorOnFail: false,
        }
      );

      if (rewardsData) {
        const mappedRewards: Reward[] = rewardsData.map((v: any) => ({
          id: v.id,
          name: v.name,
          imageUrl:
            v.imageUrl || "https://placehold.co/100x100/purple/white?text=RWD",
          type: "Voucher",
          value: v.valueType === "FIXED" ? `฿${v.value}` : `${v.value}%`,
          pointsCost: v.pointsCost || 0,
          totalIssued: v.totalIssued || 0,
          redeemed: v.totalRedeemed || 0,
          remaining: (v.totalIssued || 0) - (v.totalRedeemed || 0),
          status: v.status || "Inactive",
          createdAt: new Date(v.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));
        setRewards(mappedRewards.filter((v) => v.status === "upcoming"));
      }
    } catch (err) {
      console.error("Error fetching rewards:", err);
    }
  }, [merchantId, execute]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Create Campaign</h1>
        <p className="text-gray-400 mt-1">
          Launch a new marketing campaign for your customers
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Step 2: Campaign Details */}
        <div>
          <div className="space-y-6">
            {/* Campaign Type Selection */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Select Campaign Type
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {campaignTypes.map((type) => {
                  const isSelected = formData.campaignType === type.id;
                  const colors = getColorClasses(type.color, isSelected);
                  return (
                    <div
                      key={type.id}
                      onClick={() =>
                        setFormData({ ...formData, campaignType: type.id })
                      }
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${colors.bg} ${colors.border} hover:scale-[1.02]`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg}`}
                        >
                          <type.icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">
                            {type.name}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircleIcon className={colors.text} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campaign Info */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 space-y-5">
              <h3 className="text-lg font-semibold text-white">
                Campaign Information
              </h3>

              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="e.g., New Year Sale 2026"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                  placeholder="Describe your campaign..."
                />
              </div>
            </div>
          </div>
          <div className="space-y-6 py-4">
            {/* Select Reward Coupon */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Select Reward Coupon
                </h3>
                <span className="text-sm text-gray-400">
                  Choose a coupon as campaign reward
                </span>
              </div>

              {/* Dropdown Select */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsRewardDropdownOpen(!isRewardDropdownOpen)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-left"
                  >
                    {formData.selectedCoupon ? (
                      (() => {
                        const selected = rewards.find(
                          (c) => c.id === formData.selectedCoupon
                        );
                        if (!selected)
                          return (
                            <span className="text-gray-400">
                              -- Select a voucher --
                            </span>
                          );
                        return (
                          <div className="flex items-center gap-2">
                            {selected.imageUrl && (
                              <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0">
                                <Image
                                  src={selected.imageUrl}
                                  alt={selected.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <span className="truncate">
                              {selected.name} - {selected.value}
                            </span>
                          </div>
                        );
                      })()
                    ) : (
                      <span className="text-gray-400">
                        -- Select a voucher --
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isRewardDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isRewardDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                      {rewards.map((reward) => (
                        <button
                          key={reward.id}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              selectedCoupon: reward.id,
                            });
                            setIsRewardDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white transition-colors text-left border-b border-white/5 last:border-0"
                        >
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white/5">
                            {reward.imageUrl ? (
                              <Image
                                src={reward.imageUrl}
                                alt={reward.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs">
                                🎫
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-medium truncate">
                              {reward.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {reward.value} •{" "}
                              {reward.remaining.toLocaleString()} left
                            </span>
                          </div>
                        </button>
                      ))}
                      {rewards.length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">
                          No vouchers found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="hidden px-4 py-3 bg-white/5 text-gray-300 text-sm font-medium rounded-xl border border-white/10 hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  + Create New
                </button>
              </div>

              {/* Selected Voucher Preview */}
              {formData.selectedCoupon &&
                (() => {
                  const selected = rewards.find(
                    (c) => c.id === formData.selectedCoupon
                  );
                  if (!selected) return null;
                  return (
                    <div className="space-y-4">
                      <div className="p-5 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-purple-500/30 shrink-0">
                            {selected.imageUrl ? (
                              <Image
                                src={selected.imageUrl}
                                alt={selected.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                                🎫
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xl font-bold text-white">
                                {selected.name}
                              </h4>
                              <CheckCircleIcon
                                className="text-emerald-400"
                                fontSize="small"
                              />
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300">
                                {selected.type}
                              </span>
                              <span className="text-lg font-bold text-purple-400">
                                {selected.value}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Available</p>
                            <p className="text-2xl font-bold text-white">
                              {selected.remaining.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">remaining</p>
                          </div>
                        </div>
                      </div>

                      {/* Allocated Quantity Input */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Allocated Quantity{" "}
                            <span className="text-pink-500">*</span>
                          </label>
                          <span className="text-xs text-gray-400">
                            Quota for this campaign
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.maxUsage}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val > selected.remaining)
                                return;
                              setFormData({
                                ...formData,
                                maxUsage: e.target.value,
                              });
                            }}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            placeholder={`Enter quantity (Max: ${selected.remaining})`}
                            max={selected.remaining}
                            min="1"
                          />
                          {formData.maxUsage &&
                            parseInt(formData.maxUsage) >
                              selected.remaining && (
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-sm">
                                Exceeds stock
                              </span>
                            )}
                        </div>
                        <p className="text-xs text-purple-400 mt-2">
                          * Reserves{" "}
                          {formData.maxUsage
                            ? parseInt(formData.maxUsage).toLocaleString()
                            : "0"}{" "}
                          coupons from inventory.
                        </p>
                      </div>
                    </div>
                  );
                })()}
            </div>

            {/* Points Required */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Points Required
                </h3>
                <span className="text-sm text-gray-400">
                  Select point program and amount
                </span>
              </div>

              {/* Point Program Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Point Program
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsPointDropdownOpen(!isPointDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-left"
                  >
                    {formData.selectedPointProgram ? (
                      (() => {
                        const selected =
                          points.find(
                            (p) => p.id === formData.selectedPointProgram
                          ) ||
                          points.find(
                            (p) =>
                              p.initialSupply.toString() ===
                              formData.selectedPointProgram
                          );
                        if (!selected)
                          return (
                            <span className="text-gray-400">
                              -- Select a point program --
                            </span>
                          );
                        return (
                          <div className="flex items-center gap-2">
                            {selected.imageUrl ? (
                              <Image
                                src={selected.imageUrl}
                                alt={selected.name}
                                width={24}
                                height={24}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white">
                                {selected.symbol[0]}
                              </div>
                            )}
                            <span className="truncate">
                              {selected.name} ({selected.symbol})
                            </span>
                          </div>
                        );
                      })()
                    ) : (
                      <span className="text-gray-400">
                        -- Select a point program --
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isPointDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isPointDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                      {points.map((point) => (
                        <button
                          key={point.id}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              selectedPointProgram: point.id, // Storing ID now
                            });
                            setIsPointDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/5 text-white transition-colors text-left border-b border-white/5 last:border-0"
                        >
                          {point.imageUrl ? (
                            <Image
                              src={point.imageUrl}
                              alt={point.name}
                              width={24}
                              height={24}
                              className="rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white shrink-0">
                              {point.symbol[0]}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {point.name} ({point.symbol})
                            </span>
                            <span className="text-xs text-gray-400">
                              {point.initialSupply.toLocaleString()} available
                            </span>
                          </div>
                        </button>
                      ))}
                      {points.length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">
                          No points found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Point Program Preview */}
              {formData.selectedPointProgram &&
                (() => {
                  const selected = availablePointPrograms.find(
                    (p) => p.id === formData.selectedPointProgram
                  );
                  if (!selected) return null;
                  return (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30">
                          {selected.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-white">
                              {selected.name}
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-mono">
                              {selected.symbol}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            Available balance:{" "}
                            <span className="text-amber-400 font-bold">
                              {selected.balance.toLocaleString()}
                            </span>{" "}
                            points
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* Points Type - Only show if point program selected */}
              {formData.selectedPointProgram && (
                <>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, pointsType: "fixed" })
                      }
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        formData.pointsType === "fixed"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      Fixed Points
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, pointsType: "range" })
                      }
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        formData.pointsType === "range"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      Points Range
                    </button>
                  </div>

                  {/* Points Input */}
                  {formData.pointsType === "fixed" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Points Amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.pointsRequired}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pointsRequired: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all pr-16"
                          placeholder="e.g., 500"
                          min="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 font-medium">
                          pts
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Minimum Points
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pointsMin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pointsMin: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all pr-16"
                            placeholder="e.g., 100"
                            min="0"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 font-medium">
                            pts
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Maximum Points
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.pointsMax}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pointsMax: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all pr-16"
                            placeholder="e.g., 1000"
                            min="0"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 font-medium">
                            pts
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Select Points */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quick Select
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[100, 250, 500, 1000, 2500, 5000].map((points) => (
                        <button
                          key={points}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              pointsRequired: points.toString(),
                            })
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.pointsRequired === points.toString()
                              ? "bg-amber-500 text-white"
                              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {points.toLocaleString()} pts
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="space-y-6 py-4">
            {/* Schedule */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 space-y-5">
              <h3 className="text-lg font-semibold text-white">
                Campaign Schedule
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, validFrom: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25"
          >
            🚀 Launch Campaign
          </button>
        </div>
      </form>
    </div>
  );
}
