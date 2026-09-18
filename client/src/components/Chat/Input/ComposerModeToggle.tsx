import { memo } from 'react';
import { useRecoilState } from 'recoil';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';
import store from '~/store';

/**
 * Chat/Cowork segmented toggle. Matches the reference screenshots' composer
 * control exactly (docs/ui-reference/batch-1-screenshots.md); the task list
 * and Devices submenu that Cowork mode reveals below the composer are Fas 7
 * work (see docs/ui-reference/PLAN.md) — this component only owns the mode
 * itself and the attach menu content it drives.
 */
function ComposerModeToggle({ index }: { index: number }) {
  const localize = useLocalize();
  const [mode, setMode] = useRecoilState(store.composerModeFamily(index));

  return (
    <div
      role="radiogroup"
      aria-label={localize('com_ui_composer_mode')}
      className="flex items-center gap-0.5 rounded-full bg-surface-tertiary p-0.5"
    >
      {(['chat', 'cowork'] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={mode === option}
          onClick={() => setMode(option)}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
            mode === option
              ? 'bg-surface-primary text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          {localize(option === 'chat' ? 'com_ui_chat' : 'com_ui_cowork')}
        </button>
      ))}
    </div>
  );
}

export default memo(ComposerModeToggle);
