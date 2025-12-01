"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { useGetList } from "react-admin";

import type { Voucher } from "@/data/vouchers";
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
const isSafeKey = (key: string) =>
  /^[a-zA-Z0-9_-]+$/.test(key) && !["__proto__", "prototype", "constructor"].includes(key);

export const parseActivationParam = (value: string | null): Partial<Record<string, number>> => {
  if (!value) return {};

  return value.split("|").reduce<Partial<Record<string, number>>>((acc, segment) => {
    const [rawId, rawValue] = segment.split(":").map((v) => v.trim());

    /**Validate id format*/
    if (!rawId || !isSafeKey(rawId)) return acc;

    /**Validate number*/ 
    const valueNum = Number(rawValue);
    if (Number.isNaN(valueNum)) return acc;

    /**Assign only safe and normalized value*/
    acc[rawId] = Math.max(0, Math.floor(valueNum));
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

  // Get merchantId from location state or query params
  const merchantId = (location.state as any)?.merchantId || searchParams.get("merchantId");

  // Fetch vouchers from API
  const { data: vouchersData } = useGetList<Voucher>(
    "voucher",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "createdAt", order: "DESC" },
      filter: merchantId ? { merchantId } : {},
    },
    {
      enabled: !!merchantId,
    }
  );

  const availableVouchers = useMemo(
    () => {
      if (!vouchersData) return [];
      return vouchersData.filter(
        (voucher: Voucher) =>
          voucher.status === "upcoming" &&
          (selectedFromQuery.length === 0 || selectedFromQuery.includes(voucher.id))
      );
    },
    [vouchersData, selectedFromQuery]
  );

  const initialVoucher = availableVouchers[0];
  const initialActivationPlan = initialVoucher
    ? activationFromQuery[initialVoucher.id]
    : undefined;
  const initialTotalQuantity =
    initialVoucher && typeof initialActivationPlan === "number"
      ? Math.min(initialVoucher.totalIssued, Math.max(0, initialActivationPlan))
      : initialVoucher?.totalIssued ?? 0;

  // Constants for validation
  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER; // 9007199254740991
  const MAX_PRICE_POINTS = MAX_SAFE_INTEGER;
  const MAX_QUANTITY = MAX_SAFE_INTEGER;

  const [voucherId, setVoucherId] = useState<string>(availableVouchers[0]?.id ?? "");
  const [pricePoints, setPricePoints] = useState<number>(
    availableVouchers[0]?.pointsCost ?? 0
  );
  const [totalQuantity, setTotalQuantity] = useState<number>(initialTotalQuantity);
  const [selectedPointId, setSelectedPointId] = useState<string>("");
  const [activationPlan, setActivationPlan] = useState<
    Partial<Record<string, number>>
  >(activationFromQuery);

  // Fetch available points for the merchant
  const { data: pointsData } = useGetList(
    "point",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "createdAt", order: "DESC" },
      filter: merchantId ? { merchantId } : {},
    },
    {
      enabled: !!merchantId,
    }
  );

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

  const handleActivate = async () => {
    if (!selectedVoucher || !merchantId) return;

    // Validate that a point is selected
    if (!selectedPointId) {
      alert("กรุณาเลือก Point Token ก่อนเปิดใช้งาน");
      return;
    }

    // Validate price points
    if (pricePoints < 0) {
      alert("ราคาคะแนนต้องไม่น้อยกว่า 0");
      return;
    }

    if (pricePoints > MAX_PRICE_POINTS) {
      alert(`ราคาคะแนนต้องไม่เกิน ${MAX_PRICE_POINTS.toLocaleString("th-TH")}`);
      return;
    }

    if (!Number.isInteger(pricePoints)) {
      alert("ราคาคะแนนต้องเป็นจำนวนเต็มเท่านั้น");
      return;
    }

    // Validate quantity
    if (totalQuantity < 1) {
      alert("จำนวนสิทธิ์ต้องมากกว่า 0");
      return;
    }

    if (totalQuantity > MAX_QUANTITY) {
      alert(`จำนวนสิทธิ์ต้องไม่เกิน ${MAX_QUANTITY.toLocaleString("th-TH")}`);
      return;
    }

    if (totalQuantity > availableTotalForSelected) {
      alert(`จำนวนสิทธิ์ต้องไม่เกินที่มีอยู่ (${availableTotalForSelected.toLocaleString("th-TH")})`);
      return;
    }

    try {
      // Get selected point's symbol as currency
      const selectedPoint = pointsData?.find((p: any) => p.id === selectedPointId);
      const currency = selectedPoint?.symbol || "POINTS";

      const response = await fetch(`/api/${merchantId}/voucher/activate/${voucherId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pointsCost: pricePoints,
          amount: totalQuantity,
          pointId: selectedPointId,
          currency: currency,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to activate voucher");
      }

      const result = await response.json();
      console.log("Voucher activated successfully:", result);
      
      // Navigate back to voucher list or show success message
      alert("เปิดใช้งาน Voucher สำเร็จ!");
      window.location.href = `/admin/${merchantId}#/voucher`;
    } catch (error) {
      console.error("Error activating voucher:", error);
      alert(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : "ไม่สามารถเปิดใช้งาน Voucher ได้"}`);
    }
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
                {selectedVoucher?.merchantName}
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
              เลือก Point Token
              <select
                value={selectedPointId}
                onChange={(event) => setSelectedPointId(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              >
                <option value="">-- กรุณาเลือก Point Token --</option>
                {pointsData?.map((point: any) => (
                  <option key={point.id} value={point.id}>
                    {point.name} ({point.symbol})
                  </option>
                ))}
              </select>
              {!selectedPointId && (
                <span className="text-xs text-red-500">
                  * จำเป็นต้องเลือก Point Token
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              คะแนนที่ใช้แลกต่อ 1 สิทธิ์
              <input
                type="text"
                inputMode="numeric"
                value={pricePoints.toLocaleString("th-TH")}
                onChange={(event) => {
                  // Remove all non-numeric characters
                  const rawValue = event.target.value.replace(/[^\d]/g, "");
                  const numValue = rawValue === "" ? 0 : Number(rawValue);
                  
                  // Enforce constraints: min=0, max<10000 (i.e., max=9999)
                  if (numValue >= 0 && numValue < 100000) {
                    setPricePoints(numValue);
                  }
                }}
                onBlur={(event) => {
                  // Ensure value is at least 0 on blur
                  if (pricePoints < 0) {
                    setPricePoints(0);
                  }
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
              {pricePoints > 100000 && (
                <span className="text-xs text-red-500">
                  ราคาต้องไม่เกิน {(10000).toLocaleString("th-TH")}
                </span>
              )}
              {/* <span className="text-xs text-slate-500">
                ค่าสูงสุด: {(10000).toLocaleString("th-TH")}
              </span> */}
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              จำนวนสิทธิ์ที่เปิดใช้งานรอบนี้
              <input
                type="number"
                min={1}
                max={Math.min(availableTotalForSelected, MAX_QUANTITY)}
                step={1}
                value={totalQuantity}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  const maxAllowed = Math.min(availableTotalForSelected, MAX_QUANTITY);
                  if (value <= maxAllowed && value >= 0) {
                    setTotalQuantity(value);
                  }
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
              {totalQuantity > availableTotalForSelected && (
                <span className="text-xs text-red-500">
                  จำนวนสิทธิ์ต้องไม่เกินที่มีอยู่ ({availableTotalForSelected.toLocaleString("th-TH")})
                </span>
              )}
              {totalQuantity > MAX_QUANTITY && (
                <span className="text-xs text-red-500">
                  จำนวนสิทธิ์ต้องไม่เกิน {MAX_QUANTITY.toLocaleString("th-TH")}
                </span>
              )}
              <span className="text-xs text-slate-500">
                สำรองไว้รอบหน้า {" "}
                <span className="font-semibold text-slate-900">
                  {reservedQuantity.toLocaleString("th-TH")}
                </span>{" "}
                สิทธิ์ (สูงสุด: {Math.min(availableTotalForSelected, MAX_QUANTITY).toLocaleString("th-TH")})
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
                disabled={!selectedPointId}
                className={`rounded-full px-6 py-2 text-sm font-semibold text-white transition ${
                  selectedPointId
                    ? "bg-slate-900 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
                    : "cursor-not-allowed bg-slate-400"
                }`}
              >
                เปิดใช้งาน
              </button>
            </div>
          </form>
        </article>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            ภาพรวมการตั้งค่า
          </p>

          {selectedPointId && pointsData && (
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Point Token ที่เลือก
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {pointsData.find((p: any) => p.id === selectedPointId)?.name}
              </p>
              <p className="text-xs text-slate-600">
                {pointsData.find((p: any) => p.id === selectedPointId)?.symbol}
              </p>
            </div>
          )}

          {!selectedPointId && (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4">
              <p className="text-xs font-semibold text-red-600">
                ⚠️ กรุณาเลือก Point Token
              </p>
              <p className="mt-1 text-xs text-slate-600">
                จำเป็นต้องเลือก Point Token ก่อนเปิดใช้งาน Voucher
              </p>
            </div>
          )}

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
