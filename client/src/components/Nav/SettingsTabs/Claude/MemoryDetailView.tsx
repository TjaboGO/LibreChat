/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, Trash2 } from 'lucide-react';

export interface MemoryEntry {
  id: string;
  category: 'you' | 'topics' | 'projects';
  projectName?: string;
  label: string;
  summary: string;
  details: string[];
  updatedAt: string;
  rawKey?: string;
  agentId?: string;
  rawValue?: string;
}

interface MemoryDetailViewProps {
  entry: MemoryEntry;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdateDetails: (id: string, newInstruction: string) => void;
}

export default function MemoryDetailView({
  entry,
  onBack,
  onDelete,
  onUpdateDetails,
}: MemoryDetailViewProps) {
  const [commandText, setCommandText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandText.trim()) {
      return;
    }
    onUpdateDetails(entry.id, commandText.trim());
    setCommandText('');
  };

  return (
    <div className="flex h-full flex-col justify-between text-text-primary">
      <div className="flex flex-col gap-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Memory</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry.id)}
            className="flex items-center gap-1 text-xs text-text-secondary transition-colors hover:text-red-500"
            aria-label="Delete entry"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>

        {/* TITLE */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{entry.label}</h2>
          {entry.projectName && (
            <span className="mt-1 inline-block rounded-md bg-surface-secondary px-2 py-0.5 text-xs text-text-tertiary">
              Project: {entry.projectName}
            </span>
          )}
        </div>

        {/* FIELDS */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-xs text-text-tertiary">Last updated</div>
            <div className="mt-0.5 text-xs text-text-secondary">{entry.updatedAt}</div>
          </div>

          <div>
            <div className="text-xs text-text-tertiary">Summary</div>
            <div className="mt-0.5 text-xs leading-relaxed text-text-primary">{entry.summary}</div>
          </div>

          <div>
            <div className="text-xs text-text-tertiary">Details</div>
            <ul className="mt-1.5 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-text-primary">
              {entry.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM NL COMMAND BAR */}
      <form onSubmit={handleSubmit} className="mt-8 pt-4">
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
    </div>
  );
}
