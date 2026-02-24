"use client";
import { useState, useEffect, useMemo } from "react";
import { useMerchantId, useLoading } from "@/app/dlt/contexts/merchantContext";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { AssetType } from "@/components/point/constants";

interface Transaction {
  id: string;
  type: "transfer" | "mint" | "burn" | "redeem";
  senderAddress: string; // wallet address
  receiverAddress: string; // wallet address
  amount: number;
  pointSymbol: string;
  pointName: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
  txHash?: string;
}

// Pure helper functions — defined at module level to avoid recreation on every render
const getTypeIcon = (type: string) => {
  switch (type) {
    case "transfer":
      return <SwapHorizIcon className="w-4 h-4" />;
    case "mint":
      return <ArrowDownwardIcon className="w-4 h-4" />;
    case "burn":
    case "redeem":
      return <ArrowUpwardIcon className="w-4 h-4" />;
    default:
      return <SwapHorizIcon className="w-4 h-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "transfer": return "bg-blue-500/20 text-blue-400";
    case "mint":     return "bg-emerald-500/20 text-emerald-400";
    case "burn":     return "bg-red-500/20 text-red-400";
    case "redeem":   return "bg-amber-500/20 text-amber-400";
    default:         return "bg-gray-500/20 text-gray-400";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-emerald-500/20 text-emerald-400";
    case "pending":   return "bg-amber-500/20 text-amber-400";
    case "failed":    return "bg-red-500/20 text-red-400";
    default:          return "bg-gray-500/20 text-gray-400";
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const truncateAddress = (address: string) =>
  address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;

export default function PointTransactionPage() {
  const merchantId = useMerchantId();
  const { showLoading, hideLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!merchantId) return;

      showLoading("กำลังโหลดข้อมูล Transaction...");
      try {
        const response = await fetch(`/api/${merchantId}/transaction`);
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();

        // Map API data to Transaction structure and filter only point type
        const mappedTransactions: Transaction[] = data
          .filter((t: any) => {
            // Only show transactions with typeAsset = "POINT"
            return t.typeAsset === AssetType.POINT;
          })
          .map((t: any, i: number) => ({
            id: t.id || t.txHash || `TX-${i}`,
            type: t.type || "transfer",
            senderAddress:
              t.senderAddress ||
              t.from ||
              "0x0000000000000000000000000000000000000000",
            receiverAddress:
              t.receiverAddress ||
              t.to ||
              "0x0000000000000000000000000000000000000000",
            amount: t.amount || 0,
            pointSymbol: t.pointSymbol || t.symbol || "PTS",
            pointName: t.pointName || t.name || "Point",
            status: t.status || "completed",
            createdAt: t.createdAt || new Date().toISOString(),
            txHash: t.txHash,
          }));

        setTransactions(mappedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        hideLoading();
      }
    };

    fetchTransactions();
  }, [merchantId]);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((tx) => {
        const matchesSearch =
          tx.senderAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.receiverAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === "all" || tx.type === selectedType;
        return matchesSearch && matchesType;
      }),
    [transactions, searchQuery, selectedType]
  );



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Point Transactions</h1>
          <p className="text-gray-400 mt-1">
            View all point transactions for merchant {merchantId}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
          <h3 className="text-2xl font-bold text-white">
            {transactions.length}
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Transferred</p>
          <h3 className="text-2xl font-bold text-blue-400">
            {transactions
              .filter((t) => t.type === "transfer")
              .reduce((acc, t) => acc + t.amount, 0)
              .toLocaleString()}{" "}
            pts
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Minted</p>
          <h3 className="text-2xl font-bold text-emerald-400">
            {transactions
              .filter((t) => t.type === "mint")
              .reduce((acc, t) => acc + t.amount, 0)
              .toLocaleString()}{" "}
            pts
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Redeemed</p>
          <h3 className="text-2xl font-bold text-amber-400">
            {transactions
              .filter((t) => t.type === "redeem")
              .reduce((acc, t) => acc + t.amount, 0)
              .toLocaleString()}{" "}
            pts
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
            placeholder="Search by user or transaction ID..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer min-w-[150px]"
        >
          <option value="all" className="bg-[#1a1a2e]">
            All Types
          </option>
          <option value="transfer" className="bg-[#1a1a2e]">
            Transfer
          </option>
          <option value="mint" className="bg-[#1a1a2e]">
            Mint
          </option>
          <option value="redeem" className="bg-[#1a1a2e]">
            Redeem
          </option>
          <option value="burn" className="bg-[#1a1a2e]">
            Burn
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
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  From
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  To
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white font-mono">
                          {truncateAddress(tx.id)}
                        </p>
                        {tx.txHash && (
                          <p className="text-xs text-gray-500 font-mono">
                            {truncateAddress(tx.txHash)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getTypeColor(
                          tx.type,
                        )}`}
                      >
                        {getTypeIcon(tx.type)}
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="text-sm text-white font-mono"
                        title={tx.senderAddress}
                      >
                        {truncateAddress(tx.senderAddress)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="text-sm text-white font-mono"
                        title={tx.receiverAddress}
                      >
                        {truncateAddress(tx.receiverAddress)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            tx.type === "mint"
                              ? "text-emerald-400"
                              : tx.type === "burn" || tx.type === "redeem"
                                ? "text-red-400"
                                : "text-purple-400"
                          }`}
                        >
                          {tx.type === "mint"
                            ? "+"
                            : tx.type === "burn" || tx.type === "redeem"
                              ? "-"
                              : ""}
                          {tx.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {tx.pointSymbol}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                          tx.status,
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(tx.createdAt)}
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
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
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
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
