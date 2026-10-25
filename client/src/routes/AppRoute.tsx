import { memo } from 'react';
import { isValidAppId } from 'librechat-data-provider';
import { Navigate, useParams, useLocation } from 'react-router-dom';
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

  return <ChatRoute />;
}

export default memo(AppRoute);
