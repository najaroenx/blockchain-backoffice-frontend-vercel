import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart() {
    return <div data-testid="apex-chart">Chart</div>;
  };
});

// Mock @lottiefiles/dotlottie-react
jest.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: (props: any) => (
    <div data-testid="lottie-animation" className={props.className}>
      Lottie
    </div>
  ),
}));

// Mock MUI Select
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Select: ({ children, value, onChange, ...props }: any) => (
    <select
      data-testid="mui-select"
      value={value}
      onChange={(e: any) => onChange({ target: { value: e.target.value } })}
    >
      {children}
    </select>
  ),
  MenuItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectChangeEvent: {},
}));

const mockDashboardData = {
  dateRange: { startDate: "2026-01-19", endDate: "2026-02-18" },
  couponCount: { total: 100, unsold: 40, sold: 60, unredeemed: 20, redeemed: 40 },
  couponValue: { total: 5000, unsold: 2000, sold: 3000, unredeemed: 1000, redeemed: 2000 },
  couponValueByCurrency: [
    { currency: "THB", total: 5000, unsold: 2000, sold: 3000, unredeemed: 1000, redeemed: 2000 },
  ],
  endUsers: { total: 50, unredeemedUsers: 20, redeemedUsers: 30 },
  transactions: { transferPoint: 100, purchaseCoupon: 200 },
  points: [{ symbol: "PNT", total: 1000, balance: 500 }],
  thbToken: { deposited: 2300, balance: 0, bought: 2300 },
};

const mockCouponData = {
  coupons: [
    { id: "all", name: "All Coupons" },
    { id: "coupon-1", name: "Starbuck100" },
  ],
};

// Mock server actions
const mockGetDashboardData = jest.fn().mockResolvedValue(mockDashboardData);
const mockGetCouponData = jest.fn().mockResolvedValue(mockCouponData);

jest.mock("@/app/dlt/merchant/[merchantId]/action", () => ({
  getDashboardData: (...args: any[]) => mockGetDashboardData(...args),
  getCouponData: (...args: any[]) => mockGetCouponData(...args),
}));

import ClientDashboard from "@/app/dlt/components/dashboard/ClientDashboard";

// Helper: flush microtask queue (resolved promises)
const flushPromises = () => new Promise((r) => jest.requireActual("timers").setImmediate(r));

// Helper: render, flush async work, and advance past setTimeout
async function renderAndLoad() {
  await act(async () => {
    render(<ClientDashboard merchantId="merchant-1" />);
  });
  // Flush the resolved promises (getDashboardData, getCouponData)
  await act(async () => {
    await flushPromises();
  });
  // Advance past the setTimeout(1000) in fetchDashboard finally block
  await act(async () => {
    jest.advanceTimersByTime(1500);
  });
  // Flush any remaining state updates
  await act(async () => {
    await flushPromises();
  });
}

describe("ClientDashboard Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should show loading state initially", async () => {
    await act(async () => {
      render(<ClientDashboard merchantId="merchant-1" />);
    });
    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });

  it("should show loading animation (Lottie)", async () => {
    await act(async () => {
      render(<ClientDashboard merchantId="merchant-1" />);
    });
    expect(screen.getByTestId("lottie-animation")).toBeInTheDocument();
  });

  it("should call getDashboardData and getCouponData on mount", async () => {
    await act(async () => {
      render(<ClientDashboard merchantId="merchant-1" />);
    });
    await act(async () => {
      await flushPromises();
    });
    expect(mockGetCouponData).toHaveBeenCalledWith("merchant-1");
    expect(mockGetDashboardData).toHaveBeenCalled();
  });

  it("should render dashboard sections after loading complete", async () => {
    await renderAndLoad();
    expect(screen.getByText("จำนวนคูปอง")).toBeInTheDocument();
  });

  it("should render coupon value section after loading", async () => {
    await renderAndLoad();
    expect(screen.getByText("มูลค่าคูปอง & Token")).toBeInTheDocument();
  });

  it("should render Point & End User section after loading", async () => {
    await renderAndLoad();
    expect(screen.getByText("Point & End User")).toBeInTheDocument();
  });

  it("should render currency & transaction section after loading", async () => {
    await renderAndLoad();
    expect(screen.getByText("คูปองตามสกุล & Transaction")).toBeInTheDocument();
  });

  it("should render coupon selector after loading", async () => {
    await renderAndLoad();
    expect(screen.getByText("เลือกคูปอง")).toBeInTheDocument();
  });

  it("should handle fetch error gracefully", async () => {
    mockGetDashboardData.mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      render(<ClientDashboard merchantId="merchant-1" />);
    });
    await act(async () => {
      await flushPromises();
    });
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(mockGetDashboardData).toHaveBeenCalled();
    // Should not crash
  });

  it("should handle coupon data fetch error gracefully", async () => {
    mockGetCouponData.mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      render(<ClientDashboard merchantId="merchant-1" />);
    });
    await act(async () => {
      await flushPromises();
    });

    expect(mockGetCouponData).toHaveBeenCalled();
  });
});
