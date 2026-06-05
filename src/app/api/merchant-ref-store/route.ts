import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

// ============================================
// MerchantRefStore Types
// ============================================

export interface MerchantRefStoreResponse {
  id: string;
  merchantRef: string;
  name: string;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
  locationUrl: string | null;
  website: string | null;
  merchantId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedMerchantRefStoreResponse {
  data: MerchantRefStoreResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// GET Handler
// ============================================

export async function GET(req: Request) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const queryString = searchParams.toString();

    // Proxy request to backend: /merchant-ref-store
    const backendUrl = `${BACKEND_URL}/merchant-ref-store${queryString ? `?${queryString}` : ""}`;
    logger.info(`Fetching merchant ref stores from ${backendUrl}`);

    const response = await api(backendUrl, {
      method: "GET",
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    // Return backend response directly
    return Response.json(response as PaginatedMerchantRefStoreResponse, {
      status: 200,
    });
  } catch (error) {
    logger.error(`Error fetching merchant ref stores: ${error}`);
    return Response.json(
      { error: "failed to load merchant ref stores" },
      { status: 500 }
    );
  }
}
