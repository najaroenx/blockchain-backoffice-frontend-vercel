// __tests__/dlt/pages/sign-up.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SellerSignUp from "@/app/dlt/sign-up/page";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock fetch
global.fetch = jest.fn();

describe("SellerSignUp Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: "success" }),
    });
  });

  it("should render sign-up form with title", () => {
    render(<SellerSignUp />);

    // Use getAllByText for multiple matches
    const signUpElements = screen.getAllByText("Sign Up");
    expect(signUpElements.length).toBeGreaterThan(0);
    expect(
      screen.getByText(/get started with your free trial/i)
    ).toBeInTheDocument();
  });

  it("should render email and password inputs", () => {
    render(<SellerSignUp />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("should render sign-up button", () => {
    render(<SellerSignUp />);

    const buttons = screen.getAllByRole("button");
    const signUpButton = buttons.find((btn) =>
      btn.textContent?.includes("Sign Up")
    );
    expect(signUpButton).toBeInTheDocument();
  });

  it("should render sign-in link", () => {
    render(<SellerSignUp />);

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  it("should render back to home link", () => {
    render(<SellerSignUp />);

    expect(screen.getByText("← Back to Home")).toBeInTheDocument();
  });

  it("should render DLTchain logo", () => {
    render(<SellerSignUp />);

    expect(screen.getByText("DLT")).toBeInTheDocument();
    expect(screen.getByText("chain")).toBeInTheDocument();
  });

  it("should update email input on change", () => {
    render(<SellerSignUp />);

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should update password input on change", () => {
    render(<SellerSignUp />);

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput).toHaveValue("password123");
  });

  it("should have required attribute on email input", () => {
    render(<SellerSignUp />);

    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeRequired();
  });

  it("should have required attribute on password input", () => {
    render(<SellerSignUp />);

    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toBeRequired();
  });

  it("should call fetch on form submit", async () => {
    render(<SellerSignUp />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Find the form using querySelector since it doesn't have role="form"
    const form = emailInput.closest("form");
    expect(form).toBeTruthy();

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it("should redirect to sign-in on successful registration", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: "success" }),
    });

    render(<SellerSignUp />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const form = emailInput.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dlt/sign-in");
    });
  });

  it("should show error message on failed registration", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Email already exists" }),
    });

    render(<SellerSignUp />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const form = emailInput.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });

  it("should have sign-in link to /dlt/sign-in", () => {
    render(<SellerSignUp />);

    const signInLink = screen.getByText("Sign in");
    expect(signInLink).toHaveAttribute("href", "/dlt/sign-in");
  });

  it("should have back to home link to /dlt", () => {
    render(<SellerSignUp />);

    const backLink = screen.getByText("← Back to Home");
    expect(backLink).toHaveAttribute("href", "/dlt");
  });
});
