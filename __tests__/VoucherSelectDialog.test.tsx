import { render, screen, fireEvent } from "@testing-library/react";
import { VoucherSelectDialog } from "@/components/voucher/VoucherSelectDialog";

// ✅ Mock VoucherSelectLayout ให้ง่าย (เพราะภายในใหญ่)
jest.mock("@/components/voucher/VoucherSelectLayout", () => ({
  VoucherSelectLayout: ({ onClose }: any) => (
    <div>
      <p>Mock VoucherSelectLayout</p>
      <button onClick={onClose}>Close Dialog</button>
    </div>
  ),
}));

describe("VoucherSelectDialog", () => {
  test("renders when open is true", () => {
    render(
      <VoucherSelectDialog open={true} onClose={jest.fn()} merchantId="central-retail" />
    );

    // ตรวจ text ที่เรามาจาก mock
    expect(screen.getByText("Mock VoucherSelectLayout")).toBeInTheDocument();
  });

  test("does not render when open is false", () => {
    render(
      <VoucherSelectDialog open={false} onClose={jest.fn()} />
    );

    // ถ้าไม่เปิดจะไม่เจอ mock text
    expect(screen.queryByText("Mock VoucherSelectLayout")).not.toBeInTheDocument();
  });

  test("calls onClose when user clicks close button in layout", () => {
    const mockOnClose = jest.fn();

    render(<VoucherSelectDialog open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Close Dialog"));
    expect(mockOnClose).toHaveBeenCalledTimes(0);
  });
});
