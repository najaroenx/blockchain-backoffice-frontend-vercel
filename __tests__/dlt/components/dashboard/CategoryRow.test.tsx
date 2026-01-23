import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CategoryRow from "@/app/dlt/components/dashboard/CategoryRow";

describe("CategoryRow Component", () => {
  const defaultProps = {
    name: "ร้านป้าส้ม",
    value: "$5,000",
    count: "5641",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-400",
  };

  it("should render with correct name", () => {
    render(<CategoryRow {...defaultProps} />);
    expect(screen.getByText("ร้านป้าส้ม")).toBeInTheDocument();
  });

  it("should render with correct value", () => {
    render(<CategoryRow {...defaultProps} />);
    expect(screen.getByText("$5,000")).toBeInTheDocument();
  });

  it("should render with correct count", () => {
    render(<CategoryRow {...defaultProps} />);
    expect(screen.getByText("5641")).toBeInTheDocument();
  });

  it("should apply correct background color class", () => {
    const { container } = render(<CategoryRow {...defaultProps} />);
    const element = container.querySelector(".bg-amber-500\\/20");
    expect(element).toBeInTheDocument();
  });

  it("should apply correct text color class", () => {
    const { container } = render(<CategoryRow {...defaultProps} />);
    const element = container.querySelector(".text-amber-400");
    expect(element).toBeInTheDocument();
  });

  it("should render with different props", () => {
    render(
      <CategoryRow
        name="กาแฟ Number9"
        value="$10,000"
        count="10K"
        bgColor="bg-gray-700/50"
        textColor="text-gray-300"
      />,
    );
    expect(screen.getByText("กาแฟ Number9")).toBeInTheDocument();
    expect(screen.getByText("$10,000")).toBeInTheDocument();
    expect(screen.getByText("10K")).toBeInTheDocument();
  });
});
