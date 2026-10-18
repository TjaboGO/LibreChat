/* eslint-disable i18next/no-literal-string */
import React, { useState, useCallback } from 'react';
import copy from 'copy-to-clipboard';
import { Button } from '@librechat/client';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';
import type { WorkflowNode } from './ExecutionWorkflow';
import { cn } from '~/utils';

interface ExecutionLogProps {
  nodes: WorkflowNode[];
}

export default function ExecutionLog({ nodes }: ExecutionLogProps) {
  const [filterType, setFilterType] = useState<'all' | 'actions' | 'errors'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNodes = nodes.filter((node) => {
    if (filterType === 'actions') {
      return node.type === 'action';
    }
    if (filterType === 'errors') {
      return node.status === 'failed' || Boolean(node.errorMessage);
    }
    return true;
  });

  const totalDuration = nodes.reduce((acc, curr) => acc + (curr.durationMs || 0), 0);
  const successCount = nodes.filter((n) => n.status === 'completed').length;
  const failureCount = nodes.filter((n) => n.status === 'failed').length;

  const handleCopy = useCallback((id: string, text: string) => {
    copy(text, { format: 'text/plain' });
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Metric Stats Summary */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-border-light bg-surface-secondary/60 p-2">
          <div className="text-[10px] text-text-tertiary">Total Latency</div>
          <div className="mt-0.5 font-mono font-semibold text-text-primary">
            {totalDuration > 0 ? `${totalDuration}ms` : '0ms'}
          </div>
        </div>
        <div className="rounded-lg border border-border-light bg-surface-secondary/60 p-2">
          <div className="text-[10px] text-text-tertiary">Success Rate</div>
          <div className="mt-0.5 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            {nodes.length > 0 ? `${Math.round((successCount / nodes.length) * 100)}%` : '100%'}
          </div>
        </div>
        <div className="rounded-lg border border-border-light bg-surface-secondary/60 p-2">
          <div className="text-[10px] text-text-tertiary">Errors</div>
          <div
            className={cn(
              'mt-0.5 font-mono font-semibold',
              failureCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-text-primary',
            )}
          >
            {failureCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-border-light pb-2 text-xs">
        <div className="flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-text-tertiary" />
          <span className="font-medium text-text-secondary">Filter:</span>
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'actions', 'errors'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={cn(
                'rounded px-2 py-0.5 text-[11px] font-medium capitalize transition-colors',
                filterType === type
                  ? 'bg-surface-tertiary text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Log Entries */}
      <div className="flex flex-col gap-2">
        {filteredNodes.length === 0 ? (
          <div className="rounded-lg border border-border-light bg-surface-secondary/30 p-4 text-center text-xs text-text-tertiary">
            No execution logs match the selected filter.
          </div>
        ) : (
          filteredNodes.map((node) => {
            const isExpanded = expandedLogId === node.id;
            const payloadString =
              typeof node.inputPayload === 'string'
                ? node.inputPayload
                : JSON.stringify(node.inputPayload ?? {}, null, 2);

            return (
              <div
                key={node.id}
                className="overflow-hidden rounded-lg border border-border-light bg-surface-secondary/50 text-xs transition-colors hover:bg-surface-secondary"
              >
                <div
                  onClick={() => setExpandedLogId((prev) => (prev === node.id ? null : node.id))}
                  className="flex cursor-pointer items-center justify-between p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Expand log row"
                      className="text-text-tertiary"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-1.5 font-medium text-text-primary">
                        <span>{node.title}</span>
                        <span className="py-0.2 rounded bg-surface-primary px-1.5 text-[9px] uppercase tracking-wider text-text-tertiary">
                          {node.type}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-secondary">{node.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    {node.durationMs != null && (
                      <span className="text-text-tertiary">{node.durationMs}ms</span>
                    )}
                    {node.status === 'completed' && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        OK
                      </span>
                    )}
                    {node.status === 'failed' && (
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <AlertCircle className="h-3 w-3" />
                        ERR
                      </span>
                    )}
                    {node.status === 'running' && (
                      <span className="flex items-center gap-1 text-blue-500">
                        <Clock className="h-3 w-3 animate-spin" />
                        RUN
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border-light bg-surface-primary p-2.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-sans text-[10px] font-semibold text-text-secondary">
                        Payload (Input & Output)
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(node.id, payloadString);
                        }}
                        className="h-6 gap-1 px-1.5 text-[10px] text-text-secondary hover:text-text-primary"
                      >
                        {copiedId === node.id ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedId === node.id ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>

                    <pre className="max-h-48 overflow-auto rounded bg-surface-secondary/70 p-2 text-[10px] text-text-primary">
                      {payloadString}
                    </pre>

                    {node.outputPayload && (
                      <div className="mt-2">
                        <div className="mb-1 font-sans text-[10px] font-semibold text-text-secondary">
                          Result
                        </div>
                        <pre className="max-h-48 overflow-auto rounded bg-emerald-500/5 p-2 text-[10px] text-emerald-600 dark:text-emerald-400">
                          {node.outputPayload}
                        </pre>
                      </div>
                    )}

                    {node.errorMessage && (
                      <div className="mt-2 rounded bg-rose-500/10 p-2 font-sans text-xs text-rose-600 dark:text-rose-400">
                        <span className="font-semibold">Error Message:</span> {node.errorMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
