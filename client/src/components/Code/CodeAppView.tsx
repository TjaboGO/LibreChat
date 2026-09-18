/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { useMediaQuery } from '@librechat/client';
import { Terminal, Clock, Folder, Layers, Sparkles, ChevronRight, Code2 } from 'lucide-react';
import OpenSidebar from '~/components/Chat/Menus/OpenSidebar';
import CodePromptsChainsModal from './CodePromptsChainsModal';
import CodeRoutinesView from './CodeRoutinesView';
import CodeFoldersModal from './CodeFoldersModal';
import CodeDashboard from './CodeDashboard';
import { cn } from '~/utils';

export type CodeTab = 'dashboard' | 'routines';

export default function CodeAppView() {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const [activeTab, setActiveTab] = useState<CodeTab>('dashboard');
  const [showFoldersModal, setShowFoldersModal] = useState(false);
  const [showPromptsModal, setShowPromptsModal] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden bg-presentation">
      {/* SECONDARY CODE NAV RAIL (if desired on desktop) */}
      <div className="flex hidden w-56 flex-col justify-between border-r border-border-light bg-surface-primary/40 p-3 md:flex">
        <div className="flex flex-col gap-1">
          <div className="mb-2 flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2 font-serif text-sm font-semibold text-text-primary">
              <Terminal className="h-4 w-4 text-orange-600" />
              <span>Claude Code</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
              activeTab === 'dashboard'
                ? 'bg-surface-secondary font-semibold text-text-primary'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
            )}
          >
            <Code2 className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('routines')}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
              activeTab === 'routines'
                ? 'bg-surface-secondary font-semibold text-text-primary'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
            )}
          >
            <Clock className="h-4 w-4" />
            <span>Routines</span>
          </button>

          <div className="my-2 border-t border-border-light/60" />

          <button
            type="button"
            onClick={() => setShowFoldersModal(true)}
            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
          >
            <div className="flex items-center gap-2.5">
              <Folder className="h-4 w-4 text-orange-600" />
              <span>Folders</span>
            </div>
            <ChevronRight className="h-3 w-3 text-text-tertiary" />
          </button>

          <button
            type="button"
            onClick={() => setShowPromptsModal(true)}
            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-orange-600" />
              <span>Prompts & Chains</span>
            </div>
            <ChevronRight className="h-3 w-3 text-text-tertiary" />
          </button>
        </div>

        {/* FOOTER CHIP */}
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-orange-700 dark:text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Claude Code Pro</span>
          </div>
          <p className="mt-1 text-[11px] text-text-secondary">
            Multi-repo coding agents & local terminal sync.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* MOBILE HEADER */}
        {isSmallScreen && (
          <header className="flex h-12 items-center justify-between border-b border-border-light px-4">
            <div className="flex items-center gap-2">
              <OpenSidebar className="size-8" />
              <span className="font-serif text-sm font-semibold">Claude Code</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  'rounded-md px-2.5 py-1',
                  activeTab === 'dashboard'
                    ? 'bg-surface-secondary font-semibold'
                    : 'text-text-secondary',
                )}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('routines')}
                className={cn(
                  'rounded-md px-2.5 py-1',
                  activeTab === 'routines'
                    ? 'bg-surface-secondary font-semibold'
                    : 'text-text-secondary',
                )}
              >
                Routines
              </button>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-hidden">
          {activeTab === 'dashboard' ? <CodeDashboard /> : <CodeRoutinesView />}
        </div>
      </div>

      {showFoldersModal && (
        <CodeFoldersModal open={showFoldersModal} onOpenChange={setShowFoldersModal} />
      )}
      {showPromptsModal && (
        <CodePromptsChainsModal open={showPromptsModal} onOpenChange={setShowPromptsModal} />
      )}
    </div>
  );
}
