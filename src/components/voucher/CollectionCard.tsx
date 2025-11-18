import Image from "next/image";
import { useRecordContext } from "react-admin";
import { useState } from "react";
import {
  dateFormatter,
  formatValueLabel,
  getDaysUntil,
  statusStyles,
} from "@/app/vouchers/utils";
import type { Voucher } from "@/data/vouchers";
import { DEFAULT_VOUCHER_IMAGE } from "@/data/vouchers";

export const CollectionCard = () => {
  const record = useRecordContext<Voucher>();
  const [imageError, setImageError] = useState(false);

  if (!record) {
    return null;
  }

  const statusStyle = statusStyles[record.status] ?? statusStyles.active;
  const redemptionRate =
    record.totalIssued === 0
      ? 0
      : Math.round((record.totalRedeemed / record.totalIssued) * 100);

  // Determine which image to use
  const imageSrc = imageError || !record.imageUrl ? DEFAULT_VOUCHER_IMAGE : record.imageUrl;

  return (
    <article className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {(record.imageUrl || DEFAULT_VOUCHER_IMAGE) && (
        <div className="relative h-44 w-full overflow-hidden rounded-2xl">
          <Image
            src={imageSrc}
            alt={record.name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 40vw, 100vw"
            unoptimized
            className="object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-black/5" />
        </div>
      )}

      <span
        className={`absolute inset-x-6 top-48 h-1 rounded-full ${statusStyle.accentClass}`}
      />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {record.id}
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            {record.name}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {record.description}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.badgeClass}`}
        >
          {statusStyle.label}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            มูลค่าสิทธิประโยชน์
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatValueLabel(record)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            ใช้คะแนนแลก {record.pointsCost.toLocaleString("th-TH")} คะแนน
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            ร้านค้า
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {record.merchantName}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-200 pt-4 text-sm text-slate-600 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            จนถึงวันที่
          </p>
          <p className="mt-1 font-medium text-slate-900">
            
            {dateFormatter.format(new Date(record.endDate))}
          </p>
          {record.status === "upcoming" && (
            <p className="mt-1 text-xs text-slate-500">
              เริ่มในอีก {getDaysUntil(record.endDate)} วัน
            </p>
          )}
        </div>

        <div className="space-y-1">
          <p>
            ออกทั้งหมด {record.totalIssued.toLocaleString("th-TH")} สิทธิ์
          </p>
          <p>
            ใช้ไปแล้ว {record.totalRedeemed.toLocaleString("th-TH")} สิทธิ์ (
            {redemptionRate}%)
          </p>
          <p>
            คงเหลือ {(record.availableCount ?? 0).toLocaleString("th-TH")} สิทธิ์
          </p>
        </div>
      </div>
    </article>
  );
};
