import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { mockPoints } from "@/data/mockAdmin";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: Request, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;

    if (!shouldProtectAdmin) {
      if (!merchantId) {
        return Response.json([], {
          headers: {
            "X-Total-Count": "0",
            "Access-Control-Expose-Headers": "X-Total-Count",
          },
        });
      }
      const points = mockPoints.filter(
        (point) => point.merchantId === merchantId
      );
      return Response.json(points, {
        headers: {
          "X-Total-Count": points.length.toString(),
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const backendUrl = `${BACKEND_URL}/${merchantId}/point/`;
    logger.info(`Forwarding backend request: GET ${backendUrl}`);

    const response = await api(backendUrl, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response.points, {
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
export async function POST(req: Request, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  const body = await req.json();

  const merchantId = params.id;


  const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
  if (shouldProtectAdmin && !token) {
    return handleError("Unauthorized access", 401);
  }

  if (!merchantId) {
    return Response.json({ message: "bad request" }, { status: 400 });
  }

  try {
    const backendUrl = `${BACKEND_URL}/${merchantId}/point`;
    logger.info(`Forwarding backend request: POST ${backendUrl}`);

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
