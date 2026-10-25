import React from 'react';
import { render, screen } from '@testing-library/react';
import CitationBadge from '../CitationBadge';

describe('CitationBadge', () => {
  it('renders numeric index label and clean link to source', () => {
    render(
      <CitationBadge
        index={1}
        url="https://arxiv.org/abs/2410.12345"
        title="Theoretical Foundations of AI Agents"
        snippet="Recursive reasoning reduces errors."
        reliability="academic"
      />,
    );

    const link = screen.getByRole('link', { name: '[1]' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://arxiv.org/abs/2410.12345');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('handles string index formatted as [2]', () => {
    render(
      <CitationBadge
        index="[2]"
        url="https://docs.anthropic.com/claude"
        title="Claude Documentation"
        reliability="primary"
      />,
    );

    const link = screen.getByRole('link', { name: '[2]' });
    expect(link).toBeInTheDocument();
  });
});
