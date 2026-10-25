/* eslint-disable i18next/no-literal-string */
import React, { memo, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import * as Ariakit from '@ariakit/react';
import { Check, ChevronDown, ClipboardList, Sparkles, Zap } from 'lucide-react';
import { engineModeFamily, type EngineMode } from '~/store/families';
import { cn } from '~/utils';

interface ModeToggleProps {
  index: string | number | null;
  disabled?: boolean;
}

function ModeToggle({ index, disabled = false }: ModeToggleProps) {
  const [mode, setMode] = useRecoilState(engineModeFamily(index));
  const menuStore = Ariakit.useMenuStore({ focusLoop: true, placement: 'top-end' });
  const isOpen = menuStore.useState('open');

  const handleSelect = useCallback(
    (newMode: EngineMode) => {
      setMode(newMode);
      try {
        localStorage.setItem('claude_engine_mode', newMode);
      } catch {
        // ignore localStorage errors
      }
      menuStore.hide();
    },
    [setMode, menuStore],
  );

  const getLabel = () => {
    switch (mode) {
      case 'spec':
        return 'Spec Mode';
      case 'vibe':
        return 'Vibe Mode';
      case 'auto':
      default:
        return 'Auto';
    }
  };

  const renderIcon = () => {
    switch (mode) {
      case 'spec':
        return <ClipboardList className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />;
      case 'vibe':
        return <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />;
      case 'auto':
      default:
        return <Sparkles className="h-3.5 w-3.5 text-purple-500" aria-hidden="true" />;
    }
  };

  return (
    <Ariakit.MenuProvider store={menuStore}>
      <Ariakit.MenuButton
        disabled={disabled}
        data-testid="mode-toggle-button"
        aria-label={`Engine mode: ${getLabel()}`}
        className={cn(
          'flex items-center gap-1.5 rounded-full border border-border-light/60 px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors',
          'hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary',
          isOpen && 'bg-surface-secondary text-text-primary',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {renderIcon()}
        <span>{getLabel()}</span>
        <ChevronDown
          className={cn('h-3 w-3 text-text-tertiary transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </Ariakit.MenuButton>

      <Ariakit.Menu
        portal={true}
        gutter={8}
        unmountOnHide={true}
        data-testid="mode-toggle-popover"
        className={cn(
          'z-50 flex w-80 flex-col rounded-2xl border border-border-light bg-surface-primary p-2 shadow-xl outline-none',
          'origin-bottom-right transition-[opacity,transform] duration-150 ease-out',
        )}
      >
        <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
          <span>Dual-Mode Engine</span>
          <span className="rounded bg-surface-secondary px-1.5 py-0.5 text-[10px] text-text-tertiary">
            Kiro & Traycer
          </span>
        </div>

        {/* Option: Auto */}
        <Ariakit.MenuItem
          onClick={() => handleSelect('auto')}
          className={cn(
            'flex cursor-pointer items-start gap-2.5 rounded-xl p-2.5 outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover',
            mode === 'auto' && 'bg-surface-hover/50',
          )}
        >
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" aria-hidden="true" />
          <div className="flex flex-1 flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-text-primary">Auto (Classifier)</span>
              <span className="rounded bg-purple-500/10 px-1.5 py-0.2 text-[10px] font-medium text-purple-600 dark:text-purple-400">
                Default
              </span>
            </div>
            <span className="text-xs text-text-secondary">
              Intelligently chooses between Spec Mode and Vibe Mode based on your intent.
            </span>
          </div>
          {mode === 'auto' && (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-text-primary" aria-hidden="true" />
          )}
        </Ariakit.MenuItem>

        {/* Option: Spec Mode */}
        <Ariakit.MenuItem
          onClick={() => handleSelect('spec')}
          className={cn(
            'flex cursor-pointer items-start gap-2.5 rounded-xl p-2.5 outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover',
            mode === 'spec' && 'bg-surface-hover/50',
          )}
        >
          <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
          <div className="flex flex-1 flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-text-primary">Spec Mode</span>
              <span className="rounded bg-blue-500/10 px-1.5 py-0.2 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                Architect
              </span>
            </div>
            <span className="text-xs text-text-secondary">
              Read-only planning. Generates rigorous specifications, architecture, and TDD plans before writing code.
            </span>
          </div>
          {mode === 'spec' && (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-text-primary" aria-hidden="true" />
          )}
        </Ariakit.MenuItem>

        {/* Option: Vibe Mode */}
        <Ariakit.MenuItem
          onClick={() => handleSelect('vibe')}
          className={cn(
            'flex cursor-pointer items-start gap-2.5 rounded-xl p-2.5 outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover',
            mode === 'vibe' && 'bg-surface-hover/50',
          )}
        >
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
          <div className="flex flex-1 flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-text-primary">Vibe Mode</span>
              <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                Rapid Flow
              </span>
            </div>
            <span className="text-xs text-text-secondary">
              Direct implementation. Rapidly creates working code, visual UI components, and animations immediately.
            </span>
          </div>
          {mode === 'vibe' && (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-text-primary" aria-hidden="true" />
          )}
        </Ariakit.MenuItem>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}

export default memo(ModeToggle);
