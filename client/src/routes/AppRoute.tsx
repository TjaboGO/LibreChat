import { memo } from 'react';
import { isValidAppId } from 'librechat-data-provider';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import ManusWorkspaceView from '~/components/ManusStudio/ManusWorkspaceView';
import DevinWorkspaceView from '~/components/DevinStudio/DevinWorkspaceView';
import ChatRoute from './ChatRoute';

/**
 * AppRoute: Scoped Application Shell route component.
 *
 * Handles:
 * - `/app/:appId` -> redirects to `/app/:appId/new`
 * - `/app/:appId/:conversationId` -> renders ChatRoute scoped to the target application
 * - Validates appId against APPS_REGISTRY, gracefully falling back to `/c/new` if invalid
 * - Mounts specialized studio views (e.g. ManusWorkspaceView for /app/manus, DevinWorkspaceView for /app/devin)
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

  return <ChatRoute />;
}

export default memo(AppRoute);
