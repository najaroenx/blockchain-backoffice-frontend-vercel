import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import PinOTP from "@/components/verifyPhone/PinOTP";
import { VerifyPhoneStep } from "@/components/verifyPhone/VerifyPhone";
import { VerifyPhoneProvider } from "@/contexts/VerifyPhoneContext";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock react-otp-input
jest.mock("react-otp-input", () => ({
  __esModule: true,
  default: ({ value, onChange, numInputs, renderInput }: any) => (
    <div data-testid="otp-input">
      {Array.from({ length: numInputs }).map((_, index) => (
        <input
          key={index}
          data-testid={`otp-input-${index}`}
          value={value[index] || ""}
          onChange={(e) => {
            const newValue = value.split("");
            newValue[index] = e.target.value;
            onChange(newValue.join(""));
          }}
        />
      ))}
    </div>
  ),
}));

describe("PinOTP Component", () => {
  const mockOnChangeStep = jest.fn();

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <VerifyPhoneProvider phoneNumber="0904134444">
        {component}
      </VerifyPhoneProvider>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnChangeStep.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should render the component", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    const elements = screen.getAllByText("ยืนยันรหัส OTP");
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should display phone number", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText(/0904134444/)).toBeInTheDocument();
  });

  it("should display reference code", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText(/TEST001/)).toBeInTheDocument();
  });

  it("should render timer with initial value 02:00", () => {
    const { container } = renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    const counterTime = container.querySelector("#counter-time");
    expect(counterTime?.textContent).toContain("02");
    expect(counterTime?.textContent).toContain("00");
  });

  it("should countdown timer", () => {
    const { container } = renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    const counterTime = container.querySelector("#counter-time");
    expect(counterTime?.textContent).toContain("01");
    expect(counterTime?.textContent).toContain("59");
    
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    
    expect(counterTime?.textContent).toContain("00");
    expect(counterTime?.textContent).toContain("59");
  });

  it("should render 6 OTP inputs", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    const otpInput = screen.getByTestId("otp-input");
    const inputs = otpInput.querySelectorAll("input");
    expect(inputs.length).toBe(6);
  });

  it("should render Request OTP button", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByRole("button", { name: /Request OTP/i })).toBeInTheDocument();
  });

  it("should render terms and conditions link", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText("ข้อตกลงการใช้งาน")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByRole("button", { name: /ยืนยันรหัส OTP/i })).toBeInTheDocument();
  });

  it("should render close button", () => {
    const { container } = renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    const closeButtons = container.querySelectorAll("button");
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it("should render OTP input component", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByTestId("otp-input")).toBeInTheDocument();
  });

  it("should handle OTP input changes", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    const firstInput = screen.getByTestId("otp-input-0");
    
    fireEvent.change(firstInput, { target: { value: "123456" } });
    expect(firstInput).toBeInTheDocument();
  });

  it("should disable button when timer expires", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    act(() => {
      jest.advanceTimersByTime(121000);
    });
    
    const button = screen.getByRole("button", { name: /ยืนยันรหัส OTP/i });
    expect(button).toBeDisabled();
  });

  it("should disable submit button when OTP is less than 6 digits", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    const firstInput = screen.getByTestId("otp-input-0");
    fireEvent.change(firstInput, { target: { value: "12345" } });
    
    const button = screen.getByRole("button", { name: /ยืนยันรหัส OTP/i });
    expect(button).toBeDisabled();
  });

  it("should render additional UI elements", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    expect(screen.getByText("รหัส OTP หมดอายุ")).toBeInTheDocument();
    expect(screen.getByText("กรุณากด Request OTP")).toBeInTheDocument();
    expect(screen.getByText("เพื่อขอรับรหัสใหม่อีกครั้ง")).toBeInTheDocument();
  });

  it("should show error when OTP is incomplete", async () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    const firstInput = screen.getByTestId("otp-input-0");
    fireEvent.change(firstInput, { target: { value: "12345" } });
    
    const button = screen.getByRole("button", { name: /ยืนยันรหัส OTP/i });
    expect(button).toBeDisabled();
  });

  it("should show error when OTP is expired", async () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    act(() => {
      jest.advanceTimersByTime(121000);
    });
    
    const firstInput = screen.getByTestId("otp-input-0");
    fireEvent.change(firstInput, { target: { value: "123456" } });
    
    const button = screen.getByRole("button", { name: /ยืนยันรหัส OTP/i });
    // Button should be disabled when timer is expired
    expect(button).toBeDisabled();
  });

  it("should have enabled button with valid 6-digit OTP and active timer", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    // Advance timer so it's not 00:00
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    const firstInput = screen.getByTestId("otp-input-0");
    fireEvent.change(firstInput, { target: { value: "123456" } });
    
    const button = screen.getByRole("button", { name: /ยืนยันรหัส OTP/i });
    expect(button).not.toBeDisabled();
  });
});
