"use client";

import { useMemo, useState } from "react";

type DateRange = "all" | "today" | "7" | "30" | "custom";

type HistoryItem = {
  id: string;
  daysAgo: number;
  label: string;
  time: string;
  file: string;
  coupon: string;
  total: number;
  sent: number;
  admin: string;
  initials: string;
  avatarClass: string;
};

type DetailRow = {
  phone: string;
  coupon: string;
  status: "success" | "failed";
  error: string | null;
};

const HISTORY_DATA: HistoryItem[] = [
  {
    id: "B012",
    daysAgo: 0,
    label: "24 มิ.ย. 2569",
    time: "14:32",
    file: "summer_promo_final.csv",
    coupon: "SUMMER2024",
    total: 200,
    sent: 198,
    admin: "Tik Wannasin",
    initials: "TW",
    avatarClass: "from-rose-500 to-pink-600",
  },
  {
    id: "B011",
    daysAgo: 1,
    label: "23 มิ.ย. 2569",
    time: "09:15",
    file: "welcome_june_batch.csv",
    coupon: "WELCOME50",
    total: 85,
    sent: 85,
    admin: "Admin Ploy",
    initials: "AP",
    avatarClass: "from-indigo-500 to-violet-600",
  },
  {
    id: "B010",
    daysAgo: 3,
    label: "21 มิ.ย. 2569",
    time: "16:48",
    file: "flash_sale_weekend.csv",
    coupon: "FLASH30",
    total: 320,
    sent: 310,
    admin: "Tik Wannasin",
    initials: "TW",
    avatarClass: "from-rose-500 to-pink-600",
  },
  {
    id: "B009",
    daysAgo: 6,
    label: "18 มิ.ย. 2569",
    time: "11:22",
    file: "vip_june_members.csv",
    coupon: "VIP100",
    total: 50,
    sent: 50,
    admin: "Admin Mint",
    initials: "AM",
    avatarClass: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "B008",
    daysAgo: 7,
    label: "17 มิ.ย. 2569",
    time: "13:05",
    file: "loyalty_june_tier1.csv",
    coupon: "LOYAL20",
    total: 124,
    sent: 120,
    admin: "Admin Ploy",
    initials: "AP",
    avatarClass: "from-indigo-500 to-violet-600",
  },
  {
    id: "B007",
    daysAgo: 10,
    label: "14 มิ.ย. 2569",
    time: "10:30",
    file: "campaign_mid_june.csv",
    coupon: "MID20",
    total: 500,
    sent: 492,
    admin: "Tik Wannasin",
    initials: "TW",
    avatarClass: "from-rose-500 to-pink-600",
  },
  {
    id: "B006",
    daysAgo: 14,
    label: "10 มิ.ย. 2569",
    time: "08:00",
    file: "june_kickoff.csv",
    coupon: "JUNE15",
    total: 300,
    sent: 300,
    admin: "Admin Mint",
    initials: "AM",
    avatarClass: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "B005",
    daysAgo: 19,
    label: "05 มิ.ย. 2569",
    time: "15:20",
    file: "weekend_special.csv",
    coupon: "WKND25",
    total: 180,
    sent: 172,
    admin: "Admin Ploy",
    initials: "AP",
    avatarClass: "from-indigo-500 to-violet-600",
  },
  {
    id: "B004",
    daysAgo: 23,
    label: "01 มิ.ย. 2569",
    time: "09:45",
    file: "june_welcome_promo.csv",
    coupon: "JUNE50",
    total: 95,
    sent: 95,
    admin: "Tik Wannasin",
    initials: "TW",
    avatarClass: "from-rose-500 to-pink-600",
  },
  {
    id: "B003",
    daysAgo: 27,
    label: "28 พ.ค. 2569",
    time: "14:10",
    file: "may_closeout_batch.csv",
    coupon: "MAY20",
    total: 450,
    sent: 448,
    admin: "Admin Mint",
    initials: "AM",
    avatarClass: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "B002",
    daysAgo: 35,
    label: "20 พ.ค. 2569",
    time: "11:00",
    file: "loyalty_may.csv",
    coupon: "LOYAL20",
    total: 210,
    sent: 205,
    admin: "Admin Ploy",
    initials: "AP",
    avatarClass: "from-indigo-500 to-violet-600",
  },
  {
    id: "B001",
    daysAgo: 40,
    label: "15 พ.ค. 2569",
    time: "16:30",
    file: "early_summer.csv",
    coupon: "EARLY15",
    total: 88,
    sent: 88,
    admin: "Tik Wannasin",
    initials: "TW",
    avatarClass: "from-rose-500 to-pink-600",
  },
];

const ERROR_REASONS = [
  "เบอร์โทรศัพท์ไม่ถูกต้อง",
  "บัญชีผู้ใช้ถูกระงับชั่วคราว",
  "รับคูปองนี้ครบโควต้าแล้ว",
  "ไม่พบบัญชีในระบบ",
  "คูปองหมดอายุแล้ว",
];

const PAGE_SIZE = 8;

function buildPageList(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
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

function dateToDaysAgo(dateValue: string): number {
  const today = new Date("2026-06-24T00:00:00");
  const selectedDate = new Date(dateValue);
  const difference = today.getTime() - selectedDate.getTime();
  return Math.round(difference / (1000 * 60 * 60 * 24));
}

function buildDetailRows(item: HistoryItem): DetailRow[] {
  const failedCount = item.total - item.sent;
  const rowLimit = Math.min(15, item.total);
  const shownFailed = Math.min(failedCount, Math.max(0, rowLimit - 3));
  const shownSuccess = rowLimit - shownFailed;

  const rows: DetailRow[] = [];
  for (let index = 0; index < shownSuccess; index += 1) {
    rows.push({
      phone: generatePhone(item.id, index),
      coupon: item.coupon,
      status: "success",
      error: null,
    });
  }

  for (let index = 0; index < shownFailed; index += 1) {
    rows.push({
      phone: generatePhone(item.id, 200 + index),
      coupon: item.coupon,
      status: "failed",
      error: ERROR_REASONS[index % ERROR_REASONS.length],
    });
  }
  return rows;
}

function generatePhone(seed: string, index: number): string {
  const sum = seed
    .split("")
    .reduce((accumulator, character) => accumulator + (character.codePointAt(0) ?? 0), 0);
  const randomNumber = ((sum * 1731 + index * 7919) % 90000000) + 10000000;
  return `0${8 + (index % 2)}${String(randomNumber).slice(0, 8)}`;
}

function exportRowsCsv(item: HistoryItem, rows: DetailRow[]): void {
  const headers = "เบอร์โทรศัพท์,คูปอง,จำนวน,สถานะ,หมายเหตุ";
  const csvLines = rows.map((row) => {
    const statusText = row.status === "success" ? "สำเร็จ" : "ไม่สำเร็จ";
    return [row.phone, row.coupon, "1", statusText, row.error ?? ""].join(",");
  });

  const blob = new Blob([`\uFEFF${[headers, ...csvLines].join("\n")}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `report_${item.id}_${item.file}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function CouponHistoryPage() {
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState<HistoryItem | null>(null);

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return HISTORY_DATA.filter((item) => {
      const matchedText =
        !normalizedQuery ||
        item.file.toLowerCase().includes(normalizedQuery) ||
        item.coupon.toLowerCase().includes(normalizedQuery) ||
        item.id.toLowerCase().includes(normalizedQuery);

      if (!matchedText) {
        return false;
      }

      if (dateRange === "today") {
        return item.daysAgo === 0;
      }
      if (dateRange === "7") {
        return item.daysAgo <= 7;
      }
      if (dateRange === "30") {
        return item.daysAgo <= 30;
      }
      if (dateRange === "custom" && fromDate) {
        const fromDays = dateToDaysAgo(fromDate);
        const toDays = toDate ? dateToDaysAgo(toDate) : 0;
        const minDays = Math.min(fromDays, toDays);
        const maxDays = Math.max(fromDays, toDays);
        return item.daysAgo >= minDays && item.daysAgo <= maxDays;
      }
      return true;
    });
  }, [dateRange, fromDate, query, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleRows = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  const totalSent = useMemo(() => HISTORY_DATA.reduce((sum, row) => sum + row.sent, 0), []);
  const totalAll = useMemo(() => HISTORY_DATA.reduce((sum, row) => sum + row.total, 0), []);
  const perfectCount = useMemo(
    () => HISTORY_DATA.filter((row) => row.sent === row.total).length,
    []
  );
  const successRate = totalAll === 0 ? "-" : `${((totalSent / totalAll) * 100).toFixed(1)}%`;

  const selectedDetails = useMemo(() => {
    if (!selectedBatch) {
      return [];
    }
    return buildDetailRows(selectedBatch);
  }, [selectedBatch]);

  const changeDateFilter = (nextRange: DateRange) => {
    setDateRange(nextRange);
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-7xl text-slate-100">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">ประวัติการส่งคูปอง</h1>
        <p className="mt-2 text-sm text-slate-400">
          ดูรายการ Batch ที่เคยส่งทั้งหมด และคลิกดูรายละเอียดเพื่อตรวจสอบรายชื่อผู้ใช้แต่ละราย
        </p>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#12132a] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Batch ทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold">{HISTORY_DATA.length}</p>
          <p className="mt-2 text-xs text-slate-500">รอบการส่งที่บันทึกไว้</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#12132a] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">คูปองที่ส่งทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold">{totalSent.toLocaleString()}</p>
          <p className="mt-2 text-xs text-slate-500">รวมทุก Batch</p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-300">อัตราความสำเร็จ</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">{successRate}</p>
          <p className="mt-2 text-xs text-emerald-200/80">เฉลี่ยทุก Batch</p>
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
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="ค้นหาชื่อไฟล์ หรือชื่อคูปอง"
              className="h-10 w-full max-w-sm rounded-lg border border-white/20 bg-[#0f1023] px-3 text-sm text-white placeholder:text-slate-500 focus:border-white/40 focus:outline-none"
            />

            <div className="inline-flex rounded-lg bg-white/5 p-1 text-sm">
              {([
                ["all", "ทั้งหมด"],
                ["today", "วันนี้"],
                ["7", "7 วัน"],
                ["30", "30 วัน"],
                ["custom", "กำหนดเอง"],
              ] as Array<[DateRange, string]>).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => changeDateFilter(value)}
                  className={`rounded-md px-3 py-1.5 transition ${
                    dateRange === value ? "bg-white text-slate-900" : "text-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {dateRange === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => {
                    setFromDate(event.target.value);
                    setPage(1);
                  }}
                  className="h-10 rounded-lg border border-white/20 bg-[#0f1023] px-3 text-sm text-white focus:border-white/40 focus:outline-none"
                />
                <span className="text-slate-500">-</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => {
                    setToDate(event.target.value);
                    setPage(1);
                  }}
                  className="h-10 rounded-lg border border-white/20 bg-[#0f1023] px-3 text-sm text-white focus:border-white/40 focus:outline-none"
                />
              </div>
            )}

            <p className="ml-auto text-sm text-slate-400">
              {filteredData.length > 0
                ? `แสดง ${startIndex + 1}-${Math.min(startIndex + PAGE_SIZE, filteredData.length)} จาก ${filteredData.length} รายการ`
                : "ไม่พบรายการ"}
            </p>
          </div>
        </div>

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
              {visibleRows.length === 0 && (
                <tr className="border-t border-white/10">
                  <td colSpan={3} className="px-3 py-12 text-center text-slate-400">
                    ไม่พบรายการที่ตรงกัน
                  </td>
                </tr>
              )}

              {visibleRows.map((item) => {
                return (
                  <tr key={item.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-3 py-3 text-slate-300">
                      <span className="block font-semibold text-white">{item.label}</span>
                      <span className="text-xs text-slate-400">{item.time} น.</span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="max-w-[220px] truncate font-semibold text-white">{item.file}</p>
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
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
            <p className="text-sm text-slate-400">
              แสดง <span className="font-semibold text-white">{startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filteredData.length)}</span> จาก <span className="font-semibold text-white">{filteredData.length}</span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
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
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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
                  {selectedBatch.label} {selectedBatch.time} น. · ส่งโดย {selectedBatch.admin} · Batch {selectedBatch.id}
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
                  {selectedDetails.map((row, index) => (
                    <tr key={`${row.phone}-${index}`} className="border-t border-white/10">
                      <td className="px-3 py-2 text-right text-slate-400">{index + 1}</td>
                      <td className="px-3 py-2 font-mono">{row.phone}</td>
                      <td className="px-3 py-2 font-semibold">{row.coupon}</td>
                      <td className="px-3 py-2">1 ใบ</td>
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
                {selectedBatch.total > 15 ? "แสดงตัวอย่าง 15 รายการแรก Export CSV เพื่อดูทั้งหมด" : "แสดงข้อมูลครบทั้งหมด"}
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
