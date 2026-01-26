import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export interface UserDashboardDateRange {
  startDate: string;
  endDate: string;
}

export interface UserDashboardCouponSummary {
  soldToEndUser: number;
  pendingUse: number;
  redeemed: number;
}

export interface UserDashboardEndUserSummary {
  total: number;
  buyers: number;
  couponsSold: number;
  pendingUsers: number;
  redeemedUsers: number;
}

export interface UserDashboardMyMerchantSummary {
  coupon: UserDashboardCouponSummary;
  endUser: UserDashboardEndUserSummary;
}

export interface UserDashboardData {
  dateRange: UserDashboardDateRange;
  merchantRef: string;
  myMerchantSummary: UserDashboardMyMerchantSummary;
}

export interface UserDashboardResponse {
  status: string;
  message: string;
  data: UserDashboardData;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  logger.info(
    `Received request: ${req.method} ${req.url} for merchantRef: ${id}`,
  );

  try {
    if (!id) {
      return handleError("merchantRef (id) is required", 400);
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const queryString = searchParams.toString();

    // Proxy request to backend: /dashboard/merchantref/{merchantRef}
    const backendUrl = `${BACKEND_URL}/dashboard/merchantref/${id}${queryString ? `?${queryString}` : ""}`;
    logger.info(
      `Fetching dashboard data for merchantRef: ${id} from ${backendUrl}`,
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
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
