import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';

function Tabs() {
  const [tab, setTab] = useState('Home');
  return (
    <>
      <button onClick={() => setTab('Home')}>Home</button>
      <button onClick={() => setTab('Profile')}>Profile</button>
      <div>{tab === 'Home' ? 'Welcome!' : 'User Info'}</div>
    </>
  );
}

test('switches between tabs', () => {
  render(<Tabs />);
  fireEvent.click(screen.getByText('Profile'));
  expect(screen.getByText('User Info')).toBeInTheDocument();
});
