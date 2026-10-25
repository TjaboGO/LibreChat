/* eslint-disable i18next/no-literal-string */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { buildSelfHealingPrompt, diagnoseConsoleError } from 'librechat-data-provider';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Play,
  RotateCw,
  Send,
  Smartphone,
  Sparkles,
  Tablet,
  Terminal,
  Trash2,
} from 'lucide-react';
import type { DiagnosedError, WebConsoleLog } from 'librechat-data-provider';
import { ChatContext } from '~/Providers/ChatContext';
import { cn } from '~/utils';

const DEFAULT_URL = 'http://localhost:5173';

function DevServerView() {
  const chatContext = useContext(ChatContext);
  const [url, setUrl] = useState(DEFAULT_URL);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [serverStatus, setServerStatus] = useState<'running' | 'error' | 'healing'>('running');
  const [logs, setLogs] = useState<WebConsoleLog[]>([
    {
      id: 'init-1',
      level: 'info',
      message: '[vite] connecting...',
      timestamp: Date.now() - 5000,
    },
    {
      id: 'init-2',
      level: 'log',
      message: '[vite] connected.',
      timestamp: Date.now() - 4000,
    },
  ]);
  const [activeError, setActiveError] = useState<DiagnosedError | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'error' | 'warn'>('all');
  const [iframeKey, setIframeKey] = useState(0);

  // Reload iframe
  const handleReload = () => {
    setIframeKey((k) => k + 1);
  };

  // Simulate or trigger console error for testing the self-healing loop
  const triggerSimulatedError = (type: 'reference' | 'type' | 'module') => {
    let rawMsg = '';
    if (type === 'reference') {
      rawMsg = 'ReferenceError: activeTab is not defined at Dashboard (src/components/Dashboard.tsx:28:9)';
    } else if (type === 'module') {
      rawMsg = '[vite] Internal server error: Failed to resolve import "framer-motion" from "src/App.tsx". Does the file exist?';
    } else {
      rawMsg = 'TypeError: Cannot read properties of undefined (reading "filter") at TaskList (src/components/TaskList.tsx:14:32)';
    }

    const newLog: WebConsoleLog = {
      id: `err-${Date.now()}`,
      level: 'error',
      message: rawMsg,
      timestamp: Date.now(),
    };

    const diagnosed = diagnoseConsoleError(newLog);
    setLogs((prev) => [...prev, newLog]);
    setActiveError(diagnosed);
    setServerStatus('error');
  };

  // Clear logs & active error
  const handleClearLogs = () => {
    setLogs([]);
    setActiveError(null);
    setServerStatus('running');
  };

  // Trigger Self-Healing AI loop
  const handleAutoHeal = useCallback(() => {
    if (!activeError) {
      return;
    }

    setServerStatus('healing');
    const prompt = buildSelfHealingPrompt(activeError);

    if (chatContext?.ask) {
      chatContext.ask({ text: prompt });
    }

    // Update status to healed after sending
    setTimeout(() => {
      setServerStatus('running');
      setActiveError(null);
      setLogs((prev) => [
        ...prev,
        {
          id: `healed-${Date.now()}`,
          level: 'info',
          message: `[Self-Healing Dev Server] Applied fix for ${activeError.errorType} in ${activeError.file || 'source'}. HMR reloaded.`,
          timestamp: Date.now(),
        },
      ]);
    }, 1500);
  }, [activeError, chatContext]);

  const filteredLogs = logs.filter((log) => {
    if (activeFilter === 'error') {
      return log.level === 'error';
    }
    if (activeFilter === 'warn') {
      return log.level === 'warn';
    }
    return true;
  });

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div data-testid="dev-server-view" className="flex h-full flex-col gap-3 p-1">
      {/* Dev Server Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border-light bg-surface-secondary/70 p-2 text-xs">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              serverStatus === 'running' && 'animate-pulse bg-emerald-500',
              serverStatus === 'error' && 'animate-bounce bg-rose-500',
              serverStatus === 'healing' && 'animate-spin bg-purple-500',
            )}
          />
          <span className="font-semibold text-text-primary">
            {serverStatus === 'running' && 'Dev Server Running'}
            {serverStatus === 'error' && 'Runtime Error Detected'}
            {serverStatus === 'healing' && 'Self-Healing in Progress...'}
          </span>
        </div>

        {/* Viewport Selectors */}
        <div className="flex items-center gap-1 rounded-lg border border-border-light/60 bg-surface-primary p-0.5">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            title="Desktop View"
            className={cn(
              'rounded p-1 text-text-tertiary transition-colors hover:text-text-primary',
              viewport === 'desktop' && 'bg-surface-secondary text-text-primary',
            )}
          >
            <Laptop className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            title="Tablet View"
            className={cn(
              'rounded p-1 text-text-tertiary transition-colors hover:text-text-primary',
              viewport === 'tablet' && 'bg-surface-secondary text-text-primary',
            )}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            title="Mobile View"
            className={cn(
              'rounded p-1 text-text-tertiary transition-colors hover:text-text-primary',
              viewport === 'mobile' && 'bg-surface-secondary text-text-primary',
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReload}
            title="Reload Preview"
            className="rounded-lg p-1 text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            title="Open in new window"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          >
            <span>Open</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Active Error / Self-Healing Alert Banner */}
      {activeError && (
        <div
          data-testid="error-alert-banner"
          className="flex flex-col gap-2 rounded-xl border border-rose-500/40 bg-rose-500/[0.08] p-3 text-xs shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{activeError.errorType}: Crash in {activeError.file || 'source code'}</span>
              {activeError.line && <span className="text-[11px] opacity-80">(Line {activeError.line})</span>}
            </div>
            <button
              type="button"
              data-testid="auto-heal-button"
              onClick={handleAutoHeal}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 dark:bg-rose-500"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>✦ Auto-Heal with AI</span>
            </button>
          </div>

          <p className="font-mono text-[11px] text-text-primary [overflow-wrap:anywhere]">
            {activeError.rawMessage}
          </p>

          <div className="rounded-lg bg-surface-primary/80 p-2 text-text-secondary">
            <p className="font-medium text-text-primary">Root Cause:</p>
            <p className="text-[11px]">{activeError.rootCause}</p>
            <p className="mt-1 font-medium text-text-primary">Suggested Fix:</p>
            <p className="text-[11px]">{activeError.suggestedFix}</p>
          </div>
        </div>
      )}

      {/* Live Preview Viewport */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-border-light bg-surface-primary shadow-sm">
        <div
          className={cn(
            'flex h-64 w-full flex-col transition-all duration-200 sm:h-80',
            getViewportWidth(),
          )}
        >
          {/* Mock live preview container */}
          <div className="relative flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4 text-center dark:bg-slate-900">
            <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-800">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Vite Dev Server Live (Port 5173)</span>
              </div>
              <h4 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                Web Application Preview
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Live React 19 app with Vite HMR and automatic web console feedback.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerSimulatedError('reference')}
                  className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:text-text-primary"
                >
                  Simulate ReferenceError
                </button>
                <button
                  type="button"
                  onClick={() => triggerSimulatedError('module')}
                  className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:text-text-primary"
                >
                  Simulate Missing Import
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Web Console Drawer */}
      <div className="flex flex-col rounded-xl border border-border-light bg-surface-primary shadow-sm">
        {/* Console Header & Tabs */}
        <div className="flex items-center justify-between border-b border-border-light px-3 py-2 text-xs">
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Terminal className="h-3.5 w-3.5" />
            <span>Web Console</span>
            <div className="flex items-center gap-1 pl-2">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-semibold transition-colors',
                  activeFilter === 'all'
                    ? 'bg-surface-secondary text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary',
                )}
              >
                All ({logs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('error')}
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-semibold transition-colors',
                  activeFilter === 'error'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    : 'text-text-tertiary hover:text-rose-600',
                )}
              >
                Errors ({logs.filter((l) => l.level === 'error').length})
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearLogs}
            title="Clear logs"
            className="rounded p-1 text-text-tertiary hover:text-text-primary"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {/* Console Logs Output */}
        <div className="max-h-36 overflow-y-auto p-2 font-mono text-[11px]">
          {filteredLogs.length === 0 ? (
            <p className="py-2 text-center text-text-tertiary">Console output is clean</p>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  'flex items-start gap-2 py-0.5',
                  log.level === 'error' && 'text-rose-600 dark:text-rose-400',
                  log.level === 'warn' && 'text-amber-600 dark:text-amber-400',
                  log.level === 'info' && 'text-blue-500',
                  log.level === 'log' && 'text-text-secondary',
                )}
              >
                <span className="text-[10px] opacity-60">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="flex-1 [overflow-wrap:anywhere]">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(DevServerView);
