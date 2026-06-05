import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart() {
    return <div data-testid="apex-chart">Chart</div>;
  };
});

import PointUseAndUserInformation from "@/app/dlt/components/dashboard/PointUseAndUserInformation/PointUseAndUserInformation";

describe("PointUseAndUserInformation Component", () => {
  const defaultProps = {
    pointInfo: [
      { symbol: "PNT", total: 1000, balance: 500 },
      { symbol: "BNT", total: 2000, balance: 800 },
    ],
    endUserInfo: {
      total: 50,
      unredeemedUsers: 20,
      redeemedUsers: 30,
    },
  };

  it("should render Point Information bar chart", () => {
    render(<PointUseAndUserInformation {...defaultProps} />);
    expect(screen.getByText("Point Information")).toBeInTheDocument();
  });

  it("should render End User donut chart", () => {
    render(<PointUseAndUserInformation {...defaultProps} />);
    expect(screen.getByText("ข้อมูล End User")).toBeInTheDocument();
  });

  it("should render End User labels with correct values", () => {
    render(<PointUseAndUserInformation {...defaultProps} />);
    expect(screen.getByText(/จำนวน End User ที่ซื้อทั้งหมด : 50/)).toBeInTheDocument();
    expect(screen.getByText(/จำนวน End User ซื้อแต่ยังไม่ใช้ : 20/)).toBeInTheDocument();
    expect(screen.getByText(/จำนวน End User redeem แล้วจริง ๆ : 30/)).toBeInTheDocument();
  });

  it("should render charts", () => {
    render(<PointUseAndUserInformation {...defaultProps} />);
    const charts = screen.getAllByTestId("apex-chart");
    expect(charts.length).toBeGreaterThanOrEqual(2); // bar chart + donut chart
  });

  it("should handle empty point info", () => {
    render(
      <PointUseAndUserInformation
        pointInfo={[]}
        endUserInfo={{ total: 0, unredeemedUsers: 0, redeemedUsers: 0 }}
      />
    );
    expect(screen.getByText("Point Information")).toBeInTheDocument();
    expect(screen.getByText("ข้อมูล End User")).toBeInTheDocument();
  });
});
