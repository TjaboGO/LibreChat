/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface UsageLimitPopoverProps {
  countdownText?: string;
  fiveHourUsage?: string;
  resetsIn?: string;
  sevenDayUsage?: string;
  sevenDayResets?: string;
}

export default function UsageLimitPopover({
  countdownText = '34m',
  fiveHourUsage = 'Normal',
  resetsIn = '34 min',
  sevenDayUsage = 'Active',
  sevenDayResets = 'In 3 days',
}: UsageLimitPopoverProps) {
  const localize = useLocalize();
  const [open, setOpen] = useState(false);

  const metrics = [
    { label: localize('com_ui_five_hour_usage'), value: fiveHourUsage },
    { label: localize('com_ui_resets_in'), value: resetsIn },
    { label: localize('com_ui_seven_day_usage'), value: sevenDayUsage },
    { label: localize('com_ui_seven_day_resets'), value: sevenDayResets },
    {
      label: localize('com_ui_refreshed'),
      value: localize('com_ui_refreshed') ? 'Just now' : 'Just now',
    },
  ];

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
            open
              ? 'bg-surface-tertiary text-text-primary'
              : 'text-text-tertiary hover:bg-surface-secondary hover:text-text-secondary',
          )}
          aria-label="Usage limit countdown"
        >
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span>{countdownText}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="center"
          side="top"
          sideOffset={6}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="z-50 w-60 rounded-xl border border-border-light bg-surface-primary p-3 shadow-lg focus:outline-none"
        >
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
            Usage Limits
          </div>
          <div className="flex flex-col divide-y divide-border-light text-xs text-text-primary">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center justify-between py-1.5',
                  idx === 0 && 'pt-0',
                  idx === metrics.length - 1 && 'pb-0',
                )}
              >
                <span className="text-text-secondary">{m.label}</span>
                <span className="font-medium tabular-nums text-text-primary">{m.value}</span>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
