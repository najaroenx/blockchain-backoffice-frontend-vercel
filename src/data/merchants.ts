export type Merchant = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  points: number;
  location: string;
  categories: string[];
  website: string;
  voucherIds: string[];
};

export const merchants: Merchant[] = [
  {
    id: "central-retail",
    name: "เซ็นทรัล รีเทล",
    description: "ห้างสรรพสินค้า เซ็นทรัล, โรบินสัน และท็อปส์",
    imageUrl:
      "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=2952&auto=format&fit=crop",
    points: 50000,
    location: "สาขาทั่วประเทศ",
    categories: ["ห้างสรรพสินค้า", "ซูเปอร์มาร์เก็ต"],
    website: "https://www.centralretail.com",
    voucherIds: ["VCH-CR-20", "VCH-CR-BONUS"],
  },
  {
    id: "the-mall-group",
    name: "เดอะมอลล์ กรุ๊ป",
    description: "เดอะมอลล์, เอ็มโพเรียม และเอ็มควอเทียร์",
    imageUrl:
      "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=2976&auto=format&fit=crop",
    points: 45000,
    location: "กรุงเทพฯ และปริมณฑล",
    categories: ["ห้างสรรพสินค้า", "ไลฟ์สไตล์"],
    website: "https://www.themallgroup.com",
    voucherIds: ["VCH-MALL-350", "VCH-MALL-DINE"],
  },
  {
    id: "siam-piwat",
    name: "สยามพิวรรธน์",
    description: "สยามพารากอน, สยามเซ็นเตอร์ และไอคอนสยาม",
    imageUrl:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2940&auto=format&fit=crop",
    points: 40000,
    location: "เขตปทุมวัน, คลองสาน",
    categories: ["ห้างสรรพสินค้า", "ลักชัวรี่"],
    website: "https://www.siampiwat.com",
    voucherIds: ["VCH-SP-15", "VCH-SP-VIP"],
  },
  {
    id: "cp-all",
    name: "ซีพี ออลล์",
    description: "7-Eleven และ CP Freshmart",
    imageUrl:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=2940&auto=format&fit=crop",
    points: 30000,
    location: "ร้านสะดวกซื้อทั่วประเทศ",
    categories: ["ร้านสะดวกซื้อ", "อาหารและเครื่องดื่ม"],
    website: "https://www.cpall.co.th",
    voucherIds: ["VCH-CP-DRINK", "VCH-CP-POINTX2"],
  },
  {
    id: "big-c",
    name: "บิ๊กซี",
    description: "ไฮเปอร์มาร์เก็ต และซูเปอร์เซ็นเตอร์",
    imageUrl:
      "https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?q=80&w=2940&auto=format&fit=crop",
    points: 35000,
    location: "สาขาทั่วประเทศ",
    categories: ["ซูเปอร์มาร์เก็ต", "ไฮเปอร์มาร์เก็ต"],
    website: "https://www.bigc.co.th",
    voucherIds: ["VCH-BIGC-500", "VCH-BIGC-FRESH"],
  },
  {
    id: "crg",
    name: "เซ็นทรัล เรสเตอรองส์ กรุ๊ป",
    description: "มิสเตอร์โดนัท, เคเอฟซี, อานตี้ แอนส์",
    imageUrl:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2940&auto=format&fit=crop",
    points: 25000,
    location: "ร้านอาหารทั่วประเทศ",
    categories: ["ร้านอาหาร", "ฟาสต์ฟู้ด"],
    website: "https://www.crg.co.th",
    voucherIds: ["VCH-CRG-SET", "VCH-CRG-POINTX3"],
  },
];
