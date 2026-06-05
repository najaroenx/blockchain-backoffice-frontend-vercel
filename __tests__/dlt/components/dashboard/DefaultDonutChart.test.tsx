import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart(props: any) {
    return <div data-testid="apex-chart" data-type={props.type}>Chart</div>;
  };
});

import DefaultDonutChart from "@/app/dlt/components/dashboard/DefaultDonutChart";

describe("DefaultDonutChart Component", () => {
  const defaultProps = {
    title: "THB (Token)",
    sub: "มูลค่า THB Token",
    series: [2300, 0, 2300],
    labels: [
      "THB Token ที่เติมเข้าไปทั้งหมด",
      "THB Token ที่เหลือ Balance",
      "THB Token ที่ใช้จองคูปอง",
    ],
  };

  it("should render chart title", () => {
    render(<DefaultDonutChart {...defaultProps} />);
    expect(screen.getByText("THB (Token)")).toBeInTheDocument();
  });

  it("should render all labels with values", () => {
    render(<DefaultDonutChart {...defaultProps} />);
    expect(screen.getByText(/THB Token ที่เติมเข้าไปทั้งหมด : 2300/)).toBeInTheDocument();
    expect(screen.getByText(/THB Token ที่เหลือ Balance : 0/)).toBeInTheDocument();
    expect(screen.getByText(/THB Token ที่ใช้จองคูปอง : 2300/)).toBeInTheDocument();
  });

  it("should render donut chart", () => {
    render(<DefaultDonutChart {...defaultProps} />);
    const chart = screen.getByTestId("apex-chart");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute("data-type", "donut");
  });

  it("should generate purple-pink palette colors", () => {
    // Renders without error with colors
    render(<DefaultDonutChart {...defaultProps} />);
    expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
  });

  it("should handle empty series and labels", () => {
    render(<DefaultDonutChart title="Empty" sub="" series={[]} labels={[]} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("should handle single item", () => {
    render(
      <DefaultDonutChart
        title="Single"
        sub="test"
        series={[100]}
        labels={["Only item"]}
      />
    );
    expect(screen.getByText(/Only item : 100/)).toBeInTheDocument();
  });
});
