import { renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";

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
import {
  useMerchants,
  useMerchant,
  useCreateMerchant,
  listFetcher,
  merchantFetcher,
  createFetcher,
} from "@/app/dlt/hooks/useMerchants";

// Mock fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("useMerchants Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Fetchers", () => {
    describe("listFetcher", () => {
      it("should return data and total count", async () => {
        const mockData = [{ id: 1, name: "Merchant A" }];
        mockFetch.mockResolvedValue({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue("10"),
          },
          json: async () => mockData,
        });

        const result = await listFetcher("/api/merchant");
        expect(result).toEqual({ data: mockData, total: 10 });
      });

      it("should throw error when response is not ok", async () => {
        mockFetch.mockResolvedValue({
          ok: false,
        });

        await expect(listFetcher("/api/merchant")).rejects.toThrow(
          "Failed to fetch merchants",
        );
      });
    });

    describe("merchantFetcher", () => {
      it("should return merchant data", async () => {
        const mockData = { id: 1, name: "Merchant A" };
        mockFetch.mockResolvedValue({
          ok: true,
          json: async () => mockData,
        });

        const result = await merchantFetcher("/api/merchant/1");
        expect(result).toEqual(mockData);
      });

      it("should throw error when response is not ok", async () => {
        mockFetch.mockResolvedValue({
          ok: false,
        });

        await expect(merchantFetcher("/api/merchant/1")).rejects.toThrow(
          "Failed to fetch merchant",
        );
      });
    });

    describe("createFetcher", () => {
      it("should return created merchant data", async () => {
        const mockData = { id: 1, name: "New Merchant" };
        const arg = { name: "New Merchant", website: "test.com" };

        mockFetch.mockResolvedValue({
          ok: true,
          json: async () => mockData,
        });

        const result = await createFetcher("/api/merchant", { arg });

        expect(mockFetch).toHaveBeenCalledWith(
          "/api/merchant",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify(arg),
          }),
        );
        expect(result).toEqual(mockData);
      });

      it("should throw error when create fails", async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          json: async () => ({ message: "Duplicate Name" }),
        });

        await expect(
          createFetcher("/api/merchant", { arg: { name: "", website: "" } }),
        ).rejects.toThrow("Duplicate Name");
      });
    });
  });

  // Keep existing Hook tests
  describe("useMerchants", () => {
    it("should return empty merchants array when loading", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() => useMerchants());

      expect(result.current.merchants).toEqual([]);
      expect(result.current.total).toBe(0);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
    });

    it("should return merchants data when loaded", () => {
      const mockMerchants = [
        { id: "1", name: "Merchant A", website: "https://a.com" },
        { id: "2", name: "Merchant B", website: "https://b.com" },
      ];
      (useSWR as jest.Mock).mockReturnValue({
        data: { data: mockMerchants, total: 2 },
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() => useMerchants());

      expect(result.current.merchants).toEqual(mockMerchants);
      expect(result.current.total).toBe(2);
      expect(result.current.isLoading).toBe(false);
    });

    it("should return error state when fetch fails", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: new Error("Failed to fetch"),
        isLoading: false,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() => useMerchants());

      expect(result.current.isError).toBe(true);
    });

    it("should call SWR with correct URL", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: { data: [], total: 0 },
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() => useMerchants());

      expect(useSWR).toHaveBeenCalledWith(
        "/api/merchant",
        expect.any(Function),
        expect.objectContaining({ revalidateOnFocus: false }),
      );
    });
  });

  describe("useMerchant", () => {
    it("should return null merchant when loading", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() => useMerchant("merchant-123"));

      expect(result.current.merchant).toBe(null);
      expect(result.current.isLoading).toBe(true);
    });

    it("should return merchant data when loaded", () => {
      const mockMerchant = {
        id: "merchant-123",
        name: "Test Merchant",
        website: "https://test.com",
      };
      (useSWR as jest.Mock).mockReturnValue({
        data: mockMerchant,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() => useMerchant("merchant-123"));

      expect(result.current.merchant).toEqual(mockMerchant);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should not fetch when merchantId is empty", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() => useMerchant(""));

      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.any(Object),
      );
    });

    it("should call SWR with correct URL", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: null,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() => useMerchant("merchant-123"));

      expect(useSWR).toHaveBeenCalledWith(
        "/api/merchant/merchant-123",
        expect.any(Function),
        expect.any(Object),
      );
    });
  });

  describe("useCreateMerchant", () => {
    it("should return create function and states", () => {
      const mockTrigger = jest.fn();
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: mockTrigger,
        isMutating: false,
        error: undefined,
        data: undefined,
      });

      const { result } = renderHook(() => useCreateMerchant());

      expect(result.current.createMerchant).toBe(mockTrigger);
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeUndefined();
      expect(result.current.createResult).toBeUndefined();
    });

    it("should return mutating state when creating", () => {
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: jest.fn(),
        isMutating: true,
        error: undefined,
        data: undefined,
      });

      const { result } = renderHook(() => useCreateMerchant());

      expect(result.current.isCreating).toBe(true);
    });

    it("should return error when create fails", () => {
      const mockError = new Error("Create failed");
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: jest.fn(),
        isMutating: false,
        error: mockError,
        data: undefined,
      });

      const { result } = renderHook(() => useCreateMerchant());

      expect(result.current.createError).toBe(mockError);
    });

    it("should return result data when create succeeds", () => {
      const mockResult = { id: "new-merchant", name: "New Merchant" };
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: jest.fn(),
        isMutating: false,
        error: undefined,
        data: mockResult,
      });

      const { result } = renderHook(() => useCreateMerchant());

      expect(result.current.createResult).toEqual(mockResult);
    });
  });
});
