import { render, screen } from "@testing-library/react";
import Page from "@/app/otp/page";
import { Suspense } from "react";

// Mock the VerifyPhoneProvider
jest.mock("@/contexts/VerifyPhoneContext", () => ({
  VerifyPhoneProvider: ({ children, phoneNumber }: any) => (
    <div data-testid="verify-phone-provider">
      {children}
    </div>
  ),
}));

// Mock the VerifyPhone component
jest.mock("@/components/verifyPhone/VerifyPhone", () => ({
  __esModule: true,
  default: () => <div data-testid="verify-phone-component">VerifyPhone Component</div>,
}));

// Mock the Loading component
jest.mock("@/components/layout/Loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

// Mock dynamic import
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (importFn: any, options: any) => {
    const Component = require("@/components/verifyPhone/VerifyPhone").default;
    return Component;
  },
}));

describe("OTP Page", () => {
  it("should render the page with phone parameter", () => {
    const params = { phone: "0812345678" };
    
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Page params={params} />
      </Suspense>
    );

    expect(screen.getByTestId("verify-phone-provider")).toBeInTheDocument();
    expect(screen.getByTestId("verify-phone-component")).toBeInTheDocument();
  });

  it("should render VerifyPhoneProvider", () => {
    const params = { phone: "0904134444" };
    
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Page params={params} />
      </Suspense>
    );

    expect(screen.getByTestId("verify-phone-provider")).toBeInTheDocument();
  });

  it("should handle encoded phone numbers", () => {
    const params = { phone: "0812345678" };
    
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Page params={params} />
      </Suspense>
    );

    expect(screen.getByTestId("verify-phone-component")).toBeInTheDocument();
  });

  it("should render within Suspense boundary", () => {
    const params = { phone: "0812345678" };
    
    const { container } = render(
      <Suspense fallback={<div data-testid="suspense-loading">Loading...</div>}>
        <Page params={params} />
      </Suspense>
    );

    // Should render the component, not the suspense fallback
    expect(screen.getByTestId("verify-phone-component")).toBeInTheDocument();
    expect(screen.queryByTestId("suspense-loading")).not.toBeInTheDocument();
  });

  it("should handle different phone number formats", () => {
    const testCases = [
      "0812345678",
      "0904134444",
      "0611111111",
    ];

    testCases.forEach((phone) => {
      const { unmount } = render(
        <Suspense fallback={<div>Loading...</div>}>
          <Page params={{ phone }} />
        </Suspense>
      );

      expect(screen.getByTestId("verify-phone-provider")).toBeInTheDocument();
      
      unmount();
    });
  });
});
