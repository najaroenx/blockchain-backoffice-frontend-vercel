"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useProduct,
  Product,
  CouponStatus,
  CouponValueType,
} from "@/app/seller/products/hooks/useProduct";
import { Spinner } from "@/components/ui/Spinner";

// Icons
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import { ModalCustom } from "@/components/ui/ModalCustom";
import { ModalSuccess } from "@/components/ui/ModalSuccess";

export default function CreateProductPage() {
  const router = useRouter();
  const { createProduct, isLoading } = useProduct();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [productForm, setProductForm] = useState<Product>({
    name: "Example product",
    code: "Example code",
    description: "Example description",
    price: 100,
    costPrice: 75,
    totalIssued: 0,
    category: "",
    tags: [],
    brand: "",
  });

  const handleSubmit = async () => {
    try {
      setShowDiscardModal(true);
      if (!productForm.name || !productForm.price) {
        alert("Please fill in required fields (Name, Price)");
        return;
      }

      const payload = {
        sellerWalletAddress: "0xf5e40ec8bfa4818278c04489b34a486281658e5c", // คนขาย
        coupon: {
          name: productForm.name,
          description: productForm.description,
          status: CouponStatus.UPCOMING, // "upcoming"
          merchantId: null,
          valueType: CouponValueType.AISPOINT,
          value: 100, // มูลค่าที่คูปองจะทำงาน
          pointId: null,
          pointsCost: 0, // จำนวนที่ end user ซื้อด้วย point
          startDate: "2024-11-01T00:00:00.000Z",
          endDate: "2026-01-15T23:59:59.999Z",
          totalIssued: Number(productForm.totalIssued),
          imageUrl:
            "https://images.pump.fun/coin-image/AJk5kgEaTACxCRxXgkyxHWz9Y897XgWhVswe3Y2bpump?variant=600x600&ipfs=bafybeiahrv46pjkfcecp64zn75doapycwqymwihdfr7uf6zgqi7ey5wy6y&src=https%3A%2F%2Fipfs.io%2Fipfs%2Fbafybeiahrv46pjkfcecp64zn75doapycwqymwihdfr7uf6zgqi7ey5wy6y",
          merchantRef: "POOP",
        },
      };
      const result = await createProduct(payload);
      if (result && result.status === 201) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      // Hook handles validation/error state, but we can add extra alert if needed or rely on hook's error
    } finally {
      setShowDiscardModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Create product</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Product name
                </label>
                <input
                  type="text"
                  id="productName"
                  placeholder="Product Name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="productCode"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Product code
                </label>
                <input
                  type="text"
                  id="productCode"
                  placeholder="Product Code"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  value={productForm.code}
                  onChange={(e) =>
                    setProductForm({ ...productForm, code: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Description
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-white">
                    <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors">
                      <FormatBoldIcon fontSize="small" />
                    </button>
                    <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors">
                      <FormatItalicIcon fontSize="small" />
                    </button>
                    <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors">
                      <StrikethroughSIcon fontSize="small" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors">
                      <CodeIcon fontSize="small" />
                    </button>
                    <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors">
                      <FormatQuoteIcon fontSize="small" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1"></div>
                    <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors">
                      <p className="font-serif font-bold text-sm px-1">H</p>
                    </button>
                    <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors">
                      <FormatListBulletedIcon fontSize="small" />
                    </button>
                    <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors">
                      <FormatListNumberedIcon fontSize="small" />
                    </button>
                    <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors">
                      <HorizontalRuleIcon fontSize="small" />
                    </button>
                  </div>
                  <textarea
                    id="description"
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 focus:outline-none text-sm resize-y min-h-[120px]"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Pricing</h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    B
                  </span>
                  <input
                    type="text"
                    id="price"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="costPrice"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Cost price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    B
                  </span>
                  <input
                    type="text"
                    id="costPrice"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    value={productForm.costPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        costPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="costPrice"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    0
                  </span>
                  <input
                    type="text"
                    id="totalIssued"
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    value={productForm.totalIssued}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        totalIssued: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Product Image */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Product Image
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Choose a product photo or simply drag and drop up to 5 photos
              here.
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-500/50 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <ImageIcon />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">
                Drop your image here, or
              </h3>
              <span className="text-sm text-blue-600 font-medium hover:underline">
                Click to browse
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file size
              is restricted to a maximum of 500kb.
            </p>
          </div>

          {/* Attribute */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Attribute</h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-600"
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Living</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  placeholder="Add tags for product..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  value={productForm.tags}
                  onChange={(e) => {
                    // Temporarily handle tags as string in input for simple comma separation
                    // Ideally you would use a proper tag input component or handle the split/join logic
                    setProductForm({
                      ...productForm,
                      tags: e.target.value as unknown as string[],
                    });
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  placeholder="Search brand..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  value={productForm.brand}
                  onChange={(e) =>
                    setProductForm({ ...productForm, brand: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={() => setShowDiscardModal(true)}
          className="px-6 py-2.5 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
        >
          Discard
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" color="text-white" />
              <span>Creating...</span>
            </>
          ) : (
            "Create"
          )}
        </button>
      </div>
      <ModalSuccess
        isOpen={showSuccessModal}
        title="ดำเนินการสำเร็จ"
        description="สินค้าของคุณถูกสร้างเรียบร้อยแล้ว"
        onClose={() => router.push("/seller/products/list")}
      />
      <ModalCustom
        isOpen={showDiscardModal}
        title="กำลังดำเนินการ"
        confirmText="Discard"
        cancelText="Keep Editing"
        // onConfirm={() => router.back()}
        // onCancel={() => setShowDiscardModal(false)}
      >
        <div className="flex flex-col items-center justify-center gap-2 my-10">
          <Spinner size="lg" color="text-blue-600" />
          <p className="text-sm text-black font-semibold text-slate-500">
            กำลังดำเนินการ กรุณารอสักครู่...
          </p>
        </div>
      </ModalCustom>
    </div>
  );
}
