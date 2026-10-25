import React, { memo, useMemo, useState, type MutableRefObject } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react/unstyled';
import type {
  SandpackProviderProps,
  SandpackPreviewRef,
} from '@codesandbox/sandpack-react/unstyled';
import type { SandpackStartupConfig } from '~/utils/artifacts';
import type { ArtifactFiles } from '~/common';
import { sharedFiles, buildSandpackOptions } from '~/utils/artifacts';
import { cn } from '~/utils';

export const ArtifactPreview = memo(function ({
  files,
  fileKey,
  template,
  sharedProps,
  previewRef,
  currentCode,
  startupConfig,
}: {
  files: ArtifactFiles;
  fileKey: string;
  template: SandpackProviderProps['template'];
  sharedProps: Partial<SandpackProviderProps>;
  previewRef: MutableRefObject<SandpackPreviewRef>;
  currentCode?: string;
  startupConfig?: SandpackStartupConfig;
}) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const artifactFiles = useMemo(() => {
    if (Object.keys(files).length === 0) {
      return files;
    }
    const code = currentCode ?? '';
    if (!code) {
      return files;
    }
    return {
      ...files,
      [fileKey]: { code },
    };
  }, [currentCode, files, fileKey]);

  const options: SandpackProviderProps['options'] = useMemo(
    () => buildSandpackOptions(template, startupConfig),
    [startupConfig, template],
  );

  if (Object.keys(artifactFiles).length === 0) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col bg-surface-secondary/30">
      {/* Viewport Control Bar */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-border-light bg-surface-primary px-3 text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium text-text-tertiary">Viewport:</span>
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={cn(
              'flex h-6 items-center gap-1 rounded px-2 text-[11px] font-medium transition-colors',
              viewport === 'desktop'
                ? 'bg-surface-hover text-text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary',
            )}
            title="Desktop (100%)"
          >
            <Monitor className="h-3 w-3" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={cn(
              'flex h-6 items-center gap-1 rounded px-2 text-[11px] font-medium transition-colors',
              viewport === 'tablet'
                ? 'bg-surface-hover text-text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary',
            )}
            title="Tablet (768px)"
          >
            <Tablet className="h-3 w-3" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={cn(
              'flex h-6 items-center gap-1 rounded px-2 text-[11px] font-medium transition-colors',
              viewport === 'mobile'
                ? 'bg-surface-hover text-text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary',
            )}
            title="Mobile (375px)"
          >
            <Smartphone className="h-3 w-3" />
            <span>Mobile</span>
          </button>
        </div>
        <div className="font-mono text-[10px] text-text-tertiary">
          {viewport === 'desktop' && '100% Fluid'}
          {viewport === 'tablet' && '768 × 1024'}
          {viewport === 'mobile' && '375 × 667'}
        </div>
      </div>

      {/* Viewport Stage */}
      <div className="relative flex flex-1 items-center justify-center overflow-auto p-2">
        <div
          style={{
            width: viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px',
            maxWidth: '100%',
            height: '100%',
          }}
          className={cn(
            'h-full overflow-hidden transition-[width] duration-200 ease-out',
            viewport !== 'desktop' &&
              'rounded-xl border border-border-medium bg-surface-primary shadow-2xl ring-1 ring-border-light',
          )}
        >
          <SandpackProvider
            files={{ ...artifactFiles, ...sharedFiles }}
            options={options}
            {...sharedProps}
            template={template}
          >
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              tabIndex={0}
              ref={previewRef}
            />
          </SandpackProvider>
        </div>
      </div>
    </div>
  );
});
