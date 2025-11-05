import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { VoucherSelectDialog } from '@/components/voucher/VoucherSelectDialog';

jest.mock('@headlessui/react', () => ({
  Dialog: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div data-testid="dialog-root">{children}</div> : null,
  DialogBackdrop: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-backdrop">{children}</div>
  ),
  DialogPanel: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-panel">{children}</div>
  ),
}));

jest.mock('@/components/voucher/VoucherSelectLayout', () => ({
  VoucherSelectLayout: ({
    onClose,
    onProceed,
    merchantId,
  }: {
    onClose: () => void;
    onProceed?: () => void;
    merchantId?: string;
  }) => (
    <div
      data-testid="voucher-select-layout"
      data-merchant-id={merchantId}
      onClick={() => {
        onClose();
        onProceed?.();
      }}
    />
  ),
}));

describe('VoucherSelectDialog', () => {
  it('renders dialog structure when open', () => {
    render(
      <VoucherSelectDialog open onClose={jest.fn()} merchantId="merchant-1" />
    );

    expect(screen.getByTestId('dialog-root')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-backdrop')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-panel')).toBeInTheDocument();

    const layout = screen.getByTestId('voucher-select-layout');
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute('data-merchant-id', 'merchant-1');
  });

  it('does not render dialog when closed', () => {
    render(<VoucherSelectDialog open={false} onClose={jest.fn()} />);
    expect(screen.queryByTestId('dialog-root')).not.toBeInTheDocument();
  });

  it('wires onClose and onProceed handlers', () => {
    const onClose = jest.fn();
    const onProceed = jest.fn();

    render(
      <VoucherSelectDialog
        open
        onClose={onClose}
        onProceed={onProceed}
        merchantId="merchant-2"
      />
    );

    screen.getByTestId('voucher-select-layout').click();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onProceed).toHaveBeenCalledTimes(1);
  });
});
