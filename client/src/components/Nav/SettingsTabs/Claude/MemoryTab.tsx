/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Switch } from '@librechat/client';
import { ChevronDown, ChevronRight, Pencil, Trash2, ArrowUp } from 'lucide-react';
import MemoryDetailView, { type MemoryEntry } from './MemoryDetailView';
import ImportMemoryModal from './ImportMemoryModal';

const INITIAL_MEMORIES: MemoryEntry[] = [
  {
    id: 'mem-1',
    category: 'you',
    label: 'Preferences',
    summary: 'Prefers concise responses, TypeScript code, and dark theme references.',
    details: [
      'Always use functional React components with hooks.',
      'Prefer Tailwind CSS tokens over arbitrary hex colors.',
      'Prefers Scandinavian style design aesthetics and minimal UI.',
    ],
    updatedAt: '2 days ago',
  },
  {
    id: 'mem-2',
    category: 'you',
    label: 'Profile',
    summary: 'Software engineer building a Claude clone on OpenRouter.',
    details: [
      'Experienced in full-stack TypeScript, React, and Node.js.',
      'Active contributor to open-source agent tooling.',
    ],
    updatedAt: 'Sep 14',
  },
  {
    id: 'mem-3',
    category: 'topics',
    label: 'Model Context Protocol',
    summary: 'Working with stdio and SSE transports for tool integrations.',
    details: [
      'Configured local MCP servers for filesystem and git operations.',
      'Using JSON-RPC 2.0 specs for tool definitions.',
    ],
    updatedAt: 'Sep 17',
  },
  {
    id: 'mem-4',
    category: 'projects',
    projectName: 'Claude Copycat',
    label: 'Architecture & Rules',
    summary: 'Local fork of LibreChat connecting to OpenRouter DeepSeek models.',
    details: [
      'Respects AGENTS.md workflow conventions.',
      'Never commit broken types or hardcoded credentials.',
    ],
    updatedAt: 'Yesterday',
  },
];

export default function MemoryTab() {
  // Toggles
  const [searchChats, setSearchChats] = useState(true);
  const [generateMemory, setGenerateMemory] = useState(true);
  const [sensitiveTopics, setSensitiveTopics] = useState(true);

  // Modals & Active Detail
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [activeEntry, setActiveEntry] = useState<MemoryEntry | null>(null);

  // Memories & Project Collapsible State
  const [memories, setMemories] = useState<MemoryEntry[]>(INITIAL_MEMORIES);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    'Claude Copycat': true,
  });

  // Natural language command input
  const [commandText, setCommandText] = useState('');

  const toggleProject = (projectName: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectName]: !prev[projectName],
    }));
  };

  const handleDelete = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (activeEntry?.id === id) {
      setActiveEntry(null);
    }
  };

  const handleUpdateDetails = (id: string, newInstruction: string) => {
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            details: [...m.details, newInstruction],
            updatedAt: 'Just now',
          };
        }
        return m;
      }),
    );
  };

  const handleAddMemoryFromCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandText.trim()) {
      return;
    }
    const newEntry: MemoryEntry = {
      id: `mem-${Date.now()}`,
      category: 'you',
      label: 'Custom note',
      summary: commandText.trim(),
      details: [commandText.trim()],
      updatedAt: 'Just now',
    };
    setMemories((prev) => [newEntry, ...prev]);
    setCommandText('');
  };

  const handleImportMemory = (importedText: string) => {
    const lines = importedText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const newEntry: MemoryEntry = {
      id: `mem-${Date.now()}`,
      category: 'topics',
      label: 'Imported memory',
      summary: lines[0] || 'Imported memory details',
      details: lines.length > 1 ? lines : ['Imported context details.'],
      updatedAt: 'Just now',
    };
    setMemories((prev) => [newEntry, ...prev]);
  };

  if (activeEntry) {
    return (
      <MemoryDetailView
        entry={activeEntry}
        onBack={() => setActiveEntry(null)}
        onDelete={handleDelete}
        onUpdateDetails={handleUpdateDetails}
      />
    );
  }

  const youMemories = memories.filter((m) => m.category === 'you');
  const topicMemories = memories.filter((m) => m.category === 'topics');
  const projectMemories = memories.filter((m) => m.category === 'projects');

  // Group project memories by projectName
  const projectsByName: Record<string, MemoryEntry[]> = {};
  projectMemories.forEach((mem) => {
    const name = mem.projectName || 'Default Project';
    if (!projectsByName[name]) {
      projectsByName[name] = [];
    }
    projectsByName[name].push(mem);
  });

  return (
    <div className="flex flex-col text-text-primary">
      {/* SECTION: Memory Settings */}
      <div className="border-b border-border-light pb-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Memory</h3>
        <div className="flex flex-col gap-4">
          {/* Search and reference chats */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">
                Search and reference chats
              </div>
              <div className="text-xs text-text-tertiary">
                Allow Claude to search for relevant details in past chats.{' '}
                <span className="cursor-pointer underline hover:text-text-primary">
                  Learn more.
                </span>
              </div>
            </div>
            <Switch
              checked={searchChats}
              onCheckedChange={setSearchChats}
              aria-label="Search and reference chats"
            />
          </div>

          {/* Generate memory from chats */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">
                Generate memory from chats
              </div>
              <div className="text-xs text-text-tertiary">
                Allow Claude to generate memory from your chats.{' '}
                <span className="cursor-pointer underline hover:text-text-primary">
                  Learn more.
                </span>
              </div>
            </div>
            <Switch
              checked={generateMemory}
              onCheckedChange={setGenerateMemory}
              aria-label="Generate memory from chats"
            />
          </div>

          {/* Include sensitive topics in memory */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">
                Include sensitive topics in memory
              </div>
              <div className="text-xs text-text-tertiary">
                Allow Claude to save details about sensitive topics like health conditions or
                religious beliefs to memory.{' '}
                <span className="cursor-pointer underline hover:text-text-primary">
                  Learn more.
                </span>
              </div>
            </div>
            <Switch
              checked={sensitiveTopics}
              onCheckedChange={setSensitiveTopics}
              aria-label="Include sensitive topics in memory"
            />
          </div>

          {/* Import memory from other AI providers */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">
                Import memory from other AI providers
              </div>
              <div className="text-xs text-text-tertiary">
                Bring relevant context and data from another AI provider to Claude. We&apos;ll
                provide a prompt you can use to fetch the memory from your other account.{' '}
                <span className="cursor-pointer underline hover:text-text-primary">
                  Learn more.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              className="rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            >
              Start import
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: Stored Memory Entries */}
      <div className="flex flex-col gap-6 py-6">
        {/* YOU */}
        {youMemories.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              You
            </div>
            <div className="divide-y divide-border-light/60 overflow-hidden rounded-xl border border-border-light/60 bg-surface-primary">
              {youMemories.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setActiveEntry(entry)}
                  className="group flex cursor-pointer items-center justify-between px-3.5 py-2.5 transition-colors hover:bg-surface-secondary/60"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="w-24 shrink-0 text-xs font-semibold text-text-primary">
                      {entry.label}
                    </span>
                    <span className="truncate text-xs text-text-secondary">{entry.summary}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 pl-3">
                    <span className="text-[11px] text-text-tertiary group-hover:hidden">
                      Updated {entry.updatedAt}
                    </span>
                    <div className="hidden items-center gap-1 group-hover:flex">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveEntry(entry);
                        }}
                        className="rounded p-1 text-text-tertiary hover:bg-surface-secondary hover:text-text-primary"
                        aria-label="Edit memory"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                        className="rounded p-1 text-text-tertiary hover:bg-surface-secondary hover:text-red-500"
                        aria-label="Delete memory"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOPICS */}
        {topicMemories.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Topics
            </div>
            <div className="divide-y divide-border-light/60 overflow-hidden rounded-xl border border-border-light/60 bg-surface-primary">
              {topicMemories.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setActiveEntry(entry)}
                  className="group flex cursor-pointer items-center justify-between px-3.5 py-2.5 transition-colors hover:bg-surface-secondary/60"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="w-32 shrink-0 text-xs font-semibold text-text-primary">
                      {entry.label}
                    </span>
                    <span className="truncate text-xs text-text-secondary">{entry.summary}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 pl-3">
                    <span className="text-[11px] text-text-tertiary group-hover:hidden">
                      Updated {entry.updatedAt}
                    </span>
                    <div className="hidden items-center gap-1 group-hover:flex">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveEntry(entry);
                        }}
                        className="rounded p-1 text-text-tertiary hover:bg-surface-secondary hover:text-text-primary"
                        aria-label="Edit memory"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                        className="rounded p-1 text-text-tertiary hover:bg-surface-secondary hover:text-red-500"
                        aria-label="Delete memory"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {Object.keys(projectsByName).length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Projects
            </div>
            <div className="flex flex-col gap-2">
              {Object.entries(projectsByName).map(([projName, items]) => {
                const isExpanded = expandedProjects[projName] ?? true;
                return (
                  <div
                    key={projName}
                    className="overflow-hidden rounded-xl border border-border-light/60 bg-surface-primary"
                  >
                    <button
                      type="button"
                      onClick={() => toggleProject(projName)}
                      className="flex w-full items-center justify-between bg-surface-secondary/40 px-3.5 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                    >
                      <span className="flex items-center gap-1.5 font-semibold">
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />
                        )}
                        <span>{projName}</span>
                      </span>
                      <span className="text-[11px] text-text-tertiary">{items.length} items</span>
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-border-light/60">
                        {items.map((entry) => (
                          <div
                            key={entry.id}
                            onClick={() => setActiveEntry(entry)}
                            className="group flex cursor-pointer items-center justify-between px-3.5 py-2.5 transition-colors hover:bg-surface-secondary/60"
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <span className="w-32 shrink-0 text-xs font-medium text-text-primary">
                                {entry.label}
                              </span>
                              <span className="truncate text-xs text-text-secondary">
                                {entry.summary}
                              </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 pl-3">
                              <span className="text-[11px] text-text-tertiary group-hover:hidden">
                                Updated {entry.updatedAt}
                              </span>
                              <div className="hidden items-center gap-1 group-hover:flex">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveEntry(entry);
                                  }}
                                  className="rounded p-1 text-text-tertiary hover:bg-surface-secondary hover:text-text-primary"
                                  aria-label="Edit memory"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(entry.id);
                                  }}
                                  className="rounded p-1 text-text-tertiary hover:bg-surface-secondary hover:text-red-500"
                                  aria-label="Delete memory"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NL COMMAND BAR */}
      <form
        onSubmit={handleAddMemoryFromCommand}
        className="sticky bottom-0 bg-surface-primary pt-2"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            placeholder="Tell Claude what to change or remove"
            className="w-full rounded-full border border-border-light bg-surface-secondary/70 py-2.5 pl-4 pr-11 text-xs text-text-primary transition-colors placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
          />
          <button
            type="submit"
            disabled={!commandText.trim()}
            className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-text-primary text-surface-primary transition-colors hover:bg-text-primary/90 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Send memory edit"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      <ImportMemoryModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImport={handleImportMemory}
      />
    </div>
  );
}
