/* eslint-disable i18next/no-literal-string */
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface PlaceholderTabProps {
  title: string;
  description: string;
  phase: string;
  icon: LucideIcon;
  features?: string[];
}

export default function PlaceholderTab({
  title,
  description,
  phase,
  icon: Icon,
  features,
}: PlaceholderTabProps) {
  return (
    <div className="flex flex-col text-text-primary">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border border-border-light bg-surface-secondary text-text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <p className="text-xs text-text-tertiary">{description}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border-light bg-surface-secondary/40 p-6 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-surface-tertiary text-text-secondary">
          <Icon className="size-6" />
        </div>
        <h4 className="text-sm font-semibold text-text-primary">{title} configuration</h4>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-text-tertiary">
          This area is part of our pixel-matching roadmap. Full configuration controls are scheduled
          for <span className="font-semibold text-text-secondary">{phase}</span>.
        </p>

        {features && features.length > 0 && (
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-border-light bg-surface-primary p-4 text-left">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Planned capabilities:
            </div>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-border-xheavy" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
