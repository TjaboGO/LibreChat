/* eslint-disable i18next/no-literal-string */
import React from 'react';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import AccountSettings from '../AccountSettings';

const mockLogout = jest.fn();

jest.mock('~/hooks/AuthContext', () => ({
  useAuthContext: () => ({
    user: {
      name: 'Gabriel Odenhagen',
      email: 'gabriel@example.com',
    },
    isAuthenticated: true,
    logout: mockLogout,
  }),
}));

jest.mock('~/data-provider', () => ({
  useGetStartupConfig: () => ({
    data: {
      helpAndFaqURL: 'https://support.example.com',
      balance: { enabled: false },
      interface: {},
    },
  }),
  useGetUserBalance: () => ({
    data: null,
  }),
}));

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) => {
    const map: Record<string, string> = {
      com_nav_account_settings: 'Account settings',
      com_nav_user: 'User',
      com_nav_settings: 'Settings',
      com_nav_log_out: 'Log out',
      com_shortcut_keyboard_shortcuts: 'Keyboard shortcuts',
      com_nav_archived_chats: 'Archived chats',
    };
    return map[key] || key;
  },
}));

// Mock Settings dialog to avoid rendering the heavy dialog tree in this unit test
jest.mock(
  '../Settings',
  () => (props: { open: boolean }) =>
    props.open ? <div data-testid="settings-dialog">Settings Dialog Mock</div> : null,
);

describe('AccountSettings', () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  const renderComponent = () =>
    render(
      <RecoilRoot>
        <AccountSettings />
      </RecoilRoot>,
    );

  it('renders user name button and opens account menu on click', async () => {
    const user = userEvent.setup();
    renderComponent();

    const menuButton = screen.getByRole('button', { name: /Account settings/i });
    expect(menuButton).toBeInTheDocument();
    expect(screen.getByText('Gabriel Odenhagen')).toBeInTheDocument();

    await user.click(menuButton);

    // Header email
    expect(screen.getByText('gabriel@example.com')).toBeInTheDocument();

    // Section 1 items
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('⌘,')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Get help')).toBeInTheDocument();
    expect(screen.getByText('Give feedback')).toBeInTheDocument();

    // Section 2 items
    expect(screen.getByText('View all plans')).toBeInTheDocument();
    expect(screen.getByText('Get apps and extensions')).toBeInTheDocument();
    expect(screen.getByText('View changelog')).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();

    // Section 3
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('calls logout when clicking Log out', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: /Account settings/i }));
    const logoutItem = screen.getByText('Log out');
    await user.click(logoutItem);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('opens Settings dialog when clicking Settings', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: /Account settings/i }));
    const settingsItem = screen.getByTestId('nav-settings');
    await user.click(settingsItem);

    expect(screen.getByTestId('settings-dialog')).toBeInTheDocument();
  });
});
