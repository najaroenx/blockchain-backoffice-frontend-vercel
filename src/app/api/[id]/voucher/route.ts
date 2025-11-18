import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import { mockVouchers } from "@/data/mockAdmin";
import { VoucherBackendResponse, Voucher } from "@/@types/voucher";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const start = parseInt(req.nextUrl.searchParams.get("_start") ?? "0", 10);
    const end = parseInt(req.nextUrl.searchParams.get("_end") ?? "0", 10);
    const merchantId = params.id;

    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Content-Range": "items 0-0/0",
          "Access-Control-Expose-Headers": "X-Total-Count, Content-Range",
        },
      });
    }

    if (!shouldProtectAdmin) {
      const vouchers = mockVouchers.filter(
        (voucher) => voucher.merchantId === merchantId
      );
      const total = vouchers.length;
      const safeEnd = end > 0 ? Math.min(end, total) : total;
      const data = vouchers.slice(start, safeEnd);
      const lower = data.length > 0 ? start : 0;
      const upper =
        data.length > 0 ? Math.max(start + data.length - 1, lower) : 0;

      return Response.json(data, {
        headers: {
          "X-Total-Count": total.toString(),
          "Content-Range": `items ${lower}-${upper}/${total}`,
          "Access-Control-Expose-Headers": "X-Total-Count, Content-Range",
        },
      });
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    console.log(`Fetching vouchers from backend ${BACKEND_URL}/coupon/merchant/${merchantId}`);
    const response = await api(`${BACKEND_URL}/coupon/merchant/${merchantId}`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      queryParams: {
        start,
        end,
      },
    });


    if (response.statusCode) {
      return handleError(response.message ?? "failed to load data", response.statusCode);
    }

    // Map response to match react-admin format with proper typing
    const rawData: VoucherBackendResponse[] = Array.isArray(response) 
      ? response 
      : (response.vouchers ?? []);
    
    const data: Voucher[] = rawData.map((voucher: VoucherBackendResponse) => ({
      id: voucher.id,
      name: voucher.name,
      description: voucher.description,
      status: voucher.status,
      merchantId: voucher.merchantId,
      merchantName: voucher.merchantName || voucher.merchant?.name || "",
      valueType: voucher.valueType,
      value: voucher.value,
      currency: voucher.currency,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      totalIssued: voucher.totalIssued,
      totalRedeemed: voucher.totalRedeemed,
      availableCount: voucher.availableCount ?? 0,
      imageUrl: voucher.imageUrl,
      limitPerMember: voucher.limitPerMember,
      pointsCost: voucher.pointsCost ?? 0,
      createdAt: voucher.createdAt,
      updatedAt: voucher.updatedAt,
    }));

    const total = response.counts ?? data.length;
    const upper =
      data.length > 0 ? Math.max(start + data.length - 1, start) : start;

    return Response.json(data, {
      headers: {
        "X-Total-Count": total.toString(),
        "Content-Range": `items ${start}-${upper}/${total}`,
        "Access-Control-Expose-Headers": "X-Total-Count, Content-Range",
      },
    });
  } catch (err) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
