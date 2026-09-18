/* eslint-disable i18next/no-literal-string */
import React from 'react';
import { useRecoilState } from 'recoil';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FileText, Layers, Palette, Sparkles, ChevronDown, Check } from 'lucide-react';
import type { OutputFormat } from '~/store/families';
import { outputFormatFamily } from '~/store/families';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface OutputFormatDropdownProps {
  index?: number;
}

export default function OutputFormatDropdown({ index = 0 }: OutputFormatDropdownProps) {
  const localize = useLocalize();
  const [outputFormat, setOutputFormat] = useRecoilState<OutputFormat>(outputFormatFamily(index));

  const formatLabels: Record<OutputFormat, string> = {
    artifact: localize('com_ui_output_artifact'),
    docs: localize('com_ui_output_docs'),
    slides: localize('com_ui_output_slides'),
    design: localize('com_ui_output_design'),
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-primary"
        >
          <span>
            {localize('com_ui_output_format')}: {formatLabels[outputFormat] || 'Artifact'}
          </span>
          <ChevronDown className="h-3 w-3 text-text-tertiary" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[210px] rounded-xl border border-border-light bg-surface-primary p-1.5 shadow-lg focus:outline-none"
        >
          {/* Option: Docs */}
          <DropdownMenu.Item
            onClick={() => setOutputFormat('docs')}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none',
              outputFormat === 'docs' && 'bg-surface-secondary font-medium',
            )}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
              <span>{localize('com_ui_output_docs')}</span>
              <span className="py-0.2 rounded bg-blue-500/10 px-1 text-[9px] font-semibold text-blue-600 dark:text-blue-400">
                Beta
              </span>
            </div>
            {outputFormat === 'docs' && <Check className="h-3 w-3 text-text-primary" />}
          </DropdownMenu.Item>

          {/* Option: Slides */}
          <DropdownMenu.Item
            onClick={() => setOutputFormat('slides')}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none',
              outputFormat === 'slides' && 'bg-surface-secondary font-medium',
            )}
          >
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
              <span>{localize('com_ui_output_slides')}</span>
              <span className="py-0.2 rounded bg-blue-500/10 px-1 text-[9px] font-semibold text-blue-600 dark:text-blue-400">
                Beta
              </span>
            </div>
            {outputFormat === 'slides' && <Check className="h-3 w-3 text-text-primary" />}
          </DropdownMenu.Item>

          {/* Option: Design */}
          <DropdownMenu.Item
            onClick={() => setOutputFormat('design')}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none',
              outputFormat === 'design' && 'bg-surface-secondary font-medium',
            )}
          >
            <div className="flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
              <span>{localize('com_ui_output_design')}</span>
              <span className="py-0.2 rounded bg-blue-500/10 px-1 text-[9px] font-semibold text-blue-600 dark:text-blue-400">
                Beta
              </span>
            </div>
            {outputFormat === 'design' && <Check className="h-3 w-3 text-text-primary" />}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border-light" />

          {/* Option: Artifact (default) */}
          <DropdownMenu.Item
            onClick={() => setOutputFormat('artifact')}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs text-text-primary transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none',
              outputFormat === 'artifact' && 'bg-surface-secondary font-medium',
            )}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
              <div>
                <div className="text-xs font-medium">{localize('com_ui_output_artifact')}</div>
                <div className="text-[10px] text-text-tertiary">
                  {localize('com_ui_output_artifact_desc')}
                </div>
              </div>
            </div>
            {outputFormat === 'artifact' && <Check className="h-3 w-3 text-text-primary" />}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
