import { memo } from 'react';
import { isValidAppId } from 'librechat-data-provider';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import CodingStudioWorkspaceView from '~/components/CodeStudios/CodingStudioWorkspaceView';
import OfficeWorkspaceView from '~/components/OfficeStudio/OfficeWorkspaceView';
import NotionWorkspaceView from '~/components/NotionStudio/NotionWorkspaceView';
import ManusWorkspaceView from '~/components/ManusStudio/ManusWorkspaceView';
import DevinWorkspaceView from '~/components/DevinStudio/DevinWorkspaceView';
import v0StudioView from '~/components/v0Studio/v0StudioView';
import { ConnectorHubStudio } from '~/components/Connectors';
import { ResearchStudioView } from '~/components/Research';
import { AtlasWorkspaceView } from '~/components/Atlas';
import { FullStackStudio } from '~/components/Builders';
import ChatRoute from './ChatRoute';

/**
 * AppRoute: Scoped Application Shell route component.
 *
 * Handles:
 * - `/app/:appId` -> redirects to `/app/:appId/new`
 * - `/app/:appId/:conversationId` -> renders ChatRoute scoped to the target application
 * - Validates appId against APPS_REGISTRY, gracefully falling back to `/c/new` if invalid
 * - Mounts specialized studio views (Manus, Devin, Cursor, Windsurf, Kiro)
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
        <ManusWorkspaceView />
      </div>
    );
  }

  if (appId === 'devin') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <DevinWorkspaceView />
      </div>
    );
  }

  if (appId === 'cursor' || appId === 'windsurf' || appId === 'kiro') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <CodingStudioWorkspaceView appId={appId} />
      </div>
    );
  }

  if (appId === 'v0') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <v0StudioView />
      </div>
    );
  }

  if (appId === 'lovable' || appId === 'bolt') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <FullStackStudio appId={appId} />
      </div>
    );
  }

  if (appId === 'office') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <OfficeWorkspaceView />
      </div>
    );
  }

  if (appId === 'notion') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <NotionWorkspaceView />
      </div>
    );
  }

  if (appId === 'research' || appId === 'perplexity') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <ResearchStudioView />
      </div>
    );
  }

  if (appId === 'atlas') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <AtlasWorkspaceView />
      </div>
    );
  }

  if (appId === 'connectors') {
    return (
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <ChatRoute />
        </div>
        <ConnectorHubStudio />
      </div>
    );
  }

  return <ChatRoute />;
}

export default memo(AppRoute);
