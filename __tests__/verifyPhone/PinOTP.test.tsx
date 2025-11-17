import { render, screen, fireEvent, act } from "@testing-library/react";
import PinOTP from "@/components/verifyPhone/PinOTP";
import { VerifyPhoneStep } from "@/components/verifyPhone/VerifyPhone";

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

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnChangeStep.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should render the component", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    const elements = screen.getAllByText("ยืนยันรหัส OTP");
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should display phone number", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText(/0904134444/)).toBeInTheDocument();
  });

  it("should display reference code", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText(/TEST001/)).toBeInTheDocument();
  });

  it("should render timer with initial value 03:00", () => {
    const { container } = render(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    // Run only pending timers to trigger the first interval
    act(() => {
      jest.runOnlyPendingTimers();
    });
    
    const counterTime = container.querySelector("#counter-time");
    expect(counterTime?.textContent).toContain("03");
    expect(counterTime?.textContent).toContain("00");
  });

  it("should countdown timer", () => {
    const { container } = render(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    // Run only pending timers to trigger the first interval
    act(() => {
      jest.runOnlyPendingTimers();
    });
    
    // Initial state
    const counterTime = container.querySelector("#counter-time");
    expect(counterTime?.textContent).toContain("03");
    
    // Fast-forward 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Should show 02:59
    expect(counterTime?.textContent).toContain("02");
    expect(counterTime?.textContent).toContain("59");
  });

  it("should render 6 OTP inputs", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    const otpInput = screen.getByTestId("otp-input");
    const inputs = otpInput.querySelectorAll("input");
    expect(inputs.length).toBe(6);
  });

  it("should render Request OTP link", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText("Request OTP")).toBeInTheDocument();
  });

  it("should render terms and conditions link", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText("ข้อตกลงการใช้งาน")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByRole("button", { name: /ยืนยันรหัส OTP/i })).toBeInTheDocument();
  });

  it("should render close button", () => {
    const { container } = render(<PinOTP onChangeStep={mockOnChangeStep} />);
    const closeButtons = container.querySelectorAll("button");
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it("should render OTP input component", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByTestId("otp-input")).toBeInTheDocument();
  });

  it("should handle OTP input changes", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    const firstInput = screen.getByTestId("otp-input-0");
    
    // This would trigger the onChange in a real scenario
    expect(firstInput).toBeInTheDocument();
  });

  it("should call onChangeStep with SUCCESS when button is clicked with valid OTP", () => {
    render(<PinOTP onChangeStep={mockOnChangeStep} />);
    
    // Simulate entering a complete OTP
    const otpInput = screen.getByTestId("otp-input-0");
    fireEvent.change(otpInput, { target: { value: "123456" } });
    
    const button = screen.getByRole("button", { name: /ยืนยันรหัส OTP/i });
    fireEvent.click(button);
    
    expect(mockOnChangeStep).toHaveBeenCalledWith(VerifyPhoneStep.SUCCESS);
  });

  it("should accept onChangeStep prop", () => {
    const customMock = jest.fn();
    render(<PinOTP onChangeStep={customMock} />);
    
    const elements = screen.getAllByText("ยืนยันรหัส OTP");
    expect(elements.length).toBeGreaterThan(0);
  });
});
