/* eslint-disable i18next/no-literal-string */
import React from 'react';
import { useRecoilState } from 'recoil';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  COGNITIVE_STYLES,
  type CognitiveStyle,
} from 'librechat-data-provider';
import {
  Sparkles,
  Zap,
  GraduationCap,
  BookOpen,
  Rocket,
  ChevronDown,
  Check,
} from 'lucide-react';
import { cognitiveStyleFamily } from '~/store/families';
import { cn } from '~/utils';

interface CognitiveStyleSelectorProps {
  index?: number;
}

const STYLE_ICONS: Record<CognitiveStyle, React.ElementType> = {
  default: Sparkles,
  concise: Zap,
  learning: GraduationCap,
  explanatory: BookOpen,
  proactive: Rocket,
};

export default function CognitiveStyleSelector({ index = 0 }: CognitiveStyleSelectorProps) {
  const [style, setStyle] = useRecoilState(cognitiveStyleFamily(index));
  const currentDef = COGNITIVE_STYLES[style] || COGNITIVE_STYLES.default;
  const CurrentIcon = STYLE_ICONS[style] || Sparkles;

  const styleKeys: CognitiveStyle[] = ['default', 'concise', 'learning', 'explanatory', 'proactive'];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          data-testid="cognitive-style-selector-trigger"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-primary"
        >
          <CurrentIcon className={cn('h-3.5 w-3.5', style === 'concise' ? 'text-amber-500' : style === 'learning' ? 'text-emerald-500' : style === 'proactive' ? 'text-purple-500' : 'text-text-secondary')} />
          <span>Style: {currentDef.name}</span>
          <ChevronDown className="h-3 w-3 text-text-tertiary" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          data-testid="cognitive-style-dropdown"
          className="z-50 min-w-[260px] max-w-[320px] rounded-xl border border-border-light bg-surface-primary p-1.5 shadow-xl focus:outline-none text-xs"
        >
          <div className="px-2.5 py-1 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Cognitive Persona Style
          </div>

          <div className="space-y-0.5 mt-1">
            {styleKeys.map((key) => {
              const def = COGNITIVE_STYLES[key];
              const Icon = STYLE_ICONS[key];
              const isSelected = style === key;

              return (
                <DropdownMenu.Item
                  key={key}
                  onClick={() => setStyle(key)}
                  className={cn(
                    'flex cursor-pointer items-start justify-between rounded-lg p-2 text-text-primary transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none',
                    isSelected && 'bg-surface-secondary font-medium',
                  )}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Icon className={cn('h-4 w-4 shrink-0 mt-0.5', key === 'concise' ? 'text-amber-500' : key === 'learning' ? 'text-emerald-500' : key === 'proactive' ? 'text-purple-500' : 'text-text-secondary')} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-text-primary">{def.name}</span>
                        <span className="rounded bg-surface-tertiary px-1 py-0.2 font-mono text-[9px] text-text-tertiary">
                          {def.slashCommand}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-text-secondary line-clamp-2 leading-snug">
                        {def.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-text-primary shrink-0 ml-2 mt-0.5" />}
                </DropdownMenu.Item>
              );
            })}
          </div>

          <DropdownMenu.Separator className="my-1.5 h-px bg-border-light" />
          <div className="px-2 py-1 text-[10px] text-text-tertiary italic">
            Tip: Type <span className="font-mono text-text-secondary">/concise</span> or <span className="font-mono text-text-secondary">/learning</span> directly in chat to switch.
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
