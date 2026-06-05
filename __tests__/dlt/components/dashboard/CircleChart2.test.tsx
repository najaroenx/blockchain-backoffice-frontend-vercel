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

import CircleChart2 from "@/app/dlt/components/dashboard/CircleChart2";

describe("CircleChart2 Component", () => {
  it("should render alert banner text", () => {
    render(<CircleChart2 />);
    expect(
      screen.getByText(/We regret to inform you that our server is down/i)
    ).toBeInTheDocument();
  });

  it("should render Refresh link in alert", () => {
    render(<CircleChart2 />);
    expect(screen.getByText("Refresh")).toBeTruthy();
  });

  it("should render Revenue stat", () => {
    render(<CircleChart2 />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$56.63k")).toBeInTheDocument();
    expect(screen.getByText("↓ 3.91%")).toBeInTheDocument();
  });

  it("should render Orders stat", () => {
    render(<CircleChart2 />);
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("9,842")).toBeInTheDocument();
    expect(screen.getByText("↑ 8.72%")).toBeInTheDocument();
  });

  it("should render New Users stat", () => {
    render(<CircleChart2 />);
    expect(screen.getByText("New Users")).toBeInTheDocument();
    expect(screen.getByText("95.30k")).toBeInTheDocument();
    expect(screen.getByText("↑ 11.2%")).toBeInTheDocument();
  });

  it("should render New Contract stat", () => {
    render(<CircleChart2 />);
    expect(screen.getByText("New Contract")).toBeInTheDocument();
    expect(screen.getByText("851")).toBeInTheDocument();
    expect(screen.getByText("↓ 0%")).toBeInTheDocument();
  });

  it("should render Refresh Data button", () => {
    render(<CircleChart2 />);
    expect(screen.getByText("Refresh Data")).toBeInTheDocument();
  });

  it("should render the chart", () => {
    render(<CircleChart2 />);
    const chart = screen.getByTestId("apex-chart");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute("data-type", "line");
  });

  it("should render 2x2 grid stats", () => {
    render(<CircleChart2 />);
    const labels = ["Revenue", "Orders", "New Users", "New Contract"];
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
