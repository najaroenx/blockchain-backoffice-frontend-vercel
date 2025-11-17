import { render, screen, fireEvent } from "@testing-library/react";
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
      <VerifyPhoneProvider value="0812345678">
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
  });

  it("should navigate to PIN_OTP step", () => {
    render(
      <VerifyPhoneProvider value="0812345678">
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    const nextButton = screen.getByText("Next to OTP");
    fireEvent.click(nextButton);
    
    expect(screen.getByTestId("pin-otp")).toBeInTheDocument();
  });

  it("should navigate to SUCCESS step", () => {
    render(
      <VerifyPhoneProvider value="0812345678">
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    // Go to OTP step
    fireEvent.click(screen.getByText("Next to OTP"));
    
    // Go to Success step
    const successButton = screen.getByText("Next to Success");
    fireEvent.click(successButton);
    
    expect(screen.getByTestId("verify-phone-success")).toBeInTheDocument();
  });

  it("should navigate back to PIN_PHONE_NUMBER from SUCCESS", () => {
    render(
      <VerifyPhoneProvider value="0812345678">
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    // Navigate through all steps
    fireEvent.click(screen.getByText("Next to OTP"));
    fireEvent.click(screen.getByText("Next to Success"));
    
    // Navigate back
    const backButton = screen.getByText("Back to Phone Input");
    fireEvent.click(backButton);
    
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
  });

  it("should provide phone context to children", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider value="0812345678">{children}</VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });
    expect(result.current).toBe("0812345678");
  });

  it("should render with null phone value", () => {
    render(
      <VerifyPhoneProvider value={null}>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
  });

  it("should pass phone value through nested providers", () => {
    const testPhone = "0904134444";
    
    render(
      <VerifyPhoneProvider value={testPhone}>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
  });

  it("should handle all three step transitions", () => {
    render(
      <VerifyPhoneProvider value="0812345678">
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    );
    
    // Step 1: PIN_PHONE_NUMBER
    expect(screen.getByTestId("pin-phone-number")).toBeInTheDocument();
    
    // Step 2: PIN_OTP
    fireEvent.click(screen.getByText("Next to OTP"));
    expect(screen.getByTestId("pin-otp")).toBeInTheDocument();
    
    // Step 3: SUCCESS
    fireEvent.click(screen.getByText("Next to Success"));
    expect(screen.getByTestId("verify-phone-success")).toBeInTheDocument();
  });
});

describe("VerifyPhoneContext", () => {
  it("should provide phone number correctly to children", () => {
    const wrapper = ({ children }: any) => (
      <VerifyPhoneProvider value="0812345678">{children}</VerifyPhoneProvider>
    );

    const { result } = renderHook(() => useVerifyPhone(), { wrapper });
    expect(result.current).toBe("0812345678");
  });

  it("should return null when no provider is used", () => {
    const { result } = renderHook(() => useVerifyPhone());
    expect(result.current).toBeNull();
  });

  it("should handle phone number changes", () => {
    const { rerender } = render(
      <VerifyPhoneProvider value="0812345678">
        <div>Test</div>
      </VerifyPhoneProvider>
    );

    rerender(
      <VerifyPhoneProvider value="0904134444">
        <div>Test</div>
      </VerifyPhoneProvider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
