import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import DesignView from '../DesignView';

jest.mock('~/hooks/AuthContext', () => ({
  useAuthContext: () => ({
    user: { name: 'Gabriel Odenhagen', email: 'gabriel@example.com' },
  }),
}));

describe('DesignView', () => {
  it('renders landing page by default and transitions to canvas on project click', async () => {
    const user = userEvent.setup();
    render(<DesignView />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'What should we create?' }),
    ).toBeInTheDocument();

    const projectRow = screen.getByText('E-Commerce Checkout Flow');
    await user.click(projectRow);

    // Canvas view should now be displayed
    expect(screen.getByRole('button', { name: 'Back to projects' })).toBeInTheDocument();
    expect(screen.getByText('Hero Artboard')).toBeInTheDocument();

    // Click back button to return to landing page
    await user.click(screen.getByRole('button', { name: 'Back to projects' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'What should we create?' }),
    ).toBeInTheDocument();
  });
});
