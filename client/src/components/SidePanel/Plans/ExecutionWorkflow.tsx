/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import {
  Zap,
  Cpu,
  Globe,
  FileCode,
  Terminal,
  CheckCircle2,
  Clock,
  ArrowDown,
  Layers,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Database,
  Search,
  Sparkles,
} from 'lucide-react';
import { cn } from '~/utils';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'decision' | 'action' | 'output';
  title: string;
  subtitle: string;
  iconType: 'zap' | 'cpu' | 'globe' | 'code' | 'terminal' | 'database' | 'search' | 'check';
  status: 'completed' | 'running' | 'queued' | 'failed';
  durationMs?: number;
  inputPayload?: string | Record<string, unknown>;
  outputPayload?: string;
  errorMessage?: string;
}

interface ExecutionWorkflowProps {
  nodes: WorkflowNode[];
  activeTaskTitle?: string;
  onSelectNode?: (nodeId: string) => void;
}

function getNodeIcon(iconType: WorkflowNode['iconType']) {
  switch (iconType) {
    case 'zap':
      return <Zap className="h-4 w-4 text-amber-500" />;
    case 'cpu':
      return <Cpu className="h-4 w-4 text-purple-500" />;
    case 'globe':
      return <Globe className="h-4 w-4 text-blue-500" />;
    case 'code':
      return <FileCode className="h-4 w-4 text-emerald-500" />;
    case 'terminal':
      return <Terminal className="h-4 w-4 text-cyan-500" />;
    case 'database':
      return <Database className="h-4 w-4 text-indigo-500" />;
    case 'search':
      return <Search className="h-4 w-4 text-sky-500" />;
    case 'check':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    default:
      return <Layers className="h-4 w-4 text-text-secondary" />;
  }
}

function getStatusBadge(status: WorkflowNode['status']) {
  switch (status) {
    case 'completed':
      return (
        <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Success
        </span>
      );
    case 'running':
      return (
        <span className="flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
          Running
        </span>
      );
    case 'failed':
      return (
        <span className="flex items-center gap-1 rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-medium text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-2.5 w-2.5" />
          Failed
        </span>
      );
    case 'queued':
    default:
      return (
        <span className="flex items-center gap-1 rounded bg-surface-tertiary px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">
          <Clock className="h-2.5 w-2.5" />
          Queued
        </span>
      );
  }
}

function getNodeCardClass(status: WorkflowNode['status']) {
  if (status === 'running') {
    return 'border-blue-500/40 bg-blue-500/5 shadow-xs ring-1 ring-blue-500/20';
  }
  if (status === 'failed') {
    return 'border-rose-500/30 bg-rose-500/5';
  }
  return 'border-border-light bg-surface-secondary/50 hover:border-border-heavy hover:bg-surface-secondary';
}

export default function ExecutionWorkflow({
  nodes,
  activeTaskTitle: _activeTaskTitle,
  onSelectNode,
}: ExecutionWorkflowProps) {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedNodeId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Overview subtitle banner */}
      <div className="flex items-center justify-between rounded-lg border border-border-light bg-surface-secondary/70 p-2.5 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="font-medium text-text-primary">Deterministic Node Pipeline</span>
        </div>
        <span className="text-[11px] text-text-tertiary">
          {nodes.length} node{nodes.length === 1 ? '' : 's'} linked
        </span>
      </div>

      {/* Nodes visual flow */}
      <div className="relative flex flex-col items-center">
        {nodes.map((node, index) => {
          const isExpanded = expandedNodeId === node.id;
          const isLast = index === nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div
                onClick={() => {
                  toggleExpand(node.id);
                  onSelectNode?.(node.id);
                }}
                className={cn(
                  'w-full cursor-pointer rounded-xl border p-3 transition-all duration-150',
                  getNodeCardClass(node.status),
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border-light bg-surface-primary">
                      {getNodeIcon(node.iconType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-text-primary">
                          {node.title}
                        </span>
                        {node.durationMs != null && (
                          <span className="font-mono text-[10px] text-text-tertiary">
                            {node.durationMs}ms
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-text-secondary">{node.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(node.status)}
                    <button
                      type="button"
                      aria-label="Expand node details"
                      className="text-text-tertiary hover:text-text-primary"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Payload / Inspector */}
                {isExpanded && (
                  <div className="mt-3 border-t border-border-light/60 pt-2 text-[11px]">
                    {node.inputPayload && (
                      <div className="mb-2">
                        <span className="font-medium text-text-secondary">Input Payload:</span>
                        <pre className="mt-1 max-h-36 overflow-auto rounded bg-surface-primary p-2 font-mono text-[10px] text-text-primary">
                          {typeof node.inputPayload === 'string'
                            ? node.inputPayload
                            : JSON.stringify(node.inputPayload, null, 2)}
                        </pre>
                      </div>
                    )}
                    {node.outputPayload && (
                      <div>
                        <span className="font-medium text-text-secondary">Output Result:</span>
                        <pre className="mt-1 max-h-36 overflow-auto rounded bg-surface-primary p-2 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                          {node.outputPayload}
                        </pre>
                      </div>
                    )}
                    {node.errorMessage && (
                      <div className="rounded bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
                        <span className="font-semibold">Error:</span> {node.errorMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Connecting Pipe / Arrow */}
              {!isLast && (
                <div className="flex flex-col items-center py-1">
                  <div className="h-3 w-0.5 bg-border-heavy/70" />
                  <ArrowDown className="h-3 w-3 text-border-heavy" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
