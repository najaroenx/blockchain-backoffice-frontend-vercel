"use client";
import React from "react";
import { Navbar, Footer } from "../../components";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import ShareIcon from "@mui/icons-material/Share";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUserOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import LoopIcon from "@mui/icons-material/Loop"; // For 'Return' icon placeholder

// Mock Data
const PRODUCTS: any = {
  "aws-egift-card": {
    title: "AWS eGift Card",
    price: "121.00",
    brandName: "amazon.com.au",
    color: "bg-[#232f3e]", // Amazon dark blue
    textColor: "text-white",
    denominations: ["121.00", "423.00", "424.00", "821.00"],
  },
  "boutique-egift-card": {
    title: "Boutique eGift Card",
    price: "268.00",
    brandName: "Beginning",
    color: "bg-pink-400",
    textColor: "text-slate-900",
    denominations: ["268.00", "333.00", "564.00", "633.00"],
  },
  "jay-jays-egift-card": {
    title: "Jay Jays eGift Card",
    price: "10.00",
    brandName: "Jay Jays",
    color: "bg-yellow-400",
    textColor: "text-slate-900",
    denominations: ["10.00", "20.00", "50.00", "100.00"],
  },
};

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Simple mock data lookup
  const productId = params.id;
  const product = PRODUCTS[productId] || PRODUCTS["aws-egift-card"]; // Default to AWS if not found

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 md:px-12 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/marketv1" className="hover:text-slate-900">
            Home
          </Link>
          <span className="text-[10px]">›</span>
          <span className="text-slate-900 font-medium">{product.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
            {/* Left: Product Image */}
            <div className="w-full lg:w-1/2 bg-slate-50 rounded-lg p-12 flex items-center justify-center aspect-square lg:aspect-[1.2]">
              <div
                className={`w-full max-w-[500px] aspect-[1.6] ${product.color} rounded-xl shadow-lg relative flex items-center justify-center p-8`}
              >
                {/* Card Content Mockup */}
                <div className="text-center">
                  <h3
                    className={`font-black text-4xl uppercase tracking-tighter ${product.textColor}`}
                  >
                    {product.brandName}
                  </h3>
                  {/* Decorative smile for Amazon look-alike if AWS */}
                  {productId.includes("aws") && (
                    <div className="mt-4 w-24 h-8 border-b-4 border-orange-400 rounded-[100%] mx-auto"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {product.title}
              </h1>

              {/* Price */}
              <div className="text-3xl font-medium text-slate-900">
                ${product.price}
              </div>

              {/* Denominations */}
              <div className="space-y-3 pt-4">
                <span className="block text-sm font-bold text-slate-900">
                  Denominations: ${product.price}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.denominations.map((denom: string, idx: number) => (
                    <button
                      key={denom}
                      className={`px-4 py-2 border font-medium rounded transition-all text-sm ${
                        idx === 0
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      ${denom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-6 border-b border-slate-100 pb-8">
                {/* Quantity */}
                <div className="flex items-center gap-2 h-12">
                  <div className="flex items-center h-full border border-slate-200 rounded w-32 bg-white hover:border-slate-300 transition-colors">
                    <button className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900">
                      <RemoveIcon fontSize="small" />
                    </button>
                    <input
                      type="text"
                      value="1"
                      className="flex-1 w-full h-full text-center bg-transparent border-none focus:outline-none font-medium text-slate-900"
                      readOnly
                    />
                    <button className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900">
                      <AddIcon fontSize="small" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    id="gift"
                    className="rounded border-slate-300 ml-1 w-4 h-4"
                  />
                  <label htmlFor="gift">I want to send this as a gift</label>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-slate-900 text-white font-bold h-12 rounded hover:bg-slate-800 transition-colors uppercase tracking-wide text-sm flex items-center justify-center">
                    Add to cart - ${product.price}
                  </button>
                  <button className="w-12 h-12 border border-slate-200 rounded flex items-center justify-center hover:bg-slate-50 text-slate-900 transition-colors">
                    <FavoriteBorderIcon fontSize="small" />
                  </button>
                  <button className="w-12 h-12 border border-slate-200 rounded flex items-center justify-center hover:bg-slate-50 text-slate-900 transition-colors">
                    <CompareArrowsOutlinedIcon fontSize="small" />
                  </button>
                </div>
              </div>

              {/* Extra Info Links */}
              <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-600 pt-2">
                <button className="flex items-center gap-2 hover:text-slate-900">
                  <HelpOutlineIcon fontSize="small" /> Ask a question
                </button>
                <button className="flex items-center gap-2 hover:text-slate-900">
                  <LocalShippingIcon fontSize="small" /> Delivery & Return
                </button>
                <button className="flex items-center gap-2 hover:text-slate-900">
                  <ShareIcon fontSize="small" /> Share
                </button>
              </div>

              {/* Info Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="border border-slate-200 rounded p-6 flex flex-col items-center text-center gap-3">
                  <LocalShippingIcon
                    className="text-slate-400"
                    fontSize="large"
                  />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Estimate delivery times: <strong>12-26 days</strong>{" "}
                    (International), <strong>3-6 days</strong> (United States).
                  </p>
                </div>
                <div className="border border-slate-200 rounded p-6 flex flex-col items-center text-center gap-3">
                  <LoopIcon className="text-slate-400" fontSize="large" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Return within <strong>30 days</strong> of purchase. Duties &
                    taxes are non-refundable.
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-col items-start gap-4 text-xs text-slate-500 border-t border-slate-100 mt-4">
                <div className="flex items-center gap-2 font-medium w-full">
                  <VerifiedUserIcon fontSize="small" /> Guaranteed Safe Checkout
                  <div className="flex items-center gap-2 grayscale opacity-70 ml-auto">
                    <div className="h-5 px-2 border border-slate-200 rounded flex items-center bg-white">
                      <span className="font-bold italic text-blue-800">
                        VISA
                      </span>
                    </div>
                    <div className="h-5 px-2 border border-slate-200 rounded flex items-center bg-white">
                      <span className="font-bold italic text-blue-600">
                        Pay
                      </span>
                      <span className="font-bold italic text-cyan-600">
                        Pal
                      </span>
                    </div>
                    <div className="h-5 px-2 border border-slate-200 rounded flex items-center bg-white">
                      <span className="font-bold text-red-600">Mastercard</span>
                    </div>
                    <div className="h-5 px-2 border border-slate-200 rounded flex items-center bg-white">
                      <span className="font-bold text-blue-500">AMEX</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
