import React from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Markdown from '../Markdown';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderMarkdown = (content: string) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RecoilRoot>
          <Markdown content={content} isLatestMessage={false} />
        </RecoilRoot>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('Markdown Citations', () => {
  it('renders standard markdown links normally', () => {
    renderMarkdown('Visit [React Official](https://react.dev) for details.');
    const link = screen.getByRole('link', { name: 'React Official' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://react.dev');
  });

  it('renders Perplexity-style citation badge when link text is numeric [1]', () => {
    renderMarkdown('Reactivity is optimized in React 19 [1](https://react.dev).');
    const badge = screen.getByRole('link', { name: '[1]' });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('href', 'https://react.dev');
  });

  it('renders multiple citation badges seamlessly', () => {
    renderMarkdown('First statement [1](https://react.dev) and second statement [2](https://github.com).');
    expect(screen.getByRole('link', { name: '[1]' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '[2]' })).toBeInTheDocument();
  });
});
