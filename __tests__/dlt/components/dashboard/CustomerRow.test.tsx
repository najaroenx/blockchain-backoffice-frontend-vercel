import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock MUI AddIcon
jest.mock("@mui/icons-material/Add", () => {
  return function MockAddIcon({ className }: { className?: string }) {
    return (
      <span data-testid="add-icon" className={className}>
        +
      </span>
    );
  };
});

import CustomerRow from "@/app/dlt/components/dashboard/CustomerRow";

describe("CustomerRow Component", () => {
  const defaultProps = {
    name: "098xxx0421",
    initial: "D",
    color: "bg-purple-500",
  };

  it("should render with correct name", () => {
    render(<CustomerRow {...defaultProps} />);
    expect(screen.getByText("098xxx0421")).toBeInTheDocument();
  });

  it("should render with correct initial", () => {
    render(<CustomerRow {...defaultProps} />);
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("should render default points", () => {
    render(<CustomerRow {...defaultProps} />);
    expect(screen.getByText("1000 PTS")).toBeInTheDocument();
  });

  it("should render custom points", () => {
    render(<CustomerRow {...defaultProps} points="500 PTS" />);
    expect(screen.getByText("500 PTS")).toBeInTheDocument();
  });

  it("should render default action", () => {
    render(<CustomerRow {...defaultProps} />);
    expect(screen.getByText("Transfer")).toBeInTheDocument();
  });

  it("should render custom action", () => {
    render(<CustomerRow {...defaultProps} action="Redeem" />);
    expect(screen.getByText("Redeem")).toBeInTheDocument();
  });

  it("should render add button", () => {
    render(<CustomerRow {...defaultProps} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should apply correct color class to avatar", () => {
    const { container } = render(<CustomerRow {...defaultProps} />);
    const avatar = container.querySelector(".bg-purple-500");
    expect(avatar).toBeInTheDocument();
  });
});
