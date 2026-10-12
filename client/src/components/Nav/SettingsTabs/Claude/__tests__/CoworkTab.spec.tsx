import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CoworkTab from '../CoworkTab';

describe('CoworkTab', () => {
  it('renders all Cowork settings rows', () => {
    render(<CoworkTab />);

    expect(screen.getByRole('heading', { level: 3, name: 'Cowork' })).toBeInTheDocument();
    expect(screen.getByText('Require trusted devices')).toBeInTheDocument();
    expect(screen.getByText('Cowork files')).toBeInTheDocument();
    expect(screen.getByText('Trusted Cowork folders')).toBeInTheDocument();
    expect(screen.getByText('Only on this computer')).toBeInTheDocument();
    expect(screen.getByText('Preferred browser')).toBeInTheDocument();
    expect(screen.getByText('Open links in built-in browser')).toBeInTheDocument();
    expect(screen.getByText('Allowed sites')).toBeInTheDocument();
  });

  it('allows changing preferred browser dropdown', async () => {
    const user = userEvent.setup();
    render(<CoworkTab />);

    const select = screen.getByLabelText('Preferred browser');
    expect(select).toHaveValue('Built-in browser');

    await user.selectOptions(select, 'Google Chrome');
    expect(select).toHaveValue('Google Chrome');
  });

  it('opens and closes Change cowork files modal', async () => {
    const user = userEvent.setup();
    render(<CoworkTab />);

    const changeBtn = screen.getByRole('button', { name: /Change/i });
    await user.click(changeBtn);

    expect(screen.getByText('Cowork files directory')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelBtn);

    expect(screen.queryByText('Cowork files directory')).not.toBeInTheDocument();
  });

  it('opens Trusted Cowork folders modal, adds a folder, and closes', async () => {
    const user = userEvent.setup();
    render(<CoworkTab />);

    const manageButtons = screen.getAllByRole('button', { name: 'Manage' });
    // First manage button is Trusted Cowork folders
    await user.click(manageButtons[0]);

    expect(
      screen.getByRole('heading', { level: 4, name: 'Trusted Cowork folders' }),
    ).toBeInTheDocument();

    const folderInput = screen.getByPlaceholderText('e.g. ~/Projects/my-app');
    await user.type(folderInput, '~/Projects/test-repo{enter}');

    expect(screen.getByText('~/Projects/test-repo')).toBeInTheDocument();

    const doneBtn = screen.getByRole('button', { name: 'Done' });
    await user.click(doneBtn);

    expect(
      screen.queryByRole('heading', { level: 4, name: 'Trusted Cowork folders' }),
    ).not.toBeInTheDocument();
  });

  it('opens Allowed sites modal and adds a site', async () => {
    const user = userEvent.setup();
    render(<CoworkTab />);

    const manageButtons = screen.getAllByRole('button', { name: 'Manage' });
    // Second manage button is Allowed sites
    await user.click(manageButtons[1]);

    expect(screen.getByRole('heading', { level: 4, name: 'Allowed sites' })).toBeInTheDocument();

    const siteInput = screen.getByPlaceholderText('e.g. localhost:8080 or example.com');
    await user.type(siteInput, 'app.example.com{enter}');

    expect(screen.getByText('app.example.com')).toBeInTheDocument();

    const doneBtn = screen.getByRole('button', { name: 'Done' });
    await user.click(doneBtn);

    expect(
      screen.queryByRole('heading', { level: 4, name: 'Allowed sites' }),
    ).not.toBeInTheDocument();
  });
});
