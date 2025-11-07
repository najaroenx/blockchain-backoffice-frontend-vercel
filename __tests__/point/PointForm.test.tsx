// __tests__/point/PointForm.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PointForm } from "@/components/point/PointForm";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock react-admin components
jest.mock("react-admin", () => ({
  TextInput: ({ label, source }: any) => (
    <div data-testid={`text-input-${source}`}>
      <label>{label}</label>
      <input type="text" name={source} />
    </div>
  ),
  NumberInput: ({ label, source }: any) => (
    <div data-testid={`number-input-${source}`}>
      <label>{label}</label>
      <input type="number" name={source} />
    </div>
  ),
  AutocompleteInput: ({ label, source }: any) => (
    <div data-testid={`autocomplete-input-${source}`}>
      <label>{label}</label>
      <input type="text" name={source} />
    </div>
  ),
  RadioButtonGroupInput: ({ label, source }: any) => (
    <div data-testid={`radio-input-${source}`}>
      <label>{label}</label>
      <input type="radio" name={source} />
    </div>
  ),
  DateInput: ({ label, source }: any) => (
    <div data-testid={`date-input-${source}`}>
      <label>{label}</label>
      <input type="date" name={source} />
    </div>
  ),
  FormDataConsumer: ({ children }: any) => {
    const mockFormData = {
      name: "Test Token",
      symbol: "TST",
      imageUrl: "https://example.com/image.png",
      initialSupply: 1000000,
      decimal: 18,
    };
    return <>{children({ formData: mockFormData })}</>;
  },
  required: () => (value: any) => (value ? undefined : "Required"),
}));

// Mock constants
jest.mock("@/components/point/constants", () => ({
  DEFAULT_POINT_IMAGE: "/default-point.png",
}));

describe("PointForm Component", () => {
  it("should render without crashing", () => {
    render(<PointForm isCreate={true} />);
    expect(screen.getByText("Point Information")).toBeInTheDocument();
  });

  it("should display section number badge", () => {
    render(<PointForm isCreate={true} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should display 'Point Information' header", () => {
    render(<PointForm isCreate={true} />);
    expect(screen.getByText("Point Information")).toBeInTheDocument();
  });

  it("should display token preview section", () => {
    render(<PointForm isCreate={true} />);
    expect(screen.getByText("Token Preview")).toBeInTheDocument();
  });

  it("should display token name in preview", () => {
    render(<PointForm isCreate={true} />);
    expect(screen.getByText("Test Token")).toBeInTheDocument();
  });

  it("should display token symbol in uppercase", () => {
    render(<PointForm isCreate={true} />);
    expect(screen.getByText("TST")).toBeInTheDocument();
  });

  it("should display initial supply label", () => {
    render(<PointForm isCreate={true} />);
    const initialSupplyLabels = screen.getAllByText("Initial Supply");
    expect(initialSupplyLabels.length).toBeGreaterThan(0);
  });

  it("should display formatted initial supply", () => {
    render(<PointForm isCreate={true} />);
    expect(screen.getByText("1,000,000")).toBeInTheDocument();
  });

  it("should render with isCreate=false", () => {
    render(<PointForm isCreate={false} />);
    expect(screen.getByText("Point Information")).toBeInTheDocument();
  });

  it("should render preview image", () => {
    render(<PointForm isCreate={true} />);
    const image = screen.getByAltText("Test Token");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.png");
  });

  it("should have correct styling for section badge", () => {
    render(<PointForm isCreate={true} />);
    const badge = screen.getByText("1");
    expect(badge).toHaveClass("bg-[#FF8901]", "text-white", "font-semibold");
  });
});
