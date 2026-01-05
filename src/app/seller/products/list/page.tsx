"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { IProductResponse, useProduct } from "../hooks/useProduct";

interface Product {
  id: string;
  name: string;
  descriptionID: string;
  price: number;
  quantity: number;
  sales: number;
  salesTarget: number; // for the progress bar calculation
  image: string;
}

const initialProducts: Product[] = [
  {
    id: "098327NT",
    name: "Florven",
    descriptionID: "ID: 098327NT",
    price: 252.0,
    quantity: 46,
    sales: 387,
    salesTarget: 1000,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=200", // Chair
  },
  {
    id: "098359NT",
    name: "Snovalla",
    descriptionID: "ID: 098359NT",
    price: 139.0,
    quantity: 28,
    sales: 892,
    salesTarget: 1200,
    image:
      "https://images.unsplash.com/photo-1507764923583-b5a80145c219?auto=format&fit=crop&q=80&w=200", // Lamp
  },
  {
    id: "098383NT",
    name: "Echoes Necklace",
    descriptionID: "ID: 098383NT",
    price: 99.0,
    quantity: 52,
    sales: 1145,
    salesTarget: 1500,
    image:
      "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=200", // Jewelry
  },
  {
    id: "098342NT",
    name: "Lömnäs",
    descriptionID: "ID: 098342NT",
    price: 68.0,
    quantity: 92,
    sales: 651,
    salesTarget: 1000,
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200", // Decor
  },
  {
    id: "098371NT",
    name: "Kallaxa",
    descriptionID: "ID: 098371NT",
    price: 70.0,
    quantity: 119,
    sales: 234,
    salesTarget: 800,
    image:
      "https://images.unsplash.com/photo-1540932296774-3ed6d559d332?auto=format&fit=crop&q=80&w=200", // Chair
  },
  {
    id: "098314NT",
    name: "Ringed Earring",
    descriptionID: "ID: 098314NT",
    price: 29.0,
    quantity: 18,
    sales: 1201,
    salesTarget: 1500,
    image:
      "https://images.unsplash.com/photo-1629224316810-9d8805b95076?auto=format&fit=crop&q=80&w=200", // Earring
  },
];

export default function ProductListPage() {
  const { getProducts, isLoading } = useProduct();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [product, setProduct] = useState<IProductResponse | null>(null);

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
        const res = await getProducts();

        if (res && res.status === 200) {
          const fetchedData = await res.json();
          console.log("fetchedData", fetchedData);
          console.log(fetchedData);
          setProduct(fetchedData?.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="bg-slate-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <FileUploadOutlinedIcon className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <AddIcon className="w-5 h-5" />
            Add products
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
              placeholder="Search"
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
                      selectedIds.size === product?.vouchers.length &&
                      product?.vouchers.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Product <span className="text-[10px] ml-1">↕</span>
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Price <span className="text-[10px] ml-1">↕</span>
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Quantity <span className="text-[10px] ml-1">↕</span>
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">
                  Sales <span className="text-[10px] ml-1">↕</span>
                </th>
                <th className="p-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {product?.vouchers.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {product.value}
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {product.totalIssued}
                  </td>
                  <td className="p-4">
                    <div className="w-full max-w-[200px]">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-500">
                          {product.totalRedeemed} Sales
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            product.totalRedeemed > 1000
                              ? "bg-orange-500"
                              : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${
                              (product.totalRedeemed / product.totalIssued) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                        <EditOutlinedIcon className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-red-500 rounded">
                        <DeleteOutlineOutlinedIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-center text-xs text-slate-400">
          Scroll for more
        </div>
      </div>
    </div>
  );
}
