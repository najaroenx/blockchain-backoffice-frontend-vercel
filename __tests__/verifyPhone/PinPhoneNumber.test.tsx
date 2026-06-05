import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
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

// Mock InputOTP component
jest.mock("@/components/verifyPhone/InputOTP", () => ({
  __esModule: true,
  default: ({ value, onChange, length }: any) => (
    <div data-testid="phone-input">
      <input
        data-testid="phone-input-combined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={length}
      />
    </div>
  ),
}));

describe("PinPhoneNumber Component", () => {
  const mockOnChangeStep = jest.fn();

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<VerifyPhoneProvider>{component}</VerifyPhoneProvider>);
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
    const { container } = renderWithProvider(
      <PinPhoneNumber onChangeStep={mockOnChangeStep} />
    );
    const closeButton = container.querySelector("button");
    expect(closeButton).toBeInTheDocument();
  });

  it("should render phone image", () => {
    const { container } = renderWithProvider(
      <PinPhoneNumber onChangeStep={mockOnChangeStep} />
    );
    const image = container.querySelector('img[alt="Example image"]');
    expect(image).toBeInTheDocument();
  });

  it("should render phone input", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
  });

  it("should render submit button with text 'รับรหัส OTP'", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);
    expect(
      screen.getByRole("button", { name: /รับรหัส OTP/i })
    ).toBeInTheDocument();
  });

  it("should show error when phone doesn't start with 0", async () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);

    const phoneInput = screen.getByTestId("phone-input-combined");
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });

    await waitFor(() => {
      expect(
        screen.getByText("เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0")
      ).toBeInTheDocument();
    });
  });

  it("should disable button when phone number is not 10 digits", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);

    const phoneInput = screen.getByTestId("phone-input-combined");
    fireEvent.change(phoneInput, { target: { value: "012345678" } });

    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    expect(button).toBeDisabled();
  });

  it("should enable button when valid phone number is entered", () => {
    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);

    const phoneInput = screen.getByTestId("phone-input-combined");
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });

    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    expect(button).not.toBeDisabled();
  });

  it("should call API on submit with valid phone number", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "test-token" }),
    });
    global.fetch = mockFetch;

    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);

    const phoneInput = screen.getByTestId("phone-input-combined");
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });

    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/otp/request",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("0123456789"),
        })
      );
    });
  });

  it("should navigate to PIN_OTP step on successful API call", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "test-token" }),
    });
    global.fetch = mockFetch;

    renderWithProvider(<PinPhoneNumber onChangeStep={mockOnChangeStep} />);

    const phoneInput = screen.getByTestId("phone-input-combined");
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

    const phoneInput = screen.getByTestId("phone-input-combined");
    fireEvent.change(phoneInput, { target: { value: "0123456789" } });

    const button = screen.getByRole("button", { name: /รับรหัส OTP/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });
});
