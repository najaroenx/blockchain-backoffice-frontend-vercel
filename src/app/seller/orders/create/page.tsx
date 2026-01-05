"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { BrowseProductsModal } from "@/components/seller/BrowseProductsModal";
import { useVoucher } from "../../hooks/useVoucher";
import { ModalCustom } from "@/components/ui/ModalCustom";
import { Spinner } from "@/components/ui/Spinner";
import { useListToMarketplace } from "../../hooks/useListToMarketplace";
import { useListToMarketplaceStore } from "../../hooks/useListToMarketplaceStore";
// Types
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}
export interface IVoucher {
  id: string; // voucherId
  name: string;
  description: string;
  value: number;
  valueType: string;
  imageUrl: string;
  totalIssued: number;
  quantity: number;
  stats: {
    availableForSale: number;
    listedCodes: number;
    soldCodes: number;
    totalCodes: number;
  };
}
interface IFetchVoucher {
  count: number;
  vouchers: IVoucher[];
}

interface OrderStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<IVoucher[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [voucherList, setVoucherList] = useState<IFetchVoucher | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  //   Hooks
  const { vouchers, isLoading, isError } = useVoucher();
  const { orders, loadingOrders, errorOrders, addOrder } =
    useListToMarketplaceStore();
  const {
    listToMarketplace,
    isLoadingCreateOrder,
    isErrorCreateOrder,
    errorCreateOrder,
    dataCreateOrder,
  } = useListToMarketplace();

  // Filter products based on search
  const filteredProducts = voucherList?.vouchers.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Add product from search
  const handleAddProductFromSearch = (product: IVoucher) => {
    const exists = selectedProducts.some((p) => p.id === product.id);
    if (!exists) {
      setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
    }
    setSearchProduct("");
    setShowSearchDropdown(false);
  };

  // Customer form state
  const [customerForm, setCustomerForm] = useState({
    firstName: "Nacharern",
    lastName: "Nernsai",
    email: "nacharern.nernsai@gmail.com",
    phoneCode: "+66",
    phoneNumber: "812345678",
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    country: "TH",
    address: "414 AIS Tower 1",
    city: "Bangkok",
    postalCode: "10110",
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "credit_card",
    cardHolderName: "Nacharern Nernsai",
    cardNumber: "4111111111111111",
    expirationDate: "12/25",
    cvv: "123",
  });

  // Order steps
  const steps: OrderStep[] = [
    {
      id: 1,
      title: "Select products",
      description: "Add product to purchase list.",
      icon: <ShoppingCartOutlinedIcon className="w-5 h-5" />,
      isActive: currentStep === 1,
      isCompleted: currentStep > 1,
    },
    {
      id: 2,
      title: "Customer details",
      description:
        "Enter customer information like name, email & phone number.",
      icon: <PersonOutlineIcon className="w-5 h-5" />,
      isActive: currentStep === 2,
      isCompleted: currentStep > 2,
    },
    {
      id: 3,
      title: "Address Information",
      description: "Provide shipping address details.",
      icon: <LocationOnOutlinedIcon className="w-5 h-5" />,
      isActive: currentStep === 3,
      isCompleted: currentStep > 3,
    },
    {
      id: 4,
      title: "Payment",
      description:
        "Enter payment method and details to complete the transaction.",
      icon: <PaymentOutlinedIcon className="w-5 h-5" />,
      isActive: currentStep === 4,
      isCompleted: currentStep > 4,
    },
  ];

  // Section IDs mapping
  const sectionIds: { [key: number]: string } = {
    1: "section-products",
    2: "section-customer",
    3: "section-address",
    4: "section-payment",
  };

  // Scroll to section when clicking step
  const scrollToSection = (stepId: number) => {
    setCurrentStep(stepId);
    const sectionId = sectionIds[stepId];
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculate total
  const total = selectedProducts.reduce(
    (sum, product) => sum + product.value * product.quantity,
    0
  );

  // Handle quantity change
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  // Remove product
  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerForm({
      ...customerForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { selectedProducts, customerForm });
    setIsProcessing(true);
    try {
      // Call the POST API with your data
      const reqBody: any[] = [];
      selectedProducts.forEach((product) => {
        reqBody.push({
          voucherId: product.id,
          amount: product.quantity,
          pricePerUnitTHB: product.value,
          sellerWalletAddress: "0xf5e40ec8bfa4818278c04489b34a486281658e5c", //TODO: fix later
          total: product.value * product.quantity ,
        });
      });
      reqBody.map(async (body, index) => {
        console.log(`items-${index}`, body);
        await addOrder(body);
      });

      setIsSuccess(true);
    } catch (err) {
      console.error("Error:", err);
      setIsProcessing(false);
      // Handle error
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle products selected from modal
  const handleProductsSelected = (products: IVoucher[]) => {
    setSelectedProducts(products);
  };

  useEffect(() => {
    if (vouchers && vouchers.vouchers.length > 0) {
      vouchers?.vouchers.forEach((voucher: any) => {
        voucher.quantity =
          voucher.stats.availableForSale - voucher.stats.listedCodes;
      });
    }
    console.log("vouchers", vouchers);
    setVoucherList(vouchers);
  }, [vouchers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Create Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Steps */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    step.isActive
                      ? "bg-blue-50 border border-blue-200"
                      : step.isCompleted
                      ? "bg-green-50 border border-green-200"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => scrollToSection(step.id)}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      step.isActive
                        ? "bg-blue-100 text-blue-600"
                        : step.isCompleted
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-sm ${
                        step.isActive
                          ? "text-blue-800"
                          : step.isCompleted
                          ? "text-green-800"
                          : "text-slate-700"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Products Section */}
          <div
            id="section-products"
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Select products
            </h2>

            {/* Search and Browse */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search product"
                  value={searchProduct}
                  onChange={(e) => {
                    setSearchProduct(e.target.value);
                    setShowSearchDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => {
                    if (searchProduct.length > 0) {
                      setShowSearchDropdown(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay to allow click on dropdown items
                    setTimeout(() => setShowSearchDropdown(false), 200);
                  }}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
                <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

                {/* Search Dropdown */}
                {showSearchDropdown &&
                  filteredProducts &&
                  filteredProducts?.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
                      {filteredProducts?.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleAddProductFromSearch(product)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {/* Product Image */}
                          <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-lg">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={40}
                                height={40}
                              />
                            </div>
                          </div>
                          {/* Product Name */}
                          <span className="font-medium text-slate-700 text-sm">
                            {product.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
              >
                Browse products
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-slate-400"
                      >
                        No product selected!
                      </td>
                    </tr>
                  ) : (
                    selectedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-slate-50 hover:bg-slate-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden">
                              {/* Product image placeholder */}
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={50}
                                height={50}
                              />
                            </div>
                            <span className="font-medium text-slate-800">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4 text-slate-600">
                          {product.value.toFixed(2)}
                        </td>
                        <td className="text-right py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                handleQuantityChange(
                                  product.id,
                                  product.quantity - 1
                                );
                              }}
                              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">
                              {product.quantity || "ยังไม่พร้อมใช้งาน"}
                            </span>
                            <button
                              onClick={() => {
                                if (
                                  product.quantity <
                                  product.stats.availableForSale -
                                    product.stats.listedCodes
                                ) {
                                  handleQuantityChange(
                                    product.id,
                                    product.quantity + 1
                                  );
                                }
                              }}
                              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <DeleteOutlineIcon />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100">
              <div className="text-right">
                <span className="text-slate-500 mr-4">Total:</span>
                <span className="text-xl font-bold text-slate-800">
                  {total.toFixed(2)} B
                </span>
              </div>
            </div>
          </div>

          {/* Customer Details Section */}
          <div
            id="section-customer"
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Customer details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={customerForm.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  User Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={customerForm.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={customerForm.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Phone number
                </label>
                <div className="flex gap-3">
                  <div className="relative">
                    <select
                      value={customerForm.phoneCode}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          phoneCode: e.target.value,
                        })
                      }
                      className="appearance-none px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    >
                      <option value="+66">🇹🇭 +66</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+81">🇯🇵 +81</option>
                    </select>
                    <KeyboardArrowDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={customerForm.phoneNumber}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div
            id="section-address"
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Address Information
            </h2>

            <div className="space-y-6">
              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Country
                </label>
                <div className="relative">
                  <select
                    id="country"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    className="w-full appearance-none px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  >
                    <option value="">Select country...</option>
                    <option value="TH">Thailand</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="JP">Japan</option>
                    <option value="SG">Singapore</option>
                  </select>
                  <KeyboardArrowDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Address"
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-slate-600 mb-2"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-slate-600 mb-2"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    placeholder="Postal Code"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div
            id="section-payment"
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-6">Payment</h2>

            <div className="space-y-6">
              {/* Payment Method */}
              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Payment method
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                      <PaymentOutlinedIcon className="w-3 h-3 text-blue-600" />
                    </div>
                  </div>
                  <select
                    id="paymentMethod"
                    value={paymentForm.paymentMethod}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full appearance-none pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  >
                    <option value="credit_card">Credit/Debit card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="promptpay">PromptPay</option>
                  </select>
                  <KeyboardArrowDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                </div>
              </div>

              {/* Card Holder Name */}
              <div>
                <label
                  htmlFor="cardHolderName"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  User Name
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  placeholder="Card holder name"
                  value={paymentForm.cardHolderName}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      cardHolderName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              {/* Credit Card Number */}
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-slate-600 mb-2"
                >
                  Credit card number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="•••• •••• •••• ••••"
                  value={paymentForm.cardNumber}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      cardNumber: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              {/* Expiration Date and CVV */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="expirationDate"
                    className="block text-sm font-medium text-slate-600 mb-2"
                  >
                    Expiration date
                  </label>
                  <input
                    type="text"
                    id="expirationDate"
                    placeholder="••/••"
                    value={paymentForm.expirationDate}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        expirationDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-slate-600 mb-2"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="•••"
                    value={paymentForm.cvv}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        cvv: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions - Sticky */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-slate-200 px-6 py-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <DeleteOutlineIcon className="w-5 h-5" />
            Discard
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all"
          >
            Create
          </button>
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-20"></div>

      {/* Browse Products Modal */}
      <BrowseProductsModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onConfirm={handleProductsSelected}
        existingProducts={voucherList?.vouchers || []}
      />
      {/* Modal during create*/}
      <ModalCustom
        isOpen={isLoadingCreateOrder}
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
      {/* Modal during create*/}
      <ModalCustom
        isOpen={isSuccess}
        title="ระบบกำลังดำเนินการ"
        confirmText="ยืนยัน"
        // cancelText="Keep Editing"
        onConfirm={() => router.push("/seller/orders/list")}
        // onCancel={() => setShowDiscardModal(false)}
      >
        <div className="flex flex-col items-center justify-center gap-2 my-10">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm text-black font-semibold text-slate-500">
            ดำเนินการสำเร็จ และรอการยืนยันจากระบบ
          </p>
        </div>
      </ModalCustom>
    </div>
  );
}
