/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useGetUserBalance, useGetStartupConfig } from '~/data-provider';
import { useAuthContext } from '~/hooks/AuthContext';
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
  countdownText: propCountdownText,
  fiveHourUsage: propFiveHourUsage,
  resetsIn: propResetsIn,
  sevenDayUsage: propSevenDayUsage,
  sevenDayResets: propSevenDayResets,
}: UsageLimitPopoverProps) {
  const localize = useLocalize();
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.balance?.enabled,
  });

  const balance = balanceQuery.data;
  const isBalanceEnabled = startupConfig?.balance?.enabled;

  const countdownText =
    propCountdownText ??
    (isBalanceEnabled && balance != null
      ? `${Math.round(balance.tokenCredits / 1000)}k`
      : 'Active');

  let defaultFiveHourUsage = 'Active';
  if (isBalanceEnabled && balance != null) {
    defaultFiveHourUsage = balance.tokenCredits > 50000 ? 'Normal' : 'Low';
  }
  const fiveHourUsage = propFiveHourUsage ?? defaultFiveHourUsage;

  let defaultResetsIn = 'Direct billing';
  if (isBalanceEnabled && balance?.autoRefillEnabled) {
    defaultResetsIn = `${balance.refillIntervalValue ?? 1} ${balance.refillIntervalUnit ?? 'day'}`;
  }
  const resetsIn = propResetsIn ?? defaultResetsIn;

  let defaultSevenDayUsage = 'Pay-per-token';
  if (isBalanceEnabled && balance != null) {
    defaultSevenDayUsage = `${new Intl.NumberFormat().format(Math.round(balance.tokenCredits))} tokens`;
  }
  const sevenDayUsage = propSevenDayUsage ?? defaultSevenDayUsage;

  let defaultSevenDayResets = 'OpenRouter';
  if (isBalanceEnabled) {
    defaultSevenDayResets = balance?.autoRefillEnabled ? 'Active refill' : 'Manual';
  }
  const sevenDayResets = propSevenDayResets ?? defaultSevenDayResets;

  const metrics = [
    { label: localize('com_ui_five_hour_usage') || '5-hour usage', value: fiveHourUsage },
    { label: localize('com_ui_resets_in') || 'Resets in', value: resetsIn },
    { label: localize('com_ui_seven_day_usage') || 'Available quota', value: sevenDayUsage },
    { label: localize('com_ui_seven_day_resets') || 'Gateway mode', value: sevenDayResets },
    { label: localize('com_ui_refreshed') || 'Refreshed', value: 'Just now' },
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
