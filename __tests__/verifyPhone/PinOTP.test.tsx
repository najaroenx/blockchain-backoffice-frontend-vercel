import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
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
    <div data-testid="otp-input">
      <input
        data-testid="otp-input-combined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={length}
      />
    </div>
  ),
}));

// Mock headlessui
jest.mock("@headlessui/react", () => ({
  Dialog: ({ open, children }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogBackdrop: () => <div data-testid="dialog-backdrop" />,
  DialogPanel: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
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

  it("should render timer with initial value 02:00", () => {
    const { container } = renderWithProvider(
      <PinOTP onChangeStep={mockOnChangeStep} />
    );

    // Initial render might check for "02" "00"
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("00")).toBeInTheDocument();
  });

  it("should countdown timer", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // 01:58
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("58")).toBeInTheDocument();
  });

  it("should render OTP input", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(screen.getByTestId("otp-input")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    expect(
      screen.getByRole("button", { name: /ยืนยันรหัส OTP/i })
    ).toBeInTheDocument();
  });

  it("should handle OTP input changes", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);
    const input = screen.getByTestId("otp-input-combined");

    fireEvent.change(input, { target: { value: "123456" } });
    expect(input).toHaveValue("123456");
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

    const input = screen.getByTestId("otp-input-combined");
    fireEvent.change(input, { target: { value: "12345" } });

    const button = screen.getByRole("button", { name: /ยืนยันรหัส OTP/i });
    expect(button).toBeDisabled();
  });

  it("should render additional UI elements when expired", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);

    act(() => {
      jest.advanceTimersByTime(121000);
    });

    expect(screen.getByText("รหัส OTP หมดอายุ")).toBeInTheDocument();
    expect(screen.getByText("กรุณากดเพื่อขอรหัสใหม่")).toBeInTheDocument();
  });

  it("should have enabled button with valid 6-digit OTP and active timer", () => {
    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);

    const input = screen.getByTestId("otp-input-combined");
    fireEvent.change(input, { target: { value: "123456" } });

    const button = screen.getByRole("button", { name: /ยืนยันรหัส OTP/i });
    expect(button).not.toBeDisabled();
  });

  it("should call verification API on submit", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: "new-token" }),
    });

    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);

    const input = screen.getByTestId("otp-input-combined");
    fireEvent.change(input, { target: { value: "123456" } });

    const button = screen.getByRole("button", { name: /ยืนยันรหัส OTP/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/otp/verify",
      expect.any(Object)
    );
  });

  it("should handle resend OTP", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    renderWithProvider(<PinOTP onChangeStep={mockOnChangeStep} />);

    // Fast forward to expiry
    act(() => {
      jest.advanceTimersByTime(121000);
    });

    const resendButton = screen.getByText("ขอรหัส OTP ใหม่");

    await act(async () => {
      fireEvent.click(resendButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/otp/re-send-otp",
      expect.any(Object)
    );
    // Check if timer reset (should show 02:00)
    expect(screen.getByText("02")).toBeInTheDocument();
  });
});
