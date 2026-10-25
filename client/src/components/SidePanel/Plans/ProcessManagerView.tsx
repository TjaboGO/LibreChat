/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Button } from '@librechat/client';
import {
  Terminal,
  Activity,
  Send,
  Square,
  Globe,
  ExternalLink,
  X,
  Play,
  RotateCw,
  Cpu,
} from 'lucide-react';
import {
  useProcessesQuery,
  useProcessOutputQuery,
  useSendStdinMutation,
  useKillProcessMutation,
  useExposedPortsQuery,
  useClosePortMutation,
} from '~/data-provider/Manus/queries';
import { cn } from '~/utils';

export default function ProcessManagerView() {
  const [selectedProcessId, setSelectedProcessId] = useState<string>('');
  const [stdinInput, setStdinInput] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'running' | 'completed'>('all');

  const { data: processesData, refetch: refetchProcesses, isLoading } = useProcessesQuery();
  const { data: portsData } = useExposedPortsQuery();

  const processes = processesData?.processes || [];
  const ports = portsData?.ports || [];

  // Default selection to first process if not set
  const activeId = selectedProcessId || (processes.length > 0 ? processes[0].id : '');

  const { data: outputData } = useProcessOutputQuery(activeId, 50);
  const sendStdinMutation = useSendStdinMutation();
  const killProcessMutation = useKillProcessMutation();
  const closePortMutation = useClosePortMutation();

  const filteredProcesses = processes.filter((p) => {
    if (filter === 'running') return p.status === 'running';
    if (filter === 'completed') return p.status === 'completed' || p.status === 'killed';
    return true;
  });

  const activeProcess = processes.find((p) => p.id === activeId);

  const handleSendStdin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!stdinInput.trim() || !activeId) return;

    sendStdinMutation.mutate({
      id: activeId,
      input: stdinInput.trim(),
    });
    setStdinInput('');
  };

  const handleKill = () => {
    if (!activeId) return;
    killProcessMutation.mutate({ id: activeId, signal: 'SIGTERM' });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-surface-primary text-xs">
      {/* Top Banner: Engine Status & Exposed Ports */}
      <div className="border-b border-border-light bg-surface-secondary/40 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-purple-500" />
            <span className="font-semibold text-text-primary">
              Manus Process & Network Hub
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => refetchProcesses()}
            className="h-7 w-7 p-0 text-text-secondary hover:text-text-primary"
            title="Refresh processes"
          >
            <RotateCw className="size-3.5" />
          </Button>
        </div>

        {/* Exposed Ports Chips */}
        {ports.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-text-tertiary flex items-center gap-1">
              <Globe className="size-3 text-emerald-500" />
              Exposed Ports:
            </span>
            {ports.map((p) => (
              <div
                key={p.port}
                className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400"
              >
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <a
                  href={p.localUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline font-medium"
                >
                  <span>{p.port}</span>
                  <ExternalLink className="size-2.5 opacity-70" />
                </a>
                <button
                  type="button"
                  onClick={() => closePortMutation.mutate(p.port)}
                  className="ml-1 text-emerald-600/70 hover:text-emerald-700 dark:text-emerald-400/70 dark:hover:text-emerald-300"
                  title="Close Port"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Split: Process List & Interactive Console */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Process List */}
        <div className="flex w-1/3 flex-col border-r border-border-light overflow-y-auto">
          {/* Filter Bar */}
          <div className="flex border-b border-border-light p-1.5 gap-1 bg-surface-primary">
            {(['all', 'running', 'completed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={cn(
                  'flex-1 rounded px-2 py-1 text-[10px] font-medium capitalize transition-colors',
                  filter === mode
                    ? 'bg-surface-hover text-text-primary shadow-xs'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* List items */}
          <div className="flex flex-col p-2 gap-1.5">
            {filteredProcesses.length === 0 ? (
              <div className="p-4 text-center text-text-tertiary">
                <Terminal className="size-6 mx-auto mb-1.5 opacity-40" />
                <p className="text-[11px]">No processes found</p>
              </div>
            ) : (
              filteredProcesses.map((proc) => {
                const isSelected = proc.id === activeId;
                const isRunning = proc.status === 'running';

                return (
                  <button
                    key={proc.id}
                    onClick={() => setSelectedProcessId(proc.id)}
                    className={cn(
                      'flex flex-col rounded-lg border p-2 text-left transition-colors',
                      isSelected
                        ? 'border-purple-500/50 bg-purple-500/10 text-text-primary ring-1 ring-purple-500/30'
                        : 'border-border-light bg-surface-primary hover:bg-surface-secondary',
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-semibold text-text-secondary truncate max-w-[100px]">
                        {proc.id}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[9px] font-medium uppercase',
                          isRunning
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : proc.status === 'failed'
                              ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                              : 'bg-surface-secondary text-text-tertiary',
                        )}
                      >
                        {proc.status}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-text-primary truncate">
                      {proc.command}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-text-tertiary">
                      <span>PID: {proc.pid || '—'}</span>
                      <span>{new Date(proc.startedAt).toLocaleTimeString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Terminal Console & Stdin */}
        <div className="flex flex-1 flex-col overflow-hidden bg-black text-emerald-400 font-mono">
          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
            <div className="flex items-center gap-2 truncate">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="font-semibold truncate">{activeProcess?.command || 'Shell Session'}</span>
            </div>
            {activeProcess?.status === 'running' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleKill}
                disabled={killProcessMutation.isLoading}
                className="h-6 gap-1 px-2 text-[10px]"
              >
                <Square className="size-2.5 fill-current" />
                <span>Kill Process</span>
              </Button>
            )}
          </div>

          {/* Log Output Canvas */}
          <div
            data-testid="terminal-output"
            className="flex-1 overflow-y-auto p-3 text-[11px] leading-relaxed selection:bg-emerald-500 selection:text-black whitespace-pre-wrap break-all"
          >
            {outputData?.output || (activeProcess ? 'Waiting for output...' : 'Select a process to view output')}
          </div>

          {/* Interactive stdin Input Field */}
          <form
            onSubmit={handleSendStdin}
            className="flex items-center border-t border-white/10 bg-zinc-900 p-2 gap-2"
          >
            <span className="text-zinc-500 pl-1 select-none">&gt;</span>
            <input
              type="text"
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              disabled={activeProcess?.status !== 'running'}
              placeholder={
                activeProcess?.status === 'running'
                  ? 'Send input to stdin (e.g. y/n, password, input)...'
                  : 'Process not running'
              }
              className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!stdinInput.trim() || activeProcess?.status !== 'running'}
              className="h-7 px-2.5 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Send className="size-3" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
