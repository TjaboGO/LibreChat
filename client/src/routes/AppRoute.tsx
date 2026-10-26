import { memo, lazy, Suspense } from 'react';
import { isValidAppId } from 'librechat-data-provider';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import ChatRoute from './ChatRoute';

// Lazy-loaded specialized studio workspaces for instant app switching and reduced bundle size
const ManusWorkspaceView = lazy(() => import('~/components/ManusStudio/ManusWorkspaceView'));
const DevinWorkspaceView = lazy(() => import('~/components/DevinStudio/DevinWorkspaceView'));
const CodingStudioWorkspaceView = lazy(() => import('~/components/CodeStudios/CodingStudioWorkspaceView'));
const v0StudioView = lazy(() => import('~/components/v0Studio/v0StudioView'));
const FullStackStudio = lazy(() =>
  import('~/components/Builders').then((m) => ({ default: m.FullStackStudio })),
);
const OfficeWorkspaceView = lazy(() => import('~/components/OfficeStudio/OfficeWorkspaceView'));
const NotionWorkspaceView = lazy(() => import('~/components/NotionStudio/NotionWorkspaceView'));
const ResearchStudioView = lazy(() =>
  import('~/components/Research').then((m) => ({ default: m.ResearchStudioView })),
);
const AtlasWorkspaceView = lazy(() =>
  import('~/components/Atlas').then((m) => ({ default: m.AtlasWorkspaceView })),
);
const ConnectorHubStudio = lazy(() =>
  import('~/components/Connectors').then((m) => ({ default: m.ConnectorHubStudio })),
);

/**
 * Lightweight loading fallback rendered while a specialized studio chunk is fetched on-demand.
 */
function StudioLoadingFallback() {
  return (
    <div
      data-testid="studio-loading-fallback"
      className="w-[500px] xl:w-[600px] border-l border-border bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center h-full shrink-0 select-none animate-pulse text-muted-foreground text-sm"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="font-medium tracking-wide">Loading workspace...</span>
      </div>
    </div>
  );
}

/**
 * AppRoute: Scoped Application Shell route component.
 *
 * Handles:
 * - `/app/:appId` -> redirects to `/app/:appId/new`
 * - `/app/:appId/:conversationId` -> renders ChatRoute scoped to the target application
 * - Validates appId against APPS_REGISTRY, gracefully falling back to `/c/new` if invalid
 * - Mounts specialized studio views (Manus, Devin, Cursor, Windsurf, Kiro, v0, Lovable, Office, Notion, Bolt, Research, Atlas, Connectors)
 */
function AppRoute() {
  const location = useLocation();
  const { appId = '', conversationId } = useParams<{
    appId?: string;
    conversationId?: string;
  }>();

  // Validate application ID against registered apps
  if (!appId || !isValidAppId(appId)) {
    return <Navigate to="/c/new" replace={true} />;
  }

  // If no conversationId is supplied, default to a new scoped session preserving search params
  if (!conversationId) {
    return <Navigate to={`/app/${appId}/new${location.search}`} replace={true} />;
  }

  if (appId === 'manus') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <ManusWorkspaceView />
        </Suspense>
      </div>
    );
  }

  if (appId === 'devin') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <DevinWorkspaceView />
        </Suspense>
      </div>
    );
  }

  if (appId === 'cursor' || appId === 'windsurf' || appId === 'kiro') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <CodingStudioWorkspaceView appId={appId} />
        </Suspense>
      </div>
    );
  }

  if (appId === 'v0') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <v0StudioView />
        </Suspense>
      </div>
    );
  }

  if (appId === 'lovable' || appId === 'bolt') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <FullStackStudio appId={appId} />
        </Suspense>
      </div>
    );
  }

  if (appId === 'office') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <OfficeWorkspaceView />
        </Suspense>
      </div>
    );
  }

  if (appId === 'notion') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <NotionWorkspaceView />
        </Suspense>
      </div>
    );
  }

  if (appId === 'research' || appId === 'perplexity') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <ResearchStudioView />
        </Suspense>
      </div>
    );
  }

  if (appId === 'atlas') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <AtlasWorkspaceView />
        </Suspense>
      </div>
    );
  }

  if (appId === 'connectors') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <Suspense fallback={<StudioLoadingFallback />}>
          <ConnectorHubStudio />
        </Suspense>
      </div>
    );
  }

  return <ChatRoute />;
}

export default memo(AppRoute);
