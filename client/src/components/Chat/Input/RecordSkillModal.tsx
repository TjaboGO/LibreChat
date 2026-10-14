/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Video, X, Lock, CheckCircle2, Play } from 'lucide-react';
import { cn } from '~/utils';

interface RecordSkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartRecording?: () => void;
}

export default function RecordSkillModal({
  open,
  onOpenChange,
  onStartRecording,
}: RecordSkillModalProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleStart = async () => {
    setIsRecording(true);
    try {
      if (navigator.mediaDevices?.getDisplayMedia) {
        await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      }
      onStartRecording?.();
      onOpenChange(false);
    } catch {
      // user cancelled screen share prompt
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="backdrop-blur-xs fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-light bg-surface-primary p-6 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary text-text-primary">
                <Video className="h-5 w-5" aria-hidden="true" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-text-primary">
                Record a skill
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg p-1.5 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="mt-3 text-sm leading-relaxed text-text-secondary">
            Your screen, clicks, typing, and voice are recorded, then sent to Claude and turned into
            a repeatable skill.
          </Dialog.Description>

          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p>
                Don&apos;t type passwords or secrets, or display sensitive information or private
                conversations while recording.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>1. Record your actions step by step</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>2. Review and save as a reusable skill</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>3. Run anytime from the Skills menu or with /skill</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isRecording}
              onClick={handleStart}
              className={cn(
                'text-text-primary-alt flex items-center gap-1.5 rounded-full bg-surface-primary-alt px-4 py-2 text-xs font-semibold shadow-sm transition-opacity hover:opacity-90',
                isRecording && 'opacity-60',
              )}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isRecording ? 'Starting...' : 'Start recording'}</span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
