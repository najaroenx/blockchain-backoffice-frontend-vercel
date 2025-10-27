"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { coupons, type Coupon } from "@/data/coupons";
import {
  dateFormatter,
  formatValueLabel,
  statusStyles,
} from "@/app/coupons/utils";

const parseSelectedParam = (raw: string | null) =>
  raw
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean) ?? [];

const parseActivationParam = (raw: string | null): Partial<Record<string, number>> => {
  if (!raw) return {};
  return raw.split("|").reduce<Partial<Record<string, number>>>((acc, segment) => {
    const [id, value] = segment.split(":");
    if (!id) {
      return acc;
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return acc;
    }
    acc[id] = Math.max(0, Math.floor(numeric));
    return acc;
  }, {});
};

export default function SetupCouponsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedFromQuery = useMemo(
    () => parseSelectedParam(searchParams.get("selected")),
    [searchParams]
  );
  const activationFromQuery = useMemo(
    () => parseActivationParam(searchParams.get("activation")),
    [searchParams]
  );

  const availableCoupons = useMemo(
    () =>
      coupons.filter(
        (coupon) =>
          coupon.status === "upcoming" &&
          (selectedFromQuery.length === 0 ||
            selectedFromQuery.includes(coupon.id))
      ),
    [selectedFromQuery]
  );

  const initialCoupon = availableCoupons[0];
  const initialActivationPlan = initialCoupon
    ? activationFromQuery[initialCoupon.id]
    : undefined;
  const initialTotalQuantity =
    initialCoupon && typeof initialActivationPlan === "number"
      ? Math.min(
          initialCoupon.totalIssued,
          Math.max(0, initialActivationPlan)
        )
      : initialCoupon?.totalIssued ?? 0;

  const [couponId, setCouponId] = useState<string>(
    availableCoupons[0]?.id ?? ""
  );
  const [minPerMember, setMinPerMember] = useState<number>(1);
  const [maxPerMember, setMaxPerMember] = useState<number>(
    availableCoupons[0]?.limitPerMember ?? 5
  );
  const [pricePoints, setPricePoints] = useState<number>(
    availableCoupons[0]?.pointsCost ?? 0
  );
  const [totalQuantity, setTotalQuantity] = useState<number>(
    initialTotalQuantity
  );

  const selectedCoupon = useMemo<Coupon | undefined>(
    () => availableCoupons.find((coupon) => coupon.id === couponId),
    [couponId, availableCoupons]
  );

  useEffect(() => {
    if (!availableCoupons.some((coupon) => coupon.id === couponId)) {
      setCouponId(availableCoupons[0]?.id ?? "");
    }
  }, [availableCoupons, couponId]);

  useEffect(() => {
    if (!selectedCoupon) {
      return;
    }
    const nextMax = selectedCoupon.limitPerMember ?? 5;
    setMaxPerMember(nextMax);
    setMinPerMember((prev) => Math.min(prev, nextMax));
    setPricePoints(selectedCoupon.pointsCost);
    const plannedFromQuery = activationFromQuery[selectedCoupon.id];
    const nextTotal =
      typeof plannedFromQuery === "number"
        ? Math.min(
            selectedCoupon.totalIssued,
            Math.max(0, plannedFromQuery)
          )
        : selectedCoupon.totalIssued;
    setTotalQuantity(nextTotal);
  }, [selectedCoupon, activationFromQuery]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCoupon) return;

    console.log("Setup coupon payload:", {
      couponId,
      minPerMember,
      maxPerMember,
      pricePoints,
      totalQuantity,
    });
  };

  const handleActivate = () => {
    if (!selectedCoupon) return;

    console.log("Activate coupon payload:", {
      couponId,
      minPerMember,
      maxPerMember,
      pricePoints,
      totalQuantity,
    });
  };

  if (availableCoupons.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-semibold text-slate-800">
          ยังไม่มีคูปองที่สามารถตั้งค่าได้
        </p>
        <p className="text-sm text-slate-500">
          กรุณาเลือกคูปองสถานะเตรียมเปิดก่อน แล้วกลับมาตั้งค่าอีกครั้ง
        </p>
        <Link
          href="/coupons/select"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          เลือกคูปอง
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-[0.25em]">
            rewards
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            ตั้งค่าคูปองสำหรับแคมเปญ
          </h1>
          <p className="text-slate-600 max-w-2xl">
            กำหนดจำนวนสิทธิ์การแลก ราคาคะแนน และรายละเอียดสำคัญก่อนปล่อยคูปองให้สมาชิกใช้งาน
          </p>
        </div>
        <Link
          href="/coupons/select"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          ← กลับไปหน้าเลือกคูปอง
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1.2fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label
              htmlFor="couponId"
              className="text-sm font-semibold text-slate-700"
            >
              เลือกคูปอง
            </label>
            <select
              id="couponId"
              value={couponId}
              onChange={(event) => setCouponId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {availableCoupons.map((coupon) => (
                <option key={coupon.id} value={coupon.id}>
                  {coupon.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="minPerMember"
                className="text-sm font-semibold text-slate-700"
              >
                จำนวนคูปองขั้นต่ำต่อสมาชิก
              </label>
              <input
                id="minPerMember"
                type="number"
                min={1}
                value={minPerMember}
                onChange={(event) => {
                  const nextMin = Math.max(1, Number(event.target.value) || 1);
                  setMinPerMember(nextMin);
                  setMaxPerMember((prev) =>
                    prev < nextMin ? nextMin : prev
                  );
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="maxPerMember"
                className="text-sm font-semibold text-slate-700"
              >
                จำนวนคูปองสูงสุดต่อสมาชิก
              </label>
              <input
                id="maxPerMember"
                type="number"
                min={minPerMember}
                value={maxPerMember}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  const nextMax = Number.isNaN(value)
                    ? minPerMember
                    : Math.max(minPerMember, value);
                  setMaxPerMember(nextMax);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="pricePoints"
                className="text-sm font-semibold text-slate-700"
              >
                ราคาคะแนนต่อสิทธิ์
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                ⭐
              </span>
              <input
                id="pricePoints"
                type="number"
                min={0}
                value={pricePoints}
                onChange={(event) =>
                  setPricePoints(Math.max(0, Number(event.target.value) || 0))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <p className="text-xs text-slate-500">
              ปรับตามจำนวนคะแนนที่ต้องการให้สมาชิกใช้แลกสิทธิ์นี้
            </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="totalQuantity"
                className="text-sm font-semibold text-slate-700"
              >
                จำนวนคูปองที่เปิดใช้งานรอบนี้
              </label>
              <input
                id="totalQuantity"
                type="number"
                min={0}
                value={totalQuantity}
                onChange={(event) =>
                  setTotalQuantity(
                    Math.max(0, Math.floor(Number(event.target.value) || 0))
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <p className="text-xs text-slate-500">
                จำนวนที่เหลือจากสิทธิ์ทั้งหมดจะถูกรอไว้เพื่อเปิดใช้งานในรอบถัดไป
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            >
              บันทึกการตั้งค่า
            </button>
            <button
              type="button"
              onClick={handleActivate}
              disabled={!selectedCoupon}
              className={[
                "rounded-full px-6 py-3 text-sm font-semibold text-white shadow transition",
                !selectedCoupon
                  ? "bg-emerald-200 text-emerald-500"
                  : "bg-emerald-600 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-lg",
              ].join(" ")}
            >
              เปิดใช้งานคูปอง
            </button>
          </div>
        </form>

        {selectedCoupon && (
          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {selectedCoupon.id}
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedCoupon.status].badgeClass}`}
              >
                {statusStyles[selectedCoupon.status].label}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedCoupon.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedCoupon.description}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  มูลค่าสิทธิประโยชน์
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {formatValueLabel(selectedCoupon)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  ใช้คะแนนปัจจุบัน {selectedCoupon.pointsCost.toLocaleString("th-TH")} คะแนน
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  รายละเอียดเพิ่มเติม
                </p>
                <p className="mt-2 font-medium text-slate-900">
                  ร้านค้า: {selectedCoupon.merchant}
                </p>
                {selectedCoupon.categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCoupon.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  ระยะเวลา: {dateFormatter.format(new Date(selectedCoupon.startDate))} –{" "}
                  {dateFormatter.format(new Date(selectedCoupon.endDate))}
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
