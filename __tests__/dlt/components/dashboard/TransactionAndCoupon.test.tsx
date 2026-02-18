import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart() {
    return <div data-testid="apex-chart">Chart</div>;
  };
});

// Mock MUI Select
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Select: ({ children, value, onChange, ...props }: any) => (
    <select
      data-testid="currency-select"
      value={value}
      onChange={(e: any) => onChange({ target: { value: e.target.value } })}
    >
      {children}
    </select>
  ),
  MenuItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectChangeEvent: {},
}));

import TransactionAndCoupon from "@/app/dlt/components/dashboard/TransactionAndCoupon/TransactionAndCoupon";

describe("TransactionAndCoupon Component", () => {
  const defaultProps = {
    couponByCurrency: [
      { currency: "THB", total: 5000, unsold: 2000, sold: 3000, unredeemed: 1000, redeemed: 2000 },
      { currency: "USD", total: 200, unsold: 80, sold: 120, unredeemed: 40, redeemed: 80 },
    ],
    transaction: {
      transferPoint: 100,
      purchaseCoupon: 200,
    },
  };

  it("should render currency selector", () => {
    render(<TransactionAndCoupon {...defaultProps} />);
    expect(screen.getByTestId("currency-select")).toBeInTheDocument();
  });

  it("should render coupon by currency donut chart", () => {
    render(<TransactionAndCoupon {...defaultProps} />);
    expect(screen.getByText(/คูปองตามสกุล/)).toBeInTheDocument();
  });

  it("should render transaction donut chart", () => {
    render(<TransactionAndCoupon {...defaultProps} />);
    expect(screen.getByText("ข้อมูล Transaction")).toBeInTheDocument();
  });

  it("should render transaction labels", () => {
    render(<TransactionAndCoupon {...defaultProps} />);
    expect(screen.getByText(/จำนวนรายการโอน Point : 100/)).toBeInTheDocument();
    expect(screen.getByText(/จำนวนรายการซื้อ Coupon : 200/)).toBeInTheDocument();
  });

  it("should render currency options", () => {
    render(<TransactionAndCoupon {...defaultProps} />);
    expect(screen.getByText("THB")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("should default to first currency", () => {
    render(<TransactionAndCoupon {...defaultProps} />);
    const select = screen.getByTestId("currency-select") as HTMLSelectElement;
    expect(select.value).toBe("THB");
  });

  it("should handle empty couponByCurrency", () => {
    render(
      <TransactionAndCoupon
        couponByCurrency={[]}
        transaction={{ transferPoint: 0, purchaseCoupon: 0 }}
      />
    );
    expect(screen.getByText("ข้อมูล Transaction")).toBeInTheDocument();
  });
});
