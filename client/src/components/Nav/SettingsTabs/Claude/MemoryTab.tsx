/* eslint-disable i18next/no-literal-string */
import React, { useState, useMemo, useEffect } from 'react';
import { Switch, Spinner } from '@librechat/client';
import { ChevronDown, ChevronRight, Pencil, Trash2, ArrowUp } from 'lucide-react';
import type { TUserMemory } from 'librechat-data-provider';
import {
  useMemoriesQuery,
  useCreateMemoryMutation,
  useUpdateMemoryMutation,
  useDeleteMemoryMutation,
  useUpdateMemoryPreferencesMutation,
  useGetUserQuery,
} from '~/data-provider';
import MemoryDetailView, { type MemoryEntry } from './MemoryDetailView';
import ImportMemoryModal from './ImportMemoryModal';

function formatMemoryDate(dateStr?: string): string {
  if (!dateStr) {
    return 'Recently';
  }
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMinutes < 2) {
      return 'Just now';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function generateMemoryKey(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
  const randomSuffix =
    Math.random()
      .toString(36)
      .replace(/[^a-z]/g, '')
      .slice(0, 5) || 'note';
  const key = slug ? `${slug}_${randomSuffix}` : `note_${randomSuffix}`;
  return key.replace(/[^a-z_]/g, '') || 'user_note';
}

function mapUserMemoryToEntry(mem: TUserMemory): MemoryEntry {
  const isAgent = Boolean(mem.agentId);
  const key = mem.key || '';
  let category: 'you' | 'topics' | 'projects' = 'you';
  if (isAgent || key.startsWith('project_') || key.startsWith('proj_')) {
    category = 'projects';
  } else if (key.startsWith('topic_') || key.startsWith('topic')) {
    category = 'topics';
  }

  const label =
    key
      .replace(/^(topic_|project_|proj_|user_)/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Memory';

  const lines = mem.value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const summary = mem.summary || lines[0] || mem.value;
  const details = lines.length > 0 ? lines : [mem.value];

  return {
    id: mem._id || mem.key,
    rawKey: mem.key,
    agentId: mem.agentId,
    rawValue: mem.value,
    category,
    projectName: mem.agentName || (isAgent ? 'Agent Project' : undefined),
    label,
    summary,
    details,
    updatedAt: formatMemoryDate(mem.updated_at),
  };
}

export default function MemoryTab() {
  const { data: userData } = useGetUserQuery();
  const { data: memData, isLoading } = useMemoriesQuery();
  const createMemoryMutation = useCreateMemoryMutation();
  const updateMemoryMutation = useUpdateMemoryMutation();
  const deleteMemoryMutation = useDeleteMemoryMutation();
  const updateMemoryPreferencesMutation = useUpdateMemoryPreferencesMutation();

  // Settings Toggles
  const [searchChats, setSearchChats] = useState(true);
  const [generateMemory, setGenerateMemory] = useState(true);
  const [sensitiveTopics, setSensitiveTopics] = useState(true);

  // Sync personalization preferences
  useEffect(() => {
    if (userData?.personalization?.memories !== undefined) {
      setGenerateMemory(userData.personalization.memories);
    }
  }, [userData?.personalization?.memories]);

  // Modals & Active Detail
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  // Expanded projects in UI
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  // Natural language command input
  const [commandText, setCommandText] = useState('');

  const memories: MemoryEntry[] = useMemo(() => {
    return (memData?.memories ?? []).map(mapUserMemoryToEntry);
  }, [memData?.memories]);

  const activeEntry = useMemo(() => {
    if (!activeEntryId) {
      return null;
    }
    return memories.find((m) => m.id === activeEntryId) ?? null;
  }, [activeEntryId, memories]);

  const handleToggleGenerateMemory = (checked: boolean) => {
    setGenerateMemory(checked);
    updateMemoryPreferencesMutation.mutate({ memories: checked });
  };

  const toggleProject = (projectName: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectName]: !prev[projectName],
    }));
  };

  const handleDelete = (id: string) => {
    const entry = memories.find((m) => m.id === id);
    if (!entry) {
      return;
    }
    deleteMemoryMutation.mutate({
      key: entry.rawKey,
      id: entry.id,
      agentId: entry.agentId,
    });
    if (activeEntryId === id) {
      setActiveEntryId(null);
    }
  };

  const handleUpdateDetails = (id: string, newInstruction: string) => {
    const entry = memories.find((m) => m.id === id);
    if (!entry) {
      return;
    }
    const updatedValue = entry.rawValue ? `${entry.rawValue}\n${newInstruction}` : newInstruction;
    updateMemoryMutation.mutate({
      id: entry.id,
      key: entry.rawKey,
      value: updatedValue,
      agentId: entry.agentId,
    });
  };

  const handleAddMemoryFromCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const text = commandText.trim();
    if (!text) {
      return;
    }
    const key = generateMemoryKey(text);
    createMemoryMutation.mutate({
      key,
      value: text,
    });
    setCommandText('');
  };

  const handleImportMemory = (importedText: string) => {
    const trimmed = importedText.trim();
    if (!trimmed) {
      return;
    }
    const key = generateMemoryKey('imported_memory');
    createMemoryMutation.mutate({
      key,
      value: trimmed,
    });
  };

  if (activeEntry) {
    return (
      <MemoryDetailView
        entry={activeEntry}
        onBack={() => setActiveEntryId(null)}
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
              onCheckedChange={handleToggleGenerateMemory}
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
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Spinner className="size-6 text-text-tertiary" />
          </div>
        )}

        {!isLoading && memories.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-light/60 py-10 text-center">
            <div className="text-xs font-medium text-text-secondary">No memories stored yet</div>
            <p className="mt-1 max-w-sm text-xs text-text-tertiary">
              Claude can remember personal preferences, projects, and key topics across
              conversations. Type an instruction below or start an import to add memory.
            </p>
          </div>
        )}

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
                  onClick={() => setActiveEntryId(entry.id)}
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
                          setActiveEntryId(entry.id);
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
                  onClick={() => setActiveEntryId(entry.id)}
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
                          setActiveEntryId(entry.id);
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
                            onClick={() => setActiveEntryId(entry.id)}
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
                                    setActiveEntryId(entry.id);
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
