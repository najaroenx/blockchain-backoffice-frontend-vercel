import { render, screen, waitFor, act } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import dayjs from "dayjs";

// Mock dependencies
jest.mock("@/libs/api", () => ({
  api: jest.fn(),
}));

jest.mock("@/app/dlt/hooks/useApiWithLoading", () => ({
  useApiWithLoading: () => ({
    execute: jest.fn((fn) => fn()),
    isExecuting: false,
  }),
}));

// Mock Chart
jest.mock("react-apexcharts", () => ({
  __esModule: true,
  default: () => <div data-testid="apex-chart" />,
}));

// Mock DateRangeFilter
jest.mock("@/app/dlt/components/DateRangeFilter", () => {
  return function MockDateRangeFilter({
    onStartDateChange,
    onEndDateChange,
  }: any) {
    return (
      <div data-testid="date-range-filter">
        <button
          onClick={() => {
            onStartDateChange(dayjs("2024-01-01"));
            onEndDateChange(dayjs("2024-01-31"));
          }}
        >
          Apply Date Range
        </button>
      </div>
    );
  };
});

import MarketerDashboard from "@/app/dlt/components/MarketerDashboard";
import { api } from "@/libs/api";

describe("MarketerDashboard Component", () => {
  const mockMerchantId = "merchant-123";
  const mockDashboardData = {
    dateRange: { startDate: "2024-01-01", endDate: "2024-01-31" },
    couponCount: {
      total: 1000,
      purchased: 800,
      soldToEndUser: 500,
      pendingUse: 100,
      redeemed: 400,
    },
    couponValue: {
      total: 1000000,
      sold: 500000,
      pendingUse: 100000,
      redeemed: 400000,
    },
    endUsers: {
      total: 200,
      buyers: 150,
      couponsSold: 500,
      pendingUsers: 20,
      redeemedUsers: 130,
    },
    transactions: {
      transferPoint: 50,
      redeemPoint: 20,
    },
    points: {
      total: 5000,
      types: ["Gold", "Silver"],
    },
    thbToken: {
      deposited: 10000,
      usedForPromotion: 2000,
      usedForRedeem: 3000,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (api as jest.Mock).mockResolvedValue(mockDashboardData);
  });

  it("should render dashboard header", () => {
    render(<MarketerDashboard merchantId={mockMerchantId} />);
    expect(screen.getByText("Marketing Dashboard")).toBeInTheDocument();
  });

  it("should fetch dashboard data on mount", async () => {
    render(<MarketerDashboard merchantId={mockMerchantId} />);

    await waitFor(() => {
      expect(api).toHaveBeenCalledWith(
        `/api/${mockMerchantId}/dashboard/marketer`,
        expect.objectContaining({
          method: "GET",
          queryParams: expect.any(Object),
        }),
      );
    });
  });

  it("should render charts", async () => {
    render(<MarketerDashboard merchantId={mockMerchantId} />);

    // Wait for data fetch
    await waitFor(() => expect(api).toHaveBeenCalled());

    const charts = screen.getAllByTestId("apex-chart");
    expect(charts.length).toBeGreaterThan(0);
  });

  it("should display stats correctly", async () => {
    render(<MarketerDashboard merchantId={mockMerchantId} />);

    await waitFor(() => expect(screen.getByText("1,000")).toBeInTheDocument()); // Coupon total
    const soldElements = screen.getAllByText("500");
    expect(soldElements.length).toBeGreaterThan(0);
    expect(screen.getByText("฿1,000,000")).toBeInTheDocument(); // Coupon Value Total
  });

  it("should display end user stats", async () => {
    render(<MarketerDashboard merchantId={mockMerchantId} />);
    await waitFor(() => expect(api).toHaveBeenCalled());

    expect(screen.getByText("จำนวน Users")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument(); // Total Users
  });

  it("should update data when date range changes", async () => {
    render(<MarketerDashboard merchantId={mockMerchantId} />);

    await waitFor(() => expect(api).toHaveBeenCalledTimes(1));

    const filterButton = screen.getByText("Apply Date Range");
    await act(async () => {
      filterButton.click();
    });

    await waitFor(() => expect(api).toHaveBeenCalledTimes(2));
  });
});
