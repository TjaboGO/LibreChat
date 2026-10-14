/* eslint-disable i18next/no-literal-string */
import React, { memo, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import * as Ariakit from '@ariakit/react';
import { Check, ChevronDown } from 'lucide-react';
import type { TConversation } from 'librechat-data-provider';
import type { SetterOrUpdater } from 'recoil';
import { permissionModeFamily, type PermissionMode } from '~/store/families';
import { cn } from '~/utils';

interface PermissionModePopoverProps {
  index: string | number | null;
  conversation?: TConversation | null;
  setConversation?: SetterOrUpdater<TConversation | null>;
  disabled?: boolean;
}

function PermissionModePopover({
  index,
  conversation: _conversation,
  setConversation,
  disabled = false,
}: PermissionModePopoverProps) {
  const [mode, setMode] = useRecoilState(permissionModeFamily(index));
  const menuStore = Ariakit.useMenuStore({ focusLoop: true, placement: 'top-end' });
  const isOpen = menuStore.useState('open');

  const handleSelect = useCallback(
    (newMode: PermissionMode) => {
      setMode(newMode);
      try {
        localStorage.setItem('claude_permission_mode', newMode);
      } catch {
        // ignore local storage restrictions
      }

      if (setConversation) {
        setConversation((current) => {
          if (!current) {
            return current;
          }
          return {
            ...current,
            codeApprovalMode: newMode === 'manual' ? 'ask' : 'acceptEdits',
          };
        });
      }
      menuStore.hide();
    },
    [setMode, setConversation, menuStore],
  );

  const displayLabel = mode === 'manual' ? 'Manual' : 'Auto';

  return (
    <Ariakit.MenuProvider store={menuStore}>
      <Ariakit.MenuButton
        disabled={disabled}
        data-testid="permission-mode-button"
        aria-label={`Permission mode: ${displayLabel}`}
        className={cn(
          'flex items-center gap-1 rounded-full border border-border-light/60 px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors',
          'hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary',
          isOpen && 'bg-surface-secondary text-text-primary',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span>{displayLabel}</span>
        <ChevronDown
          className={cn('h-3 w-3 text-text-tertiary transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </Ariakit.MenuButton>

      <Ariakit.Menu
        portal={true}
        gutter={8}
        unmountOnHide={true}
        data-testid="permission-mode-popover"
        className={cn(
          'z-50 flex w-72 flex-col rounded-2xl border border-border-light bg-surface-primary p-2 shadow-xl outline-none',
          'origin-bottom-right transition-[opacity,transform] duration-150 ease-out',
        )}
      >
        <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
          Permission mode
        </div>

        {/* Option: Manual */}
        <Ariakit.MenuItem
          onClick={() => handleSelect('manual')}
          className={cn(
            'flex cursor-pointer items-start gap-2.5 rounded-xl p-2.5 outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover',
            mode === 'manual' && 'bg-surface-hover/50',
          )}
        >
          <div className="flex flex-1 flex-col text-left">
            <span className="text-sm font-medium text-text-primary">Manual</span>
            <span className="text-xs text-text-secondary">
              Claude asks before using new tools or opening new sites.
            </span>
          </div>
          {mode === 'manual' && (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-text-primary" aria-hidden="true" />
          )}
        </Ariakit.MenuItem>

        {/* Option: Auto */}
        <Ariakit.MenuItem
          onClick={() => handleSelect('auto')}
          className={cn(
            'flex cursor-pointer items-start gap-2.5 rounded-xl p-2.5 outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover',
            mode === 'auto' && 'bg-surface-hover/50',
          )}
        >
          <div className="flex flex-1 flex-col text-left">
            <span className="text-sm font-medium text-text-primary">Auto</span>
            <span className="text-xs text-text-secondary">
              Claude runs on its own and pauses to ask if anything looks unsafe.
            </span>
          </div>
          {mode === 'auto' && (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-text-primary" aria-hidden="true" />
          )}
        </Ariakit.MenuItem>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}

export default memo(PermissionModePopover);
