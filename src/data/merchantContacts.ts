export type MerchantContact = {
  name: string;
  contact: string;
  role: string;
  phone: string;
  email: string;
  accountManager: string;
  lastInteraction: string;
  imageUrl?: string;
};

export const merchantContacts: MerchantContact[] = [
  {
    name: "เซ็นทรัล รีเทล",
    contact: "คุณพิมพ์ชนก วงศ์สุวรรณ",
    role: "Partnership Manager",
    phone: "02-201-0000",
    email: "partnership@centralretail.co.th",
    accountManager: "คุณอรพิชญ์ ศรีสมบัติ",
    lastInteraction: "อัปเดตเมื่อ 2 ชม. ที่แล้ว",
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "เดอะมอลล์ กรุ๊ป",
    contact: "คุณณัฐวุฒิ ปิติสร",
    role: "Onboarding Specialist",
    phone: "02-310-1000",
    email: "nattawut@themallgroup.com",
    accountManager: "คุณพรนลิน พูนทรัพย์",
    lastInteraction: "สนทนาล่าสุดเมื่อวานนี้",
    imageUrl:
      "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "ซีพี ออลล์",
    contact: "คุณอริสา วัฒนรักษ์",
    role: "Account Executive",
    phone: "02-711-7000",
    email: "arisa@cpall.co.th",
    accountManager: "คุณกิตติศักดิ์ หาญวงศ์",
    lastInteraction: "ติดตามผลเมื่อ 3 วันก่อน",
    imageUrl:
      "https://images.unsplash.com/photo-1481887328591-3e277f9473dc?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "สยามพิวรรธน์",
    contact: "คุณพิชญ์สินี กิตติชัย",
    role: "Key Account Manager",
    phone: "02-610-8000",
    email: "pitchsinee@siampiwat.com",
    accountManager: "คุณสุนิสา อนุวงศ์",
    lastInteraction: "อัปเดตเมื่อ 45 นาทีที่ผ่านมา",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "เซ็นทรัล เรสเตอรองส์ กรุ๊ป",
    contact: "คุณศศิกานต์ ธนรัตน์",
    role: "Partner Success",
    phone: "02-706-8800",
    email: "sasikarn@crg.co.th",
    accountManager: "คุณธิติพงศ์ อนันต์",
    lastInteraction: "โทรติดตาม 1 ชม. ที่แล้ว",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=300&auto=format&fit=crop",
  },
];
