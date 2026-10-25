import { memo } from 'react';
import { SquarePen } from 'lucide-react';
import { TooltipAnchor } from '@librechat/client';
import useCurrentApp from '~/hooks/useCurrentApp';
import { cn } from '~/utils';

function AppHeaderBadge() {
  const {
    app,
    section,
    isSpecializedApp,
    icon: AppIcon,
    name,
    badge,
    tagline,
    description,
    color,
    capabilities,
    startNewAppChat,
  } = useCurrentApp();

  if (!isSpecializedApp) {
    return null;
  }

  const tooltipContent = `${name} (${badge || section.title}) — ${tagline}\n${description}\nCapabilities: ${capabilities.join(', ')}`;

  return (
    <div
      data-testid="app-header-scope-badge"
      className="flex items-center gap-1.5 rounded-lg border border-border-light/80 bg-surface-secondary/60 px-2 py-1 shadow-2xs transition-colors hover:border-border-medium hover:bg-surface-hover"
    >
      <TooltipAnchor
        side="bottom"
        description={tooltipContent}
        render={
          <div className="flex cursor-default items-center gap-2">
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs transition-colors',
                color || 'border-border-light bg-surface-active text-text-secondary',
              )}
            >
              <AppIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </div>

            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-xs font-semibold text-text-primary">
                {name}
              </span>
              {badge && (
                <span className="hidden sm:inline-flex shrink-0 items-center rounded-full border border-border-light bg-surface-tertiary px-1.5 py-0.5 text-[9px] font-medium text-text-tertiary">
                  {badge}
                </span>
              )}
            </div>
          </div>
        }
      />

      <div className="h-3.5 w-[1px] bg-border-light" />

      <TooltipAnchor
        side="bottom"
        description={`New ${name} Session`}
        render={
          <button
            type="button"
            data-testid="new-app-session-btn"
            aria-label={`New ${name} Session`}
            onClick={startNewAppChat}
            className="flex h-5 w-5 items-center justify-center rounded p-0.5 text-text-tertiary transition-colors hover:bg-surface-active hover:text-text-primary"
          >
            <SquarePen className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        }
      />
    </div>
  );
}

export default memo(AppHeaderBadge);
