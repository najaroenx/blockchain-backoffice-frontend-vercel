import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

// ============================================
// MerchantRef Dashboard Types
// ============================================

export interface DateRangeInfo {
  startDate: string;
  endDate: string;
}

export interface MerchantRefCouponSummary {
  total: number; // จำนวนคูปองที่ขายให้ End User
  unredeemed: number; // จำนวนคูปองที่ End User ซื้อแต่ยังไม่ใช้
  redeemed: number; // จำนวนคูปองที่ End User redeem แล้วจริง ๆ
}

export interface MerchantRefEndUserSummary {
  total: number; // จำนวน End User ทั้งหมด
  unredeemedUsers: number; // จำนวน End User ที่ซื้อแต่ยังไม่ใช้
  redeemedUsers: number; // จำนวน End User ที่ redeem แล้ว
}

export interface MerchantRefMerchantSummary {
  coupon: MerchantRefCouponSummary;
  endUser: MerchantRefEndUserSummary;
}

export interface MerchantRefDashboardResponse {
  dateRange: DateRangeInfo;
  merchantRef: string;
  myMerchantSummary: MerchantRefMerchantSummary;
}

// ============================================
// GET Handler
// ============================================

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

    // Return backend response directly (already matches MerchantRefDashboardResponse)
    return Response.json(
      {
        message: "success",
        data: response as MerchantRefDashboardResponse,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
