/* eslint-disable i18next/no-literal-string */
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';

interface ProjectInstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  initialInstructions?: string;
  onSave: (instructions: string) => void;
}

export default function ProjectInstructionsModal({
  open,
  onOpenChange,
  projectName,
  initialInstructions = '',
  onSave,
}: ProjectInstructionsModalProps) {
  const [instructions, setInstructions] = useState(initialInstructions);

  useEffect(() => {
    setInstructions(initialInstructions);
  }, [initialInstructions, open]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(instructions);
    onOpenChange(false);
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent className="max-w-xl rounded-2xl bg-surface-primary p-6 text-text-primary shadow-xl">
        <OGDialogHeader className="flex flex-row items-center justify-between pb-2">
          <OGDialogTitle className="text-lg font-semibold text-text-primary">
            Set project instructions
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

        <p className="text-xs leading-relaxed text-text-secondary">
          Provide Claude with relevant instructions and information for chats within{' '}
          <span className="font-semibold text-text-primary">{projectName}</span>. This will work
          alongside your{' '}
          <span className="cursor-pointer underline hover:text-text-primary">
            profile instructions
          </span>{' '}
          and the selected style in a chat.
        </p>

        <form onSubmit={handleSave} className="mt-4 flex flex-col gap-4">
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Always write code in TypeScript with functional components and clean error handling. Refer to docs/ROADMAP.md for task progress."
            rows={8}
            className="w-full rounded-xl border border-border-light bg-surface-secondary/40 p-3.5 text-xs leading-relaxed text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
          />

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-border-light px-3.5 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-text-primary px-3.5 py-1.5 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
            >
              Save instructions
            </button>
          </div>
        </form>
      </OGDialogContent>
    </OGDialog>
  );
}
