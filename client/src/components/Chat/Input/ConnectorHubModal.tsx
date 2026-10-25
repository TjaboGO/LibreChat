/* eslint-disable i18next/no-literal-string */
import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  INITIAL_CONNECTORS,
  type ConnectorDefinition,
  type ConnectorCategory,
  type ConnectorAuthStatus,
} from 'librechat-data-provider';
import {
  Plug,
  Search,
  Check,
  ExternalLink,
  Lock,
  Unlock,
  X,
  Sparkles,
  RefreshCw,
  Sliders,
  ChevronRight,
  Folder,
  MessageSquare,
  FileText,
  CheckSquare,
  CreditCard,
  Database,
  HardDrive,
  Music,
  Radio,
} from 'lucide-react';
import { cn } from '~/utils';

interface ConnectorHubModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectConnector?: (connectorId: string) => void;
}

const CATEGORIES: Array<{ id: 'all' | ConnectorCategory; label: string }> = [
  { id: 'all', label: 'All Connectors' },
  { id: 'developer', label: 'Developer' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'communication', label: 'Communication' },
  { id: 'finance', label: 'Finance' },
  { id: 'data', label: 'Data & SQL' },
  { id: 'design', label: 'Design' },
  { id: 'storage', label: 'Storage & Files' },
];

export default function ConnectorHubModal({
  open,
  onOpenChange,
  onSelectConnector,
}: ConnectorHubModalProps) {
  const [connectors, setConnectors] = useState<ConnectorDefinition[]>([...INITIAL_CONNECTORS]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ConnectorCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'CONNECTED' | 'DISCONNECTED'>('ALL');
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const filteredConnectors = useMemo(() => {
    return connectors.filter((c) => {
      // Status filter
      if (selectedStatus !== 'ALL' && c.status !== selectedStatus) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const textTarget = [
          c.id,
          c.name,
          c.description,
          c.cliHint || '',
          ...c.tools.map((t) => `${t.name} ${t.description}`),
        ]
          .join(' ')
          .toLowerCase();

        return textTarget.includes(query);
      }
      return true;
    });
  }, [connectors, selectedCategory, selectedStatus, searchQuery]);

  const handleToggleConnect = async (connector: ConnectorDefinition) => {
    const isCurrentlyConnected = connector.status === 'CONNECTED';
    setConnectingId(connector.id);

    try {
      const endpoint = isCurrentlyConnected
        ? '/api/cowork/connectors/disconnect'
        : '/api/cowork/connectors/connect';

      // Optimistic update
      const newStatus: ConnectorAuthStatus = isCurrentlyConnected ? 'DISCONNECTED' : 'CONNECTED';
      setConnectors((prev) =>
        prev.map((item) => (item.id === connector.id ? { ...item, status: newStatus } : item)),
      );

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_id: connector.id }),
      }).catch(() => {
        // Fallback to local optimistic update
      });
    } finally {
      setConnectingId(null);
    }
  };

  const getConnectorIcon = (id: string) => {
    switch (id) {
      case 'slack':
        return <MessageSquare className="h-5 w-5 text-amber-500" />;
      case 'notion':
        return <FileText className="h-5 w-5 text-slate-400" />;
      case 'jira':
        return <CheckSquare className="h-5 w-5 text-blue-500" />;
      case 'linear':
        return <Radio className="h-5 w-5 text-purple-500" />;
      case 'stripe':
        return <CreditCard className="h-5 w-5 text-indigo-500" />;
      case 'postgres':
        return <Database className="h-5 w-5 text-cyan-500" />;
      case 'google_drive':
        return <HardDrive className="h-5 w-5 text-emerald-500" />;
      case 'spotify':
        return <Music className="h-5 w-5 text-green-500" />;
      case 'filesystem':
        return <Folder className="h-5 w-5 text-amber-600" />;
      case 'tavily':
        return <Search className="h-5 w-5 text-teal-500" />;
      default:
        return <Plug className="h-5 w-5 text-purple-400" />;
    }
  };

  const connectedCount = connectors.filter((c) => c.status === 'CONNECTED').length;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[90vh] max-h-[820px] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-border-light bg-surface-primary shadow-2xl focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-light px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Plug className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Dialog.Title className="text-lg font-bold text-text-primary">
                    Perplexity Computer Connector Hub
                  </Dialog.Title>
                  <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-[11px] font-semibold text-purple-400">
                    On-Demand MCP Tools
                  </span>
                </div>
                <Dialog.Description className="text-xs text-text-secondary">
                  Connect third-party cloud apps, databases, and APIs. Tools are dynamically discovered
                  via <span className="font-mono text-text-primary">list_external_tools</span> without overloading the prompt.
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="space-y-3 border-b border-border-light bg-surface-secondary/40 px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search connectors by name, keywords, tools, or CLI hints (e.g. 'github', 'jql', 'sql')..."
                  className="w-full rounded-xl border border-border-light bg-surface-primary py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-tertiary focus:border-border-heavy focus:outline-none"
                />
              </div>

              {/* Status Toggle Buttons */}
              <div className="flex items-center rounded-xl border border-border-light bg-surface-primary p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedStatus('ALL')}
                  className={cn(
                    'rounded-lg px-2.5 py-1 font-medium transition-colors',
                    selectedStatus === 'ALL'
                      ? 'bg-surface-secondary text-text-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  All ({connectors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('CONNECTED')}
                  className={cn(
                    'rounded-lg px-2.5 py-1 font-medium transition-colors',
                    selectedStatus === 'CONNECTED'
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  Active ({connectedCount})
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedCategory === cat.id
                      ? 'bg-text-primary text-surface-primary'
                      : 'bg-surface-secondary text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connectors Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredConnectors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Plug className="h-10 w-10 text-text-tertiary mb-3 opacity-40" />
                <h3 className="text-sm font-semibold text-text-primary">No connectors found</h3>
                <p className="mt-1 text-xs text-text-secondary max-w-sm">
                  No registered service matches your search criteria. Try searching for "developer" or "SQL".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredConnectors.map((connector) => {
                  const isConnected = connector.status === 'CONNECTED';
                  const isBusy = connectingId === connector.id;

                  return (
                    <div
                      key={connector.id}
                      className={cn(
                        'flex flex-col justify-between rounded-xl border border-border-light bg-surface-secondary/30 p-4 transition-all hover:border-border-heavy hover:bg-surface-secondary/60',
                        isConnected && 'border-emerald-500/20 bg-emerald-500/[0.02]',
                      )}
                    >
                      <div>
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-primary border border-border-light shadow-xs">
                              {getConnectorIcon(connector.id)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-semibold text-sm text-text-primary">
                                  {connector.name}
                                </h4>
                                <span className="rounded bg-surface-tertiary px-1.5 py-0.2 text-[10px] font-mono text-text-tertiary">
                                  v{connector.version || '1.0'}
                                </span>
                              </div>
                              <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                                {connector.category}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'h-2 w-2 rounded-full',
                                isConnected ? 'bg-emerald-500' : 'bg-text-tertiary/60',
                              )}
                            />
                            <span
                              className={cn(
                                'text-[11px] font-medium',
                                isConnected ? 'text-emerald-500' : 'text-text-tertiary',
                              )}
                            >
                              {isConnected ? 'Active' : 'Offline'}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-2.5 text-xs text-text-secondary leading-relaxed">
                          {connector.description}
                        </p>

                        {/* Tools Summary */}
                        <div className="mt-3 rounded-lg bg-surface-primary/80 border border-border-light/60 p-2 text-[11px]">
                          <div className="font-semibold text-text-primary mb-1">
                            Available Tools ({connector.tools.length})
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {connector.tools.map((t) => (
                              <span
                                key={t.name}
                                title={t.description}
                                className="font-mono text-[10px] rounded bg-surface-secondary px-1.5 py-0.5 text-text-secondary"
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CLI Hint if available */}
                        {connector.cliHint && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-text-tertiary font-mono">
                            <span className="text-text-secondary font-semibold">CLI Hint:</span>
                            <span className="truncate bg-surface-tertiary px-1 py-0.5 rounded">
                              {connector.cliHint}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button Row */}
                      <div className="mt-4 flex items-center justify-between border-t border-border-light/60 pt-3">
                        <div className="text-[10px] text-text-tertiary">
                          Auth: <span className="font-mono uppercase">{connector.authType}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleConnect(connector)}
                            className={cn(
                              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none',
                              isConnected
                                ? 'bg-surface-secondary text-text-secondary hover:bg-rose-500/10 hover:text-rose-500'
                                : 'bg-text-primary text-surface-primary hover:opacity-90',
                            )}
                          >
                            {isBusy ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : isConnected ? (
                              <>
                                <Unlock className="h-3.5 w-3.5" />
                                <span>Disconnect</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-3.5 w-3.5" />
                                <span>Connect</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between border-t border-border-light bg-surface-secondary/20 px-6 py-3 text-xs text-text-tertiary">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>
                Tip: Type <span className="font-mono text-text-primary">@GitHub</span> or <span className="font-mono text-text-primary">@Notion</span> directly in chat to invoke connectors.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg bg-surface-secondary px-3 py-1.5 font-medium text-text-primary hover:bg-surface-hover"
            >
              Done
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
