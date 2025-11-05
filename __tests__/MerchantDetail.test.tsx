import { render, screen } from "@testing-library/react";
import MerchantDetail from "@/app/marketplace/[id]/page";
import "@testing-library/jest-dom";

// ✅ Mock next/image ไม่ให้ Error ใน Jest
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // ใช้ <img> ธรรมดาแทน
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || "image"} />;
  },
}));

describe("MerchantDetail Component", () => {
  it("ควร Render ได้โดยไม่ Error", () => {
    render(<MerchantDetail />);
    expect(screen.getByText("Product One")).toBeInTheDocument();
  });

  it("ควรแสดงสินค้าครบ 3 รายการ", () => {
    render(<MerchantDetail />);
    const productCards = screen.getAllByText(/Product/);
    expect(productCards.length).toBe(3);
  });

  it("ควรแสดงปุ่ม Buy for ... points ครบทุกอัน", () => {
    render(<MerchantDetail />);
    expect(
      screen.getByText(/buy for 100 points/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/buy for 200 points/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/buy for 300 points/i)
    ).toBeInTheDocument();
  });
});
