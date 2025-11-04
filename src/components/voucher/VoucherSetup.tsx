"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";

import type { Voucher } from "@/data/vouchers";
import { vouchers } from "@/data/vouchers";
import {
  dateFormatter,
  formatValueLabel,
  statusStyles,
} from "@/app/vouchers/utils";

const parseSelectedParam = (value: string | null) =>
  value
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean) ?? [];

const parseActivationParam = (value: string | null) => {
  if (!value) return {} as Partial<Record<string, number>>;
  return value.split("|").reduce<Partial<Record<string, number>>>((acc, entry) => {
    const [id, raw] = entry.split(":");
    if (!id) return acc;
    const numeric = Number(raw);
    if (Number.isNaN(numeric)) return acc;
    acc[id] = Math.max(0, Math.floor(numeric));
    return acc;
  }, {});
};

const VoucherSetup = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const selectedFromQuery = useMemo(
    () => parseSelectedParam(searchParams.get("selected")),
    [searchParams]
  );

  const activationFromQuery = useMemo(
    () => parseActivationParam(searchParams.get("activation")),
    [searchParams]
  );

  const availableVouchers = useMemo(
    () =>
      vouchers.filter(
        (voucher) =>
          voucher.status === "upcoming" &&
          (selectedFromQuery.length === 0 || selectedFromQuery.includes(voucher.id))
      ),
    [selectedFromQuery]
  );

  const initialVoucher = availableVouchers[0];
  const initialActivationPlan = initialVoucher
    ? activationFromQuery[initialVoucher.id]
    : undefined;
  const initialTotalQuantity =
    initialVoucher && typeof initialActivationPlan === "number"
      ? Math.min(initialVoucher.totalIssued, Math.max(0, initialActivationPlan))
      : initialVoucher?.totalIssued ?? 0;

  const [voucherId, setVoucherId] = useState<string>(availableVouchers[0]?.id ?? "");
  const [pricePoints, setPricePoints] = useState<number>(
    availableVouchers[0]?.pointsCost ?? 0
  );
  const [totalQuantity, setTotalQuantity] = useState<number>(initialTotalQuantity);
  const [activationPlan, setActivationPlan] = useState<
    Partial<Record<string, number>>
  >(activationFromQuery);

  const selectedVoucher = useMemo<Voucher | undefined>(
    () => availableVouchers.find((voucher) => voucher.id === voucherId),
    [voucherId, availableVouchers]
  );

  const activationSummary = useMemo(() => {
    return availableVouchers.map((voucher) => {
      const planned = activationPlan[voucher.id];
      const effective =
        typeof planned === "number"
          ? Math.min(voucher.totalIssued, Math.max(0, planned))
          : voucher.totalIssued;
      const reserved = Math.max(0, voucher.totalIssued - effective);
      return {
        id: voucher.id,
        name: voucher.name,
        planned: effective,
        reserved,
        total: voucher.totalIssued,
      };
    });
  }, [availableVouchers, activationPlan]);

  useEffect(() => {
    if (!availableVouchers.some((voucher) => voucher.id === voucherId)) {
      setVoucherId(availableVouchers[0]?.id ?? "");
    }
  }, [availableVouchers, voucherId]);

  useEffect(() => {
    if (!selectedVoucher) return;
    setPricePoints(selectedVoucher.pointsCost);
    const plannedFromQuery = activationPlan[selectedVoucher.id];
    const nextTotal =
      typeof plannedFromQuery === "number"
        ? Math.min(selectedVoucher.totalIssued, Math.max(0, plannedFromQuery))
        : selectedVoucher.totalIssued;
    setTotalQuantity(nextTotal);
  }, [selectedVoucher, activationPlan]);

  const availableTotalForSelected = selectedVoucher?.totalIssued ?? 0;
  const reservedQuantity = Math.max(0, availableTotalForSelected - totalQuantity);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedVoucher) return;

    console.log("Setup voucher payload (admin):", {
      voucherId,
      pricePoints,
      totalQuantity,
      activationPlan,
    });
  };

  const handleActivate = () => {
    if (!selectedVoucher) return;

    console.log("Activate voucher payload (admin):", {
      voucherId,
      pricePoints,
      totalQuantity,
      activationPlan,
    });
  };

  if (availableVouchers.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-semibold text-slate-800">
          ยังไม่มี Voucher ที่สามารถตั้งค่าได้
        </p>
        <p className="text-sm text-slate-500">
          กรุณาเลือก Voucher สถานะเตรียมเปิดก่อน แล้วกลับมาตั้งค่าอีกครั้ง
        </p>
        <RouterLink
          to="/voucher"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          เลือก Voucher
        </RouterLink>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-[0.25em]">
            rewards
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            ตั้งค่า Voucher สำหรับแคมเปญ
          </h1>
          <p className="text-slate-600 max-w-2xl">
            กำหนดจำนวนสิทธิ์การแลก ราคาคะแนน และรายละเอียดสำคัญก่อนปล่อย Voucher ให้สมาชิกใช้งาน
          </p>
        </div>
        <RouterLink
          to="/voucher"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          ← กลับไปเลือก Voucher
        </RouterLink>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                เลือก Voucher
              </p>
              <select
                value={voucherId}
                onChange={(event) => setVoucherId(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {availableVouchers.map((voucher) => (
                  <option key={voucher.id} value={voucher.id}>
                    {voucher.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                ร้านค้า
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {selectedVoucher?.merchant}
              </p>
            </div>
          </div>

          {selectedVoucher && (
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedVoucher.status].badgeClass}`}
              >
                {statusStyles[selectedVoucher.status].label}
              </span>
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedVoucher.name}
              </h2>
              <p className="text-sm text-slate-600">
                {selectedVoucher.description}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    มูลค่าสิทธิประโยชน์
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {formatValueLabel(selectedVoucher)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    ใช้คะแนนแลก {selectedVoucher.pointsCost.toLocaleString("th-TH")} คะแนน
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    จนถึงวันที่
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                  
                    {dateFormatter.format(new Date(selectedVoucher.endDate))}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              คะแนนที่ใช้แลกต่อ 1 สิทธิ์
              <input
                type="number"
                min={0}
                value={pricePoints}
                onChange={(event) => setPricePoints(Number(event.target.value))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              จำนวนสิทธิ์ที่เปิดใช้งานรอบนี้
              <input
                type="number"
                min={1}
                max={availableTotalForSelected}
                value={totalQuantity}
                onChange={(event) => setTotalQuantity(Number(event.target.value))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <span className="text-xs text-slate-500">
                สำรองไว้รอบหน้า {" "}
                <span className="font-semibold text-slate-900">
                  {reservedQuantity.toLocaleString("th-TH")}
                </span>{" "}
                สิทธิ์
              </span>
            </label>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/voucher")}
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleActivate}
                className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
              >
                เปิดใช้งาน
              </button>
              <button
                type="submit"
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </form>
        </article>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            ภาพรวมจำนวนสิทธิ์ที่เลือกไว้
          </p>
          <div className="space-y-4">
            {activationSummary.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  เปิดรอบนี้ {" "}
                  <span className="font-semibold text-slate-900">
                    {item.planned.toLocaleString("th-TH")}
                  </span>{" "}
                  / {item.total.toLocaleString("th-TH")} สิทธิ์
                </p>
                <p className="text-xs text-slate-500">
                  สำรอง {item.reserved.toLocaleString("th-TH")} สิทธิ์
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default VoucherSetup;
