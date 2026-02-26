"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Link from "next/link";
import { useSellerId } from "@/app/dlt/contexts/sellerContext";
import { MerchantRefStoreResponse } from "@/app/api/merchant-ref-store/route";

export default function ProductCreatePage() {
  const router = useRouter();
  const sellerId = useSellerId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [merchantRefStores, setMerchantRefStores] = useState<MerchantRefStoreResponse[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);

  // Fetch merchant ref stores
  useEffect(() => {
    const fetchMerchantRefStores = async () => {
      setIsLoadingStores(true);
      try {
        const response = await fetch("/api/merchant-ref-store");
        const result = await response.json();
        setMerchantRefStores(result.data || []);
      } catch (error) {
        console.error("Failed to fetch merchant ref stores:", error);
      } finally {
        setIsLoadingStores(false);
      }
    };
    fetchMerchantRefStores();
  }, []);

  const [formData, setFormData] = useState({
    productType: "voucher",
    name: "",
    description: "",
    status: "upcoming",
    valueType: "cash",
    value: 0,
    pointId: null as string | null,
    pointsCost: 0,
    startDate: "",
    endDate: "",
    totalIssued: 1,
    imageUrl: "",
    merchantRef: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Auto-set valueType based on productType
    if (name === "productType") {
      const newValueType = value === "voucher" ? "cash" : "aispoint";
      setFormData((prev) => ({
        ...prev,
        productType: value,
        valueType: newValueType,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: ["value", "pointsCost", "totalIssued"].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!sellerId) {
        alert("Merchant ID is required. Please select a seller first.");
        setIsSubmitting(false);
        return;
      }

      // Validate AIS coupon value must not exceed 100
      if (formData.valueType === "aispoint" && formData.value > 100) {
        setIsSubmitting(false);
        return;
      }

      const payload = {
        merchantId: sellerId,
        coupon: {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          merchantId: sellerId,
          valueType: formData.valueType,
          value: formData.value,
          pointId: formData.pointId,
          pointsCost: formData.pointsCost,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          totalIssued: formData.totalIssued,
          imageUrl: formData.imageUrl,
          merchantRef: formData.merchantRef,
        },
      };

      console.log("Submitting product:", payload);

      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Product created successfully!");
        router.push(`/dlt/seller/${sellerId}/products/list`);
      } else {
        alert(result.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dlt/seller/${sellerId}/products/list`}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowBackIcon />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Product</h1>
          <p className="text-gray-400 mt-1">
            Add a new coupon/product to your inventory
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">
                Basic Information
              </h2>

              {/* Product Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Product Type *
                </label>
                <div className="relative">
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full appearance-none px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  >
                    <option value="voucher" className="bg-[#1a1a2e]">
                      🎟️ Voucher
                    </option>
                    <option value="point" className="bg-[#1a1a2e]">
                      💰 Point
                    </option>
                  </select>
                  <KeyboardArrowDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.productType === "voucher"
                    ? "สร้าง Voucher/Coupon สำหรับลูกค้าแลกซื้อ"
                    : "สร้าง Point Token สำหรับระบบสะสมแต้ม"}
                </p>
              </div>

              {/* Product Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., คูปองเงินสด ฿1100 ร้านเดอะมอลล์"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., แลกรับคูปองเงินสด 1100 บาท ใช้ได้ที่สาขาเดอะมอลล์ทุกสาขา"
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
                />
              </div>

              {/* Merchant Reference */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Merchant Reference
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <StorefrontIcon className="h-5 w-5 text-purple-500" />
                  </div>
                  <select
                    name="merchantRef"
                    value={formData.merchantRef}
                    onChange={handleInputChange}
                    disabled={isLoadingStores}
                    className="w-full appearance-none pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-[#1a1a2e]">
                      {isLoadingStores ? "กำลังโหลด..." : "เลือกร้านค้า "}
                    </option>
                    {merchantRefStores.map((store) => (
                      <option key={store.id} value={store.merchantRef} className="bg-[#1a1a2e]">
                        {store.name} ({store.merchantRef})
                      </option>
                    ))}
                  </select>
                  <KeyboardArrowDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  เลือกร้านค้าที่คูปองนี้สามารถใช้งานได้
                </p>
              </div>
            </div>

            {/* Pricing & Quantity */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">
                Pricing & Quantity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Value Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Value Type *
                  </label>
                  <div className="relative">
                    <select
                      name="valueType"
                      value={formData.valueType}
                      onChange={handleInputChange}
                      disabled={formData.productType === "point"}
                      className="w-full appearance-none px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formData.productType === "point" ? (
                        <option value="aispoint" className="bg-[#1a1a2e]">
                          AIS Point
                        </option>
                      ) : (
                        <>
                          <option value="cash" className="bg-[#1a1a2e]">
                            Cash
                          </option>
                          <option value="percentage" className="bg-[#1a1a2e]">
                            Percentage
                          </option>
                          <option value="product" className="bg-[#1a1a2e]">
                            Product
                          </option>
                        </>
                      )}
                    </select>
                    <KeyboardArrowDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.productType === "point"
                      ? "กำหนดอัตโนมัติตาม Product Type"
                      : "เลือกประเภทมูลค่าของคูปอง"}
                  </p>
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Value *
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    min="0"
                    max={formData.valueType === "aispoint" ? 100 : undefined}
                    required
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all ${
                      formData.valueType === "aispoint" && formData.value > 100
                        ? "border-red-500"
                        : "border-white/10"
                    }`}
                  />
                  {formData.valueType === "aispoint" && formData.value > 100 && (
                    <p className="text-xs text-red-400 mt-1">
                      AIS Coupon value ต้องไม่เกิน 100
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.valueType === "cash"
                      ? "มูลค่าเงินสดของคูปอง (บาท)"
                      : formData.valueType === "percentage"
                      ? "เปอร์เซ็นต์ส่วนลด (%)"
                      : formData.valueType === "aispoint"
                      ? "จำนวน AIS Point (สูงสุด 100)"
                      : "จำนวน Point/สินค้าที่ได้รับ"}
                  </p>
                </div>

                {/* Points Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Points Cost
                  </label>
                  <input
                    type="number"
                    name="pointsCost"
                    value={formData.pointsCost}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    จำนวน Point ที่ลูกค้าต้องใช้ในการแลก
                  </p>
                </div>

                {/* Total Issued */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Total Quantity *
                  </label>
                  <input
                    type="number"
                    name="totalIssued"
                    value={formData.totalIssued}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">
                Validity Period
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all [color-scheme:dark]"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all [color-scheme:dark]"
                  />
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full appearance-none px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    >
                      <option value="upcoming" className="bg-[#1a1a2e]">
                        Upcoming
                      </option>
                      <option value="active" className="bg-[#1a1a2e]">
                        Active
                      </option>
                      <option value="inactive" className="bg-[#1a1a2e]">
                        Inactive
                      </option>
                    </select>
                    <KeyboardArrowDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">
                Product Image
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid image URL (IPFS, Cloudinary, etc.)
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-6">
                Product Preview
              </h2>

              {formData.name ? (
                <div className="space-y-4">
                  {/* Image */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt={formData.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <InventoryIcon className="w-16 h-16 text-gray-600" />
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-white">
                    {formData.name}
                  </h3>

                  {/* Description */}
                  {formData.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {formData.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Value</span>
                      <span className="text-xl font-bold text-purple-400">
                        {formData.valueType === "aispoint"
                          ? `${formData.value.toLocaleString()} Point`
                          : `฿${formData.value.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Quantity</span>
                      <span className="text-white font-medium">
                        {formData.totalIssued} units
                      </span>
                    </div>
                    {formData.pointsCost > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Points Cost</span>
                        <span className="text-amber-400 font-medium">
                          {formData.pointsCost} pts
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          formData.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : formData.status === "upcoming"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {formData.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <InventoryIcon className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-500">
                    Fill in the form to see preview
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name}
                  className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    formData.name && !isSubmitting
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                      : "bg-white/10 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <InventoryIcon className="w-5 h-5" />
                      Create Product
                    </>
                  )}
                </button>
                <Link
                  href={`/dlt/seller/${sellerId}/products/list`}
                  className="block w-full py-3 text-center rounded-xl font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
