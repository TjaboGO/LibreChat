import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CodeRoutinesView from '../CodeRoutinesView';

describe('CodeRoutinesView', () => {
  it('renders Routines title, search, and empty state with template starters', () => {
    render(<CodeRoutinesView />);

    expect(screen.getByRole('heading', { level: 1, name: 'Routines' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByText('No routines yet.')).toBeInTheDocument();
    expect(screen.getByText('Starter Templates')).toBeInTheDocument();
    expect(screen.getByText('Briefing')).toBeInTheDocument();
    expect(screen.getByText('Email triage')).toBeInTheDocument();
  });

  it('switches to Templates tab and displays all routine templates', async () => {
    const user = userEvent.setup();
    render(<CodeRoutinesView />);

    const templatesTab = screen.getByRole('button', { name: 'Templates' });
    await user.click(templatesTab);

    expect(screen.getByText('System health check')).toBeInTheDocument();
    expect(screen.getByText('Issue triage')).toBeInTheDocument();
    expect(screen.getByText('PR review digest')).toBeInTheDocument();
    expect(screen.getByText('Dependency update check')).toBeInTheDocument();
    expect(screen.getByText('Release notes drafter')).toBeInTheDocument();
    expect(screen.getByText('Flaky test tracker')).toBeInTheDocument();
  });

  it('creates routine when clicking Use template', async () => {
    const user = userEvent.setup();
    render(<CodeRoutinesView />);

    const useTemplateButtons = screen.getAllByRole('button', { name: /Use template/i });
    await user.click(useTemplateButtons[0]);

    // Switches to Yours tab and shows routine
    expect(screen.getByText('Briefing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Run now' })).toBeInTheDocument();
  });
});
