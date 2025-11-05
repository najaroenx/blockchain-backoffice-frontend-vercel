import type { ReactNode } from 'react';
import type { ShowProps } from 'react-admin';
import { render, screen } from '@testing-library/react';
import { CustomerShow } from '@/components/customer/CustomerShow';
import { Show } from 'react-admin';
import { ComponentCustomerWrapper } from '@/components/customs/ComponentCustomerWrapper';

jest.mock('react-admin', () => {
  const showMock = jest.fn(({ children }) => (
    <div data-testid="react-admin-show">{children}</div>
  ));

  return {
    __esModule: true,
    Show: showMock,
  };
});

jest.mock('@/components/customs/ComponentCustomerWrapper', () => ({
  ComponentCustomerWrapper: ({ children }: { children: ReactNode }) => (
    <div data-testid="component-customer-wrapper">{children}</div>
  ),
}));

jest.mock('@/components/customer/CustomerShowLayout', () => ({
  CustomerShowLayout: () => <div data-testid="customer-show-layout" />,
}));

describe('CustomerShow', () => {
  const renderComponent = (props?: Partial<ShowProps>) => {
    render(<CustomerShow {...((props ?? {}) as ShowProps)} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders layout with heading and show content', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: /customer detail/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('react-admin-show')).toBeInTheDocument();
    expect(
      screen.getByTestId('component-customer-wrapper')
    ).toBeInTheDocument();
    expect(screen.getByTestId('customer-show-layout')).toBeInTheDocument();
  });

  it('passes ComponentCustomerWrapper to Show component prop', () => {
    renderComponent();

    expect((Show as jest.Mock).mock.calls[0][0].component).toBe(
      ComponentCustomerWrapper
    );
  });

  it('sets title to false on Show', () => {
    renderComponent();
    expect((Show as jest.Mock).mock.calls[0][0].title).toBe(false);
  });
});
