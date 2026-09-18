/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import * as Ariakit from '@ariakit/react';
import {
  Timer,
  Clock,
  GitPullRequest,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  Play,
  ArrowUpDown,
} from 'lucide-react';
import { cn } from '~/utils';

interface RoutineTemplate {
  id: string;
  title: string;
  description: string;
  trigger: string;
  triggerType: 'clock' | 'git';
  icon: React.ReactNode;
}

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'rt-1',
    title: 'Briefing',
    description: 'Summarizes repository activity, open pull requests, and failing CI runs.',
    trigger: 'Weekdays at 9:00 AM',
    triggerType: 'clock',
    icon: <Clock className="h-4 w-4 text-orange-600" />,
  },
  {
    id: 'rt-2',
    title: 'Email triage',
    description: 'Sorts notifications, labels urgent items, and drafts suggested replies.',
    trigger: 'Weekdays at 8:30 AM',
    triggerType: 'clock',
    icon: <Clock className="h-4 w-4 text-amber-600" />,
  },
  {
    id: 'rt-3',
    title: 'System health check',
    description: 'Verifies API endpoint latencies, container memory usage, and error logs.',
    trigger: 'Daily at midnight',
    triggerType: 'clock',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  },
  {
    id: 'rt-4',
    title: 'Issue triage',
    description: 'Labels new GitHub issues, attempts reproduction, and pings relevant code owners.',
    trigger: 'Weekdays at 10:00 AM',
    triggerType: 'clock',
    icon: <Clock className="h-4 w-4 text-blue-600" />,
  },
  {
    id: 'rt-5',
    title: 'PR review digest',
    description:
      'Inspects open pull requests, flags missing tests, and summarizes architecture impact.',
    trigger: 'Weekdays at 4:30 PM',
    triggerType: 'clock',
    icon: <GitPullRequest className="h-4 w-4 text-purple-600" />,
  },
  {
    id: 'rt-6',
    title: 'Dependency update check',
    description: 'Audits npm and cargo lockfiles for CVE advisories and major version bumps.',
    trigger: 'Every Monday at 9:00 AM',
    triggerType: 'clock',
    icon: <Clock className="h-4 w-4 text-orange-600" />,
  },
  {
    id: 'rt-7',
    title: 'Release notes drafter',
    description: 'Compiles merged PR descriptions into semantic release notes and changelogs.',
    trigger: 'Triggered by pull request closed',
    triggerType: 'git',
    icon: <GitPullRequest className="h-4 w-4 text-emerald-600" />,
  },
  {
    id: 'rt-8',
    title: 'Flaky test tracker',
    description:
      'Analyzes test suites over the last 50 runs to detect intermittent failure patterns.',
    trigger: 'Every Monday at 8:00 AM',
    triggerType: 'clock',
    icon: <Clock className="h-4 w-4 text-rose-600" />,
  },
];

interface ActiveRoutine {
  id: string;
  title: string;
  schedule: string;
  mode: 'Local' | 'Cloud';
  lastRun: string;
  status: 'active' | 'paused';
}

export default function CodeRoutinesView() {
  const [activeTab, setActiveTab] = useState<'yours' | 'templates'>('yours');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRoutines, setUserRoutines] = useState<ActiveRoutine[]>([]);

  const handleCreateRoutine = (mode: 'Local' | 'Cloud', templateTitle?: string) => {
    const newRoutine: ActiveRoutine = {
      id: `routine-${Date.now()}`,
      title: templateTitle || 'Custom Routine',
      schedule: 'Daily at 9:00 AM',
      mode,
      lastRun: 'Never',
      status: 'active',
    };
    setUserRoutines((prev) => [newRoutine, ...prev]);
    setActiveTab('yours');
  };

  const filteredTemplates = ROUTINE_TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-presentation text-text-primary">
      {/* HEADER */}
      <header className="border-b border-border-light bg-presentation px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-text-primary">
            Routines
          </h1>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="h-8 w-44 rounded-lg border border-border-light bg-surface-secondary/50 pl-8 pr-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-surface-primary text-text-secondary hover:bg-surface-secondary"
              aria-label="Filter routines"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-surface-primary text-text-secondary hover:bg-surface-secondary"
              aria-label="Sort routines"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>

            {/* New Routine Dropdown */}
            <Ariakit.MenuProvider>
              <Ariakit.MenuButton
                className="flex items-center gap-1.5 rounded-full bg-text-primary px-3.5 py-1.5 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
                aria-label="New routine"
              >
                <span>New routine</span>
                <ChevronDown className="h-3 w-3" />
              </Ariakit.MenuButton>
              <Ariakit.Menu
                portal
                gutter={6}
                className="z-[150] min-w-36 rounded-xl border border-border-light bg-surface-primary p-1 text-text-primary shadow-lg"
              >
                <Ariakit.MenuItem
                  onClick={() => handleCreateRoutine('Local')}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs hover:bg-surface-secondary"
                >
                  <span>Local</span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleCreateRoutine('Cloud')}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs hover:bg-surface-secondary"
                >
                  <span>Cloud</span>
                </Ariakit.MenuItem>
              </Ariakit.Menu>
            </Ariakit.MenuProvider>
          </div>
        </div>

        {/* TABS */}
        <div className="mx-auto mt-4 flex max-w-6xl items-center gap-6 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('yours')}
            className={cn(
              'pb-2 font-medium transition-colors',
              activeTab === 'yours'
                ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                : 'text-text-tertiary hover:text-text-primary',
            )}
          >
            Yours ({userRoutines.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={cn(
              'pb-2 font-medium transition-colors',
              activeTab === 'templates'
                ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                : 'text-text-tertiary hover:text-text-primary',
            )}
          >
            Templates
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {activeTab === 'yours' && userRoutines.length === 0 && (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-secondary text-text-tertiary">
              <Timer className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-text-primary">No routines yet.</h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
              Routines automate recurrent tasks on a schedule or trigger.
            </p>

            {/* DASHED DIVIDER */}
            <div className="my-10 w-full border-t border-dashed border-border-medium" />

            {/* STARTER TEMPLATES PREVIEW */}
            <div className="w-full text-left">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Starter Templates
              </h4>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {ROUTINE_TEMPLATES.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="shadow-xs flex flex-col justify-between rounded-xl border border-border-light bg-surface-primary p-4 transition-colors hover:border-border-medium"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary">
                          {t.icon}
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-text-primary">{t.title}</h5>
                          <span className="text-[11px] text-text-tertiary">{t.trigger}</span>
                        </div>
                      </div>
                      <p className="mt-2.5 text-xs leading-relaxed text-text-secondary">
                        {t.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-end border-t border-border-light/60 pt-3">
                      <button
                        type="button"
                        onClick={() => handleCreateRoutine('Local', t.title)}
                        className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-primary px-3 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Use template</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'yours' && userRoutines.length > 0 && (
          /* USER ROUTINES LIST */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {userRoutines.map((routine) => (
              <div
                key={routine.id}
                className="shadow-xs flex flex-col justify-between rounded-xl border border-border-light bg-surface-primary p-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                        <Timer className="h-4 w-4" />
                      </div>
                      <h4 className="text-xs font-semibold text-text-primary">{routine.title}</h4>
                    </div>
                    <span className="rounded bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                      {routine.mode}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
                    <Clock className="h-3.5 w-3.5 text-text-tertiary" />
                    <span>{routine.schedule}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border-light/60 pt-3 text-[11px]">
                  <span className="text-text-tertiary">Last run: {routine.lastRun}</span>
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-orange-700"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Run now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          /* TEMPLATES FULL GRID */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                className="shadow-xs flex flex-col justify-between rounded-xl border border-border-light bg-surface-primary p-4 transition-colors hover:border-border-medium"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary">
                      {t.icon}
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-text-primary">{t.title}</h5>
                      <span className="text-[11px] text-text-tertiary">{t.trigger}</span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-text-secondary">
                    {t.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end border-t border-border-light/60 pt-3">
                  <button
                    type="button"
                    onClick={() => handleCreateRoutine('Local', t.title)}
                    className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-primary px-3 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Use template</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
