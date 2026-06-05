import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

import StatCard from "@/app/dlt/components/dashboard/StatCard";

describe("StatCard Component", () => {
  const defaultProps = {
    title: "จำนวน Users",
    value: "1,234",
    icon: "/images/icons/man.png",
  };

  it("should render with correct title", () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText("จำนวน Users")).toBeInTheDocument();
  });

  it("should render with correct value", () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("should render icon with correct src", () => {
    render(<StatCard {...defaultProps} />);
    const icon = screen.getByAltText("จำนวน Users");
    expect(icon).toHaveAttribute("src", "/images/icons/man.png");
  });

  it("should render with different values", () => {
    render(
      <StatCard title="คนที่ซื้อ" value="500" icon="/images/icons/buy.png" />,
    );
    expect(screen.getByText("คนที่ซื้อ")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("should have hover effect container", () => {
    const { container } = render(<StatCard {...defaultProps} />);
    const card = container.querySelector(".group");
    expect(card).toBeInTheDocument();
  });

  it("should render globe emoji for watermark", () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText("🌐")).toBeInTheDocument();
  });
});
