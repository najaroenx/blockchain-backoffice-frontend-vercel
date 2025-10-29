"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { Loading } from "../layout/Loading";
import { useDialog } from "@/hooks/useDialog";
import { CreateMerchantDialog } from "../merchant/CreateMerchantDialog";
import { useMerchants } from "@/hooks/useMerchant";
import { useForm } from "@/hooks/useForm";
import { Empty } from "../layout/Empty";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1529429617124-aee711b79a1f?q=80&w=1600&auto=format&fit=crop";

const MerchantPortal = () => {
  const [open, handleToggle] = useDialog();

  const { merchants, merchantLoading, createMerchant } = useMerchants();

  const { formValues, handleInputChange } = useForm({
    name: "",
    website: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleClick = useCallback(() => {
    handleToggle();
  }, [handleToggle]);

  const handleConfirm = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (createMerchant.isPending) return;
      createMerchant.mutate(formValues, {
        onSuccess: handleToggle,
      });
    },
    [createMerchant, formValues, handleToggle]
  );

  const filteredMerchants = useMemo(() => {
    if (!merchants) return [];

    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return merchants;

    return merchants.filter((merchant: any) => {
      const name = merchant.name?.toLowerCase() ?? "";
      const website = merchant.website?.toLowerCase() ?? "";
      const description = merchant.description?.toLowerCase() ?? "";
      const categories = Array.isArray(merchant.categories)
        ? merchant.categories.map((item: string) => item.toLowerCase())
        : [];

      return (
        name.includes(keyword) ||
        website.includes(keyword) ||
        description.includes(keyword) ||
        categories.some((category: string) => category.includes(keyword))
      );
    });
  }, [merchants, searchTerm]);

  if (merchantLoading || !merchants)
    return (
      <div className="bg-slate-100 min-h-screen w-full">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Loading />
        </div>
      </div>
    );

  const hasMerchants = merchants.length > 0;

  return (
    <div className="bg-slate-100 min-h-screen w-full py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Merchant Portal
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              จัดการร้านค้าพันธมิตร เพิ่มร้านค้าใหม่ และเข้าถึงรายละเอียดการทำงานของแต่ละร้านได้ในที่เดียว
            </p>
          </div>
          <button
            onClick={handleClick}
            className="rounded-full bg-[#FF8901] px-5 py-3 text-sm font-semibold uppercase text-white transition hover:-translate-y-0.5 hover:bg-[#fbbf7a] hover:shadow-lg"
          >
            สร้างร้านค้าใหม่
          </button>
        </div>

        <div className="w-full">
          <input
            type="text"
            placeholder="ค้นหาร้านค้า เว็บไซต์ หรือหมวดหมู่..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full max-w-xl rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm transition focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {!hasMerchants ? (
          <Empty />
        ) : filteredMerchants.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white/70 text-center text-slate-500">
            <p className="text-lg font-semibold">ไม่พบร้านค้าที่ตรงกับคำค้นหา</p>
            <p className="text-sm">ลองเปลี่ยนคำค้นหาหรือสร้างร้านค้าใหม่</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMerchants.map((merchant: any) => {
              const imageUrl = merchant.imageUrl || DEFAULT_IMAGE;
              const description =
                merchant.description || merchant.website || "ยังไม่มีรายละเอียด";
              const categories = Array.isArray(merchant.categories)
                ? merchant.categories
                : [];

              return (
                <div
                  key={merchant.id}
                  className="group relative block overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={merchant.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {merchant.location && (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-sm font-medium text-white">
                        {merchant.location}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">
                        {merchant.name}
                      </h2>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {description}
                    </p>
                    {categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category: string) => (
                          <span
                            key={`${merchant.id}-${category}`}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Link
                        href={`/admin/${merchant.id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                      >
                        จัดการร้านค้า
                        <span aria-hidden className="text-sm">
                          →
                        </span>
                      </Link>
                      {merchant.website && (
                        <a
                          href={merchant.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                        >
                          ดูเว็บไซต์
                          <span aria-hidden className="text-sm">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <CreateMerchantDialog
          open={open}
          onCancel={handleToggle}
          onConfirm={handleConfirm}
          handleInputChange={handleInputChange}
          loading={createMerchant.isPending}
        />
      </div>
    </div>
  );
};

export default MerchantPortal;
