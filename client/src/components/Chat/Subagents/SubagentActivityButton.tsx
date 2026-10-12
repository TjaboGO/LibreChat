import { memo, useMemo, useCallback } from 'react';
import { useAtom } from 'jotai';
import { Users } from 'lucide-react';
import { Button, TooltipAnchor } from '@librechat/client';
import { durableSubagentSelection, eventSubagentSelection } from './eventSelection';
import { activeSubagentPanel, type ActiveSubagentPanel } from './state';
import { useParentSubagents } from './ParentSubagentsProvider';
import { useChatContext } from '~/Providers';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

/**
 * Live indicator for this conversation's subagent activity — renamed from
 * "CoworkButton": nothing in the reference screenshots shows a header button
 * called Cowork opening this panel. Real Cowork is a composer-level mode
 * (see ComposerModeToggle) with its own task list; this stays a plain
 * "Subagents" indicator until Fas 7 folds subagent activity into that task
 * list properly (see docs/ui-reference/PLAN.md).
 */
function SubagentActivityButton() {
  const localize = useLocalize();
  const { conversation } = useChatContext();
  const conversationId = conversation?.conversationId ?? '';
  const { byThreadId } = useParentSubagents();
  const [currentPanel, setSelection] = useAtom(activeSubagentPanel);

  const subagents = useMemo(() => Array.from(byThreadId.values()), [byThreadId]);
  const activeCount = useMemo(
    () => subagents.filter((s) => s.status === 'running' || s.status === 'dispatched').length,
    [subagents],
  );
  const totalCount = subagents.length;

  const isPanelOpen = useMemo(() => {
    return (
      currentPanel != null &&
      currentPanel.host === 'conversation' &&
      currentPanel.parentConversationId === conversationId
    );
  }, [currentPanel, conversationId]);

  const handleClick = useCallback(() => {
    if (isPanelOpen) {
      setSelection(null);
      return;
    }

    if (subagents.length === 0) {
      return;
    }

    // Select the most recently updated or active subagent
    const target = subagents.find((s) => s.status === 'running') ?? subagents[0];

    if (!target) return;

    const taskId = target.latestTaskId ?? target.tasks?.[0]?.taskId;
    let panel: ActiveSubagentPanel | null;
    if (target.origin === 'event') {
      panel = eventSubagentSelection(conversationId, target);
    } else if (taskId) {
      panel = durableSubagentSelection(conversationId, target, taskId);
    } else {
      panel = null;
    }

    if (panel) {
      setSelection(panel);
    }
  }, [isPanelOpen, subagents, conversationId, setSelection]);

  if (totalCount === 0) {
    return null;
  }

  return (
    <TooltipAnchor
      description={
        isPanelOpen
          ? localize('com_ui_subagents_close_panel')
          : localize('com_ui_subagents_open_panel')
      }
      render={
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          aria-label={localize('com_ui_subagents_activity_stream')}
          className={cn(
            'flex h-9 items-center gap-1.5 rounded-xl border border-border-light px-3 py-1.5 text-xs font-medium text-text-primary transition-colors',
            isPanelOpen
              ? 'shadow-xs border-surface-submit bg-surface-active text-text-primary'
              : 'bg-presentation hover:bg-surface-active-alt',
          )}
        >
          <Users className="h-4 w-4 text-surface-submit" />
          <span className="font-semibold">{localize('com_ui_subagents')}</span>
          <span
            className={cn(
              'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white',
              activeCount > 0 ? 'animate-pulse bg-surface-submit' : 'bg-text-secondary',
            )}
          >
            {activeCount > 0 ? activeCount : totalCount}
          </span>
        </Button>
      }
    />
  );
}

export default memo(SubagentActivityButton);
