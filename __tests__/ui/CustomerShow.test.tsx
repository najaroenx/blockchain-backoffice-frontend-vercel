// __tests__/CustomerShow.test.tsx
import { render, screen } from "@testing-library/react";
import { CustomerShow } from "@/components/customer/CustomerShow";
import { Show } from "react-admin";

jest.mock("react-admin", () => ({
  Show: jest.fn(({ children }) => <div data-testid="mock-show">{children}</div>)
}));

// Mock component ภายใน
jest.mock("@/components/customer/CustomerShowLayout", () => ({
  CustomerShowLayout: () => <div data-testid="customer-show-layout">Mock Layout</div>
}));

jest.mock("@/components/customs/ComponentCustomerWrapper", () => ({
  ComponentCustomerWrapper: ({ children }: any) => (
    <div data-testid="customer-wrapper">{children}</div>
  )
}));

describe("CustomerShow Component", () => {
  it("should render title and Show component", () => {
    render(<CustomerShow />);

    // ✅ ตรวจสอบ Title แสดงจริง
    expect(
      screen.getByText("Customer Detail")
    ).toBeInTheDocument();

    // ✅ ตรวจสอบ Mock Show component ถูกเรียก
    expect(screen.getByTestId("mock-show")).toBeInTheDocument();

    // ✅ ตรวจสอบ Customer Layout Render แล้ว
    expect(screen.getByTestId("customer-show-layout")).toBeInTheDocument();
  });
});
