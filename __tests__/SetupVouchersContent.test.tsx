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
  it("should render loading fallback inside Suspense", async () => {
    render(<SetupVouchersPage />);

    // เช็คว่ามี fallback loading
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
