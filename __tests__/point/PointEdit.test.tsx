// __tests__/point/PointEdit.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PointEdit } from "@/components/point/PointEdit";

// Mock react-admin
jest.mock("react-admin", () => ({
  Edit: ({ children }: any) => <div data-testid="edit-wrapper">{children}</div>,
  SimpleForm: ({ children, toolbar }: any) => (
    <form data-testid="simple-form">
      {children}
      {toolbar}
    </form>
  ),
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
  SaveToolbar: ({ enableDelete }: any) => (
    <div data-testid="save-toolbar">
      Save Toolbar (Delete: {enableDelete ? "enabled" : "disabled"})
    </div>
  ),
}));

describe("PointEdit Component", () => {
  it("should render without crashing", () => {
    render(<PointEdit />);
    expect(screen.getByTestId("edit-wrapper")).toBeInTheDocument();
  });

  it("should display 'Edit Point' title", () => {
    render(<PointEdit />);
    expect(screen.getByText("Edit Point")).toBeInTheDocument();
  });

  it("should render Edit component from react-admin", () => {
    render(<PointEdit />);
    expect(screen.getByTestId("edit-wrapper")).toBeInTheDocument();
  });

  it("should render SimpleForm", () => {
    render(<PointEdit />);
    expect(screen.getByTestId("simple-form")).toBeInTheDocument();
  });

  it("should render PointForm with isCreate=false", () => {
    render(<PointEdit />);
    expect(screen.getByTestId("point-form")).toBeInTheDocument();
    expect(screen.getByText(/Create: false/i)).toBeInTheDocument();
  });

  it("should render SaveToolbar with delete enabled", () => {
    render(<PointEdit />);
    expect(screen.getByTestId("save-toolbar")).toBeInTheDocument();
    expect(screen.getByText(/Delete: enabled/i)).toBeInTheDocument();
  });

  it("should have correct container styling", () => {
    const { container } = render(<PointEdit />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass("bg-slate-100");
  });

  it("should have correct title styling", () => {
    render(<PointEdit />);
    const title = screen.getByText("Edit Point");
    expect(title).toHaveClass("font-medium", "text-xl", "text-[#1C2A53]");
  });
});
