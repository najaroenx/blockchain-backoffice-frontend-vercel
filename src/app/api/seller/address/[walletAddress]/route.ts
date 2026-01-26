import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export interface DashboardDateRange {
  startDate: string;
  endDate: string;
}

export interface CouponCountStats {
  total: number;
  unsold: number;
  sold: number;
  unreserved: number;
  reserved: number;
  unredeemed: number;
  redeemed: number;
}

export interface CouponValueStats {
  sold: number;
  unreserved: number;
  reserved: number;
  unredeemed: number;
  redeemed: number;
}

export interface DashboardOverallSummary {
  couponCount: CouponCountStats;
  couponValue: CouponValueStats;
}

export interface DashboardMerchant {
  merchantId: string;
  merchantName: string;
  couponCount: CouponCountStats;
  couponValue: CouponValueStats;
}

export interface SellerDashboardData {
  dateRange: DashboardDateRange;
  overallSummary: DashboardOverallSummary;
  merchants: DashboardMerchant[];
}

export interface SellerDashboardResponse {
  status: string;
  message: string;
  data: SellerDashboardData;
}

export async function GET(
  req: Request,
  { params }: { params: { walletAddress: string } },
) {
  const { walletAddress } = params;
  logger.info(
    `Received request: ${req.method} ${req.url} for walletAddress: ${walletAddress}`,
  );

  try {
    if (!walletAddress) {
      return handleError("walletAddress is required", 400);
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const queryString = searchParams.toString();

    // Proxy request to backend: /dashboard/seller/{walletAddress}
    const backendUrl = `${BACKEND_URL}/dashboard/seller/${walletAddress}${queryString ? `?${queryString}` : ""}`;
    logger.info(
      `Fetching dashboard data for seller: ${walletAddress} from ${backendUrl}`,
    );

    const response = await api(backendUrl, {
      method: "GET",
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(
      {
        message: "success",
        data: response,
      } as Partial<SellerDashboardResponse>, // Typing the response partially since structure might match
      { status: 200 },
    );
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
