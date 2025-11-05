import { render, screen } from "@testing-library/react";
import { VoucherSelectLayout } from "@/components/voucher/VoucherSelectLayout";
import { vouchers } from "@/data/vouchers";

// ✅ Mock next/navigation (เพราะใช้ useRouter)
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("VoucherSelectLayout", () => {
  test("renders without crashing", () => {
    render(<VoucherSelectLayout />);
    expect(
      screen.getByText("เตรียมเปิดใช้งาน Voucher")
    ).toBeInTheDocument();
  });

});
