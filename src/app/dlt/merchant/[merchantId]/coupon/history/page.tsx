"use client";

import { useEffect, useMemo, useState } from "react";
import { useMerchantId } from "@/app/dlt/contexts/merchantContext";
import LoadingDefaultComponent from "@/app/dlt/components/LoadingDefaultComponent";

type DetailRow = {
  seqNo: number;
  phone: string;
  coupon: string;
  quantity: number;
  status: "success" | "failed";
  error: string | null;
};

type HistoryItem = {
  id: string;
  createdAt: string;
  label: string;
  time: string;
  file: string;
  total: number;
  sent: number;
  failed: number;
  details: DetailRow[];
};

type ApiHistoryDetail = {
  phone: string;
  seqNo: number;
  status: string;
  couponId: string;
  quantity: number;
  error?: string;
};

type ApiHistoryItem = {
  batchJobId: string;
  fileName: string;
  status: string;
  totalRecords: number;
  successfulCount: number;
  failedCount: number;
  createdAt: string;
  details?: ApiHistoryDetail[];
};

type ApiHistoryResponse = {
  statusCode?: number;
  status?: string;
  message?: string;
  data?: {
    summary?: {
      page?: number;
      limit?: number;
      totalRecords?: number;
    };
    history?: ApiHistoryItem[];
  };
};

const PAGE_SIZE = 10;
const HISTORY_ENDPOINT = `${process.env.NEXT_PUBLIC_COUPON_PREVIEW_API_BASE ?? "http://localhost:4004"}/coupon/transfer/batch/history`;

function buildPageList(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }
  pages.push(totalPages);
  return pages;
}

function formatDateTime(input: string): { label: string; time: string } {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return { label: "-", time: "-" };
  }

  const label = date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { label, time };
}

function exportRowsCsv(item: HistoryItem, rows: DetailRow[]): void {
  const headers = "seqNo,phone,couponId,quantity,status,error";
  const csvLines = rows.map((row) => {
    const statusText = row.status === "success" ? "SUCCESS" : "FAILED";
    return [
      String(row.seqNo),
      row.phone,
      row.coupon,
      String(row.quantity),
      statusText,
      row.error ?? "",
    ].join(",");
  });

  const blob = new Blob([`\uFEFF${[headers, ...csvLines].join("\n")}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `report_${item.id}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}


function mapApiHistoryItem(item: ApiHistoryItem): HistoryItem {
  const { label, time } = formatDateTime(item.createdAt);

  return {
    id: item.batchJobId,
    createdAt: item.createdAt,
    label,
    time,
    file: item.fileName,
    total: item.totalRecords,
    sent: item.successfulCount,
    failed: item.failedCount,
    details: (item.details ?? []).map((detail) => ({
      seqNo: detail.seqNo,
      phone: detail.phone,
      coupon: detail.couponId,
      quantity: detail.quantity,
      status: detail.status?.toUpperCase() === "SUCCESS" ? "success" : "failed",
      error: detail.error ?? null,
    })),
  };
}

export default function CouponHistoryPage() {
  const merchantId = useMerchantId();

  const [page, setPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState<HistoryItem | null>(null);

  const [historyRows, setHistoryRows] = useState<HistoryItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    if (!merchantId) {
      return;
    }

    let cancelled = false;

    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      setHistoryError("");

      try {
        const params = new URLSearchParams({
          merchantId,
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        const response = await fetch(`${HISTORY_ENDPOINT}?${params.toString()}`, {
          method: "GET",
        });

        const payload = (await response.json()) as ApiHistoryResponse;
        if (!response.ok || payload.status === "error") {
          throw new Error(payload.message || "ไม่สามารถดึงประวัติการส่งคูปองได้");
        }

        const items = payload.data?.history ?? [];
        const mappedRows: HistoryItem[] = items.map(mapApiHistoryItem);

        if (!cancelled) {
          setHistoryRows(mappedRows);
          setTotalRecords(payload.data?.summary?.totalRecords ?? mappedRows.length);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดระหว่างดึงข้อมูลประวัติ";
        setHistoryRows([]);
        setTotalRecords(0);
        setHistoryError(message);
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    };

    void fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [merchantId, page]);

  const filteredData = historyRows;

  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const startIndex = totalRecords === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, totalRecords);

  const totalSent = useMemo(
    () => historyRows.reduce((sum, row) => sum + row.sent, 0),
    [historyRows],
  );
  const perfectCount = useMemo(
    () => historyRows.filter((row) => row.failed === 0).length,
    [historyRows],
  );

  const selectedDetails = useMemo(() => selectedBatch?.details ?? [], [selectedBatch]);

  return (
    <div className="mx-auto w-full max-w-7xl text-slate-100">
      {isLoadingHistory ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="flex flex-col items-center gap-4">
            <LoadingDefaultComponent className="w-54 h-54" />
            <div className="text-center">
              <p className="text-white font-semibold text-lg">Loading history...</p>
              <p className="text-gray-400 text-sm mt-1">Please wait</p>
            </div>
          </div>
        </div>
      ) : null}

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">ประวัติการส่งคูปอง</h1>
        <p className="mt-2 text-sm text-slate-400">
          ดูรายการ Batch ที่เคยส่งทั้งหมด และคลิกดูรายละเอียดเพื่อตรวจสอบรายชื่อผู้ใช้แต่ละราย
        </p>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#12132a] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Batch ทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold">{totalRecords}</p>
          <p className="mt-2 text-xs text-slate-500">รอบการส่งที่บันทึกไว้</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#12132a] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">คูปองที่ส่งทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold">{totalSent.toLocaleString()}</p>
          <p className="mt-2 text-xs text-slate-500">รวมข้อมูลที่โหลดมา</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#12132a] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">สำเร็จ 100%</p>
          <p className="mt-2 text-3xl font-semibold">{perfectCount}</p>
          <p className="mt-2 text-xs text-slate-500">Batch ที่ไม่มี error</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#12132a]">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-xl font-semibold">รายการประวัติการส่ง</h2>
          <p className="mt-1 text-sm text-slate-400">เรียงจากล่าสุด อัปเดตทุกครั้งที่มีการส่ง Batch ใหม่</p>
        </div>

        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-end">
            <p className="ml-auto text-sm text-slate-400">
              {totalRecords > 0
                ? `แสดง ${startIndex}-${endIndex} จาก ${totalRecords} รายการ`
                : "ไม่พบรายการ"}
            </p>
          </div>
        </div>

        {historyError && (
          <div className="border-b border-white/10 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {historyError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-3 py-2">วันที่-เวลา</th>
                <th className="px-3 py-2">ชื่อไฟล์ CSV</th>
                <th className="px-3 py-2 text-center">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingHistory && filteredData.length === 0 && (
                <tr className="border-t border-white/10">
                  <td colSpan={3} className="px-3 py-12 text-center text-slate-400">
                    ไม่พบรายการที่ตรงกัน
                  </td>
                </tr>
              )}

              {!isLoadingHistory &&
                filteredData.map((item) => (
                  <tr key={item.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-3 py-3 text-slate-300">
                      <span className="block font-semibold text-white">{item.label}</span>
                      <span className="text-xs text-slate-400">{item.time} น.</span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="max-w-[320px] truncate font-semibold text-white">{item.file}</p>
                      <p className="font-mono text-xs text-slate-400">{item.id}</p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => setSelectedBatch(item)}
                        className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {totalRecords > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
            <p className="text-sm text-slate-400">
              แสดง <span className="font-semibold text-white">{startIndex}-{endIndex}</span> จาก <span className="font-semibold text-white">{totalRecords}</span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg border border-white/20 text-sm text-slate-200 transition hover:bg-white/10 disabled:opacity-30"
              >
                ‹
              </button>

              {buildPageList(currentPage, totalPages).map((value, index) => {
                if (value === "ellipsis") {
                  return (
                    <span key={`ellipsis-${currentPage}-${index}`} className="px-2 text-slate-500">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={`page-${value}`}
                    onClick={() => setPage(value)}
                    className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${
                      value === currentPage
                        ? "bg-white text-slate-900"
                        : "border border-white/20 text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg border border-white/20 text-sm text-slate-200 transition hover:bg-white/10 disabled:opacity-30"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </section>

      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#13142c]">
            <div className="flex items-start justify-between border-b border-white/10 p-5">
              <div>
                <h3 className="text-lg font-semibold">{selectedBatch.file}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {selectedBatch.label} {selectedBatch.time} น. · Batch {selectedBatch.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10"
              >
                ปิด
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 border-b border-white/10 p-4 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-[#0f1023] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">รายการทั้งหมด</p>
                <p className="mt-2 text-2xl font-semibold">{selectedBatch.total}</p>
              </div>
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="text-xs uppercase tracking-wide text-emerald-300">ส่งสำเร็จ</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-300">{selectedBatch.sent}</p>
              </div>
            </div>

            <div className="max-h-[45vh] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-[#181a35] text-left text-xs uppercase tracking-wide text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-right">#</th>
                    <th className="px-3 py-2">เบอร์โทรศัพท์</th>
                    <th className="px-3 py-2">คูปอง</th>
                    <th className="px-3 py-2">จำนวน</th>
                    <th className="px-3 py-2">สถานะ</th>
                    <th className="px-3 py-2">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDetails.map((row) => (
                    <tr key={`${selectedBatch.id}-${row.seqNo}-${row.phone}`} className="border-t border-white/10">
                      <td className="px-3 py-2 text-right text-slate-400">{row.seqNo}</td>
                      <td className="px-3 py-2 font-mono">{row.phone}</td>
                      <td className="px-3 py-2 font-semibold">{row.coupon}</td>
                      <td className="px-3 py-2">{row.quantity} ใบ</td>
                      <td className="px-3 py-2">
                        {row.status === "success" ? (
                          <span className="inline-flex rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300">
                            สำเร็จ
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-rose-500/20 px-2 py-1 text-xs font-semibold text-rose-300">
                            ไม่สำเร็จ
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-300">{row.error ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 p-4">
              <p className="text-xs text-slate-400">
                {selectedBatch.details.length > 15
                  ? "แสดงข้อมูลบางส่วนในหน้า Export CSV เพื่อดูทั้งหมด"
                  : "แสดงข้อมูลครบทั้งหมด"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
                >
                  ปิด
                </button>
                <button
                  onClick={() => exportRowsCsv(selectedBatch, selectedDetails)}
                  className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
