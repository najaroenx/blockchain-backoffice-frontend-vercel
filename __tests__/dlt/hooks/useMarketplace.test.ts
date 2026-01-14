// __tests__/dlt/hooks/useMarketplace.test.ts

import { renderHook } from "@testing-library/react";
import {
  useMarketplaceProducts,
  useMarketplaceProduct,
  useMarketplaceCategories,
  useBuyFromSeller,
  transformListingToProduct,
  SellerListing,
} from "@/app/dlt/hooks/useMarketplace";

// Mock SWR
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("swr/mutation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useSWR from "swr";
import useSWRMutation from "swr/mutation";

describe("useMarketplace Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("transformListingToProduct", () => {
    it("should transform listing to product correctly", () => {
      const listing: SellerListing = {
        listingId: "listing-123",
        seller: "0x123",
        typeId: "type-1",
        amountOnChain: "100",
        totalAvailableCodes: 50,
        pricePerUnit: "99.99",
        paymentToken: "THB",
        isActive: true,
        listedAt: Math.floor(Date.now() / 1000),
        voucher: {
          id: "voucher-1",
          name: "Test Voucher",
          description: "A test voucher",
          imageUrl: "https://example.com/image.png",
          valueType: "cash",
          value: 100,
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          status: "active",
          merchant: null,
          point: null,
        },
      };

      const product = transformListingToProduct(listing);

      expect(product.id).toBe("voucher-1");
      expect(product.listingId).toBe("listing-123");
      expect(product.name).toBe("Test Voucher");
      expect(product.price).toBe(99.99);
      expect(product.stock).toBe(50);
      expect(product.category).toBe("cash");
      expect(product.isActive).toBe(true);
      expect(product.isNew).toBe(true); // Listed within last 7 days
    });

    it("should set category based on valueType", () => {
      const createListing = (valueType: string): SellerListing => ({
        listingId: "listing-1",
        seller: "0x123",
        typeId: "type-1",
        amountOnChain: "100",
        totalAvailableCodes: 50,
        pricePerUnit: "99.99",
        paymentToken: "THB",
        isActive: true,
        listedAt: Math.floor(Date.now() / 1000),
        voucher: {
          id: "v1",
          name: "Test",
          description: "",
          imageUrl: "",
          valueType,
          value: 100,
          startDate: "",
          endDate: "",
          status: "active",
          merchant: null,
          point: null,
        },
      });

      expect(transformListingToProduct(createListing("cash")).category).toBe(
        "cash"
      );
      expect(
        transformListingToProduct(createListing("aispoint")).category
      ).toBe("aispoint");
      expect(transformListingToProduct(createListing("other")).category).toBe(
        "all"
      );
    });

    it("should mark old listings as not new", () => {
      const listing: SellerListing = {
        listingId: "listing-123",
        seller: "0x123",
        typeId: "type-1",
        amountOnChain: "100",
        totalAvailableCodes: 50,
        pricePerUnit: "99.99",
        paymentToken: "THB",
        isActive: true,
        listedAt: Math.floor(Date.now() / 1000) - 8 * 24 * 60 * 60, // 8 days ago
        voucher: {
          id: "v1",
          name: "Test",
          description: "",
          imageUrl: "",
          valueType: "cash",
          value: 100,
          startDate: "",
          endDate: "",
          status: "active",
          merchant: null,
          point: null,
        },
      };

      const product = transformListingToProduct(listing);
      expect(product.isNew).toBe(false);
    });
  });

  describe("useMarketplaceProducts", () => {
    it("should return empty products when loading", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
        useMarketplaceProducts("merchant-123")
      );

      expect(result.current.products).toEqual([]);
      expect(result.current.listings).toEqual([]);
      expect(result.current.total).toBe(0);
      expect(result.current.isLoading).toBe(true);
    });

    it("should return transformed products when loaded", () => {
      const mockListings = [
        {
          listingId: "1",
          seller: "0x123",
          typeId: "t1",
          amountOnChain: "100",
          totalAvailableCodes: 10,
          pricePerUnit: "50",
          paymentToken: "THB",
          isActive: true,
          listedAt: Math.floor(Date.now() / 1000),
          voucher: {
            id: "v1",
            name: "Voucher 1",
            description: "",
            imageUrl: "",
            valueType: "cash",
            value: 50,
            startDate: "",
            endDate: "",
            status: "active",
            merchant: null,
            point: null,
          },
        },
      ];

      (useSWR as jest.Mock).mockReturnValue({
        data: { listings: mockListings, total: 1 },
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
        useMarketplaceProducts("merchant-123")
      );

      expect(result.current.products.length).toBe(1);
      expect(result.current.products[0].name).toBe("Voucher 1");
      expect(result.current.listings).toEqual(mockListings);
      expect(result.current.total).toBe(1);
    });

    it("should build query string from filters", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: { listings: [], total: 0 },
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() =>
        useMarketplaceProducts("merchant-123", {
          category: "cash",
          page: 1,
          limit: 10,
        })
      );

      expect(useSWR).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/merchant-123/marketplace/seller-listings"
        ),
        expect.any(Function),
        expect.any(Object)
      );
    });
  });

  describe("useMarketplaceProduct", () => {
    it("should return null product when loading", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
        useMarketplaceProduct("merchant-123", "listing-1")
      );

      expect(result.current.product).toBe(null);
      expect(result.current.listing).toBe(null);
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("useMarketplaceCategories", () => {
    it("should return static categories", () => {
      const { result } = renderHook(() =>
        useMarketplaceCategories("merchant-123")
      );

      expect(result.current.categories).toHaveLength(3);
      expect(result.current.categories[0].id).toBe("all");
      expect(result.current.categories[1].id).toBe("cash");
      expect(result.current.categories[2].id).toBe("aispoint");
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("useBuyFromSeller", () => {
    it("should return buy function and states", () => {
      const mockTrigger = jest.fn();
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: mockTrigger,
        isMutating: false,
        error: undefined,
        data: undefined,
      });

      const { result } = renderHook(() => useBuyFromSeller("merchant-123"));

      expect(result.current.buyFromSeller).toBe(mockTrigger);
      expect(result.current.isBuying).toBe(false);
      expect(result.current.buyError).toBeUndefined();
    });

    it("should return buying state when mutation is in progress", () => {
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: jest.fn(),
        isMutating: true,
        error: undefined,
        data: undefined,
      });

      const { result } = renderHook(() => useBuyFromSeller("merchant-123"));

      expect(result.current.isBuying).toBe(true);
    });

    it("should not create mutation when merchantId is empty", () => {
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: jest.fn(),
        isMutating: false,
        error: undefined,
        data: undefined,
      });

      renderHook(() => useBuyFromSeller(""));

      expect(useSWRMutation).toHaveBeenCalledWith(null, expect.any(Function));
    });
  });
});
