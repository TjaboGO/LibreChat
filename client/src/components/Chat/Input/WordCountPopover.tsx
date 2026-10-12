/* eslint-disable i18next/no-literal-string */
import React, { useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface WordCountPopoverProps {
  text: string;
}

export default function WordCountPopover({ text }: WordCountPopoverProps) {
  const localize = useLocalize();
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
    const sentences = trimmed.length === 0 ? 0 : (text.match(/[.!?]+(?:\s|$)/g) || []).length;
    const lines = text.length === 0 ? 0 : text.split(/\r?\n/).length;
    const paragraphs = trimmed.length === 0 ? 0 : trimmed.split(/\n\s*\n/).length;
    const tokensEst = Math.ceil(text.length / 4);

    return {
      chars,
      charsNoSpaces,
      words,
      sentences,
      lines,
      paragraphs,
      tokensEst,
    };
  }, [text]);

  const items = [
    { label: localize('com_ui_characters_with_spaces'), value: stats.chars },
    { label: localize('com_ui_characters_no_spaces'), value: stats.charsNoSpaces },
    { label: localize('com_ui_words'), value: stats.words },
    { label: localize('com_ui_sentences'), value: stats.sentences },
    { label: localize('com_ui_lines'), value: stats.lines },
    { label: localize('com_ui_paragraphs'), value: stats.paragraphs },
    { label: localize('com_ui_tokens_est'), value: stats.tokensEst },
  ];

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
            open
              ? 'bg-surface-tertiary text-text-primary'
              : 'text-text-tertiary hover:bg-surface-secondary hover:text-text-secondary',
          )}
          aria-label={open ? 'Close word count breakdown' : 'Open word count breakdown'}
        >
          {open ? (
            <ChevronLeft className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
          )}
          <span>
            {stats.words} {localize('com_ui_words').toLowerCase()} / {stats.chars} chars
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          side="bottom"
          sideOffset={6}
          className="z-50 w-64 rounded-xl border border-border-light bg-surface-primary p-3 shadow-lg focus:outline-none"
        >
          <div className="flex flex-col divide-y divide-border-light text-xs text-text-primary">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center justify-between py-1.5',
                  idx === 0 && 'pt-0',
                  idx === items.length - 1 && 'pb-0',
                )}
              >
                <span className="text-text-secondary">{item.label}</span>
                <span className="font-mono font-semibold tabular-nums">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
