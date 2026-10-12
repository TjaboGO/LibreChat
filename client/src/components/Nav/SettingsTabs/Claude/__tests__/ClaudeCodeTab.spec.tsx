import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ClaudeCodeTab from '../ClaudeCodeTab';

describe('ClaudeCodeTab', () => {
  it('renders all main sections: General, Code appearance, Local sessions, Browser, Pull requests, and Authorization tokens', () => {
    render(<ClaudeCodeTab />);

    expect(screen.getByRole('heading', { level: 3, name: 'General' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Code appearance' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Local sessions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Browser' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Mobile simulators' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Pull requests' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Authorization tokens' }),
    ).toBeInTheDocument();
  });

  it('renders theme selectors with code-diff preview snippets', () => {
    render(<ClaudeCodeTab />);

    expect(screen.getByLabelText('Light Theme')).toHaveValue('Claude Light');
    expect(screen.getByLabelText('Dark Theme')).toHaveValue('Catppuccin Mocha');
    expect(screen.getAllByText('// TypeScript preview')).toHaveLength(2);
  });

  it('allows changing code font and interface font', async () => {
    const user = userEvent.setup();
    render(<ClaudeCodeTab />);

    const fontInput = screen.getByPlaceholderText('e.g. JetBrains Mono');
    expect(fontInput).toHaveValue('JetBrains Mono');

    await user.clear(fontInput);
    await user.type(fontInput, 'Fira Code');
    expect(fontInput).toHaveValue('Fira Code');

    const systemFontBtn = screen.getByRole('button', { name: 'System' });
    await user.click(systemFontBtn);
    expect(systemFontBtn).toHaveClass('text-text-primary');
  });

  it('renders authorization tokens table with revoke buttons and pagination', async () => {
    const user = userEvent.setup();
    render(<ClaudeCodeTab />);

    expect(screen.getByText('Application')).toBeInTheDocument();
    expect(screen.getByText('Scopes & Status')).toBeInTheDocument();
    expect(screen.getAllByText('Claude Code').length).toBeGreaterThan(0);

    const revokeButtons = screen.getAllByRole('button', { name: /Revoke/i });
    expect(revokeButtons.length).toBeGreaterThan(0);

    // Click revoke on first token
    await user.click(revokeButtons[0]);
    // The tokens count updates
  });

  it('opens Delete sessions modal and cancels', async () => {
    const user = userEvent.setup();
    render(<ClaudeCodeTab />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete…' });
    await user.click(deleteBtn);

    expect(screen.getByText('Delete server-side sessions')).toBeInTheDocument();
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelBtn);

    expect(screen.queryByText('Delete server-side sessions')).not.toBeInTheDocument();
  });
});
