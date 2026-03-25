import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import type { RouteContext } from "@/libs/nextRoute";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

// Mock product for development
const mockProduct = {
  id: "P001",
  name: "40 oz Wide Mouth with Flex Straw Cap",
  description: "Wide mouth insulated water bottle with leakproof straw.",
  images: [
    "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/w/4/w40bfs_snapper_5120x5120.png",
  ],
  imageUrl:
    "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/w/4/w40bfs_snapper_5120x5120.png",
  price: 37.46,
  originalPrice: 49.95,
  discount: 25,
  category: "pink",
  stock: 100,
  sold: 45,
  rating: 4.5,
  reviewCount: 1369,
  badge: "Best Seller",
  isNew: false,
  status: "active",
  colors: [
    { id: "black", name: "Black", hex: "#1a1a1a" },
    { id: "white", name: "White", hex: "#f5f5f5" },
    { id: "navy", name: "Navy", hex: "#1e3a5f" },
    { id: "blue", name: "Blue", hex: "#3b82f6" },
    { id: "purple", name: "Purple", hex: "#9333ea" },
    { id: "pink", name: "Pink", hex: "#ec4899" },
    { id: "red", name: "Red", hex: "#ef4444" },
    { id: "coral", name: "Coral", hex: "#f97316" },
    { id: "yellow", name: "Yellow", hex: "#eab308" },
    { id: "olive", name: "Olive", hex: "#84cc16" },
    { id: "teal", name: "Teal", hex: "#14b8a6" },
    { id: "sky", name: "Sky", hex: "#0ea5e9" },
  ],
  sizes: ["Reef", "Standard", "Wide Mouth"],
  specifications: {
    capacity: "40 oz",
    weight: "1.0 lb",
    dimensions: '3.5" x 11.2"',
    material: "Stainless Steel",
  },
  createdAt: "2024-12-01T00:00:00Z",
  updatedAt: "2024-12-15T00:00:00Z",
};

/**
 * GET /api/[id]/marketplace/products/[productId]
 * Fetch a single marketplace product
 */
export async function GET(
  req: NextRequest,
  context: RouteContext<{ id: string; productId: string }>
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const { id: merchantId, productId } = await context.params;

    // Validate IDs
    if (!merchantId || !/^[a-zA-Z0-9_-]+$/.test(merchantId)) {
      return handleError("Invalid merchant ID", 400);
    }
    if (!productId || !/^[a-zA-Z0-9_-]+$/.test(productId)) {
      return handleError("Invalid product ID", 400);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    // TODO: Replace with actual backend call when ready
    // const backendUrl = `${BACKEND_URL}/${merchantId}/marketplace/products/${productId}`;
    // const response = await api(backendUrl, {
    //   method: "GET",
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    // For now, return mock product
    const product = {
      ...mockProduct,
      id: productId,
      merchantId,
    };

    return Response.json(product);
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "Failed to load product" }, { status: 500 });
  }
}

/**
 * PUT /api/[id]/marketplace/products/[productId]
 * Update a marketplace product
 */
export async function PUT(
  req: NextRequest,
  context: RouteContext<{ id: string; productId: string }>
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const { id: merchantId, productId } = await context.params;
    const body = await req.json();

    // Validate IDs
    if (!merchantId || !/^[a-zA-Z0-9_-]+$/.test(merchantId)) {
      return handleError("Invalid merchant ID", 400);
    }
    if (!productId || !/^[a-zA-Z0-9_-]+$/.test(productId)) {
      return handleError("Invalid product ID", 400);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    // TODO: Replace with actual backend call when ready
    // const backendUrl = `${BACKEND_URL}/${merchantId}/marketplace/products/${productId}`;
    // const response = await api(backendUrl, {
    //   method: "PUT",
    //   body,
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    // For now, return mock response
    const updatedProduct = {
      ...mockProduct,
      ...body,
      id: productId,
      merchantId,
      updatedAt: new Date().toISOString(),
    };

    logger.info(`Updated product: ${productId}`);

    return Response.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/[id]/marketplace/products/[productId]
 * Delete a marketplace product
 */
export async function DELETE(
  req: NextRequest,
  context: RouteContext<{ id: string; productId: string }>
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const { id: merchantId, productId } = await context.params;

    // Validate IDs
    if (!merchantId || !/^[a-zA-Z0-9_-]+$/.test(merchantId)) {
      return handleError("Invalid merchant ID", 400);
    }
    if (!productId || !/^[a-zA-Z0-9_-]+$/.test(productId)) {
      return handleError("Invalid product ID", 400);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    // TODO: Replace with actual backend call when ready
    // const backendUrl = `${BACKEND_URL}/${merchantId}/marketplace/products/${productId}`;
    // const response = await api(backendUrl, {
    //   method: "DELETE",
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    logger.info(`Deleted product: ${productId}`);

    return Response.json({
      message: "Product deleted successfully",
      productId,
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
