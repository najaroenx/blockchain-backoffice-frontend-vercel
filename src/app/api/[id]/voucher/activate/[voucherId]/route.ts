import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; voucherId: string } }
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;
    const voucherId = params.voucherId;

    if (!merchantId || !voucherId) {
      return handleError("Missing merchantId or voucherId", 400);
    }

    const token = (await getSessionToken()) ?? "";
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const body = await req.json();
    const { pointsCost, amount } = body;

    // Validate input
    if (typeof pointsCost !== "number" || pointsCost < 0) {
      return handleError("Invalid pointsCost", 400);
    }

    if (typeof amount !== "number" || amount <= 0) {
      return handleError("Invalid amount", 400);
    }

    logger.info(`Activating voucher ${voucherId} with pointsCost: ${pointsCost}, amount: ${amount}`);

    const response = await api(`${BACKEND_URL}/coupon/activate/${voucherId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        pointsCost,
        amount,
      },
    });

    if (response.statusCode) {
      return handleError(response.message ?? "Failed to activate voucher", response.statusCode);
    }

    logger.info(`Voucher ${voucherId} activated successfully`);

    return Response.json(
      { 
        message: "Voucher activated successfully",
        voucher: response 
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      { error: "Failed to activate voucher" },
      { status: 500 }
    );
  }
}
