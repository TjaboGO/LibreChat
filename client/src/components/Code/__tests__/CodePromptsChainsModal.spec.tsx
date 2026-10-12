import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CodePromptsChainsModal from '../CodePromptsChainsModal';

describe('CodePromptsChainsModal', () => {
  it('renders Prompts and Chains tabs, search input, and prompt rows', () => {
    render(<CodePromptsChainsModal open={true} onOpenChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Prompts' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chains' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search prompts…')).toBeInTheDocument();
    expect(screen.getByText('Email Rewriter')).toBeInTheDocument();
    expect(screen.getByText('Component Unit Test Writer')).toBeInTheDocument();
  });

  it('switches to Chains tab and shows chain items', async () => {
    const user = userEvent.setup();
    render(<CodePromptsChainsModal open={true} onOpenChange={jest.fn()} />);

    const chainsTab = screen.getByRole('button', { name: 'Chains' });
    await user.click(chainsTab);

    expect(screen.getByPlaceholderText('Search chains…')).toBeInTheDocument();
    expect(screen.getByText('Research & Summarize')).toBeInTheDocument();
    expect(screen.getByText('Bug Reproducer & Spec Generator')).toBeInTheDocument();
  });

  it('calls onSelectPrompt and closes modal when clicking Use button', async () => {
    const user = userEvent.setup();
    const onSelectPrompt = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <CodePromptsChainsModal
        open={true}
        onOpenChange={onOpenChange}
        onSelectPrompt={onSelectPrompt}
      />,
    );

    const useButtons = screen.getAllByRole('button', { name: 'Use' });
    await user.click(useButtons[0]);

    expect(onSelectPrompt).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
