import { render, screen, fireEvent } from '@testing-library/react';

function Select() {
  return (
    <select aria-label="color">
      <option>Red</option>
      <option>Green</option>
    </select>
  );
}

test('selects option', () => {
  render(<Select />);
  const select = screen.getByLabelText('color');
  fireEvent.change(select, { target: { value: 'Green' } });
  expect((select as HTMLSelectElement).value).toBe('Green');
});
