import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/options";
import { api } from "@/libs/api";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user.accessToken;

    const { merchants, counts } = await api(`${BACKEND_URL}/merchant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json(merchants, {
      headers: {
        "X-Total-Count": counts.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (err) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    const token = session?.user.accessToken;
    const userId = session?.user.id;

    await api(`${BACKEND_URL}/merchant`, {
      method: "POST",
      body: {
        ...body,
        userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
