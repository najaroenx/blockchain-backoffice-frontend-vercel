"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { coupons, type Coupon, type CouponStatus } from "@/data/coupons";
import {
  dateFormatter,
  formatValueLabel,
  getDaysUntil,
  statusStyles,
} from "@/app/coupons/utils";

type StatusFilter = "all" | CouponStatus;
type SortKey = "recent" | "popular" | "expiring";

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");

  const totalsByStatus = useMemo(() => {
    const base = {
      all: coupons.length,
      active: 0,
      upcoming: 0,
    };

    return coupons.reduce<typeof base>((acc, coupon) => {
      acc[coupon.status] += 1;
      return acc;
    }, base);
  }, []);

  const stats = useMemo(() => {
    const totalActive = coupons.filter((coupon) => coupon.status === "active").length;
    const expiringSoon = coupons.filter(
      (coupon) => coupon.status === "active" && getDaysUntil(coupon.endDate) <= 10
    ).length;
    const totalRedeemed = coupons.reduce((sum, coupon) => sum + coupon.totalRedeemed, 0);

    return { totalActive, expiringSoon, totalRedeemed };
  }, []);

  const filteredCoupons = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchesSearch = (coupon: Coupon) => {
      if (!normalizedSearch) return true;
      return (
        coupon.name.toLowerCase().includes(normalizedSearch) ||
        coupon.description.toLowerCase().includes(normalizedSearch) ||
        coupon.merchant.toLowerCase().includes(normalizedSearch) ||
        coupon.categories.some((category) => category.toLowerCase().includes(normalizedSearch))
      );
    };

    const matchesStatus = (coupon: Coupon) =>
      statusFilter === "all" || coupon.status === statusFilter;

    const sorters: Record<SortKey, (a: Coupon, b: Coupon) => number> = {
      recent: (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      popular: (a, b) => b.totalRedeemed - a.totalRedeemed,
      expiring: (a, b) =>
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    };

    return coupons
      .filter((coupon) => matchesStatus(coupon) && matchesSearch(coupon))
      .slice()
      .sort(sorters[sortKey]);
  }, [searchTerm, statusFilter, sortKey]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-blue-600 uppercase tracking-[0.2em]">
          rewards
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          คูปองและสิทธิพิเศษ
        </h1>
        <p className="text-slate-600 max-w-2xl">
          จัดการแคมเปญคูปอง แลกคะแนน และติดตามยอดการใช้งานแบบเรียลไทม์
          ช่วยให้คุณมอบประสบการณ์สุดพิเศษแก่สมาชิกได้ง่ายขึ้น
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">คูปองที่เปิดใช้งาน</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.totalActive.toLocaleString("th-TH")}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            +{stats.expiringSoon} คูปองใกล้หมดอายุ
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ยอดแลกสะสม</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.totalRedeemed.toLocaleString("th-TH")}
          </p>
          <p className="mt-1 text-xs text-slate-500">ครั้งที่สมาชิกแลกใช้แล้ว</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-slate-500">ภาพรวมสถานะ</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-medium">
            <div className="rounded-xl bg-emerald-50 py-2 text-emerald-700">
              กำลังใช้งาน
              <p className="mt-1 text-lg font-semibold">
                {totalsByStatus.active.toLocaleString("th-TH")}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 py-2 text-indigo-600">
              เตรียมเปิด
              <p className="mt-1 text-lg font-semibold">
                {totalsByStatus.upcoming.toLocaleString("th-TH")}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "active", "upcoming"] as StatusFilter[]).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  statusFilter === status
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {status === "all"
                  ? `ทั้งหมด (${totalsByStatus.all})`
                  : `${statusStyles[status].label} (${totalsByStatus[status].toLocaleString(
                      "th-TH"
                    )})`}
              </button>
            )
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              🔍
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="ค้นหาชื่อคูปอง ร้านค้า หรือประเภท..."
              className="w-72 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="recent">ล่าสุด</option>
            <option value="expiring">ใกล้หมดอายุ</option>
            <option value="popular">ยอดแลกสูงสุด</option>
          </select>

          <Link
            href="/coupons/select"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
          >
            <span>เลือกคูปอง</span>
            <span className="text-lg leading-none">→</span>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {filteredCoupons.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center text-slate-500">
            <p className="text-lg font-medium">ไม่พบคูปองที่ตรงกับการค้นหา</p>
            <p className="mt-2 text-sm">
              ลองปรับการค้นหาหรือเลือกดูคูปองในสถานะอื่น
            </p>
          </div>
        ) : (
          filteredCoupons.map((coupon) => {
            const redeemedRatio =
              coupon.totalIssued === 0
                ? 0
                : Math.min(
                    100,
                    Math.round((coupon.totalRedeemed / coupon.totalIssued) * 100)
                  );

            return (
              <article
                key={coupon.id}
                className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  className={`absolute inset-x-6 top-0 h-1 rounded-full ${statusStyles[coupon.status].accentClass}`}
                />

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {coupon.id}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      {coupon.name}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {coupon.description}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[coupon.status].badgeClass}`}
                  >
                    {statusStyles[coupon.status].label}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_1fr]">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {coupon.categories.map((category) => (
                        <span
                          key={category}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        มูลค่าสิทธิประโยชน์
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {formatValueLabel(coupon)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        ใช้คะแนนแลก {coupon.pointsCost.toLocaleString("th-TH")} คะแนน
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="space-y-3 text-sm text-slate-600">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          ร้านค้า
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {coupon.merchant}
                        </p>
                      </div>
                      {coupon.limitPerMember && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            จำกัดต่อสมาชิก
                          </p>
                          <p className="mt-1 font-medium text-slate-900">
                            {coupon.limitPerMember} สิทธิ์
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      ระยะเวลาแคมเปญ
                    </p>
                    <p className="font-medium text-slate-900">
                      {dateFormatter.format(new Date(coupon.startDate))} –{" "}
                      {dateFormatter.format(new Date(coupon.endDate))}
                    </p>
                    {coupon.status === "active" && (
                      <p className="text-xs text-emerald-600">
                        เหลืออีก {getDaysUntil(coupon.endDate)} วันก่อนหมดอายุ
                      </p>
                    )}
                  </div>

                  <div className="w-full flex-1 min-w-[220px]">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>แลกแล้ว</span>
                      <span>
                        {coupon.totalRedeemed.toLocaleString("th-TH")} /{" "}
                        {coupon.totalIssued.toLocaleString("th-TH")} สิทธิ์
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full ${statusStyles[coupon.status].accentClass}`}
                        style={{ width: `${redeemedRatio}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
