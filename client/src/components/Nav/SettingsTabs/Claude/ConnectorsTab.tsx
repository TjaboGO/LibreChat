/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import {
  Search,
  Plus,
  Plug,
  Check,
  MoreVertical,
  Database,
  Github,
  MessageSquare,
  HardDrive,
  FileText,
  Terminal,
} from 'lucide-react';
import AddConnectorModal, { type NewConnectorData } from './AddConnectorModal';
import { cn } from '~/utils';

interface ConnectorItem {
  id: string;
  name: string;
  description: string;
  url: string;
  transport: 'sse' | 'stdio';
  status: 'connected' | 'disconnected';
  toolsCount: number;
  icon: React.ReactNode;
}

interface DiscoverConnector {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

const DEFAULT_CONNECTORS: ConnectorItem[] = [
  {
    id: 'conn-fs',
    name: 'Filesystem MCP',
    description: 'Read and write local workspace files within sandboxed boundaries.',
    url: 'stdio: @modelcontextprotocol/server-filesystem',
    transport: 'stdio',
    status: 'connected',
    toolsCount: 6,
    icon: <HardDrive className="h-4 w-4" />,
  },
  {
    id: 'conn-mem',
    name: 'Memory MCP',
    description: 'Knowledge graph memory system for context recall across chats.',
    url: 'stdio: @modelcontextprotocol/server-memory',
    transport: 'stdio',
    status: 'connected',
    toolsCount: 4,
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: 'conn-github',
    name: 'GitHub Connector',
    description: 'Manage issues, pull requests, and commit inspections.',
    url: 'https://api.github.com/mcp',
    transport: 'sse',
    status: 'connected',
    toolsCount: 12,
    icon: <Github className="h-4 w-4" />,
  },
];

const DISCOVER_CONNECTORS: DiscoverConnector[] = [
  {
    id: 'disc-postgres',
    title: 'PostgreSQL Server',
    description: 'Execute read-only queries, inspect tables, and analyze query plans.',
    category: 'Databases',
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: 'disc-slack',
    title: 'Slack Connector',
    description: 'Read channels, send status notifications, and triage messages.',
    category: 'Communication',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: 'disc-notion',
    title: 'Notion Workspace',
    description: 'Search databases, retrieve pages, and sync task checklists.',
    category: 'Productivity',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 'disc-term',
    title: 'Bash Sandbox',
    description: 'Execute bash commands and inspect stdout in an isolated container.',
    category: 'Development',
    icon: <Terminal className="h-4 w-4" />,
  },
];

export default function ConnectorsTab() {
  const [activeTab, setActiveTab] = useState<'yours' | 'discover'>('yours');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectors, setConnectors] = useState<ConnectorItem[]>(DEFAULT_CONNECTORS);
  const [modalOpen, setModalOpen] = useState(false);
  const [addedDiscover, setAddedDiscover] = useState<Record<string, boolean>>({});

  const handleAddConnector = (data: NewConnectorData) => {
    const newConn: ConnectorItem = {
      id: `conn-${Date.now()}`,
      name: data.name,
      description: data.description || 'Custom MCP connector integration.',
      url: data.url,
      transport: data.transport,
      status: 'connected',
      toolsCount: 3,
      icon: <Plug className="h-4 w-4" />,
    };
    setConnectors((prev) => [...prev, newConn]);
  };

  const handleToggleDiscover = (disc: DiscoverConnector) => {
    if (addedDiscover[disc.id]) {
      setAddedDiscover((prev) => ({ ...prev, [disc.id]: false }));
      setConnectors((prev) => prev.filter((c) => c.name !== disc.title));
    } else {
      setAddedDiscover((prev) => ({ ...prev, [disc.id]: true }));
      const newConn: ConnectorItem = {
        id: `conn-${disc.id}`,
        name: disc.title,
        description: disc.description,
        url: `https://mcp.provider.internal/${disc.id}`,
        transport: 'sse',
        status: 'connected',
        toolsCount: 5,
        icon: disc.icon,
      };
      setConnectors((prev) => [...prev, newConn]);
    }
  };

  const filteredConnectors = connectors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredDiscover = DISCOVER_CONNECTORS.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col text-text-primary">
      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col gap-3 pb-4">
        <h3 className="text-lg font-semibold text-text-primary">Connectors</h3>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connectors and MCP servers"
            className="w-full rounded-xl border border-border-light bg-surface-secondary/50 py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
          />
        </div>
      </div>

      {/* TABS & TOP-RIGHT CONTROLS */}
      <div className="flex items-center justify-between border-b border-border-light pb-3">
        <div className="flex items-center gap-4 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('yours')}
            className={cn(
              'pb-1 font-medium transition-colors',
              activeTab === 'yours'
                ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                : 'text-text-tertiary hover:text-text-primary',
            )}
          >
            Your connectors ({connectors.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('discover')}
            className={cn(
              'pb-1 font-medium transition-colors',
              activeTab === 'discover'
                ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                : 'text-text-tertiary hover:text-text-primary',
            )}
          >
            Discover
          </button>
        </div>

        {activeTab === 'yours' && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 rounded-lg bg-text-primary px-2.5 py-1 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add custom connector</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'yours' ? (
        <div className="pt-4">
          <div className="divide-y divide-border-light/60 overflow-hidden rounded-xl border border-border-light/60 bg-surface-primary">
            {filteredConnectors.map((connector) => (
              <div
                key={connector.id}
                className="group flex items-center justify-between px-3.5 py-3 transition-colors hover:bg-surface-secondary/40"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-text-secondary">
                    {connector.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary">
                        {connector.name}
                      </span>
                      <span className="py-0.2 flex items-center gap-1 rounded-md bg-green-500/10 px-1.5 text-[10px] font-medium text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Connected
                      </span>
                      <span className="py-0.2 rounded bg-surface-secondary px-1.5 font-mono text-[10px] text-text-tertiary">
                        {connector.transport}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-text-secondary">
                      {connector.description}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 pl-3">
                  <span className="text-[11px] text-text-tertiary">
                    {connector.toolsCount} tools
                  </span>
                  <button
                    type="button"
                    className="rounded p-1 text-text-tertiary hover:bg-surface-secondary hover:text-text-primary"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* DISCOVER TAB */
        <div className="pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredDiscover.map((disc) => {
              const isAdded = addedDiscover[disc.id];
              return (
                <div
                  key={disc.id}
                  className="shadow-xs flex flex-col justify-between rounded-xl border border-border-light bg-surface-primary p-3.5 transition-colors hover:border-border-medium"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-secondary text-text-secondary">
                          {disc.icon}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-text-primary">
                            {disc.title}
                          </span>
                          <span className="ml-2 text-[10px] text-text-tertiary">
                            {disc.category}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleDiscover(disc)}
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
                          isAdded
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-border-light bg-surface-primary text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
                        )}
                        aria-label={`Add ${disc.title}`}
                      >
                        {isAdded ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                      {disc.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AddConnectorModal open={modalOpen} onOpenChange={setModalOpen} onAdd={handleAddConnector} />
    </div>
  );
}
