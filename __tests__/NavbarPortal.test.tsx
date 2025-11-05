import { render, screen } from "@testing-library/react";
import { NavbarPortal } from "@/components/layout/NavbarPortal";
import { useSession } from "next-auth/react";

// ✅ Mock useSession & signOut จาก next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe("NavbarPortal", () => {
  it("shows first letter of user email in avatar", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { email: "test@example.com" },
      },
      status: "authenticated",
    });

    render(<NavbarPortal />);

    // Avatar should show "T"
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});
