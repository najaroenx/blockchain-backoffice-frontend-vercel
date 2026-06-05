import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import type { RouteContext } from "@/libs/nextRoute";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

// Mock categories for development
const mockCategories = [
  { id: "all", name: "Shop All", color: "#9333ea", productCount: 8 },
  { id: "pink", name: "Pinks & Reds", color: "#ec4899", productCount: 2 },
  { id: "green", name: "Greens", color: "#22c55e", productCount: 1 },
  { id: "purple", name: "Purples", color: "#a855f7", productCount: 2 },
  { id: "blue", name: "Blues", color: "#3b82f6", productCount: 1 },
  { id: "neutral", name: "Neutrals", color: "#78716c", productCount: 1 },
  { id: "orange", name: "Oranges", color: "#f97316", productCount: 2 },
  { id: "limited", name: "Limited Edition", color: "#0ea5e9", productCount: 0 },
];

/**
 * GET /api/[id]/marketplace/categories
 * Fetch all marketplace categories for a merchant
 */
export async function GET(
  req: NextRequest,
  context: RouteContext<{ id: string }>
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const { id: merchantId } = await context.params;

    // Validate merchantId
    if (!merchantId || !/^[a-zA-Z0-9_-]+$/.test(merchantId)) {
      return handleError("Invalid merchant ID", 400);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    // TODO: Replace with actual backend call when ready
    // const backendUrl = `${BACKEND_URL}/${merchantId}/marketplace/categories`;
    // const response = await api(backendUrl, {
    //   method: "GET",
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    // For now, return mock categories
    return Response.json(mockCategories);
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/[id]/marketplace/categories
 * Create a new category
 */
export async function POST(
  req: NextRequest,
  context: RouteContext<{ id: string }>
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const { id: merchantId } = await context.params;
    const body = await req.json();

    // Validate merchantId
    if (!merchantId || !/^[a-zA-Z0-9_-]+$/.test(merchantId)) {
      return handleError("Invalid merchant ID", 400);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    // Validate required fields
    if (!body.name) {
      return handleError("Category name is required", 400);
    }

    // TODO: Replace with actual backend call when ready
    // const backendUrl = `${BACKEND_URL}/${merchantId}/marketplace/categories`;
    // const response = await api(backendUrl, {
    //   method: "POST",
    //   body: { ...body, merchantId },
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    // For now, return mock response
    const newCategory = {
      id: body.id || `cat_${Date.now()}`,
      name: body.name,
      color: body.color || "#9333ea",
      productCount: 0,
      createdAt: new Date().toISOString(),
    };

    logger.info(`Created category: ${JSON.stringify(newCategory)}`);

    return Response.json(
      { message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
