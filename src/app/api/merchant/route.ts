import { db } from "@/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const [count, merchants] = await db.$transaction([
      db.merchant.count({
        where: {
          userMerchant: {
            some: {
              userId: userId,
            },
          },
        },
      }),
      db.merchant.findMany({
        where: {
          userMerchant: {
            some: {
              userId: userId,
            },
          },
        },
      }),
    ]);

    return Response.json(merchants, {
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
  try {
    const body = await req.json();
    const { name, website } = body;

    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    await db.merchant.create({
      data: {
        name,
        website,
        userMerchant: {
          create: {
            userId: userId,
          },
        },
      },
    });

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
