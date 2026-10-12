import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CodeDashboard from '../CodeDashboard';

jest.mock('~/hooks/AuthContext', () => ({
  useAuthContext: () => ({
    user: {
      name: 'Gabriel Odenhagen',
      email: 'gabriel@example.com',
    },
  }),
}));

describe('CodeDashboard', () => {
  const renderDashboard = () =>
    render(
      <MemoryRouter>
        <CodeDashboard />
      </MemoryRouter>,
    );

  it('renders greeting, analytics widget, heatmap, and environment chips', () => {
    renderDashboard();

    expect(
      screen.getByRole('heading', { level: 1, name: "What's up next, Gabriel?" }),
    ).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Total tokens')).toBeInTheDocument();
    expect(screen.getByText('Activity heatmap')).toBeInTheDocument();
    expect(screen.getByText('Local')).toBeInTheDocument();
    expect(screen.getByText('Claude-Copycat')).toBeInTheDocument();
    expect(screen.getByText('TjaboGO/Claude-Copycat')).toBeInTheDocument();
  });

  it('allows typing into command task textarea', async () => {
    const user = userEvent.setup();
    renderDashboard();

    const textarea = screen.getByPlaceholderText('Describe a task or ask a question');
    await user.type(textarea, 'Refactor API client to support SSE streaming');

    expect(textarea).toHaveValue('Refactor API client to support SSE streaming');
  });

  it('opens Folders modal when clicking folder chip', async () => {
    const user = userEvent.setup();
    renderDashboard();

    const folderChip = screen.getByRole('button', { name: /Claude-Copycat/i });
    await user.click(folderChip);

    expect(screen.getByRole('heading', { level: 2, name: 'Folders' })).toBeInTheDocument();
  });

  it('opens Prompts modal when clicking Prompts button', async () => {
    const user = userEvent.setup();
    renderDashboard();

    const promptsButton = screen.getByRole('button', { name: /Prompts/i });
    await user.click(promptsButton);

    expect(screen.getByPlaceholderText('Search prompts…')).toBeInTheDocument();
  });
});
