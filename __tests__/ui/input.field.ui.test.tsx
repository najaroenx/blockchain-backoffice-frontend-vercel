import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

function Input() {
  const [value, setValue] = useState('');
  return (
    <input
      aria-label="name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

test('updates input value', async () => {
  const user = userEvent.setup();
  render(<Input />);
  const input = screen.getByLabelText('name');
  await user.type(input, 'John');
  expect(input).toHaveValue('John');
});
