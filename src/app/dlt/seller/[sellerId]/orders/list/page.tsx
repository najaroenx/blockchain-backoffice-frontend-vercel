"use client";
import React, { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { IOrderInformation } from "../../hooks/useListToMarketplaceStore";
import { useListToMarketplaceStore } from "../../hooks/useListToMarketplaceStore";

export default function OrdersListPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const { orders, loadingOrders, addOrdersToFirebase } =
    useListToMarketplaceStore();

  const toggleSelectAll = () => {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o: IOrderInformation) => o.id)));
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-500/20 text-emerald-400";
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loadingOrders)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 mt-1">Manage your customer orders</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors">
            <FileDownloadOutlinedIcon className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={addOrdersToFirebase}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/25"
          >
            <AddIcon className="w-5 h-5" />
            Add Order
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 border-b border-white/5">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
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
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-white/5 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                    checked={
                      selectedIds.size === orders.length && orders.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order: IOrderInformation) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 bg-white/5 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                        checked={selectedIds.has(order.id)}
                        onChange={() => toggleSelect(order.id)}
                      />
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-white font-mono">
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                          <span className="text-white text-sm font-medium">
                            {order.id.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-300">Customer</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date().toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "pending"}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-purple-400">
                      ฿{(order?.total || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <EditOutlinedIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <VisibilityOutlinedIcon className="w-5 h-5" />
                        </button>
                      </div>
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
            Showing {orders.length} orders
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
