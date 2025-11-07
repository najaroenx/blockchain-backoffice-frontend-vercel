import { render, screen } from "@testing-library/react";
import SetupVouchersPage from "@/app/vouchers/setup/page";
import "@testing-library/jest-dom";

// ✅ Mock useSearchParams ให้ไม่มี query params
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("SetupVouchersPage", () => {
  it("should render voucher setup page content", async () => {
    render(<SetupVouchersPage />);

    // เช็คว่ามีหัวข้อหลัก
    expect(screen.getByText("ตั้งค่า Voucher สำหรับแคมเปญ")).toBeInTheDocument();
  });

  it("should render voucher selection dropdown", () => {
    render(<SetupVouchersPage />);

    // เช็คว่ามี dropdown เลือก voucher
    expect(screen.getByText("เลือก Voucher")).toBeInTheDocument();
  });

  it("should render back button", () => {
    render(<SetupVouchersPage />);

    // เช็คว่ามีปุ่มกลับ
    expect(screen.getByText("← กลับไปเลือก Voucher")).toBeInTheDocument();
  });
});
