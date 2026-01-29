"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Link from "next/link";
import { useSellerId } from "@/app/dlt/contexts/sellerContext";

interface MarketplaceListing {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  status: "active" | "pending" | "sold_out";
  listedAt: string;
  views: number;
}

const mockListings: MarketplaceListing[] = [
  {
    id: "1",
    name: "Premium Coffee Voucher",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=200",
    price: 150,
    quantity: 50,
    status: "active",
    listedAt: new Date().toISOString(),
    views: 234,
  },
  {
    id: "2",
    name: "Thai Restaurant Discount",
    imageUrl:
      "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&q=80&w=200",
    price: 300,
    quantity: 25,
    status: "active",
    listedAt: new Date(Date.now() - 86400000).toISOString(),
    views: 156,
  },
  {
    id: "3",
    name: "Spa Treatment Coupon",
    imageUrl:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=200",
    price: 500,
    quantity: 0,
    status: "sold_out",
    listedAt: new Date(Date.now() - 172800000).toISOString(),
    views: 423,
  },
  {
    id: "4",
    name: "Movie Ticket Bundle",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=200",
    price: 250,
    quantity: 100,
    status: "pending",
    listedAt: new Date(Date.now() - 259200000).toISOString(),
    views: 89,
  },
];

export default function MarketplaceListPage() {
  const sellerId = useSellerId();
  const [listings, setListings] = useState<MarketplaceListing[]>(mockListings);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const toggleSelectAll = () => {
    if (selectedIds.size === listings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(listings.map((l) => l.id)));
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
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400";
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      case "sold_out":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || listing.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Marketplace Listings
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your products listed on the marketplace
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors">
            <FileDownloadOutlinedIcon className="w-4 h-4" />
            Export
          </button>
          <Link
            href={`/dlt/seller/${sellerId}/marketplace/create`}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/25"
          >
            <AddIcon className="w-5 h-5" />
            List Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Listings</p>
          <h3 className="text-2xl font-bold text-white">{listings.length}</h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <h3 className="text-2xl font-bold text-emerald-400">
            {listings.filter((l) => l.status === "active").length}
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <h3 className="text-2xl font-bold text-amber-400">
            {listings.filter((l) => l.status === "pending").length}
          </h3>
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-1">Total Views</p>
          <h3 className="text-2xl font-bold text-purple-400">
            {listings.reduce((sum, l) => sum + l.views, 0).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["all", "active", "pending", "sold_out"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
              selectedStatus === status
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {status === "all" ? "All" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 border-b border-white/5">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search listings..."
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
                      selectedIds.size === listings.length &&
                      listings.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Views
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredListings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No listings found
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 bg-white/5 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                        checked={selectedIds.has(listing.id)}
                        onChange={() => toggleSelect(listing.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-white/5 rounded-xl overflow-hidden border border-white/10 shrink-0">
                          <Image
                            src={listing.imageUrl}
                            alt={listing.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            {listing.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Listed{" "}
                            {new Date(listing.listedAt).toLocaleDateString(
                              "th-TH"
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-purple-400">
                      ฿{listing.price.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-medium text-white">
                      {listing.quantity}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {listing.views.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          listing.status
                        )}`}
                      >
                        {listing.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <VisibilityOutlinedIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <StorefrontIcon className="w-5 h-5" />
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
            Showing {filteredListings.length} of {listings.length} listings
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
