import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/options";
import { api } from "@/libs/api";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user.accessToken;

    const merchantId = req.headers.get("Merchant-Id");
    const pointId = params.id;

    if (!merchantId) {
      return Response.json({ message: "bad request" }, { status: 400 });
    }

    const { customer } = await api(
      `${BACKEND_URL}/${merchantId}/customer/${pointId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return Response.json(customer, { status: 200 });
  } catch (err) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
