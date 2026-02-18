"use server";

import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

// Mock data for development
const mockMarketerDashboard: DashboardData = {
  dateRange: { startDate: "2026-01-01", endDate: "2026-01-12" },
  couponCount: { total: 18, unsold: 10, sold: 8, unredeemed: 5, redeemed: 3 },
  couponValue: {
    total: 18000,
    unsold: 10000,
    sold: 8000,
    unredeemed: 5000,
    redeemed: 3000,
  },
  couponValueByCurrency: [],
  endUsers: { total: 1, unredeemedUsers: 3, redeemedUsers: 1 },
  transactions: { transferPoint: 0, purchaseCoupon: 0 },
  points: [{ symbol: "subtawecoin", total: 1000000, balance: 989998 }],
  thbToken: { deposited: 0, balance: 0, bought: 0 },
};

const emptyDashboard: DashboardData = {
  dateRange: { startDate: "", endDate: "" },
  couponCount: { total: 0, unsold: 0, sold: 0, unredeemed: 0, redeemed: 0 },
  couponValue: { total: 0, unsold: 0, sold: 0, unredeemed: 0, redeemed: 0 },
  couponValueByCurrency: [],
  endUsers: { total: 0, unredeemedUsers: 0, redeemedUsers: 0 },
  transactions: { transferPoint: 0, purchaseCoupon: 0 },
  points: [],
  thbToken: { deposited: 0, balance: 0, bought: 0 },
};

export const getDashboardData = async (
  merchantId: string,
  options?: { startDate?: string; endDate?: string; couponIds?: string },
): Promise<DashboardData> => {
  logger.info(`Fetching marketer dashboard for merchant: ${merchantId}`);

  try {
    if (!merchantId) {
      return emptyDashboard;
    }

    if (!shouldProtectAdmin) {
      return mockMarketerDashboard;
    }

    const token = (await getSessionToken()) ?? "";
    if (!token) {
      throw new Error("Unauthorized access");
    }
    console.log("quertParams:", {
      url: `${BACKEND_URL}/dashboard/marketer/${merchantId}`,
      startDate: options?.startDate ?? "",
      endDate: options?.endDate ?? "",
      ...(options?.couponIds ? { couponIds: options.couponIds } : {}),
    });
    const response = await api(
      `${BACKEND_URL}/dashboard/marketer/${merchantId}`,
      {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        queryParams: {
          startDate: options?.startDate ?? "",
          endDate: options?.endDate ?? "",
          ...(options?.couponIds ? { couponIds: options.couponIds } : {}),
        },
      },
    );
    console.log("Raw Dashboard Response:", response);
    if (response.statusCode) {
      throw new Error(response.message || "Failed to fetch dashboard data");
    }

    return response as DashboardData;
  } catch (error) {
    logger.error(`Error fetching marketer dashboard: ${error}`);
    return emptyDashboard;
  }
};
export const getCouponData = async (merchantId: string) => {
  // Implement API call to fetch coupon data for the dashboard
  const token = (await getSessionToken()) ?? "";
  if (!token) {
    throw new Error("Unauthorized access");
  }

  const response = await api(
    `${BACKEND_URL}/dashboard/marketer/${merchantId}/coupons`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (response.statusCode) {
    throw new Error(response.message || "Failed to fetch coupon data");
  }
  let data = [{ id: "all", name: "All Coupons" }];
  if (response && response.coupons && Array.isArray(response.coupons)) {
    data = data.concat(response.coupons);
  }
  return { coupons: data } as CouponData;
};

export interface DashboardData {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  couponCount: {
    total: number;
    unsold: number;
    sold: number;
    unredeemed: number;
    redeemed: number;
  };
  couponValue: {
    total: number;
    unsold: number;
    sold: number;
    unredeemed: number;
    redeemed: number;
  };
  couponValueByCurrency: {
    currency: string;
    total: number;
    unsold: number;
    sold: number;
    unredeemed: number;
    redeemed: number;
  }[];
  endUsers: {
    total: number;
    unredeemedUsers: number;
    redeemedUsers: number;
  };
  transactions: {
    transferPoint: number;
    purchaseCoupon: number;
  };
  points: Ipoints[];
  thbToken: {
    deposited: number;
    balance: number;
    bought: number;
  };
}
export interface Ipoints {
  symbol: string;
  total: number;
  balance: number;
}
export interface CouponData {
  coupons: {
    id: string;
    name: string;
  }[];
}
