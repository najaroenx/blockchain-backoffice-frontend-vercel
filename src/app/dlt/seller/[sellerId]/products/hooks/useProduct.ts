import { useState, useCallback } from "react";
import { api } from "@/libs/api";
// import axios from "axios";

export interface Product {
  id?: string;
  name: string;
  code: string;
  description: string;
  price: number;
  costPrice: number;
  category?: string;
  tags?: string[];
  brand?: string;
  image?: string;
  quantity?: number;
  sales?: number;
  totalIssued?: number;
}
export enum CouponValueType {
  AISPOINT = "aispoint",
}
export enum CouponStatus {
  UPCOMING = "upcoming",
  COMMING = "coming",
  ONGOING = "ongoing",
  ENDED = "ended",
}
export interface ProductRequest {
  sellerWalletAddress: string; // คนขาย
  coupon: {
    name: string;
    description: string;
    status: string; // "upcoming"
    merchantId: string | null;
    valueType: string;
    value: number; // มูลค่าที่คูปองจะทำงาน
    pointId: null;
    pointsCost: number; // จำนวนที่ end user ซื้อด้วย point
    startDate: string;
    endDate: string;
    totalIssued: number;
    imageUrl: string;
    merchantRef: string;
  };
}

export interface IProductResponse {
  count: number;
  vouchers: {
    id: string;
    name: string;
    description: string;
    value: string;
    imageUrl: string;
    tokenId: number;
    totalIssued: number;
    totalRedeemed: number;
    valueType: string;
  }[];
}

interface UseProductReturn {
  isLoading: boolean;
  error: string | null;
  createProduct: (data: ProductRequest) => Promise<any>;
  getProducts: (params?: Record<string, any>) => Promise<any>;
  getProduct: (id: string) => Promise<Product | null>;
}

export const useProduct = (): UseProductReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(async (data: ProductRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Request:", data);
      const result = await fetch(`/api/seller`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log("Result:", result);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProducts = useCallback(async (params?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams(params || {}).toString();
      const result = await fetch(`/api/seller?${searchParams}`);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`,
        {
          method: "GET",
        }
      );
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to fetch product");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createProduct,
    getProducts,
    getProduct,
  };
};
