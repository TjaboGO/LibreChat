import { memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, TooltipAnchor } from '@librechat/client';
import {
  Activity,
  Calendar,
  Compass,
  Cpu,
  Layers,
  Search,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  getAppDefinition,
  getDefaultApp,
  APP_SECTIONS,
  type AppSection,
} from 'librechat-data-provider';
import { getAppIcon } from '~/components/UnifiedSidebar/appIcons';
import { useConversationsInfiniteQuery } from '~/data-provider';
import { useAuthContext } from '~/hooks';
import { cn } from '~/utils';

const SECTION_FILTERS: Array<{ id: AppSection | 'all'; label: string; icon: any }> = [
  { id: 'all', label: 'All Activity', icon: Activity },
  { id: 'core', label: 'Core Apps', icon: Sparkles },
  { id: 'agents', label: 'Autonomous Agents', icon: Cpu },
  { id: 'builders', label: 'Builders', icon: Layers },
  { id: 'research', label: 'Research', icon: Compass },
];

function AllActivityTimeline() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const [selectedSection, setSelectedSection] = useState<AppSection | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useConversationsInfiniteQuery(
      {
        sortBy: 'updatedAt',
        sortDirection: 'desc',
        search: searchQuery.trim() || undefined,
      },
      {
        enabled: isAuthenticated,
      },
    );

  const allConversations = useMemo(() => {
    return data ? data.pages.flatMap((page) => page.conversations) : [];
  }, [data]);

  const filteredConversations = useMemo(() => {
    if (selectedSection === 'all') {
      return allConversations;
    }
    return allConversations.filter((c) => {
      const app = c.appId ? getAppDefinition(c.appId) : getDefaultApp();
      return app?.section === selectedSection;
    });
  }, [allConversations, selectedSection]);

  const groupedConversations = useMemo(() => {
    const today: typeof filteredConversations = [];
    const yesterday: typeof filteredConversations = [];
    const previousWeek: typeof filteredConversations = [];
    const older: typeof filteredConversations = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const weekStart = todayStart - 7 * 86400000;

    for (const convo of filteredConversations) {
      const time = new Date(convo.updatedAt).getTime();
      if (time >= todayStart) {
        today.push(convo);
      } else if (time >= yesterdayStart) {
        yesterday.push(convo);
      } else if (time >= weekStart) {
        previousWeek.push(convo);
      } else {
        older.push(convo);
      }
    }

    return [
      { label: 'Today', items: today },
      { label: 'Yesterday', items: yesterday },
      { label: 'Previous 7 Days', items: previousWeek },
      { label: 'Older Sessions', items: older },
    ].filter((g) => g.items.length > 0);
  }, [filteredConversations]);

  return (
    <div
      data-testid="all-activity-timeline"
      className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto bg-surface-primary p-6 md:p-10"
    >
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 border-b border-border-light pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-amber-500" aria-hidden="true" />
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                All Activity Timeline
              </h1>
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              Chronological overview of all sessions and agent runs across your 22 specialized tools.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/c/new')}
            className="inline-flex items-center justify-center rounded-lg bg-surface-active px-3 py-1.5 text-xs font-semibold text-text-primary shadow-2xs transition-colors hover:bg-surface-hover"
          >
            Start New Session
          </button>
        </div>

        {/* Section Tabs & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border-light bg-surface-secondary/40 p-1">
            {SECTION_FILTERS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-testid={`activity-tab-${tab.id}`}
                  onClick={() => setSelectedSection(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-surface-primary text-text-primary shadow-2xs font-semibold'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  <TabIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="w-full rounded-lg border border-border-light bg-surface-secondary/40 py-1.5 pl-8 pr-3 text-xs text-text-primary transition-colors placeholder:text-text-tertiary focus:border-border-heavy focus:outline-none"
            />
          </div>
        </div>

        {/* Timeline Content */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner className="text-text-primary" />
          </div>
        ) : groupedConversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-light p-12 text-center">
            <Activity className="mx-auto h-8 w-8 text-text-tertiary" />
            <h3 className="mt-2 text-sm font-semibold text-text-primary">No activity found</h3>
            <p className="mt-1 text-xs text-text-secondary">
              {searchQuery
                ? 'No sessions match your search query.'
                : 'Start a conversation in any app to see it in your global timeline.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedConversations.map((group) => (
              <div key={group.label} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{group.label}</span>
                  <span className="text-[10px] text-text-tertiary/70">
                    ({group.items.length})
                  </span>
                </div>

                <div className="space-y-2">
                  {group.items.map((convo) => {
                    const app = convo.appId ? getAppDefinition(convo.appId) : getDefaultApp();
                    const appDef = app || getDefaultApp();
                    const AppIcon = getAppIcon(appDef.icon);
                    const section = APP_SECTIONS[appDef.section];

                    const targetUrl = convo.appId
                      ? `/app/${convo.appId}/${convo.conversationId}`
                      : `/c/${convo.conversationId}`;

                    return (
                      <div
                        key={convo.conversationId}
                        data-testid={`activity-convo-row-${convo.conversationId}`}
                        onClick={() => navigate(targetUrl)}
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-border-light bg-surface-secondary/30 p-3.5 transition-all hover:border-border-medium hover:bg-surface-hover hover:shadow-2xs"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs',
                              appDef.color ||
                                'border-border-light bg-surface-active text-text-secondary',
                            )}
                          >
                            <AppIcon className="h-4 w-4" aria-hidden="true" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-semibold text-text-primary group-hover:text-text-primary">
                                {convo.title || 'Untitled Session'}
                              </span>
                              <span className="hidden sm:inline-flex shrink-0 items-center rounded-md border border-border-light bg-surface-tertiary px-1.5 py-0.5 text-[9px] font-medium text-text-tertiary">
                                {appDef.name}
                              </span>
                              {section && (
                                <span className="hidden md:inline-flex shrink-0 items-center text-[9px] text-text-tertiary">
                                  • {section.title}
                                </span>
                              )}
                            </div>
                            <p className="truncate text-xs text-text-tertiary">
                              {appDef.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 pl-2">
                          <span className="text-[11px] text-text-tertiary">
                            {new Date(convo.updatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <TooltipAnchor
                            description="Open Session"
                            render={
                              <button
                                type="button"
                                aria-label="Open Session"
                                className="rounded p-1 text-text-tertiary opacity-0 transition-opacity hover:bg-surface-active hover:text-text-primary group-hover:opacity-100"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </button>
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {hasNextPage && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-lg border border-border-light bg-surface-secondary px-4 py-2 text-xs font-semibold text-text-primary transition-colors hover:bg-surface-hover disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'Loading more...' : 'Load More Sessions'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(AllActivityTimeline);
