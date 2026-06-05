import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function POST(req: Request) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  const body = await req.json();

  try {
    const response = await api(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      body: {
        ...body,
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json({ message: "success" }, { status: 201 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
