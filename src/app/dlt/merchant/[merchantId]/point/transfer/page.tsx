"use client";

import { useState } from "react";
import { useMerchantId } from "@/app/dlt/contexts/merchantContext";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { usePoints, useTransferPoint } from "@/app/dlt/hooks/usePoints";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";

export default function PointTransferPage() {
  const merchantId = useMerchantId();
  const { execute } = useApiWithLoading();

  const [formData, setFormData] = useState({
    pointId: "",
    fromUserId: "cmk2ahqy600069y5bhd5e22ku",
    toUserId: "",
    amount: "",
    phone: "",
    note: "",
  });

  // Use Points hook
  const { points, isLoading: pointsLoading } = usePoints({
    merchantId: merchantId || "",
  });

  // Use Transfer hook
  const { transfer, isTransferring } = useTransferPoint({
    merchantId: merchantId || "",
    pointId: formData.pointId,
  });

  // Get selected point details
  const selectedPoint = points.find((p) => p.id === formData.pointId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pointId || !formData.toUserId || !formData.amount) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    await execute(
      () =>
        transfer({
          transactionTypeId: "TRANSFER",
          amount: parseInt(formData.amount, 10),
          phone: formData.toUserId,
        }),
      {
        loadingText: "กำลังโอน Points...",
        successText: "โอน Point สำเร็จ",
        errorText: "โอน Point ไม่สำเร็จ",
        redirectOnSuccess: `/dlt/merchant/${merchantId}/point/list`,
        redirectDelay: 2000,
      }
    );

    // Reset form on success
    setFormData({
      ...formData,
      toUserId: "",
      amount: "",
      note: "",
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Transfer Points</h1>
        <p className="text-gray-400 mt-1">
          Transfer points between users in merchant {merchantId}
        </p>
      </div>

      {/* Form */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Point Token */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Point Token <span className="text-pink-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.pointId}
                onChange={(e) =>
                  setFormData({ ...formData, pointId: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="" className="bg-[#1a1a2e] text-gray-400">
                  -- Select Point Token --
                </option>
                {points.map((point) => (
                  <option
                    key={point.id}
                    value={point.id}
                    className="bg-[#1a1a2e] text-white"
                  >
                    {point.name} ({point.symbol}) - Supply:{" "}
                    {point.initialSupply?.toLocaleString()}
                  </option>
                ))}
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

            {/* Selected Point Preview */}
            {selectedPoint && (
              <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
                  🪙
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{selectedPoint.name}</p>
                  <p className="text-purple-400 text-sm font-mono">
                    {selectedPoint.symbol}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Supply</p>
                  <p className="text-white font-medium">
                    {selectedPoint.initialSupply?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* From User */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From User (Sender) <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              disabled
              value={formData.fromUserId}
              onChange={(e) =>
                setFormData({ ...formData, fromUserId: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="Enter sender's user ID or wallet address"
              required
            />
          </div>

          {/* Transfer Icon */}
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center">
              <SwapHorizIcon className="text-purple-400 rotate-90" />
            </div>
          </div>

          {/* To User - Thai Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To User (Receiver) <span className="text-pink-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🇹🇭
              </span>
              <input
                type="tel"
                value={formData.toUserId}
                onChange={(e) => {
                  // Only allow digits, max 10 characters
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData({ ...formData, toUserId: value });
                }}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-mono tracking-wider"
                placeholder="0812345678"
                pattern="0[0-9]{9}"
                maxLength={10}
                required
              />
            </div>
            {formData.toUserId && formData.toUserId.length > 0 && (
              <p
                className={`text-xs mt-1.5 ${
                  formData.toUserId.length === 10 &&
                  formData.toUserId.startsWith("0")
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {formData.toUserId.length === 10 &&
                formData.toUserId.startsWith("0")
                  ? "✓ เบอร์โทรถูกต้อง"
                  : `กรุณากรอกเบอร์โทร 10 หลัก (${formData.toUserId.length}/10)`}
              </p>
            )}
          </div>

          {/* Points Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount to Transfer <span className="text-pink-500">*</span>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder={
                selectedPoint
                  ? `Max: ${selectedPoint.initialSupply?.toLocaleString()} ${
                      selectedPoint.symbol
                    }`
                  : "Select a point token first"
              }
              min="1"
              max={selectedPoint?.initialSupply}
              required
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
              placeholder="Add a note for this transfer"
            />
          </div>

          {/* Info Box */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-sm text-purple-300">
              <span className="font-semibold">Note:</span> Points transfer is
              instant and cannot be reversed. Please verify the recipient
              details before confirming.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.pointId}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SwapHorizIcon />
            Transfer Points
          </button>
        </form>
      </div>
    </div>
  );
}
