import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import InteractiveConnectorCard from '../InteractiveConnectorCard';

describe('InteractiveConnectorCard', () => {
  it('renders connected tool card with title and tool badge', () => {
    render(
      <InteractiveConnectorCard
        sourceId="github"
        toolName="github_search_repos"
        status="CONNECTED"
        arguments={{ query: 'react' }}
      />,
    );

    expect(screen.getByTestId('interactive-connector-card')).toBeInTheDocument();
    expect(screen.getByText('Github')).toBeInTheDocument();
    expect(screen.getByText('github_search_repos')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('renders auth warning and connect button when needsAuth is true', () => {
    render(
      <InteractiveConnectorCard
        sourceId="jira"
        toolName="jira_search_issues"
        status="DISCONNECTED"
        needsAuth={true}
        error="Please authenticate Jira"
      />,
    );

    expect(screen.getByText('Auth Required')).toBeInTheDocument();
    expect(screen.getByText(/authentication required/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect jira/i })).toBeInTheDocument();
  });

  it('expands card to show arguments and output data on collapse toggle', async () => {
    render(
      <InteractiveConnectorCard
        sourceId="slack"
        toolName="slack_post_message"
        status="CONNECTED"
        arguments={{ channel: '#general', text: 'Hello team!' }}
        data={{ ok: true, ts: '123456.78' }}
        cliHint="slack-cli chat post --channel general"
      />,
    );

    const toggleBtn = screen.getByLabelText(/expand/i);
    await userEvent.click(toggleBtn);

    expect(screen.getByText('Input Arguments')).toBeInTheDocument();
    expect(screen.getByText('Output Data')).toBeInTheDocument();
    expect(screen.getByText(/#general/)).toBeInTheDocument();
    expect(screen.getByText('CLI Alternative')).toBeInTheDocument();
  });
});
