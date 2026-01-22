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
 * Get seller's vouchers
 * Real backend endpoint: /coupon/seller/vouchers?merchantId=xxx
 */
export async function GET(req: Request) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    // Parse query parameters
    const url = new URL(req.url);
    const merchantId = url.searchParams.get("merchantId");

    if (!merchantId) {
      return handleError("merchantId query parameter is required", 400);
    }

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
