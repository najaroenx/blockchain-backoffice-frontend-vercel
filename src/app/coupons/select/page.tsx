"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { coupons, type Coupon, type CouponStatus } from "@/data/coupons";
import {
  dateFormatter,
  formatValueLabel,
  statusStyles,
} from "@/app/coupons/utils";

type StatusFilter = "all" | CouponStatus;

export default function SelectCouponsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("upcoming");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activationPlan, setActivationPlan] = useState<Record<string, number>>({});

  const upcomingCoupons = useMemo(
    () => coupons.filter((coupon) => coupon.status === "upcoming"),
    []
  );

  const filteredCoupons = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchesSearch = (coupon: Coupon) => {
      if (!normalizedSearch) return true;
      return (
        coupon.name.toLowerCase().includes(normalizedSearch) ||
        coupon.description.toLowerCase().includes(normalizedSearch) ||
        coupon.merchant.toLowerCase().includes(normalizedSearch) ||
        coupon.categories.some((category) =>
          category.toLowerCase().includes(normalizedSearch)
        )
      );
    };

    const matchesStatus = (coupon: Coupon) =>
      statusFilter === "all" || coupon.status === statusFilter;

    return coupons.filter(
      (coupon) => matchesStatus(coupon) && matchesSearch(coupon)
    );
  }, [searchTerm, statusFilter]);

  const selectedCoupons = useMemo(
    () => coupons.filter((coupon) => selectedIds.includes(coupon.id)),
    [selectedIds]
  );

  const getPlannedQuantity = useCallback((coupon: Coupon) => {
    const raw = activationPlan[coupon.id];
    const fallback = coupon.totalIssued;
    const candidate =
      typeof raw === "number" && !Number.isNaN(raw) ? raw : fallback;
    const normalized = Math.floor(candidate);
    return Math.min(coupon.totalIssued, Math.max(0, normalized));
  }, [activationPlan]);

  const allocation = useMemo(() => {
    const totalRights = selectedCoupons.reduce(
      (sum, coupon) => sum + coupon.totalIssued,
      0
    );

    const activationNow = selectedCoupons.reduce((sum, coupon) => {
      const planned = getPlannedQuantity(coupon);
      return sum + planned;
    }, 0);

    const totalPoints = selectedCoupons.reduce((sum, coupon) => {
      const planned = getPlannedQuantity(coupon);
      return sum + planned * coupon.pointsCost;
    }, 0);

    const reserveLater = Math.max(0, totalRights - activationNow);

    return { totalRights, activationNow, reserveLater, totalPoints };
  }, [selectedCoupons, getPlannedQuantity]);

  const handleToggleCoupon = (coupon: Coupon) => {
    if (coupon.status !== "upcoming") {
      return;
    }

    setSelectedIds((prev) => {
      const exists = prev.includes(coupon.id);
      const nextIds = exists
        ? prev.filter((id) => id !== coupon.id)
        : [...prev, coupon.id];

      setActivationPlan((prevPlan) => {
        if (exists) {
          const { [coupon.id]: _removed, ...rest } = prevPlan;
          return rest;
        }
        return {
          ...prevPlan,
          [coupon.id]: coupon.totalIssued,
        };
      });

      return nextIds;
    });
  };

  const handleProceed = () => {
    if (selectedIds.length === 0 || allocation.activationNow === 0) return;
    const search = new URLSearchParams();
    search.set("selected", selectedIds.join(","));
    const activationEntries = selectedIds
      .map((id) => {
        const coupon = coupons.find((item) => item.id === id);
        if (!coupon) return null;
        const planned = getPlannedQuantity(coupon);
        return `${id}:${planned}`;
      })
      .filter((entry): entry is string => Boolean(entry));

    if (activationEntries.length > 0) {
      search.set("activation", activationEntries.join("|"));
    }
    router.push(`/coupons/setup?${search.toString()}`);
  };

  const handleClearSelections = () => {
    setSelectedIds([]);
    setActivationPlan({});
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-[0.25em]">
            rewards • step 2
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            เตรียมเปิดใช้งานคูปอง
          </h1>
          <p className="text-slate-600 max-w-2xl">
            เลือกคูปองสถานะเตรียมเปิดเพื่อใช้ในแคมเปญของคุณ
            ดูภาพรวมก่อนเพื่อนำไปตั้งค่าจำนวนสิทธิ์และคะแนนที่ต้องใช้ในขั้นตอนถัดไป
          </p>
          <p className="text-sm text-slate-500">
            กำหนดจำนวนสิทธิ์ที่จะเปิดใช้งานในรอบนี้และสำรองไว้รอบถัดไป ก่อนเข้าสู่การตั้งค่ารายละเอียด
          </p>
          <p className="text-sm text-slate-500">
            * แสดงเฉพาะคูปองที่อยู่ในสถานะ&nbsp;
            <span className="font-semibold text-indigo-600">เตรียมเปิด</span>
            เพื่อเตรียมพร้อมปล่อยใช้งาน
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-medium">
            <span className="inline-flex items-center gap-2 text-slate-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white">
                1
              </span>
              ตรวจจำนวนคูปองที่มี
            </span>
            <span className="inline-flex items-center gap-2 text-indigo-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                2
              </span>
              เตรียมเปิดใช้งาน
            </span>
            <span className="inline-flex items-center gap-2 text-slate-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200">
                3
              </span>
              ตั้งค่าและเปิดใช้งาน
            </span>
          </div>
        </div>
        <Link
          href="/coupons"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          ← กลับไปหน้ารายการคูปอง
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">คูปองสถานะเตรียมเปิดทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {upcomingCoupons.length.toLocaleString("th-TH")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            พร้อมให้เลือกนำมาวางแผนเปิดใช้งาน
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">สิทธิ์ทั้งหมดที่เลือกไว้</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {allocation.totalRights.toLocaleString("th-TH")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            จากคูปอง {selectedIds.length.toLocaleString("th-TH")} รายการ
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">เปิดใช้งานครั้งนี้</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {allocation.activationNow.toLocaleString("th-TH")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            ใช้คะแนน {allocation.totalPoints.toLocaleString("th-TH")} คะแนน
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">สำรองสำหรับรอบถัดไป</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {allocation.reserveLater.toLocaleString("th-TH")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            คงเหลือจากสิทธิ์ที่มีทั้งหมด
          </p>
        </article>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {(["upcoming"] as StatusFilter[]).map((status) => {
            const isCurrent = statusFilter === status;
            const label =
              status === "all"
                ? "ทั้งหมด"
                : statusStyles[status as CouponStatus].label;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isCurrent
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              🔍
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="ค้นหาชื่อคูปองหรือร้านค้า..."
              className="w-72 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {filteredCoupons.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center text-slate-500">
            <p className="text-lg font-medium">ไม่พบคูปองที่ตรงกับเงื่อนไข</p>
            <p className="mt-2 text-sm">ลองปรับการค้นหาหรือเปลี่ยนคำค้นหา</p>
          </div>
        ) : (
          filteredCoupons.map((coupon) => {
            const isSelected = selectedIds.includes(coupon.id);
            const isSelectable = coupon.status === "upcoming";
            const activationInputId = `activation-${coupon.id}`;
            const plannedQuantity = getPlannedQuantity(coupon);
            const reservedQuantity = Math.max(
              0,
              coupon.totalIssued - plannedQuantity
            );

            return (
              <article
                key={coupon.id}
                className={[
                  "relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
                  isSelected
                    ? "border-slate-900 ring-2 ring-slate-900/40"
                    : "border-slate-200",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => handleToggleCoupon(coupon)}
                  className={[
                    "absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg font-semibold transition",
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : isSelectable
                        ? "border-slate-200 bg-white text-transparent hover:border-slate-300 hover:text-slate-400"
                        : "border-dashed border-slate-200 bg-white text-slate-300 cursor-not-allowed",
                  ].join(" ")}
                  disabled={!isSelectable}
                  aria-pressed={isSelected}
                >
                  ✓
                </button>

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

                <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_1fr]">
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

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      ร้านค้า
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {coupon.merchant}
                    </p>
                    {coupon.categories.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {coupon.categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      ช่วงเวลาแลก
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {dateFormatter.format(new Date(coupon.startDate))} –{" "}
                      {dateFormatter.format(new Date(coupon.endDate))}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleCoupon(coupon)}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-semibold transition",
                      !isSelectable
                        ? "border border-dashed border-slate-300 text-slate-400 cursor-not-allowed"
                        : isSelected
                          ? "bg-slate-900 text-white shadow hover:bg-slate-800"
                          : "border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900",
                    ].join(" ")}
                    disabled={!isSelectable}
                  >
                    {isSelected ? "นำออกจากการเลือก" : "เลือกคูปองนี้"}
                  </button>
                  {!isSelectable && (
                    <p className="w-full text-xs text-slate-400">
                      คูปองสถานะอื่นไม่สามารถเลือกได้
                    </p>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-4 space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-700">
                        วางแผนการเปิดใช้งานรอบนี้
                      </p>
                      <p className="text-xs text-slate-500">
                        สิทธิ์ทั้งหมด {coupon.totalIssued.toLocaleString("th-TH")} สิทธิ์
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <label
                        htmlFor={activationInputId}
                        className="flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/90 p-3 text-sm text-slate-700 shadow-sm"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          เปิดใช้งานรอบนี้
                        </span>
                        <input
                          id={activationInputId}
                          type="number"
                          min={0}
                          max={coupon.totalIssued}
                          value={plannedQuantity}
                          onChange={(event) => {
                            const raw = Number(event.target.value);
                            const next = Math.min(
                              coupon.totalIssued,
                              Math.max(0, Math.floor(Number.isNaN(raw) ? 0 : raw))
                            );
                            setActivationPlan((prevPlan) => ({
                              ...prevPlan,
                              [coupon.id]: next,
                            }));
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                        <span className="text-[11px] font-medium text-slate-500">
                          สูงสุด {coupon.totalIssued.toLocaleString("th-TH")} สิทธิ์
                        </span>
                      </label>
                      <div className="flex flex-col justify-between rounded-2xl border border-white/60 bg-white/70 p-3 text-sm text-slate-600 shadow-sm">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          สำรองไว้รอบหน้า
                        </span>
                        <span className="text-2xl font-semibold text-slate-900">
                          {reservedQuantity.toLocaleString("th-TH")}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          จะเก็บไว้สำหรับการเปิดใช้งานครั้งถัดไป
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      <div className="sticky bottom-6 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 p-2 lg:flex-row">
          <div className="flex-1 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  เลือกแล้ว {selectedIds.length.toLocaleString("th-TH")} รายการ • สิทธิ์รวม {allocation.totalRights.toLocaleString("th-TH")} สิทธิ์
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  เปิดใช้งานครั้งนี้ {allocation.activationNow.toLocaleString("th-TH")} สิทธิ์
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  สำรองไว้รอบหน้า {allocation.reserveLater.toLocaleString("th-TH")} สิทธิ์ • ใช้คะแนน {allocation.totalPoints.toLocaleString("th-TH")} คะแนน
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleClearSelections}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  disabled={selectedIds.length === 0}
                >
                  ล้างการเลือก
                </button>

                <button
                  type="button"
                  disabled={selectedIds.length === 0 || allocation.activationNow === 0}
                  onClick={handleProceed}
                  className={[
                    "min-w-[200px] rounded-full px-6 py-3 text-sm font-semibold transition",
                    selectedIds.length === 0 || allocation.activationNow === 0
                      ? "bg-slate-200 text-slate-400"
                      : "bg-slate-900 text-white shadow-lg hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl",
                  ].join(" ")}
                >
                  ไปตั้งค่าการเปิดใช้งาน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
