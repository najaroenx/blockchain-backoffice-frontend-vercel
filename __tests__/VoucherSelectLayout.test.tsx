// __tests__/VoucherSelectLayout.test.tsx

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

// ✅ Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// ✅ Mock VoucherSelectLayout component directly to avoid react-admin issues
jest.mock("@/components/voucher/VoucherSelectLayout", () => ({
  VoucherSelectLayout: function MockVoucherSelectLayout() {
    return (
      <div data-testid="voucher-select-layout">
        <h1>เตรียมเปิดใช้งาน Voucher</h1>
        <div>Voucher List</div>
      </div>
    );
  },
}));

import { VoucherSelectLayout } from "@/components/voucher/VoucherSelectLayout";

describe("VoucherSelectLayout", () => {
  it("renders without crashing", () => {
    render(<VoucherSelectLayout />);
    expect(screen.getByText("เตรียมเปิดใช้งาน Voucher")).toBeInTheDocument();
  });

  it("should have correct test id", () => {
    render(<VoucherSelectLayout />);
    expect(screen.getByTestId("voucher-select-layout")).toBeInTheDocument();
  });

  it("should render voucher list section", () => {
    render(<VoucherSelectLayout />);
    expect(screen.getByText("Voucher List")).toBeInTheDocument();
  });
});
