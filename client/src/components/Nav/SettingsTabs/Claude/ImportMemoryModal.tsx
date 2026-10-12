/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';

interface ImportMemoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (memoryText: string) => void;
}

const IMPORT_PROMPT =
  'Please provide a comprehensive summary of all memories, user preferences, personal details, communication style, and persistent context you have stored about me. Format as clear bullet points grouped by: 1) Profile & preferences, 2) Key topics/interests, 3) Ongoing projects.';

export default function ImportMemoryModal({
  open,
  onOpenChange,
  onImport,
}: ImportMemoryModalProps) {
  const [copied, setCopied] = useState(false);
  const [pastedMemory, setPastedMemory] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(IMPORT_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleAdd = () => {
    if (!pastedMemory.trim()) {
      return;
    }
    onImport(pastedMemory);
    setPastedMemory('');
    onOpenChange(false);
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent className="max-w-lg rounded-2xl bg-surface-primary p-6 text-text-primary shadow-xl">
        <OGDialogHeader className="flex flex-row items-center justify-between pb-4">
          <OGDialogTitle className="text-lg font-semibold text-text-primary">
            Import memory to Claude
          </OGDialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </OGDialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* STEP 1 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-tertiary text-xs font-semibold text-text-primary">
                1
              </span>
              <span className="text-sm font-medium text-text-primary">
                Copy this prompt into a chat with your other AI provider
              </span>
            </div>
            <div className="relative rounded-xl border border-border-light bg-surface-secondary/70 p-3 pr-10 text-xs leading-relaxed text-text-secondary">
              {IMPORT_PROMPT}
              <button
                type="button"
                onClick={handleCopy}
                className="shadow-xs absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md border border-border-light bg-surface-primary px-2 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                aria-label="Copy prompt"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-tertiary text-xs font-semibold text-text-primary">
                2
              </span>
              <span className="text-sm font-medium text-text-primary">
                Paste results below to add to Claude&apos;s memory
              </span>
            </div>
            <textarea
              value={pastedMemory}
              onChange={(e) => setPastedMemory(e.target.value)}
              placeholder="Paste your memory details here"
              rows={5}
              className="w-full rounded-xl border border-border-light bg-surface-secondary/50 p-3 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="mt-4 flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-border-light px-3.5 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!pastedMemory.trim()}
            className="rounded-lg bg-text-primary px-3.5 py-1.5 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to memory
          </button>
        </div>
      </OGDialogContent>
    </OGDialog>
  );
}
