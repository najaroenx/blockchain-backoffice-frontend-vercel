"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMerchantId } from "@/app/dlt/contexts/merchantContext";
import { useSelectedProduct } from "@/app/dlt/contexts/selectedProductContext";
import {
  useMarketplaceProducts,
  useMarketplaceCategories,
  MarketplaceProduct,
} from "@/app/dlt/hooks/useMarketplace";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function MarketplacePage() {
  const router = useRouter();
  const merchantId = useMerchantId();
  const { setSelectedProduct } = useSelectedProduct();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Fetch products from API with category filter
  const { products, isLoading, total, listings } = useMarketplaceProducts(
    merchantId || "",
    selectedCategory !== "all" ? { category: selectedCategory } : undefined
  );

  // Fetch categories from API
  const { categories } = useMarketplaceCategories(merchantId || "");

  // Use fetched categories or fallback to default
  const displayCategories =
    categories.length > 0
      ? categories
      : [
          { id: "all", name: "ทั้งหมด", color: "#9333ea" },
          { id: "cash", name: "คูปองเงินสด", color: "#22c55e" },
          { id: "aispoint", name: "AIS Point", color: "#ef4444" },
        ];

  // Products are already filtered by API when category is selected
  const filteredProducts: MarketplaceProduct[] = products;

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleProductClick = (product: MarketplaceProduct) => {
    // Set selected product in context
    setSelectedProduct(product);
    // Navigate to detail page
    router.push(`/dlt/merchant/${merchantId}/marketplace/${product.listingId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-600 text-lg">กำลังโหลดสินค้า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-2">
            Home / Seasonal Color Sale
          </p>
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Seasonal Color Sale
          </h1>

          {/* Category Filters */}
          <div className="flex justify-center gap-6 flex-wrap">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  selectedCategory === cat.id
                    ? "opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full border-2 transition-all ${
                    selectedCategory === cat.id
                      ? "border-gray-800 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs text-gray-600 text-center max-w-[70px]">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Count */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">
            {total || filteredProducts.length}
          </span>{" "}
          Items
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative">
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3 right-3 z-10 p-1 hover:scale-110 transition-transform"
              >
                {favorites.has(product.id) ? (
                  <FavoriteIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <FavoriteBorderIcon className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                )}
              </button>

              {/* New Badge */}
              {product.isNew && (
                <span className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-gray-800 text-white text-xs font-medium rounded">
                  New
                </span>
              )}

              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3 group-hover:bg-gray-100 transition-colors">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                    <OpenInNewIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <button
                  onClick={() => handleProductClick(product)}
                  className="text-sm text-gray-800 hover:text-purple-600 hover:underline line-clamp-2 font-medium text-left"
                >
                  {product.name}
                </button>

                {/* Value Type Badge & Stock */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      product.valueType === "cash"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.valueType === "cash" ? "เงินสด" : "AIS Point"}
                  </span>
                  <span className="text-xs text-gray-500">
                    เหลือ {product.stock} ชิ้น
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-purple-600">
                    ฿{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    / มูลค่า {product.value}{" "}
                    {product.valueType === "cash" ? "บาท" : "Point"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
