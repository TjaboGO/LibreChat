import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ChromeTab from '../ChromeTab';

describe('ChromeTab', () => {
  it('renders extension connection status and settings rows', () => {
    render(<ChromeTab />);

    expect(screen.getByRole('heading', { level: 3, name: 'Claude in Chrome' })).toBeInTheDocument();
    expect(screen.getByText('Google Chrome Companion')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Browse with Claude')).toBeInTheDocument();
    expect(screen.getByText('Sync session context')).toBeInTheDocument();
    expect(screen.getByText('Web search augmentation')).toBeInTheDocument();
    expect(screen.getByText('Allowed companion origins')).toBeInTheDocument();
  });

  it('opens Allowed origins modal and adds a new origin', async () => {
    const user = userEvent.setup();
    render(<ChromeTab />);

    const manageBtn = screen.getByRole('button', { name: 'Manage' });
    await user.click(manageBtn);

    expect(screen.getByRole('heading', { level: 4, name: 'Allowed origins' })).toBeInTheDocument();

    const input = screen.getByPlaceholderText('e.g. https://docs.example.com');
    await user.type(input, 'https://my-app.internal{enter}');

    expect(screen.getByText('https://my-app.internal')).toBeInTheDocument();

    const doneBtn = screen.getByRole('button', { name: 'Done' });
    await user.click(doneBtn);

    expect(
      screen.queryByRole('heading', { level: 4, name: 'Allowed origins' }),
    ).not.toBeInTheDocument();
  });
});
