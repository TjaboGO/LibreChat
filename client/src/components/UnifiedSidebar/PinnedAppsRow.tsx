import { memo, useCallback } from 'react';
import { TooltipAnchor } from '@librechat/client';
import { ChevronDown, Pin, X } from 'lucide-react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { usePinnedApps } from '~/store/pinnedApps';
import { Collapse } from '~/components/ui';
import { useLocalStorage } from '~/hooks';
import { getAppIcon } from './appIcons';
import { cn } from '~/utils';

function PinnedAppsRow() {
  const location = useLocation();
  const { pinnedApps, unpinApp } = usePinnedApps();
  const [isExpanded, setIsExpanded] = useLocalStorage<boolean>(
    'side:pinned-dock-expanded',
    true,
  );

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, [setIsExpanded]);

  if (!pinnedApps) {
    return null;
  }

  return (
    <div
      className="flex flex-col py-1"
      role="region"
      aria-label="Pinned Apps Quick Dock"
      data-testid="pinned-apps-dock"
    >
      {/* Header with Pin Icon & Count */}
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        data-testid="pinned-apps-header"
        className="group flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring-primary"
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <Pin className="h-3.5 w-3.5 shrink-0 fill-amber-500/20 text-amber-500 transition-colors" />
          <span className="truncate">Quick Dock</span>
          <span className="ml-1 inline-flex shrink-0 items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium normal-case tracking-normal text-amber-600 dark:text-amber-400">
            {pinnedApps.length} Pinned
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-text-tertiary transition-transform duration-200 group-hover:text-text-primary',
            isExpanded ? '' : '-rotate-90',
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dock Content */}
      <Collapse open={isExpanded}>
        <div className="pt-1">
          {pinnedApps.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border-light px-3 py-2 text-center text-xs text-text-tertiary">
              Hover over any app and click the pin icon to add it here.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {pinnedApps.map((app) => {
                const AppIcon = getAppIcon(app.icon);
                const isActive =
                  location.pathname === app.routePath ||
                  location.pathname.startsWith(app.routePath + '/');

                const tooltipText = `${app.name} (${app.badge || 'App'}) — ${app.tagline}`;
                const compactName = app.name.replace(/^(?:Claude|ChatGPT|xAI|Cognition)\s+/i, '');

                return (
                  <TooltipAnchor
                    key={app.id}
                    side="top"
                    description={tooltipText}
                    render={
                      <RouterNavLink
                        to={app.routePath}
                        data-testid={`pinned-app-dock-${app.id}`}
                        aria-label={`${app.name}: ${app.tagline}`}
                        className={cn(
                          'group relative flex items-center justify-between gap-1.5 rounded-lg border border-border-light/70 bg-surface-secondary/40 px-2 py-1.5 text-xs font-medium transition-all hover:border-border-medium hover:bg-surface-hover hover:text-text-primary',
                          isActive
                            ? 'border-border-heavy bg-surface-active font-semibold text-text-primary shadow-2xs'
                            : 'text-text-secondary',
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                          <div
                            className={cn(
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] transition-colors',
                              app.color || 'border-border-light bg-surface-active text-text-secondary',
                            )}
                          >
                            <AppIcon className="h-3 w-3" aria-hidden="true" />
                          </div>
                          <span className="truncate text-xs font-medium text-text-primary">
                            {compactName}
                          </span>
                        </div>

                        <button
                          type="button"
                          aria-label={`Unpin ${app.name}`}
                          title="Unpin from Quick Dock"
                          data-testid={`unpin-btn-${app.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            unpinApp(app.id);
                          }}
                          className="shrink-0 rounded p-0.5 text-text-tertiary opacity-0 transition-opacity hover:bg-surface-active hover:text-text-primary group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </RouterNavLink>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
}

export default memo(PinnedAppsRow);
