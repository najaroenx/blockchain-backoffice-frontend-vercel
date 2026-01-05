"use client";
import React, { useEffect, useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { IOrderInformation } from "../../hooks/useListToMarketplaceStore";
import { useListToMarketplaceStore } from "../../hooks/useListToMarketplaceStore";
interface Customer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  location: string;
  status: "Active" | "Blocked";
  spent: number;
}

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Angelina Gotelli",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    email: "carolyn_h@hotmail.com",
    location: "New York, US",
    status: "Active",
    spent: 4367.15,
  },
  {
    id: "2",
    name: "Jeremiah Minsk",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    email: "terrance_moreno@infotech.io",
    location: "Tokyo, JP",
    status: "Active",
    spent: 7823.42,
  },
  {
    id: "3",
    name: "Max Alexander",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    email: "ronnie_vergas@infotech.io",
    location: "Mumbai, IN",
    status: "Blocked",
    spent: 2478.33,
  },
  {
    id: "4",
    name: "Shannon Baker",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    email: "cookie_lukie@hotmail.com",
    location: "New York, US",
    status: "Active",
    spent: 234.56,
  },
  {
    id: "5",
    name: "Eugene Stewart",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
    email: "joyce991@infotech.io",
    location: "Ottawa, CA",
    status: "Active",
    spent: 1201.45,
  },
  {
    id: "6",
    name: "Arlene Pierce",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    email: "samanthaphil@infotech.io",
    location: "London, UK",
    status: "Active",
    spent: 8923.11,
  },
  {
    id: "7",
    name: "Roberta Horton",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100",
    email: "taratarara@imaze.edu.du",
    location: "Brasilia, BR",
    status: "Active",
    spent: 465.78,
  },
  {
    id: "8",
    name: "Jessica Wells",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100",
    email: "iamfred@imaze.infotech.io",
    location: "London, UK",
    status: "Blocked",
    spent: 890.43,
  },
];

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  //   Hooks
  const { orders, loadingOrders, errorOrders } = useListToMarketplaceStore();

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

  if (loadingOrders)
    return <p className="p-4 text-gray-500">Loading tasks...</p>;
  console.log("orders", orders);
  return (
    <div className="bg-slate-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <FileDownloadOutlinedIcon className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={undefined}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <AddIcon className="w-5 h-5" />
            Add new
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 border-b border-slate-100">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Quick search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg text-sm focus:bg-white focus:border-slate-300 focus:ring-0 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            <FilterListIcon className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    checked={
                      selectedIds.size === customers.length &&
                      customers.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Order ID <span className="text-[10px] ml-1">↕</span>
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Owner <span className="text-[10px] ml-1">↕</span>
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Last Update <span className="text-[10px] ml-1">↕</span>
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status <span className="text-[10px] ml-1">↕</span>
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total <span className="text-[10px] ml-1">↕</span>
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order: IOrderInformation) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleSelect(order.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                        <img
                          src={
                            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100"
                          }
                          alt={order.id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {order.id}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date().toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-slate-600">{order.id}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold
                            ${
                              order.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                      {order.status || "pending"}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {order?.total || 0}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                        <EditOutlinedIcon className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                        <VisibilityOutlinedIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder matching the design */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-center text-xs text-slate-400">
          Scroll for more
        </div>
      </div>
    </div>
  );
}
