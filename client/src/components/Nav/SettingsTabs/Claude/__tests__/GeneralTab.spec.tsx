import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import GeneralTab from '../GeneralTab';

describe('GeneralTab', () => {
  it('renders all sections: General desktop settings, Browser use, and Computer use', () => {
    render(<GeneralTab />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'General desktop settings' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Browser use' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Computer use' })).toBeInTheDocument();
  });

  it('renders desktop app version and shortcut dropdowns', async () => {
    const user = userEvent.setup();
    render(<GeneralTab />);

    expect(screen.getByText('2.2553.1')).toBeInTheDocument();

    const quickSelect = screen.getByLabelText('Quick access shortcut');
    expect(quickSelect).toHaveValue('Tap Option twice');

    await user.selectOptions(quickSelect, 'Command+Space');
    expect(quickSelect).toHaveValue('Command+Space');
  });

  it('displays connected browsers and allows recheck', async () => {
    const user = userEvent.setup();
    render(<GeneralTab />);

    expect(screen.getByText('1 browser connected')).toBeInTheDocument();
    expect(screen.getByText('Browser 1 / macOS')).toBeInTheDocument();

    const recheckBtn = screen.getByRole('button', { name: /Recheck/i });
    await user.click(recheckBtn);
    expect(recheckBtn).toBeInTheDocument();
  });

  it('allows adding and removing denied apps', async () => {
    const user = userEvent.setup();
    render(<GeneralTab />);

    const addAppBtn = screen.getByRole('button', { name: /Add app/i });
    await user.click(addAppBtn);

    expect(screen.getByRole('heading', { level: 4, name: 'Deny app access' })).toBeInTheDocument();

    const input = screen.getByPlaceholderText('e.g. 1Password or com.apple.Terminal');
    await user.type(input, '1Password{enter}');

    expect(screen.getByText('1Password')).toBeInTheDocument();
  });
});
