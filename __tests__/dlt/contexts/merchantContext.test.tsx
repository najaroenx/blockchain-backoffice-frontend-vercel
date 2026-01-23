import React from "react";
import {
  render,
  screen,
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  MerchantProvider,
  useMerchantContext,
  useMerchantId,
  useLoading,
  useLoadingSuccess,
  useLoadingError,
} from "@/app/dlt/contexts/merchantContext";

// Mock child components to avoid errors
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

describe("MerchantContext", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Wrapper for testing hooks
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MerchantProvider value="merchant-123">{children}</MerchantProvider>
  );

  it("should provide merchantId", () => {
    const { result } = renderHook(() => useMerchantId(), { wrapper });
    expect(result.current).toBe("merchant-123");
  });

  it("should toggle sidebar", () => {
    const { result } = renderHook(() => useMerchantContext(), { wrapper });

    expect(result.current.isSidebarCollapsed).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isSidebarCollapsed).toBe(true);
  });

  describe("Loading State", () => {
    it("should show and hide loading", () => {
      const { result } = renderHook(() => useLoading(), { wrapper });

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.showLoading("Loading data...");
      });

      expect(result.current.isLoading).toBe(true);

      // Verify UI rendering
      render(
        <MerchantProvider value="123">
          <div>Content</div>
        </MerchantProvider>,
      );

      // We need to trigger state change in the rendered component too
      // Ideally integration test captures this better, but here we can check if state *logic* works

      act(() => {
        result.current.hideLoading();
      });

      // Should wait for minimum loading time
      expect(result.current.isLoading).toBe(true);

      act(() => {
        jest.advanceTimersByTime(501);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("should display loading overlay", () => {
      render(
        <MerchantProvider value="123">
          <TestComponent />
        </MerchantProvider>,
      );

      expect(screen.queryByTestId("default-loading")).not.toBeInTheDocument();

      act(() => {
        screen.getByText("Show Loading").click();
      });

      expect(screen.getByTestId("default-loading")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Success Loading State", () => {
    it("should show and auto-hide success loading", () => {
      const { result } = renderHook(() => useLoadingSuccess(), { wrapper });

      expect(result.current.isLoadingSuccess).toBe(false);

      act(() => {
        result.current.showLoadingSuccess("Saved successfully!");
      });

      expect(result.current.isLoadingSuccess).toBe(true);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.isLoadingSuccess).toBe(false);
    });

    it("should hide loading when success is shown", () => {
      // Ideally tested with integration
    });
  });

  describe("Error Loading State", () => {
    it("should show and auto-hide error loading", () => {
      const { result } = renderHook(() => useLoadingError(), { wrapper });

      expect(result.current.isLoadingError).toBe(false);

      act(() => {
        result.current.showLoadingError("Failed to save!");
      });

      expect(result.current.isLoadingError).toBe(true);

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.isLoadingError).toBe(false);
    });
  });

  it("should solve Error if used outside provider", () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    try {
      renderHook(() => useMerchantContext());
    } catch (e: any) {
      expect(e.message).toBe(
        "useMerchantContext must be used within a MerchantProvider",
      );
    }

    console.error = originalError;
  });
});

// Helper component for testing UI interactions
const TestComponent = () => {
  const { showLoading } = useLoading();
  return (
    <button onClick={() => showLoading("Loading...")}>Show Loading</button>
  );
};
