import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock react-apexcharts
jest.mock("react-apexcharts", () => {
  return function MockChart() {
    return <div data-testid="apex-chart">Chart</div>;
  };
});

import MiniStatCard from "@/app/dlt/components/dashboard/MiniStatCard";

describe("MiniStatCard Component", () => {
  const defaultProps = {
    icon: <span data-testid="test-icon">👁</span>,
    iconBg: "bg-purple-500/20",
    title: "Total Followers",
    value: "12,432",
    change: "+0.892 Increased",
    changeType: "increase" as const,
    chartData: [5, 8, 6, 10, 7, 12, 9],
    chartColor: "#a78bfa",
  };

  it("should render with correct title", () => {
    render(<MiniStatCard {...defaultProps} />);
    expect(screen.getByText("Total Followers")).toBeInTheDocument();
  });

  it("should render with correct value", () => {
    render(<MiniStatCard {...defaultProps} />);
    expect(screen.getByText("12,432")).toBeInTheDocument();
  });

  it("should render with correct change text", () => {
    render(<MiniStatCard {...defaultProps} />);
    expect(screen.getByText("+0.892 Increased")).toBeInTheDocument();
  });

  it("should show up arrow for increase type", () => {
    render(<MiniStatCard {...defaultProps} />);
    expect(screen.getByText("↗")).toBeInTheDocument();
  });

  it("should show down arrow for decrease type", () => {
    render(
      <MiniStatCard
        {...defaultProps}
        changeType="decrease"
        change="-1.5% Decreased"
      />,
    );
    expect(screen.getByText("↘")).toBeInTheDocument();
  });

  it("should render the icon", () => {
    render(<MiniStatCard {...defaultProps} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("should render chart", () => {
    render(<MiniStatCard {...defaultProps} />);
    expect(screen.getByTestId("apex-chart")).toBeInTheDocument();
  });

  it("should apply emerald color for increase", () => {
    const { container } = render(<MiniStatCard {...defaultProps} />);
    const changeElement = container.querySelector(".text-emerald-400");
    expect(changeElement).toBeInTheDocument();
  });

  it("should apply rose color for decrease", () => {
    const { container } = render(
      <MiniStatCard {...defaultProps} changeType="decrease" />,
    );
    const changeElement = container.querySelector(".text-rose-400");
    expect(changeElement).toBeInTheDocument();
  });
});
