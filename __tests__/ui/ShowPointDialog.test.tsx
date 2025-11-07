import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShowPointDialog, type PointDetails } from '@/components/point/ShowPointDialog';

describe('ShowPointDialog', () => {
  const mockPoint: PointDetails = {
    id: 'point-1',
    name: 'Test Token',
    symbol: 'TST',
    contractAddress: '0x1234567890abcdef',
    initialSupply: 1000000,
    decimal: 18,
    frameSize: 4,
    slotSize: 100,
    merchantId: 'merchant-1',
    createdAt: new Date().toISOString(),
  };

  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    point: mockPoint,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog with point details when open', () => {
    render(<ShowPointDialog {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: /point details/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Test Token')).toBeInTheDocument();
    expect(screen.getByText('TST')).toBeInTheDocument();
  });

  it('triggers onClose callback when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<ShowPointDialog {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders null values gracefully', () => {
    const pointWithNulls: PointDetails = {
      id: 'point-2',
      name: 'Minimal Token',
      symbol: 'MIN',
      contractAddress: null,
      slotSize: null,
    };

    render(
      <ShowPointDialog {...defaultProps} point={pointWithNulls} />
    );

    expect(screen.getByText('Minimal Token')).toBeInTheDocument();
    expect(screen.getByText('MIN')).toBeInTheDocument();
  });
});
