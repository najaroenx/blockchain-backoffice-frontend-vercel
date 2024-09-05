import { db } from "@/db";
import { createNewPointToken } from "@/service/blockchain/createNewPointToken";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const [count, points] = await db.$transaction([
      db.point.count({
        where: {
          Merchant: {
            userMerchant: {
              some: {
                userId: userId,
              },
            },
          },
        },
      }),
      db.point.findMany({
        where: {
          Merchant: {
            userMerchant: {
              some: {
                userId: session?.user.id as string,
              },
            },
          },
        },
      }),
    ]);

    return Response.json(points, {
      headers: {
        "X-Total-Count": count.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (err) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    symbol,
    initialSupply,
    decimal,
    frameSize,
    slotSize,
    merchantId,
  } = body;

  try {
    // TODO: authorize user before create point

    const pointContractAddress = await createNewPointToken({
      name,
      symbol,
      decimal,
      slotSize,
      frameSize,
      initialSupply,
    });

    await db.point.create({
      data: {
        name,
        symbol,
        initialSupply,
        decimal,
        frameSize,
        slotSize,
        contractAddress: pointContractAddress,
        merchantId: merchantId,
      },
    });
    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
