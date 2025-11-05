// __tests__/VoucherSetup.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import VoucherSetup from "@/components/voucher/VoucherSetup"; // ⬅ ปรับ path ให้ตรงโปรเจกต์
import { vouchers } from "@/data/vouchers";

// ✅ Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useLocation: () => ({ search: "" }),
  useNavigate: () => jest.fn(),
  Link: ({ children }: any) => <a>{children}</a>,
  RouterLink: ({ children }: any) => <a>{children}</a>,
}));

// ✅ Mock data ถ้ายังไม่ได้เตรียม
jest.mock("@/data/vouchers", () => ({
  vouchers: [
    {
      id: "test-voucher",
      name: "Test Voucher",
      description: "Test Description",
      merchant: "Test Shop",
      status: "upcoming",
      totalIssued: 100,
      pointsCost: 50,
      endDate: new Date().toISOString(),
    },
  ],
}));

describe("VoucherSetup Page", () => {
  it("should render without crashing", () => {
    render(<VoucherSetup />);
    expect(
      screen.getByText("ตั้งค่า Voucher สำหรับแคมเปญ")
    ).toBeInTheDocument();
  });

  it("should show voucher name from mock data", () => {
    render(<VoucherSetup />);
    expect(screen.getByText("Test Voucher")).toBeInTheDocument();
  });

  it("should show input for changing point cost", () => {
    render(<VoucherSetup />);
    const input = screen.getByDisplayValue("50"); // ✅ จาก mock
    expect(input).toBeInTheDocument();
  });
});
