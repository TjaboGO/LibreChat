/* eslint-disable i18next/no-literal-string */
import React, { useState, useMemo, useRef } from 'react';
import copy from 'copy-to-clipboard';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Layers,
  Palette,
  Eye,
  Download,
  Share2,
  Check,
  History,
  Layout,
  Type,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { SandpackPreviewRef } from '@codesandbox/sandpack-react';
import type { Artifact } from '~/common';
import {
  extractLayersFromCode,
  extractTokensFromCode,
  generateStarterDesignCode,
} from './designExtractor';
import { ArtifactPreview } from '~/components/Artifacts/ArtifactPreview';
import useArtifactProps from '~/hooks/Artifacts/useArtifactProps';
import { cn } from '~/utils';
import store from '~/store';

interface DesignCanvasViewProps {
  projectTitle: string;
  designSystemName: string;
  onBack: () => void;
  initialArtifactId?: string;
}

function getLayerIcon(type: string) {
  if (type === 'header') {
    return Type;
  }
  if (type === 'hero') {
    return Sparkles;
  }
  if (type === 'form' || type === 'button') {
    return Sliders;
  }
  return Layout;
}

function getTokenSwatchColor(tok: { value: string; cssClass?: string }) {
  if (tok.value.startsWith('#')) {
    return tok.value;
  }
  if (tok.cssClass?.includes('orange')) {
    return '#ea580c';
  }
  if (tok.cssClass?.includes('blue')) {
    return '#2563eb';
  }
  if (tok.cssClass?.includes('emerald')) {
    return '#059669';
  }
  return '#78716c';
}

export default function DesignCanvasView({
  projectTitle,
  designSystemName,
  onBack,
  initialArtifactId,
}: DesignCanvasViewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(100);
  const [activeSidePanel, setActiveSidePanel] = useState<'layers' | 'tokens'>('layers');
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedShare, setIsCopiedShare] = useState(false);
  const previewRef = useRef<SandpackPreviewRef>();

  // 1. Connect to LibreChat Artifacts Pipeline
  const artifactsRecord = useRecoilValue(store.artifactsState);
  const [currentArtifactId, setCurrentArtifactId] = useRecoilState(store.currentArtifactId);

  // Filter available artifacts that match React/HTML or design identifiers
  const availableDesignArtifacts = useMemo(() => {
    if (!artifactsRecord) {
      return [];
    }
    return Object.values(artifactsRecord).filter((a): a is Artifact => {
      if (!a || !a.content) {
        return false;
      }
      const type = (a.type ?? '').toLowerCase();
      const id = (a.id ?? '').toLowerCase();
      const title = (a.title ?? '').toLowerCase();
      const identifier = (a.identifier ?? '').toLowerCase();

      return (
        type.includes('react') ||
        type.includes('html') ||
        id.includes('design') ||
        identifier.includes('design') ||
        title.includes('design') ||
        title === projectTitle.toLowerCase()
      );
    });
  }, [artifactsRecord, projectTitle]);

  // Selected artifact id (default to initial or current or latest)
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (initialArtifactId && artifactsRecord?.[initialArtifactId]) {
      return initialArtifactId;
    }
    if (currentArtifactId && artifactsRecord?.[currentArtifactId]) {
      return currentArtifactId;
    }
    return availableDesignArtifacts[availableDesignArtifacts.length - 1]?.id ?? null;
  });

  // Active artifact object
  const activeArtifact = useMemo(() => {
    if (selectedId && artifactsRecord?.[selectedId]) {
      return artifactsRecord[selectedId] as Artifact;
    }
    return availableDesignArtifacts[availableDesignArtifacts.length - 1] ?? null;
  }, [selectedId, artifactsRecord, availableDesignArtifacts]);

  // Fallback starter artifact if no chat artifact exists yet
  const starterCode = useMemo(() => {
    return generateStarterDesignCode(projectTitle, designSystemName);
  }, [projectTitle, designSystemName]);

  const effectiveArtifact: Artifact = useMemo(() => {
    if (activeArtifact) {
      return activeArtifact;
    }
    return {
      id: `design-starter-${projectTitle.toLowerCase().replace(/\s+/g, '-')}`,
      identifier: 'design-canvas',
      title: projectTitle,
      type: 'application/vnd.react',
      content: starterCode,
      lastUpdateTime: Date.now(),
    };
  }, [activeArtifact, projectTitle, starterCode]);

  const activeCode = effectiveArtifact.content ?? starterCode;

  // Compute Sandpack props using standard LibreChat artifact hook
  const { files, fileKey, template, sharedProps } = useArtifactProps({
    artifact: effectiveArtifact,
  });

  // Dynamic layers extracted from the real artifact code (UI-TARS / Browser-Use pattern)
  const dynamicLayers = useMemo(() => {
    return extractLayersFromCode(activeCode);
  }, [activeCode]);

  // Dynamic tokens extracted from the real artifact code
  const { palette: dynamicPalette, typography: dynamicTypography } = useMemo(() => {
    return extractTokensFromCode(activeCode);
  }, [activeCode]);

  // Viewport dimensions
  const viewportWidthClass = {
    desktop: 'w-[840px] h-[560px]',
    tablet: 'w-[520px] h-[620px]',
    mobile: 'w-[320px] h-[560px]',
  }[viewport];

  // Actions
  const handleExportCode = () => {
    copy(activeCode);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2000);

    // Also trigger file download
    try {
      const ext = effectiveArtifact.type === 'text/html' ? 'html' : 'tsx';
      const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore download error if blocked
    }
  };

  const handleShare = () => {
    const directive = `:::artifact{identifier="design-canvas" type="${effectiveArtifact.type ?? 'application/vnd.react'}" title="${projectTitle}"}\n${activeCode}\n:::`;
    copy(directive);
    setIsCopiedShare(true);
    setTimeout(() => setIsCopiedShare(false), 2000);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-presentation text-text-primary">
      {/* CANVAS TOP TOOLBAR */}
      <header className="flex h-14 items-center justify-between border-b border-border-light bg-surface-primary px-4">
        {/* Left: Back & Project info & Version Selector */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            aria-label="Back to projects"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="font-serif text-sm font-semibold text-text-primary">{projectTitle}</h2>
            <span className="py-0.2 rounded bg-orange-500/10 px-1.5 text-[10px] font-semibold text-orange-600">
              {designSystemName}
            </span>

            {/* Version History Selector */}
            {availableDesignArtifacts.length > 1 && (
              <div className="ml-2 flex items-center gap-1 rounded-md border border-border-light bg-surface-secondary/50 px-2 py-0.5 text-xs text-text-secondary">
                <History className="h-3 w-3" />
                <select
                  value={selectedId ?? ''}
                  onChange={(e) => {
                    setSelectedId(e.target.value);
                    setCurrentArtifactId(e.target.value);
                  }}
                  className="bg-transparent font-medium text-text-primary focus:outline-none"
                  aria-label="Select design version"
                >
                  {availableDesignArtifacts.map((art, idx) => (
                    <option key={art.id} value={art.id}>
                      v{idx + 1} {art.title ? `- ${art.title}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Center: Responsive Viewport Switcher */}
        <div className="flex items-center rounded-lg border border-border-light bg-surface-secondary/60 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors',
              viewport === 'desktop'
                ? 'shadow-xs bg-surface-primary font-medium text-text-primary'
                : 'text-text-tertiary hover:text-text-primary',
            )}
            aria-label="Desktop view"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors',
              viewport === 'tablet'
                ? 'shadow-xs bg-surface-primary font-medium text-text-primary'
                : 'text-text-tertiary hover:text-text-primary',
            )}
            aria-label="Tablet view"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors',
              viewport === 'mobile'
                ? 'shadow-xs bg-surface-primary font-medium text-text-primary'
                : 'text-text-tertiary hover:text-text-primary',
            )}
            aria-label="Mobile view"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Zoom & Export Controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center rounded-lg border border-border-light bg-surface-primary px-2 py-1 text-text-secondary">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 10, 50))}
              className="p-0.5 hover:text-text-primary"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="mx-2 min-w-10 text-center font-mono text-[11px]">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 10, 150))}
              className="p-0.5 hover:text-text-primary"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            title="Copy artifact container directive"
          >
            {isCopiedShare ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}
            <span>{isCopiedShare ? 'Copied directive!' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCode}
            className="flex items-center gap-1.5 rounded-lg bg-text-primary px-3.5 py-1.5 font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
            title="Export artifact source code"
          >
            {isCopiedCode ? (
              <Check className="h-3.5 w-3.5 text-emerald-300" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span>{isCopiedCode ? 'Copied & Downloaded!' : 'Export code'}</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT TOOL PANEL (Dynamic Layers / Tokens) */}
        <aside className="flex w-64 flex-col border-r border-border-light bg-surface-primary p-3">
          <div className="flex items-center gap-2 border-b border-border-light/60 pb-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveSidePanel('layers')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-colors',
                activeSidePanel === 'layers'
                  ? 'bg-surface-secondary font-semibold text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Layers ({dynamicLayers.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSidePanel('tokens')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-colors',
                activeSidePanel === 'tokens'
                  ? 'bg-surface-secondary font-semibold text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Tokens ({dynamicPalette.length})</span>
            </button>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto text-xs">
            {activeSidePanel === 'layers' ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between rounded-lg bg-surface-secondary/70 p-2 text-text-primary">
                  <div className="flex items-center gap-2">
                    <Layout className="h-3.5 w-3.5 text-orange-600" />
                    <span className="max-w-[130px] truncate font-semibold">{projectTitle}</span>
                  </div>
                  <Eye className="h-3 w-3 text-text-tertiary" />
                </div>
                <div className="ml-3 flex flex-col gap-1 border-l border-border-light/60 pl-2 text-text-secondary">
                  {dynamicLayers.map((layer) => {
                    const Icon = getLayerIcon(layer.type);

                    return (
                      <div
                        key={layer.id}
                        className="flex items-center justify-between rounded p-1 hover:bg-surface-secondary"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon className="h-3 w-3 shrink-0 text-text-tertiary" />
                          <span className="truncate">{layer.name}</span>
                        </div>
                        <span className="ml-1 shrink-0 font-mono text-[9px] text-text-tertiary">
                          &lt;{layer.tag}&gt;
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Palette ({dynamicPalette.length})
                  </span>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {dynamicPalette.map((tok, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded bg-surface-secondary/40 p-1"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-4 w-4 shrink-0 rounded border border-border-light"
                            style={{
                              backgroundColor: getTokenSwatchColor(tok),
                            }}
                          />
                          <span className="max-w-[110px] truncate font-mono text-[10px] text-text-secondary">
                            {tok.name}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-text-tertiary">
                          {tok.value.startsWith('#') ? tok.value : (tok.cssClass ?? 'var')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border-light/60 pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Typography ({dynamicTypography.length})
                  </span>
                  <div className="mt-1.5 flex flex-col gap-1 text-[11px] text-text-secondary">
                    {dynamicTypography.map((typ, idx) => (
                      <div key={idx} className="rounded bg-surface-secondary/40 p-1">
                        <div className="text-[10px] font-medium text-text-primary">
                          {typ.category}
                        </div>
                        <div className="font-mono text-[9px] text-text-tertiary">{typ.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER CANVAS RENDERER (Live Sandpack / Artifact Preview) */}
        <main className="bg-dot-grid flex flex-1 items-center justify-center overflow-auto p-8">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
            className="transition-transform duration-100"
          >
            <div
              className={cn(
                'flex flex-col overflow-hidden rounded-2xl border border-border-light bg-surface-primary shadow-2xl transition-all duration-200',
                viewportWidthClass,
              )}
            >
              {/* LIVE ARTIFACT PREVIEW */}
              {effectiveArtifact.type === 'text/html' || activeCode.includes('<!DOCTYPE') ? (
                <iframe
                  title={projectTitle}
                  srcDoc={activeCode}
                  className="h-full w-full flex-1 border-none bg-white"
                  sandbox="allow-scripts allow-forms allow-same-origin"
                />
              ) : (
                <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
                  <ArtifactPreview
                    files={files}
                    fileKey={fileKey}
                    template={template}
                    sharedProps={sharedProps}
                    previewRef={previewRef as React.MutableRefObject<SandpackPreviewRef>}
                    currentCode={activeCode}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
