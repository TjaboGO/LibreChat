/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, Link as LinkIcon, Search, Play } from 'lucide-react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';
import { cn } from '~/utils';

interface PromptItem {
  id: string;
  title: string;
  variables: number;
  template: string;
}

interface ChainItem {
  id: string;
  title: string;
  variables: number;
  steps: number;
  template: string;
}

interface CodePromptsChainsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPrompt?: (template: string) => void;
}

export default function CodePromptsChainsModal({
  open,
  onOpenChange,
  onSelectPrompt,
}: CodePromptsChainsModalProps) {
  const [activeTab, setActiveTab] = useState<'prompts' | 'chains'>('prompts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const [prompts, setPrompts] = useState<PromptItem[]>([
    {
      id: 'p-1',
      title: 'Email Rewriter',
      variables: 2,
      template:
        'Rewrite the following email with a professional yet concise tone:\n\n{{email_text}}',
    },
    {
      id: 'p-2',
      title: 'Component Unit Test Writer',
      variables: 1,
      template:
        'Generate comprehensive Jest and React Testing Library tests for:\n\n{{component_code}}',
    },
    {
      id: 'p-3',
      title: 'Git Commit Message Drafter',
      variables: 1,
      template: 'Analyze git diff and draft conventional commit message:\n\n{{git_diff}}',
    },
  ]);

  const [chains, setChains] = useState<ChainItem[]>([
    {
      id: 'c-1',
      title: 'Research & Summarize',
      variables: 1,
      steps: 2,
      template: 'Step 1: Deep research on {{topic}}\nStep 2: Executive bullet summary.',
    },
    {
      id: 'c-2',
      title: 'Bug Reproducer & Spec Generator',
      variables: 3,
      steps: 3,
      template:
        'Step 1: Reproduce {{error_log}}\nStep 2: Isolate root cause\nStep 3: Draft test spec.',
    },
  ]);

  const selectedCount = Object.values(selectedIds).filter(Boolean).length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteSelected = () => {
    if (activeTab === 'prompts') {
      setPrompts((prev) => prev.filter((p) => !selectedIds[p.id]));
    } else {
      setChains((prev) => prev.filter((c) => !selectedIds[c.id]));
    }
    setSelectedIds({});
  };

  const handleUse = (template: string) => {
    if (onSelectPrompt) {
      onSelectPrompt(template);
    }
    onOpenChange(false);
  };

  const filteredPrompts = prompts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredChains = chains.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent
        showCloseButton={false}
        className="max-w-xl rounded-2xl bg-surface-primary p-6 text-text-primary shadow-2xl"
      >
        {/* HEADER */}
        <OGDialogHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <OGDialogTitle className="sr-only">Prompts and Chains</OGDialogTitle>
            <div className="flex rounded-lg bg-surface-secondary/70 p-0.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('prompts');
                  setSelectedIds({});
                }}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  activeTab === 'prompts'
                    ? 'shadow-xs bg-orange-600 text-white'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                Prompts
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('chains');
                  setSelectedIds({});
                }}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  activeTab === 'chains'
                    ? 'shadow-xs bg-orange-600 text-white'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                Chains
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-border-light bg-surface-primary px-3 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{activeTab === 'prompts' ? 'Add Prompt' : 'Add Chain'}</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={selectedCount === 0}
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                selectedCount > 0
                  ? 'border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20'
                  : 'cursor-not-allowed text-text-tertiary opacity-50',
              )}
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete Selected</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </OGDialogHeader>

        {/* SEARCH */}
        <div className="py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'prompts' ? 'Search prompts…' : 'Search chains…'}
              className="w-full rounded-xl border border-border-light bg-surface-secondary/50 py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-tertiary focus:border-orange-500 focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* LIST */}
        <div className="mt-2 max-h-96 min-h-60 overflow-y-auto">
          {activeTab === 'prompts' && filteredPrompts.length === 0 && (
            <div className="py-12 text-center text-xs text-text-tertiary">No prompts found.</div>
          )}

          {activeTab === 'prompts' && filteredPrompts.length > 0 && (
            <div className="divide-y divide-border-light/60 rounded-xl border border-border-light/60 bg-surface-primary">
              {filteredPrompts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 transition-colors hover:bg-surface-secondary/40"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedIds[p.id])}
                      onChange={() => toggleSelect(p.id)}
                      className="h-3.5 w-3.5 rounded border-border-light text-orange-600 focus:ring-orange-500"
                    />
                    <FileText className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="text-xs font-semibold text-text-primary">{p.title}</div>
                      <div className="text-[11px] text-text-tertiary">
                        {p.variables} {p.variables === 1 ? 'variable' : 'variables'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUse(p.template)}
                    className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-orange-700"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Use</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chains' && filteredChains.length === 0 && (
            <div className="py-12 text-center text-xs text-text-tertiary">No chains found.</div>
          )}

          {activeTab === 'chains' && filteredChains.length > 0 && (
            <div className="divide-y divide-border-light/60 rounded-xl border border-border-light/60 bg-surface-primary">
              {filteredChains.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 transition-colors hover:bg-surface-secondary/40"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedIds[c.id])}
                      onChange={() => toggleSelect(c.id)}
                      className="h-3.5 w-3.5 rounded border-border-light text-orange-600 focus:ring-orange-500"
                    />
                    <LinkIcon className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="text-xs font-semibold text-text-primary">{c.title}</div>
                      <div className="text-[11px] text-text-tertiary">
                        {c.variables} {c.variables === 1 ? 'variable' : 'variables'} · {c.steps}{' '}
                        steps
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUse(c.template)}
                    className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-orange-700"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Use</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </OGDialogContent>
    </OGDialog>
  );
}
