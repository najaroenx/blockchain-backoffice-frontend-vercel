import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: Request) {
  try {
    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const merchantId = req.headers.get("Merchant-Id");

    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const response = await api(`${BACKEND_URL}/${merchantId}/point/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
  } catch (err) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  const body = await req.json();

  const token = await getSessionToken();
  if (!token) {
    return handleError("Unauthorized access", 401);
  }

  const merchantId = req.headers.get("Merchant-Id");

  if (!merchantId) {
    return Response.json({ message: "bad request" }, { status: 400 });
  }

  try {
    const response = await api(`${BACKEND_URL}/${merchantId}/point`, {
      method: "POST",
      body: {
        ...body,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
