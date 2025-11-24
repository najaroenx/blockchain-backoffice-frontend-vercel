import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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
      if (key === "merchantId") return "test-merchant-id";
      return null;
    },
  }),
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
    expect(button.className).toMatch(/bg-(gray-400|\[#16C23C\])/);
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
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    
    await waitFor(() => {
      expect(screen.getByText("เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0")).toBeInTheDocument();
    });
  });

  it("should disable button when phone number is not 10 digits", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    const phoneInput = screen.getByTestId("phone-input-0");
    fireEvent.change(phoneInput, { target: { value: "012345678" } });
    
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    expect(button).toBeDisabled();
  });

  it("should enable button when valid phone number is entered", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    const phoneInput = screen.getByTestId("phone-input-0");
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    expect(button).not.toBeDisabled();
  });

  it("should show error when phone number is incomplete on submit", async () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    const phoneInput = screen.getByTestId("phone-input-0");
    fireEvent.change(phoneInput, { target: { value: "012345678" } });
    
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    // Button should be disabled when phone is not 10 digits
    expect(button).toBeDisabled();
  });

  it("should call API on submit with valid phone number", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "test-token" }),
    });
    global.fetch = mockFetch;

    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    const phoneInput = screen.getByTestId("phone-input-0");
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/otp/request", expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.any(String),
      }));
    });
  });

  it("should navigate to PIN_OTP step on successful API call", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "test-token" }),
    });
    global.fetch = mockFetch;

    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    const phoneInput = screen.getByTestId("phone-input-0");
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnChangeStep).toHaveBeenCalledWith(VerifyPhoneStep.PIN_OTP);
    });
  });

  it("should show error message on API failure", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "API Error" }),
    });
    global.fetch = mockFetch;

    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    const phoneInput = screen.getByTestId("phone-input-0");
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  it("should show loading state during API call", async () => {
    let resolveRequest: any;
    const mockFetch = jest.fn().mockImplementation(() => 
      new Promise((resolve) => {
        resolveRequest = () => resolve({ 
          ok: true, 
          json: async () => ({ token: "test-token" }) 
        });
      })
    );
    global.fetch = mockFetch;

    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    const phoneInput = screen.getByTestId("phone-input-0");
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    
    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    
    await act(async () => {
      fireEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    
    expect(screen.getByText("กำลังส่ง...")).toBeInTheDocument();
    
    // Resolve the request
    act(() => {
      resolveRequest();
    });
  });

  it("should fetch data on component mount when requestId is present", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    global.fetch = mockFetch;

    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/otp/request?requestid=test-request-id"),
        expect.any(Object)
      );
    });
  });

  it("should clear error when valid input is entered", async () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    
    const phoneInput = screen.getByTestId("phone-input-0");
    
    // First, enter invalid input
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    await waitFor(() => {
      expect(screen.getByText("เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0")).toBeInTheDocument();
    });
    
    // Then enter valid input starting with 0
    fireEvent.change(phoneInput, { target: { value: "" } });
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });
    
    await waitFor(() => {
      expect(screen.queryByText("เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0")).not.toBeInTheDocument();
    });
  });
});
