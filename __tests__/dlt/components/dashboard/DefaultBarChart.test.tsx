import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart(props: any) {
    return <div data-testid="apex-chart" data-type={props.type}>Chart</div>;
  };
});

import DefaultBarChart from "@/app/dlt/components/dashboard/DefaultBarChanrt";

describe("DefaultBarChart Component", () => {
  const defaultProps = {
    title: "Point Information",
    sub: "(Point)",
    labels: ["PNT", "BNT"],
    series: [
      { name: "Total", type: "bar" as const, data: [1000, 2000] },
      { name: "Balance", type: "bar" as const, data: [500, 800] },
    ],
  };

  it("should render chart title", () => {
    render(<DefaultBarChart {...defaultProps} />);
    expect(screen.getByText("Point Information")).toBeInTheDocument();
  });

  it("should render chart subtitle", () => {
    render(<DefaultBarChart {...defaultProps} />);
    expect(screen.getByText("(Point)")).toBeInTheDocument();
  });

  it("should render chart", () => {
    render(<DefaultBarChart {...defaultProps} />);
    expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
  });

  it("should render with default props", () => {
    render(<DefaultBarChart />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("(Current Year)")).toBeInTheDocument();
  });

  it("should handle empty series and labels", () => {
    render(<DefaultBarChart title="Empty" sub="" series={[]} labels={[]} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });
});
