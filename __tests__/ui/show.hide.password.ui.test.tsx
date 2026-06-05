import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

function PasswordInput() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <input
        type={show ? 'text' : 'password'}
        aria-label="password"
        defaultValue="secret"
      />
      <button onClick={() => setShow((s) => !s)}>Toggle</button>
    </div>
  );
}

test('changes input type', async () => {
  const user = userEvent.setup();
  render(<PasswordInput />);
  const input = screen.getByLabelText('password');
  expect(input).toHaveAttribute('type', 'password');
  await user.click(screen.getByText('Toggle'));
  expect(input).toHaveAttribute('type', 'text');
});
