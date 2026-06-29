"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";

type ViewStep = 1 | 2 | 3;
type VerifyFilter = "all" | "valid" | "invalid";

type UploadRow = {
  row: number;
  phone: string;
  coupon: string;
  qty: number;
  start: string;
  expiry: string;
};

type ValidationRow = UploadRow & {
  status: "valid" | "invalid";
  error: string | null;
};

const TEMPLATE_HEADERS = "phone,coupon_code,qty,start_date,expiry_date";
const MAX_UPLOAD_ROWS = 30;

function parseCsvContent(csvContent: string): UploadRow[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  const firstColumns = new Set(
    lines[0].split(",").map((column) => column.trim().toLowerCase())
  );
  const hasHeader = firstColumns.has("phone") || firstColumns.has("coupon_code");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines
    .map((line, index) => {
      const columns = line.split(",").map((column) => column.trim());
      const qty = Number(columns[2] ?? "1");

      return {
        row: index + 1,
        phone: columns[0] ?? "",
        coupon: columns[1] ?? "",
        qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
        start: columns[3] ?? "-",
        expiry: columns[4] ?? "-",
      } satisfies UploadRow;
    })
    .filter((row) => row.phone || row.coupon);
}

function validateRows(rows: UploadRow[]): ValidationRow[] {
  return rows.map((row) => {
    const errors: string[] = [];
    const phoneDigits = row.phone.replace(/\D/g, "");

    if (phoneDigits.length !== 10) {
      errors.push("เบอร์โทรศัพท์ต้องมี 10 หลัก");
    }

    if (!row.coupon) {
      errors.push("ไม่พบรหัสคูปอง");
    }

    if (row.coupon.toUpperCase() === "XXXINVALID") {
      errors.push(`ไม่พบคูปอง "${row.coupon}" ในระบบ`);
    }

    return {
      ...row,
      status: errors.length > 0 ? "invalid" : "valid",
      error: errors.length > 0 ? errors.join(" · ") : null,
    };
  });
}

function formatBytes(sizeInBytes: number): string {
  if (!Number.isFinite(sizeInBytes) || sizeInBytes <= 0) {
    return "0 KB";
  }

  const inKb = sizeInBytes / 1024;
  if (inKb < 1024) {
    return `${inKb.toFixed(1)} KB`;
  }

  return `${(inKb / 1024).toFixed(1)} MB`;
}

export default function SendCouponPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentStep, setCurrentStep] = useState<ViewStep>(1);
  const [dragOver, setDragOver] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedFileMeta, setSelectedFileMeta] = useState<string>("");
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([]);
  const [validationRows, setValidationRows] = useState<ValidationRow[]>([]);
  const [filter, setFilter] = useState<VerifyFilter>("all");
  const [uploadError, setUploadError] = useState("");

  const validCount = useMemo(
    () => validationRows.filter((row) => row.status === "valid").length,
    [validationRows]
  );
  const invalidCount = useMemo(
    () => validationRows.filter((row) => row.status === "invalid").length,
    [validationRows]
  );

  const filteredRows = useMemo(() => {
    if (filter === "all") {
      return validationRows;
    }

    return validationRows.filter((row) => row.status === filter);
  }, [filter, validationRows]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadRows([]);
    setValidationRows([]);
    setSelectedFileName("");
    setSelectedFileMeta("");
    setCurrentStep(1);
    setProgress(0);
    setIsVerifying(false);
    setFilter("all");
    setUploadError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadFileContent = async (file: File) => {
    const text = await file.text();
    const parsedRows = parseCsvContent(text);

    if (parsedRows.length > MAX_UPLOAD_ROWS) {
      setUploadRows([]);
      setValidationRows([]);
      setSelectedFileName("");
      setSelectedFileMeta("");
      setUploadError(
        `ไฟล์ต้องมีข้อมูลไม่เกิน ${MAX_UPLOAD_ROWS} แถว (พบ ${parsedRows.length} แถว)`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploadRows(parsedRows);
    setValidationRows([]);
    setCurrentStep(1);
    setProgress(0);
    setFilter("all");
    setUploadError("");
    setSelectedFileName(file.name);
    setSelectedFileMeta(`${parsedRows.length} รายการ · ${formatBytes(file.size)}`);
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      return;
    }

    await loadFileContent(file);
  };

  const onDrop = async (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (!file?.name?.toLowerCase().endsWith(".csv")) {
      return;
    }

    await loadFileContent(file);
  };

  const goVerify = () => {
    setCurrentStep(2);
    setIsVerifying(true);
    setProgress(0);

    const completeVerification = () => {
      setValidationRows(validateRows(uploadRows));
      setIsVerifying(false);
      setFilter("all");
    };

    let nextProgress = 0;

    const timer = setInterval(() => {
      nextProgress = Math.min(nextProgress + 18, 100);
      setProgress(nextProgress);

      if (nextProgress === 100) {
        clearInterval(timer);
        setTimeout(completeVerification, 250);
      }
    }, 120);
  };

  const goSuccess = () => {
    setCurrentStep(3);
  };

  const downloadTemplate = () => {
    const templateRows = [
      TEMPLATE_HEADERS,
      "0812345678,SUMMER2024,1,2024-07-01,2024-12-31",
      "0823456789,WELCOME50,2,2024-06-15,2024-09-30",
      "0834567890,FLASH30,1,2024-07-10,2024-07-31",
    ];

    const blob = new Blob([templateRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "coupon_template.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-6xl text-slate-100">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">CSV Coupon Bulk Sender</h1>
        <p className="mt-2 text-sm text-slate-400">
          อัปโหลดไฟล์ CSV เพื่อส่งคูปองให้ผู้ใช้งานแบบ Bulk รองรับสูงสุด 10,000 รายการต่อครั้ง
        </p>
      </header>

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#12132a] p-5">
        <div className="flex flex-wrap items-center gap-3 md:gap-5">
          {[1, 2, 3].map((step) => {
            const stepDone = step < currentStep;
            const stepActive = step === currentStep;

            return (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
                    stepDone
                      ? "bg-emerald-500 text-white"
                      : stepActive
                        ? "border border-pink-400 bg-pink-500/20 text-pink-300"
                        : "border border-white/20 text-slate-400"
                  }`}
                >
                  {stepDone ? "✓" : step}
                </div>
                <div>
                  <p className={`text-sm font-medium ${stepActive ? "text-white" : "text-slate-400"}`}>
                    {step === 1 && "อัปโหลด & พรีวิว"}
                    {step === 2 && "ตรวจสอบข้อมูล"}
                    {step === 3 && "ส่งสำเร็จ"}
                  </p>
                </div>
                {step < 3 && <div className="mx-2 hidden h-px w-12 bg-white/10 md:block" />}
              </div>
            );
          })}
        </div>
      </div>

      {currentStep === 1 && (
        <section className="rounded-2xl border border-white/10 bg-[#12132a]">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 p-5">
            <div>
              <h2 className="text-xl font-semibold">อัปโหลดไฟล์ CSV</h2>
              <p className="mt-1 text-sm text-slate-400">รองรับไฟล์ .csv ขนาดไม่เกิน 10 MB</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Template CSV
            </button>
          </div>

          <div className="p-6">
            {uploadRows.length === 0 ? (
              <>
                <button
                  type="button"
                  onClick={openFilePicker}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className={`block w-full cursor-pointer rounded-xl border-2 border-dashed px-8 py-16 text-center transition ${
                    dragOver
                      ? "border-pink-400 bg-pink-500/10"
                      : "border-white/20 hover:border-pink-400 hover:bg-pink-500/5"
                  }`}
                >
                  <p className="text-base font-semibold">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                  <p className="mt-2 text-sm text-slate-400">รองรับ .csv เท่านั้น · สูงสุด 30 แถว</p>
                </button>
                {uploadError && <p className="mt-3 text-sm text-rose-300">{uploadError}</p>}
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-pink-400/30 bg-pink-500/10 p-3">
                  <div>
                    <p className="text-sm font-semibold">{selectedFileName}</p>
                    <p className="text-xs text-slate-300">{selectedFileMeta}</p>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="ml-auto rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
                  >
                    ลบไฟล์
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
                      <tr>
                        <th className="px-3 py-2 text-right">#</th>
                        <th className="px-3 py-2">เบอร์โทรศัพท์</th>
                        <th className="px-3 py-2">คูปอง</th>
                        <th className="px-3 py-2">จำนวน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadRows.map((row) => (
                        <tr key={`${row.row}-${row.phone}-${row.coupon}`} className="border-t border-white/10">
                          <td className="px-3 py-2 text-right text-slate-400">{row.row}</td>
                          <td className="px-3 py-2 font-mono">{row.phone}</td>
                          <td className="px-3 py-2 font-semibold">{row.coupon}</td>
                          <td className="px-3 py-2">{row.qty} ใบ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                  <p className="mr-auto text-sm text-slate-400">
                    พบ <span className="font-semibold text-white">{uploadRows.length}</span> รายการในไฟล์
                  </p>
                  <button
                    onClick={resetUpload}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={goVerify}
                    className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    ตรวจสอบข้อมูล
                  </button>
                </div>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={onFileChange}
          />
        </section>
      )}

      {currentStep === 2 && (
        <section>
          {isVerifying ? (
            <div className="rounded-2xl border border-white/10 bg-[#12132a] p-8 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-pink-400" />
              <h2 className="text-lg font-semibold">กำลังตรวจสอบข้อมูล...</h2>
              <p className="mt-2 text-sm text-slate-400">ระบบกำลังตรวจสอบเบอร์โทรศัพท์และคูปองกับฐานข้อมูล</p>
              <div className="mx-auto mt-5 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-[#12132a] p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">รายการทั้งหมด</p>
                  <p className="mt-2 text-3xl font-semibold">{validationRows.length}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-300">ผ่านการตรวจสอบ</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-300">{validCount}</p>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-rose-300">ไม่ผ่านการตรวจสอบ</p>
                  <p className="mt-2 text-3xl font-semibold text-rose-300">{invalidCount}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#12132a]">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 p-5">
                  <div>
                    <h2 className="text-xl font-semibold">ผลการตรวจสอบรายการ</h2>
                    <p className="mt-1 text-sm text-slate-400">รายการที่ไม่ผ่านจะถูกข้ามโดยอัตโนมัติ</p>
                  </div>
                  <div className="inline-flex rounded-lg bg-white/5 p-1 text-sm">
                    <button
                      onClick={() => setFilter("all")}
                      className={`rounded-md px-3 py-1.5 transition ${
                        filter === "all" ? "bg-white text-slate-900" : "text-slate-300"
                      }`}
                    >
                      ทั้งหมด ({validationRows.length})
                    </button>
                    <button
                      onClick={() => setFilter("valid")}
                      className={`rounded-md px-3 py-1.5 transition ${
                        filter === "valid" ? "bg-white text-slate-900" : "text-slate-300"
                      }`}
                    >
                      ผ่าน ({validCount})
                    </button>
                    <button
                      onClick={() => setFilter("invalid")}
                      className={`rounded-md px-3 py-1.5 transition ${
                        filter === "invalid" ? "bg-white text-slate-900" : "text-slate-300"
                      }`}
                    >
                      ไม่ผ่าน ({invalidCount})
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
                      <tr>
                        <th className="px-3 py-2 text-right">#</th>
                        <th className="px-3 py-2">เบอร์โทรศัพท์</th>
                        <th className="px-3 py-2">คูปอง</th>
                        <th className="px-3 py-2">จำนวน</th>
                        <th className="px-3 py-2">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.length === 0 && (
                        <tr className="border-t border-white/10">
                          <td colSpan={5} className="px-3 py-8 text-center text-slate-400">
                            ไม่มีรายการ
                          </td>
                        </tr>
                      )}
                      {filteredRows.map((row) => (
                        <tr key={`${row.row}-${row.phone}-${row.coupon}`} className="border-t border-white/10">
                          <td className="px-3 py-2 text-right text-slate-400">{row.row}</td>
                          <td className={`px-3 py-2 font-mono ${row.status === "invalid" ? "text-rose-300" : ""}`}>
                            {row.phone}
                          </td>
                          <td className="px-3 py-2 font-semibold">{row.coupon}</td>
                          <td className="px-3 py-2">{row.qty} ใบ</td>
                          <td className="px-3 py-2">
                            {row.status === "valid" ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300">
                                ผ่าน
                              </span>
                            ) : (
                              <div>
                                <span className="inline-flex items-center rounded-full bg-rose-500/20 px-2 py-1 text-xs font-semibold text-rose-300">
                                  ไม่ผ่าน
                                </span>
                                {row.error && <p className="mt-1 text-xs text-rose-300">{row.error}</p>}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <p className="mr-auto text-sm text-slate-400">
                  รายการที่ไม่ผ่าน <span className="font-semibold text-rose-300">{invalidCount}</span> รายการจะถูกข้ามโดยอัตโนมัติ
                </p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  ย้อนกลับ
                </button>
                <button
                  onClick={resetUpload}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={goSuccess}
                  disabled={validCount === 0 || invalidCount > 0}
                  className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ยืนยันการส่ง ({validCount} รายการ)
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {currentStep === 3 && (
        <section className="rounded-2xl border border-white/10 bg-[#12132a] p-8 text-center">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-3xl font-semibold">ส่งคูปองสำเร็จ!</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400">
            ระบบส่งคูปองเรียบร้อยแล้ว ผู้ใช้งานจะได้รับภายใน 5-10 นาที และสามารถตรวจสอบสถานะได้ที่หน้า History
          </p>

          <div className="mx-auto mt-6 max-w-sm rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <p className="text-5xl font-semibold text-emerald-300">{validCount}</p>
            <p className="mt-2 text-sm text-slate-300">คูปองที่ส่งสำเร็จทั้งหมด</p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={resetUpload}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              กลับสู่หน้าหลัก
            </button>
            <button
              onClick={resetUpload}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              ส่งใหม่อีกครั้ง
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
