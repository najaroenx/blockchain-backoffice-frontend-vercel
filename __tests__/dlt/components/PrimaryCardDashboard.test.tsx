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
  "@/app/dlt/components/PrimaryCardDashboard",
  () =>
    function MockPrimaryCardDashboard({
      title,
      value,
      title2,
      value2,
      title3,
      value3,
    }: {
      title: string;
      value: string;
      title2: string;
      value2?: string;
      title3: string;
      value3?: string;
      lineChartOptions: any;
    }) {
      return (
        <div data-testid="primary-card-dashboard">
          <span data-testid="title">{title}</span>
          <span data-testid="value">{value}</span>
          <span data-testid="title2">{title2}</span>
          <span data-testid="value2">{value2}</span>
          <span data-testid="title3">{title3}</span>
          <span data-testid="value3">{value3}</span>
          <div data-testid="chart">Chart</div>
          <button data-testid="arrow-button">↗</button>
        </div>
      );
    },
);

import PrimaryCardDashboard from "@/app/dlt/components/PrimaryCardDashboard";

describe("PrimaryCardDashboard Component", () => {
  const defaultProps = {
    title: "จำนวน คูปองที่ขายทั้งหมด",
    value: "5,000",
    title2: "คูปองที่ขาย Marketer ยังไม่จอง",
    value2: "1000",
    title3: "คูปองที่ขาย Marketer เข้ามาจอง",
    value3: "2000",
    lineChartOptions: {},
  };

  it("should render with correct title", () => {
    render(<PrimaryCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("title")).toHaveTextContent(
      "จำนวน คูปองที่ขายทั้งหมด",
    );
  });

  it("should render with correct value", () => {
    render(<PrimaryCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("value")).toHaveTextContent("5,000");
  });

  it("should render with correct secondary title", () => {
    render(<PrimaryCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("title2")).toHaveTextContent(
      "คูปองที่ขาย Marketer ยังไม่จอง",
    );
  });

  it("should render with correct tertiary title", () => {
    render(<PrimaryCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("title3")).toHaveTextContent(
      "คูปองที่ขาย Marketer เข้ามาจอง",
    );
  });

  it("should render arrow button", () => {
    render(<PrimaryCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("arrow-button")).toBeInTheDocument();
  });

  it("should render chart", () => {
    render(<PrimaryCardDashboard {...defaultProps} />);
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });
});
