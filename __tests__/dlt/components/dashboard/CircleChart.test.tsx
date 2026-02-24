import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart(props: any) {
    return (
      <div data-testid="apex-chart" data-type={props.type}>
        Chart
      </div>
    );
  };
});

import CircleChart from "@/app/dlt/components/dashboard/CircleChart";

describe("CircleChart Component", () => {
  const defaultProps = {
    title: "Coupon by Currency",
    sub: "Top selling coupon",
    series: [50, 30, 60],
    labels: ["Online", "Offline", "Direct"],
  };

  it("should render the title", () => {
    render(<CircleChart {...defaultProps} />);
    expect(screen.getByText("Coupon by Currency")).toBeInTheDocument();
  });

  it("should render the sub text", () => {
    render(<CircleChart {...defaultProps} />);
    expect(screen.getByText("Top selling coupon")).toBeInTheDocument();
  });

  it("should render Refresh button", () => {
    render(<CircleChart {...defaultProps} />);
    expect(screen.getByText("Refresh")).toBeInTheDocument();
  });

  it("should render donut chart", () => {
    render(<CircleChart {...defaultProps} />);
    const chart = screen.getByTestId("apex-chart");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute("data-type", "donut");
  });

  it("should render with custom title and sub", () => {
    render(
      <CircleChart
        title="Custom Title"
        sub="Custom Sub"
        series={[10, 20]}
        labels={["A", "B"]}
      />
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Sub")).toBeInTheDocument();
  });

  it("should render StarIcon badge with sub text", () => {
    render(<CircleChart {...defaultProps} />);
    const badge = screen.getByText("Top selling coupon");
    expect(badge.closest("span")).toHaveClass("rounded-full");
  });
});
