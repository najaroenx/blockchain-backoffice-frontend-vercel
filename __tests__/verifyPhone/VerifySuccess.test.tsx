import { render, screen, fireEvent } from "@testing-library/react";
import VerifyPhoneSuccess from "@/components/verifyPhone/VerifyPhoneSuccess";
import { VerifyPhoneStep } from "@/components/verifyPhone/VerifyPhone";

describe("VerifyPhoneSuccess Component", () => {
  const mockOnChangeStep = jest.fn();

  beforeEach(() => {
    mockOnChangeStep.mockClear();
  });

  it("should render the component", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    expect(screen.getByText("ยืนยันตัวตน")).toBeInTheDocument();
    expect(screen.getByText("สำเร็จแล้ว")).toBeInTheDocument();
  });

  it("should render close button", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  it("should render success icon", () => {
    const { container } = render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const successIcon = container.querySelector('svg path[d="M5 13l4 4L19 7"]');
    expect(successIcon).toBeInTheDocument();
  });

  it("should render gradient background circle", () => {
    const { container } = render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const gradientCircle = container.querySelector(".bg-gradient-to-br");
    expect(gradientCircle).toBeInTheDocument();
    expect(gradientCircle).toHaveClass("from-green-400", "to-teal-500", "rounded-full");
  });

  it("should render main button with text 'กลับไปหน้าหลัก'", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    expect(button).toBeInTheDocument();
  });

  it("should render main button with arrow icon", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have green background button", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    expect(button.className).toContain("bg-[#16C23C]");
  });

  it("should position main button at bottom", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    const buttonContainer = button.parentElement;
    expect(buttonContainer?.className).toContain("fixed");
    expect(buttonContainer?.className).toContain("bottom-0");
  });

  it("should render close button icon", () => {
    const { container } = render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const closeIcon = container.querySelector('svg path[d="M6 18L18 6M6 6l12 12"]');
    expect(closeIcon).toBeInTheDocument();
  });

  it("should have proper layout structure", () => {
    const { container } = render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("bg-white", "w-full", "h-screen");
  });

  it("should center success message", () => {
    const { container } = render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const successContainer = container.querySelector(".flex-1");
    expect(successContainer).toHaveClass("flex", "flex-col", "items-center", "justify-center");
  });

  it("should render both heading texts with correct styling", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const heading1 = screen.getByText("ยืนยันตัวตน");
    const heading2 = screen.getByText("สำเร็จแล้ว");
    
    expect(heading1.className).toContain("text-2xl");
    expect(heading1.className).toContain("font-semibold");
    expect(heading2.className).toContain("text-2xl");
    expect(heading2.className).toContain("font-semibold");
  });

  it("should have correct icon size", () => {
    const { container } = render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const iconContainer = container.querySelector(".w-32.h-32");
    expect(iconContainer).toBeInTheDocument();
  });

  it("should render with proper spacing", () => {
    const { container } = render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const iconContainer = container.querySelector(".w-32.h-32");
    expect(iconContainer?.className).toContain("mb-8");
  });

  it("should call onChangeStep with PIN_PHONE_NUMBER when button is clicked", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    
    fireEvent.click(button);
    
    expect(mockOnChangeStep).toHaveBeenCalledTimes(1);
    expect(mockOnChangeStep).toHaveBeenCalledWith(VerifyPhoneStep.PIN_PHONE_NUMBER);
  });

  it("should accept onChangeStep prop", () => {
    const customMock = jest.fn();
    render(<VerifyPhoneSuccess onChangeStep={customMock} />);
    
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    fireEvent.click(button);
    
    expect(customMock).toHaveBeenCalled();
  });

  it("should display success icon with proper styling", () => {
    const { container } = render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const icon = container.querySelector('svg.w-16.h-16.text-white');
    expect(icon).toBeInTheDocument();
  });

  it("should render fixed button container with proper padding", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    const buttonContainer = button.parentElement;
    
    expect(buttonContainer?.className).toContain("left-0");
    expect(buttonContainer?.className).toContain("right-0");
    expect(buttonContainer?.className).toContain("mb-6");
  });

  it("should render button with max width constraint", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    expect(button.className).toContain("max-w-[327px]");
  });

  it("should render button with correct height", () => {
    render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    expect(button.className).toContain("h-[56px]");
  });

  it("should render arrow icon with correct styling", () => {
    const { container } = render(<VerifyPhoneSuccess onChangeStep={mockOnChangeStep} />);
    const button = screen.getByRole("button", { name: /กลับไปหน้าหลัก/i });
    const arrowIcon = button.querySelector('svg.w-5.h-5');
    expect(arrowIcon).toBeInTheDocument();
  });
});
