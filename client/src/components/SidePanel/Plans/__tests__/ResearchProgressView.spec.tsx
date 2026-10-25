import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatContext } from '~/Providers/ChatContext';
import ResearchProgressView from '../ResearchProgressView';

describe('ResearchProgressView (Deep Research Engine)', () => {
  it('renders default research session topic, progress bar and query graph', () => {
    render(<ResearchProgressView />);

    expect(screen.getByText('Autonomous Multi-Agent AI Systems (2026)')).toBeInTheDocument();
    expect(screen.getByText(/multi-hop queries/i)).toBeInTheDocument();
    expect(screen.getByText('Multi-Hop Query Graph')).toBeInTheDocument();
    expect(screen.getByText('HOP 0 • BROAD DISCOVERY')).toBeInTheDocument();
    expect(screen.getByText(/Authoritative Sources/i)).toBeInTheDocument();
  });

  it('filters sources by search keyword', () => {
    render(<ResearchProgressView />);

    const searchInput = screen.getByPlaceholderText(/filter sources by domain or keyword/i);
    fireEvent.change(searchInput, { target: { value: 'arxiv' } });

    expect(screen.getByText('arxiv.org')).toBeInTheDocument();
  });

  it('allows starting a new research topic', () => {
    render(<ResearchProgressView />);

    const topicInput = screen.getByPlaceholderText(/launch new deep research on topic/i);
    const researchBtn = screen.getByRole('button', { name: /research/i });

    fireEvent.change(topicInput, { target: { value: 'Quantum Annealing Benchmarks' } });
    fireEvent.click(researchBtn);
  });

  it('inserts synthesized findings into chat via chatContext.ask', () => {
    const mockAsk = jest.fn();
    const mockChatContext: any = {
      ask: mockAsk,
      conversation: { conversationId: 'c1' },
    };

    render(
      <ChatContext.Provider value={mockChatContext}>
        <ResearchProgressView />
      </ChatContext.Provider>,
    );

    const insertBtn = screen.getByRole('button', { name: /insert into chat/i });
    fireEvent.click(insertBtn);

    expect(mockAsk).toHaveBeenCalledTimes(1);
    expect(mockAsk.mock.calls[0][0].text).toContain('# Deep Research Report');
  });
});
