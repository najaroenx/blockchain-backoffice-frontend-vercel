import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActivityRow from "@/app/dlt/components/dashboard/ActivityRow";

describe("ActivityRow Component", () => {
  const defaultProps = {
    icon: <span data-testid="test-icon">👁</span>,
    iconBg: "bg-purple-500/20",
    title: "Total Visits",
    change: "1.75%",
    changeType: "increase" as const,
    value: "23,124",
  };

  it("should render with correct title", () => {
    render(<ActivityRow {...defaultProps} />);
    expect(screen.getByText("Total Visits")).toBeInTheDocument();
  });

  it("should render with correct value", () => {
    render(<ActivityRow {...defaultProps} />);
    expect(screen.getByText("23,124")).toBeInTheDocument();
  });

  it("should render with correct change percentage", () => {
    render(<ActivityRow {...defaultProps} />);
    expect(screen.getByText(/1\.75%/)).toBeInTheDocument();
  });

  it("should show Increased by text for increase type", () => {
    render(<ActivityRow {...defaultProps} />);
    expect(screen.getByText(/Increased by/)).toBeInTheDocument();
  });

  it("should show Decreased by text for decrease type", () => {
    render(<ActivityRow {...defaultProps} changeType="decrease" />);
    expect(screen.getByText(/Decreased by/)).toBeInTheDocument();
  });

  it("should render the icon", () => {
    render(<ActivityRow {...defaultProps} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("should apply correct icon background class", () => {
    const { container } = render(<ActivityRow {...defaultProps} />);
    const iconContainer = container.querySelector(".bg-purple-500\\/20");
    expect(iconContainer).toBeInTheDocument();
  });
});
