
export type VoucherStatus = "active" | "upcoming";

export type ValueType = "percentage" | "cash" | "gift" | "multiplier";

export type Voucher = {
  id: string;
  name: string;
  description: string;
  status: VoucherStatus;
  merchant: string;
  valueType: ValueType;
  value: number;
  currency?: string;
  pointsCost: number;
  startDate: string;
  endDate: string;
  totalIssued: number;
  totalRedeemed: number;
  merchantId: string;
  imageUrl?: string;
};


export const vouchers: Voucher[] = [
  {
    id: "VCH-CR-20",
    name: "ส่วนลด 20% เซ็นทรัล รีเทล",
    description:
      "รับส่วนลด 20% เมื่อใช้จ่ายครบ 2,000 บาท ที่เซ็นทรัล, โรบินสัน หรือท็อปส์",
    status: "active",
    merchant: "เซ็นทรัล รีเทล",
    merchantId: "central-retail",
    imageUrl:
      "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1600&auto=format&fit=crop",
    valueType: "percentage",
    value: 20,
    pointsCost: 1200,
    startDate: "2024-09-01",
    endDate: "2025-12-31",
    totalIssued: 500,
    totalRedeemed: 235,
  },
  {
    id: "VCH-CR-BONUS",
    name: "บัตรของขวัญ ฿500 เซ็นทรัล",
    description: "แลกรับบัตรของขวัญมูลค่า 500 บาท ใช้ได้ทุกสาขาในเครือเซ็นทรัล",
    status: "upcoming",
    merchant: "เซ็นทรัล รีเทล",
    merchantId: "central-retail",
    imageUrl:
      "https://images.unsplash.com/photo-1517677129300-07b130802f46?q=80&w=1600&auto=format&fit=crop",
    valueType: "cash",
    value: 500,
    currency: "฿",
    pointsCost: 2600,
    startDate: "2025-01-05",
    endDate: "2026-03-31",
    totalIssued: 350,
    totalRedeemed: 0,
  },
  {
    id: "VCH-MALL-350",
    name: "คูปองเงินสด ฿350 เดอะมอลล์",
    description:
      "แลกรับคูปองเงินสด 350 บาท ใช้ได้กับห้างในเครือเดอะมอลล์กรุ๊ปทุกสาขา",
    status: "active",
    merchant: "เดอะมอลล์ กรุ๊ป",
    merchantId: "the-mall-group",
    imageUrl:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop",
    valueType: "cash",
    value: 350,
    currency: "฿",
    pointsCost: 2200,
    startDate: "2024-10-01",
    endDate: "2026-01-15",
    totalIssued: 400,
    totalRedeemed: 150,
  },
  {
    id: "VCH-MALL-DINE",
    name: "เครดิตร้านอาหาร ฿300",
    description:
      "รับเครดิตสำหรับใช้ที่ Food Hall และร้านอาหารในเครือเดอะมอลล์กรุ๊ป",
    status: "upcoming",
    merchant: "เดอะมอลล์ กรุ๊ป",
    merchantId: "the-mall-group",
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop",
    valueType: "cash",
    value: 300,
    currency: "฿",
    pointsCost: 1600,
    startDate: "2024-12-15",
    endDate: "2026-06-30",
    totalIssued: 280,
    totalRedeemed: 0,
  },
  {
    id: "VCH-CP-DRINK",
    name: "ฟรีเครื่องดื่ม 1 แก้ว Café Amazon",
    description:
      "แลกฟรีเครื่องดื่มเมนูใดก็ได้ ขนาด 16 ออนซ์ ที่ Café Amazon ทุกสาขา",
    status: "active",
    merchant: "ซีพี ออลล์",
    merchantId: "cp-all",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1600&auto=format&fit=crop",
    valueType: "gift",
    value: 95,
    currency: "฿",
    pointsCost: 450,
    startDate: "2024-08-15",
    endDate: "2025-11-30",
    totalIssued: 800,
    totalRedeemed: 620,
  },
  {
    id: "VCH-CP-POINTX2",
    name: "คูณ 2 คะแนนซื้อของใน 7-Eleven",
    description:
      "รับคะแนนสะสมเพิ่ม 2 เท่าเมื่อซื้อสินค้าครบ 150 บาทขึ้นไปที่ 7-Eleven",
    status: "upcoming",
    merchant: "ซีพี ออลล์",
    merchantId: "cp-all",
    imageUrl:
      "https://images.unsplash.com/photo-1515008736322-38f085873a1a?q=80&w=1600&auto=format&fit=crop",
    valueType: "multiplier",
    value: 2,
    pointsCost: 700,
    startDate: "2025-02-01",
    endDate: "2025-12-31",
    totalIssued: 1200,
    totalRedeemed: 0,
  },
  {
    id: "VCH-SP-15",
    name: "ส่วนลด 15% สยามพิวรรธน์",
    description:
      "รับส่วนลด 15% สำหรับสินค้าแฟชั่นและไลฟ์สไตล์ ที่สยามพารากอนและไอคอนสยาม",
    status: "upcoming",
    merchant: "สยามพิวรรธน์",
    merchantId: "siam-piwat",
    imageUrl:
      "https://images.unsplash.com/photo-1522228115018-d838bcce5c3a?q=80&w=1600&auto=format&fit=crop",
    valueType: "percentage",
    value: 15,
    pointsCost: 1800,
    startDate: "2024-11-10",
    endDate: "2026-02-28",
    totalIssued: 300,
    totalRedeemed: 0,
  },
  {
    id: "VCH-SP-VIP",
    name: "บัตร Lounge Access ICONSIAM",
    description:
      "สิทธิ์เข้าร่วมคลับเลาจน์ ICONSIAM พร้อมเครื่องดื่มต้อนรับสำหรับ 2 ท่าน",
    status: "active",
    merchant: "สยามพิวรรธน์",
    merchantId: "siam-piwat",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
    valueType: "gift",
    value: 1,
    pointsCost: 4800,
    startDate: "2024-07-01",
    endDate: "2025-07-31",
    totalIssued: 180,
    totalRedeemed: 90,
  },
  {
    id: "VCH-BIGC-500",
    name: "ส่วนลด ฿500 บิ๊กซี",
    description:
      "ใช้เป็นส่วนลด 500 บาท เมื่อซื้อสินค้าครบ 3,000 บาทที่บิ๊กซีทุกสาขา",
    status: "active",
    merchant: "บิ๊กซี",
    merchantId: "big-c",
    imageUrl:
      "https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?q=80&w=1600&auto=format&fit=crop",
    valueType: "cash",
    value: 500,
    currency: "฿",
    pointsCost: 1500,
    startDate: "2024-05-01",
    endDate: "2025-08-31",
    totalIssued: 700,
    totalRedeemed: 540,
  },
  {
    id: "VCH-BIGC-FRESH",
    name: "ส่วนลด 12% สินค้า Fresh Food",
    description:
      "ส่วนลด 12% สำหรับสินค้ากลุ่มอาหารสดและของใช้ในครัวเรือนที่บิ๊กซี",
    status: "upcoming",
    merchant: "บิ๊กซี",
    merchantId: "big-c",
    imageUrl:
      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?q=80&w=1600&auto=format&fit=crop",
    valueType: "percentage",
    value: 12,
    pointsCost: 900,
    startDate: "2025-01-10",
    endDate: "2025-12-31",
    totalIssued: 650,
    totalRedeemed: 0,
  },
  {
    id: "VCH-CRG-SET",
    name: "เซ็ตมื้อใหญ่ CRG",
    description:
      "ชุดคอมโบสำหรับ 2 ท่าน ใช้ได้ที่ร้านอาหารในเครือ CRG (KFC, Mister Donut, Ootoya)",
    status: "active",
    merchant: "เซ็นทรัล เรสเตอรองส์ กรุ๊ป",
    merchantId: "crg",
    imageUrl:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600&auto=format&fit=crop",
    valueType: "gift",
    value: 499,
    currency: "฿",
    pointsCost: 1800,
    startDate: "2024-06-01",
    endDate: "2025-06-30",
    totalIssued: 550,
    totalRedeemed: 310,
  },
  {
    id: "VCH-CRG-POINTX3",
    name: "คูณ 3 คะแนนร้านอาหารเครือ CRG",
    description:
      "รับคะแนนสะสมเพิ่ม 3 เท่า เมื่อรับประทานอาหารครบ 500 บาทขึ้นไปในเครือ CRG",
    status: "upcoming",
    merchant: "เซ็นทรัล เรสเตอรองส์ กรุ๊ป",
    merchantId: "crg",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
    valueType: "multiplier",
    value: 3,
    pointsCost: 950,
    startDate: "2025-03-01",
    endDate: "2025-12-31",
    totalIssued: 900,
    totalRedeemed: 0,
  },
];
