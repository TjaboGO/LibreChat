import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import WordCountPopover from '../WordCountPopover';

describe('WordCountPopover', () => {
  it('renders zero counts for empty text', () => {
    render(<WordCountPopover text="" />);
    expect(screen.getByText(/0 words \/ 0 chars/i)).toBeInTheDocument();
  });

  it('renders correct word and character count for non-empty text', () => {
    render(<WordCountPopover text="Hello world! How are you?" />);
    // 5 words, 25 characters
    expect(screen.getByText(/5 words \/ 25 chars/i)).toBeInTheDocument();
  });

  it('opens popover showing detailed metrics when clicked', async () => {
    render(<WordCountPopover text="Hello world! How are you? Multiple sentences. Line two." />);
    const button = screen.getByRole('button', { name: /open word count breakdown/i });
    await userEvent.click(button);

    expect(screen.getByText(/characters \(with spaces\)/i)).toBeInTheDocument();
    expect(screen.getByText(/characters \(no spaces\)/i)).toBeInTheDocument();
    expect(screen.getByText(/tokens \(est\.\)/i)).toBeInTheDocument();
    expect(screen.getByText(/sentences/i)).toBeInTheDocument();
  });
});
