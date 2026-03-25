"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMerchantId } from "@/app/dlt/contexts/merchantContext";
import { useSelectedProduct } from "@/app/dlt/contexts/selectedProductContext";
import {
  useMarketplaceProduct,
  useBuyFromSeller,
  MarketplaceProduct,
} from "@/app/dlt/hooks/useMarketplace";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

interface SuggestedProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  discount?: number;
}

const suggestedProducts: SuggestedProduct[] = [
  {
    id: "SP001",
    name: "คูปองเงินสด ฿500",
    imageUrl:
      "https://orange-tremendous-wallaby-734.mypinata.cloud/ipfs/bafybeiayszsene326vriyfnnvnydefjccg7h23dg27lqlmalhlxh66q6py",
    price: 450,
    originalPrice: 500,
    discount: 10,
  },
  {
    id: "SP002",
    name: "AIS Point 200",
    imageUrl:
      "https://www.ais.th/content/dam/ais/consumer/content/campaign/ais-with-tat/ais-point-logo-with-shadow.png",
    price: 180,
    originalPrice: 200,
    discount: 10,
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ merchantId: string; productId: string }>;
}) {
  const { productId } = use(params);
  const merchantId = useMerchantId();
  const { selectedProduct } = useSelectedProduct();

  // Fetch from API if no product in context
  const { product: fetchedProduct, isLoading: isFetching } =
    useMarketplaceProduct(
      merchantId || "",
      selectedProduct ? "" : productId // Only fetch if no context data
    );

  // Buy hook
  const { buyFromSeller, isBuying, buyError, buyResult } = useBuyFromSeller(
    merchantId || ""
  );

  // Use context data or fetched data
  const product: MarketplaceProduct | null = selectedProduct || fetchedProduct;
  const isLoading = !selectedProduct && isFetching;

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [purchaseStatus, setPurchaseStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [purchaseMessage, setPurchaseMessage] = useState("");

  const FREE_SHIPPING_THRESHOLD = 500;

  const handleBuyNow = () => {
    setCartQuantity(quantity);
    setIsCartOpen(true);
    setPurchaseStatus("idle");
    setPurchaseMessage("");
  };

  const handleCheckout = async () => {
    if (!product) return;

    try {
      const result = await buyFromSeller({
        listingId: product.listingId,
        amount: cartQuantity,
      });

      if (result?.status === "success") {
        setPurchaseStatus("success");
        setPurchaseMessage("ซื้อสินค้าสำเร็จ!");
      } else {
        setPurchaseStatus("error");
        setPurchaseMessage(result?.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      setPurchaseStatus("error");
      setPurchaseMessage(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาด"
      );
    }
  };

  const subtotal = product ? product.price * cartQuantity : 0;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  console.log("selected prduct:", product);
  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-600 text-lg">กำลังโหลดข้อมูลสินค้า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              ตะกร้าสินค้า ({cartQuantity})
            </h2>
            <Link href="#" className="text-sm text-blue-600 hover:underline">
              ดูตะกร้า
            </Link>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-4 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <LocalShippingIcon className="w-4 h-4" />
            {amountToFreeShipping > 0 ? (
              <span>
                อีก ฿{amountToFreeShipping.toLocaleString()} จัดส่งฟรี!
              </span>
            ) : (
              <span className="text-green-600 font-medium">
                คุณได้รับสิทธิ์จัดส่งฟรี!
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Main Cart Item */}
          <div className="flex gap-4 pb-4 border-b border-gray-100">
            <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500">
                ประเภท: {product.valueType === "cash" ? "เงินสด" : "AIS Point"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-bold text-purple-600">
                  ฿{product.price.toLocaleString()}
                </span>
              </div>
              {/* Quantity Selector */}
              <div className="flex items-center mt-2">
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">
                  <span>{cartQuantity}</span>
                  <KeyboardArrowDownIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Frequently Bought Together */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              สินค้าแนะนำ
            </h3>
            <div className="space-y-4">
              {suggestedProducts.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-gray-900 line-clamp-2">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-purple-600">
                        ฿{item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            ฿{item.originalPrice.toLocaleString()}
                          </span>
                          {item.discount && (
                            <span className="text-xs font-bold text-red-500">
                              {item.discount}% OFF
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-800 text-gray-800 text-xs font-medium rounded hover:bg-gray-100 transition-colors whitespace-nowrap">
                    เพิ่มลงตะกร้า
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
          {/* Purchase Status */}
          {purchaseStatus !== "idle" && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                purchaseStatus === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {purchaseStatus === "success" ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                <ErrorIcon className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{purchaseMessage}</span>
            </div>
          )}

          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">รวมทั้งหมด:</span>
            <span className="text-lg font-bold text-gray-900">
              ฿{subtotal.toLocaleString()}
            </span>
          </div>

          {/* Payment Button */}
          <button
            onClick={handleCheckout}
            disabled={isBuying || purchaseStatus === "success"}
            className={`w-full py-3 font-bold rounded-full transition-colors flex items-center justify-center gap-2 ${
              purchaseStatus === "success"
                ? "bg-green-600 text-white cursor-not-allowed"
                : isBuying
                ? "bg-purple-400 text-white cursor-wait"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isBuying ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังดำเนินการ...
              </>
            ) : purchaseStatus === "success" ? (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                ซื้อสำเร็จ!
              </>
            ) : (
              "ชำระเงิน"
            )}
          </button>

          {/* Free Shipping Note */}
          <p className="text-center text-sm text-gray-500">
            จัดส่งฟรีสำหรับคำสั่งซื้อ ฿
            {FREE_SHIPPING_THRESHOLD.toLocaleString()}+
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            href={`/dlt/merchant/${merchantId}/marketplace`}
            className="hover:text-purple-600 flex items-center gap-1"
          >
            <ArrowBackIcon className="w-4 h-4" />
            กลับ
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate">{product.name}</span>
        </div>
      </div>

      {/* Main Product Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
            </div>

            {/* Value Type Badge */}
            <span
              className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold ${
                product.valueType === "cash"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.valueType === "cash" ? "คูปองเงินสด" : "AIS Point"}
            </span>

            {/* New Badge */}
            {product.isNew && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                ใหม่
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-purple-50 to-transparent p-6 rounded-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-purple-600">
                  ฿{product.price.toLocaleString()}
                </span>
                <span className="text-lg text-gray-500">
                  / มูลค่า {product.value}{" "}
                  {product.valueType === "cash" ? "บาท" : "Point"}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <InventoryIcon className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">จำนวนคงเหลือ</p>
                  <p className="font-semibold text-gray-900">
                    {product.stock} ชิ้น
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <CalendarTodayIcon className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">หมดอายุ</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(product.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  จำนวน:
                </span>
                <div className="flex items-center gap-2 border border-gray-300 rounded-full px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <AddIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors text-lg"
                >
                  ซื้อเลย
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-4 border-2 border-gray-200 rounded-full hover:border-purple-600 transition-colors"
                >
                  {isFavorite ? (
                    <FavoriteIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <FavoriteBorderIcon className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {["details", "terms"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "details" ? "รายละเอียด" : "เงื่อนไขการใช้งาน"}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === "details" && (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                รายละเอียดสินค้า
              </h3>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    ข้อมูลสินค้า
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      <span className="font-medium">รหัสสินค้า:</span>{" "}
                      {product.listingId}
                    </li>
                    <li>
                      <span className="font-medium">ประเภท:</span>{" "}
                      {product.valueType === "cash"
                        ? "คูปองเงินสด"
                        : "AIS Point"}
                    </li>
                    <li>
                      <span className="font-medium">มูลค่า:</span>{" "}
                      {product.value}{" "}
                      {product.valueType === "cash" ? "บาท" : "Point"}
                    </li>
                    <li>
                      <span className="font-medium">จำนวนคงเหลือ:</span>{" "}
                      {product.stock} ชิ้น
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">ระยะเวลา</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      <span className="font-medium">เริ่มใช้ได้:</span>{" "}
                      {formatDate(product.startDate)}
                    </li>
                    <li>
                      <span className="font-medium">หมดอายุ:</span>{" "}
                      {formatDate(product.endDate)}
                    </li>
                    <li>
                      <span className="font-medium">สถานะ:</span>{" "}
                      <span
                        className={`${
                          product.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {product.isActive ? "พร้อมขาย" : "ไม่พร้อมขาย"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                เงื่อนไขการใช้งาน
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• สามารถใช้ได้ถึงวันที่ {formatDate(product.endDate)}</li>
                <li>• ไม่สามารถแลกเปลี่ยนเป็นเงินสดได้</li>
                <li>• ไม่สามารถใช้ร่วมกับโปรโมชั่นอื่นได้</li>
                <li>
                  •
                  บริษัทขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
