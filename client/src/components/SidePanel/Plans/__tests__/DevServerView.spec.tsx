import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatContext } from '~/Providers/ChatContext';
import DevServerView from '../DevServerView';

describe('DevServerView (Self-Healing Dev Server)', () => {
  it('renders dev server toolbar, status and preview surface', () => {
    render(<DevServerView />);

    expect(screen.getByText('Dev Server Running')).toBeInTheDocument();
    expect(screen.getByText('Web Application Preview')).toBeInTheDocument();
    expect(screen.getByText('Vite Dev Server Live (Port 5173)')).toBeInTheDocument();
    expect(screen.getByText('Web Console')).toBeInTheDocument();
  });

  it('allows switching viewports (desktop, tablet, mobile)', () => {
    render(<DevServerView />);

    const tabletBtn = screen.getByTitle('Tablet View');
    fireEvent.click(tabletBtn);

    const mobileBtn = screen.getByTitle('Mobile View');
    fireEvent.click(mobileBtn);
  });

  it('triggers simulated error, displays error alert banner and enables auto-heal', async () => {
    const mockAsk = jest.fn();
    const mockChatContext: any = {
      ask: mockAsk,
      conversation: { conversationId: 'c1' },
    };

    render(
      <ChatContext.Provider value={mockChatContext}>
        <DevServerView />
      </ChatContext.Provider>,
    );

    // Simulate reference error
    const refErrBtn = screen.getByRole('button', { name: /simulate referenceerror/i });
    fireEvent.click(refErrBtn);

    // Error banner should appear
    expect(screen.getByTestId('error-alert-banner')).toBeInTheDocument();
    expect(screen.getByText(/ReferenceError: Crash in src\/components\/Dashboard.tsx/i)).toBeInTheDocument();
    expect(screen.getByText(/Root Cause:/i)).toBeInTheDocument();

    // Click Auto-Heal
    const healButton = screen.getByTestId('auto-heal-button');
    fireEvent.click(healButton);

    expect(mockAsk).toHaveBeenCalledTimes(1);
    const sentText = mockAsk.mock.calls[0][0].text;
    expect(sentText).toContain('[Self-Healing Dev Server Error Detected]');
    expect(sentText).toContain('src/components/Dashboard.tsx:28');
  });

  it('clears console logs when clear button is clicked', () => {
    render(<DevServerView />);

    const clearButton = screen.getByTitle('Clear logs');
    fireEvent.click(clearButton);

    expect(screen.getByText('Console output is clean')).toBeInTheDocument();
  });
});
