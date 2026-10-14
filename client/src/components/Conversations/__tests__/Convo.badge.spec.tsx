import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { render, screen } from '@testing-library/react';
import type { TConversation } from 'librechat-data-provider';

jest.mock('@librechat/client', () => ({
  useMediaQuery: () => false,
  useToastContext: () => ({ showToast: jest.fn() }),
  Spinner: () => <div data-testid="spinner" />,
  TooltipAnchor: ({ render: trigger }: { render: React.ReactNode }) => trigger,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) => key,
  useNavigateToConvo: () => ({ navigateToConvo: jest.fn() }),
  useShiftKey: () => false,
}));

const mockTasks = [
  {
    id: 'run-1',
    conversationId: 'convo-with-task',
    title: 'Background task running',
    type: 'scheduled',
    status: 'running',
    timeAgo: 'Just now',
  },
];

jest.mock('~/data-provider', () => ({
  useGetStartupConfig: () => ({ data: { sharedLinksEnabled: false } }),
  useUpdateConversationMutation: () => ({ mutateAsync: jest.fn() }),
  usePinConversationMutation: () => ({ mutate: jest.fn() }),
  useCoworkTasksQuery: () => ({
    data: { tasks: mockTasks },
  }),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({ conversationId: 'other-convo' }),
}));

jest.mock('recoil', () => ({
  useRecoilValue: () => [],
}));

jest.mock('~/store', () => ({
  __esModule: true,
  default: { allConversationsSelector: 'allConversationsSelector' },
}));

jest.mock('../ConversationEndpointIcon', () => ({
  __esModule: true,
  default: () => <div data-testid="convo-icon" />,
}));

jest.mock('../ConvoOptions', () => ({
  ConvoOptions: () => <div data-testid="convo-options" />,
}));

jest.mock('../ConvoLink', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <button type="button" aria-label={`open ${title}`}>
      {title}
    </button>
  ),
}));

jest.mock('../RenameForm', () => ({
  __esModule: true,
  default: () => <form data-testid="rename-form" />,
}));

import Conversation from '../Convo';

function renderConversation(convo: Partial<TConversation>) {
  const fullConvo = {
    conversationId: 'c1',
    title: 'Standard conversation',
    endpoint: 'openrouter',
    ...convo,
  } as TConversation;

  return render(
    <DndProvider backend={HTML5Backend}>
      <Conversation conversation={fullConvo} retainView={jest.fn()} toggleNav={jest.fn()} />
    </DndProvider>,
  );
}

describe('Conversation background task badge (⏱ •)', () => {
  it('renders clock badge with blue pulse dot when conversation has active task', () => {
    renderConversation({
      conversationId: 'convo-with-task',
      title: 'Active run conversation',
    });

    const badge = screen.getByTestId('convo-task-active-badge');
    expect(badge).toBeInTheDocument();
  });

  it('does not render clock badge when conversation has no active task', () => {
    renderConversation({
      conversationId: 'convo-without-task',
      title: 'Idle conversation',
    });

    expect(screen.queryByTestId('convo-task-active-badge')).not.toBeInTheDocument();
  });
});
