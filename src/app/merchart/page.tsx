"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "next/image";
import { merchants } from "@/data/merchants";

export default function MerchantPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMerchants = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return merchants;
    return merchants.filter(
      (merchant) =>
        merchant.name.toLowerCase().includes(keyword) ||
        merchant.description.toLowerCase().includes(keyword) ||
        merchant?.categories?.some((category) =>
          category.toLowerCase().includes(keyword)
        )
    );
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ร้านค้าพันธมิตร</h1>
        <p className="text-gray-600 mb-4">
          เลือกร้านค้าเพื่อดูคะแนนสะสมและสิทธิประโยชน์ที่ท่านจะได้รับ
        </p>
        <input
          type="text"
          placeholder="ค้นหาร้านค้า..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Merchant Grid */}
      {filteredMerchants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMerchants.map((merchant) => (
            <Link
              key={merchant.id}
              href={`/merchart/${merchant.id}`}
              className="group relative block overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={merchant.imageUrl}
                  alt={merchant.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-sm font-medium text-white">
                  {merchant.location}
                </span>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">
                    {merchant.name}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {merchant.voucherIds.length.toLocaleString("th-TH")} คูปอง
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {merchant.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {merchant && merchant.categories
                    ? merchant.categories.map((category) => (
                        <span
                          key={category}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {category}
                        </span>
                      ))
                    : null}
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
                  ดูรายละเอียด
                  <span
                    aria-hidden
                    className="transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8 text-lg">
          ไม่พบร้านค้าที่ตรงกับการค้นหา
        </p>
      )}
    </div>
  );
}
