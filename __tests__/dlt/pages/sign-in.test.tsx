// __tests__/dlt/pages/sign-in.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SellerSignIn from "@/app/dlt/sign-in/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock useDLTAuth
const mockLogin = jest.fn();
jest.mock("@/app/dlt/hooks/useDLTAuth", () => ({
  useDLTAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}));

describe("SellerSignIn Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render sign-in form with title", () => {
    render(<SellerSignIn />);

    // Use getAllByText for multiple matches
    const signInElements = screen.getAllByText("Sign In");
    expect(signInElements.length).toBeGreaterThan(0);
    expect(screen.getByText("เข้าสู่ระบบผู้ขาย")).toBeInTheDocument();
  });

  it("should render email and password inputs", () => {
    render(<SellerSignIn />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("should render sign-in button", () => {
    render(<SellerSignIn />);

    const button = screen.getByRole("button", { name: /sign in/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("should render sign-up link", () => {
    render(<SellerSignIn />);

    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  it("should render back to home link", () => {
    render(<SellerSignIn />);

    expect(screen.getByText("← Back to Home")).toBeInTheDocument();
  });

  it("should render DLTchain logo", () => {
    render(<SellerSignIn />);

    expect(screen.getByText("DLT")).toBeInTheDocument();
    expect(screen.getByText("chain")).toBeInTheDocument();
  });

  it("should update email input on change", () => {
    render(<SellerSignIn />);

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should update password input on change", () => {
    render(<SellerSignIn />);

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput).toHaveValue("password123");
  });

  it("should have required attribute on email input", () => {
    render(<SellerSignIn />);

    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeRequired();
  });

  it("should have required attribute on password input", () => {
    render(<SellerSignIn />);

    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toBeRequired();
  });

  it("should have correct email input type", () => {
    render(<SellerSignIn />);

    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("should have correct password input type", () => {
    render(<SellerSignIn />);

    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should have sign-in link to /dlt/sign-up", () => {
    render(<SellerSignIn />);

    const signUpLink = screen.getByText("Sign up");
    expect(signUpLink).toHaveAttribute("href", "/dlt/sign-up");
  });

  it("should have back to home link to /dlt", () => {
    render(<SellerSignIn />);

    const backLink = screen.getByText("← Back to Home");
    expect(backLink).toHaveAttribute("href", "/dlt");
  });
});
