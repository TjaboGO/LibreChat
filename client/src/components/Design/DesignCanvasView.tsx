/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
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
  Sparkles,
  Sliders,
  Type,
  Layout,
} from 'lucide-react';
import { cn } from '~/utils';

interface DesignCanvasViewProps {
  projectTitle: string;
  designSystemName: string;
  onBack: () => void;
}

export default function DesignCanvasView({
  projectTitle,
  designSystemName,
  onBack,
}: DesignCanvasViewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(100);
  const [activeSidePanel, setActiveSidePanel] = useState<'layers' | 'tokens'>('layers');

  const viewportWidthClass = {
    desktop: 'w-[840px] min-h-[520px]',
    tablet: 'w-[520px] min-h-[480px]',
    mobile: 'w-[320px] min-h-[540px]',
  }[viewport];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-presentation text-text-primary">
      {/* CANVAS TOP TOOLBAR */}
      <header className="flex h-14 items-center justify-between border-b border-border-light bg-surface-primary px-4">
        {/* Left: Back & Project info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            aria-label="Back to projects"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-sm font-semibold text-text-primary">{projectTitle}</h2>
              <span className="py-0.2 rounded bg-orange-500/10 px-1.5 text-[10px] font-semibold text-orange-600">
                {designSystemName}
              </span>
            </div>
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

        {/* Right: Zoom & Export */}
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
            className="flex items-center gap-1.5 rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-text-primary px-3.5 py-1.5 font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export code</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT TOOL PANEL (Layers / Tokens) */}
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
              <span>Layers</span>
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
              <span>Tokens</span>
            </button>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto text-xs">
            {activeSidePanel === 'layers' ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between rounded-lg bg-surface-secondary/70 p-2 text-text-primary">
                  <div className="flex items-center gap-2">
                    <Layout className="h-3.5 w-3.5 text-orange-600" />
                    <span className="font-semibold">Hero Artboard</span>
                  </div>
                  <Eye className="h-3 w-3 text-text-tertiary" />
                </div>
                <div className="ml-3 flex flex-col gap-1 border-l border-border-light/60 pl-2 text-text-secondary">
                  <div className="flex items-center gap-2 rounded p-1 hover:bg-surface-secondary">
                    <Type className="h-3 w-3" />
                    <span>Navigation Bar</span>
                  </div>
                  <div className="flex items-center gap-2 rounded p-1 hover:bg-surface-secondary">
                    <Layout className="h-3 w-3" />
                    <span>Headline & Call-to-action</span>
                  </div>
                  <div className="flex items-center gap-2 rounded p-1 hover:bg-surface-secondary">
                    <Sliders className="h-3 w-3" />
                    <span>Interactive Feature Grid</span>
                  </div>
                  <div className="flex items-center gap-2 rounded p-1 hover:bg-surface-secondary">
                    <Type className="h-3 w-3" />
                    <span>Footer Links</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Palette
                  </span>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="h-6 w-6 rounded-lg bg-orange-600 ring-1 ring-border-light" />
                      <span className="font-mono text-[9px] text-text-tertiary">Primary</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="h-6 w-6 rounded-lg border border-border-light bg-surface-primary" />
                      <span className="font-mono text-[9px] text-text-tertiary">Surface</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="h-6 w-6 rounded-lg bg-surface-secondary" />
                      <span className="font-mono text-[9px] text-text-tertiary">Subtle</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="h-6 w-6 rounded-lg bg-text-primary" />
                      <span className="font-mono text-[9px] text-text-tertiary">Ink</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border-light/60 pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Typography
                  </span>
                  <div className="mt-1.5 flex flex-col gap-1 text-[11px] text-text-secondary">
                    <div>Serif Display: Anthropic Serif</div>
                    <div>Sans Body: Anthropic Sans</div>
                    <div>Monospace: JetBrains Mono</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER CANVAS RENDERER */}
        <main className="bg-dot-grid flex flex-1 items-center justify-center overflow-auto p-8">
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
            className="transition-transform duration-100"
          >
            <div
              className={cn(
                'rounded-2xl border border-border-light bg-surface-primary p-8 shadow-2xl transition-all duration-200',
                viewportWidthClass,
              )}
            >
              {/* MOCK RENDERED DESIGN */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-border-light/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-600" />
                    <span className="font-serif text-base font-bold">Acme Corp</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span>Products</span>
                    <span>Pricing</span>
                    <button
                      type="button"
                      className="rounded-full bg-text-primary px-3 py-1 text-[11px] font-medium text-surface-primary"
                    >
                      Sign In
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center py-8 text-center">
                  <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600">
                    Next-generation Developer Tools
                  </span>
                  <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-text-primary">
                    Build faster with autonomous pair-programming
                  </h1>
                  <p className="mt-2 max-w-md text-xs leading-relaxed text-text-secondary">
                    Harness DeepSeek Reasoner, Claude Code routines, and real-time artifact canvases
                    to streamline engineering operations.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-orange-700"
                    >
                      Get Started Free
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-border-light bg-surface-primary px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                    >
                      Live Demo
                    </button>
                  </div>
                </div>

                {/* 3-CARD FEATURE SHOWCASE */}
                <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-border-light/70 bg-surface-secondary/30 p-3">
                    <h4 className="text-xs font-semibold">Autonomous Worktrees</h4>
                    <p className="mt-1 text-[11px] text-text-secondary">
                      Isolated git branching with instant test execution.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border-light/70 bg-surface-secondary/30 p-3">
                    <h4 className="text-xs font-semibold">Design Systems</h4>
                    <p className="mt-1 text-[11px] text-text-secondary">
                      Sync typography and token palettes with Figma.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border-light/70 bg-surface-secondary/30 p-3">
                    <h4 className="text-xs font-semibold">MCP Connectors</h4>
                    <p className="mt-1 text-[11px] text-text-secondary">
                      Extensible local tool protocols over stdio and SSE.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
