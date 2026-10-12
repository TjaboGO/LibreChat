import React from 'react';
import { render, screen } from '@testing-library/react';
import ExtensionsTab from '../ExtensionsTab';

describe('ExtensionsTab', () => {
  it('renders header, subtext, and empty state with Browse extensions button', () => {
    render(<ExtensionsTab />);

    expect(screen.getByRole('heading', { level: 3, name: 'Extensions' })).toBeInTheDocument();
    expect(
      screen.getByText(/Manage installed desktop extensions and environment add-ons/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 4, name: 'No extensions installed' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Extensions extend Claude with browser integrations, IDE bridges, and system utilities/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse extensions' })).toBeInTheDocument();
  });
});
