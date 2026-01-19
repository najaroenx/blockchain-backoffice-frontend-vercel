import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { mockTransactions } from "@/data/mockAdmin";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: Request, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;

    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    if (!shouldProtectAdmin) {
      return Response.json(mockTransactions, {
        headers: {
          "X-Total-Count": mockTransactions.length.toString(),
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    const response = await api(`${BACKEND_URL}/${merchantId}/transaction/`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }
    console.log(response.transactions);
    return Response.json(response.transactions, {
      headers: {
        "X-Total-Count": response.counts.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
