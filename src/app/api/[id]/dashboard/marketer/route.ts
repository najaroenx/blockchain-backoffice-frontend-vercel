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
// Dashboard Types
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
    total: number;
    pendingUsers: number;
    redeemedUsers: number;
  };
  transactions: {
    transferPoint: number;
    purchaseCoupon: number;
  };
  points: PointInfo[];
  thbToken: {
    deposited: number;
    balance: number;
    bought: number;
  };
}

// Map backend response to MarketerDashboardResponse interface
function mapToMarketerDashboard(data: any): MarketerDashboardResponse {
  return {
    dateRange: {
      startDate: data.dateRange?.startDate || "",
      endDate: data.dateRange?.endDate || "",
    },
    couponCount: {
      total: data.couponCount?.owned || data.couponCount?.total || 0,
      unsold: data.couponCount?.unsold || 0,
      sold: data.couponCount?.sold || 0,
      pendingUse: data.couponCount?.pending || data.couponCount?.pendingUse || 0,
      redeemed: data.couponCount?.redeemed || 0,
    },
    couponValue: {
      total: data.couponValueTHB?.owned || data.couponValue?.total || 0,
      unsold: data.couponValueTHB?.unsold || data.couponValue?.unsold || 0,
      sold: data.couponValueTHB?.sold || data.couponValue?.sold || 0,
      pendingUse: data.couponValueTHB?.pending || data.couponValue?.pendingUse || 0,
      redeemed: data.couponValueTHB?.redeemed || data.couponValue?.redeemed || 0,
    },
    couponValueByCurrency: (data.couponValueByCurrency || []).map((item: any) => ({
      currency: item.currency || item.symbol || "",
      total: item.total || 0,
      unsold: item.unsold || 0,
      sold: item.sold || 0,
      pendingUse: item.pending || item.pendingUse || 0,
      redeemed: item.redeemed || 0,
    })),
    endUsers: {
      total: data.endUsers?.total || 0,
      pendingUsers: data.endUsers?.pending || data.endUsers?.pendingUsers || 0,
      redeemedUsers: data.endUsers?.redeemed || data.endUsers?.redeemedUsers || 0,
    },
    transactions: {
      transferPoint: data.transactions?.transferPoint?.count || data.transactions?.transferPoint || 0,
      purchaseCoupon: data.transactions?.redeemPoint?.count || data.transactions?.purchaseCoupon || 0,
    },
    points: (data.points?.byType || data.points || []).map((item: any) => ({
      symbol: item.type || item.symbol || "",
      total: item.initialSupply || item.total || 0,
      balance: item.remaining || item.balance || 0,
    })),
    thbToken: {
      deposited: data.thbToken?.summary?.deposited || data.thbToken?.deposited || 0,
      balance: data.thbToken?.balance || 0,
      bought: data.thbToken?.summary?.spent || data.thbToken?.bought || 0,
    },
  };
}

// Empty response for when merchantId is missing
function getEmptyDashboard(): MarketerDashboardResponse {
  return {
    dateRange: { startDate: "", endDate: "" },
    couponCount: { total: 0, unsold: 0, sold: 0, pendingUse: 0, redeemed: 0 },
    couponValue: { total: 0, unsold: 0, sold: 0, pendingUse: 0, redeemed: 0 },
    couponValueByCurrency: [],
    endUsers: { total: 0, pendingUsers: 0, redeemedUsers: 0 },
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
    pendingUsers: 3,
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
        },
      }
    );

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    // Map response to match interface
    return Response.json(mapToMarketerDashboard(response));
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
