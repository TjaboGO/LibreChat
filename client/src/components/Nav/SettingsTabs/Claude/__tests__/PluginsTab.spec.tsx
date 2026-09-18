import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import PluginsTab from '../PluginsTab';

describe('PluginsTab', () => {
  it('renders header, search input, and default empty Your plugins tab', () => {
    render(<PluginsTab />);

    expect(screen.getByRole('heading', { level: 3, name: 'Plugins' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search plugins')).toBeInTheDocument();
    expect(screen.getByText(/No plugins installed yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore plugins/i })).toBeInTheDocument();
  });

  it('switches to Discover tab and displays plugin bundles', async () => {
    const user = userEvent.setup();
    render(<PluginsTab />);

    const discoverTabButton = screen.getByRole('button', { name: 'Discover' });
    await user.click(discoverTabButton);

    expect(screen.getByText('GitHub + PR Reviewer')).toBeInTheDocument();
    expect(screen.getByText('Figma + UI Generator')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL + Data Analyst')).toBeInTheDocument();
    expect(screen.getByText('Slack + Standup Assistant')).toBeInTheDocument();
  });

  it('allows installing a plugin from Discover tab and viewing it in Your plugins', async () => {
    const user = userEvent.setup();
    render(<PluginsTab />);

    // Click Explore plugins button to switch to Discover tab
    const exploreButton = screen.getByRole('button', { name: /Explore plugins/i });
    await user.click(exploreButton);

    // Install GitHub plugin
    const installGithub = screen.getByRole('button', { name: /Install GitHub \+ PR Reviewer/i });
    await user.click(installGithub);

    // Switch back to Your plugins
    const yourPluginsTab = screen.getByRole('button', { name: /Your plugins \(1\)/i });
    await user.click(yourPluginsTab);

    // Verify it is in Your plugins
    expect(screen.getByText('GitHub + PR Reviewer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Uninstall' })).toBeInTheDocument();
  });

  it('filters plugins by search query in Discover tab', async () => {
    const user = userEvent.setup();
    render(<PluginsTab />);

    const discoverTabButton = screen.getByRole('button', { name: 'Discover' });
    await user.click(discoverTabButton);

    const searchInput = screen.getByPlaceholderText('Search plugins');
    await user.type(searchInput, 'Figma');

    expect(screen.getByText('Figma + UI Generator')).toBeInTheDocument();
    expect(screen.queryByText('Slack + Standup Assistant')).not.toBeInTheDocument();
  });
});
