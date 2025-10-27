import { type Coupon, type CouponStatus } from "@/data/coupons";

export const statusStyles: Record<
  CouponStatus,
  { label: string; badgeClass: string; accentClass: string }
> = {
  active: {
    label: "กำลังใช้งาน",
    badgeClass: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    accentClass: "bg-emerald-500",
  },
  upcoming: {
    label: "เตรียมเปิด",
    badgeClass: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200",
    accentClass: "bg-indigo-500",
  },
};

export const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const formatValueLabel = (coupon: Coupon) => {
  switch (coupon.valueType) {
    case "percentage":
      return `ลด ${coupon.value}%`;
    case "cash": {
      const currency = coupon.currency ?? "฿";
      return `มูลค่า ${currency}${coupon.value.toLocaleString("th-TH")}`;
    }
    case "gift": {
      const currency = coupon.currency ?? "฿";
      return `ของสมนาคุณ ${currency}${coupon.value.toLocaleString("th-TH")}`;
    }
    case "multiplier":
      return `คะแนน x${coupon.value}`;
    default:
      return "";
  }
};

export const getDaysUntil = (date: string) => {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
