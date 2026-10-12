import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ConnectorsTab from '../ConnectorsTab';

describe('ConnectorsTab', () => {
  it('renders connected connectors list and Add custom connector button', () => {
    render(<ConnectorsTab />);

    expect(screen.getByText('Connectors')).toBeInTheDocument();
    expect(screen.getByText(/Your connectors/i)).toBeInTheDocument();
    expect(screen.getByText('Filesystem MCP')).toBeInTheDocument();
    expect(screen.getByText('Memory MCP')).toBeInTheDocument();
    expect(screen.getByText('Add custom connector')).toBeInTheDocument();
  });

  it('opens Add custom connector modal', async () => {
    const user = userEvent.setup();
    render(<ConnectorsTab />);

    const addBtn = screen.getByText('Add custom connector');
    await user.click(addBtn);

    expect(screen.getByText('Connector name')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('switches to Discover tab and lists MCP server connectors', async () => {
    const user = userEvent.setup();
    render(<ConnectorsTab />);

    const discoverTab = screen.getByText('Discover');
    await user.click(discoverTab);

    expect(screen.getByText('PostgreSQL Server')).toBeInTheDocument();
    expect(screen.getByText('Slack Connector')).toBeInTheDocument();
    expect(screen.getByText('Notion Workspace')).toBeInTheDocument();
  });
});
