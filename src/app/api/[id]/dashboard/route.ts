import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { mockDashboard } from "@/data/mockAdmin";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: Request, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;

    if (!merchantId) {
      return Response.json({
        customerWallet: 0,
        transactionsToday: 0,
        totalRedeem: 0,
        totalTransfer: 0,
      });
    }

    if (!shouldProtectAdmin) {
      return Response.json(mockDashboard);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    const response = await api(`${BACKEND_URL}/dashboard/${merchantId}/`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json({
      customerWallet: response.customerWallet,
      transactionsToday: response.transactionsToday,
      totalRedeem: response.totalRedeem,
      totalTransfer: response.totalTransfer,
      transactionsMonthly: response.transactionsMonthly,
      transactionsRedeemMonthly: response.transactionsRedeemMonthly,
      transactionsTransferMonthly: response.transactionsTransferMonthly,
      transactions: response.allTransactions.transactions,
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
