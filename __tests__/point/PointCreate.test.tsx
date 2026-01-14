// __tests__/point/PointCreate.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ merchantId: "merchant-123" }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/",
  }),
}));

// Mock LoadingContext
jest.mock("@/contexts/LoadingContext", () => ({
  useLoading: () => ({
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
  }),
}));

// Mock react-admin
jest.mock("react-admin", () => ({
  Create: ({ children }: any) => (
    <div data-testid="create-wrapper">{children}</div>
  ),
  SimpleForm: ({ children, toolbar }: any) => (
    <form data-testid="simple-form">
      {children}
      {toolbar}
    </form>
  ),
  useRedirect: () => jest.fn(),
  useNotify: () => jest.fn(),
}));

// Mock PointForm
jest.mock("@/components/point/PointForm", () => ({
  PointForm: ({ isCreate }: any) => (
    <div data-testid="point-form">
      Point Form (Create: {isCreate ? "true" : "false"})
    </div>
  ),
}));

// Mock ComponentWrapper
jest.mock("@/components/layout/ComponentWrapper", () => ({
  ComponentWrapper: ({ children }: any) => <div>{children}</div>,
}));

// Mock SaveToolbar
jest.mock("@/components/customs/SaveToolbar", () => ({
  SaveToolbar: () => <div data-testid="save-toolbar">Save Toolbar</div>,
}));

import { PointCreate } from "@/components/point/PointCreate";

describe("PointCreate Component", () => {
  it("should render without crashing", () => {
    render(<PointCreate />);
    expect(screen.getByTestId("create-wrapper")).toBeInTheDocument();
  });

  it("should display 'Create Point' title", () => {
    render(<PointCreate />);
    expect(screen.getByText("Create Point")).toBeInTheDocument();
  });

  it("should render Create component from react-admin", () => {
    render(<PointCreate />);
    expect(screen.getByTestId("create-wrapper")).toBeInTheDocument();
  });

  it("should render SimpleForm", () => {
    render(<PointCreate />);
    expect(screen.getByTestId("simple-form")).toBeInTheDocument();
  });

  it("should render PointForm with isCreate=true", () => {
    render(<PointCreate />);
    expect(screen.getByTestId("point-form")).toBeInTheDocument();
    expect(screen.getByText(/Create: true/i)).toBeInTheDocument();
  });

  it("should render SaveToolbar", () => {
    render(<PointCreate />);
    expect(screen.getByTestId("save-toolbar")).toBeInTheDocument();
  });

  it("should have correct container styling", () => {
    const { container } = render(<PointCreate />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass("bg-slate-100");
  });

  it("should have correct title styling", () => {
    render(<PointCreate />);
    const title = screen.getByText("Create Point");
    expect(title).toHaveClass("font-medium", "text-xl");
  });
});
