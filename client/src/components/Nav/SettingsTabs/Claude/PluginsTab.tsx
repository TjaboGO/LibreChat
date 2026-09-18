/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import {
  Search,
  Plus,
  Check,
  Package,
  Sparkles,
  Layers,
  Database,
  MessageSquare,
} from 'lucide-react';
import { cn } from '~/utils';

interface PluginBundle {
  id: string;
  name: string;
  description: string;
  includedTools: string[];
  author: string;
  icon: React.ReactNode;
}

const DISCOVER_PLUGINS: PluginBundle[] = [
  {
    id: 'plug-gh-review',
    name: 'GitHub + PR Reviewer',
    description:
      'Comprehensive code review bundle combining GitHub MCP tools and automated diff inspection skills.',
    includedTools: ['GitHub Connector', 'Diff Review Skill', 'CI Monitor'],
    author: 'Anthropic',
    icon: <Sparkles className="h-4 w-4 text-purple-500" />,
  },
  {
    id: 'plug-figma-ui',
    name: 'Figma + UI Generator',
    description: 'Generates responsive Tailwind components directly from Figma frames and tokens.',
    includedTools: ['Figma Connector', 'Tailwind Generator', 'Contrast Checker'],
    author: 'Design Lab',
    icon: <Layers className="h-4 w-4 text-rose-500" />,
  },
  {
    id: 'plug-postgres-analyst',
    name: 'PostgreSQL + Data Analyst',
    description: 'Query optimization, schema visualization, and report drafting in one bundle.',
    includedTools: ['PostgreSQL Connector', 'SQL Query Planner', 'Chart Renderer'],
    author: 'Community',
    icon: <Database className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 'plug-slack-standup',
    name: 'Slack + Standup Assistant',
    description:
      'Collects daily updates, drafts asynchronous standup digests, and posts summary threads.',
    includedTools: ['Slack Connector', 'Summary Drafter', 'Reminder Scheduler'],
    author: 'Anthropic',
    icon: <MessageSquare className="h-4 w-4 text-emerald-500" />,
  },
];

export default function PluginsTab() {
  const [activeTab, setActiveTab] = useState<'yours' | 'discover'>('yours');
  const [searchQuery, setSearchQuery] = useState('');
  const [installedPlugins, setInstalledPlugins] = useState<Record<string, boolean>>({});

  const toggleInstall = (id: string) => {
    setInstalledPlugins((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPlugins = DISCOVER_PLUGINS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const yourInstalled = DISCOVER_PLUGINS.filter((p) => installedPlugins[p.id]);

  return (
    <div className="flex flex-col text-text-primary">
      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col gap-3 pb-4">
        <h3 className="text-lg font-semibold text-text-primary">Plugins</h3>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins"
            className="w-full rounded-xl border border-border-light bg-surface-secondary/50 py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-4 border-b border-border-light pb-3 text-xs">
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
          Your plugins ({yourInstalled.length})
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

      {/* TAB CONTENT */}
      {activeTab === 'yours' ? (
        <div className="pt-4">
          {yourInstalled.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-secondary text-text-tertiary">
                <Package className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-xs font-semibold text-text-primary">
                No plugins installed yet
              </h4>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
                Plugins bundle skills and connectors together into powerful specialized workflows.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                className="mt-4 rounded-lg bg-text-primary px-3 py-1.5 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
              >
                Explore plugins
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {yourInstalled.map((plug) => (
                <div
                  key={plug.id}
                  className="shadow-xs flex flex-col justify-between rounded-xl border border-border-light bg-surface-primary p-3.5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-secondary">
                        {plug.icon}
                      </div>
                      <span className="text-xs font-semibold text-text-primary">{plug.name}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                      {plug.description}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border-light/60 pt-2.5">
                    <span className="text-[11px] font-medium text-text-tertiary">Active</span>
                    <button
                      type="button"
                      onClick={() => toggleInstall(plug.id)}
                      className="text-xs text-red-500 transition-colors hover:text-red-600"
                    >
                      Uninstall
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* DISCOVER */
        <div className="pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredPlugins.map((plug) => {
              const isInstalled = installedPlugins[plug.id];
              return (
                <div
                  key={plug.id}
                  className="shadow-xs flex flex-col justify-between rounded-xl border border-border-light bg-surface-primary p-3.5 transition-colors hover:border-border-medium"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-secondary">
                          {plug.icon}
                        </div>
                        <span className="text-xs font-semibold text-text-primary">{plug.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleInstall(plug.id)}
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
                          isInstalled
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-border-light bg-surface-primary text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
                        )}
                        aria-label={`Install ${plug.name}`}
                      >
                        {isInstalled ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                      {plug.description}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {plug.includedTools.map((t, idx) => (
                        <span
                          key={idx}
                          className="py-0.2 rounded bg-surface-secondary px-1.5 text-[10px] text-text-tertiary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-text-tertiary">by {plug.author}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
