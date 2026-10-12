import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import DesignSystemsTab from '../DesignSystemsTab';

describe('DesignSystemsTab', () => {
  it('renders header, description, and empty state', () => {
    render(<DesignSystemsTab />);

    expect(screen.getByText('Design systems')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Design systems give Claude your colors, type and components to use when making designs/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No design systems yet. Make one, or ask a teammate to share one with you/i),
    ).toBeInTheDocument();
  });

  it('allows typing into search field', async () => {
    const user = userEvent.setup();
    render(<DesignSystemsTab />);

    const searchInput = screen.getByPlaceholderText('Search by name');
    expect(searchInput).toHaveValue('');

    await user.type(searchInput, 'Brand tokens');
    expect(searchInput).toHaveValue('Brand tokens');
  });

  it('renders New design system dropdown trigger', () => {
    render(<DesignSystemsTab />);
    expect(screen.getByRole('button', { name: /New design system/i })).toBeInTheDocument();
  });
});
