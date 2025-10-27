'use client';

import { useState } from 'react';

const merchants = [
  {
    id: 1,
    name: "เซ็นทรัล รีเทล",
    description: "ห้างสรรพสินค้า เซ็นทรัล, โรบินสัน และท็อปส์",
    imageUrl: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=2952&auto=format&fit=crop",
    points: 50000,
    location: "สาขาทั่วประเทศ",
    categories: ["ห้างสรรพสินค้า", "ซูเปอร์มาร์เก็ต"]
  },
  {
    id: 2,
    name: "เดอะมอลล์ กรุ๊ป",
    description: "เดอะมอลล์, เอ็มโพเรียม และเอ็มควอเทียร์",
    imageUrl: "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=2976&auto=format&fit=crop",
    points: 45000,
    location: "กรุงเทพฯ และปริมณฑล",
    categories: ["ห้างสรรพสินค้า", "ไลฟ์สไตล์"]
  },
  {
    id: 3,
    name: "สยามพิวรรธน์",
    description: "สยามพารากอน, สยามเซ็นเตอร์ และไอคอนสยาม",
    imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2940&auto=format&fit=crop",
    points: 40000,
    location: "เขตปทุมวัน, คลองสาน",
    categories: ["ห้างสรรพสินค้า", "ลักชัวรี่"]
  },
  {
    id: 4,
    name: "ซีพี ออลล์",
    description: "7-Eleven และ CP Freshmart",
    imageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=2940&auto=format&fit=crop",
    points: 30000,
    location: "ร้านสะดวกซื้อทั่วประเทศ",
    categories: ["ร้านสะดวกซื้อ", "อาหารและเครื่องดื่ม"]
  },
  {
    id: 5,
    name: "บิ๊กซี",
    description: "ไฮเปอร์มาร์เก็ต และซูเปอร์เซ็นเตอร์",
    imageUrl: "https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?q=80&w=2940&auto=format&fit=crop",
    points: 35000,
    location: "สาขาทั่วประเทศ",
    categories: ["ซูเปอร์มาร์เก็ต", "ไฮเปอร์มาร์เก็ต"]
  },
  {
    id: 6,
    name: "เซ็นทรัล เรสเตอรองส์ กรุ๊ป",
    description: "มิสเตอร์โดนัท, เคเอฟซี, อานตี้ แอนส์",
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2940&auto=format&fit=crop",
    points: 25000,
    location: "ร้านอาหารทั่วประเทศ",
    categories: ["ร้านอาหาร", "ฟาสต์ฟู้ด"]
  }
];

export default function MerchantPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMerchants, setSelectedMerchants] = useState<number[]>([]);

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleMerchant = (merchantId: number) => {
    setSelectedMerchants(prev =>
      prev.includes(merchantId)
        ? prev.filter(id => id !== merchantId)
        : [...prev, merchantId]
    );
  };

  const handleSubmit = () => {
    console.log('Selected merchants:', selectedMerchants);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ร้านค้าพันธมิตร</h1>
        <p className="text-gray-600 mb-4">
          เลือกร้านค้าเพื่อดูคะแนนสะสมและสิทธิประโยชน์ที่ท่านจะได้รับ
        </p>
        <input
          type="text"
          placeholder="ค้นหาร้านค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Merchant Grid */}
      {filteredMerchants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMerchants.map((merchant) => (
            <div
              key={merchant.id}
              onClick={() => handleToggleMerchant(merchant.id)}
              className={`relative cursor-pointer bg-white rounded-xl overflow-hidden shadow transition-transform duration-200 
                ${selectedMerchants.includes(merchant.id)
                  ? 'ring-2 ring-blue-500 scale-95'
                  : 'hover:scale-105 hover:shadow-lg'
                }`}
            >
              {/* Check Badge */}
              <div
                className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center 
                  ${selectedMerchants.includes(merchant.id)
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-transparent'
                  }`}
              >
                ✓
              </div>

              <img
                src={merchant.imageUrl}
                alt={merchant.name}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{merchant.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{merchant.description}</p>
                <p className="text-sm text-gray-600 mt-1">📍 {merchant.location}</p>

                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                  {merchant.categories.map((cat, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <p className="text-blue-600 font-bold text-base">
                  🎁 {merchant.points.toLocaleString()} คะแนน
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8 text-lg">
          ไม่พบร้านค้าที่ตรงกับการค้นหา
        </p>
      )}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 flex items-center justify-center gap-4 shadow-md">
        <span className="text-gray-700">เลือกร้านค้าแล้ว {selectedMerchants.length} ร้าน</span>
        <button
          onClick={handleSubmit}
          disabled={selectedMerchants.length === 0}
          className={`min-w-[180px] px-6 py-2 rounded-lg text-white font-semibold 
            ${selectedMerchants.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          ยืนยันการเลือก
        </button>
      </div>

      {/* Spacer */}
      <div className="h-20" />
    </div>
  );
}
