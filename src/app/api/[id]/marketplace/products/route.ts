import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import type { RouteContext } from "@/libs/nextRoute";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

// Mock data for development (when backend is not ready)
const mockProducts = [
  {
    id: "P001",
    name: "40 oz Wide Mouth with Flex Straw Cap - Red",
    description: "Wide mouth insulated water bottle with leakproof straw.",
    imageUrl:
      "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/w/4/w40bfs_snapper_5120x5120.png",
    price: 37.46,
    originalPrice: 49.95,
    discount: 25,
    category: "pink",
    stock: 100,
    sold: 45,
    rating: 4.5,
    reviewCount: 1252,
    isNew: false,
    status: "active",
  },
  {
    id: "P002",
    name: "20 oz All Around™ Tumbler with Straw Lid - Aloe",
    description: "All around tumbler with straw lid.",
    imageUrl:
      "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/t/2/t20sas_aloe_5120x5120.png",
    price: 30.96,
    originalPrice: 37.95,
    discount: 18,
    category: "green",
    stock: 80,
    sold: 28,
    rating: 4.5,
    reviewCount: 0,
    isNew: false,
    status: "active",
  },
  {
    id: "P003",
    name: "34 oz Mug - Beachplum Purple",
    description: "Large mug for your favorite beverages.",
    imageUrl:
      "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/m/3/m34_beachplum_5120x5120.png",
    price: 44.71,
    originalPrice: 59.95,
    discount: 25,
    category: "purple",
    stock: 50,
    sold: 12,
    rating: 0,
    reviewCount: 0,
    isNew: true,
    status: "active",
  },
  {
    id: "P004",
    name: "64 oz Wide Mouth with Flex Straw Cap - Surf",
    description: "Extra large capacity for all day hydration.",
    imageUrl:
      "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/w/6/w64bfs_surf_5120x5120.png",
    price: 48.71,
    originalPrice: 64.95,
    discount: 25,
    category: "blue",
    stock: 60,
    sold: 89,
    rating: 4.5,
    reviewCount: 733,
    isNew: false,
    status: "active",
  },
  {
    id: "P005",
    name: "32 oz Wide Mouth - Eggplant",
    description: "Perfect size for everyday use.",
    imageUrl:
      "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/w/3/w32_eggplant_5120x5120.png",
    price: 33.71,
    originalPrice: 44.95,
    discount: 25,
    category: "purple",
    stock: 75,
    sold: 156,
    rating: 4.8,
    reviewCount: 2156,
    isNew: false,
    status: "active",
  },
  {
    id: "P006",
    name: "24 oz Standard Mouth - Citron",
    description: "Compact and portable.",
    imageUrl:
      "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/s/2/s24_citron_5120x5120.png",
    price: 26.21,
    originalPrice: 34.95,
    discount: 25,
    category: "orange",
    stock: 90,
    sold: 234,
    rating: 4.7,
    reviewCount: 1834,
    isNew: false,
    status: "active",
  },
  {
    id: "P007",
    name: "16 oz Coffee with Flex Sip Lid - Birch",
    description: "Perfect for your morning coffee.",
    imageUrl:
      "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/c/1/c16_birch_5120x5120.png",
    price: 22.46,
    originalPrice: 29.95,
    discount: 25,
    category: "neutral",
    stock: 120,
    sold: 178,
    rating: 4.6,
    reviewCount: 892,
    isNew: false,
    status: "active",
  },
  {
    id: "P008",
    name: "12 oz Kids Wide Mouth - Firefly",
    description: "Kid-friendly size and design.",
    imageUrl:
      "https://www.hydroflask.com/media/catalog/product/cache/c4fad0e26e3fbf2f8b8b5e7e7c8c8f3f/k/1/k12w_firefly_5120x5120.png",
    price: 26.21,
    originalPrice: 34.95,
    discount: 25,
    category: "orange",
    stock: 65,
    sold: 89,
    rating: 4.9,
    reviewCount: 456,
    isNew: true,
    status: "active",
  },
];

/**
 * GET /api/[id]/marketplace/products
 * Fetch all marketplace products for a merchant
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

    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // TODO: Replace with actual backend call when ready
    // const backendUrl = `${BACKEND_URL}/${merchantId}/marketplace/products`;
    // const response = await api(backendUrl, { ... });

    // For now, return mock data with filtering
    let filteredProducts = [...mockProducts];

    // Apply filters
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category
      );
    }
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= parseFloat(maxPrice)
      );
    }
    if (status) {
      filteredProducts = filteredProducts.filter((p) => p.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortBy) {
      filteredProducts.sort((a: any, b: any) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === "desc") {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Apply pagination
    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(
      startIndex,
      startIndex + limit
    );

    return Response.json(paginatedProducts, {
      headers: {
        "X-Total-Count": total.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      { error: "Failed to load marketplace products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/[id]/marketplace/products
 * Create a new marketplace product
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
    if (!body.name || !body.price) {
      return handleError("Name and price are required", 400);
    }

    // TODO: Replace with actual backend call when ready
    // const backendUrl = `${BACKEND_URL}/${merchantId}/marketplace/products`;
    // const response = await api(backendUrl, {
    //   method: "POST",
    //   body: { ...body, merchantId },
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    // For now, return mock response
    const newProduct = {
      id: `P${Date.now()}`,
      ...body,
      merchantId,
      sold: 0,
      rating: 0,
      reviewCount: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    logger.info(`Created product: ${JSON.stringify(newProduct)}`);

    return Response.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
