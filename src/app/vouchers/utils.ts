// import { type Voucher, type CouponStatus } from "@/data/couponTypes";
import { CouponStatus,  } from "@/data/coupons";
import { Voucher } from "@/data/vouchers";
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

export const formatValueLabel = (voucher: Voucher) => {
  switch (voucher.valueType) {
    case "percentage":
      return `ลด ${voucher.value}%`;
    case "cash": {
      const currency = voucher.currency ?? "฿";
      return `มูลค่า ${currency}${voucher.value.toLocaleString("th-TH")}`;
    }
    case "gift": {
      const currency = voucher.currency ?? "฿";
      return `ของสมนาคุณ ${currency}${voucher.value.toLocaleString("th-TH")}`;
    }
    case "multiplier":
      return `คะแนน x${voucher.value}`;
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
