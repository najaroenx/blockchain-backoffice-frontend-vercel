import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

// Mock data for development
const mockMarketerDashboard = {
  dateRange: {
    startDate: "2026-01-01",
    endDate: "2026-01-12",
    granularity: "daily",
  },
  couponCount: {
    owned: 18,
    purchased: 0,
    sold: 0,
    pending: 0,
    redeemed: 0,
  },
  couponValueTHB: {
    owned: 0,
    sold: 0,
    pending: 0,
    redeemed: 0,
  },
  couponValuePoint: {
    sold: 0,
    pending: 0,
    redeemed: 0,
  },
  endUsers: {
    total: 1,
    purchased: 1,
    couponsSold: 4,
    pending: 3,
    redeemed: 1,
  },
  transactions: {
    total: 0,
    transferPoint: {
      count: 0,
      percentage: 0,
    },
    redeemPoint: {
      count: 0,
      percentage: 0,
    },
  },
  points: {
    byType: [
      {
        type: "subtawecoin",
        initialSupply: 1000000,
        remaining: 989998,
      },
    ],
  },
  thbToken: {
    summary: {
      deposited: 0,
      spent: 0,
    },
    monthly: [
      { period: "2026-01-01", label: "Jan 1", deposited: 0, spent: 0 },
      { period: "2026-01-02", label: "Jan 2", deposited: 0, spent: 0 },
      { period: "2026-01-03", label: "Jan 3", deposited: 0, spent: 0 },
    ],
  },
};

export async function GET(req: NextRequest, { params }: { params: any }) {
  logger.info(`Received request MARKETER DASHBOARD: ${req.method} ${req.url}`);

  // Get query params
  const startDate = req.nextUrl.searchParams.get("startDate") ?? "";
  const endDate = req.nextUrl.searchParams.get("endDate") ?? "";
  //   const granularity = req.nextUrl.searchParams.get("granularity") ?? "daily";

  try {
    const merchantId = params.id;

    if (!merchantId) {
      return Response.json({
        dateRange: { startDate: "", endDate: "", granularity: "daily" },
        couponCount: {
          owned: 0,
          purchased: 0,
          sold: 0,
          pending: 0,
          redeemed: 0,
        },
        couponValueTHB: { owned: 0, sold: 0, pending: 0, redeemed: 0 },
        couponValuePoint: { sold: 0, pending: 0, redeemed: 0 },
        endUsers: {
          total: 0,
          purchased: 0,
          couponsSold: 0,
          pending: 0,
          redeemed: 0,
        },
        transactions: {
          total: 0,
          transferPoint: { count: 0, percentage: 0 },
          redeemPoint: { count: 0, percentage: 0 },
        },
        points: { byType: [] },
        thbToken: { summary: { deposited: 0, spent: 0 }, monthly: [] },
      });
    }

    if (!shouldProtectAdmin) {
      return Response.json(mockMarketerDashboard);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }
    console.log("query", {
      startDate,
      endDate,
    });
    const response = await api(
      `${BACKEND_URL}/dashboard/marketer/${merchantId}/`,
      {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        queryParams: {
          startDate,
          endDate,
        },
      }
    );
    console.log("response", response);
    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response);
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
