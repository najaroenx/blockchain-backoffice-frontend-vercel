"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { vouchers, type Voucher } from "@/data/vouchers";
import { merchants } from "@/data/merchants";
import { formatValueLabel, statusStyles } from "@/app/vouchers/utils";
import {
  merchantContacts,
  type MerchantContact,
} from "@/data/merchantContacts";

type MerchantStatus = "active" | "upcoming";

type MerchantSummary = {
  merchantId: string;
  name: string;
  activeVouchers: Voucher[];
  upcomingVouchers: Voucher[];
  categories: string[];
  totalIssued: number;
  totalRedeemed: number;
  status: MerchantStatus;
  totalVouchers: number;
  contact?: MerchantContact;
};

const statusConfig: Record<
  MerchantStatus,
  { label: string; badge: string; dot: string }
> = {
  active: {
    label: "มีคูปองใช้งาน",
    badge: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  upcoming: {
    label: "เตรียมเปิดรอบใหม่",
    badge: "bg-indigo-50 text-indigo-600",
    dot: "bg-indigo-500",
  },
};

const summarizeMerchants = () => {
  const grouped = new Map<string, MerchantSummary>();
  const contacts = new Map(
    merchantContacts.map((contact) => [contact.name, contact])
  );
  const merchantIndex = new Map(merchants.map((merchant) => [merchant.id, merchant]));

  vouchers.forEach((voucher) => {
    if (voucher.status !== "active" && voucher.status !== "upcoming") {
      return;
    }

    const merchantInfo = merchantIndex.get(voucher.merchantId);
    const key = voucher.merchantId;
    const displayName = merchantInfo?.name ?? voucher.merchant;
    const categories = merchantInfo?.categories ?? [];
    const contact =
      contacts.get(displayName) ?? contacts.get(voucher.merchant) ?? undefined;

    const entry =
      grouped.get(key) ??
      grouped
        .set(key, {
          merchantId: voucher.merchantId,
          name: displayName,
          activeVouchers: [],
          upcomingVouchers: [],
          categories: [...categories],
          totalIssued: 0,
          totalRedeemed: 0,
          status: "upcoming",
          totalVouchers: 0,
          contact,
        })
        .get(key)!;

    entry.categories = Array.from(
      new Set([
        ...entry.categories,
        ...categories,
      ])
    );
    if (!entry.contact && contact) {
      entry.contact = contact;
    }

    entry.totalIssued += voucher.totalIssued;
    entry.totalRedeemed += voucher.totalRedeemed;

    if (voucher.status === "active") {
      entry.activeVouchers.push(voucher);
      entry.status = "active";
    } else {
      entry.upcomingVouchers.push(voucher);
    }
    entry.totalVouchers =
      entry.activeVouchers.length + entry.upcomingVouchers.length;
  });

  return Array.from(grouped.values()).sort(
    (first, second) => second.totalVouchers - first.totalVouchers
  );
};

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | "all">(
    "all"
  );

  const merchantSummaries = useMemo(() => summarizeMerchants(), []);

  const stats = useMemo(() => {
    const totalMerchants = merchantSummaries.length;
    const totalActiveVouchers = merchantSummaries.reduce(
      (sum, merchant) => sum + merchant.activeVouchers.length,
      0
    );
    const totalUpcomingVouchers = merchantSummaries.reduce(
      (sum, merchant) => sum + merchant.upcomingVouchers.length,
      0
    );
    const totalRedeemed = merchantSummaries.reduce(
      (sum, merchant) => sum + merchant.totalRedeemed,
      0
    );

    return {
      totalMerchants,
      totalActiveVouchers,
      totalUpcomingVouchers,
      totalRedeemed,
    };
  }, [merchantSummaries]);

  const filteredMerchants = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return merchantSummaries.filter((merchant) => {
      const matchesStatus =
        statusFilter === "all" || merchant.status === statusFilter;
      const matchesKeyword =
        keyword.length === 0 ||
        merchant.name.toLowerCase().includes(keyword) ||
        merchant.categories.some((category) =>
          category.toLowerCase().includes(keyword)
        ) ||
        merchant.activeVouchers.some((voucher) =>
          voucher.name.toLowerCase().includes(keyword)
        ) ||
        merchant.upcomingVouchers.some((voucher) =>
          voucher.name.toLowerCase().includes(keyword)
        ) ||
        (merchant.contact &&
          (merchant.contact.contact.toLowerCase().includes(keyword) ||
            merchant.contact.accountManager.toLowerCase().includes(keyword)));

      return matchesStatus && matchesKeyword;
    });
  }, [merchantSummaries, searchTerm, statusFilter]);

  const renderVoucherList = (
    voucherList: Voucher[],
    label: "active" | "upcoming"
  ) => {
    if (voucherList.length === 0) {
      return (
        <p className="text-xs text-slate-400">
          ยังไม่มีคูปอง{label === "active" ? "ที่เปิดใช้งาน" : "ที่เตรียมเปิด"}
        </p>
      );
    }

    const items = voucherList.slice(0, 3);
    const remaining = voucherList.length - items.length;

    return (
      <div className="space-y-2">
        <ul className="space-y-2">
          {items.map((voucher) => (
            <li
              key={voucher.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
            >
              <span className="font-semibold text-slate-800">
                {voucher.name}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusStyles[voucher.status].accentClass}`}
                />
                {statusStyles[voucher.status].label}
              </span>
              <span className="text-xs text-slate-400">
                {formatValueLabel(voucher)}
              </span>
              <span className="text-xs text-slate-400">
                {voucher.pointsCost.toLocaleString("th-TH")} คะแนน
              </span>
            </li>
          ))}
        </ul>
        {remaining > 0 && (
          <p className="text-xs font-medium text-slate-500">
            +{remaining} คูปองอื่น ๆ
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          coupon marketplace
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          ร้านค้าที่ใช้งานคูปองอยู่ตอนนี้
        </h1>
        <p className="text-slate-600">
          ดูภาพรวมร้านค้าพันธมิตรที่มีคูปองใช้งานอยู่ พร้อมรายละเอียดคูปองที่เปิดอยู่
          คูปองที่กำลังเตรียมเปิด และข้อมูลติดต่อที่พร้อมให้ประสานงานต่อได้ทันที
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ร้านค้าทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.totalMerchants}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">คูปองที่เปิดใช้งาน</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.totalActiveVouchers}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">เตรียมเปิดรอบถัดไป</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.totalUpcomingVouchers}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ยอดแลกสะสม</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.totalRedeemed.toLocaleString("th-TH")}
          </p>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "active", "upcoming"] as const).map((status) => {
            const label =
              status === "all"
                ? `ทั้งหมด (${stats.totalMerchants})`
                : `${statusConfig[status].label}`;
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isSelected
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="ค้นหาร้านค้า คูปอง หรือผู้ติดต่อ..."
            className="w-72 rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            🔍
          </span>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            ร้านค้าที่มีคูปองใช้งาน
          </h2>
          <Link
            href="/vouchers/select"
            className="text-sm font-semibold text-blue-600 hover:text-blue-500"
          >
            ไปเลือก Voucher →
          </Link>
        </div>

        {filteredMerchants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center text-slate-500">
            <p className="text-lg font-medium">ไม่พบร้านค้าที่ตรงกับการค้นหา</p>
            <p className="mt-2 text-sm">
              ลองปรับการค้นหา หรือเลือกดูสถานะอื่น
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMerchants.map((merchant) => {
              const reserved =
                merchant.totalIssued - merchant.totalRedeemed < 0
                  ? 0
                  : merchant.totalIssued - merchant.totalRedeemed;

              const initials = merchant.name
                .split(/\s+/)
                .map((part) => part.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={merchant.name}
                  className="flex flex-wrap items-start gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex min-w-[220px] flex-1 items-start gap-3">
                    {merchant.contact?.imageUrl ? (
                      <img
                        src={merchant.contact.imageUrl}
                        alt={merchant.name}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                        {initials}
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">
                          {merchant.name}
                        </h3>
                        <span
                          className={[
                            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                            statusConfig[merchant.status].badge,
                          ].join(" ")}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${statusConfig[merchant.status].dot}`}
                          />
                          {statusConfig[merchant.status].label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        {merchant.categories.map((category) => (
                          <span
                            key={`${merchant.name}-${category}`}
                            className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span>
                          ทั้งหมด{" "}
                          <strong className="text-slate-900">
                          {merchant.totalVouchers}
                          </strong>{" "}
                          คูปอง
                        </span>
                        <span>
                          แลกไปแล้ว{" "}
                          <strong className="text-slate-900">
                            {merchant.totalRedeemed.toLocaleString("th-TH")}
                          </strong>{" "}
                          สิทธิ์
                        </span>
                        <span>
                          คงเหลือ{" "}
                          <strong className="text-slate-900">
                            {reserved.toLocaleString("th-TH")}
                          </strong>{" "}
                          สิทธิ์
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex min-w-[260px] flex-1 flex-col gap-3">
                    <h4 className="text-sm font-semibold text-slate-800">
                      คูปองที่เปิดใช้งาน ({merchant.activeVouchers.length})
                    </h4>
                    {renderVoucherList(merchant.activeVouchers, "active")}
                  </div>

                  <div className="flex min-w-[260px] flex-1 flex-col gap-3">
                    <h4 className="text-sm font-semibold text-slate-800">
                      คูปองที่เตรียมเปิด ({merchant.upcomingVouchers.length})
                    </h4>
                    {renderVoucherList(merchant.upcomingVouchers, "upcoming")}
                  </div>

                  <div className="flex min-w-[220px] flex-1 flex-col gap-3">
                    <h4 className="text-sm font-semibold text-slate-800">
                      ผู้ติดต่อหลัก
                    </h4>
                    {merchant.contact ? (
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                        <p className="font-semibold text-slate-900">
                          {merchant.contact.contact}
                        </p>
                        <p className="text-xs text-slate-500">
                          {merchant.contact.role}
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                          โทร. {merchant.contact.phone}
                          <br />
                          {merchant.contact.email}
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                          AM: {merchant.contact.accountManager}
                        </p>
                        <p className="mt-2 text-[11px] text-slate-400">
                          {merchant.contact.lastInteraction}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        ยังไม่มีข้อมูลผู้ติดต่อ
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/vouchers/select"
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        ดูรายละเอียด Voucher
                      </Link>
                      <Link
                        href="/vouchers/setup"
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
                      >
                        ตั้งค่า Voucher
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
