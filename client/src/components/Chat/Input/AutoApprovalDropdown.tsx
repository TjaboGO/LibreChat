import React from 'react';
import { useRecoilState } from 'recoil';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Hand, ChevronsRight, TriangleAlert, ChevronDown, Check } from 'lucide-react';
import type { AutoApprovalOption } from '~/store/families';
import { autoApprovalFamily } from '~/store/families';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface AutoApprovalDropdownProps {
  index?: number;
}

export default function AutoApprovalDropdown({ index = 0 }: AutoApprovalDropdownProps) {
  const localize = useLocalize();
  const [approvalMode, setApprovalMode] = useRecoilState<AutoApprovalOption>(
    autoApprovalFamily(index),
  );

  const options: { id: AutoApprovalOption; label: string; icon: React.ElementType }[] = [
    {
      id: 'manual',
      label: localize('com_ui_manually_approve'),
      icon: Hand,
    },
    {
      id: 'auto',
      label: localize('com_ui_automatically_approve'),
      icon: ChevronsRight,
    },
    {
      id: 'skip',
      label: localize('com_ui_skip_all_approvals'),
      icon: TriangleAlert,
    },
  ];

  const currentOption = options.find((o) => o.id === approvalMode) || options[1];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-primary"
        >
          <currentOption.icon className="h-3 w-3 text-text-tertiary" aria-hidden="true" />
          <span>
            {localize('com_ui_auto_approval')}: {currentOption.label}
          </span>
          <ChevronDown className="h-3 w-3 text-text-tertiary" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[210px] rounded-xl border border-border-light bg-surface-primary p-1.5 shadow-lg focus:outline-none"
        >
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = approvalMode === opt.id;
            return (
              <DropdownMenu.Item
                key={opt.id}
                onClick={() => setApprovalMode(opt.id)}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none',
                  isSelected && 'bg-surface-secondary font-medium',
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="h-3 w-3 text-text-primary" />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
