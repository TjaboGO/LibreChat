import * as Ariakit from '@ariakit/react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown, TriangleAlert } from 'lucide-react';
import { Switch, TooltipAnchor, composerControlClasses } from '@librechat/client';
import { QueryKeys, Constants, ReasoningEffort, isAgentsEndpoint } from 'librechat-data-provider';
import type { TConversation } from 'librechat-data-provider';
import type { SetterOrUpdater } from 'recoil';
import type { TranslationKeys } from '~/hooks';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

/**
 * The visible tiers, in order — mirrors Claude's own Effort flyout exactly
 * (Low / Medium / High "Default" / Extra / Max). `none`/`minimal`/`unset`
 * from the full ReasoningEffort enum are reachable only through the
 * "Thinking" toggle below, not as their own row here.
 */
const EFFORT_TIERS: ReasoningEffort[] = [
  ReasoningEffort.low,
  ReasoningEffort.medium,
  ReasoningEffort.high,
  ReasoningEffort.xhigh,
  ReasoningEffort.max,
];

const tierLabels: Record<ReasoningEffort, TranslationKeys> = {
  [ReasoningEffort.unset]: 'com_ui_auto',
  [ReasoningEffort.none]: 'com_ui_none',
  [ReasoningEffort.minimal]: 'com_ui_minimal',
  [ReasoningEffort.low]: 'com_ui_low',
  [ReasoningEffort.medium]: 'com_ui_medium',
  [ReasoningEffort.high]: 'com_ui_high',
  [ReasoningEffort.xhigh]: 'com_ui_effort_extra',
  [ReasoningEffort.max]: 'com_ui_max',
};

const DEFAULT_TIER = ReasoningEffort.high;

export default function EffortSelector({
  conversation,
  setConversation,
  disabled,
}: {
  conversation: TConversation | null;
  setConversation: SetterOrUpdater<TConversation | null>;
  disabled: boolean;
}) {
  const localize = useLocalize();
  const queryClient = useQueryClient();
  const menuStore = Ariakit.useMenuStore({ focusLoop: true, placement: 'top-start' });
  const isOpen = menuStore.useState('open');

  const endpoint = conversation?.endpointType ?? conversation?.endpoint;
  if (!isAgentsEndpoint(endpoint)) {
    return null;
  }

  const current = conversation?.reasoning_effort;
  const thinkingOn = current !== ReasoningEffort.none;
  /** The tier a re-enabled toggle restores: the conversation's own last pick,
   *  or Claude's default of High when none has been set yet. */
  const restoreTier =
    current != null && current !== ReasoningEffort.none && current !== ReasoningEffort.unset
      ? current
      : DEFAULT_TIER;

  const applyEffort = (effort: ReasoningEffort) => {
    setConversation((prev) => (prev == null ? prev : { ...prev, reasoning_effort: effort }));
    const conversationId = conversation?.conversationId;
    if (conversationId == null || conversationId === Constants.NEW_CONVO) {
      return;
    }
    queryClient.setQueryData<TConversation>([QueryKeys.conversation, conversationId], (cached) =>
      cached == null ? cached : { ...cached, reasoning_effort: effort },
    );
  };

  const toggleThinking = (checked: boolean) => {
    applyEffort(checked ? restoreTier : ReasoningEffort.none);
  };

  return (
    <Ariakit.MenuProvider store={menuStore}>
      <TooltipAnchor
        description={localize('com_ui_effort')}
        disabled={isOpen}
        render={
          <Ariakit.MenuButton
            disabled={disabled}
            data-testid="effort-selector"
            aria-label={`${localize('com_ui_effort')}: ${
              thinkingOn ? localize(tierLabels[restoreTier]) : localize('com_ui_none')
            }`}
            className={cn(
              composerControlClasses(),
              'min-w-0 max-w-full px-2.5 md:px-theme-normal',
              isOpen && 'bg-surface-hover',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          />
        }
      >
        <span className="min-w-0 max-w-[8rem] truncate">
          {thinkingOn ? localize(tierLabels[restoreTier]) : localize('com_ui_none')}
        </span>
        <ChevronDown
          className={cn(
            'size-3 shrink-0 text-text-secondary transition-transform',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </TooltipAnchor>
      <Ariakit.Menu
        portal={true}
        gutter={8}
        unmountOnHide={true}
        className={cn(
          'z-50 flex min-w-[300px] max-w-[min(340px,calc(100vw-2rem))] flex-col rounded-xl',
          'max-h-[var(--popover-available-height)] overflow-y-auto border border-border-light bg-presentation p-1.5 shadow-lg',
          'origin-bottom opacity-0 transition-[opacity,transform] duration-200 ease-out',
          'data-[enter]:scale-100 data-[enter]:opacity-100',
          'scale-95 data-[leave]:scale-95 data-[leave]:opacity-0',
        )}
      >
        <p className="px-2.5 pb-1.5 pt-1 text-xs text-text-secondary">
          {localize('com_ui_effort_header')}
        </p>
        {EFFORT_TIERS.map((tier) => {
          const isSelected = thinkingOn && tier === restoreTier;
          return (
            <Ariakit.MenuItemRadio
              key={tier}
              name="reasoningEffort"
              value={tier}
              checked={isSelected}
              disabled={!thinkingOn}
              hideOnClick={true}
              onChange={() => applyEffort(tier)}
              className={cn(
                'group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2',
                'outline-none transition-colors duration-theme-fast',
                'hover:bg-surface-hover data-[active-item]:bg-surface-hover',
                isSelected && 'bg-surface-active-alt',
                !thinkingOn && 'cursor-not-allowed opacity-50',
              )}
            >
              <div className="min-w-0 flex-1 text-left text-sm font-medium text-text-primary">
                {localize(tierLabels[tier])}
              </div>
              {tier === DEFAULT_TIER && (
                <span className="rounded-full bg-surface-tertiary px-2 py-0.5 text-xs text-text-secondary">
                  {localize('com_ui_effort_default_tag')}
                </span>
              )}
              {tier === ReasoningEffort.max && (
                <TriangleAlert
                  className="size-3.5 shrink-0 text-text-secondary"
                  aria-hidden="true"
                />
              )}
              {isSelected && (
                <Check className="size-4 shrink-0 text-text-primary" aria-hidden="true" />
              )}
            </Ariakit.MenuItemRadio>
          );
        })}
        <Ariakit.MenuSeparator className="my-1 h-0 w-full border-t border-border-light" />
        <div className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2">
          <div className="min-w-0 flex-1 text-left">
            <div className="text-sm font-medium text-text-primary">
              {localize('com_ui_thinking_toggle')}
            </div>
            <p className="text-xs text-text-secondary">
              {localize('com_ui_thinking_toggle_description')}
            </p>
          </div>
          <Switch
            checked={thinkingOn}
            onCheckedChange={toggleThinking}
            aria-label={localize('com_ui_thinking_toggle')}
          />
        </div>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}
