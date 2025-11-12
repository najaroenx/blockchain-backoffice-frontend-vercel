"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetList } from "react-admin";

import type { VoucherStatus } from "@/data/vouchers";
import { type Voucher } from "@/data/vouchers";
import {
  dateFormatter,
  formatValueLabel,
  statusStyles,
} from "@/app/vouchers/utils";

type StatusFilter = "all" | VoucherStatus;

export type VoucherProceedPayload = {
  selectedIds: string[];
  activationPlan: Record<string, number>;
  activationQuery: string;
};

type VoucherSelectLayoutProps = {
  showBackLink?: boolean;
  onClose?: () => void;
  className?: string;
  onProceed?: (payload: VoucherProceedPayload) => void;
  merchantId?: string | null;
  vouchers?: Voucher[];
};

export const VoucherSelectLayout = ({
  showBackLink = true,
  onClose,
  className = "",
  onProceed,
  merchantId,
  vouchers: vouchersFromProps,
}: VoucherSelectLayoutProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("upcoming");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Fetch vouchers from API only if not provided via props
  const { data: vouchersData, isLoading } = useGetList<Voucher>(
    "voucher",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "createdAt", order: "DESC" },
      filter: merchantId ? { merchantId } : {},
    },
    {
      enabled: !!merchantId && !vouchersFromProps,
    }
  );

  const scopedVouchers = useMemo(() => {
    // Use vouchers from props if available, otherwise use data from API
    const sourceVouchers = vouchersFromProps || vouchersData || [];
    // Filter only "upcoming" status vouchers
    return sourceVouchers.filter((voucher: Voucher) => voucher.status === "upcoming");
  }, [vouchersFromProps, vouchersData]);

  const [activationPlan, setActivationPlan] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const scopedIds = new Set(scopedVouchers.map((voucher) => voucher.id));
    setSelectedIds((prev) => prev.filter((id) => scopedIds.has(id)));
    setActivationPlan((prev) => {
      const next: Record<string, number> = {};
      for (const id of Object.keys(prev)) {
        if (scopedIds.has(id)) {
          next[id] = prev[id];
        }
      }
      return next;
    });
  }, [scopedVouchers]);

  const upcomingVouchers = useMemo(
    () => scopedVouchers.filter((voucher) => voucher.status === "upcoming"),
    [scopedVouchers]
  );

  const filteredVouchers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchesSearch = (voucher: Voucher) => {
      if (!normalizedSearch) return true;
      return (
        voucher.name.toLowerCase().includes(normalizedSearch) ||
        voucher.description.toLowerCase().includes(normalizedSearch) ||
        voucher.merchantName.toLowerCase().includes(normalizedSearch)
      );
    };

    const matchesStatus = (voucher: Voucher) =>
      statusFilter === "all" || voucher.status === statusFilter;

    return scopedVouchers.filter(
      (voucher) => matchesStatus(voucher) && matchesSearch(voucher)
    );
  }, [searchTerm, statusFilter, scopedVouchers]);

  const selectedVouchers = useMemo(
    () => scopedVouchers.filter((voucher) => selectedIds.includes(voucher.id)),
    [selectedIds, scopedVouchers]
  );

  const getPlannedQuantity = useCallback(
    (voucher: Voucher) => {
      const raw = activationPlan[voucher.id];
      const fallback = voucher.totalIssued;
      const candidate =
        typeof raw === "number" && !Number.isNaN(raw) ? raw : fallback;
      const normalized = Math.floor(candidate);
      return Math.min(voucher.totalIssued, Math.max(0, normalized));
    },
    [activationPlan]
  );

  const allocation = useMemo(() => {
    const totalRights = selectedVouchers.reduce(
      (sum, voucher) => sum + voucher.totalIssued,
      0
    );

    const activationNow = selectedVouchers.reduce((sum, voucher) => {
      const planned = getPlannedQuantity(voucher);
      return sum + planned;
    }, 0);

    const totalPoints = selectedVouchers.reduce((sum, voucher) => {
      const planned = getPlannedQuantity(voucher);
      return sum + planned * voucher.pointsCost;
    }, 0);

    const reserveLater = Math.max(0, totalRights - activationNow);

    return { totalRights, activationNow, reserveLater, totalPoints };
  }, [selectedVouchers, getPlannedQuantity]);

  const handleToggleVoucher = (voucher: Voucher) => {
    if (voucher.status !== "upcoming") {
      return;
    }

    setSelectedIds((prev) => {
      const exists = prev.includes(voucher.id);
      const nextIds = exists
        ? prev.filter((id) => id !== voucher.id)
        : [...prev, voucher.id];

      setActivationPlan((prevPlan) => {
        if (exists) {
          const { [voucher.id]: _removed, ...rest } = prevPlan;
          return rest;
        }
        return {
          ...prevPlan,
          [voucher.id]: voucher.totalIssued,
        };
      });

      return nextIds;
    });
  };

  const handleProceed = () => {
    if (selectedIds.length === 0 || allocation.activationNow === 0) return;
    const search = new URLSearchParams();
    search.set("selected", selectedIds.join(","));
    
    // Add merchantId to query params
    if (merchantId) {
      search.set("merchantId", merchantId);
    }
    
    const activationEntries = selectedIds
      .map((id) => {
        const voucher = scopedVouchers.find((item) => item.id === id);
        if (!voucher) return null;
        const planned = getPlannedQuantity(voucher);
        return `${id}:${planned}`;
      })
      .filter((entry): entry is string => Boolean(entry));

    if (activationEntries.length > 0) {
      search.set("activation", activationEntries.join("|"));
    }

    const activationForCallback = activationEntries.reduce<
      Record<string, number>
    >((acc, entry) => {
      const [id, value] = entry.split(":");
      acc[id] = Number(value);
      return acc;
    }, {});

    const queryString = search.toString();

    if (onProceed) {
      onProceed({
        selectedIds,
        activationPlan: activationForCallback,
        activationQuery: queryString,
      });
      return;
    }

    // Navigate to setup page with merchantId in state as well
    router.push(
      queryString ? `/vouchers/setup?${queryString}` : "/vouchers/setup"
    );
  };

  const handleClearSelections = () => {
    setSelectedIds([]);
    setActivationPlan({});
  };

  return (
    <div className={`max-w-7xl mx-auto px-6 py-12 space-y-8 ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-[0.25em]">
            rewards • step 2
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            เตรียมเปิดใช้งาน Voucher
          </h1>
          <p className="text-slate-600 max-w-2xl">
            เลือกสิทธิพิเศษสถานะเตรียมเปิดเพื่อใช้ในแคมเปญของคุณ
            ดูภาพรวมก่อนเพื่อนำไปตั้งค่าจำนวนสิทธิ์และคะแนนที่ต้องใช้ในขั้นตอนถัดไป
          </p>
          <p className="text-sm text-slate-500">
            กำหนดจำนวนสิทธิ์ที่จะเปิดใช้งานในรอบนี้และสำรองไว้รอบถัดไป ก่อนเข้าสู่การตั้งค่ารายละเอียด
          </p>
          <p className="text-sm text-slate-500">
            * แสดงเฉพาะ Voucher ที่อยู่ในสถานะ{" "}
            <span className="font-semibold text-indigo-600">เตรียมเปิด</span>{" "}
            เพื่อเตรียมพร้อมปล่อยใช้งาน
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-medium">
            <span className="inline-flex items-center gap-2 text-slate-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white">
                1
              </span>
              ตรวจจำนวนสิทธิพิเศษที่มี
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
        {showBackLink ? (
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            ← กลับไปหน้ารายการ Voucher
          </Link>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            ปิดหน้าต่าง
          </button>
        )}
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Voucher สถานะเตรียมเปิดทั้งหมด
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {upcomingVouchers.length.toLocaleString("th-TH")}
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
            จาก Voucher {selectedIds.length.toLocaleString("th-TH")} รายการ
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
                : statusStyles[status as VoucherStatus].label;

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

        {/* <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              🔍
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="ค้นหาชื่อ Voucher หรือร้านค้า..."
              className="w-72 rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div> */}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {!vouchersFromProps && isLoading ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 py-16 text-center text-slate-500">
            <p className="text-lg font-medium">กำลังโหลดข้อมูล Voucher...</p>
            <p className="mt-2 text-sm">โปรดรอสักครู่</p>
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center text-slate-500">
            <p className="text-lg font-medium">ไม่พบ Voucher สถานะ &quot;เตรียมเปิด&quot;</p>
            <p className="mt-2 text-sm">ยังไม่มี Voucher ที่พร้อมเปิดใช้งานในขณะนี้</p>
          </div>
        ) : (
          filteredVouchers.map((voucher) => {
            const isSelected = selectedIds.includes(voucher.id);
            const isSelectable = voucher.status === "upcoming";
            const activationInputId = `activation-${voucher.id}`;
            const plannedQuantity = getPlannedQuantity(voucher);
            const reservedQuantity = Math.max(
              0,
              voucher.totalIssued - plannedQuantity
            );

            return (
              <article
                key={voucher.id}
                className={[
                  "relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
                  isSelected
                    ? "border-slate-900 ring-2 ring-slate-900/40"
                    : "border-slate-200",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => handleToggleVoucher(voucher)}
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
                  className={`absolute inset-x-6 top-0 h-1 rounded-full ${statusStyles[voucher.status].accentClass}`}
                />

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {voucher.id}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      {voucher.name}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {voucher.description}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[voucher.status].badgeClass}`}
                  >
                    {statusStyles[voucher.status].label}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_1fr]">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      มูลค่าสิทธิประโยชน์
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {formatValueLabel(voucher)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      ใช้คะแนนแลก {voucher.pointsCost.toLocaleString("th-TH")}{" "}
                      คะแนน
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      ร้านค้า
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {voucher.merchantName}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      จนถึงวันที่
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {dateFormatter.format(new Date(voucher.endDate))}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <label htmlFor={activationInputId}>เปิดใช้งานรอบนี้</label>
                    <input
                      id={activationInputId}
                      type="number"
                      min={0}
                      max={voucher.totalIssued}
                      value={plannedQuantity}
                      onChange={(event) =>
                        setActivationPlan((prev) => ({
                          ...prev,
                          [voucher.id]: Number(event.target.value),
                        }))
                      }
                      className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-1 text-right text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      disabled={!isSelectable}
                    />
                  </div>

                  <div className="text-xs text-slate-500">
                    สำรองไว้รอบหน้า{" "}
                    <span className="font-semibold text-slate-700">
                      {reservedQuantity.toLocaleString("th-TH")}
                    </span>{" "}
                    สิทธิ์
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleVoucher(voucher)}
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
                    {isSelected ? "นำออกจากการเลือก" : "เลือก Voucher นี้"}
                  </button>
                  {!isSelectable && (
                    <p className="w-full text-xs text-slate-400">
                      Voucher สถานะอื่นไม่สามารถเลือกได้
                    </p>
                  )}
                </div>
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
                  เลือกแล้ว {selectedIds.length.toLocaleString("th-TH")} รายการ •
                  สิทธิ์รวม {allocation.totalRights.toLocaleString("th-TH")} สิทธิ์
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  เปิดใช้งานครั้งนี้{" "}
                  {allocation.activationNow.toLocaleString("th-TH")} สิทธิ์
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  สำรองไว้รอบหน้า {allocation.reserveLater.toLocaleString("th-TH")}{" "}
                  สิทธิ์ • ใช้คะแนน{" "}
                  {allocation.totalPoints.toLocaleString("th-TH")} คะแนน
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
                  disabled={
                    selectedIds.length === 0 || allocation.activationNow === 0
                  }
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
};
