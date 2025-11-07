import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import "@testing-library/jest-dom";
import SetupVouchersContent from "@/app/vouchers/setup/page";

// Mock ของ next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("SetupVouchersContent", () => {
  it("should show heading correctly", () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SetupVouchersContent />
      </Suspense>
    );

    expect(screen.getByText("ตั้งค่า Voucher สำหรับแคมเปญ")).toBeInTheDocument();
  });
});
