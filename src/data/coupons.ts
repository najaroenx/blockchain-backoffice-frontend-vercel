export type CouponStatus = "active" | "upcoming" ;
// percentage = ส่วนลดแบบลด %
// cash = ส่วนลดแบบเงินสด
// gift = ของสมนาคุณ 
// multiplier = คะแนนคูณ
export type ValueType = "percentage" | "cash" | "gift" | "multiplier";

export type Coupon = {
  id: string;
  name: string;
  description: string;
  status: CouponStatus;
  merchant: string;
  valueType: ValueType;
  value: number;
  currency?: string;
  pointsCost: number;
  startDate: string;
  endDate: string;
  totalIssued: number;
  totalRedeemed: number;
  limitPerMember?: number;
  categories: string[];
};

export const coupons: Coupon[] = [
  {
    id: "CPN-CR-120",
    name: "ส่วนลด 20% ที่เซ็นทรัล รีเทล",
    description:
      "รับส่วนลด 20% เมื่อใช้จ่ายครบ 2,000 บาท ที่เซ็นทรัล, โรบินสัน หรือท็อปส์",
    status: "active",
    merchant: "Central Retail",
    valueType: "percentage",
    value: 20,
    pointsCost: 1200,
    startDate: "2024-09-01",
    endDate: "2025-12-31",
    totalIssued: 500,
    totalRedeemed: 235,
    limitPerMember: 2,
    categories: ["ห้างสรรพสินค้า", "แฟชั่น"],
  },
  {
    id: "CPN-MM-350",
    name: "คูปองเงินสด ฿350 เดอะมอลล์กรุ๊ป",
    description:
      "แลกรับคูปองเงินสดมูลค่า 350 บาท ใช้ได้กับทุกห้างในเครือเดอะมอลล์กรุ๊ป",
    status: "active",
    merchant: "The Mall Group",
    valueType: "cash",
    value: 350,
    currency: "฿",
    pointsCost: 2200,
    startDate: "2024-10-01",
    endDate: "2026-01-15",
    totalIssued: 400,
    totalRedeemed: 150,
    limitPerMember: 3,
    categories: ["ไลฟ์สไตล์", "พรีเมียม"],
  },
  {
    id: "CPN-CP-075",
    name: "ฟรีเครื่องดื่ม 1 แก้ว ที่ Café Amazon",
    description:
      "แลกรับเครื่องดื่มเมนูใดก็ได้ ขนาด 16 ออนซ์ ที่ Café Amazon ทุกสาขา",
    status: "active",
    merchant: "CP All",
    valueType: "gift",
    value: 95,
    currency: "฿",
    pointsCost: 450,
    startDate: "2024-08-15",
    endDate: "2025-11-30",
    totalIssued: 800,
    totalRedeemed: 620,
    limitPerMember: 5,
    categories: ["ร้านสะดวกซื้อ", "อาหารและเครื่องดื่ม"],
  },
  {
    id: "CPN-SP-150",
    name: "ส่วนลด 15% สยามพิวรรธน์",
    description:
      "รับส่วนลด 15% สำหรับสินค้าแฟชั่นและไลฟ์สไตล์ ที่สยามพารากอนและไอคอนสยาม",
    status: "upcoming",
    merchant: "Siam Piwat",
    valueType: "percentage",
    value: 15,
    pointsCost: 1800,
    startDate: "2024-11-10",
    endDate: "2026-02-28",
    totalIssued: 300,
    totalRedeemed: 0,
    limitPerMember: 1,
    categories: ["ลักชัวรี่", "ไลฟ์สไตล์"],
  },
  {
    id: "CPN-CRG-2X",
    name: "คูณ 2 คะแนนร้านอาหารในเครือ CRG",
    description:
      "รับคะแนนสะสมเพิ่ม 2 เท่า เมื่อรับประทานอาหารที่ร้านอาหารในเครือ CRG",
    status: "upcoming",
    merchant: "Central Restaurants Group",
    valueType: "multiplier",
    value: 2,
    pointsCost: 800,
    startDate: "2024-12-01",
    endDate: "2026-03-31",
    totalIssued: 600,
    totalRedeemed: 0,
    categories: ["อาหารและเครื่องดื่ม", "โปรโมชันพิเศษ"],
  },
  // {
  //   id: "CPN-BC-500",
  //   name: "คูปองส่วนลด ฿500 บิ๊กซี",
  //   description:
  //     "ใช้เป็นส่วนลดเพิ่ม 500 บาท เมื่อซื้อสินค้าครบ 3,000 บาทที่บิ๊กซีทุกสาขา",
  //   status: "expired",
  //   merchant: "Big C",
  //   valueType: "cash",
  //   value: 500,
  //   currency: "฿",
  //   pointsCost: 1500,
  //   startDate: "2024-05-01",
  //   endDate: "2026-08-31",
  //   totalIssued: 700,
  //   totalRedeemed: 690,
  //   limitPerMember: 2,
  //   categories: ["ซูเปอร์มาร์เก็ต"],
  // },
];
