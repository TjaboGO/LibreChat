/* eslint-disable i18next/no-literal-string */
import React from 'react';
import { Puzzle } from 'lucide-react';

export default function ExtensionsTab() {
  return (
    <div className="flex flex-col text-text-primary">
      {/* HEADER */}
      <div className="border-b border-border-light pb-4">
        <h3 className="text-lg font-semibold text-text-primary">Extensions</h3>
        <p className="mt-1 text-xs text-text-secondary">
          Manage installed desktop extensions and environment add-ons.
        </p>
      </div>

      {/* EMPTY STATE */}
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-text-tertiary">
          <Puzzle className="h-7 w-7" />
        </div>
        <h4 className="mt-4 text-sm font-semibold text-text-primary">No extensions installed</h4>
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
          Extensions extend Claude with browser integrations, IDE bridges, and system utilities.
        </p>
        <button
          type="button"
          className="mt-6 rounded-lg bg-text-primary px-4 py-2 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
        >
          Browse extensions
        </button>
      </div>
    </div>
  );
}
