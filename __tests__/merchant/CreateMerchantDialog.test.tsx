import type { FormEvent, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateMerchantDialog } from '@/components/merchant/CreateMerchantDialog';

jest.mock('@headlessui/react', () => ({
  Dialog: ({ children, open }: { children: ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogBackdrop: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-backdrop">{children}</div>
  ),
  DialogPanel: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-panel">{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

describe('CreateMerchantDialog', () => {
  const defaultProps = {
    open: true,
    loading: false,
    onCancel: jest.fn(),
    handleInputChange: jest.fn(),
    onConfirm: jest.fn((event: FormEvent<HTMLFormElement>) =>
      event.preventDefault()
    ),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields and actions when open', () => {
    render(<CreateMerchantDialog {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: /create new merchant/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeEnabled();
    expect(screen.getByLabelText(/website/i)).toBeEnabled();
    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeEnabled();
  });
 
  it('disables inputs and buttons while loading', () => {
    render(<CreateMerchantDialog {...defaultProps} loading />);

    expect(screen.getByLabelText(/name/i)).toBeDisabled();
    expect(screen.getByLabelText(/website/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });
});
