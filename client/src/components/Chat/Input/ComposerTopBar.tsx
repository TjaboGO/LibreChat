import React from 'react';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import UsageLimitPopover from './UsageLimitPopover';
import WordCountPopover from './WordCountPopover';
import { useLocalize } from '~/hooks';

interface ComposerTopBarProps {
  text: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOptimizePrompt?: () => void;
}

export default function ComposerTopBar({
  text,
  isCollapsed = false,
  onToggleCollapse,
  onOptimizePrompt,
}: ComposerTopBarProps) {
  const localize = useLocalize();

  return (
    <div className="flex items-center justify-between border-b border-border-light/40 px-3 py-1.5 text-xs">
      <div className="flex items-center gap-1.5">
        <WordCountPopover text={text} />

        <span className="text-text-tertiary/40">·</span>

        <button
          type="button"
          onClick={onOptimizePrompt}
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-secondary"
          title="Optimize prompt structure"
        >
          <Sparkles className="h-3 w-3 text-amber-500" aria-hidden="true" />
          <span>{localize('com_ui_optimize')}</span>
        </button>

        <span className="text-text-tertiary/40">·</span>

        <UsageLimitPopover />
      </div>

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-secondary"
          aria-label={isCollapsed ? 'Expand composer' : 'Collapse composer'}
        >
          {isCollapsed ? (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
