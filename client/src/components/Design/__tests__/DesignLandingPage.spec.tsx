import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import DesignLandingPage from '../DesignLandingPage';

jest.mock('~/hooks/AuthContext', () => ({
  useAuthContext: () => ({
    user: { name: 'Gabriel Odenhagen', email: 'gabriel@example.com' },
  }),
}));

describe('DesignLandingPage', () => {
  it('renders headline, prompt textarea, template grid, and project table', () => {
    render(<DesignLandingPage onOpenProject={jest.fn()} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'What should we create?' }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Attach a file, link your design system/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Choose a template')).toBeInTheDocument();
    expect(screen.getByText('Mobile app design')).toBeInTheDocument();
    expect(screen.getByText('E-Commerce Checkout Flow')).toBeInTheDocument();
  });

  it('calls onOpenProject when clicking a project row', async () => {
    const user = userEvent.setup();
    const onOpenProject = jest.fn();
    render(<DesignLandingPage onOpenProject={onOpenProject} />);

    const projectRow = screen.getByText('Landing Page Redesign');
    await user.click(projectRow);

    expect(onOpenProject).toHaveBeenCalledWith('Landing Page Redesign', 'Modernist');
  });

  it('submits design prompt and calls onOpenProject', async () => {
    const user = userEvent.setup();
    const onOpenProject = jest.fn();
    render(<DesignLandingPage onOpenProject={onOpenProject} />);

    const textarea = screen.getByPlaceholderText(/Attach a file, link your design system/i);
    await user.type(textarea, 'Create a modern dashboard for crypto portfolio');

    const generateButton = screen.getByRole('button', { name: 'Generate design' });
    await user.click(generateButton);

    expect(onOpenProject).toHaveBeenCalledWith(
      'Create a modern dashboard for crypto portfolio',
      'Modernist',
    );
  });
});
