/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import {
  Plug,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Terminal,
  ExternalLink,
  RefreshCw,
  Folder,
  MessageSquare,
  FileText,
  CheckSquare,
  CreditCard,
  Database,
  HardDrive,
  Music,
  Radio,
  Search,
} from 'lucide-react';
import { cn } from '~/utils';

export interface InteractiveConnectorCardProps {
  sourceId: string;
  toolName: string;
  status?: 'CONNECTED' | 'DISCONNECTED' | 'NEEDS_AUTH';
  needsAuth?: boolean;
  authUrl?: string;
  arguments?: Record<string, any>;
  data?: any;
  error?: string;
  cliHint?: string;
  onConnect?: () => void;
}

export default function InteractiveConnectorCard({
  sourceId,
  toolName,
  status = 'CONNECTED',
  needsAuth = false,
  authUrl,
  arguments: args = {},
  data,
  error,
  cliHint,
  onConnect,
}: InteractiveConnectorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(!needsAuth && status === 'CONNECTED');

  const connectorName = sourceId
    ? sourceId.charAt(0).toUpperCase() + sourceId.slice(1).replace('_', ' ')
    : 'External Tool';

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      if (authUrl && authUrl.startsWith('http')) {
        window.open(authUrl, '_blank', 'noopener,noreferrer');
      }
      // Optimistic connect
      await fetch('/api/cowork/connectors/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_id: sourceId }),
      }).catch(() => {});
      setIsConnected(true);
      onConnect?.();
    } finally {
      setIsConnecting(false);
    }
  };

  const getConnectorIcon = (id: string) => {
    switch (id.toLowerCase()) {
      case 'slack':
        return <MessageSquare className="h-4 w-4 text-amber-500" />;
      case 'notion':
        return <FileText className="h-4 w-4 text-slate-400" />;
      case 'jira':
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case 'linear':
        return <Radio className="h-4 w-4 text-purple-500" />;
      case 'stripe':
        return <CreditCard className="h-4 w-4 text-indigo-500" />;
      case 'postgres':
        return <Database className="h-4 w-4 text-cyan-500" />;
      case 'google_drive':
        return <HardDrive className="h-4 w-4 text-emerald-500" />;
      case 'spotify':
        return <Music className="h-4 w-4 text-green-500" />;
      case 'filesystem':
        return <Folder className="h-4 w-4 text-amber-600" />;
      case 'tavily':
        return <Search className="h-4 w-4 text-teal-500" />;
      default:
        return <Plug className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div
      data-testid="interactive-connector-card"
      className={cn(
        'my-3 w-full max-w-2xl overflow-hidden rounded-2xl border bg-surface-primary shadow-sm transition-all text-xs',
        !isConnected
          ? 'border-amber-500/30 bg-amber-500/[0.02]'
          : 'border-border-light hover:border-border-heavy',
      )}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-border-light/60 bg-surface-secondary/40 px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-primary border border-border-light shadow-xs">
            {getConnectorIcon(sourceId)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary text-xs">{connectorName}</span>
              <span className="rounded bg-surface-tertiary px-1.5 py-0.2 font-mono text-[10px] text-text-secondary">
                {toolName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isConnected ? 'bg-emerald-500' : 'bg-amber-500',
              )}
            />
            <span
              className={cn(
                'text-[11px] font-medium',
                isConnected ? 'text-emerald-500' : 'text-amber-500',
              )}
            >
              {isConnected ? 'Connected' : 'Auth Required'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Needs Authentication Banner */}
      {!isConnected && (
        <div className="flex flex-col gap-3 p-4 bg-amber-500/[0.04] border-b border-amber-500/20">
          <div className="flex items-start gap-2.5 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold">Authentication required: </span>
              {error || `Connect your ${connectorName} account to execute this action and grant agent access.`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isConnecting}
              onClick={handleConnect}
              className="flex items-center gap-1.5 rounded-lg bg-text-primary px-3 py-1.5 text-xs font-semibold text-surface-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isConnecting ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              <span>Connect {connectorName}</span>
              {authUrl && <ExternalLink className="h-3 w-3 ml-0.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Expanded Details / Arguments & Response Data */}
      {isExpanded && (
        <div className="space-y-3 p-4 bg-surface-primary">
          {/* Arguments */}
          {args && Object.keys(args).length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Input Arguments
              </div>
              <pre className="max-h-36 overflow-auto rounded-lg bg-surface-secondary p-2.5 font-mono text-[11px] text-text-primary">
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
          )}

          {/* Response Payload */}
          {data && (
            <div>
              <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Output Data</span>
                <span className="text-emerald-500 flex items-center gap-1 lowercase font-normal">
                  <CheckCircle2 className="h-3 w-3" /> success
                </span>
              </div>
              <pre className="max-h-48 overflow-auto rounded-lg bg-surface-secondary p-2.5 font-mono text-[11px] text-text-primary">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}

          {/* CLI Alternative Hint */}
          {cliHint && (
            <div className="rounded-lg border border-border-light bg-surface-secondary/40 p-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-text-secondary font-medium mb-0.5">
                <Terminal className="h-3.5 w-3.5" />
                <span>CLI Alternative</span>
              </div>
              <div className="font-mono text-text-primary bg-surface-primary px-2 py-1 rounded border border-border-light/60">
                {cliHint}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
