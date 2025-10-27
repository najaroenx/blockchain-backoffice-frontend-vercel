"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type MerchantStatus = "active" | "onboarding" | "draft";

type Merchant = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  status: MerchantStatus;
  contact: string;
  phone: string;
  email: string;
  joinedAt: string;
  couponCount: number;
  lastUpdated: string;
};

const merchants: Merchant[] = [
  {
    id: "mch-ari-001",
    name: "Salt //",
    category: "ร้านอาหารและบาร์",
    imageUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1970&auto=format&fit=crop",
    status: "active",
    contact: "คุณพิมพ์ชนก (Partnership Manager)",
    phone: "02-279-4499",
    email: "partnership@saltbangkok.com",
    joinedAt: "15 ก.ย. 2024",
    couponCount: 8,
    lastUpdated: "2 ชม. ที่แล้ว",
  },
  {
    id: "mch-ari-002",
    name: "ThongSmith – La Villa Ari",
    category: "ร้านอาหารและเครื่องดื่ม",
    imageUrl:
      "https://images.unsplash.com/photo-1447078806655-40579c2520d6?q=80&w=1970&auto=format&fit=crop",
    status: "onboarding",
    contact: "คุณณัฐวุฒิ (Onboarding Specialist)",
    phone: "02-613-9626",
    email: "nattawut@thongsmith.co.th",
    joinedAt: "28 ก.ย. 2024",
    couponCount: 5,
    lastUpdated: "เมื่อวานนี้",
  },
  {
    id: "mch-ari-003",
    name: "Hor-Nok-Hook Café",
    category: "คาเฟ่และเบเกอรี่",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1970&auto=format&fit=crop",
    status: "draft",
    contact: "คุณอริสา (Account Executive)",
    phone: "02-279-2114",
    email: "arisa@hornokhookcafe.com",
    joinedAt: "รอดำเนินการ",
    couponCount: 0,
    lastUpdated: "5 วัน ที่แล้ว",
  },
  {
    id: "mch-ari-004",
    name: "Paper Butter & The Burger",
    category: "ร้านอาหารและเครื่องดื่ม",
    imageUrl:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1970&auto=format&fit=crop",
    status: "active",
    contact: "คุณพิชญ์สินี (Key Account Manager)",
    phone: "02-271-3536",
    email: "pitchsinee@paperbutterburger.co.th",
    joinedAt: "9 ก.ย. 2024",
    couponCount: 10,
    lastUpdated: "30 นาที ที่แล้ว",
  },
  {
    id: "mch-ari-005",
    name: "After You Dessert Café – La Villa",
    category: "คาเฟ่และขนมหวาน",
    imageUrl:
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1970&auto=format&fit=crop",
    status: "active",
    contact: "คุณพราว (Partnership Lead)",
    phone: "02-613-0586",
    email: "partnership@afteryoudessertcafe.com",
    joinedAt: "2 ก.ค. 2024",
    couponCount: 18,
    lastUpdated: "12 นาที ที่แล้ว",
  },
  {
    id: "mch-ari-006",
    name: "Absolute You – Ari",
    category: "ฟิตเนส & เวลเนส",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1970&auto=format&fit=crop",
    status: "onboarding",
    contact: "คุณศศิกานต์ (Partner Success)",
    phone: "02-619-4030",
    email: "sasikarn@absoluteyou.com",
    joinedAt: "12 ก.ย. 2024",
    couponCount: 4,
    lastUpdated: "3 ชม. ที่แล้ว",
  },
  {
    id: "mch-ari-007",
    name: "Porcupine Café",
    category: "คาเฟ่และไลฟ์สไตล์",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1970&auto=format&fit=crop",
    status: "draft",
    contact: "คุณธิติพงศ์ (Partnership Coordinator)",
    phone: "02-619-2244",
    email: "thitiphong@porcupinecafe.com",
    joinedAt: "รอดำเนินการ",
    couponCount: 0,
    lastUpdated: "1 สัปดาห์ ที่แล้ว",
  },
  {
    id: "mch-ari-008",
    name: "Glow & Grace Spa",
    category: "สุขภาพและความงาม",
    imageUrl:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1970&auto=format&fit=crop",
    status: "onboarding",
    contact: "คุณศศิกานต์ (Partner Success)",
    phone: "02-789-2200",
    email: "sasikarn@glowgrace.co.th",
    joinedAt: "18 ก.ย. 2024",
    couponCount: 3,
    lastUpdated: "3 ชม. ที่แล้ว",
  },
];

const statusConfig: Record<
  MerchantStatus,
  { label: string; badge: string; dot: string }
> = {
  active: {
    label: "เปิดใช้งาน",
    badge: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  onboarding: {
    label: "กำลังออนบอร์ด",
    badge: "bg-indigo-50 text-indigo-600",
    dot: "bg-indigo-500",
  },
  draft: {
    label: "รอดำเนินการ",
    badge: "bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
  },
};

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<MerchantStatus | "all">("all");

  const filteredMerchants = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return merchants.filter((merchant) => {
      const matchesStatus =
        statusFilter === "all" || merchant.status === statusFilter;
      const matchesQuery =
        query.length === 0 ||
        merchant.name.toLowerCase().includes(query) ||
        merchant.category.toLowerCase().includes(query) ||
        merchant.contact.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [searchTerm, statusFilter]);

  const totals = useMemo(() => {
    const base = { all: merchants.length, active: 0, onboarding: 0, draft: 0 };
    merchants.forEach((merchant) => {
      base[merchant.status] += 1;
    });
    return base;
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          marketplace onboarding
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          ร้านค้าที่ร่วมรายการ
        </h1>
        <p className="text-slate-600">
          รวมพาร์ตเนอร์ที่อยู่ในระบบตลาดกลางของเรา ตรวจสอบสถานะการออนบอร์ด
          ช่องทางติดต่อ และจำนวนคูปองที่พร้อมจำหน่ายได้จากหน้านี้
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">ร้านค้าทั้งหมด</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {totals.all}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">เปิดใช้งานแล้ว</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {totals.active}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">อยู่ระหว่างออนบอร์ด</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {totals.onboarding + totals.draft}
          </p>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "active", "onboarding", "draft"] as const).map((status) => {
            const label =
              status === "all"
                ? `ทั้งหมด (${totals.all})`
                : `${statusConfig[status].label} (${totals[status]})`;
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() =>
                  setStatusFilter(status === "all" ? "all" : status)
                }
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isSelected
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="ค้นหาร้านค้า หรือผู้ติดต่อ..."
            className="w-72 rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-sm text-slate-700 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            🔍
          </span>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            รายการร้านค้าที่ออนบอร์ดแล้ว
          </h2>
          <Link
            href="/marketplace/product"
            className="text-sm font-semibold text-blue-600 hover:text-blue-500"
          >
            ดูตัวอย่างหน้า Product →
          </Link>
        </div>

        {filteredMerchants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center text-slate-500">
            <p className="text-lg font-medium">ไม่พบร้านค้าที่ตรงกับการค้นหา</p>
            <p className="mt-2 text-sm">
              ลองปรับการค้นหาหรือลองเลือกดูสถานะอื่น
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="flex flex-wrap items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200">
                  <Image
                    src={merchant.imageUrl}
                    alt={merchant.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex min-w-[260px] flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {merchant.name}
                    </h3>
                    <span
                      className={[
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                        statusConfig[merchant.status].badge,
                      ].join(" ")}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusConfig[merchant.status].dot}`}
                      />
                      {statusConfig[merchant.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{merchant.category}</p>
                  <p className="text-xs text-slate-500">
                    เข้าร่วมเมื่อ {merchant.joinedAt}
                  </p>
                </div>

                <div className="flex flex-1 flex-col gap-2 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">ผู้ติดต่อ</p>
                  <p>
                    {merchant.contact}
                    <br />
                    โทร. {merchant.phone}
                    <br />
                    {merchant.email}
                  </p>
                </div>

                <div className="flex flex-1 flex-col items-start gap-2">
                  <p className="text-sm font-semibold text-slate-800">
                    คูปองในระบบ
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {merchant.couponCount}
                  </p>
                  <p className="text-xs text-slate-500">
                    อัปเดตล่าสุด {merchant.lastUpdated}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/marketplace/id=${merchant.id}`}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    รายละเอียด
                  </Link>
                  <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg">
                    จัดการคูปอง
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
