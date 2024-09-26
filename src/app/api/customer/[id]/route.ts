import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const merchantId = req.headers.get("Merchant-Id");
    const pointId = params.id;

    if (!merchantId) {
      return Response.json({ message: "bad request" }, { status: 400 });
    }

    const response = await api(
      `${BACKEND_URL}/${merchantId}/customer/${pointId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response.customer, { status: 200 });
  } catch (err) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
