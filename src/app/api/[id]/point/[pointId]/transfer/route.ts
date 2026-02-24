import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";
export async function POST(req: Request, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url} , test`);

  const body = await req.json();

  const merchantId = params.id;
  const pointId = params.pointId;

  if (!merchantId) {
    return Response.json({ message: "bad request" }, { status: 400 });
  }

  if (!shouldProtectAdmin) {
    return Response.json({ message: "success" }, { status: 201 });
  }

  const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
  if (shouldProtectAdmin && !token) {
    return handleError("Unauthorized access", 401);
  }

  try {
    const backendUrl = `${BACKEND_URL}/${merchantId}/transaction/${pointId}`;
    logger.info(`Forwarding backend request: POST ${backendUrl}`);
    logger.info(
      `Forwarding backend request: POST BODY ${JSON.stringify(body)}`
    );
    const response = await api(backendUrl, {
      method: "POST",
      body: {
        ...body,
      },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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