/* eslint-disable i18next/no-literal-string */
import React from 'react';
import { Terminal, ExternalLink } from 'lucide-react';

export default function DeveloperTab() {
  return (
    <div className="flex flex-col text-text-primary">
      {/* HEADER */}
      <div className="border-b border-border-light pb-4">
        <h3 className="text-lg font-semibold text-text-primary">Local MCP servers</h3>
        <p className="mt-1 text-xs text-text-secondary">
          Add and manage MCP servers that you&apos;re working on.
        </p>
      </div>

      {/* EMPTY STATE */}
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-text-tertiary">
          <Terminal className="h-7 w-7" />
        </div>
        <h4 className="mt-4 text-sm font-semibold text-text-primary">No servers added</h4>
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
          Connect local MCP servers over stdio or SSE to test custom tools and resources.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-text-primary px-4 py-2 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
          >
            Edit config
          </button>
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-border-light bg-surface-primary px-3.5 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            <span>Developer docs</span>
            <ExternalLink className="h-3 w-3 text-text-tertiary" />
          </a>
        </div>
      </div>
    </div>
  );
}
