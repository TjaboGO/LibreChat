/* eslint-disable i18next/no-literal-string */
import React from 'react';
import { useRecoilValue } from 'recoil';
import { Clock, CheckSquare, Zap } from 'lucide-react';
import { useCoworkTasksQuery, useClearCoworkTasksMutation, type CoworkTask } from '~/data-provider';
import { composerModeFamily } from '~/store/families';
import { cn } from '~/utils';

export type { CoworkTask };

function getStatusDotClass(status: CoworkTask['status']) {
  if (status === 'running') {
    return 'animate-pulse bg-blue-500';
  }
  if (status === 'completed') {
    return 'bg-green-500';
  }
  return 'bg-amber-500';
}

interface CoworkTaskListProps {
  index?: string | number | null;
}

export default function CoworkTaskList({ index = null }: CoworkTaskListProps) {
  const composerMode = useRecoilValue(composerModeFamily(index));
  const { data } = useCoworkTasksQuery();
  const clearActiveMutation = useClearCoworkTasksMutation();
  const tasks = data?.tasks ?? [];

  // Only render in Cowork mode when tasks exist
  if (composerMode !== 'cowork' || tasks.length === 0) {
    return null;
  }

  const handleClearActive = () => {
    const taskIds = tasks.map((t) => t.id);
    clearActiveMutation.mutate(taskIds);
  };

  return (
    <div className="shadow-xs mt-3 w-full rounded-xl border border-border-light/60 bg-surface-primary p-3">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-border-light/40 pb-2">
        <span className="text-xs font-semibold text-text-primary">Active</span>
        <button
          type="button"
          onClick={handleClearActive}
          className="text-xs text-text-secondary transition-colors hover:text-text-primary"
        >
          Clear active
        </button>
      </div>

      {/* TASK ROWS */}
      <div className="divide-y divide-border-light/40 pt-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-lg px-1 py-2 transition-colors hover:bg-surface-secondary/30"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              {/* STATUS ICON WITH OVERLAY DOT */}
              <div className="relative mt-0.5 shrink-0 text-text-secondary">
                {task.type === 'scheduled' ? (
                  <Clock className="h-3.5 w-3.5" />
                ) : (
                  <CheckSquare className="h-3.5 w-3.5" />
                )}
                <span
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ring-1 ring-surface-primary',
                    getStatusDotClass(task.status),
                  )}
                />
              </div>

              {/* TITLE & TIME */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {task.status === 'running' && <Zap className="h-3 w-3 shrink-0 text-amber-500" />}
                  <span className="truncate text-xs font-medium text-text-primary">
                    {task.title}
                  </span>
                </div>
                <div className="text-[11px] text-text-tertiary">{task.timeAgo}</div>
              </div>
            </div>

            {/* STATUS BADGE */}
            <div className="shrink-0 pl-3">
              {task.status === 'running' ? (
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                  Running
                </span>
              ) : (
                <span className="rounded bg-surface-secondary px-1.5 py-0.5 text-[10px] text-text-tertiary">
                  Queued
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
