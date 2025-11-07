import { render, screen } from "@testing-library/react";
import { CustomLayout } from "@/components/layout/Layout";

// ✅ Mock react-admin Layout เพื่อไม่ให้ซับซ้อนเกินไป
jest.mock("react-admin", () => ({
  Layout: ({ children }: any) => <div data-testid="mock-layout">{children}</div>,
}));

// ✅ Mock CustomAppBar & CustomMenu เพื่อให้ render ได้
jest.mock("@/components/layout/AppBar", () => ({
  CustomAppBar: () => <div>Mock AppBar</div>,
}));

jest.mock("@/components/layout/Menu", () => ({
  CustomMenu: () => <div>Mock Menu</div>,
}));

describe("CustomLayout", () => {
  it("renders children inside Layout", () => {
    render(
      <CustomLayout>
        <p>Test Child</p>
      </CustomLayout>
    );

    // ✅ ตรวจว่ามี layout container
    expect(screen.getByTestId("mock-layout")).toBeInTheDocument();

    // ✅ ตรวจว่ามี children
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
