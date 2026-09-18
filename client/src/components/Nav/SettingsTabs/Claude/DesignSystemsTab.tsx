/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { Plus, ChevronDown, Search, Info, Palette, Sparkles, Terminal } from 'lucide-react';

export default function DesignSystemsTab() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col text-text-primary">
      {/* HEADER & ACTION BUTTON */}
      <div className="flex items-start justify-between pb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Design systems</h3>
          <p className="mt-1 max-w-lg text-xs leading-relaxed text-text-secondary">
            Design systems give Claude your colors, type and components to use when making designs,
            decks and prototypes.
          </p>
        </div>

        {/* NEW DESIGN SYSTEM DROPDOWN */}
        <Ariakit.MenuProvider>
          <Ariakit.MenuButton
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-text-primary px-3 py-1.5 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
            aria-label="New design system"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New design system</span>
            <ChevronDown className="h-3 w-3" />
          </Ariakit.MenuButton>
          <Ariakit.Menu
            portal
            gutter={6}
            className="z-[150] min-w-64 rounded-xl border border-border-light bg-surface-primary p-1.5 text-text-primary shadow-xl"
          >
            <Ariakit.MenuItem className="flex cursor-pointer flex-col rounded-lg p-2 hover:bg-surface-secondary">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-text-primary">Using Claude</span>
              </div>
              <span className="pl-5.5 mt-0.5 text-[11px] text-text-tertiary">
                Upload brand files, pull from design connectors, or describe it
              </span>
            </Ariakit.MenuItem>
            <Ariakit.MenuItem className="flex cursor-pointer flex-col rounded-lg p-2 hover:bg-surface-secondary">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-text-secondary" />
                <span className="text-xs font-semibold text-text-primary">Using Claude Code</span>
              </div>
              <span className="pl-5.5 mt-0.5 text-[11px] text-text-tertiary">
                Claude Code reads your repo&apos;s tokens and components
              </span>
            </Ariakit.MenuItem>
          </Ariakit.Menu>
        </Ariakit.MenuProvider>
      </div>

      {/* SEARCH FIELD */}
      <div className="py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name"
            className="w-full rounded-xl border border-border-light bg-surface-secondary/50 py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
          />
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="mt-4 border-b border-border-light pb-2 text-[11px] font-medium text-text-tertiary">
        <div className="grid grid-cols-12 px-3">
          <div className="col-span-6">Name</div>
          <div className="col-span-4 flex items-center gap-1">
            <span>Usable by</span>
            <Info className="h-3 w-3" />
          </div>
          <div className="col-span-2 text-right">Published</div>
        </div>
      </div>

      {/* EMPTY STATE */}
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-secondary text-text-tertiary">
          <Palette className="h-6 w-6" />
        </div>
        <p className="mt-4 max-w-sm text-xs leading-relaxed text-text-secondary">
          No design systems yet. Make one, or ask a teammate to share one with you, and it shows up
          here.
        </p>
      </div>
    </div>
  );
}
