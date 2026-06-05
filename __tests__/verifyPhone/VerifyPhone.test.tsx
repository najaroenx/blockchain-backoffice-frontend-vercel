import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import VerifyPhoneComponent, {
  VerifyPhoneStep,
} from "@/components/verifyPhone/VerifyPhone";
import {
  VerifyPhoneProvider,
  useVerifyPhone,
  Status,
} from "@/contexts/VerifyPhoneContext";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "requestid") return "test-request-id";
      if (key === "merchantId") return "merchant-123";
      if (key === "callbackUri") return "http://callback.url";
      return null;
    },
  }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock the child components
jest.mock("@/components/verifyPhone/PinPhoneNumber", () => ({
  __esModule: true,
  default: ({
    onChangeStep,
  }: {
    onChangeStep: (step: VerifyPhoneStep) => void;
  }) => (
    <div data-testid="pin-phone-number">
      <button onClick={() => onChangeStep(VerifyPhoneStep.PIN_OTP)}>
        Next to OTP
      </button>
    </div>
  ),
}));

jest.mock("@/components/verifyPhone/PinOTP", () => ({
  __esModule: true,
  default: ({
    onChangeStep,
  }: {
    onChangeStep: (step: VerifyPhoneStep) => void;
  }) => (
    <div data-testid="pin-otp">
      <button onClick={() => onChangeStep(VerifyPhoneStep.SUCCESS)}>
        Next to Success
      </button>
    </div>
  ),
}));

jest.mock("@/components/verifyPhone/VerifyPhoneSuccess", () => ({
  __esModule: true,
  default: ({
    onChangeStep,
  }: {
    onChangeStep: (step: VerifyPhoneStep) => void;
  }) => (
    <div data-testid="verify-phone-success">
      <button onClick={() => onChangeStep(VerifyPhoneStep.PIN_PHONE_NUMBER)}>
        Back to Phone Input
      </button>
    </div>
  ),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Noto_Sans_Thai: () => ({
    className: "noto-sans-thai-mock",
  }),
}));

describe("VerifyPhoneComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("should show loading state initially", () => {
    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );

    expect(screen.getByText("กำลังโหลด...")).toBeInTheDocument();
  });

  it("should show invalid state when request fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );

    await waitFor(
      () => {
        expect(
          screen.getByText("หน้านี้ยังไม่พร้อมใช้งาน หรือ ลิงก์หมดอายุ")
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("should call verify API on mount", async () => {
    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/otp/request")
      );
    });
  });
});

describe("VerifyPhoneContext", () => {
  it("should provide context values", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider>{children}</VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });
    expect(result.current).toHaveProperty("phoneNumber");
    expect(result.current).toHaveProperty("token");
    expect(result.current).toHaveProperty("otpCode");
    expect(result.current).toHaveProperty("merchantId");
    expect(result.current).toHaveProperty("setPhoneNumber");
    expect(result.current).toHaveProperty("setToken");
    expect(result.current).toHaveProperty("setOtpCode");
    expect(result.current).toHaveProperty("setMerchantId");
  });

  it("should initialize with null values", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider>{children}</VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });
    expect(result.current.phoneNumber).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.otpCode).toBeNull();
    expect(result.current.merchantId).toBeNull();
  });

  it("should initialize with provided values", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider
        phoneNumber="0123456789"
        token="test-token"
        otpCode="123456"
      >
        {children}
      </VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });
    expect(result.current.phoneNumber).toBe("0123456789");
    expect(result.current.token).toBe("test-token");
    expect(result.current.otpCode).toBe("123456");
  });

  it("should update phone number", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider>{children}</VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });

    expect(result.current.phoneNumber).toBeNull();

    act(() => {
      result.current.setPhoneNumber("0987654321");
    });

    expect(result.current.phoneNumber).toBe("0987654321");
  });

  it("should update token", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider>{children}</VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });

    expect(result.current.token).toBeNull();

    act(() => {
      result.current.setToken("new-token");
    });

    expect(result.current.token).toBe("new-token");
  });

  it("should update OTP code", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider>{children}</VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });

    expect(result.current.otpCode).toBeNull();

    act(() => {
      result.current.setOtpCode("654321");
    });

    expect(result.current.otpCode).toBe("654321");
  });

  it("should update merchant ID", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider>{children}</VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });

    expect(result.current.merchantId).toBeNull();

    act(() => {
      result.current.setMerchantId("merchant-123");
    });

    expect(result.current.merchantId).toBe("merchant-123");
  });

  it("should handle context re-renders", () => {
    const { rerender } = render(
      <VerifyPhoneProvider>
        <div>Test</div>
      </VerifyPhoneProvider>
    );

    rerender(
      <VerifyPhoneProvider>
        <div>Test</div>
      </VerifyPhoneProvider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
