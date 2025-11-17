import { render, screen, fireEvent } from "@testing-library/react";
import PinPhoneNumber from "@/components/verifyPhone/PinPhoneNumber";
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
    <div data-testid="phone-input">
      {Array.from({ length: numInputs }).map((_, index) => (
        <input
          key={index}
          data-testid={`phone-input-${index}`}
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

describe("PinPhoneNumber Component", () => {
  const mockOnChangeStep = jest.fn();

  beforeEach(() => {
    mockOnChangeStep.mockClear();
  });

  it("should render the component", () => {
    render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText("ใส่หมายเลขโทรศัพท์ของคุณ")).toBeInTheDocument();
  });

  it("should render close button", () => {
    const { container } = render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const closeButton = container.querySelector("button");
    expect(closeButton).toBeInTheDocument();
  });

  it("should render phone image", () => {
    const { container } = render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const image = container.querySelector('img[alt="Example image"]');
    expect(image).toBeInTheDocument();
  });

  it("should render phone input with 10 digits", () => {
    render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
    
    // Should have 10 input fields for phone number
    for (let i = 0; i < 10; i++) {
      expect(screen.getByTestId(`phone-input-${i}`)).toBeInTheDocument();
    }
  });

  it("should render submit button with text 'รับรหัส OTP'", () => {
    render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    expect(screen.getByRole("button", { name: /รับรหัส OTP/i })).toBeInTheDocument();
  });

  it("should render submit button with arrow icon", () => {
    const { container } = render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const submitButton = screen.getByRole("button", { name: /รับรหัส OTP/i });
    const svg = submitButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have green background button", () => {
    render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    expect(button.className).toContain("bg-[#16C23C]");
  });

  it("should render image with correct src", () => {
    const { container } = render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const image = container.querySelector('img[alt="Example image"]');
    expect(image).toHaveAttribute("src", "/images/fill-phone-number.png");
  });

  it("should position submit button at bottom", () => {
    render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    const buttonContainer = button.parentElement;
    expect(buttonContainer?.className).toContain("fixed");
    expect(buttonContainer?.className).toContain("bottom-0");
  });

  it("should render with proper layout structure", () => {
    const { container } = render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("bg-white", "w-full", "h-screen");
  });

  it("should call onChangeStep with PIN_OTP when button is clicked with valid phone", () => {
    render(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    // Simulate entering a valid phone number (10 digits starting with 0)
    const phoneInput = screen.getByTestId("phone-input-0");
    fireEvent.change(phoneInput, { target: { value: "0812345678" } });
    
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    fireEvent.click(button);
    
    expect(mockOnChangeStep).toHaveBeenCalledWith(VerifyPhoneStep.PIN_OTP);
  });

  it("should accept onChangeStep prop", () => {
    const customMock = jest.fn();
    render(<PinPhoneNumber onChangeStep={customMock} />);
    
    expect(screen.getByText("ใส่หมายเลขโทรศัพท์ของคุณ")).toBeInTheDocument();
  });
});
