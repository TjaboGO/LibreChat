import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ChatInfoModal, { type ChatInfoData } from '../ChatInfoModal';

describe('ChatInfoModal', () => {
  const sampleInfo: ChatInfoData = {
    conversationId: 'convo-12345',
    title: 'Research deep learning transformers',
    createdAt: 'Sep 18, 2026, 10:30 PM',
    lastInteracted: '2 hours ago',
    totalMessages: 16,
    model: 'DeepSeek Reasoner',
    initialNotes: 'Key discussion on multi-head attention.',
  };

  it('renders modal with metadata when open is true', () => {
    render(<ChatInfoModal open={true} onOpenChange={jest.fn()} info={sampleInfo} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Chat info' })).toBeInTheDocument();
    expect(screen.getByText('Research deep learning transformers')).toBeInTheDocument();
    expect(screen.getByText(/ID: convo-12345/)).toBeInTheDocument();
    expect(screen.getByText('Sep 18, 2026, 10:30 PM')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('DeepSeek Reasoner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Key discussion on multi-head attention.')).toBeInTheDocument();
  });

  it('calls onSaveNotes and closes modal when clicking Done', async () => {
    const user = userEvent.setup();
    const onSaveNotes = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <ChatInfoModal
        open={true}
        onOpenChange={onOpenChange}
        info={sampleInfo}
        onSaveNotes={onSaveNotes}
      />,
    );

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'Updated conversation summary');

    const doneButton = screen.getByRole('button', { name: 'Done' });
    await user.click(doneButton);

    expect(onSaveNotes).toHaveBeenCalledWith('Updated conversation summary');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange with false when clicking close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(<ChatInfoModal open={true} onOpenChange={onOpenChange} info={sampleInfo} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
