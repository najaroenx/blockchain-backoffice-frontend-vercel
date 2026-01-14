// __tests__/dlt/hooks/usePoints.test.ts

import { renderHook, waitFor } from "@testing-library/react";
import {
  usePoints,
  usePoint,
  useTransferPoint,
} from "@/app/dlt/hooks/usePoints";

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

describe("usePoints Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("usePoints", () => {
    it("should return empty points array when loading", () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
      });

      const { result } = renderHook(() =>
        usePoints({ merchantId: "merchant-123" })
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
        usePoints({ merchantId: "merchant-123" })
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
        usePoints({ merchantId: "merchant-123" })
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
        expect.any(Object)
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
        expect.objectContaining({ revalidateOnFocus: false })
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
        usePoints({ merchantId: "merchant-123" })
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
        usePoint({ merchantId: "merchant-123", pointId: "point-1", phone: "" })
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
        usePoint({ merchantId: "merchant-123", pointId: "point-1", phone: "" })
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
        usePoint({ merchantId: "", pointId: "point-1", phone: "" })
      );
      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.any(Object)
      );

      renderHook(() =>
        usePoint({ merchantId: "merchant-123", pointId: "", phone: "" })
      );
      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.any(Object)
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
          phone: "",
        })
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
          phone: "",
        })
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
          phone: "",
        })
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
          phone: "",
        })
      );

      expect(result.current.transferResult).toEqual(mockResult);
    });
  });
});
