import { memo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { isValidAppId } from 'librechat-data-provider';
import ChatRoute from './ChatRoute';

/**
 * AppRoute: Scoped Application Shell route component.
 *
 * Handles:
 * - `/app/:appId` -> redirects to `/app/:appId/new`
 * - `/app/:appId/:conversationId` -> renders ChatRoute scoped to the target application
 * - Validates appId against APPS_REGISTRY, gracefully falling back to `/c/new` if invalid
 */
function AppRoute() {
  const { appId = '', conversationId } = useParams<{
    appId?: string;
    conversationId?: string;
  }>();

  // Validate application ID against registered apps
  if (!appId || !isValidAppId(appId)) {
    return <Navigate to="/c/new" replace={true} />;
  }

  // If no conversationId is supplied, default to a new scoped session
  if (!conversationId) {
    return <Navigate to={`/app/${appId}/new`} replace={true} />;
  }

  return <ChatRoute />;
}

export default memo(AppRoute);
