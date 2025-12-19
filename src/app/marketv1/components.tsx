"use client";
import React from "react";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import StarIcon from "@mui/icons-material/Star";
import CheckIcon from "@mui/icons-material/Check";
import CallMadeIcon from "@mui/icons-material/CallMade";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const Navbar = () => {
  return (
    <nav className="bg-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link
          href="/marketv1"
          className="text-2xl font-bold text-slate-900 tracking-tight"
        >
          ecomus
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            href="#"
            className="text-sm font-medium text-slate-900 hover:text-blue-600 flex items-center gap-1"
          >
            Home <span className="text-[10px]">▼</span>
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-slate-900 hover:text-blue-600 flex items-center gap-1"
          >
            Shop <span className="text-[10px]">▼</span>
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-slate-900 hover:text-blue-600 flex items-center gap-1"
          >
            Products <span className="text-[10px]">▼</span>
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-slate-900 hover:text-blue-600 flex items-center gap-1"
          >
            Pages <span className="text-[10px]">▼</span>
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-slate-900 hover:text-blue-600 flex items-center gap-1"
          >
            Blog <span className="text-[10px]">▼</span>
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-slate-900 hover:text-blue-600"
          >
            Buy now
          </Link>
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-5 text-slate-900">
        <button className="hover:text-blue-600">
          <SearchIcon />
        </button>
        <button className="hover:text-blue-600">
          <PersonOutlineIcon />
        </button>
        <button className="hover:text-blue-600 relative">
          <FavoriteBorderIcon />
          <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            0
          </span>
        </button>
        <button className="hover:text-blue-600 relative">
          <ShoppingBagOutlinedIcon />
          <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            0
          </span>
        </button>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 px-6 md:px-12 border-t border-slate-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: Find us */}
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-lg">Find us</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Find a location nearest you.
              <br />
              <a
                href="#"
                className="underline hover:text-slate-900 mt-2 block w-max"
              >
                See Our Stores
              </a>
            </p>
            <div className="text-slate-900 font-bold text-sm">
              <p>(08) 8942 1299</p>
              <p>hello@domain.com</p>
            </div>
            <div className="flex items-center gap-4 text-slate-900">
              <a href="#" className="hover:opacity-70">
                <FacebookIcon fontSize="small" />
              </a>
              <a href="#" className="hover:opacity-70">
                <TwitterIcon fontSize="small" />
              </a>
              <a href="#" className="hover:opacity-70">
                <InstagramIcon fontSize="small" />
              </a>
              <a href="#" className="hover:opacity-70">
                <YouTubeIcon fontSize="small" />
              </a>
              <a href="#" className="hover:opacity-70">
                <PinterestIcon fontSize="small" />
              </a>
            </div>
          </div>

          {/* Column 2: About us */}
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-lg">About us</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-slate-900">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  Visit Our Store
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  Account
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-lg">Help</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-slate-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  Returns + Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  FAQ&apos;s
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  Compare
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900">
                  My Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Sign Up for Email */}
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-lg">
              Sign Up for Email
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Sign up to get first dibs on new arrivals, sales, exclusive
              content, events and more!
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full h-12 px-4 border border-slate-200 rounded text-sm focus:outline-none focus:border-slate-900"
                />
              </div>
              <button className="bg-slate-900 text-white font-bold h-12 px-6 rounded hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm">
                Subscribe <CallMadeIcon style={{ fontSize: 14 }} />
              </button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900">
                <span className="text-lg">🇺🇸</span> USD{" "}
                <KeyboardArrowDownIcon fontSize="small" />
              </button>
              <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900">
                English <KeyboardArrowDownIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 Ecomus. All rights reserved.
          </p>
          <div className="flex items-center gap-2 grayscale opacity-70">
            <div className="h-6 px-2 border border-slate-200 rounded flex items-center bg-white">
              <span className="font-bold italic text-[10px] text-blue-800">
                VISA
              </span>
            </div>
            <div className="h-6 px-2 border border-slate-200 rounded flex items-center bg-white">
              <span className="font-bold italic text-[10px] text-blue-600">
                Pay
              </span>
              <span className="font-bold italic text-[10px] text-cyan-600">
                Pal
              </span>
            </div>
            <div className="h-6 px-2 border border-slate-200 rounded flex items-center bg-white">
              <span className="font-bold text-[10px] text-red-600">
                Mastercard
              </span>
            </div>
            <div className="h-6 px-2 border border-slate-200 rounded flex items-center bg-white">
              <span className="font-bold text-[10px] text-blue-500">AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Mock Product Card Component
export const ProductCard = ({
  id,
  title,
  price,
  color,
  brandName,
  textColor = "text-slate-900",
}: {
  id?: string;
  title: string;
  price: string;
  color: string;
  brandName: string;
  textColor?: string;
}) => {
  const slug =
    id ||
    title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

  return (
    <div className="group relative bg-white rounded-lg p-2 transition-all hover:shadow-lg">
      <Link href={`/marketv1/products/${slug}`}>
        <div className="relative aspect-[1.6] rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-100 p-6 flex items-center justify-center cursor-pointer">
          {/* Card Visual Mockup */}
          <div
            className={`w-full h-full rounded-lg shadow-sm flex flex-col items-center justify-center ${color} ${textColor} relative`}
          >
            {/* Decorative pattern for some visual interest */}
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <div className="w-12 h-12 rounded-full border-4 border-current"></div>
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tighter">
              {brandName}
            </h3>
            <span className="text-xs font-medium mt-1 opacity-80 uppercase tracking-widest">
              Gift Card
            </span>
          </div>

          {/* Hover Actions */}
          <div className="absolute bottom-4 right-1/2 translate-x-1/2 flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button className="w-9 h-9 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700">
              <FavoriteBorderIcon fontSize="small" />
            </button>
            <button className="w-9 h-9 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700">
              <CompareArrowsOutlinedIcon fontSize="small" />
            </button>
            <button className="w-9 h-9 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700">
              <RemoveRedEyeOutlinedIcon fontSize="small" />
            </button>
          </div>
        </div>
      </Link>

      <div className="px-2 pb-2">
        <Link
          href={`/marketv1/products/${slug}`}
          className="hover:text-blue-600 transition-colors"
        >
          <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
        </Link>
        <p className="text-xs font-bold text-slate-900 mb-4">
          FROM <span className="text-sm">${price}</span>
        </p>

        <button className="w-full py-2.5 rounded border border-red-500 text-red-600 font-bold text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300">
          Quick add
        </button>
      </div>
    </div>
  );
};

// Mock Category Card Component
export const CategoryCard = ({
  title,
  count,
  imageColor,
  brandText,
  brandSub,
  textColor = "text-white",
}: {
  title: string;
  count: string;
  imageColor: string;
  brandText: string;
  brandSub: string;
  textColor?: string;
}) => {
  return (
    <div className="bg-slate-50 rounded-xl p-8 hover:shadow-md transition-shadow group cursor-pointer h-full flex flex-col">
      <div className="mb-8">
        <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
        <p className="text-slate-500 text-sm">{count}</p>
      </div>

      <div className="flex-1 flex items-center justify-center mb-8">
        <div
          className={`w-full aspect-[1.6] rounded-lg shadow-sm flex flex-col items-center justify-center ${imageColor} ${textColor} p-4 transition-transform group-hover:scale-105 duration-300`}
        >
          <h4
            className={`text-xl font-bold tracking-tight ${
              textColor === "text-green-600" ? "flex items-center gap-1" : ""
            }`}
          >
            {textColor === "text-green-600" && (
              <span className="text-orange-500">🥕</span>
            )}
            {brandText}
          </h4>
          {brandSub && (
            <span className="text-[10px] uppercase tracking-widest mt-1 opacity-80 font-medium">
              {brandSub}
            </span>
          )}
        </div>
      </div>

      <button className="bg-white text-slate-900 py-3 px-6 rounded font-bold text-sm shadow-sm hover:bg-slate-900 hover:text-white transition-colors w-max self-start">
        Shop now
      </button>
    </div>
  );
};

// Mock Review Card Component
export const ReviewCard = ({
  name,
  title,
  content,
}: {
  name: string;
  title: string;
  content: string;
}) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow h-full border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-white bg-black px-2 py-0.5 rounded-full">
          <CheckIcon style={{ fontSize: 10 }} /> Verify customer
        </div>
      </div>

      <div className="flex gap-0.5 text-slate-900 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} fontSize="small" style={{ fontSize: 14 }} />
        ))}
      </div>

      <h3 className="font-bold text-slate-900 mb-3 text-base">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{content}</p>
    </div>
  );
};

// Mock Blog Card Component
export const BlogCard = ({
  title,
  imageColor,
}: {
  title: string;
  imageColor: string;
}) => {
  return (
    <div className="group cursor-pointer">
      <div
        className={`relative aspect-[1.3] ${imageColor} rounded-lg overflow-hidden mb-6`}
      >
        {/* Placeholder for image */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </div>
        <span className="absolute bottom-4 left-4 bg-white text-slate-900 text-[10px] font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wide">
          Gift Card
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-slate-700 transition-colors">
        {title}
      </h3>
      <div className="flex items-center gap-1 text-sm font-bold text-slate-900 border-b border-slate-300 pb-0.5 w-max group-hover:border-slate-900 transition-colors">
        Read more <CallMadeIcon fontSize="small" style={{ fontSize: 16 }} />
      </div>
    </div>
  );
};
