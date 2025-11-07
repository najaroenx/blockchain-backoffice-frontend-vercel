/**
 * ✅ Basic Test for AdminApp
 * - แค่ทดสอบว่า Component Render ได้ โดยไม่ Error
 */

import React from "react";
import { render } from "@testing-library/react";
import AdminApp from "@/components/admin/AdminApp";

// Mock react-admin เพื่อไม่ให้มันเรียกของจริง (เช่น dataProvider)
jest.mock("react-admin", () => ({
  Admin: ({ children }: any) => <div>{children}</div>,
  Resource: () => <div>Resource</div>,
  CustomRoutes: ({ children }: any) => <div>{children}</div>,
}));

// Mock next/navigation เพื่อเลี่ยง useParams error
jest.mock("next/navigation", () => ({
  useParams: () => ({ merchantId: "mock-merchant" }),
}));

describe("AdminApp", () => {
  it("should render without crashing", () => {
    const { getByText } = render(<AdminApp />);
    // ✅ เพียงแค่เช็คว่ามีคำว่า Resource โผล่มา (จาก mock Resource)
    expect(getByText("Resource")).toBeInTheDocument();
  });
});
