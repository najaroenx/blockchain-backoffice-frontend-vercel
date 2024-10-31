import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: Request) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const merchantId = req.headers.get("Merchant-Id");

    if (!merchantId) {
      return Response.json({
        customerWallet: 0,
        transactionsToday: 0,
        totalRedeem: 0,
        totalTransfer: 0,
      });
    }

    const response = await api(`${BACKEND_URL}/dashboard/${merchantId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
