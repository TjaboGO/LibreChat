/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, Cpu, FileText } from 'lucide-react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';

export interface ChatInfoData {
  conversationId: string;
  title: string;
  createdAt: string;
  lastInteracted: string;
  totalMessages: number;
  model: string;
  initialNotes?: string;
}

interface ChatInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  info: ChatInfoData;
  onSaveNotes?: (notes: string) => void;
}

export default function ChatInfoModal({
  open,
  onOpenChange,
  info,
  onSaveNotes,
}: ChatInfoModalProps) {
  const [notes, setNotes] = useState(info.initialNotes || '');

  const handleDone = () => {
    if (onSaveNotes) {
      onSaveNotes(notes);
    }
    onOpenChange(false);
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent
        showCloseButton={false}
        className="max-w-md rounded-2xl bg-surface-primary p-6 text-text-primary shadow-xl"
      >
        <OGDialogHeader className="flex flex-row items-center justify-between pb-3">
          <OGDialogTitle className="text-base font-semibold text-text-primary">
            Chat info
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

        <div className="flex flex-col gap-4 pt-1">
          {/* TITLE */}
          <div className="rounded-xl border border-border-light bg-surface-secondary/40 p-3">
            <span className="line-clamp-1 text-xs font-semibold text-text-primary">
              {info.title}
            </span>
            <span className="mt-0.5 block truncate font-mono text-[11px] text-text-tertiary">
              ID: {info.conversationId}
            </span>
          </div>

          {/* METRICS GRID */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 rounded-xl border border-border-light bg-surface-primary p-3">
              <Calendar className="h-4 w-4 shrink-0 text-text-tertiary" />
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                  Created
                </div>
                <div className="mt-0.5 text-xs font-medium text-text-primary">{info.createdAt}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-border-light bg-surface-primary p-3">
              <Clock className="h-4 w-4 shrink-0 text-text-tertiary" />
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                  Last active
                </div>
                <div className="mt-0.5 text-xs font-medium text-text-primary">
                  {info.lastInteracted}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-border-light bg-surface-primary p-3">
              <MessageSquare className="h-4 w-4 shrink-0 text-text-tertiary" />
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                  Messages
                </div>
                <div className="mt-0.5 text-xs font-medium text-text-primary">
                  {info.totalMessages}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-border-light bg-surface-primary p-3">
              <Cpu className="h-4 w-4 shrink-0 text-text-tertiary" />
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                  Model
                </div>
                <div className="mt-0.5 max-w-[110px] truncate text-xs font-medium text-text-primary">
                  {info.model}
                </div>
              </div>
            </div>
          </div>

          {/* NOTES FIELD */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <FileText className="h-3.5 w-3.5" />
              <span>Notes</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add personal notes or context about this conversation"
              rows={3}
              className="w-full rounded-xl border border-border-light bg-surface-secondary/40 p-3 text-xs leading-relaxed text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
            />
          </div>

          {/* FOOTER */}
          <div className="mt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleDone}
              className="rounded-lg bg-text-primary px-4 py-1.5 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
            >
              Done
            </button>
          </div>
        </div>
      </OGDialogContent>
    </OGDialog>
  );
}
