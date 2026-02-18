import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart() {
    return <div data-testid="apex-chart">Chart</div>;
  };
});

import CouponCount from "@/app/dlt/components/dashboard/CouponCount/CouponCount";

describe("CouponCount Component", () => {
  const defaultProps = {
    couponCount: {
      total: 100,
      unsold: 40,
      sold: 60,
      unredeemed: 20,
      redeemed: 40,
    },
  };

  it("should render all coupon count fields", () => {
    render(<CouponCount {...defaultProps} />);
    expect(screen.getByText("คูปองทั้งหมด")).toBeInTheDocument();
    expect(screen.getByText("คูปองที่ยังไม่ได้ขาย")).toBeInTheDocument();
    expect(screen.getByText("คูปองที่ขายแล้ว")).toBeInTheDocument();
    expect(screen.getByText("คูปองที่ขายแล้ว End User ยังไม่ redeem")).toBeInTheDocument();
    expect(screen.getByText("คูปองที่ End User ได้ทำการ redeem แล้ว")).toBeInTheDocument();
  });

  it("should render correct values", () => {
    render(<CouponCount {...defaultProps} />);
    expect(screen.getByText("100")).toBeInTheDocument();
    // 40 appears twice (unsold=40, redeemed=40)
    expect(screen.getAllByText("40")).toHaveLength(2);
    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("should render charts", () => {
    render(<CouponCount {...defaultProps} />);
    const charts = screen.getAllByTestId("apex-chart");
    expect(charts.length).toBe(5); // 5 coupon fields = 5 cards with charts
  });

  it("should render with zero values", () => {
    render(
      <CouponCount
        couponCount={{ total: 0, unsold: 0, sold: 0, unredeemed: 0, redeemed: 0 }}
      />
    );
    const zeroValues = screen.getAllByText("0");
    expect(zeroValues.length).toBeGreaterThanOrEqual(5);
  });
});
