import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';

function Tooltip() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        Hover
      </button>
      {show && <div role="tooltip">Tooltip text</div>}
    </div>
  );
}

test('shows tooltip on hover', () => {
  render(<Tooltip />);
  const btn = screen.getByText('Hover');
  fireEvent.mouseEnter(btn);
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  fireEvent.mouseLeave(btn);
  expect(screen.queryByRole('tooltip')).toBeNull();
});
