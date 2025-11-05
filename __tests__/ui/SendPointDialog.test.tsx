import type { FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SendPointDialog } from '@/components/point/SendPointDialog';

describe('SendPointDialog', () => {
  const defaultProps = {
    open: true,
    loading: false,
    onCancel: jest.fn(),
    handleInputChange: jest.fn(),
    onConfirm: jest.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog with form fields and actions when open', () => {
    render(<SendPointDialog {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: /send point/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/to email/i)).toBeEnabled();
    expect(screen.getByLabelText(/amount/i)).toBeEnabled();
    expect(
      screen.getByRole('button', { name: /send transaction/i })
    ).toBeEnabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeEnabled();
  });

  it('triggers cancel and submit callbacks', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    render(
      <SendPointDialog
        {...defaultProps}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole('button', { name: /send transaction/i })
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables inputs and buttons while loading', () => {
    render(<SendPointDialog {...defaultProps} loading />);

    expect(screen.getByLabelText(/to email/i)).toBeDisabled();
    expect(screen.getByLabelText(/amount/i)).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /send transaction/i })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });
});
