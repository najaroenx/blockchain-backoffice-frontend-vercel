import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/options";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function POST(req: Request, { params }: { params: any }) {
  const body = await req.json();
  const session = await getServerSession(authOptions);
  const token = session?.user.accessToken;

  const merchantId = req.headers.get("Merchant-Id");

  const pointId = params.id;

  if (!merchantId) {
    return Response.json({ message: "bad request" }, { status: 400 });
  }

  try {
    // TODO: change email and transactionTypeId from hardcode to real data
    await api(`${BACKEND_URL}/${merchantId}/point/${pointId}/transaction`, {
      method: "POST",
      body: {
        ...body,
        email: "parametprame2@gmail.com",
        transactionTypeId: "redeem",
        amount: parseInt(body.amount),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
