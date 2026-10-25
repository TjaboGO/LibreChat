import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { getAppDefinition } from 'librechat-data-provider';
import { render, fireEvent, screen } from '@testing-library/react';
import ConversationEndpointIcon from '~/components/Conversations/ConversationEndpointIcon';
import { conversationFilterScopeAtom } from '~/hooks/useConversationFilters';
import AllActivityTimeline from '~/components/Activity/AllActivityTimeline';

// Mock auth
jest.mock('~/hooks', () => ({
  ...jest.requireActual('~/hooks'),
  useAuthContext: () => ({ isAuthenticated: true, user: { id: 'user1' } }),
  useLocalize: () => (key: string) => key,
}));

// Mock data-provider queries
const mockConversations = [
  {
    conversationId: 'convo-manus-1',
    title: 'Autonomous Backend Build',
    appId: 'manus',
    updatedAt: new Date().toISOString(),
    endpoint: 'openrouter',
  },
  {
    conversationId: 'convo-v0-1',
    title: 'SaaS Landing Page Design',
    appId: 'v0',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    endpoint: 'openrouter',
  },
  {
    conversationId: 'convo-chat-1',
    title: 'General Philosophy Debate',
    appId: 'chat',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    endpoint: 'openrouter',
  },
];

jest.mock('~/data-provider', () => ({
  useGetEndpointsQuery: () => ({ data: {} }),
  useConversationsInfiniteQuery: ({ appId, search }: { appId?: string; search?: string } = {}) => {
    let filtered = [...mockConversations];
    if (appId) {
      filtered = filtered.filter((c) => c.appId === appId);
    }
    if (search) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return {
      data: {
        pages: [{ conversations: filtered, nextCursor: null }],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    };
  },
}));

jest.mock('~/Providers', () => ({
  useAgentsMapContext: () => undefined,
  useAssistantsMapContext: () => undefined,
}));

describe('Isolerad Historik per App vs. Startsida (Fas 33)', () => {
  describe('ConversationEndpointIcon with App Branding', () => {
    it('renders specialized app icon when conversation.appId is manus', () => {
      const convo = mockConversations[0] as any;
      render(<ConversationEndpointIcon conversation={convo} size={20} />);

      expect(screen.getByTestId('convo-app-icon-manus')).toBeInTheDocument();
      expect(screen.getByTitle('Manus Workspace (30+ Tools)')).toBeInTheDocument();
    });

    it('renders specialized app icon when conversation.appId is v0', () => {
      const convo = mockConversations[1] as any;
      render(<ConversationEndpointIcon conversation={convo} size={20} />);

      expect(screen.getByTestId('convo-app-icon-v0')).toBeInTheDocument();
      expect(screen.getByTitle('v0 Studio (Generative UI)')).toBeInTheDocument();
    });
  });

  describe('AllActivityTimeline', () => {
    it('renders header, timeline groups, and session cards', () => {
      render(
        <MemoryRouter>
          <AllActivityTimeline />
        </MemoryRouter>,
      );

      expect(screen.getByText('All Activity Timeline')).toBeInTheDocument();
      expect(screen.getByTestId('activity-tab-all')).toBeInTheDocument();
      expect(screen.getByTestId('activity-tab-core')).toBeInTheDocument();
      expect(screen.getByTestId('activity-tab-agents')).toBeInTheDocument();
      expect(screen.getByTestId('activity-tab-builders')).toBeInTheDocument();
      expect(screen.getByTestId('activity-tab-research')).toBeInTheDocument();

      // Check rendered conversations with badges
      expect(screen.getByText('Autonomous Backend Build')).toBeInTheDocument();
      expect(screen.getByText('Manus Workspace')).toBeInTheDocument();

      expect(screen.getByText('SaaS Landing Page Design')).toBeInTheDocument();
      expect(screen.getByText('v0 Studio')).toBeInTheDocument();

      expect(screen.getByText('General Philosophy Debate')).toBeInTheDocument();
    });

    it('filters sessions when a section tab is clicked', () => {
      render(
        <MemoryRouter>
          <AllActivityTimeline />
        </MemoryRouter>,
      );

      // Click "Agents" tab
      const agentsTab = screen.getByTestId('activity-tab-agents');
      fireEvent.click(agentsTab);

      // Manus (agents) should still be visible, v0 (builders) should be filtered out
      expect(screen.getByText('Autonomous Backend Build')).toBeInTheDocument();
      expect(screen.queryByText('SaaS Landing Page Design')).not.toBeInTheDocument();
    });
  });
});
