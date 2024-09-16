import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/options";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user.accessToken;

    const merchantId = req.headers.get("Merchant-Id");

    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const { transactions, counts } = await api(
      `${BACKEND_URL}/transaction/${merchantId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return Response.json(transactions, {
      headers: {
        "X-Total-Count": counts.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
