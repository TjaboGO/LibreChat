import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import SkillsTab from '../SkillsTab';

describe('SkillsTab', () => {
  it('renders Your skills list with tags and Add button', () => {
    render(<SkillsTab />);

    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Your skills')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Architect')).toBeInTheDocument();
    expect(screen.getByText('Documentation Drafter')).toBeInTheDocument();
  });

  it('switches to Discover tab showing featured Data card and For you grid', async () => {
    const user = userEvent.setup();
    render(<SkillsTab />);

    const discoverTab = screen.getByText('Discover');
    await user.click(discoverTab);

    expect(screen.getByText('From Anthropic')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('For you')).toBeInTheDocument();
    expect(screen.getByText('Productivity')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });
});
