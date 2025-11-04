import Link from "next/link";
import { notFound } from "next/navigation";

import { merchants } from "@/data/merchants";
import { vouchers } from "@/data/vouchers";
import {
  dateFormatter,
  formatValueLabel,
  statusStyles,
} from "@/app/vouchers/utils";

type MerchantDetailPageProps = {
  params: {
    id: string;
  };
};

export default function MerchantDetailPage({ params }: MerchantDetailPageProps) {
  const merchant = merchants.find((item) => item.id === params.id);

  if (!merchant) {
    notFound();
  }

  const relatedMerchants = merchants.filter((item) => item.id !== params.id);
  const merchantVouchers = vouchers.filter(
    (voucher) => voucher.merchantId === merchant.id
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-600">
            partner insight
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {merchant.name}
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">{merchant.description}</p>
          <p className="mt-3 text-sm text-blue-600">
            <a
              href={merchant.website}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {merchant.website}
            </a>
          </p>
        </div>
        <Link
          href="/merchart"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          ← กลับไปหน้าร้านค้าทั้งหมด
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <img
          src={merchant.imageUrl}
          alt={merchant.name}
          className="h-80 w-full object-cover sm:h-[420px]"
        />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                พื้นที่ให้บริการ
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {merchant.location}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                คูปองที่ร่วมรายการ
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {merchantVouchers.length.toLocaleString("th-TH")} รายการ
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              หมวดหมู่หลักของร้านค้า
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {merchant.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            อยากเปิดคูปองกับร้านค้านี้?
          </p>
          <p className="text-sm text-slate-600">
            ดูรายละเอียดและสร้างคูปองจากพาร์ตเนอร์รายนี้ต่อในขั้นตอนถัดไป
          </p>
          <Link
            href={`/vouchers/select?merchantId=${merchant.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
          >
            ไปเลือก Voucher กับ {merchant.name}
            <span aria-hidden className="text-base">
              →
            </span>
          </Link>
        </aside>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          คูปองและสิทธิพิเศษจาก {merchant.name}
        </h2>
        {merchantVouchers.length === 0 ? (
          <p className="text-sm text-slate-500">
            ร้านค้ายังไม่มีคูปองหรือสิทธิพิเศษในขณะนี้
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {merchantVouchers.map((voucher) => {
              const status = statusStyles[voucher.status];
              const redeemedRatio =
                voucher.totalIssued === 0
                  ? 0
                  : Math.round(
                      (voucher.totalRedeemed / voucher.totalIssued) * 100
                    );

              return (
                <article
                  key={voucher.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-40 w-full">
                    <img
                      src={voucher.imageUrl}
                      alt={voucher.name}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className={`absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-semibold ${status.badgeClass}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        {voucher.id}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">
                        {voucher.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {voucher.description}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          มูลค่าสิทธิประโยชน์
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                          {formatValueLabel(voucher)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {voucher.pointsCost.toLocaleString("th-TH")} คะแนน
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          จนกระทั้ง
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                          
                          {dateFormatter.format(new Date(voucher.endDate))}
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                          ใช้ไปแล้ว {redeemedRatio}% ของสิทธิ์ทั้งหมด
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {relatedMerchants.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              ร้านค้าอื่นที่น่าสนใจ
            </h2>
            <Link
              href="/merchart"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ดูทั้งหมด
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedMerchants.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                href={`/merchart/${item.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-20 w-20 overflow-hidden rounded-xl">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                    {item.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                    ดูรายละเอียด →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
