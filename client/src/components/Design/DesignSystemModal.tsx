/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { X, Palette, Terminal, Check, Sparkles, Figma, Github } from 'lucide-react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';
import { cn } from '~/utils';

interface StylePreset {
  id: string;
  name: string;
  description: string;
  accentClass: string;
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'modernist',
    name: 'Modernist',
    description: 'Clean geometry, neo-grotesque type, generous whitespace.',
    accentClass: 'bg-blue-500',
  },
  {
    id: 'classical',
    name: 'Classical',
    description: 'Editorial serif proportions, balanced margins, literary tone.',
    accentClass: 'bg-amber-600',
  },
  {
    id: 'nocturne',
    name: 'Nocturne',
    description: 'Deep contrast dark surfaces, vibrant electric highlights.',
    accentClass: 'bg-purple-500',
  },
  {
    id: 'organic',
    name: 'Organic',
    description: 'Soft rounded corners, warm sand palettes, gentle shadows.',
    accentClass: 'bg-emerald-500',
  },
  {
    id: 'broadsheet',
    name: 'Broadsheet',
    description: 'Structured column grids, dense headlines, hairline dividers.',
    accentClass: 'bg-stone-600',
  },
  {
    id: 'industry',
    name: 'Industry',
    description: 'Monospaced telemetry, technical accents, functional borders.',
    accentClass: 'bg-orange-600',
  },
];

interface DesignSystemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSystem?: (name: string) => void;
}

export default function DesignSystemModal({
  open,
  onOpenChange,
  onSelectSystem,
}: DesignSystemModalProps) {
  const [selectedPreset, setSelectedPreset] = useState('modernist');
  const [method, setMethod] = useState<'here' | 'code'>('here');

  const handleApply = () => {
    const preset = STYLE_PRESETS.find((p) => p.id === selectedPreset);
    if (onSelectSystem && preset) {
      onSelectSystem(preset.name);
    }
    onOpenChange(false);
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent
        showCloseButton={false}
        className="max-w-xl rounded-2xl bg-surface-primary p-6 text-text-primary shadow-2xl"
      >
        <OGDialogHeader className="flex flex-row items-center justify-between pb-2">
          <OGDialogTitle className="text-base font-semibold text-text-primary">
            Add a design system
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

        <p className="text-xs text-text-secondary">
          Design systems teach Claude your brand. How would you like to start?
        </p>

        {/* METHOD SELECTION CARDS */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMethod('here')}
            className={cn(
              'flex flex-col items-start rounded-xl border p-3.5 text-left transition-colors',
              method === 'here'
                ? 'shadow-xs border-text-primary bg-surface-secondary/40'
                : 'border-border-light bg-surface-primary hover:border-border-medium',
            )}
          >
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-semibold text-text-primary">Create here</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
              Connect to Figma or GitHub, or upload brand slides and assets.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-text-tertiary">
              <span className="flex items-center gap-1">
                <Figma className="h-3 w-3" /> Figma
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Github className="h-3 w-3" /> GitHub
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod('code')}
            className={cn(
              'flex flex-col items-start rounded-xl border p-3.5 text-left transition-colors',
              method === 'code'
                ? 'shadow-xs border-text-primary bg-surface-secondary/40'
                : 'border-border-light bg-surface-primary hover:border-border-medium',
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold text-text-primary">Using Claude Code</span>
              </div>
              <span className="py-0.2 rounded bg-blue-500/10 px-1.5 text-[9px] font-semibold uppercase tracking-wider text-blue-600">
                Best fidelity
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
              Claude Code reads your repository tokens and React component libraries directly.
            </p>
            <div className="mt-3 text-[10px] text-text-tertiary">
              Inspects Tailwind config & CSS variables
            </div>
          </button>
        </div>

        {/* STYLE PRESETS SECTION */}
        <div className="mt-6 border-t border-border-light/60 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Included presets
            </span>
            <span className="text-[11px] text-text-tertiary">Select a foundational theme</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {STYLE_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset.id)}
                  className={cn(
                    'flex flex-col justify-between rounded-xl border p-3 text-left transition-all',
                    isSelected
                      ? 'shadow-xs border-text-primary bg-surface-secondary/60 ring-1 ring-text-primary'
                      : 'border-border-light bg-surface-primary hover:border-border-medium',
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('h-2.5 w-2.5 rounded-full', preset.accentClass)} />
                        <span className="text-xs font-semibold text-text-primary">
                          {preset.name}
                        </span>
                      </div>
                      {isSelected && <Check className="h-3 w-3 text-text-primary" />}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-text-tertiary">
                      {preset.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-border-light/60 pt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-border-light px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 rounded-lg bg-text-primary px-4 py-1.5 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Apply design system</span>
          </button>
        </div>
      </OGDialogContent>
    </OGDialog>
  );
}
