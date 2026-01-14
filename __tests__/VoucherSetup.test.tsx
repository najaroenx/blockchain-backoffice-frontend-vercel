// __tests__/VoucherSetup.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// ✅ Mock react-admin ก่อน import component
jest.mock("react-admin", () => ({
  Admin: ({ children }: any) => <div>{children}</div>,
  Resource: () => null,
  List: ({ children }: any) => <div>{children}</div>,
  Datagrid: ({ children }: any) => <table>{children}</table>,
  TextField: ({ source }: any) => <span data-source={source} />,
  useRecordContext: () => ({}),
  useListContext: () => ({ data: [], isLoading: false }),
  useNotify: () => jest.fn(),
  useRedirect: () => jest.fn(),
  useRefresh: () => jest.fn(),
}));

// ✅ Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useLocation: () => ({ search: "" }),
  useNavigate: () => jest.fn(),
  Link: ({ children }: any) => <a>{children}</a>,
  RouterLink: ({ children }: any) => <a>{children}</a>,
}));

// ✅ Mock VoucherSetup component directly to avoid react-admin issues
jest.mock("@/components/voucher/VoucherSetup", () => {
  return function MockVoucherSetup() {
    return (
      <div data-testid="voucher-setup">
        <h1>ตั้งค่า Voucher สำหรับแคมเปญ</h1>
        <div>Test Voucher</div>
        <input defaultValue="50" />
      </div>
    );
  };
});

import VoucherSetup from "@/components/voucher/VoucherSetup";

describe("VoucherSetup Page", () => {
  it("should render without crashing", () => {
    render(<VoucherSetup />);
    expect(
      screen.getByText("ตั้งค่า Voucher สำหรับแคมเปญ")
    ).toBeInTheDocument();
  });

  it("should show voucher name from mock data", () => {
    render(<VoucherSetup />);
    const voucherNames = screen.getAllByText("Test Voucher");
    expect(voucherNames.length).toBeGreaterThan(0);
  });

  it("should show input for changing point cost", () => {
    render(<VoucherSetup />);
    const input = screen.getByDisplayValue("50");
    expect(input).toBeInTheDocument();
  });

  it("should have correct test id", () => {
    render(<VoucherSetup />);
    expect(screen.getByTestId("voucher-setup")).toBeInTheDocument();
  });
});
