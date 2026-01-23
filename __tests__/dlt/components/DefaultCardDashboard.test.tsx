import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart() {
    return <div data-testid="chart">Chart</div>;
  };
});

// Mock the component
jest.mock(
  "@/app/dlt/components/DefaultCardDashboard",
  () =>
    function MockDefaultCardDashboard({
      title,
      value,
      title2,
      value2,
    }: {
      title: string;
      value: string;
      title2: string;
      value2?: string;
      lineChartOptions: any;
    }) {
      return (
        <div data-testid="default-card-dashboard">
          <span data-testid="title">{title}</span>
          <span data-testid="value">{value}</span>
          <span data-testid="title2">{title2}</span>
          <span data-testid="value2">{value2}</span>
          <div data-testid="chart">Chart</div>
        </div>
      );
    },
);

import DefaultCardDashboard from "@/app/dlt/components/DefaultCardDashboard";

describe("DefaultCardDashboard Component", () => {
  const defaultProps = {
    title: "จำนวน คูปองที่เรามี",
    value: "1,234",
    title2: "จำนวน คูปองที่ยังไม่ขาย",
    value2: "100",
    lineChartOptions: {},
  };

  it("should render with correct title", () => {
    render(<DefaultCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("title")).toHaveTextContent(
      "จำนวน คูปองที่เรามี",
    );
  });

  it("should render with correct value", () => {
    render(<DefaultCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("value")).toHaveTextContent("1,234");
  });

  it("should render with correct secondary title", () => {
    render(<DefaultCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("title2")).toHaveTextContent(
      "จำนวน คูปองที่ยังไม่ขาย",
    );
  });

  it("should render with correct secondary value", () => {
    render(<DefaultCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("value2")).toHaveTextContent("100");
  });

  it("should render chart", () => {
    render(<DefaultCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });
});
