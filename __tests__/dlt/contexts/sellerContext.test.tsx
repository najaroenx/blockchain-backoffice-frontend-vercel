import React from "react";
import { render, screen, act, renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  SellerProvider,
  useSellerContext,
  useSellerId,
  useSellerLoading,
  useSellerLoadingSuccess,
  useSellerLoadingError,
} from "@/app/dlt/contexts/sellerContext";

// Mock child components
jest.mock("@/app/dlt/components/SuccessLoadingComponent", () => ({
  SuccessLoadingComponent: () => <div data-testid="success-loading" />,
}));
jest.mock("@/app/dlt/components/LoadingDefaultComponent", () => ({
  __esModule: true,
  default: () => <div data-testid="default-loading" />,
}));
jest.mock("@/app/dlt/components/ErrorLoadingComponent", () => ({
  ErrorLoadingComponent: () => <div data-testid="error-loading" />,
}));

describe("SellerContext", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SellerProvider value="seller-123">{children}</SellerProvider>
  );

  it("should provide sellerId", () => {
    const { result } = renderHook(() => useSellerId(), { wrapper });
    expect(result.current).toBe("seller-123");
  });

  it("should toggle sidebar", () => {
    const { result } = renderHook(() => useSellerContext(), { wrapper });

    expect(result.current.isSidebarCollapsed).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isSidebarCollapsed).toBe(true);
  });

  describe("Loading Hook", () => {
    it("should manage loading state", () => {
      const { result } = renderHook(() => useSellerLoading(), { wrapper });

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.showLoading("Processing...");
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.hideLoading();
        jest.advanceTimersByTime(501);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("Success Loading Hook", () => {
    it("should manage success loading state", () => {
      const { result } = renderHook(() => useSellerLoadingSuccess(), {
        wrapper,
      });

      expect(result.current.isLoadingSuccess).toBe(false);

      act(() => {
        result.current.showLoadingSuccess("Success!");
      });

      expect(result.current.isLoadingSuccess).toBe(true);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.isLoadingSuccess).toBe(false);
    });
  });

  describe("Error Loading Hook", () => {
    it("should manage error loading state", () => {
      const { result } = renderHook(() => useSellerLoadingError(), { wrapper });

      expect(result.current.isLoadingError).toBe(false);

      act(() => {
        result.current.showLoadingError("Error!");
      });

      expect(result.current.isLoadingError).toBe(true);

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.isLoadingError).toBe(false);
    });
  });

  it("should throw error when used outside provider", () => {
    const originalError = console.error;
    console.error = jest.fn();

    try {
      renderHook(() => useSellerContext());
    } catch (e: any) {
      expect(e.message).toBe(
        "useSellerContext must be used within a SellerProvider",
      );
    }

    console.error = originalError;
  });
});
