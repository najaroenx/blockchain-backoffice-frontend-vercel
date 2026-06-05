"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { useParams } from "next/navigation";
import { IProductResponse, useProduct } from "../hooks/useProduct";

export default function ProductListPage() {
  const params = useParams<{ sellerId: string }>();
  const { getProducts, isLoading } = useProduct();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelectAll = () => {
    if (selectedIds.size === product?.vouchers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(product?.vouchers.map((p) => p.id)));
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts({ merchantId: params.sellerId });

        if (res && res.status === 200) {
          const fetchedData = await res.json();
          setProduct(fetchedData?.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors">
            <FileUploadOutlinedIcon className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/25">
            <AddIcon className="w-5 h-5" />
            Add Product
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
              placeholder="Search products..."
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
                      selectedIds.size === product?.vouchers.length &&
                      product?.vouchers.length > 0
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
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-1/4">
                  Sales
                </th>
                <th className="p-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {product?.vouchers.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-600 bg-white/5 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-white/5 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-purple-400">
                    ฿{item.value}
                  </td>
                  <td className="p-4 text-sm font-medium text-white">
                    {item.totalIssued}
                  </td>
                  <td className="p-4">
                    <div className="w-full max-w-[200px]">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">
                          {item.totalRedeemed} sold
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{
                            width: `${
                              (item.totalRedeemed / item.totalIssued) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <EditOutlinedIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <DeleteOutlineOutlinedIcon className="w-5 h-5" />
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
            Showing {product?.vouchers.length || 0} products
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
