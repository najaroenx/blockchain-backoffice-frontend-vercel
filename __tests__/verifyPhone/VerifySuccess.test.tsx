import { render, screen, fireEvent } from "@testing-library/react";
import VerifyPhoneSuccess from "@/components/verifyPhone/VerifyPhoneSuccess";
import { VerifyPhoneStep } from "@/components/verifyPhone/VerifyPhone";
import { VerifyPhoneProvider } from "@/contexts/VerifyPhoneContext";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "callbackUri") return "http://test-callback.com";
      return null;
    },
  }),
}));

let consoleErrorSpy: jest.SpyInstance;
let consoleLogSpy: jest.SpyInstance;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
  consoleLogSpy.mockRestore();
});

describe("VerifyPhoneSuccess Component", () => {
  const mockOnChangeStep = jest.fn();

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <VerifyPhoneProvider phoneNumber="0812345678">
        {component}
      </VerifyPhoneProvider>
    );
  };

  beforeEach(() => {
    mockOnChangeStep.mockClear();
  });

  it("should render the component", () => {
    renderWithProvider(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText("ยืนยันตัวตน")).toBeInTheDocument();
    expect(screen.getByText("สำเร็จแล้ว")).toBeInTheDocument();
  });

  it("should render close button", () => {
    renderWithProvider(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  it("should render success icon", () => {
    const { container } = renderWithProvider(
      <VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />
    );
    const successIcon = container.querySelector('svg path[d="M5 13l4 4L19 7"]');
    expect(successIcon).toBeInTheDocument();
  });

  it("should render gradient background circle", () => {
    const { container } = renderWithProvider(
      <VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />
    );
    const gradientCircle = container.querySelector(".bg-gradient-to-br");
    expect(gradientCircle).toBeInTheDocument();
    expect(gradientCircle).toHaveClass(
      "from-green-400",
      "to-teal-500",
      "rounded-full"
    );
  });

  it("should render main button with text 'กลับไปหน้าหลัก'", () => {
    renderWithProvider(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    expect(button).toBeInTheDocument();
  });

  it("should redirect when main button is clicked", () => {
    renderWithProvider(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });

    // Test logic mainly relies on window.location assignment
    fireEvent.click(button);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Redirecting to callback URI:",
      "http://test-callback.com?phoneNumber=0812345678"
    );
  });

  it("should render close button icon", () => {
    const { container } = renderWithProvider(
      <VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />
    );
    const closeIcon = container.querySelector(
      'svg path[d="M6 18L18 6M6 6l12 12"]'
    );
    expect(closeIcon).toBeInTheDocument();
  });

  it("should have proper layout structure", () => {
    const { container } = renderWithProvider(
      <VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />
    );
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("bg-white", "w-full", "h-screen");
  });

  it("should center success message", () => {
    const { container } = renderWithProvider(
      <VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />
    );
    const successContainer = container.querySelector(".flex-1");
    expect(successContainer).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center"
    );
  });
});
