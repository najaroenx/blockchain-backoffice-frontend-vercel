"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DEFAULT_VOUCHER_IMAGE } from "@/data/vouchers";

// Tooltip Component
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform z-50">
          <div className="min-w-[200px] max-w-[320px] rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-xl">
            {content}
            <div className="absolute left-1/2 top-full -translate-x-1/2 transform">
              <div className="border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ValueTypeData {
  values: string[];
  description: Record<string, string>;
}

interface Merchant {
  id: string;
  name: string;
  description: string;
  location: string;
  website: string;
  wallet: {
    id: string;
    walletAddress: string;
  };
  point: Array<{
    id: string;
    name: string;
    symbol: string;
  }>;
  _count: {
    vouchers: number;
    customerMerChant: number;
  };
}

interface MerchantsResponse {
  merchants: Merchant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Point {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  initialSupply: number;
  decimal: number;
  frameSize: number;
  imageUrl: string;
  merchantId: string;
  merchant: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
  _count: {
    transactions: number;
    customerPoints: number;
    voucherCodes: number;
  };
}

interface PointsResponse {
  points: Point[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CouponFormData {
  sellerWalletAddress: string;
  price: number;
  coupon: {
    name: string;
    description: string;
    status: "upcoming";
    merchantId: string;
    valueType: string;
    value: number;
    pointId: string;
    pointsCost: number;
    startDate: string;
    endDate: string;
    totalIssued: number;
    imageUrl: string;
    merchantRef: string;
  };
}

export default function CreateCouponPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valueTypes, setValueTypes] = useState<ValueTypeData | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);
  const [merchantSearch, setMerchantSearch] = useState("");
  const [showMerchantDropdown, setShowMerchantDropdown] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointSearch, setPointSearch] = useState("");
  const [showPointDropdown, setShowPointDropdown] = useState(false);

  const [formData, setFormData] = useState<CouponFormData>({
    sellerWalletAddress: "",
    price: 1000,
    coupon: {
      name: "",
      description: "",
      status: "upcoming",
      merchantId: "",
      valueType: "cash",
      value: 100,
      pointId: "",
      pointsCost: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      totalIssued: 1000,
      imageUrl: "",
      merchantRef: "",
    },
  });

  useEffect(() => {
    const fetchValueTypes = async () => {
      try {
        const response = await fetch("/api/coupon/value-types");
        if (response.ok) {
          const data = await response.json();
          setValueTypes(data);
        } else {
          console.error("Failed to fetch value types");
          // Fallback to default values
          setValueTypes({
            values: ["percentage", "cash", "gift", "multiplier", "aispoint"],
            description: {
              percentage: "Percentage discount (e.g., 10% off)",
              cash: "Cash discount (e.g., 100 THB off)",
              gift: "Free gift or item",
              multiplier: "Point multiplier (e.g., 2x points)",
              aispoint: "AIS Point redemption voucher"
            }
          });
        }
      } catch (error) {
        console.error("Error fetching value types:", error);
        // Fallback to default values
        setValueTypes({
          values: ["percentage", "cash", "gift", "multiplier", "aispoint"],
          description: {
            percentage: "Percentage discount (e.g., 10% off)",
            cash: "Cash discount (e.g., 100 THB off)",
            gift: "Free gift or item",
            multiplier: "Point multiplier (e.g., 2x points)",
            aispoint: "AIS Point redemption voucher"
          }
        });
      }
    };

    fetchValueTypes();
  }, []);

  const fetchMerchants = async (search: string = "") => {
    setMerchantsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: "50",
        page: "1",
      });
      
      if (search) {
        queryParams.append("name", search);
      }

      const response = await fetch(`/api/merchant/all?${queryParams.toString()}`);
      if (response.ok) {
        const data: MerchantsResponse = await response.json();
        setMerchants(data.merchants);
      } else {
        console.error("Failed to fetch merchants");
        setMerchants([]);
      }
    } catch (error) {
      console.error("Error fetching merchants:", error);
      setMerchants([]);
    } finally {
      setMerchantsLoading(false);
    }
  };

  const handleMerchantSearch = (value: string) => {
    setMerchantSearch(value);
    if (value.length >= 2 || value.length === 0) {
      fetchMerchants(value);
    }
  };

  const selectMerchant = (merchant: Merchant) => {
    handleInputChange("merchantId", merchant.id, true);
    setMerchantSearch(merchant.name);
    setShowMerchantDropdown(false);
    // Also fetch points for selected merchant
    fetchPoints("", merchant.id);
  };

  const fetchPoints = async (search: string = "", merchantId?: string) => {
    setPointsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: "50",
        page: "1",
      });
      
      if (search) {
        queryParams.append("name", search);
      }
      if (merchantId) {
        queryParams.append("merchantId", merchantId);
      }

      const response = await fetch(`/api/points/all?${queryParams.toString()}`);
      if (response.ok) {
        const data: PointsResponse = await response.json();
        setPoints(data.points);
      } else {
        console.error("Failed to fetch points");
        setPoints([]);
      }
    } catch (error) {
      console.error("Error fetching points:", error);
      setPoints([]);
    } finally {
      setPointsLoading(false);
    }
  };

  const handlePointSearch = (value: string) => {
    setPointSearch(value);
    if (value.length >= 2 || value.length === 0) {
      fetchPoints(value, formData.coupon.merchantId);
    }
  };

  const selectPoint = (point: Point) => {
    handleInputChange("pointId", point.id, true);
    setPointSearch(`${point.name} (${point.symbol})`);
    setShowPointDropdown(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "12345admin") {
      setIsAuthenticated(true);
    } else {
      alert("รหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number,
    isCouponField = false
  ) => {
    if (isCouponField) {
      setFormData((prev) => ({
        ...prev,
        coupon: {
          ...prev.coupon,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert dates to ISO string format
      const payload = {
        ...formData,
        coupon: {
          ...formData.coupon,
          startDate: new Date(formData.coupon.startDate).toISOString(),
          endDate: new Date(formData.coupon.endDate).toISOString(),
        },
      };

      const response = await fetch("/api/coupon/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert("สร้างคูปองสำเร็จ!");
        console.log("Created coupon:", result);
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถสร้างคูปองได้"}`);
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      alert("เกิดข้อผิดพลาดในการสร้างคูปอง");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">
            เข้าสู่ระบบสร้างคูปอง
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="กรอกรหัสผ่าน"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-600">
            marketplace
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            สร้างคูปองใหม่
          </h1>
          <p className="mt-2 text-slate-600">
            กรอกข้อมูลคูปองเพื่อเพิ่มในระบบ Marketplace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seller Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              ข้อมูลผู้ขาย
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  Wallet Address ผู้ขาย *
                  <Tooltip content="ที่อยู่กระเป๋าเงินของผู้ขายคูปอง ใช้สำหรับรับเงินจากการขาย">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="text"
                  value={formData.sellerWalletAddress}
                  onChange={(e) =>
                    handleInputChange("sellerWalletAddress", e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="0xabcdef1234567890abcdef1234567890abcdef12"
                  required
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  ราคาต่อคูปอง (THB) *
                  <Tooltip content="จำนวนเงินที่ marketplace ต้องจ่ายให้กับผู้ขายต่อคูปอง 1 ใบ">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", Number(e.target.value))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  min="0"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  ราคาที่ market ต้องจ่ายต่อ 1 คูปอง
                </p>
              </div>
            </div>
          </section>

          {/* Coupon Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              ข้อมูลคูปอง
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  ชื่อคูปอง *
                  <Tooltip content="ชื่อของคูปองที่จะแสดงให้ผู้ใช้เห็น ควรระบุให้ชัดเจนและน่าสนใจ">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="text"
                  value={formData.coupon.name}
                  onChange={(e) =>
                    handleInputChange("name", e.target.value, true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="คูปองเงินสด ฿300 ร้านเดอะมอลล์"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  คำอธิบาย *
                  <Tooltip content="รายละเอียดของคูปอง เงื่อนไขการใช้งาน และข้อจำกัดต่างๆ">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <textarea
                  value={formData.coupon.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value, true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  rows={3}
                  placeholder="แลกรับคูปองเงินสด 300 บาท ใช้ได้ที่สาขาทุกสาขา"
                  required
                />
              </div>

              <div className="relative">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  Merchant *
                  <Tooltip content="เลือกร้านค้าที่จะออกคูปอง สามารถค้นหาตามชื่อร้านได้">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="text"
                  value={merchantSearch}
                  onChange={(e) => {
                    handleMerchantSearch(e.target.value);
                    setShowMerchantDropdown(true);
                  }}
                  onFocus={() => {
                    setShowMerchantDropdown(true);
                    if (merchants.length === 0) fetchMerchants();
                  }}
                  onBlur={() => {
                    // Delay hiding to allow click on dropdown
                    setTimeout(() => setShowMerchantDropdown(false), 200);
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="ค้นหาชื่อร้านค้า..."
                  required
                />
                {showMerchantDropdown && (
                  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                    {merchantsLoading ? (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        กำลังโหลด...
                      </div>
                    ) : merchants.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        ไม่พบร้านค้า
                      </div>
                    ) : (
                      merchants.map((merchant) => (
                        <div
                          key={merchant.id}
                          onClick={() => selectMerchant(merchant)}
                          className="cursor-pointer border-b border-slate-100 px-4 py-3 hover:bg-slate-50 last:border-b-0"
                        >
                          <div className="font-medium text-slate-900">
                            {merchant.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {merchant.location} • {merchant._count.vouchers} คูปอง
                          </div>
                          <div className="text-xs text-slate-400">
                            ID: {merchant.id}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  Point Token *
                  <Tooltip content="เลือก Point Token ที่จะใช้ในการแลกคูปอง แต่ละ Point มีชื่อและ symbol เฉพาะ">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="text"
                  value={pointSearch}
                  onChange={(e) => {
                    handlePointSearch(e.target.value);
                    setShowPointDropdown(true);
                  }}
                  onFocus={() => {
                    setShowPointDropdown(true);
                    if (points.length === 0) fetchPoints("", formData.coupon.merchantId);
                  }}
                  onBlur={() => {
                    // Delay hiding to allow click on dropdown
                    setTimeout(() => setShowPointDropdown(false), 200);
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="ค้นหา Point Token..."
                  required
                />
                {showPointDropdown && (
                  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                    {pointsLoading ? (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        กำลังโหลด...
                      </div>
                    ) : points.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        ไม่พบ Point Token
                      </div>
                    ) : (
                      points.map((point) => (
                        <div
                          key={point.id}
                          onClick={() => selectPoint(point)}
                          className="cursor-pointer border-b border-slate-100 px-4 py-3 hover:bg-slate-50 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-slate-900">
                                {point.name} ({point.symbol})
                              </div>
                              <div className="text-xs text-slate-500">
                                {point.merchant.name} • {point._count.voucherCodes} คูปอง
                              </div>
                              <div className="text-xs text-slate-400">
                                Supply: {point.initialSupply.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-slate-400">
                                {point._count.transactions} ทรานแซคชั่น
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  ประเภทมูลค่า *
                  <Tooltip content="ประเภทของส่วนลด: เงินสด (จำนวนเงิน), เปอร์เซ็นต์ (%), ของขวัญ, คูณแต้ม, หรือแต้ม AIS">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <select
                  value={formData.coupon.valueType}
                  onChange={(e) =>
                    handleInputChange("valueType", e.target.value, true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  {valueTypes?.values.map((type) => {
                    const getDisplayName = (type: string) => {
                      switch (type) {
                        case "cash": return "เงินสด (Cash)";
                        case "percentage": return "เปอร์เซ็นต์ (Percentage)";
                        case "gift": return "ของขวัญ (Gift)";
                        case "multiplier": return "คูณแต้ม (Multiplier)";
                        case "aispoint": return "แต้ม AIS (AIS Point)";
                        default: return type;
                      }
                    };
                    return (
                      <option key={type} value={type}>
                        {getDisplayName(type)}
                      </option>
                    );
                  }) || <option value="cash">เงินสด (Cash)</option>}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  มูลค่า *
                  <Tooltip content="มูลค่าของส่วนลด ขึ้นอยู่กับประเภท: เงินสด (บาท), เปอร์เซ็นต์ (%), คูณแต้ม (เท่า)">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={formData.coupon.value}
                  onChange={(e) =>
                    handleInputChange("value", Number(e.target.value), true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  min="0"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  มูลค่าที่คูปองจะทำงาน
                </p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  Points Cost (End User)
                  <Tooltip content="จำนวน Point ที่ผู้ใช้ต้องจ่ายเพื่อแลกคูปอง หาก 0 = ใช้เงินซื้อ">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={formData.coupon.pointsCost}
                  onChange={(e) =>
                    handleInputChange("pointsCost", Number(e.target.value), true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  min="0"
                />
                <p className="mt-1 text-xs text-slate-500">
                  จำนวนที่ end user ซื้อด้วย point
                </p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  จำนวนที่ออก *
                  <Tooltip content="จำนวนคูปองทั้งหมดที่จะออกให้ ผู้ใช้สามารถแลกได้จนกว่าจะหมด">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={formData.coupon.totalIssued}
                  onChange={(e) =>
                    handleInputChange("totalIssued", Number(e.target.value), true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  วันที่เริ่มต้น *
                  <Tooltip content="วันที่เริ่มต้นที่ผู้ใช้สามารถแลกคูปองได้">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="date"
                  value={formData.coupon.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value, true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  วันที่สิ้นสุด *
                  <Tooltip content="วันสุดท้ายที่ผู้ใช้สามารถแลกคูปองได้">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="date"
                  value={formData.coupon.endDate}
                  onChange={(e) =>
                    handleInputChange("endDate", e.target.value, true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  Merchant Reference
                  <Tooltip content="รหัสอ้างอิงจากระบบของ Merchant สำหรับการติดตามคูปอง (ไม่จำเป็น)">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="text"
                  value={formData.coupon.merchantRef}
                  onChange={(e) =>
                    handleInputChange("merchantRef", e.target.value, true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Merchant reference code or ID"
                />
                <p className="mt-1 text-xs text-slate-500">
                  รหัสอ้างอิงจาก merchant (ถ้ามี)
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  Image URL
                  <Tooltip content="ลิงก์รูปภาพของคูปอง ควรเป็น HTTPS และรองรับการแสดงผล">
                    <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                      ?
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="url"
                  value={formData.coupon.imageUrl}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value, true)
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="https://orange-tremendous-wallaby-734.mypinata.cloud/ipfs/..."
                />
                {formData.coupon.imageUrl && (
                  <div className="mt-4 relative h-48 w-full overflow-hidden rounded-2xl border border-slate-200">
                    <Image
                      src={formData.coupon.imageUrl || DEFAULT_VOUCHER_IMAGE}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_VOUCHER_IMAGE;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-full px-6 py-3 font-semibold text-white transition ${
                isSubmitting
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {isSubmitting ? "กำลังสร้าง..." : "สร้างคูปอง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
