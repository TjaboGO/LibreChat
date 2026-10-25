import { memo, useCallback, useId } from 'react';
import { ChevronDown, Pin } from 'lucide-react';
import { TooltipAnchor } from '@librechat/client';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import type { AppDefinition, SectionDefinition } from 'librechat-data-provider';
import { usePinnedApps } from '~/store/pinnedApps';
import { Collapse } from '~/components/ui';
import { useLocalStorage } from '~/hooks';
import { getAppIcon } from './appIcons';
import { cn } from '~/utils';

export interface AppSectionGroupProps {
  section: SectionDefinition;
  apps: AppDefinition[];
  defaultExpanded?: boolean;
  onAppClick?: (app: AppDefinition) => void;
}

function AppSectionGroup({
  section,
  apps,
  defaultExpanded = true,
  onAppClick,
}: AppSectionGroupProps) {
  const location = useLocation();
  const sectionContentId = useId();
  const { isPinned, togglePin } = usePinnedApps();
  const [isExpanded, setIsExpanded] = useLocalStorage<boolean>(
    `side:app-section:${section.id}`,
    defaultExpanded,
  );

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded, setIsExpanded]);

  const SectionIcon = getAppIcon(section.icon);

  if (!apps || apps.length === 0) {
    return null;
  }

  const sortedApps = [...apps].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col py-1" role="group" aria-label={section.title}>
      {/* Collapsible Section Header */}
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-controls={sectionContentId}
        data-testid={`app-section-header-${section.id}`}
        className="group flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring-primary"
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <SectionIcon className="h-3.5 w-3.5 shrink-0 text-text-tertiary transition-colors group-hover:text-text-primary" />
          <span className="truncate">{section.title}</span>
          {section.badge && (
            <span className="ml-1 inline-flex shrink-0 items-center rounded-full border border-border-light bg-surface-active px-1.5 py-0.5 text-[9px] font-medium normal-case tracking-normal text-text-tertiary group-hover:border-border-medium group-hover:text-text-secondary">
              {section.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-text-tertiary transition-transform duration-200 group-hover:text-text-primary',
            isExpanded ? '' : '-rotate-90',
          )}
          aria-hidden="true"
        />
      </button>

      {/* Collapsible App List */}
      <Collapse open={isExpanded}>
        <div id={sectionContentId} className="flex flex-col gap-0.5 pt-0.5">
          {sortedApps.map((app) => {
            const AppIcon = getAppIcon(app.icon);
            const isActive =
              location.pathname === app.routePath ||
              location.pathname.startsWith(app.routePath + '/');

            const tooltipText = `${app.name} (${app.badge || section.title}) — ${app.tagline}\n${app.description}`;

            return (
              <TooltipAnchor
                key={app.id}
                side="right"
                description={tooltipText}
                render={
                  <RouterNavLink
                    to={app.routePath}
                    data-testid={`app-nav-row-${app.id}`}
                    aria-label={`${app.name}: ${app.tagline}`}
                    onClick={() => onAppClick?.(app)}
                    className={cn(
                      'group relative flex items-center justify-between rounded-lg px-2 py-1 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-surface-active-alt font-semibold text-text-primary shadow-xs'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs transition-colors',
                          app.color || 'border-border-light bg-surface-active text-text-secondary',
                        )}
                      >
                        <AppIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      <span className="truncate text-xs font-medium text-text-primary group-hover:text-text-primary">
                        {app.name}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {app.badge && (
                        <span className="shrink-0 rounded-md border border-border-light bg-surface-tertiary px-1 py-0.5 text-[9px] font-medium text-text-tertiary transition-colors group-hover:border-border-medium group-hover:text-text-secondary">
                          {app.badge}
                        </span>
                      )}
                      <button
                        type="button"
                        data-testid={`pin-toggle-${app.id}`}
                        aria-label={
                          isPinned(app.id)
                            ? `Unpin ${app.name} from Quick Dock`
                            : `Pin ${app.name} to Quick Dock`
                        }
                        title={isPinned(app.id) ? 'Unpin from Quick Dock' : 'Pin to Quick Dock'}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          togglePin(app.id);
                        }}
                        className={cn(
                          'rounded p-0.5 transition-all focus:opacity-100',
                          isPinned(app.id)
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-text-tertiary opacity-0 group-hover:opacity-100 hover:text-amber-500',
                        )}
                      >
                        <Pin
                          className={cn(
                            'h-3.5 w-3.5',
                            isPinned(app.id) && 'fill-amber-500',
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </RouterNavLink>
                }
              />
            );
          })}
        </div>
      </Collapse>
    </div>
  );
}

export default memo(AppSectionGroup);
