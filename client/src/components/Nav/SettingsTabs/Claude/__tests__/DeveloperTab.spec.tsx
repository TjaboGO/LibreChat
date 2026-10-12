import React from 'react';
import { render, screen } from '@testing-library/react';
import DeveloperTab from '../DeveloperTab';

describe('DeveloperTab', () => {
  it('renders header, subtext, and empty state', () => {
    render(<DeveloperTab />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Local MCP servers' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Add and manage MCP servers that you're working on/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'No servers added' })).toBeInTheDocument();
    expect(
      screen.getByText(
        /Connect local MCP servers over stdio or SSE to test custom tools and resources/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders Edit config button and Developer docs link', () => {
    render(<DeveloperTab />);

    expect(screen.getByRole('button', { name: 'Edit config' })).toBeInTheDocument();
    const docsLink = screen.getByRole('link', { name: /Developer docs/i });
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute('href', 'https://modelcontextprotocol.io');
    expect(docsLink).toHaveAttribute('target', '_blank');
  });
});
