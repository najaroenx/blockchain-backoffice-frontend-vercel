import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PinPhoneNumber from "@/components/verifyPhone/PinPhoneNumber";
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

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "requestid") return "test-request-id";
      if (key === "merchantid") return "test-merchant-id";
      return null;
    },
  }),
}));

// Mock Firebase
jest.mock("@/app/config/firebase", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  RecaptchaVerifier: jest.fn().mockImplementation(() => ({
    render: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn(),
  })),
  signInWithPhoneNumber: jest.fn(),
  ConfirmationResult: jest.fn(),
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

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <VerifyPhoneProvider>
        {component}
      </VerifyPhoneProvider>
    );
  };

  beforeEach(() => {
    mockOnChangeStep.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render the component", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText("ใส่หมายเลขโทรศัพท์ของคุณ")).toBeInTheDocument();
  });

  it("should render close button", () => {
    const { container } = renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const closeButton = container.querySelector("button");
    expect(closeButton).toBeInTheDocument();
  });

  it("should render phone image", () => {
    const { container } = renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const image = container.querySelector('img[alt="Example image"]');
    expect(image).toBeInTheDocument();
  });

  it("should render phone input with 10 digits", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
    
    // Should have 10 input fields for phone number
    for (let i = 0; i < 10; i++) {
      expect(screen.getByTestId(`phone-input-${i}`)).toBeInTheDocument();
    }
  });

  it("should render submit button with text 'รับรหัส OTP'", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    expect(screen.getByRole("button", { name: /รับรหัส OTP/i })).toBeInTheDocument();
  });

  it("should render submit button with arrow icon", () => {
    const { container } = renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const submitButton = screen.getByRole("button", { name: /รับรหัส OTP/i });
    const svg = submitButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have green or gray background button", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    // Initially disabled (gray), becomes green when phone is valid
    expect(button.className).toMatch(/bg-(gray-400|#16C23C)/);
  });

  it("should render image with correct src", () => {
    const { container } = renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const image = container.querySelector('img[alt="Example image"]');
    expect(image).toHaveAttribute("src", "/images/fill-phone-number.png");
  });

  it("should position submit button at bottom", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    const buttonContainer = button.parentElement;
    expect(buttonContainer?.className).toContain("fixed");
    expect(buttonContainer?.className).toContain("bottom-0");
  });

  it("should render with proper layout structure", () => {
    const { container } = renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("bg-white", "w-full", "h-screen");
  });

  it("should show error when phone doesn't start with 0", async () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    const phoneInput = screen.getByTestId("phone-input-0");
    fireEvent.change(phoneInput, { target: { value: "1" } });
    
    await waitFor(() => {
      expect(screen.getByText("เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0")).toBeInTheDocument();
    });
  });

  it("should have recaptcha container", () => {
    const { container } = renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    const recaptchaContainer = container.querySelector("#recaptcha-container");
    expect(recaptchaContainer).toBeInTheDocument();
  });

  it("should accept onChangeStep prop", () => {
    const customMock = jest.fn();
    renderWithProvider(<PinPhoneNumber onChangeStep={customMock} />);
    
    expect(screen.getByText("ใส่หมายเลขโทรศัพท์ของคุณ")).toBeInTheDocument();
  });
});
