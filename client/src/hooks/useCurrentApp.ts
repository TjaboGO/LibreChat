import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  APP_SECTIONS,
  getAppDefinition,
  getDefaultApp,
  isValidAppId,
  type AppDefinition,
  type SectionDefinition,
} from 'librechat-data-provider';
import { getAppIcon, type IconComponent } from '~/components/UnifiedSidebar/appIcons';
import store from '~/store';

export interface CurrentAppContext {
  appId: string;
  app: AppDefinition;
  section: SectionDefinition;
  isAppRoute: boolean;
  isSpecializedApp: boolean;
  icon: IconComponent;
  name: string;
  badge?: string;
  tagline: string;
  description: string;
  color: string;
  capabilities: string[];
  routePath: string;
  newChatPath: string;
  navigateToApp: (targetAppId: string, convoId?: string) => void;
  startNewAppChat: () => void;
}

export default function useCurrentApp(): CurrentAppContext {
  const params = useParams<{ appId?: string; conversationId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { conversation } = store.useCreateConversationAtom(0);

  const resolvedAppId = useMemo(() => {
    // 1. Direct route param from /app/:appId or /apps/:appId
    if (params.appId && isValidAppId(params.appId)) {
      return params.appId;
    }

    // 2. Extract from pathname regex (/app/:appId or /apps/:appId)
    const match = location.pathname.match(/^\/apps?\/([a-zA-Z0-9_-]+)/);
    if (match && isValidAppId(match[1])) {
      return match[1];
    }

    // 3. Fall back to conversation's stored appId if present
    if (conversation?.appId && isValidAppId(conversation.appId)) {
      return conversation.appId;
    }

    // 4. Default to standard Claude Chat
    return 'chat';
  }, [params.appId, location.pathname, conversation?.appId]);

  const app = useMemo(() => {
    return getAppDefinition(resolvedAppId) || getDefaultApp();
  }, [resolvedAppId]);

  const section = useMemo(() => {
    return (
      APP_SECTIONS[app.section] || {
        id: 'core',
        title: 'Core Apps',
        description: 'Frontier AI reasoning',
        icon: 'Sparkles',
        badge: '4 Apps',
        order: 1,
      }
    );
  }, [app.section]);

  const isAppRoute = useMemo(() => {
    return /^\/apps?\/[a-zA-Z0-9_-]+/.test(location.pathname);
  }, [location.pathname]);

  const isSpecializedApp = useMemo(() => {
    return app.id !== 'chat';
  }, [app.id]);

  const AppIcon = useMemo(() => {
    return getAppIcon(app.icon);
  }, [app.icon]);

  const navigateToApp = useCallback(
    (targetAppId: string, convoId?: string) => {
      if (!isValidAppId(targetAppId)) {
        return;
      }
      const path = convoId ? `/app/${targetAppId}/${convoId}` : `/app/${targetAppId}/new`;
      navigate(path);
    },
    [navigate],
  );

  const startNewAppChat = useCallback(() => {
    navigate(`/app/${app.id}/new`);
  }, [navigate, app.id]);

  return {
    appId: app.id,
    app,
    section,
    isAppRoute,
    isSpecializedApp,
    icon: AppIcon,
    name: app.name,
    badge: app.badge,
    tagline: app.tagline,
    description: app.description,
    color: app.color,
    capabilities: app.capabilities,
    routePath: app.routePath,
    newChatPath: `/app/${app.id}/new`,
    navigateToApp,
    startNewAppChat,
  };
}
