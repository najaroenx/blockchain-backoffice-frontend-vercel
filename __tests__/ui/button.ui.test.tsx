import { render, screen, fireEvent } from '@testing-library/react';

function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>;
}

test('renders button and triggers click', () => {
  const mockClick = jest.fn();
  render(<Button label="Click Me" onClick={mockClick} />);
  const btn = screen.getByRole('button', { name: /click me/i });
  fireEvent.click(btn);
  expect(mockClick).toHaveBeenCalledTimes(1);
});
