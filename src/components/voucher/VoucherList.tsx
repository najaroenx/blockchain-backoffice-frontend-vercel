import { ListBase, useListContext, useRedirect } from "react-admin";
import { useMemo, useState, useCallback } from "react";

import { ListActions } from "../customs/ListAction";
import { GridList } from "./GridList";
import { getDaysUntil, statusStyles } from "@/app/vouchers/utils";
import type {  VoucherStatus } from "@/data/vouchers";
import type { VoucherProceedPayload } from "./VoucherSelectLayout";
import { useDialog } from "@/hooks/useDialog";
import { VoucherSelectDialog } from "./VoucherSelectDialog";
import { useMerchantId } from "@/contexts/MerchantContext";

type VoucherRecord = {
  id:string
  merchantId?:string;
  status: "active" | "upcoming";
  totalRedeemed?: number;
  totalIssued?: number;
  endDate: string;
};

type StatusFilter = "all" | VoucherStatus;

interface VoucherOverviewProps {
  vouchers: VoucherRecord[];
  isLoading: boolean;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  onOpenSelect: () => void;
}

const VoucherOverview = ({
  vouchers,
  isLoading,
  statusFilter,
  onStatusChange,
  onOpenSelect,
}: VoucherOverviewProps) => {
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
        voucher.status === "active" && getDaysUntil(voucher.endDate) <= 10
    ).length;

    return {
      totalsByStatus: totals,
      stats: {
        totalActive: totals.active,
        expiringSoon,
        totalRedeemed,
      },
    };
  }, [vouchers]);

  const formatNumber = (value: number) =>
    value.toLocaleString("th-TH", { maximumFractionDigits: 0 });

  const renderCount = (value: number) =>
    isLoading ? "…" : formatNumber(value);

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
            ช่วยให้คุณมอบประสบการณ์สุดพิเศษแก่สมาชิกได้ง่ายขึ้น
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenSelect}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
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
          <p className="mt-1 text-xs text-slate-500">
            ครั้งที่สมาชิกแลกใช้แล้ว
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-slate-500">ภาพรวมสถานะ</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-medium">
            <div className="rounded-xl bg-emerald-50 py-2 text-emerald-700">
              กำลังใช้งาน
              <p className="mt-1 text-lg font-semibold">
                {renderCount(totalsByStatus.active)}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 py-2 text-indigo-600">
              เตรียมเปิด
              <p className="mt-1 text-lg font-semibold">
                {renderCount(totalsByStatus.upcoming)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 py-2 text-slate-600">
              ทั้งหมด
              <p className="mt-1 text-lg font-semibold">
                {renderCount(totalsByStatus.all)}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-3">
        {(["all", "active", "upcoming"] as StatusFilter[]).map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(status)}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white shadow"
                  : status === "all"
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : statusStyles[status].badgeClass,
              ].join(" ")}
            >
              {status === "all"
                ? `ทั้งหมด (${renderCount(totalsByStatus.all)})`
                : `${statusStyles[status].label} (${renderCount(
                    totalsByStatus[status]
                  )})`}
            </button>
          );
        })}
      </div>
    </section>
  );
};

interface VoucherListContentProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  onOpenSelect: () => void;
  merchantId?: string | null;
}

const VoucherListContent = ({
  statusFilter,
  onStatusChange,
  onOpenSelect,
  merchantId,
}: VoucherListContentProps) => {
  const { data = [], isLoading = false } = useListContext<VoucherRecord>();
  const vouchers = Array.isArray(data) ? data : [];

  const scoped = useMemo(() => {
    if (!merchantId) return vouchers;
    return vouchers.filter((voucher) => voucher.merchantId === merchantId);
  }, [vouchers, merchantId]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return scoped;
    return scoped.filter((voucher) => voucher.status === statusFilter);
  }, [scoped, statusFilter]);

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

const VoucherList = () => {
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

export default VoucherList;
