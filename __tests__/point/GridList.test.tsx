// __tests__/point/GridList.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GridList } from "@/components/point/GridList";

// Mock data
const mockData = [
  {
    id: "point-1",
    name: "Point 1",
    contractAddress: "0x1234567890abcdef",
    symbol: "PT1",
    imageUrl: "https://example.com/point1.png",
  },
  {
    id: "point-2",
    name: "Point 2",
    contractAddress: "0xabcdef1234567890",
    symbol: "PT2",
    imageUrl: "https://example.com/point2.png",
  },
];

// Mock react-admin
const mockUseListContext = jest.fn();
jest.mock("react-admin", () => ({
  useListContext: () => mockUseListContext(),
  RecordContextProvider: ({ children, value }: any) => (
    <div data-testid={`record-${value.id}`}>{children}</div>
  ),
}));

// Mock PointCard
jest.mock("@/components/point/PointCard", () => ({
  PointCard: ({ id, name, contractAddress }: any) => (
    <div data-testid={`point-card-${id}`}>
      <h3>{name}</h3>
      <p>{contractAddress}</p>
    </div>
  ),
}));

// Mock Empty component
jest.mock("@/components/layout/Empty", () => ({
  Empty: () => <div data-testid="empty">No data</div>,
}));

// Mock Loading component
jest.mock("@/components/layout/Loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

describe("GridList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state when isPending is true", () => {
    mockUseListContext.mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<GridList />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should render empty state when data is null", () => {
    mockUseListContext.mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<GridList />);
    expect(screen.getByTestId("empty")).toBeInTheDocument();
  });

  it("should render empty state when data is empty array", () => {
    mockUseListContext.mockReturnValue({
      data: [],
      isPending: false,
    });

    render(<GridList />);
    expect(screen.getByTestId("empty")).toBeInTheDocument();
  });

  it("should render point cards when data is available", () => {
    mockUseListContext.mockReturnValue({
      data: mockData,
      isPending: false,
    });

    render(<GridList />);
    
    expect(screen.getByTestId("point-card-point-1")).toBeInTheDocument();
    expect(screen.getByTestId("point-card-point-2")).toBeInTheDocument();
  });

  it("should display correct point names", () => {
    mockUseListContext.mockReturnValue({
      data: mockData,
      isPending: false,
    });

    render(<GridList />);
    
    expect(screen.getByText("Point 1")).toBeInTheDocument();
    expect(screen.getByText("Point 2")).toBeInTheDocument();
  });

  it("should display correct contract addresses", () => {
    mockUseListContext.mockReturnValue({
      data: mockData,
      isPending: false,
    });

    render(<GridList />);
    
    expect(screen.getByText("0x1234567890abcdef")).toBeInTheDocument();
    expect(screen.getByText("0xabcdef1234567890")).toBeInTheDocument();
  });

  it("should wrap each card in RecordContextProvider", () => {
    mockUseListContext.mockReturnValue({
      data: mockData,
      isPending: false,
    });

    render(<GridList />);
    
    expect(screen.getByTestId("record-point-1")).toBeInTheDocument();
    expect(screen.getByTestId("record-point-2")).toBeInTheDocument();
  });

  it("should have correct grid layout classes", () => {
    mockUseListContext.mockReturnValue({
      data: mockData,
      isPending: false,
    });

    const { container } = render(<GridList />);
    const gridContainer = container.querySelector(".grid");
    
    expect(gridContainer).toHaveClass("grid-cols-1", "md:grid-cols-3");
  });
});
