import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

/**
 * POST /api/seller?merchantId=xxx
 * Create a new coupon as interim seller
 * Real backend endpoint: /coupon/dev/interim-seller/:merchantId
 * Body: { "coupon": { ... } }
 */
export async function POST(req: Request) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    // Get merchantId from query params
    const url = new URL(req.url);
    const merchantId = url.searchParams.get("merchantId");

    if (!merchantId) {
      return handleError("merchantId query parameter is required", 400);
    }

    const body = await req.json();
    const { coupon } = body;

    if (!coupon) {
      return handleError("coupon data is required", 400);
    }

    const backendUrl = `${BACKEND_URL}/coupon/dev/interim-seller/${merchantId}`;
    logger.info(`Forwarding to backend: POST ${backendUrl}`);

    const response = await api(backendUrl, {
      method: "POST",
      body: { coupon },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json({ message: "success", data: response }, { status: 201 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}

/**
 * GET /api/seller
 *
 * type=listings → Get seller marketplace listings
 *   1. Fetch merchant info to get walletAddress
 *   2. Call /coupon/seller/listings?walletAddress=xxx&page=&limit=&status=
 *
 * (default) → Get seller's vouchers
 *   Real backend endpoint: /coupon/seller/vouchers?merchantId=xxx
 */
export async function GET(req: Request) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    // Parse query parameters
    const url = new URL(req.url);
    const merchantId = url.searchParams.get("merchantId");
    const type = url.searchParams.get("type");

    if (!merchantId) {
      return handleError("merchantId query parameter is required", 400);
    }

    // ─── type=listings → /coupon/seller/listings ───
    if (type === "listings") {
      const page = url.searchParams.get("page") || "1";
      const limit = url.searchParams.get("limit") || "20";
      const status = url.searchParams.get("status") || "";

      logger.info(`Fetching marketplace listings for merchantId: ${merchantId}`);

      // 1. Fetch merchant info to get walletAddress
      const merchantResponse = await api(`${BACKEND_URL}/merchant/${merchantId}`, {
        method: "GET",
      });

      logger.info(`Merchant response: ${JSON.stringify(merchantResponse)}`);

      // api() unwraps "data", so response may be { merchant: { ... } } or the merchant directly
      const merchantData = merchantResponse?.merchant || merchantResponse;
      const walletAddress =
        merchantData?.wallet?.walletAddress || merchantData?.walletAddress;

      if (!walletAddress) {
        logger.error(`Wallet address not found in merchant response: ${JSON.stringify(merchantResponse)}`);
        return handleError("Merchant wallet address not found", 404);
      }

      // 2. Fetch seller listings using walletAddress
      const queryParams = new URLSearchParams({
        walletAddress,
        page,
        limit,
        ...(status ? { status } : {}),
      });

      const listingsUrl = `${BACKEND_URL}/coupon/seller/listings?${queryParams.toString()}`;
      logger.info(`Forwarding to backend: GET ${listingsUrl}`);

      const response = await api(listingsUrl, {
        method: "GET",
      });

      if (response.statusCode) {
        return handleError(response.message, response.statusCode);
      }

      return Response.json(
        { message: "success", data: response },
        { status: 200 }
      );
    }

    // ─── default → /coupon/seller/vouchers ───
    logger.info(`Fetching vouchers for merchantId: ${merchantId}`);

    const response = await api(
      `${BACKEND_URL}/coupon/seller/vouchers?merchantId=${merchantId}`,
      {
        method: "GET",
      }
    );

    logger.info(`test ${BACKEND_URL}/coupon/seller/vouchers?merchantId=${merchantId}`);

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(
      { message: "success", data: response },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
