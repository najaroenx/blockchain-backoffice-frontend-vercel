"use client";

import { useState, useEffect, useCallback } from "react";
import { useMerchantId } from "@/app/dlt/contexts/merchantContext";
import { useApiWithLoading } from "@/app/dlt/hooks/useApiWithLoading";
import Link from "next/link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import Image from "next/image";
interface Point {
  id: string;
  name: string;
  symbol: string;
  initialSupply: number;
  remaining: number;
  decimal: number;
  imageUrl?: string;
  startDate?: number;
  endDate?: number;
  createdAt?: string;
}

export default function PointListPage() {
  const merchantId = useMerchantId();
  const { execute } = useApiWithLoading();
  const [points, setPoints] = useState<Point[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Fetch points function using useApiWithLoading
  const fetchPoints = useCallback(async () => {
    if (!merchantId) return;

    try {
      const data = await execute(
        async () => {
          const response = await fetch(`/api/${merchantId}/point`);
          if (!response.ok) {
            throw new Error("Failed to fetch points");
          }
          return response.json();
        },
        {
          loadingText: "กำลังโหลดข้อมูล...",
          showSuccessOnComplete: false, // ไม่ต้องแสดง success animation สำหรับ GET
          showErrorOnFail: true,
          errorText: "ไม่สามารถโหลดข้อมูลได้",
        }
      );

      if (data) {
        setPoints(data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching points:", err);
      setError(err instanceof Error ? err.message : "Failed to load points");
    }
  }, [merchantId, execute]);

  // Fetch on mount
  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  // Calculate total supply
  const totalSupply = points.reduce(
    (sum, p) => sum + (Number(p.initialSupply) || 0),
    0
  );

  // Calculate total remaining
  const totalRemaining = points.reduce(
    (sum, p) => sum + (Number(p.remaining) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Points Management</h1>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            Manage loyalty points for merchant{" "}
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/10 rounded-lg">
              <span className="font-mono text-purple-400">{merchantId}</span>
              <button
                onClick={() => copyToClipboard(merchantId || "")}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                title="Copy Merchant ID"
              >
                {copiedId === merchantId ? (
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ContentCopyIcon className="w-3.5 h-3.5 text-purple-400 hover:text-purple-300" />
                )}
              </button>
            </span>
          </p>
        </div>
        <Link
          href={`/dlt/merchant/${merchantId}/point/create`}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/25"
        >
          + Create Point Token
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Point Tokens</p>
          <h3 className="text-2xl font-bold text-white">{points.length}</h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Supply</p>
          <h3 className="text-2xl font-bold text-white">
            {totalSupply.toLocaleString()}
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Remaining</p>
          <h3 className="text-2xl font-bold text-purple-400">
            {totalRemaining.toLocaleString()}
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Active Tokens</p>
          <h3 className="text-2xl font-bold text-emerald-400">
            {points.length}
          </h3>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Point Tokens</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Token
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Symbol
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Initial Supply
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Remaining
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Decimal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  End Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Point Id
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {points.length === 0 && !error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-gray-500">No point tokens found</p>
                    <Link
                      href={`/dlt/merchant/${merchantId}/point/create`}
                      className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block"
                    >
                      Create your first point token →
                    </Link>
                  </td>
                </tr>
              ) : (
                points.map((point) => {
                  const now = Math.floor(Date.now() / 1000);
                  const isExpired = point.endDate && point.endDate < now;
                  const isActive =
                    !isExpired && (!point.startDate || point.startDate <= now);

                  return (
                    <tr
                      key={point.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={point.imageUrl || ""}
                            alt={point.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg"
                          />
                          <span className="text-sm font-medium text-white">
                            {point.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-purple-400">
                          {point.symbol}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {point.initialSupply?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-purple-400 font-medium">
                        {point.remaining?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {point.decimal}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {point.startDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {point.endDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm text-gray-400 font-mono truncate max-w-[150px]"
                            title={point.id}
                          >
                            {point.id}
                          </span>
                          <button
                            onClick={() => copyToClipboard(point.id)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors group"
                            title="Copy Point ID"
                          >
                            {copiedId === point.id ? (
                              <CheckIcon className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ContentCopyIcon className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
