// __tests__/point/PointList.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PointList from "@/components/point/PointList";

// Mock react-admin components
jest.mock("react-admin", () => ({
  ListBase: ({ children }: any) => <div data-testid="list-base">{children}</div>,
  useListContext: () => ({
    data: [],
    isLoading: false,
    total: 0,
  }),
}));

// Mock GridList component
jest.mock("@/components/point/GridList", () => ({
  GridList: () => <div data-testid="grid-list">Grid List</div>,
}));

// Mock ListActions component
jest.mock("@/components/customs/ListAction", () => ({
  ListActions: ({ title }: any) => <div data-testid="list-actions">{title}</div>,
}));

describe("PointList Component", () => {
  it("should render without crashing", () => {
    render(<PointList />);
    expect(screen.getByTestId("list-base")).toBeInTheDocument();
  });

  it("should render ListActions with 'Points' title", () => {
    render(<PointList />);
    expect(screen.getByTestId("list-actions")).toBeInTheDocument();
    expect(screen.getByText("Points")).toBeInTheDocument();
  });

  it("should render GridList component", () => {
    render(<PointList />);
    expect(screen.getByTestId("grid-list")).toBeInTheDocument();
  });

  it("should have correct container classes", () => {
    const { container } = render(<PointList />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass("bg-slate-100");
  });
});
