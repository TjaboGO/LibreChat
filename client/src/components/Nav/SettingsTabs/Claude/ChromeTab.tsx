/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Switch } from '@librechat/client';
import { Globe, ExternalLink, ShieldCheck, Trash2, Plus, X } from 'lucide-react';

export default function ChromeTab() {
  const [browseWithClaude, setBrowseWithClaude] = useState(true);
  const [syncSessionContext, setSyncSessionContext] = useState(true);
  const [webSearchAugmentation, setWebSearchAugmentation] = useState(true);
  const [allowedOrigins, setAllowedOrigins] = useState<string[]>([
    'https://github.com',
    'https://docs.anthropic.com',
    'http://localhost:3000',
  ]);
  const [isOriginsModalOpen, setIsOriginsModalOpen] = useState(false);
  const [newOrigin, setNewOrigin] = useState('');

  const handleAddOrigin = () => {
    const trimmed = newOrigin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      setAllowedOrigins([...allowedOrigins, trimmed]);
      setNewOrigin('');
    }
  };

  const handleRemoveOrigin = (origin: string) => {
    setAllowedOrigins(allowedOrigins.filter((o) => o !== origin));
  };

  return (
    <div className="flex flex-col gap-6 text-text-primary">
      {/* HEADER & CONNECTION STATUS CARD */}
      <div>
        <div className="flex items-center justify-between border-b border-border-light pb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Claude in Chrome
          </h3>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Browser companion extension for web research and real-time context synchronization.
        </p>

        <div className="shadow-xs mt-4 rounded-xl border border-border-light bg-surface-primary p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-primary">
                    Google Chrome Companion
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Connected
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-text-secondary">
                  Extension v1.4.2 · Active tab sync enabled
                </div>
              </div>
            </div>
            <a
              href="https://chromewebstore.google.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            >
              <span>Chrome Store</span>
              <ExternalLink className="h-3 w-3 text-text-tertiary" />
            </a>
          </div>
        </div>
      </div>

      {/* SETTINGS ROWS */}
      <div className="divide-y divide-border-light/60">
        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Browse with Claude</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Allow Claude to read active tab contents, DOM snapshots, and search results to assist
              your queries.
            </p>
          </div>
          <Switch
            checked={browseWithClaude}
            onCheckedChange={setBrowseWithClaude}
            aria-label="Browse with Claude"
          />
        </div>

        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Sync session context</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Keep the sidebar companion conversation synchronized with whatever tab you currently
              have active.
            </p>
          </div>
          <Switch
            checked={syncSessionContext}
            onCheckedChange={setSyncSessionContext}
            aria-label="Sync session context"
          />
        </div>

        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Web search augmentation</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Automatically use browser search results to augment Claude responses when researching
              current events.
            </p>
          </div>
          <Switch
            checked={webSearchAugmentation}
            onCheckedChange={setWebSearchAugmentation}
            aria-label="Web search augmentation"
          />
        </div>

        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Allowed companion origins</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Domains where Claude companion can automatically read DOM without individual
              confirmation prompts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOriginsModalOpen(true)}
            className="rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Manage
          </button>
        </div>
      </div>

      {/* MODAL: ALLOWED COMPANION ORIGINS */}
      {isOriginsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border-light bg-surface-primary p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h4 className="text-sm font-semibold text-text-primary">Allowed origins</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsOriginsModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Add URLs or origins where Claude is permitted to read tab content automatically.
            </p>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newOrigin}
                onChange={(e) => setNewOrigin(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddOrigin();
                  }
                }}
                placeholder="e.g. https://docs.example.com"
                className="flex-1 rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 font-mono text-xs text-text-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddOrigin}
                className="flex items-center gap-1 rounded-lg bg-text-primary px-3 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="mt-4 max-h-56 divide-y divide-border-light/60 overflow-y-auto rounded-lg border border-border-light">
              {allowedOrigins.map((orig) => (
                <div key={orig} className="flex items-center justify-between p-2.5">
                  <span className="font-mono text-xs text-text-primary">{orig}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOrigin(orig)}
                    className="text-text-tertiary transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOriginsModalOpen(false)}
                className="rounded-lg bg-text-primary px-4 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
