/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { X, Plug } from 'lucide-react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';

export interface NewConnectorData {
  name: string;
  url: string;
  transport: 'sse' | 'stdio';
  description?: string;
}

interface AddConnectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (connector: NewConnectorData) => void;
}

export default function AddConnectorModal({ open, onOpenChange, onAdd }: AddConnectorModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [transport, setTransport] = useState<'sse' | 'stdio'>('sse');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      return;
    }
    onAdd({
      name: name.trim(),
      url: url.trim(),
      transport,
      description: description.trim() || undefined,
    });
    setName('');
    setUrl('');
    setDescription('');
    setTransport('sse');
    onOpenChange(false);
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent className="max-w-md rounded-2xl bg-surface-primary p-6 text-text-primary shadow-xl">
        <OGDialogHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary text-text-primary">
              <Plug className="h-4 w-4" />
            </div>
            <OGDialogTitle className="text-base font-semibold text-text-primary">
              Add custom connector
            </OGDialogTitle>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </OGDialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* Connector Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">Connector name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Local Postgres MCP"
              className="rounded-xl border border-border-light bg-surface-secondary/50 px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
          </div>

          {/* Transport */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">Transport</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTransport('sse')}
                className={`flex-1 rounded-xl border py-1.5 text-xs font-medium transition-colors ${
                  transport === 'sse'
                    ? 'border-text-primary bg-surface-secondary text-text-primary'
                    : 'border-border-light text-text-secondary hover:bg-surface-secondary/50'
                }`}
              >
                SSE (Server-Sent Events)
              </button>
              <button
                type="button"
                onClick={() => setTransport('stdio')}
                className={`flex-1 rounded-xl border py-1.5 text-xs font-medium transition-colors ${
                  transport === 'stdio'
                    ? 'border-text-primary bg-surface-secondary text-text-primary'
                    : 'border-border-light text-text-secondary hover:bg-surface-secondary/50'
                }`}
              >
                stdio (Local Process)
              </button>
            </div>
          </div>

          {/* Server URL or Command */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              {transport === 'sse' ? 'MCP Server URL' : 'Command & arguments'}
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                transport === 'sse'
                  ? 'http://localhost:8000/sse'
                  : 'npx -y @modelcontextprotocol/server-postgres'
              }
              className="rounded-xl border border-border-light bg-surface-secondary/50 px-3 py-2 font-mono text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
          </div>

          {/* Optional Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What tools or resources this connector provides"
              className="rounded-xl border border-border-light bg-surface-secondary/50 px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
          </div>

          {/* Footer actions */}
          <div className="mt-2 flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-border-light px-3.5 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !url.trim()}
              className="rounded-lg bg-text-primary px-3.5 py-1.5 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add connector
            </button>
          </div>
        </form>
      </OGDialogContent>
    </OGDialog>
  );
}
