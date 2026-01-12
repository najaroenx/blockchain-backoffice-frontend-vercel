import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.BACKEND_URL;
const SHOULD_PROTECT_ADMIN = process.env.SHOULD_PROTECT_ADMIN === "true";

export async function GET(req: NextRequest, { params }: { params: any }) {
  const merchantId = (await params).id;

  // Validate merchantId
  if (!merchantId || !/^[a-zA-Z0-9_-]+$/.test(merchantId)) {
    return Response.json({ error: "Invalid merchant ID" }, { status: 400 });
  }

  const shouldProtectAdmin = SHOULD_PROTECT_ADMIN;
  const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";

  if (shouldProtectAdmin && !token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse query params
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    console.log(
      `Fetching point transactions from backend ${BACKEND_URL}/point/transaction/${merchantId}`
    );

    const response = await api(
      `${BACKEND_URL}/point/transaction/${merchantId}`,
      {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        queryParams: {
          ...(type ? { type } : {}),
          limit: limit.toString(),
          offset: offset.toString(),
        },
      }
    );

    if (!response.ok) {
      // Return mock data for development
      const mockTransactions = [
        {
          id: "TX-001",
          type: "transfer",
          fromUser: "0812345678",
          toUser: "0898765432",
          amount: 500,
          pointSymbol: "PTS",
          pointName: "Loyalty Point",
          status: "completed",
          createdAt: new Date().toISOString(),
        },
        {
          id: "TX-002",
          type: "mint",
          fromUser: "System",
          toUser: "0812345678",
          amount: 1000,
          pointSymbol: "PTS",
          pointName: "Loyalty Point",
          status: "completed",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "TX-003",
          type: "redeem",
          fromUser: "0898765432",
          toUser: "Merchant",
          amount: 200,
          pointSymbol: "PTS",
          pointName: "Loyalty Point",
          status: "pending",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: "TX-004",
          type: "transfer",
          fromUser: "0891234567",
          toUser: "0823456789",
          amount: 150,
          pointSymbol: "PTS",
          pointName: "Loyalty Point",
          status: "completed",
          createdAt: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: "TX-005",
          type: "mint",
          fromUser: "System",
          toUser: "0867890123",
          amount: 2500,
          pointSymbol: "PTS",
          pointName: "Loyalty Point",
          status: "completed",
          createdAt: new Date(Date.now() - 345600000).toISOString(),
        },
      ];

      return Response.json(mockTransactions);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching point transactions:", error);

    // Return mock data on error for development
    const mockTransactions = [
      {
        id: "TX-001",
        type: "transfer",
        fromUser: "0812345678",
        toUser: "0898765432",
        amount: 500,
        pointSymbol: "PTS",
        pointName: "Loyalty Point",
        status: "completed",
        createdAt: new Date().toISOString(),
      },
      {
        id: "TX-002",
        type: "mint",
        fromUser: "System",
        toUser: "0812345678",
        amount: 1000,
        pointSymbol: "PTS",
        pointName: "Loyalty Point",
        status: "completed",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    return Response.json(mockTransactions);
  }
}
