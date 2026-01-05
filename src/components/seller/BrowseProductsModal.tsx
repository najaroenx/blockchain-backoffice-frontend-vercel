"use client";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { IVoucher } from "@/app/seller/orders/create/page";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface BrowseProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedProducts: IVoucher[]) => void;
  existingProducts: IVoucher[];
}

export const BrowseProductsModal = ({
  isOpen,
  onClose,
  onConfirm,
  existingProducts = [],
}: BrowseProductsModalProps) => {
  const [selectedProducts, setSelectedProducts] = useState<IVoucher[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  // Initialize selected products from existing
  useEffect(() => {
    if (isOpen) {
      setSelectedProducts([]);
      setIsClosing(false);
    }
  }, [isOpen, existingProducts]);

  console.log(selectedProducts);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleToggleProduct = (product: IVoucher) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const isProductSelected = (productId: string) => {
    return selectedProducts.some((p) => p.id === productId);
  };

  const handleConfirm = () => {
    onConfirm(selectedProducts);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        // onClick={handleClose}
      />

      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-200 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800">All products</h2>
            <p className="text-sm text-slate-500">
              Add products to this order.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Product List */}
        <div className="px-6 py-4 max-h-80 overflow-y-auto">
          <div className="space-y-3">
            {existingProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleToggleProduct(product)}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${
                  isProductSelected(product.id)
                    ? "border-blue-300 bg-blue-50"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    isProductSelected(product.id)
                      ? "border-blue-500 bg-blue-500"
                      : "border-slate-300"
                  }`}
                >
                  {isProductSelected(product.id) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                {/* Product Image */}
                <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-xs">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={50}
                      height={50}
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-800 text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400">ID: {product.id}</p>
                </div>

                {/* Quantity */}
                <div className="text-right">
                  <span className="text-sm text-slate-500">
                    Qty:{" "}
                    <span className="font-medium"> {product.quantity}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseProductsModal;
