"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ImageIcon from "@mui/icons-material/Image";
import LanguageIcon from "@mui/icons-material/Language";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { useCreateMerchant } from "@/app/dlt/hooks/useMerchants";

export default function CreateMerchantPage() {
  const router = useRouter();
  const { createMerchant, isCreating } = useCreateMerchant();
  const [formData, setFormData] = useState({
    name: "hydroflask",
    website: "https://www.hydroflask.com/",
    description:
      "By entering my email above, I consent to receiving marketing and other promotional emails and consent to the Privacy Policy. I may opt-out at any time",
    imageUrl: "https://www.hydroflask.com/media/wysiwyg/4383-pr-d.png",
    location: "USA",
    tel: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMerchant({
        name: formData.name,
        website: formData.website,
        description: formData.description,
        imageUrl: formData.imageUrl,
        location: formData.location,
        tel: formData.tel,
      });
      router.push("/dlt/merchant");
    } catch (error) {
      console.error("Failed to create merchant:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white relative">
      {/* Loading Overlay */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-white text-lg font-medium">
              กำลังสร้าง Merchant...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#1a1a2e] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/dlt/merchant"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowBackIcon className="w-5 h-5" />
            <span>Back to Merchants</span>
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <StorefrontIcon className="w-6 h-6 text-purple-400" />
            </div>
            Create New Merchant
          </h1>
          <p className="text-gray-400 mt-2">
            Fill in the details below to create your new merchant store
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="bg-[#1a1a2e] rounded-2xl border border-white/5 p-6 space-y-5">
            {/* Name */}
            <label className="block">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <StorefrontIcon className="w-5 h-5 text-purple-400" />
                Name <span className="text-red-400">*</span>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="DLT Merchant"
                required
                className="w-full px-4 py-3 bg-[#12122a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </label>

            {/* Website */}
            <label className="block">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <LanguageIcon className="w-5 h-5 text-cyan-400" />
                Website
              </div>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-[#12122a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </label>

            {/* Description */}
            <label className="block">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <DescriptionIcon className="w-5 h-5 text-emerald-400" />
                Description
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Merchant description"
                rows={3}
                className="w-full px-4 py-3 bg-[#12122a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </label>

            {/* Image Url */}
            <label className="block">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <ImageIcon className="w-5 h-5 text-pink-400" />
                Image Url
              </div>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-[#12122a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </label>

            {/* Location */}
            <label className="block">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <LocationOnIcon className="w-5 h-5 text-orange-400" />
                Location
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full px-4 py-3 bg-[#12122a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </label>

            {/* Phone */}
            <label className="block">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <PhoneIcon className="w-5 h-5 text-blue-400" />
                Phone
              </div>
              <input
                type="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder="0x-xxxx-xxxx"
                className="w-full px-4 py-3 bg-[#12122a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </label>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={isCreating || !formData.name}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Merchant"
                )}
              </button>
              <Link
                href="/dlt/merchant"
                className="px-6 py-3 text-gray-400 hover:text-white font-semibold transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
