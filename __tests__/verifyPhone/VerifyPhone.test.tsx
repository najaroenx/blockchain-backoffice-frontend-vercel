import { render, screen, fireEvent, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import VerifyPhoneComponent, { VerifyPhoneStep } from "@/components/verifyPhone/VerifyPhone";
import { VerifyPhoneProvider, useVerifyPhone } from "@/contexts/VerifyPhoneContext";

// Mock the child components
jest.mock("@/components/verifyPhone/PinPhoneNumber", () => ({
  __esModule: true,
  default: ({ onChangeStep }: { onChangeStep: (step: VerifyPhoneStep) => void }) => (
    <div data-testid="pin-phone-number">
      <button onClick={() => onChangeStep(VerifyPhoneStep.PIN_OTP)}>
        Next to OTP
      </button>
    </div>
  ),
}));

jest.mock("@/components/verifyPhone/PinOTP", () => ({
  __esModule: true,
  default: ({ onChangeStep }: { onChangeStep: (step: VerifyPhoneStep) => void }) => (
    <div data-testid="pin-otp">
      <button onClick={() => onChangeStep(VerifyPhoneStep.SUCCESS)}>
        Next to Success
      </button>
    </div>
  ),
}));

jest.mock("@/components/verifyPhone/VerifyPhoneSuccess", () => ({
  __esModule: true,
  default: ({ onChangeStep }: { onChangeStep: (step: VerifyPhoneStep) => void }) => (
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

describe("VerifyPhoneComponent", () => {
  it("should render the component with initial step PIN_PHONE_NUMBER", () => {
    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
  });

  it("should navigate to PIN_OTP step", () => {
    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    const nextButton = screen.getByText("Next to OTP");
    fireEvent.click(nextButton);
    
    expect(screen.getByTestId("pin-otp")).toBeInTheDocument();
  });

  it("should navigate to SUCCESS step", () => {
    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    fireEvent.click(screen.getByText("Next to OTP"));
    
    const successButton = screen.getByText("Next to Success");
    fireEvent.click(successButton);
    
    expect(screen.getByTestId("verify-phone-success")).toBeInTheDocument();
  });

  it("should navigate back to PIN_PHONE_NUMBER from SUCCESS", () => {
    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    fireEvent.click(screen.getByText("Next to OTP"));
    fireEvent.click(screen.getByText("Next to Success"));
    
    const backButton = screen.getByText("Back to Phone Input");
    fireEvent.click(backButton);
    
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
  });

  it("should handle all three step transitions", () => {
    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Next to OTP"));
    expect(screen.getByTestId("pin-otp")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Next to Success"));
    expect(screen.getByTestId("verify-phone-success")).toBeInTheDocument();
  });

  it("should render with provider", () => {
    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
  });

  it("should render with sm:hidden class", () => {
    const { container } = render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    const hiddenDiv = container.querySelector(".sm\\:hidden");
    expect(hiddenDiv).toBeInTheDocument();
  });

  it("should maintain context values across steps", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider>{children}</VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });
    expect(result.current).toHaveProperty("phoneNumber");
    expect(result.current).toHaveProperty("token");
    expect(result.current).toHaveProperty("otpCode");
  });

  it("should properly switch between all step components", () => {
    render(
      <VerifyPhoneProvider>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
    expect(screen.queryByTestId("pin-otp")).not.toBeInTheDocument();
    expect(screen.queryByTestId("verify-phone-success")).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Next to OTP"));
    expect(screen.queryByTestId("pin-phone-number")).not.toBeInTheDocument();
    expect(screen.getByTestId("pin-otp")).toBeInTheDocument();
    expect(screen.queryByTestId("verify-phone-success")).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Next to Success"));
    expect(screen.queryByTestId("pin-phone-number")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pin-otp")).not.toBeInTheDocument();
    expect(screen.getByTestId("verify-phone-success")).toBeInTheDocument();
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
