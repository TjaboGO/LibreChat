/* eslint-disable i18next/no-literal-string */
import React, { useState, useRef, useCallback } from 'react';
import copy from 'copy-to-clipboard';
import { Button } from '@librechat/client';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  Send,
  Layers,
  ChevronRight,
  ChevronLeft,
  Wand2,
} from 'lucide-react';
import type { Artifact } from '~/common';
import { cn } from '~/utils';

interface ArtifactImageStudioProps {
  artifact: Artifact;
  isSharedConvo?: boolean;
}

export default function ArtifactImageStudio({
  artifact,
  isSharedConvo = false,
}: ArtifactImageStudioProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(true);

  // In-painting controls state
  const [selectedModel, setSelectedModel] = useState<string>('nano-banana-2');
  const [selectedRatio, setSelectedRatio] = useState<string>('1:1');
  const [inpaintPrompt, setInpaintPrompt] = useState<string>('');
  const [activeStyles, setActiveStyles] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const imageUrl = artifact.content || artifact.download?.filepath || '';
  const imageTitle = artifact.title || 'Generated Image';

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageTitle.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${imageTitle.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [imageUrl, imageTitle]);

  const handleCopyUrl = useCallback(() => {
    copy(imageUrl, { format: 'text/plain' });
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [imageUrl]);

  const toggleStyle = (style: string) => {
    setActiveStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const handleSendToComposer = () => {
    const styleModifiers = activeStyles.length > 0 ? ` (Styles: ${activeStyles.join(', ')})` : '';
    const formattedPrompt = `[In-Painting / ${selectedModel === 'nano-banana-2' ? 'Nano Banana 2' : 'Imagen 3'}]: ${inpaintPrompt.trim()}${styleModifiers} [Aspect Ratio: ${selectedRatio}] [Reference: ${imageTitle}]`;

    // Attempt to locate and set active composer textarea
    const textarea = document.querySelector<HTMLTextAreaElement>(
      'textarea[name="text"], textarea[placeholder*="Ask"], textarea[placeholder*="Message"], textarea',
    );
    if (textarea) {
      textarea.value = formattedPrompt;
      textarea.focus();
      // Dispatch input event for React forms
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }

    setIsSent(true);
    setTimeout(() => setIsSent(false), 2500);
  };

  const models = [
    { id: 'nano-banana-2', name: 'Nano Banana 2', badge: 'Best Typography & Editing' },
    { id: 'imagen-3', name: 'Google Imagen 3', badge: 'Photorealistic' },
    { id: 'flux-schnell', name: 'FLUX.1 Schnell', badge: 'High Speed' },
  ];

  const aspectRatios = ['1:1', '16:9', '9:16', '4:3'];

  const styleChips = [
    '✦ Crisp Typography',
    '✦ Photorealistic 8K',
    '✦ Studio Lighting',
    '✦ Cyberpunk Neon',
    '✦ Minimalist 3D',
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface-primary">
      {/* LEFT: Image Canvas Viewport */}
      <div className="relative flex flex-1 flex-col overflow-hidden border-r border-border-light">
        {/* Top Floating Toolbar */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-border-light bg-surface-primary/90 p-1 shadow-md backdrop-blur-sm">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomIn}
            className="h-7 w-7 p-0 text-text-secondary hover:text-text-primary"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomOut}
            className="h-7 w-7 p-0 text-text-secondary hover:text-text-primary"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          {zoom !== 1 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleResetZoom}
              className="h-7 w-7 p-0 text-text-secondary hover:text-text-primary"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
          <span className="px-1.5 font-mono text-[10px] text-text-tertiary">
            {Math.round(zoom * 100)}%
          </span>
          <div className="h-3.5 w-px bg-border-light" />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyUrl}
            className="h-7 w-7 p-0 text-text-secondary hover:text-text-primary"
            title="Copy Image URL"
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="h-7 w-7 p-0 text-text-secondary hover:text-text-primary"
            title="Download PNG"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Toggle Sidebar Button (Top Right of Canvas) */}
        <div className="absolute right-3 top-3 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsStudioOpen((prev) => !prev)}
            className="h-8 gap-1.5 rounded-lg border border-border-light bg-surface-primary/90 px-2.5 text-xs font-medium text-text-primary shadow-md backdrop-blur-sm"
          >
            <Wand2 className="h-3.5 w-3.5 text-amber-500" />
            <span>{isStudioOpen ? 'Hide Studio' : 'Edit with AI'}</span>
            {isStudioOpen ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Interactive Canvas */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={cn(
            'flex flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] p-6 [background-size:16px_16px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)]',
            zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default',
          )}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageTitle}
              draggable={false}
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
              className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain shadow-2xl ring-1 ring-border-light select-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-text-tertiary">
              <Layers className="h-10 w-10 stroke-1" />
              <p className="mt-2 text-xs">No image source available</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Conversational In-Painting Studio Sidebar */}
      {isStudioOpen && (
        <div className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-border-light bg-surface-primary-alt p-4 text-xs">
          {/* Header */}
          <div className="mb-4 flex items-center gap-2 border-b border-border-light pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Nano Banana 2 Studio</h3>
              <p className="text-[11px] text-text-secondary">
                Conversational In-Painting & Continuity
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Model Selector */}
            <div>
              <label className="mb-1.5 block font-medium text-text-secondary">AI Model Engine</label>
              <div className="flex flex-col gap-1.5">
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModel(m.id)}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-2 text-left transition-colors',
                      selectedModel === m.id
                        ? 'border-amber-500/50 bg-amber-500/10 text-text-primary ring-1 ring-amber-500/30'
                        : 'border-border-light bg-surface-primary hover:bg-surface-secondary',
                    )}
                  >
                    <div>
                      <div className="font-medium text-text-primary">{m.name}</div>
                      <div className="text-[10px] text-text-tertiary">{m.badge}</div>
                    </div>
                    {selectedModel === m.id && (
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="mb-1.5 block font-medium text-text-secondary">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-1.5">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setSelectedRatio(ratio)}
                    className={cn(
                      'rounded-md border py-1.5 text-center font-mono text-[11px] font-medium transition-colors',
                      selectedRatio === ratio
                        ? 'border-amber-500 bg-amber-500 text-white'
                        : 'border-border-light bg-surface-primary text-text-secondary hover:text-text-primary',
                    )}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Enhancer Chips */}
            <div>
              <label className="mb-1.5 block font-medium text-text-secondary">
                Style & Detail Enhancers
              </label>
              <div className="flex flex-wrap gap-1.5">
                {styleChips.map((chip) => {
                  const isActive = activeStyles.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleStyle(chip)}
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors',
                        isActive
                          ? 'border-amber-500 bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          : 'border-border-light bg-surface-primary text-text-secondary hover:text-text-primary',
                      )}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversational In-Painting Directive */}
            <div>
              <label className="mb-1.5 block font-medium text-text-secondary">
                In-Painting Directive (Modifications)
              </label>
              <textarea
                rows={4}
                value={inpaintPrompt}
                onChange={(e) => setInpaintPrompt(e.target.value)}
                placeholder="What should change? (e.g. 'Replace the coffee cup with an iced matcha latte with lime, keep desk lighting the same')..."
                className="w-full resize-none rounded-lg border border-border-light bg-surface-primary p-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-amber-500 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-text-tertiary">
                Nano Banana 2 preserves character continuity and changes only target regions.
              </p>
            </div>

            {/* Submit to Composer Action Button */}
            <Button
              variant="default"
              size="sm"
              disabled={isSharedConvo || inpaintPrompt.trim().length === 0}
              onClick={handleSendToComposer}
              className={cn(
                'h-8 w-full gap-1.5 text-xs font-medium transition-all duration-150',
                isSent
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-surface-submit text-white hover:bg-surface-submit-hover',
              )}
            >
              {isSent ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Sent to prompt box!</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send In-Painting Prompt</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
