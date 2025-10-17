import { render, screen } from '@testing-library/react';

type CardProps = { title: string; content: string };

function Card({ title, content }: CardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{content}</p>
    </article>
  );
}

test('renders title and content', () => {
  render(<Card title="9PM Balm" content="Herbal pain relief" />);
  expect(screen.getByText('9PM Balm')).toBeInTheDocument();
  expect(screen.getByText('Herbal pain relief')).toBeInTheDocument();
});
