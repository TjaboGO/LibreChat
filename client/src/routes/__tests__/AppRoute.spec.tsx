import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { getAppDefinition, getDefaultApp, isValidAppId } from 'librechat-data-provider';
import AppHeaderBadge from '~/components/Chat/AppHeaderBadge';
import AppRoute from '../AppRoute';

// Mock ChatRoute for testing AppRoute routing behavior
jest.mock('../ChatRoute', () => {
  return function MockChatRoute() {
    return <div data-testid="chat-route-mock">Scoped Chat Route Mounted</div>;
  };
});

jest.mock('~/components/ManusStudio/ManusWorkspaceView', () => {
  return function MockManusWorkspaceView() {
    return <div data-testid="manus-workspace-view-mock">Manus Workspace View Mounted</div>;
  };
});

jest.mock('~/components/DevinStudio/DevinWorkspaceView', () => {
  return function MockDevinWorkspaceView() {
    return <div data-testid="devin-workspace-view-mock">Devin Workspace View Mounted</div>;
  };
});

jest.mock('~/components/CodeStudios/CodingStudioWorkspaceView', () => {
  return function MockCodingStudioWorkspaceView({ appId }: { appId: string }) {
    return <div data-testid={`coding-studio-view-mock-${appId}`}>Coding Studio View Mounted ({appId})</div>;
  };
});

jest.mock('~/components/v0Studio/v0StudioView', () => {
  return function Mockv0StudioView() {
    return <div data-testid="v0-studio-view-mock">v0 Studio View Mounted</div>;
  };
});

jest.mock('~/components/Builders', () => ({
  FullStackStudio: function MockFullStackStudio({ appId }: { appId: string }) {
    return <div data-testid={`fullstack-studio-mock-${appId}`}>FullStack Studio Mounted ({appId})</div>;
  },
}));

jest.mock('~/components/OfficeStudio/OfficeWorkspaceView', () => {
  return function MockOfficeWorkspaceView() {
    return <div data-testid="office-workspace-view-mock">Office Workspace View Mounted</div>;
  };
});

jest.mock('~/components/NotionStudio/NotionWorkspaceView', () => {
  return function MockNotionWorkspaceView() {
    return <div data-testid="notion-workspace-view-mock">Notion Workspace View Mounted</div>;
  };
});

jest.mock('~/components/Research', () => ({
  ResearchStudioView: function MockResearchStudioView() {
    return <div data-testid="research-studio-view-mock">Research Studio View Mounted</div>;
  },
}));

jest.mock('~/components/Atlas', () => ({
  AtlasWorkspaceView: function MockAtlasWorkspaceView() {
    return <div data-testid="atlas-workspace-view-mock">Atlas Workspace View Mounted</div>;
  },
}));

jest.mock('~/components/Connectors', () => ({
  ConnectorHubStudio: function MockConnectorHubStudio() {
    return <div data-testid="connectors-studio-mock">Connector Hub Studio Mounted</div>;
  },
}));

let mockCurrentApp = getDefaultApp();
let mockIsSpecialized = false;

jest.mock('~/hooks/useCurrentApp', () => ({
  __esModule: true,
  default: () => ({
    appId: mockCurrentApp.id,
    app: mockCurrentApp,
    section: { id: mockCurrentApp.section, title: 'Section Title', badge: 'Badge', icon: 'Sparkles', order: 1 },
    isAppRoute: true,
    isSpecializedApp: mockIsSpecialized,
    icon: () => <span data-testid="app-icon-mock" />,
    name: mockCurrentApp.name,
    badge: mockCurrentApp.badge,
    tagline: mockCurrentApp.tagline,
    description: mockCurrentApp.description,
    color: mockCurrentApp.color,
    capabilities: mockCurrentApp.capabilities,
    routePath: mockCurrentApp.routePath,
    newChatPath: `/app/${mockCurrentApp.id}/new`,
    navigateToApp: jest.fn(),
    startNewAppChat: jest.fn(),
  }),
}));

describe('Scoped Routing & App Shell (Fas 32)', () => {
  beforeEach(() => {
    mockCurrentApp = getDefaultApp();
    mockIsSpecialized = false;
    jest.clearAllMocks();
  });

  describe('App Definition & Route Validation', () => {
    it('validates registered apps for scoped routing', () => {
      expect(isValidAppId('manus')).toBe(true);
      expect(isValidAppId('v0')).toBe(true);
      expect(isValidAppId('devin')).toBe(true);
      expect(isValidAppId('perplexity')).toBe(true);
      expect(isValidAppId('office')).toBe(true);
      expect(isValidAppId('non-existent-app')).toBe(false);
    });

    it('retrieves app metadata for Manus, v0, and Perplexity', () => {
      const manus = getAppDefinition('manus');
      expect(manus?.name).toBe('Manus Workspace');
      expect(manus?.routePath).toBe('/app/manus');
      expect(manus?.badge).toBe('30+ Tools');

      const v0 = getAppDefinition('v0');
      expect(v0?.name).toBe('v0 Studio');
      expect(v0?.routePath).toBe('/app/v0');
      expect(v0?.badge).toBe('Generative UI');

      const perplexity = getAppDefinition('perplexity');
      expect(perplexity?.name).toBe('Perplexity Research');
      expect(perplexity?.routePath).toBe('/app/perplexity');
      expect(perplexity?.badge).toBe('Multi-Hop');
    });
  });

  describe('AppRoute Navigation & Scoping', () => {
    it('redirects invalid appId to /c/new', () => {
      render(
        <MemoryRouter initialEntries={['/app/invalid-app-123/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
            <Route path="/c/new" element={<div data-testid="fallback-new-convo">Fallback</div>} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('fallback-new-convo')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-route-mock')).not.toBeInTheDocument();
    });

    it('redirects /app/:appId to /app/:appId/new when conversationId is omitted', () => {
      render(
        <MemoryRouter initialEntries={['/app/manus']}>
          <Routes>
            <Route path="/app/:appId" element={<AppRoute />} />
            <Route path="/app/:appId/:conversationId" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      // Successfully redirected and mounted ChatRoute
      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute and ManusWorkspaceView when on /app/manus/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/manus/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('manus-workspace-view-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute and DevinWorkspaceView when on /app/devin/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/devin/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('devin-workspace-view-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute and CodingStudioWorkspaceView when on /app/cursor/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/cursor/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('coding-studio-view-mock-cursor')).toBeInTheDocument();
    });

    it('renders ChatRoute and CodingStudioWorkspaceView when on /app/windsurf/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/windsurf/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('coding-studio-view-mock-windsurf')).toBeInTheDocument();
    });

    it('renders ChatRoute and CodingStudioWorkspaceView when on /app/kiro/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/kiro/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('coding-studio-view-mock-kiro')).toBeInTheDocument();
    });

    it('renders ChatRoute and v0StudioView when on /app/v0/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/v0/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('v0-studio-view-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute and FullStackStudio when on /app/lovable/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/lovable/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('fullstack-studio-mock-lovable')).toBeInTheDocument();
    });

    it('renders ChatRoute and FullStackStudio when on /app/bolt/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/bolt/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('fullstack-studio-mock-bolt')).toBeInTheDocument();
    });

    it('renders ChatRoute and OfficeWorkspaceView when on /app/office/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/office/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('office-workspace-view-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute and NotionWorkspaceView when on /app/notion/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/notion/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('notion-workspace-view-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute and ResearchStudioView when on /app/research/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/research/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('research-studio-view-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute and ResearchStudioView when on /app/perplexity/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/perplexity/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('research-studio-view-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute and AtlasWorkspaceView when on /app/atlas/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/atlas/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('atlas-workspace-view-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute and ConnectorHubStudio when on /app/connectors/:conversationId', () => {
      render(
        <MemoryRouter initialEntries={['/app/connectors/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.getByTestId('connectors-studio-mock')).toBeInTheDocument();
    });

    it('renders ChatRoute without studio views for other apps like /app/higgsfield/new', () => {
      render(
        <MemoryRouter initialEntries={['/app/higgsfield/new']}>
          <Routes>
            <Route path="/app/:appId/:conversationId?" element={<AppRoute />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('chat-route-mock')).toBeInTheDocument();
      expect(screen.queryByTestId('manus-workspace-view-mock')).toBeNull();
      expect(screen.queryByTestId('v0-studio-view-mock')).toBeNull();
      expect(screen.queryByTestId('fullstack-studio-mock-lovable')).toBeNull();
      expect(screen.queryByTestId('office-workspace-view-mock')).toBeNull();
      expect(screen.queryByTestId('notion-workspace-view-mock')).toBeNull();
      expect(screen.queryByTestId('research-studio-view-mock')).toBeNull();
      expect(screen.queryByTestId('atlas-workspace-view-mock')).toBeNull();
      expect(screen.queryByTestId('connectors-studio-mock')).toBeNull();
    });
  });

  describe('AppHeaderBadge', () => {
    it('renders nothing when not in a specialized app (regular chat)', () => {
      mockCurrentApp = getDefaultApp(); // chat
      mockIsSpecialized = false;

      const { container } = render(
        <MemoryRouter>
          <AppHeaderBadge />
        </MemoryRouter>,
      );

      expect(container.firstChild).toBeNull();
    });

    it('renders app scope badge with name, badge, and new session button for Manus', () => {
      mockCurrentApp = getAppDefinition('manus')!;
      mockIsSpecialized = true;

      render(
        <MemoryRouter>
          <AppHeaderBadge />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('app-header-scope-badge')).toBeInTheDocument();
      expect(screen.getByText('Manus Workspace')).toBeInTheDocument();
      expect(screen.getByText('30+ Tools')).toBeInTheDocument();
      expect(screen.getByTestId('new-app-session-btn')).toBeInTheDocument();
    });

    it('renders app scope badge for v0 Studio', () => {
      mockCurrentApp = getAppDefinition('v0')!;
      mockIsSpecialized = true;

      render(
        <MemoryRouter>
          <AppHeaderBadge />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('app-header-scope-badge')).toBeInTheDocument();
      expect(screen.getByText('v0 Studio')).toBeInTheDocument();
      expect(screen.getByText('Generative UI')).toBeInTheDocument();
    });
  });
});
