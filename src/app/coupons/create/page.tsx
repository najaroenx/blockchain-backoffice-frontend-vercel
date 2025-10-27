import Link from "next/link";

import CouponCreateForm from "@/components/coupons/CouponCreateForm";

export default function CreateCouponPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-[0.25em]">
            rewards
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">สร้างคูปองใหม่</h1>
          <p className="text-slate-600 max-w-2xl">
            กำหนดข้อมูลคูปองใหม่ ตั้งแต่รายละเอียดร้านค้า ประเภทสิทธิประโยชน์ ไปจนถึงช่วงเวลาและคะแนนที่ต้องใช้แลก
          </p>
        </div>
        <Link
          href="/coupons"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          ← กลับไปหน้าคูปอง
        </Link>
      </header>

      <CouponCreateForm showPreview />
    </div>
  );
}
