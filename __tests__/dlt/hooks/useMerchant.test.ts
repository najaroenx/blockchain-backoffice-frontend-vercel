import { renderHook, waitFor, act } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

// Mock tanstack query
const mockUseQuery = jest.fn();
const mockUseMutation = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockUseQueryClient = jest.fn(() => ({
  invalidateQueries: mockInvalidateQueries,
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: () => mockUseQuery(),
  useMutation: (config: any) => mockUseMutation(config),
  useQueryClient: () => mockUseQueryClient(),
}));

// Mock api
jest.mock("@/libs/api", () => ({
  api: jest.fn(),
}));

// Mock useApiWithLoading
const mockExecute = jest.fn();
jest.mock("@/app/dlt/hooks/useApiWithLoading", () => ({
  useApiWithLoading: () => ({
    execute: mockExecute,
    isExecuting: false,
  }),
}));

import { useMerchants } from "@/app/dlt/hooks/useMerchant";

describe("useMerchants Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      refetch: jest.fn(),
    });
    mockUseMutation.mockReturnValue({
      mutateAsync: jest.fn(),
    });
  });

  describe("merchants data", () => {
    it("should return undefined merchants when loading", () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useMerchants());

      expect(result.current.merchants).toBeUndefined();
      expect(result.current.merchantLoading).toBe(true);
    });

    it("should return merchants data when loaded", () => {
      const mockMerchants = [
        { id: "1", name: "Merchant A", website: "https://a.com" },
        { id: "2", name: "Merchant B", website: "https://b.com" },
      ];
      mockUseQuery.mockReturnValue({
        data: mockMerchants,
        isLoading: false,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useMerchants());

      expect(result.current.merchants).toEqual(mockMerchants);
      expect(result.current.merchantLoading).toBe(false);
    });
  });

  describe("createMerchant", () => {
    it("should call execute with correct options", async () => {
      mockExecute.mockResolvedValue({ id: "new-merchant" });

      const { result } = renderHook(() => useMerchants());

      await act(async () => {
        await result.current.createMerchant({
          name: "New Merchant",
          website: "https://new.com",
        });
      });

      expect(mockExecute).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          loadingText: "กำลังสร้าง Merchant...",
          successText: "สร้าง Merchant สำเร็จ!",
        }),
      );
    });

    it("should accept custom options", async () => {
      mockExecute.mockResolvedValue({ id: "new-merchant" });

      const { result } = renderHook(() => useMerchants());

      await act(async () => {
        await result.current.createMerchant(
          { name: "New Merchant", website: "https://new.com" },
          { successText: "Custom success!" },
        );
      });

      expect(mockExecute).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          successText: "Custom success!",
        }),
      );
    });
  });

  describe("fetchMerchants", () => {
    it("should call execute with correct options", async () => {
      const mockRefetch = jest.fn().mockResolvedValue({ data: [] });
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        refetch: mockRefetch,
      });
      mockExecute.mockResolvedValue([]);

      const { result } = renderHook(() => useMerchants());

      await act(async () => {
        await result.current.fetchMerchants();
      });

      expect(mockExecute).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          loadingText: "กำลังโหลดข้อมูล Merchant...",
          showSuccessOnComplete: false,
        }),
      );
    });
  });

  describe("refetchMerchants", () => {
    it("should provide refetch function", () => {
      const mockRefetch = jest.fn();
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useMerchants());

      expect(result.current.refetchMerchants).toBe(mockRefetch);
    });
  });
});
