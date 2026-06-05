import { renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock SWR
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useSWR from "swr";
import { useCustomers, fetcher } from "@/app/dlt/hooks/useCustomers";

// Mock fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("useCustomers Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetcher", () => {
    it("should return data and total count", async () => {
      const mockData = [{ id: 1, name: "Customer A" }];
      mockFetch.mockResolvedValue({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue("10"),
        },
        json: async () => mockData,
      });

      const result = await fetcher("/api/customer");

      expect(mockFetch).toHaveBeenCalledWith("/api/customer");
      expect(result).toEqual({ data: mockData, total: 10 });
    });

    it("should default total count to 0 if header missing", async () => {
      const mockData = [{ id: 1 }];
      mockFetch.mockResolvedValue({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        json: async () => mockData,
      });

      const result = await fetcher("/api/customer");
      expect(result.total).toBe(0);
    });

    it("should throw error when response is not ok", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
      });

      await expect(fetcher("/api/customer")).rejects.toThrow(
        "Failed to fetch customers",
      );
    });
  });

  describe("useCustomers", () => {
    it("should return empty customers array when loading", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
        useCustomers({ merchantId: "merchant-123" }),
      );

      expect(result.current.customers).toEqual([]);
      expect(result.current.total).toBe(0);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
    });

    it("should return customers data when loaded", () => {
      const mockCustomers = [
        {
          id: "1",
          name: "Customer A",
          email: "a@test.com",
          merchantId: "merchant-123",
          phone: "0812345678",
          status: "active",
          createdAt: "2024-01-01",
        },
        {
          id: "2",
          name: "Customer B",
          email: "b@test.com",
          merchantId: "merchant-123",
          phone: "0899999999",
          status: "active",
          createdAt: "2024-01-02",
        },
      ];
      (useSWR as jest.Mock).mockReturnValue({
        data: { data: mockCustomers, total: 2 },
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
        useCustomers({ merchantId: "merchant-123" }),
      );

      expect(result.current.customers).toEqual(mockCustomers);
      expect(result.current.total).toBe(2);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should return error state when fetch fails", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: new Error("Failed to fetch"),
        isLoading: false,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
        useCustomers({ merchantId: "merchant-123" }),
      );

      expect(result.current.isError).toBe(true);
      expect(result.current.customers).toEqual([]);
    });

    it("should not fetch when merchantId is empty", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() => useCustomers({ merchantId: "" }));

      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.any(Object),
      );
    });

    it("should call SWR with correct URL including pagination", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: { data: [], total: 0 },
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() =>
        useCustomers({ merchantId: "merchant-123", start: 10, end: 30 }),
      );

      expect(useSWR).toHaveBeenCalledWith(
        "/api/merchant-123/customer?_start=10&_end=30",
        expect.any(Function),
        expect.objectContaining({ revalidateOnFocus: false }),
      );
    });

    it("should use default pagination values", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: { data: [], total: 0 },
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() => useCustomers({ merchantId: "merchant-123" }));

      expect(useSWR).toHaveBeenCalledWith(
        "/api/merchant-123/customer?_start=0&_end=20",
        expect.any(Function),
        expect.any(Object),
      );
    });

    it("should provide mutate function", () => {
      const mockMutate = jest.fn();
      (useSWR as jest.Mock).mockReturnValue({
        data: { data: [], total: 0 },
        error: undefined,
        isLoading: false,
        mutate: mockMutate,
      });

      const { result } = renderHook(() =>
        useCustomers({ merchantId: "merchant-123" }),
      );

      expect(result.current.mutate).toBe(mockMutate);
    });
  });
});
