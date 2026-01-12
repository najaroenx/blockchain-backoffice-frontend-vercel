"use client";

import { useState } from "react";
import { useMerchantId, useLoading } from "@/app/dlt/contexts/merchantContext";

export default function PointCreatePage() {
  const merchantId = useMerchantId();
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    // Point Information (matching PointForm.tsx)
    name: "",
    symbol: "",
    initialSupply: "",
    decimal: "18",
    imageUrl: "",
    // Time Management (matching PointForm.tsx)
    timeMode: "preset", // "preset" | "calendar"
    expiryMonths: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("กำลังสร้าง Point Token...");

    try {
      const response = await fetch(`/api/${merchantId}/point`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          symbol: formData.symbol,
          initialSupply: Number(formData.initialSupply),
          decimal: Number(formData.decimal),
          imageUrl: formData.imageUrl,
          timeMode: formData.timeMode,
          expiryMonths: formData.expiryMonths
            ? Number(formData.expiryMonths)
            : undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create point token");
      }
      window.location.href = `/dlt/merchant/${merchantId}/point/list`;
    } catch (error) {
      console.error("Error creating point token:", error);
      alert(
        `Error: ${
          error instanceof Error
            ? error.message
            : "Failed to create point token"
        }`
      );
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="max-w-3xl space-y-6 relative">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Create Point Token</h1>
        <p className="text-gray-400 mt-1">
          Create a new point/token for merchant {merchantId}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Point Information */}
        <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <h2 className="text-lg font-semibold text-white">
              Point Information
            </h2>
          </div>

          {/* Token Preview Card */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Token Icon */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-2xl">🪙</span>
                </div>
                <div>
                  <p className="text-xs text-purple-400 uppercase tracking-widest mb-1">
                    Token Preview
                  </p>
                  <h3 className="text-xl font-bold text-white">
                    {formData.name || "Token Name"}
                  </h3>
                  <p className="text-purple-400 font-mono text-sm">
                    {formData.symbol || "SYMBOL"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                  Initial Supply
                </p>
                <p className="text-2xl font-bold text-white">
                  {formData.initialSupply
                    ? Number(formData.initialSupply).toLocaleString()
                    : "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Token Name */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Token Name *"
                required
              />
            </div>

            {/* Token Symbol */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Symbol <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    symbol: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-mono"
                placeholder="Token Symbol *"
                maxLength={10}
                required
              />
            </div>

            {/* Initial Supply */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Initial Supply <span className="text-pink-500">*</span>
              </label>
              <input
                type="number"
                value={formData.initialSupply}
                onChange={(e) =>
                  setFormData({ ...formData, initialSupply: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Initial Supply *"
                min="1"
                required
              />
            </div>

            {/* Decimal */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Decimal
              </label>
              <input
                type="number"
                value={formData.decimal}
                readOnly
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all cursor-not-allowed opacity-60"
                placeholder="18"
              />
            </div>

            {/* Token Image URL */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="วาง URL ของรูปที่จะใช้เป็นหน้าปกของโทเค็น"
              />
              <p className="text-xs text-gray-500 mt-1">
                วาง URL ของรูปที่จะใช้เป็นหน้าปกของโทเค็น
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Time Management */}
        <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <h2 className="text-lg font-semibold text-white">
              Time Management
            </h2>
          </div>

          {/* Time Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              เลือกวิธีจัดการระยะเวลา
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeMode"
                  value="preset"
                  checked={formData.timeMode === "preset"}
                  onChange={(e) =>
                    setFormData({ ...formData, timeMode: e.target.value })
                  }
                  className="w-4 h-4 text-purple-500 bg-white/5 border-white/20 focus:ring-purple-500/50"
                />
                <span className="text-white text-sm">
                  เลือกระยะเวลาจากรายการ
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeMode"
                  value="calendar"
                  checked={formData.timeMode === "calendar"}
                  onChange={(e) =>
                    setFormData({ ...formData, timeMode: e.target.value })
                  }
                  className="w-4 h-4 text-purple-500 bg-white/5 border-white/20 focus:ring-purple-500/50"
                />
                <span className="text-white text-sm">
                  กำหนดระยะเวลาด้วยปฏิทิน
                </span>
              </label>
            </div>
          </div>

          {/* Expiry Months Dropdown (preset mode) */}
          {formData.timeMode === "preset" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ระยะเวลาหมดอายุ <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.expiryMonths}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiryMonths: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-[#1a1a2e] text-gray-400">
                    ระยะเวลาหมดอายุ *
                  </option>
                  <option value="3" className="bg-[#1a1a2e] text-white">
                    3 เดือน (~91 วัน)
                  </option>
                  <option value="6" className="bg-[#1a1a2e] text-white">
                    6 เดือน (~183 วัน)
                  </option>
                  <option value="9" className="bg-[#1a1a2e] text-white">
                    9 เดือน (~274 วัน)
                  </option>
                  <option value="12" className="bg-[#1a1a2e] text-white">
                    12 เดือน (~365 วัน)
                  </option>
                  <option value="24" className="bg-[#1a1a2e] text-white">
                    24 เดือน (~730 วัน)
                  </option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                </div>
              </div>
            </div>
          )}

          {/* Date Pickers (calendar mode) */}
          {formData.timeMode === "calendar" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  วันเริ่มต้น <span className="text-pink-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all [color-scheme:dark]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  วันสิ้นสุด <span className="text-pink-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all [color-scheme:dark]"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            className="px-8 py-3 bg-white/5 text-gray-300 font-medium rounded-xl border border-white/10 hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Point Token
          </button>
        </div>
      </form>
    </div>
  );
}
