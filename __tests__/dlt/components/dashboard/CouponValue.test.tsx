import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart() {
    return <div data-testid="apex-chart">Chart</div>;
  };
});

import CouponValue from "@/app/dlt/components/dashboard/CouponValue/CouponValue";

describe("CouponValue Component", () => {
  const defaultProps = {
    couponValue: {
      total: 5000,
      unsold: 2000,
      sold: 3000,
      unredeemed: 1000,
      redeemed: 2000,
    },
    thbToken: {
      deposited: 2300,
      balance: 0,
      bought: 2300,
    },
  };

  it("should render all coupon value cards", () => {
    render(<CouponValue {...defaultProps} />);
    expect(screen.getByText("มูลค่า คูปองที่ขายทั้งหมด")).toBeInTheDocument();
    expect(screen.getByText("มูลค่า คูปองที่ยังไม่ได้ขาย")).toBeInTheDocument();
    expect(screen.getByText("มูลค่าคูปองที่ขายทั้งหมด THB")).toBeInTheDocument();
    expect(screen.getByText("มูลค่าคูปองที่ End User ซื้อแต่ยังไม่ใช้ THB")).toBeInTheDocument();
    expect(screen.getByText("มูลค่าคูปองที่ End User redeem แล้วจริง ๆ THB")).toBeInTheDocument();
  });

  it("should render coupon value amounts", () => {
    render(<CouponValue {...defaultProps} />);
    expect(screen.getByText("5000")).toBeInTheDocument();
    // 2000 appears multiple times (unsold=2000, redeemed=2000, and in token legend)
    expect(screen.getAllByText("2000").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("3000")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("should render THB Token donut chart", () => {
    render(<CouponValue {...defaultProps} />);
    expect(screen.getByText("THB (Token)")).toBeInTheDocument();
  });

  it("should render THB Token labels", () => {
    render(<CouponValue {...defaultProps} />);
    expect(screen.getByText(/THB Token ที่เติมเข้าไปทั้งหมด/)).toBeInTheDocument();
    expect(screen.getByText(/THB Token ที่เหลือ Balance/)).toBeInTheDocument();
    expect(screen.getByText(/THB Token ที่ใช้จองคูปอง จาก Promotion Seller/)).toBeInTheDocument();
  });

  it("should render donut chart for tokens", () => {
    render(<CouponValue {...defaultProps} />);
    const charts = screen.getAllByTestId("apex-chart");
    expect(charts.length).toBeGreaterThanOrEqual(1);
  });

  it("should handle zero values", () => {
    render(
      <CouponValue
        couponValue={{ total: 0, unsold: 0, sold: 0, unredeemed: 0, redeemed: 0 }}
        thbToken={{ deposited: 0, balance: 0, bought: 0 }}
      />
    );
    expect(screen.getByText("THB (Token)")).toBeInTheDocument();
  });
});
