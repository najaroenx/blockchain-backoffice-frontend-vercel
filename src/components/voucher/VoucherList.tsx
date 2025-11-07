"use client";

import React, { useMemo, useState, useCallback } from "react";
import { ListBase, useListContext, useRedirect } from "react-admin";
import { ListActions } from "../customs/ListAction";
import { GridList } from "./GridList";
import { getDaysUntil, statusStyles } from "@/app/vouchers/utils";
import type { VoucherStatus } from "@/data/vouchers";
import { useDialog } from "@/hooks/useDialog";
import { VoucherSelectDialog } from "./VoucherSelectDialog";
import type { VoucherProceedPayload } from "./VoucherSelectLayout";
import { useMerchantId } from "@/contexts/MerchantContext";

/* ✅ Types */
type VoucherRecord = {
  id: string;
  merchantId?: string;
  status: "active" | "upcoming";
  totalRedeemed?: number;
  totalIssued?: number;
  endDate: string;
};

type StatusFilter = "all" | VoucherStatus;

/* ✅ Overview Section */
const VoucherOverviewComponent = ({
  vouchers,
  isLoading,
  statusFilter,
  onStatusChange,
  onOpenSelect,
}: {
  vouchers: VoucherRecord[];
  isLoading: boolean;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  onOpenSelect: () => void;
}) => {
  const { totalsByStatus, stats } = useMemo(() => {
    const totals = vouchers.reduce(
      (acc, voucher) => {
        acc.all += 1;
        if (voucher.status === "active") acc.active += 1;
        if (voucher.status === "upcoming") acc.upcoming += 1;
        return acc;
      },
      { all: 0, active: 0, upcoming: 0 }
    );

    const totalRedeemed = vouchers.reduce(
      (sum, voucher) => sum + (voucher.totalRedeemed ?? 0),
      0
    );

    const expiringSoon = vouchers.filter(
      (voucher) =>
        voucher.status === "active" &&
        getDaysUntil(voucher.endDate) <= 10
    ).length;

    return {
      totalsByStatus: totals,
      stats: { totalActive: totals.active, expiringSoon, totalRedeemed },
    };
  }, [vouchers]);

  const formatNumber = (value: number) =>
    value.toLocaleString("th-TH", { maximumFractionDigits: 0 });

  const renderCount = (value: number) => (isLoading ? "…" : formatNumber(value));

  return (
    <section className="flex flex-col gap-8 rounded-3xl bg-white px-6 py-8 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-600">
            rewards
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            คูปองและสิทธิพิเศษ
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            จัดการแคมเปญคูปอง แลกคะแนน และติดตามยอดการใช้งานแบบเรียลไทม์
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenSelect}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
        >
          <span>เลือก Voucher เพื่อเปิดใช้งาน</span>
          <span className="text-lg leading-none">→</span>
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">คูปองที่เปิดใช้งาน</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {renderCount(stats.totalActive)}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            +{renderCount(stats.expiringSoon)} คูปองใกล้หมดอายุ
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ยอดแลกสะสม</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {renderCount(stats.totalRedeemed)}
          </p>
          <p className="mt-1 text-xs text-slate-500">ครั้งที่สมาชิกแลกใช้แล้ว</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-slate-500">ภาพรวมสถานะ</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-medium">
            {(["active", "upcoming", "all"] as StatusFilter[]).map((status) => (
              <div
                key={status}
                className={`rounded-xl py-2 ${
                  status === "all"
                    ? "bg-slate-100 text-slate-600"
                    : statusStyles[status].badgeClass
                }`}
              >
                {/* TODO */}
                {/* {statusStyles ? statusStyles[status]?.label : "ทั้งหมด"} */}
                <p className="mt-1 text-lg font-semibold">
                  {renderCount(
                    status === "all"
                      ? totalsByStatus.all
                      : totalsByStatus[status]
                  )}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-3">
        {(["all", "active", "upcoming"] as StatusFilter[]).map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              statusFilter === status
                ? "bg-slate-900 text-white shadow"
                : status === "all"
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : statusStyles[status].badgeClass
            }`}
          >
            {status === "all"
              ? `ทั้งหมด (${renderCount(totalsByStatus.all)})`
              : `${statusStyles[status].label} (${renderCount(
                  totalsByStatus[status]
                )})`}
          </button>
        ))}
      </div>
    </section>
  );
};

VoucherOverviewComponent.displayName = "VoucherOverview";
export const VoucherOverview = React.memo(VoucherOverviewComponent);

/* ✅ List Content */
const VoucherListContentComponent = ({
  statusFilter,
  onStatusChange,
  onOpenSelect,
  merchantId,
}: {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  onOpenSelect: () => void;
  merchantId?: string | null;
}) => {
  const { data = [], isLoading = false } = useListContext<VoucherRecord>();
  const vouchers = Array.isArray(data) ? data : [];

  const scoped = useMemo(
    () =>
      merchantId
        ? vouchers.filter((v) => v.merchantId === merchantId)
        : vouchers,
    [vouchers, merchantId]
  );

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? scoped
        : scoped.filter((v) => v.status === statusFilter),
    [scoped, statusFilter]
  );

  return (
    <>
      <VoucherOverview
        vouchers={scoped}
        isLoading={isLoading}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        onOpenSelect={onOpenSelect}
      />
      <ListActions title="Vouchers" />
      <GridList records={filtered} isLoading={isLoading} />
    </>
  );
};

VoucherListContentComponent.displayName = "VoucherListContent";
export const VoucherListContent = React.memo(VoucherListContentComponent);

/* ✅ Main Component */
const VoucherListComponent = () => {
  const [isSelectOpen, toggleSelectDialog] = useDialog();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const redirect = useRedirect();
  const merchantId = useMerchantId();

  const handleProceed = useCallback(
    ({ activationQuery }: VoucherProceedPayload) => {
      const target = activationQuery
        ? `/voucher/setup?${activationQuery}`
        : "/voucher/setup";
      toggleSelectDialog();
      redirect(target);
    },
    [redirect, toggleSelectDialog]
  );

  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <div className="flex flex-col">
          <ListBase>
            <VoucherListContent
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              onOpenSelect={toggleSelectDialog}
              merchantId={merchantId}
            />
          </ListBase>
          <VoucherSelectDialog
            open={isSelectOpen}
            onClose={toggleSelectDialog}
            onProceed={handleProceed}
            merchantId={merchantId ?? undefined}
          />
        </div>
      </div>
    </div>
  );
};

VoucherListComponent.displayName = "VoucherList";
export default React.memo(VoucherListComponent);
