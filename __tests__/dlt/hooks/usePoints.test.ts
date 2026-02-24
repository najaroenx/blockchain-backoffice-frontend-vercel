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
  usePoints,
  usePoint,
  useTransferPoint,
  listFetcher,
  pointFetcher,
  transferFetcher,
} from "@/app/dlt/hooks/usePoints";

// Mock fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("usePoints Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Fetchers", () => {
    describe("listFetcher", () => {
      it("should return data and total count", async () => {
        const mockData = [{ id: 1, name: "Point A" }];
        mockFetch.mockResolvedValue({
          ok: true,
          headers: {
            get: jest.fn().mockReturnValue("5"),
          },
          json: async () => mockData,
        });

        const result = await listFetcher("/api/point");
        expect(result).toEqual({ data: mockData, total: 5 });
      });

      it("should throw error when response is not ok", async () => {
        mockFetch.mockResolvedValue({
          ok: false,
        });

        await expect(listFetcher("/api/point")).rejects.toThrow(
          "Failed to fetch points",
        );
      });
    });

    describe("pointFetcher", () => {
      it("should return point data", async () => {
        const mockData = { id: 1, name: "Point A" };
        mockFetch.mockResolvedValue({
          ok: true,
          json: async () => mockData,
        });

        const result = await pointFetcher("/api/point/1");
        expect(result).toEqual(mockData);
      });

      it("should throw error when response is not ok", async () => {
        mockFetch.mockResolvedValue({
          ok: false,
        });

        await expect(pointFetcher("/api/point/1")).rejects.toThrow(
          "Failed to fetch point",
        );
      });
    });

    describe("transferFetcher", () => {
      it("should return transfer result", async () => {
        const mockData = { success: true, tx: "0x123" };
        const arg = { amount: 100, receiver: "User A" };

        mockFetch.mockResolvedValue({
          ok: true,
          json: async () => mockData,
        });

        const result = await transferFetcher("/api/point/transfer", {
          arg,
        } as any);

        expect(mockFetch).toHaveBeenCalledWith(
          "/api/point/transfer",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify(arg),
          }),
        );
        expect(result).toEqual(mockData);
      });

      it("should throw error when transfer fails", async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          json: async () => ({ message: "Insufficient balance" }),
        });

        await expect(
          transferFetcher("/api/point/transfer", { arg: {} } as any),
        ).rejects.toThrow("Insufficient balance");
      });
    });
  });

  // Keep existing Hook tests
  describe("usePoints", () => {
    it("should return empty points array when loading", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
        usePoints({ merchantId: "merchant-123" }),
      );

      expect(result.current.points).toEqual([]);
      expect(result.current.total).toBe(0);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
    });

    it("should return points data when loaded", () => {
      const mockPoints = [
        { id: "1", name: "Point A", symbol: "PTA", merchantId: "merchant-123" },
        { id: "2", name: "Point B", symbol: "PTB", merchantId: "merchant-123" },
      ];
      (useSWR as jest.Mock).mockReturnValue({
        data: { data: mockPoints, total: 2 },
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
        usePoints({ merchantId: "merchant-123" }),
      );

      expect(result.current.points).toEqual(mockPoints);
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
        usePoints({ merchantId: "merchant-123" }),
      );

      expect(result.current.isError).toBe(true);
      expect(result.current.points).toEqual([]);
    });

    it("should not fetch when merchantId is empty", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() => usePoints({ merchantId: "" }));

      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.any(Object),
      );
    });

    it("should call SWR with correct URL", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: { data: [], total: 0 },
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() => usePoints({ merchantId: "merchant-123" }));

      expect(useSWR).toHaveBeenCalledWith(
        "/api/merchant-123/point",
        expect.any(Function),
        expect.objectContaining({ revalidateOnFocus: false }),
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
        usePoints({ merchantId: "merchant-123" }),
      );

      expect(result.current.mutate).toBe(mockMutate);
    });
  });

  describe("usePoint", () => {
    it("should return null point when loading", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
      );

      expect(result.current.point).toBe(null);
      expect(result.current.isLoading).toBe(true);
    });

    it("should return point data when loaded", () => {
      const mockPoint = {
        id: "point-1",
        name: "Point A",
        symbol: "PTA",
        merchantId: "merchant-123",
      };
      (useSWR as jest.Mock).mockReturnValue({
        data: mockPoint,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
      );

      expect(result.current.point).toEqual(mockPoint);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should not fetch when merchantId or pointId is empty", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
      });

      renderHook(() =>
      );
      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.any(Object),
      );

      renderHook(() =>
      );
      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.any(Object),
      );
    });
  });

  describe("useTransferPoint", () => {
    it("should return transfer function and states", () => {
      const mockTrigger = jest.fn();
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: mockTrigger,
        isMutating: false,
        error: undefined,
        data: undefined,
      });

      const { result } = renderHook(() =>
        useTransferPoint({
          merchantId: "merchant-123",
          pointId: "point-1",
        }),
      );

      expect(result.current.transfer).toBe(mockTrigger);
      expect(result.current.isTransferring).toBe(false);
      expect(result.current.transferError).toBeUndefined();
      expect(result.current.transferResult).toBeUndefined();
    });

    it("should return mutating state when transferring", () => {
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: jest.fn(),
        isMutating: true,
        error: undefined,
        data: undefined,
      });

      const { result } = renderHook(() =>
        useTransferPoint({
          merchantId: "merchant-123",
          pointId: "point-1",
        }),
      );

      expect(result.current.isTransferring).toBe(true);
    });

    it("should return error when transfer fails", () => {
      const mockError = new Error("Transfer failed");
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: jest.fn(),
        isMutating: false,
        error: mockError,
        data: undefined,
      });

      const { result } = renderHook(() =>
        useTransferPoint({
          merchantId: "merchant-123",
          pointId: "point-1",
        }),
      );

      expect(result.current.transferError).toBe(mockError);
    });

    it("should return result data when transfer succeeds", () => {
      const mockResult = { success: true, transactionId: "tx-123" };
      (useSWRMutation as jest.Mock).mockReturnValue({
        trigger: jest.fn(),
        isMutating: false,
        error: undefined,
        data: mockResult,
      });

      const { result } = renderHook(() =>
        useTransferPoint({
          merchantId: "merchant-123",
          pointId: "point-1",
        }),
      );

      expect(result.current.transferResult).toEqual(mockResult);
    });
  });
});
