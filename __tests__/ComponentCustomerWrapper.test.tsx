import { render, screen } from "@testing-library/react";
import { ComponentCustomerWrapper } from "@/components/customs/ComponentCustomerWrapper"; // แก้ path ให้ตรงโปรเจค
import "@testing-library/jest-dom";

describe("ComponentCustomerWrapper", () => {
  it("ควร render children ได้", () => {
    render(
      <ComponentCustomerWrapper>
        <p>Test Content</p>
      </ComponentCustomerWrapper>
    );

    // ตรวจว่าข้อความถูกแสดง
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("ควรมี className ที่ถูกต้อง", () => {
    const { container } = render(
      <ComponentCustomerWrapper>
        <p>Child</p>
      </ComponentCustomerWrapper>
    );

    // ตรวจว่า div มี class ตามที่ตั้งไว้
    expect(container.firstChild).toHaveClass("container mx-auto bg-slate-100");
  });
});
