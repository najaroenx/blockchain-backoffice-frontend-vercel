import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

// ============================================
// Types
// ============================================

export interface SellerCouponItem {
  id: string;
  name: string;
}

export interface SellerCouponsResponse {
  coupons: SellerCouponItem[];
}

// ============================================
// GET Handler
// ============================================

export async function GET(
  req: Request,
  { params }: { params: { walletAddress: string } },
) {
  const { walletAddress: sellerMerchantId } = params;
  const url = new URL(req.url);
  const marketerMerchantId = url.searchParams.get("marketerMerchantId") || "";
  logger.info(
    `Received request: ${req.method} ${req.url} for sellerMerchantId: ${sellerMerchantId}, marketerMerchantId: ${marketerMerchantId}`,
  );

  try {
    if (!sellerMerchantId) {
      return handleError("sellerMerchantId is required", 400);
    }

    const backendUrl = `${BACKEND_URL}/dashboard/seller/${sellerMerchantId}/coupons${marketerMerchantId ? `?marketerMerchantId=${marketerMerchantId}` : ""}`;
    logger.info(
      `Fetching seller coupons for sellerMerchantId: ${sellerMerchantId} from ${backendUrl}`,
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
    logger.error(`Error fetching seller coupons: ${error}`);
    return Response.json(
      { error: "failed to load seller coupons" },
      { status: 500 },
    );
  }
}
