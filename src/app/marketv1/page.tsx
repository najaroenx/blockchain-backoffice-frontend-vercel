"use client";
import React from "react";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcardOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupsIcon from "@mui/icons-material/GroupsOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import ShareIcon from "@mui/icons-material/Share";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUserOutlined";
import StarIcon from "@mui/icons-material/Star";
import CheckIcon from "@mui/icons-material/Check";
import CallMadeIcon from "@mui/icons-material/CallMade";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// Mock Components
import {
  ProductCard,
  CategoryCard,
  ReviewCard,
  BlogCard,
  Navbar,
  Footer,
} from "./components";

// Mock Link component
import Link from "next/link";

export default function MarketV1Page() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-slate-900 min-h-[600px] relative overflow-hidden flex items-center">
        {/* Background Gradient Effect */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 max-w-xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Gift Cards <br />
              for Every Smile
            </h1>
            <p className="text-lg text-slate-300 font-light">
              Send a gift card to a loved one today!
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-medium transition-colors flex items-center gap-2 group">
              Shop collection
              <ArrowForwardIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Carousel Dots Mockup */}
            <div className="flex items-center gap-3 pt-8">
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
            </div>
          </div>

          {/* Hero Image / Composition */}
          <div className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center">
            {/* Using the uploaded image as the visual reference/mockup as requested */}
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              {/* 
                   We use object-cover and object-right to try to focus on the cards part 
                   of the screenshot if possible, or just Show the image as a contained asset.
                   Since the user said "image can mockup", we place it here.
                */}
              {/* <Image
                src="https://ecomus-2.myshopify.com/cdn/shop/files/GiftCard_slideshow_0011.webp?v=1734053158&width=2000"
                alt="Gift Cards Composition"
                fill
                className="object-cover object-right-top md:object-contain mask-image-fade"
              /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Product Carousel Section */}
      <section className="py-16 px-6 md:px-12 bg-white relative group/section">
        <div className="container mx-auto relative">
          {/* Navigation Buttons */}
          <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50">
            <ChevronLeftIcon />
          </button>
          <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
            <ChevronRightIcon />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product Card 1 */}
            <ProductCard
              title="Jay Jays eGift Card"
              price="10.00"
              color="bg-yellow-400"
              brandName="Jay Jays"
            />
            {/* Product Card 2 */}
            <ProductCard
              title="Adventure eGift Card"
              price="10.00"
              color="bg-sky-600"
              brandName="adrenaline"
              textColor="text-white"
            />
            {/* Product Card 3 */}
            <ProductCard
              title="Bp eGift Card"
              price="10.00"
              color="bg-emerald-600"
              brandName="bp"
              textColor="text-white"
            />
            {/* Product Card 4 */}
            <ProductCard
              title="Bonds eGift Card"
              price="10.00"
              color="bg-slate-900"
              brandName="BONDS"
              textColor="text-white"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-[#e0fadd] rounded-t-[50px] py-20 px-6 md:px-12 mt-10">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            Why choose us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center mb-2">
                <CardGiftcardIcon className="text-slate-900 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Physical or digital card?
              </h3>
              <p className="text-slate-700 leading-relaxed max-w-xs text-sm">
                Prefer a plastic card delivered by post? Or a digital one sent
                by email? Most of our gift cards offer both options.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center mb-2">
                <AccessTimeIcon className="text-slate-900 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Last minute shopping?
              </h3>
              <p className="text-slate-700 leading-relaxed max-w-xs text-sm">
                Most of our digital gift cards are delivered within 4 hours or
                can be scheduled to arrive on the day of your choice.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center mb-2">
                <GroupsIcon className="text-slate-900 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                A large crowd to please?
              </h3>
              <p className="text-slate-700 leading-relaxed max-w-xs text-sm">
                For your convenience, you can send up to 10 addresses in a
                single order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Popular Categories
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-colors">
                <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
              </button>
              <div className="w-1 h-1 bg-slate-300 rounded-full self-center"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <CategoryCard
              title="Experiences"
              count="6 items"
              imageColor="bg-blue-900"
              brandText="ALL"
              brandSub="GIFT CARD"
            />
            {/* Category 2 */}
            <CategoryCard
              title="Shopping"
              count="6 items"
              imageColor="bg-black"
              brandText="THE ICONIC"
              brandSub="GIFT CARD"
            />
            {/* Category 3 */}
            <CategoryCard
              title="Entertainment"
              count="9 items"
              imageColor="bg-green-500"
              brandText="Spotify"
              brandSub="Premium"
            />
            {/* Category 4 */}
            <CategoryCard
              title="Groceries"
              count="6 items"
              imageColor="bg-orange-100"
              brandText="instacart"
              brandSub=""
              textColor="text-green-600"
            />
          </div>
        </div>
      </section>

      {/* Don't Miss Our Sale Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
            Don&apos;t miss our sale
          </h2>

          <div className="flex flex-col lg:flex-row gap-12 items-start justify-center max-w-6xl mx-auto">
            {/* Left: Product Image */}
            <div className="w-full lg:w-1/2 bg-slate-50 rounded-2xl p-12 flex items-center justify-center aspect-square lg:aspect-[1.2]">
              <div className="w-full max-w-[400px] aspect-[1.6] bg-pink-400 rounded-xl shadow-lg relative flex items-center justify-center p-8">
                {/* Card Content Mockup */}
                <div className="text-center">
                  <h3 className="font-serif text-5xl text-slate-900 tracking-tighter mix-blend-multiply">
                    Beginning
                  </h3>
                  <p className="text-xs uppercase tracking-[0.3em] font-medium text-slate-800 mt-1">
                    Boutique
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h3 className="text-3xl font-bold text-slate-900">
                Boutique eGift Card
              </h3>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="px-3 py-1 border border-slate-900 text-slate-900 font-bold uppercase text-xs tracking-wider">
                  Best seller
                </span>
                <span className="flex items-center gap-1 text-red-500 font-medium">
                  <BoltIcon fontSize="small" className="text-red-500" />
                  Selling fast! 18 people have this in their carts.
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-medium text-slate-900">$268.00</div>

              {/* View Count Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded text-sm font-medium">
                <span className="font-bold">37</span> People are viewing this
                right now
              </div>

              {/* Denominations */}
              <div className="space-y-3 pt-4">
                <span className="block text-sm font-bold text-slate-900">
                  Denominations: $268.00
                </span>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 border-2 border-slate-900 bg-slate-900 text-white font-medium rounded transition-all">
                    $268.00
                  </button>
                  <button className="px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded hover:border-slate-300 transition-all">
                    $333.00
                  </button>
                  <button className="px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded hover:border-slate-300 transition-all">
                    $564.00
                  </button>
                  <button className="px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded hover:border-slate-300 transition-all">
                    $633.00
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-4 border-b border-slate-100 pb-8">
                {/* Quantity */}
                <div className="flex items-center gap-2 h-12">
                  <div className="flex items-center h-full border border-slate-200 rounded w-32 bg-slate-50">
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
                    className="rounded border-slate-300 ml-1"
                  />
                  <label htmlFor="gift">I want to send this as a gift</label>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-slate-900 text-white font-bold h-12 rounded hover:bg-slate-800 transition-colors uppercase tracking-wide text-sm">
                    Add to cart - $268.00
                  </button>
                  <button className="w-12 h-12 border border-slate-200 rounded flex items-center justify-center hover:bg-slate-50 text-slate-900 transition-colors">
                    <FavoriteBorderIcon />
                  </button>
                  <button className="w-12 h-12 border border-slate-200 rounded flex items-center justify-center hover:bg-slate-50 text-slate-900 transition-colors">
                    <CompareArrowsOutlinedIcon />
                  </button>
                </div>
              </div>

              {/* Extra Info */}
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

              {/* Trust Badges */}
              <div className="pt-6 flex flex-col md:flex-row items-center gap-4 text-xs text-slate-500 border-t border-slate-100 mt-4">
                <div className="flex items-center gap-2 font-medium">
                  <VerifiedUserIcon fontSize="small" /> Guaranteed Safe Checkout
                </div>
                <div className="flex items-center gap-2 grayscale opacity-70">
                  <div className="h-5 px-2 border border-slate-200 rounded flex items-center bg-white">
                    <span className="font-bold italic text-blue-800">VISA</span>
                  </div>
                  <div className="h-5 px-2 border border-slate-200 rounded flex items-center bg-white">
                    <span className="font-bold italic text-blue-600">Pay</span>
                    <span className="font-bold italic text-cyan-600">Pal</span>
                  </div>
                  <div className="h-5 px-2 border border-slate-200 rounded flex items-center bg-white">
                    <span className="font-bold text-red-600">Mastercard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personalise Gift Card Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden min-h-[500px]">
            {/* Left Content */}
            <div className="w-full md:w-5/12 bg-[#fffaf4] p-12 md:p-16 flex flex-col justify-center items-start">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Personalise Gift Card
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed text-sm md:text-base">
                Ecomus makes personalised eGifting easier than ever before! Send
                any Ecomus eGift Card with a personal video or voice message and
                a greeting card, and you can even customise our Ecomus Smart
                eGift Card with your own photo!
              </p>
              <button className="px-8 py-3 border border-slate-900 text-slate-900 font-bold text-sm rounded hover:bg-slate-900 hover:text-white transition-all uppercase tracking-wide">
                Shop collection
              </button>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-7/12 relative bg-slate-100">
              {/* 
                  Using the uploaded image as a mockup background 
                  Since I cannot easily reconstruct the complex collage of gift cards purely with CSS in this turn.
               */}
              <Image
                src="https://ecomus-2.myshopify.com/cdn/shop/files/Image_with_text_gift_card.webp?v=1736136788&width=1400"
                alt="Personalise Gift Card Collage"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-slate-50 py-24 px-6 md:px-12 rounded-b-[50px]">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            What our customers are saying
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Review 1 */}
            <ReviewCard
              name="Loretta"
              title="A minimalist dream"
              content="Exceptional quality at a fraction of the price you would pay for big brands. Very elegant, discreet and beautiful materials."
            />
            {/* Review 2 */}
            <ReviewCard
              name="Sandra"
              title="Perfect meals for Mums."
              content="Meals are delicious and great selection to choose from. I like the large portion option & info showing nutritional value."
            />
            {/* Review 3 */}
            <ReviewCard
              name="Sacrent"
              title="Majority of meals are fantastic!"
              content="Everything is sent out on Thursdays, comes packed neatly alongside ice packs so the food is always kept cold even."
            />
            {/* Review 4 */}
            <ReviewCard
              name="Volibear"
              title="Best Online Fashion Site"
              content="I'm impressed with the durability of the furniture collection. Even after years of use, the pieces still look."
            />
          </div>

          {/* Dots Navigation Mockup */}
          <div className="flex items-center justify-center gap-2">
            <button className="w-5 h-5 rounded-full border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
            </button>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Blog Post Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-12">
            Blog post
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlogCard
              title="Eco-Friendly Corporate Gifts"
              imageColor="bg-amber-50"
            />
            <BlogCard
              title="Need more time before Christmas arrives? We know how to find it"
              imageColor="bg-orange-50"
            />
            <BlogCard
              title="Gift ideas for Mum this Mother's Day"
              imageColor="bg-slate-50"
            />
          </div>
        </div>
      </section>

      {/* Purple Banner Section */}
      <section className="bg-[#a78bfa] bg-gradient-to-r from-purple-400 to-purple-500 py-16 px-6 md:px-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-purple-800/20 rounded-full flex items-center justify-center shrink-0">
              {/* Mail Icon Mockup */}
              <div className="w-12 h-12 bg-yellow-400 rounded-md relative flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎁</span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Professional gift solutions
              </h2>
              <p className="text-white/90 text-lg">
                Send 1-1,000+ customised eGift cards instantly with Ecomus
                Business!
              </p>
            </div>
          </div>
          <button className="border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-purple-600 transition-colors">
            Learn more
          </button>
        </div>
      </section>
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
