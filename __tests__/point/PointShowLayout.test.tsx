// __tests__/point/PointShowLayout.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PointShowLayout } from "@/components/point/PointShowLayout";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock MUI icons
jest.mock("@mui/icons-material/EmailOutlined", () => ({
  __esModule: true,
  default: () => <span data-testid="email-icon">Email Icon</span>,
}));

jest.mock("@mui/icons-material/WalletOutlined", () => ({
  __esModule: true,
  default: () => <span data-testid="wallet-icon">Wallet Icon</span>,
}));

jest.mock("@mui/icons-material/ReceiptLongOutlined", () => ({
  __esModule: true,
  default: () => <span data-testid="receipt-icon">Receipt Icon</span>,
}));

jest.mock("@mui/icons-material/CalendarMonthOutlined", () => ({
  __esModule: true,
  default: () => <span data-testid="calendar-icon">Calendar Icon</span>,
}));

// Mock react-admin
jest.mock("react-admin", () => ({
  TextField: ({ source }: any) => <span data-testid={`text-field-${source}`}>{source}</span>,
  useShowContext: () => ({
    record: {
      id: "point-1",
      name: "Test Point",
      symbol: "TST",
      email: "test@example.com",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      transactions: [{ id: 1 }, { id: 2 }],
    },
    isPending: false,
  }),
}));

// Mock Loading component
jest.mock("@/components/layout/Loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

describe("PointShowLayout Component", () => {
  it("should render without crashing", () => {
    render(<PointShowLayout />);
    expect(screen.getByTestId("email-icon")).toBeInTheDocument();
  });

  it("should display email icon", () => {
    render(<PointShowLayout />);
    expect(screen.getByTestId("email-icon")).toBeInTheDocument();
  });

  it("should display wallet icon", () => {
    render(<PointShowLayout />);
    expect(screen.getByTestId("wallet-icon")).toBeInTheDocument();
  });

  it("should display receipt icon", () => {
    render(<PointShowLayout />);
    expect(screen.getByTestId("receipt-icon")).toBeInTheDocument();
  });

  it("should display calendar icons", () => {
    render(<PointShowLayout />);
    const calendarIcons = screen.getAllByTestId("calendar-icon");
    expect(calendarIcons.length).toBeGreaterThanOrEqual(1);
  });

  it("should display 'Total Transactions' label", () => {
    render(<PointShowLayout />);
    expect(screen.getByText(/Total Transactions/i)).toBeInTheDocument();
  });

  it("should display 'First Transaction' label", () => {
    render(<PointShowLayout />);
    expect(screen.getByText(/First Transaction/i)).toBeInTheDocument();
  });

  it("should display 'Last Transaction' label", () => {
    render(<PointShowLayout />);
    expect(screen.getByText(/Last Transaction/i)).toBeInTheDocument();
  });

  it("should have white background container", () => {
    const { container } = render(<PointShowLayout />);
    const whiteContainers = container.querySelectorAll(".bg-white");
    expect(whiteContainers.length).toBeGreaterThan(0);
  });
});

describe("PointShowLayout Component - Loading State", () => {
  it("should show loading component when isPending is true", () => {
    // Override the mock for this test
    jest.spyOn(require("react-admin"), "useShowContext").mockReturnValue({
      record: null,
      isPending: true,
    });

    render(<PointShowLayout />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });
});
