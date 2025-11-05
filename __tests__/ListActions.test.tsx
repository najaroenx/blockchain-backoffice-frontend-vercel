import { render, screen } from "@testing-library/react";
import { ListActions } from "@/components/customs/ListAction";

// ✅ Mock react-admin เพื่อไม่ให้เกิด error เวลา render
jest.mock("react-admin", () => ({
  TopToolbar: ({ children, ...props }: any) => (
    <div data-testid="top-toolbar" {...props}>
      {children}
    </div>
  ),
  CreateButton: (props: any) => (
    <button data-testid="create-button" {...props}>
      Create
    </button>
  ),
}));

describe("ListActions Component", () => {
  it("renders the title correctly", () => {
    render(<ListActions title="Voucher Management" />);

    expect(
      screen.getByText("Voucher Management")
    ).toBeInTheDocument();
  });

  it("renders Create button", () => {
    render(<ListActions title="Voucher Management" />);

    expect(screen.getByTestId("create-button")).toBeInTheDocument();
  });

  it("renders TopToolbar container", () => {
    render(<ListActions title="Voucher Management" />);

    expect(screen.getByTestId("top-toolbar")).toBeInTheDocument();
  });
});
