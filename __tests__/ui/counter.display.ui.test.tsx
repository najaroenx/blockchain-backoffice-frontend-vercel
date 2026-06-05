import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  );
}

test('increments count display', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  await user.click(screen.getByText('+'));
  expect(screen.getByTestId('count')).toHaveTextContent('1');
});
