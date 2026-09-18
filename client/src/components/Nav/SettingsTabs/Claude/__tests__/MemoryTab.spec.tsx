import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import MemoryTab from '../MemoryTab';

describe('MemoryTab', () => {
  it('renders memory toggles and stored categories', () => {
    render(<MemoryTab />);

    expect(screen.getByText('Search and reference chats')).toBeInTheDocument();
    expect(screen.getByText('Generate memory from chats')).toBeInTheDocument();
    expect(screen.getByText('Include sensitive topics in memory')).toBeInTheDocument();
    expect(screen.getByText('Import memory from other AI providers')).toBeInTheDocument();

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Model Context Protocol')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('drills into an entry detail view when clicked and returns via back button', async () => {
    const user = userEvent.setup();
    render(<MemoryTab />);

    const prefRow = screen.getByText('Preferences');
    await user.click(prefRow);

    // Detail view should now be shown
    expect(screen.getByText('Last updated')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();

    // Click back button
    const backBtn = screen.getByText('Memory');
    await user.click(backBtn);

    // Should return to list view
    expect(screen.getByText('Import memory from other AI providers')).toBeInTheDocument();
  });

  it('opens import modal when clicking Start import', async () => {
    const user = userEvent.setup();
    render(<MemoryTab />);

    const importBtn = screen.getByText('Start import');
    await user.click(importBtn);

    expect(screen.getByText('Import memory to Claude')).toBeInTheDocument();
    expect(screen.getByText(/Copy this prompt into a chat/i)).toBeInTheDocument();
  });
});
