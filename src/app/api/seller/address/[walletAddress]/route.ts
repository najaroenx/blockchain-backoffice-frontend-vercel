import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";
import type { RouteContext } from "@/libs/nextRoute";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

// ============================================
// Seller Dashboard Types
// ============================================

export interface DateRangeInfo {
  startDate: string;
  endDate: string;
}

export interface SellerCouponCount {
  total?: number;
  unsold?: number;
  sold?: number;
  unreserved?: number;
  reserved?: number;
  unredeemed?: number;
  redeemed?: number;
}

export interface SellerCouponValue {
  sold?: number;
  unsold?: number;
  unreserved?: number;
  reserved?: number;
  unredeemed?: number;
  redeemed?: number;
  total?: number;
}

export interface SellerCouponValueWithCurrency extends SellerCouponValue {
  currency: string;
}

export interface SellerOverallSummary {
  couponCount: SellerCouponCount;
  couponValue: SellerCouponValue;
}

export interface SellerMerchantBreakdown {
  merchantId: string;
  merchantName: string;
  couponCount: SellerCouponCount;
  couponValue: SellerCouponValue;
}

export interface SellerDashboardResponse {
  dateRange: DateRangeInfo;
  overallSummary: SellerOverallSummary;
  merchants: SellerMerchantBreakdown[];
}

// ============================================
// GET Handler
// ============================================

export async function GET(
  req: Request,
  context: RouteContext<{ walletAddress: string }>,
) {
  const { walletAddress: merchantId } = await context.params;
  logger.info(
    `Received request: ${req.method} ${req.url} for merchantId: ${merchantId}`,
  );

  try {
    if (!merchantId) {
      return handleError("merchantId is required", 400);
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const queryString = searchParams.toString();

    // Proxy request to backend: /dashboard/seller/{merchantId}
    const backendUrl = `${BACKEND_URL}/dashboard/seller/${merchantId}${queryString ? `?${queryString}` : ""}`;
    logger.info(
      `Fetching seller dashboard data for merchantId: ${merchantId} from ${backendUrl}`,
    );

    const response = await api(backendUrl, {
      method: "GET",
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }
    // Return backend response directly (already matches SellerDashboardResponse)
    return Response.json(
      {
        message: "success",
        data: response as SellerDashboardResponse,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(`Error fetching seller dashboard: ${error}`);
    return Response.json(
      { error: "failed to load seller dashboard data" },
      { status: 500 },
    );
  }
}
