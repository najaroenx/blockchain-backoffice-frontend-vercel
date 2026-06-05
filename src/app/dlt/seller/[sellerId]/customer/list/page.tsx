"use client";
import React, { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Image from "next/image";

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
    location: "Bangkok, TH",
    status: "Active",
    spent: 4367.15,
  },
  {
    id: "2",
    name: "Jeremiah Minsk",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    email: "terrance_moreno@infotech.io",
    location: "Chiang Mai, TH",
    status: "Active",
    spent: 7823.42,
  },
  {
    id: "3",
    name: "Max Alexander",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    email: "ronnie_vergas@infotech.io",
    location: "Phuket, TH",
    status: "Blocked",
    spent: 2478.33,
  },
  {
    id: "4",
    name: "Shannon Baker",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    email: "cookie_lukie@hotmail.com",
    location: "Bangkok, TH",
    status: "Active",
    spent: 234.56,
  },
  {
    id: "5",
    name: "Eugene Stewart",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
    email: "joyce991@infotech.io",
    location: "Pattaya, TH",
    status: "Active",
    spent: 1201.45,
  },
];

export default function CustomerListPage() {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

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

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-red-500/20 text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-gray-400 mt-1">Manage your customer database</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors">
            <FileDownloadOutlinedIcon className="w-4 h-4" />
            Download
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/25">
            <AddIcon className="w-5 h-5" />
            Add Customer
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
              placeholder="Search customers..."
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
                      selectedIds.size === customers.length &&
                      customers.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Spent
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-600 bg-white/5 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                      checked={selectedIds.has(customer.id)}
                      onChange={() => toggleSelect(customer.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10">
                        <Image
                          src={customer.avatar}
                          alt={customer.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {customer.email}
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {customer.location}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-purple-400">
                    ฿{customer.spent.toLocaleString()}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {customers.length} customers
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
