/* eslint-disable i18next/no-literal-string */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Terminal,
  Folder,
  GitBranch,
  CornerDownLeft,
  Plus,
  Mic,
  Bot,
  ArrowUpRight,
  Clock,
  FileCode,
} from 'lucide-react';
import {
  useGetUserBalance,
  useGetStartupConfig,
  useConversationsInfiniteQuery,
} from '~/data-provider';
import CodePromptsChainsModal from './CodePromptsChainsModal';
import { useAuthContext } from '~/hooks/AuthContext';
import CodeFoldersModal from './CodeFoldersModal';
import { cn } from '~/utils';

export default function CodeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const { data: convosData } = useConversationsInfiniteQuery();
  const balanceQuery = useGetUserBalance({
    enabled: startupConfig?.balance?.enabled,
  });

  const [activeStatTab, setActiveStatTab] = useState<'overview' | 'models'>('overview');
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '7d'>('30d');
  const [taskInput, setTaskInput] = useState('');
  const [worktreeChecked, setWorktreeChecked] = useState(false);
  const [showFoldersModal, setShowFoldersModal] = useState(false);
  const [showPromptsModal, setShowPromptsModal] = useState(false);

  const allConversations = useMemo(() => {
    return convosData?.pages?.flatMap((page) => page.conversations) ?? [];
  }, [convosData]);

  const totalSessions = allConversations.length;
  const totalMessages = allConversations.reduce((sum, c) => sum + (c.messages?.length || 2), 0);

  const tokenCredits = balanceQuery.data?.tokenCredits;
  const totalTokensDisplay = useMemo(() => {
    if (tokenCredits != null) {
      if (tokenCredits > 1_000_000) {
        return `${(tokenCredits / 1_000_000).toFixed(2)}M`;
      }
      return `${(tokenCredits / 1_000).toFixed(1)}k`;
    }
    const estimated = Math.max(0, totalSessions * 1800);
    if (estimated > 1_000_000) {
      return `${(estimated / 1_000_000).toFixed(2)}M`;
    }
    return `${(estimated / 1_000).toFixed(1)}k`;
  }, [tokenCredits, totalSessions]);

  const activeDaysCount = useMemo(() => {
    const daySet = new Set(
      allConversations
        .map((c) => (c.updatedAt ? new Date(c.updatedAt).toDateString() : ''))
        .filter(Boolean),
    );
    return Math.max(daySet.size, totalSessions > 0 ? 1 : 0);
  }, [allConversations, totalSessions]);

  const peakHour = useMemo(() => {
    if (allConversations.length === 0) {
      return '12:00 PM';
    }
    const hourCounts: Record<number, number> = {};
    for (const c of allConversations) {
      if (c.updatedAt) {
        const h = new Date(c.updatedAt).getHours();
        hourCounts[h] = (hourCounts[h] || 0) + 1;
      }
    }
    const peak = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    if (!peak) {
      return '2:00 PM';
    }
    const hourNum = parseInt(peak[0], 10);
    const suffix = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:00 ${suffix}`;
  }, [allConversations]);

  const favoriteModel = useMemo(() => {
    if (allConversations.length > 0) {
      const counts: Record<string, number> = {};
      for (const c of allConversations) {
        if (c.model) {
          counts[c.model] = (counts[c.model] || 0) + 1;
        }
      }
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (sorted[0]) {
        return sorted[0][0];
      }
    }
    return (
      startupConfig?.modelSpecs?.list?.[0]?.name ||
      startupConfig?.defaultModel ||
      'DeepSeek Reasoner'
    );
  }, [allConversations, startupConfig]);

  const heatmapCells = useMemo(() => {
    const dayCounts = new Map<string, number>();
    for (const c of allConversations) {
      if (c.updatedAt) {
        const d = new Date(c.updatedAt).toISOString().slice(0, 10);
        dayCounts.set(d, (dayCounts.get(d) || 0) + 1);
      }
    }

    const today = new Date();
    return Array.from({ length: 112 }).map((_, idx) => {
      const dayOffset = 111 - idx;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - dayOffset);
      const key = targetDate.toISOString().slice(0, 10);
      const count = dayCounts.get(key) || 0;
      let activityLevel = 0;
      if (count === 1) {
        activityLevel = 1;
      } else if (count === 2) {
        activityLevel = 2;
      } else if (count >= 3) {
        activityLevel = 3;
      }
      return { idx, date: key, activityLevel };
    });
  }, [allConversations]);

  const firstName = user?.name?.split(' ')[0] || user?.username || 'Developer';

  const handleStartTask = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!taskInput.trim()) {
      return;
    }
    // Navigate to chat with prompt
    navigate('/c/new');
  };

  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-presentation px-6 py-8 text-text-primary">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        {/* TOP BAR EXTRAS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600">
              <Terminal className="h-3.5 w-3.5" />
              <span>Claude Code</span>
            </span>
          </div>
          <a
            href="https://claude.ai/changelog"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-text-tertiary transition-colors hover:text-text-primary"
          >
            <span>What&apos;s new</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        {/* GREETING */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
            <Flame className="h-6 w-6 fill-current" />
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-text-primary">
            What&apos;s up next, {firstName}?
          </h1>
        </div>

        {/* ANALYTICS WIDGET */}
        <div className="shadow-xs rounded-2xl border border-border-light bg-surface-primary p-6">
          {/* HEADER ROW */}
          <div className="flex items-center justify-between border-b border-border-light pb-4">
            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => setActiveStatTab('overview')}
                className={cn(
                  'font-medium transition-colors',
                  activeStatTab === 'overview'
                    ? 'font-semibold text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary',
                )}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveStatTab('models')}
                className={cn(
                  'font-medium transition-colors',
                  activeStatTab === 'models'
                    ? 'font-semibold text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary',
                )}
              >
                Models
              </button>
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-surface-secondary/70 p-0.5 text-[11px]">
              {(['all', '30d', '7d'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={cn(
                    'rounded-md px-2.5 py-0.5 font-medium transition-colors',
                    timeRange === r
                      ? 'shadow-xs bg-surface-primary text-text-primary'
                      : 'text-text-tertiary hover:text-text-primary',
                  )}
                >
                  {r === 'all' ? 'All' : r}
                </button>
              ))}
            </div>
          </div>

          {/* 3x2 STAT TILES GRID */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-secondary/40 p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Sessions
              </div>
              <div className="mt-1 text-xl font-bold text-text-primary">{totalSessions}</div>
            </div>

            <div className="rounded-xl bg-surface-secondary/40 p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Messages
              </div>
              <div className="mt-1 text-xl font-bold text-text-primary">{totalMessages}</div>
            </div>

            <div className="rounded-xl bg-surface-secondary/40 p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Total tokens
              </div>
              <div className="mt-1 text-xl font-bold text-text-primary">{totalTokensDisplay}</div>
            </div>

            <div className="rounded-xl bg-surface-secondary/40 p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Active days
              </div>
              <div className="mt-1 text-xl font-bold text-text-primary">{activeDaysCount}</div>
            </div>

            <div className="rounded-xl bg-surface-secondary/40 p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Peak hour
              </div>
              <div className="mt-1 text-xl font-bold text-text-primary">{peakHour}</div>
            </div>

            <div className="rounded-xl bg-surface-secondary/40 p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Favorite model
              </div>
              <div className="mt-1 truncate text-sm font-bold text-text-primary">
                {favoriteModel}
              </div>
            </div>
          </div>

          {/* CONTRIBUTION HEATMAP */}
          <div className="mt-6 flex flex-col gap-2 border-t border-border-light/60 pt-4">
            <div className="flex items-center justify-between text-[11px] text-text-tertiary">
              <span>Activity heatmap</span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span>Less</span>
                <span className="rounded-xs h-2 w-2 bg-surface-secondary" />
                <span className="rounded-xs h-2 w-2 bg-orange-300" />
                <span className="rounded-xs h-2 w-2 bg-orange-500" />
                <span className="rounded-xs h-2 w-2 bg-orange-700" />
                <span>More</span>
              </div>
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto py-2">
              {heatmapCells.map((cell) => (
                <div
                  key={cell.idx}
                  title={`${cell.date}: ${cell.activityLevel > 0 ? 'Active' : 'No activity'}`}
                  className={cn(
                    'rounded-xs h-2.5 w-2.5 transition-colors',
                    cell.activityLevel === 0 && 'bg-surface-secondary/80',
                    cell.activityLevel === 1 && 'bg-orange-200 dark:bg-orange-950',
                    cell.activityLevel === 2 && 'bg-orange-400 dark:bg-orange-800',
                    cell.activityLevel >= 3 && 'bg-orange-600',
                  )}
                />
              ))}
            </div>

            <p className="mt-1 text-xs italic text-text-tertiary">
              {totalSessions > 0
                ? `Based on ${totalSessions} sessions across ${activeDaysCount} active days in your workspace.`
                : 'Activity will appear here as you code and chat with Claude.'}
            </p>
          </div>
        </div>
      </div>

      {/* PERSISTENT COMMAND AREA */}
      <div className="mx-auto mt-8 w-full max-w-4xl">
        {/* ENVIRONMENT CHIPS ROW */}
        <div className="mb-2.5 flex items-center justify-between px-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-border-light bg-surface-primary px-2.5 py-1 text-text-primary">
              <Terminal className="h-3 w-3 text-orange-600" />
              <span className="font-medium">Local</span>
            </div>

            <button
              type="button"
              onClick={() => setShowFoldersModal(true)}
              className="flex items-center gap-1.5 rounded-full border border-border-light bg-surface-primary px-2.5 py-1 text-text-primary transition-colors hover:bg-surface-secondary"
            >
              <Folder className="h-3 w-3 text-text-tertiary" />
              <span>Claude-Copycat</span>
            </button>

            <div className="flex items-center gap-1.5 rounded-full border border-border-light bg-surface-primary px-2.5 py-1 text-text-primary">
              <GitBranch className="h-3 w-3 text-text-tertiary" />
              <span className="font-mono text-[11px]">TjaboGO/Claude-Copycat</span>
            </div>

            <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-light bg-surface-primary px-2.5 py-1 text-text-secondary hover:bg-surface-secondary">
              <input
                type="checkbox"
                checked={worktreeChecked}
                onChange={(e) => setWorktreeChecked(e.target.checked)}
                className="h-3 w-3 rounded border-border-light text-orange-600 focus:ring-orange-500"
              />
              <span className="text-[11px]">worktree</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPromptsModal(true)}
              className="flex items-center gap-1 rounded-full border border-border-light bg-surface-primary px-2.5 py-1 text-[11px] text-text-secondary hover:bg-surface-secondary"
            >
              <FileCode className="h-3 w-3 text-orange-600" />
              <span>Prompts</span>
            </button>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
              <Bot className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* STATUS BANNER */}
        <div className="mb-3 flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>Usage limits active</strong> · Resets in 3h 24m
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/c/new')}
            className="rounded-full bg-text-primary px-3 py-1 text-[11px] font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
          >
            Turn on credits
          </button>
        </div>

        {/* COMPOSER INPUT */}
        <form
          onSubmit={handleStartTask}
          className="relative rounded-2xl border border-border-light bg-surface-primary p-3 shadow-lg transition-colors focus-within:border-text-primary"
        >
          <div className="relative">
            <textarea
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleStartTask();
                }
              }}
              rows={2}
              placeholder="Describe a task or ask a question"
              className="w-full resize-none bg-transparent pr-8 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
            <button
              type="submit"
              disabled={!taskInput.trim()}
              className={cn(
                'absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md transition-colors',
                taskInput.trim()
                  ? 'bg-text-primary text-surface-primary hover:bg-text-primary/90'
                  : 'text-text-tertiary opacity-40',
              )}
            >
              <CornerDownLeft className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-border-light/60 pt-2 text-xs">
            <div className="flex items-center gap-2 text-text-tertiary">
              <button
                type="button"
                onClick={() => setShowPromptsModal(true)}
                className="rounded p-1 hover:bg-surface-secondary hover:text-text-primary"
                aria-label="Add prompt or file"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="rounded p-1 hover:bg-surface-secondary hover:text-text-primary"
                aria-label="Dictate task"
              >
                <Mic className="h-3.5 w-3.5" />
              </button>
              <span className="rounded bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                Auto
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
              <span className="font-medium text-text-secondary">DeepSeek Reasoner</span>
              <span>·</span>
              <span>Medium effort</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </form>
      </div>

      {/* MODALS */}
      {showFoldersModal && (
        <CodeFoldersModal open={showFoldersModal} onOpenChange={setShowFoldersModal} />
      )}
      {showPromptsModal && (
        <CodePromptsChainsModal
          open={showPromptsModal}
          onOpenChange={setShowPromptsModal}
          onSelectPrompt={(tmpl) => setTaskInput(tmpl)}
        />
      )}
    </div>
  );
}
