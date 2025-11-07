import { render, screen } from '@testing-library/react';
import { MerchantCard } from '@/components/merchant/MerchantCard';
import { EditButton } from 'react-admin';

jest.mock('react-admin', () => ({
  EditButton: jest.fn(({ label, className }) => (
    <button type="button" data-testid="edit-button" className={className}>
      {label}
    </button>
  )),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe('MerchantCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders merchant details', () => {
    render(<MerchantCard name="Sample Shop" website="https://shop.example" />);

    expect(
      screen.getByRole('img', { name: 'card-image' })
    ).toBeInTheDocument();
    expect(screen.getByText('Sample Shop')).toBeInTheDocument();
    expect(screen.getByText('https://shop.example')).toBeInTheDocument();
  });

  it('renders edit button with label', () => {
    render(<MerchantCard name="Sample Shop" website="https://shop.example" />);

    expect(EditButton).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /edit merchant/i })).toBeInTheDocument();
  });
});
