import useSWR from "swr";
import useSWRMutation from "swr/mutation";

// ==================== INTERFACES ====================

export interface Voucher {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  valueType: "cash" | "aispoint" | string;
  value: number;
  startDate: string;
  endDate: string;
  status: string;
  merchant: unknown | null;
  point: unknown | null;
}

export interface SellerListing {
  listingId: string;
  seller: string;
  typeId: string;
  amountOnChain: string;
  totalAvailableCodes: number;
  pricePerUnit: string;
  paymentToken: string;
  isActive: boolean;
  listedAt: number;
  voucher: Voucher;
}

// Transformed product for UI display
export interface MarketplaceProduct {
  id: string;
  listingId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  stock: number;
  sold?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isActive: boolean;
  valueType: string;
  value: number;
  seller: string;
  paymentToken: string;
  startDate: string;
  endDate: string;
  voucher: Voucher;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  color?: string;
  productCount?: number;
}

export interface ProductFilters {
  category?: string;
  valueType?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// ==================== RESULT INTERFACES ====================

interface UseMarketplaceProductsResult {
  products: MarketplaceProduct[];
  listings: SellerListing[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
}

interface UseMarketplaceProductResult {
  product: MarketplaceProduct | null;
  listing: SellerListing | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
}

// ==================== TRANSFORM FUNCTIONS ====================

/**
 * Transform SellerListing to MarketplaceProduct for UI display
 */
export function transformListingToProduct(
  listing: SellerListing,
): MarketplaceProduct {
  const price = parseFloat(listing.pricePerUnit);

  // Determine category based on valueType
  let category = "all";
  if (listing.voucher.valueType === "cash") {
    category = "cash";
  } else if (listing.voucher.valueType === "aispoint") {
    category = "aispoint";
  }

  // Check if listing is new (within last 7 days)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const isNew = listing.listedAt * 1000 > oneWeekAgo;

  return {
    id: listing.voucher.id,
    listingId: listing.listingId,
    name: listing.voucher.name,
    description: listing.voucher.description,
    imageUrl: listing.voucher.imageUrl,
    price: price,
    category: category,
    stock: listing.totalAvailableCodes,
    isNew: isNew,
    isActive: listing.isActive,
    valueType: listing.voucher.valueType,
    value: listing.voucher.value,
    seller: listing.seller,
    paymentToken: listing.paymentToken,
    startDate: listing.voucher.startDate,
    endDate: listing.voucher.endDate,
    voucher: listing.voucher,
  };
}

// ==================== FETCHERS ====================

// List fetcher
export const listFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch marketplace products");
  }
  const json = await res.json();

  // console.log("Fetcher received:", json);

  // Handle response structure: { status, message, data: { total, listings } }
  if (json.data) {
    console.log("Using json.data:", json.data);
    return {
      listings: json.data.listings || [],
      total: json.data.total || 0,
    };
  }

  // Fallback for direct array response
  const total = res.headers.get("X-Total-Count") || "0";
  console.log("Using fallback, json is:", json);
  return {
    listings: Array.isArray(json) ? json : [],
    total: parseInt(total, 10),
  };
};

// Single product fetcher
export const productFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch product");
  }
  const json = await res.json();

  // Handle response structure: { status, message, data }
  if (json.data) {
    return json.data;
  }

  return json;
};

// Buy fetcher (POST)
export const buyFetcher = async (
  url: string,
  { arg }: { arg: BuyFromSellerPayload },
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to complete purchase");
  }

  return json;
};

// List batch fetcher (POST)
export const listBatchFetcher = async (
  url: string,
  { arg }: { arg: ListBatchToMarketplacePayload },
) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to list products to marketplace");
  }

  return json;
};

// ==================== HOOKS ====================

/**
 * Hook to fetch all marketplace products (seller listings)
 */
export function useMarketplaceProducts(
  merchantId: string,
  filters?: ProductFilters,
): UseMarketplaceProductsResult {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  if (filters?.category && filters.category !== "all") {
    queryParams.set("valueType", filters.category);
  }
  if (filters?.valueType) queryParams.set("valueType", filters.valueType);
  if (filters?.isActive !== undefined)
    queryParams.set("isActive", filters.isActive.toString());
  if (filters?.search) queryParams.set("search", filters.search);
  if (filters?.page) queryParams.set("page", filters.page.toString());
  if (filters?.limit) queryParams.set("limit", filters.limit.toString());

  const queryString = queryParams.toString();
  const url = `/api/${merchantId}/marketplace/seller-listings${
    queryString ? `?${queryString}` : ""
  }`;

  const { data, error, isLoading, mutate } = useSWR(
    merchantId ? url : null,
    listFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  // Transform listings to products
  const listings: SellerListing[] = data?.listings || [];
  const products: MarketplaceProduct[] = listings.map(
    transformListingToProduct,
  );

  return {
    products,
    listings,
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook to fetch a single marketplace product by listing ID
 */
export function useMarketplaceProduct(
  merchantId: string,
  listingId: string,
): UseMarketplaceProductResult {
  const url = `/api/${merchantId}/marketplace/seller-listings/${listingId}`;

  const { data, error, isLoading, mutate } = useSWR(
    merchantId && listingId ? url : null,
    productFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const listing: SellerListing | null = data || null;
  const product: MarketplaceProduct | null = listing
    ? transformListingToProduct(listing)
    : null;

  return {
    product,
    listing,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook to get marketplace categories based on valueType
 */
export function useMarketplaceCategories(merchantId: string) {
  // Categories are static based on valueType
  const categories: MarketplaceCategory[] = [
    { id: "all", name: "ทั้งหมด", color: "#9333ea" },
    { id: "cash", name: "คูปองเงินสด", color: "#22c55e" },
    { id: "aispoint", name: "AIS Point", color: "#ef4444" },
  ];

  return {
    categories,
    isLoading: false,
    isError: false,
    error: undefined,
    mutate: () => {},
  };
}

// ==================== BUY HOOK ====================

export interface BuyFromSellerPayload {
  listingId: string;
  amount: number;
}

export interface BuyFromSellerResult {
  status: string;
  message: string;
  data?: unknown;
}

/**
 * Hook to buy a product from seller
 */
export function useBuyFromSeller(merchantId: string) {
  const url = `/api/${merchantId}/marketplace/buy`;

  const { trigger, isMutating, error, data } = useSWRMutation(
    merchantId ? url : null,
    buyFetcher,
  );

  return {
    buyFromSeller: trigger,
    isBuying: isMutating,
    buyError: error,
    buyResult: data as BuyFromSellerResult | undefined,
  };
}

// ==================== LIST BATCH TO MARKETPLACE ====================

export interface ListBatchItem {
  voucherId: string;
  amount: number;
  pricePerUnitTHB: number;
}

export interface ListBatchToMarketplacePayload {
  name: string;
  description: string;
  sellerWalletAddress: string;
  items: ListBatchItem[];
}

export interface ListBatchToMarketplaceResult {
  message: string;
  data?: unknown;
}

/**
 * Hook to list multiple products to marketplace in batch
 */
export function useMarketplaceSellerProduct() {
  const url = "/api/seller/litst-batch-to-marketplace";

  const { trigger, isMutating, error, data } = useSWRMutation(
    url,
    listBatchFetcher,
  );

  return {
    listBatchToMarketplace: trigger,
    isListing: isMutating,
    listError: error,
    listResult: data as ListBatchToMarketplaceResult | undefined,
  };
}

// ==================== MOCK DATA (for development fallback) ====================

export const mockMarketplaceCategories: MarketplaceCategory[] = [
  { id: "all", name: "ทั้งหมด", color: "#9333ea" },
  { id: "cash", name: "คูปองเงินสด", color: "#22c55e" },
  { id: "aispoint", name: "AIS Point", color: "#ef4444" },
];
