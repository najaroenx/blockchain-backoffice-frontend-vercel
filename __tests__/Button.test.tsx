import { render, screen } from '@testing-library/react';

function Button({ children }: { children: React.ReactNode }) {
  return <button aria-label="btn">{children}</button>;
}

test('renders button text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByRole('button', { name: 'btn' })).toHaveTextContent('Click Me');
});
