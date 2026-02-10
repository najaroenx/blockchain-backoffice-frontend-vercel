import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

// ============================================
// Marketer Dashboard Types
// ============================================

interface DateRangeInfo {
  startDate: string;
  endDate: string;
}

interface CouponStats {
  total: number; // จำนวน/มูลค่าคูปองทั้งหมดที่เรามี
  unsold: number; // จำนวน/มูลค่าคูปองที่ยังไม่ลงขาย
  sold: number; // จำนวน/มูลค่าคูปองที่ลงขายแล้ว
  pendingUse: number; // จำนวน/มูลค่าคูปองที่ End User ซื้อแต่ยังไม่ใช้
  redeemed: number; // จำนวน/มูลค่าคูปองที่ End User redeem แล้วจริง ๆ
}

interface CouponStatsWithCurrency extends CouponStats {
  currency: string; // สกุลเงินของคูปอง (Point symbol)
}

interface PointInfo {
  symbol: string; // สัญลักษณ์ Point (e.g., "PTS", "COIN")
  total: number; // จำนวน Point ทั้งหมด (initial supply)
  balance: number; // จำนวน Point ที่เหลืออยู่ (current balance)
}

interface MarketerDashboardResponse {
  dateRange: DateRangeInfo;
  couponCount: CouponStats;
  couponValue: CouponStats;
  couponValueByCurrency: CouponStatsWithCurrency[];
  endUsers: {
    total: number; // จำนวน End User ทั้งหมด
    unredeemedUsers: number; // จำนวน End User ที่ซื้อแต่ยังไม่ใช้
    redeemedUsers: number; // จำนวน End User ที่ redeem แล้วจริง ๆ
  };
  transactions: {
    transferPoint: number; // จำนวน ครั้งที่ transfer Point ระหว่าง End User
    purchaseCoupon: number; // จำนวน ครั้งที่ End User ใช้ Point ซื้อคูปอง
  };
  points: PointInfo[];
  thbToken: {
    deposited: number; // THB Token ที่เติมเข้าไป
    balance: number; // THB Token คงเหลือ
    bought: number; // THB Token ที่ใช้ซื้อคูปองจาก Seller
  };
}

// Empty response for when merchantId is missing
function getEmptyDashboard(): MarketerDashboardResponse {
  return {
    dateRange: { startDate: "", endDate: "" },
    couponCount: { total: 0, unsold: 0, sold: 0, pendingUse: 0, redeemed: 0 },
    couponValue: { total: 0, unsold: 0, sold: 0, pendingUse: 0, redeemed: 0 },
    couponValueByCurrency: [],
    endUsers: { total: 0, unredeemedUsers: 0, redeemedUsers: 0 },
    transactions: { transferPoint: 0, purchaseCoupon: 0 },
    points: [],
    thbToken: { deposited: 0, balance: 0, bought: 0 },
  };
}

// Mock data for development
const mockMarketerDashboard: MarketerDashboardResponse = {
  dateRange: {
    startDate: "2026-01-01",
    endDate: "2026-01-12",
  },
  couponCount: {
    total: 18,
    unsold: 10,
    sold: 8,
    pendingUse: 5,
    redeemed: 3,
  },
  couponValue: {
    total: 18000,
    unsold: 10000,
    sold: 8000,
    pendingUse: 5000,
    redeemed: 3000,
  },
  couponValueByCurrency: [],
  endUsers: {
    total: 1,
    unredeemedUsers: 3,
    redeemedUsers: 1,
  },
  transactions: {
    transferPoint: 0,
    purchaseCoupon: 0,
  },
  points: [
    {
      symbol: "subtawecoin",
      total: 1000000,
      balance: 989998,
    },
  ],
  thbToken: {
    deposited: 0,
    balance: 0,
    bought: 0,
  },
};

export async function GET(req: NextRequest, { params }: { params: any }) {
  logger.info(`Received request MARKETER DASHBOARD: ${req.method} ${req.url}`);

  // Get query params
  const startDate = req.nextUrl.searchParams.get("startDate") ?? "";
  const endDate = req.nextUrl.searchParams.get("endDate") ?? "";
  const couponIds = req.nextUrl.searchParams.get("couponIds") ?? "";

  try {
    const merchantId = params.id;

    if (!merchantId) {
      return Response.json(getEmptyDashboard());
    }

    if (!shouldProtectAdmin) {
      return Response.json(mockMarketerDashboard);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

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
          ...(couponIds ? { couponIds } : {}),
        },
      }
    );

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    // Return backend response directly (already matches MarketerDashboardResponse)
    return Response.json(response as MarketerDashboardResponse);
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
