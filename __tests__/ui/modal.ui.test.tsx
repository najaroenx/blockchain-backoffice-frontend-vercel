import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';

function Modal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <div role="dialog">
          <p>Modal Content</p>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
}

test('toggles modal open and close', () => {
  render(<Modal />);
  fireEvent.click(screen.getByText('Open'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Close'));
  expect(screen.queryByRole('dialog')).toBeNull();
});
