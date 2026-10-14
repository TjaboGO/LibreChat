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
    <div className="mb-2 flex w-full select-none items-center justify-between text-xs">
      <div className="flex items-center gap-1.5">
        <WordCountPopover text={text} />

        <button
          type="button"
          onClick={onOptimizePrompt}
          className="shadow-2xs flex items-center gap-1.5 rounded-full border border-border-light/70 bg-surface-primary/90 px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
          title="Optimize prompt structure"
        >
          <Sparkles className="h-3 w-3 text-amber-500" aria-hidden="true" />
          <span>{localize('com_ui_optimize')}</span>
        </button>

        <UsageLimitPopover />
      </div>

      {onToggleCollapse && (
        <div className="shadow-2xs flex items-center gap-0.5 rounded-full border border-border-light/70 bg-surface-primary/90 p-0.5">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-secondary"
            aria-label={isCollapsed ? 'Expand composer' : 'Collapse composer'}
          >
            {isCollapsed ? (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
