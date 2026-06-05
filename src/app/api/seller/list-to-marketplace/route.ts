import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function POST(req: Request) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  const body = await req.json();
  try {
    const response = await api(
      `${BACKEND_URL}/coupon/seller/list-on-marketplace`,
      {
        method: "POST",
        body,
      }
    );
    console.log(response);
    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json({ message: "success" }, { status: 201 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  logger.info(`Received request: ${req.method} ${req.url}`);
  const walletAddress = req.url.split("?")[1];
  console.log(walletAddress);
  try {
    const response = await api(
      `${BACKEND_URL}/coupon/seller/vouchers?walletAddress=0xf5e40ec8bfa4818278c04489b34a486281658e5c`,
      {
        method: "GET",
      }
    );
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
