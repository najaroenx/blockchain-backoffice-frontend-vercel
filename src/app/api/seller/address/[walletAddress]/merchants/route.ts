import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

// ============================================
// GET Handler
// ============================================

export async function GET(
  req: Request,
  { params }: { params: { walletAddress: string } },
) {
  const { walletAddress: merchantId } = params;
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

    const backendUrl = `${BACKEND_URL}/dashboard/seller/${merchantId}/merchants${queryString ? `?${queryString}` : ""}`;
    logger.info(
      `Fetching seller merchants for merchantId: ${merchantId} from ${backendUrl}`,
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
    logger.error(`Error fetching seller merchants: ${error}`);
    return Response.json(
      { error: "failed to load seller merchants" },
      { status: 500 },
    );
  }
}
