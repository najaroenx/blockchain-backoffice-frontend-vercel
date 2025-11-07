import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from '@/app/layout';

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mock-inter-font' }),
}));

jest.mock('@mui/material/styles', () => ({
  StyledEngineProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('@mui/material/CssBaseline', () => ({
  __esModule: true,
  default: () => <div data-testid="css-baseline" />,
}));

jest.mock('@/components/SessionWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="session-wrapper">{children}</div>
  ),
}));

jest.mock('@/app/provider', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="app-providers">{children}</div>
  ),
}));

describe('RootLayout metadata', () => {
  it('exposes marketplace title', () => {
    expect(metadata.title).toBe('AIS MARKETPLACE');
  });
});

describe('RootLayout', () => {
  it('renders children with providers', () => {
    render(
      <RootLayout>
        <span data-testid="layout-child">Hello</span>
      </RootLayout>
    );

    expect(screen.getByTestId('css-baseline')).toBeInTheDocument();
    expect(screen.getByTestId('session-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('app-providers')).toBeInTheDocument();
    expect(screen.getByTestId('layout-child')).toBeInTheDocument();
  });
});
