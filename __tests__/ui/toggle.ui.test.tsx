import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(!on)}>
      {on ? 'ON' : 'OFF'}
    </button>
  );
}

test('toggles button label', async () => {
  const user = userEvent.setup();
  render(<Toggle />);
  const btn = screen.getByRole('button');
  expect(btn).toHaveTextContent('OFF');
  await user.click(btn);
  expect(btn).toHaveTextContent('ON');
});
