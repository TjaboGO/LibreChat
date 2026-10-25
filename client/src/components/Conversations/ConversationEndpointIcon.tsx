import { memo } from 'react';
import { getAppDefinition, type TConversation, type TEndpointsConfig } from 'librechat-data-provider';
import { useAgentsMapContext, useAssistantsMapContext } from '~/Providers';
import { getAppIcon } from '~/components/UnifiedSidebar/appIcons';
import EndpointIcon from '~/components/Endpoints/EndpointIcon';
import { areConversationIconFieldsEqual } from './utils';
import { useGetEndpointsQuery } from '~/data-provider';
import { cn } from '~/utils';

const emptyEndpointsConfig = {} as TEndpointsConfig;

type EndpointIconContext = 'message' | 'nav' | 'landing' | 'menu-item';

type ConversationEndpointIconProps = {
  conversation: TConversation;
  className?: string;
  context?: EndpointIconContext;
  size?: number;
};

function ConversationEndpointIcon({
  conversation,
  className,
  context = 'menu-item',
  size = 20,
}: ConversationEndpointIconProps) {
  const { data: endpointsConfig = emptyEndpointsConfig } = useGetEndpointsQuery();
  const agentsMap = useAgentsMapContext();
  const assistantMap = useAssistantsMapContext();

  const app =
    conversation?.appId && conversation.appId !== 'chat'
      ? getAppDefinition(conversation.appId)
      : null;

  if (app) {
    const AppIcon = getAppIcon(app.icon);
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded border text-xs',
          app.color || 'border-border-light bg-surface-active text-text-secondary',
          className,
        )}
        style={{ width: size, height: size }}
        title={`${app.name} (${app.badge || 'App'})`}
        data-testid={`convo-app-icon-${app.id}`}
      >
        <AppIcon className="h-3 w-3" aria-hidden="true" />
      </div>
    );
  }

  return (
    <EndpointIcon
      conversation={conversation}
      endpointsConfig={endpointsConfig}
      assistantMap={assistantMap}
      agentsMap={agentsMap}
      className={className}
      size={size}
      context={context}
    />
  );
}

export default memo(ConversationEndpointIcon, (prevProps, nextProps) => {
  return (
    prevProps.className === nextProps.className &&
    prevProps.context === nextProps.context &&
    prevProps.size === nextProps.size &&
    prevProps.conversation?.appId === nextProps.conversation?.appId &&
    areConversationIconFieldsEqual(prevProps.conversation, nextProps.conversation)
  );
});
