import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ConnectorHubModal from '../ConnectorHubModal';

describe('ConnectorHubModal', () => {
  it('renders modal dialog when open is true', () => {
    render(<ConnectorHubModal open={true} onOpenChange={jest.fn()} />);

    expect(screen.getByText('Perplexity Computer Connector Hub')).toBeInTheDocument();
    expect(screen.getByText(/on-demand mcp tools/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search connectors/i)).toBeInTheDocument();
  });

  it('renders popular connectors from registry', () => {
    render(<ConnectorHubModal open={true} onOpenChange={jest.fn()} />);

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.getByText('Notion')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL Database')).toBeInTheDocument();
  });

  it('filters connectors based on search query', async () => {
    render(<ConnectorHubModal open={true} onOpenChange={jest.fn()} />);

    const searchInput = screen.getByPlaceholderText(/search connectors/i);
    await userEvent.type(searchInput, 'stripe');

    expect(screen.getByText('Stripe')).toBeInTheDocument();
    expect(screen.queryByText('PostgreSQL Database')).not.toBeInTheDocument();
  });

  it('filters connectors by category selection', async () => {
    render(<ConnectorHubModal open={true} onOpenChange={jest.fn()} />);

    const financePill = screen.getByRole('button', { name: /^finance$/i });
    await userEvent.click(financePill);

    expect(screen.getByText('Stripe')).toBeInTheDocument();
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
  });
});
