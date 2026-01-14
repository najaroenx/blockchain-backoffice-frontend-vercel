// __tests__/dlt/contexts/merchantContext.test.tsx

import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  MerchantProvider,
  useMerchantId,
  useLoading,
} from "@/app/dlt/contexts/merchantContext";

// Test component for useMerchantId
const TestMerchantId = () => {
  const merchantId = useMerchantId();
  return <div data-testid="merchant-id">{merchantId}</div>;
};

// Test component for useLoading
const TestLoading = () => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  return (
    <div>
      <div data-testid="loading-state">
        {isLoading ? "loading" : "not-loading"}
      </div>
      <button
        onClick={() => showLoading("Test loading message")}
        data-testid="show-btn"
      >
        Show
      </button>
      <button onClick={() => hideLoading()} data-testid="hide-btn">
        Hide
      </button>
    </div>
  );
};

describe("MerchantContext", () => {
  describe("useMerchantId", () => {
    it("should return merchantId from provider value", () => {
      render(
        <MerchantProvider value="test-merchant-id">
          <TestMerchantId />
        </MerchantProvider>
      );

      expect(screen.getByTestId("merchant-id")).toHaveTextContent(
        "test-merchant-id"
      );
    });

    it("should return null when merchantId is null", () => {
      render(
        <MerchantProvider value={null}>
          <TestMerchantId />
        </MerchantProvider>
      );

      expect(screen.getByTestId("merchant-id")).toHaveTextContent("");
    });

    it("should throw when used outside provider", () => {
      // Suppress console error for this test
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => render(<TestMerchantId />)).toThrow(
        "useMerchantContext must be used within a MerchantProvider"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("useLoading", () => {
    // Use fake timers for loading tests
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should have initial loading state as false", () => {
      render(
        <MerchantProvider value="merchant-123">
          <TestLoading />
        </MerchantProvider>
      );

      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    it("should show loading when showLoading is called", () => {
      render(
        <MerchantProvider value="merchant-123">
          <TestLoading />
        </MerchantProvider>
      );

      act(() => {
        screen.getByTestId("show-btn").click();
      });

      expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");
    });

    it("should hide loading after minimum time when hideLoading is called", async () => {
      render(
        <MerchantProvider value="merchant-123">
          <TestLoading />
        </MerchantProvider>
      );

      // Show loading
      act(() => {
        screen.getByTestId("show-btn").click();
      });

      expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");

      // Hide loading
      act(() => {
        screen.getByTestId("hide-btn").click();
      });

      // Should still be loading (minimum time not elapsed)
      expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");

      // Fast-forward past minimum loading time (500ms)
      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "not-loading"
      );
    });

    it("should throw when used outside provider", () => {
      // Suppress console error for this test
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => render(<TestLoading />)).toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe("MerchantProvider", () => {
    it("should render children", () => {
      render(
        <MerchantProvider value="merchant-123">
          <div data-testid="child">Child content</div>
        </MerchantProvider>
      );

      expect(screen.getByTestId("child")).toHaveTextContent("Child content");
    });

    it("should render loading overlay with text when loading", () => {
      render(
        <MerchantProvider value="merchant-123">
          <TestLoading />
        </MerchantProvider>
      );

      act(() => {
        screen.getByTestId("show-btn").click();
      });

      // Check loading overlay is rendered with custom message
      expect(screen.getByText("Test loading message")).toBeInTheDocument();
      expect(screen.getByText("Please wait")).toBeInTheDocument();
    });

    it("should render default loading text when no text provided", () => {
      const TestDefaultLoading = () => {
        const { showLoading } = useLoading();
        return (
          <button onClick={() => showLoading()} data-testid="show-default-btn">
            Show Default
          </button>
        );
      };

      render(
        <MerchantProvider value="merchant-123">
          <TestDefaultLoading />
        </MerchantProvider>
      );

      act(() => {
        screen.getByTestId("show-default-btn").click();
      });

      expect(screen.getByText("กรุณารอสักครู่...")).toBeInTheDocument();
    });
  });
});
