import { render, screen } from '@testing-library/react';
import MerchantDetail from '@/app/marketplace/[id]/page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('MerchantDetail', () => {
  it('renders all products with text and links', () => {
    render(<MerchantDetail />);

    const products = [
      {
        id: 1,
        name: 'Product One',
        description: 'This is product one',
        point: '100',
      },
      {
        id: 2,
        name: 'Product Two',
        description: 'This is product two',
        point: '200',
      },
      {
        id: 3,
        name: 'Product Three',
        description: 'This is product three',
        point: '300',
      },
    ];

    expect(screen.getAllByAltText('Merchant Logo')).toHaveLength(3);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(product.description)).toBeInTheDocument();

      const link = screen.getByRole('link', {
        name: `buy for ${product.point} points`,
      });

      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining(`/marketplace/id=${product.id}`)
      );
    });
  });
});
