import { useState, memo, useMemo } from 'react';
import {
  Compass,
  Globe,
  Camera,
  RotateCw,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  Check,
  FileText,
  Layers,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { triggerDownload, cn } from '~/utils';

export type AtlasTab = 'browser' | 'dom' | 'screenshot';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface PageMetadata {
  url: string;
  title: string;
  description: string;
  headings: string[];
  linksCount: number;
  wordCount: number;
}

export const INITIAL_PAGE_METADATA: PageMetadata = {
  url: 'https://openai.com/index/introducing-chatgpt-atlas',
  title: 'Introducing ChatGPT Atlas: The AI Browser Companion',
  description:
    'ChatGPT Atlas bridges the gap between conversational intelligence and real-time web navigation with live tab context and side-chat.',
  headings: [
    '1. Live Tab Context & Side-Chat Companion',
    '2. Visual Web Grounding via Playwright MCP',
    '3. Autonomous Action Execution on the Web',
  ],
  linksCount: 24,
  wordCount: 840,
};

export interface AtlasWorkspaceViewProps {
  onSelectPrompt?: (prompt: string) => void;
  defaultCollapsed?: boolean;
}

export const AtlasWorkspaceView = memo(function AtlasWorkspaceView({
  onSelectPrompt,
  defaultCollapsed = false,
}: AtlasWorkspaceViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<AtlasTab>('browser');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [url, setUrl] = useState('https://openai.com/index/introducing-chatgpt-atlas');
  const [isReloading, setIsReloading] = useState(false);
  const [metadata, setMetadata] = useState<PageMetadata>(INITIAL_PAGE_METADATA);
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [copiedContext, setCopiedContext] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 600);
  };

  const handleTakeScreenshot = () => {
    setScreenshotTaken(true);
    setActiveTab('screenshot');
  };

  const handleSendContextToChat = () => {
    const contextPrompt = `I am browsing ${metadata.url}.
Page Title: "${metadata.title}"
Summary: ${metadata.description}

Key Sections:
${metadata.headings.map((h) => `- ${h}`).join('\n')}

Please analyze this page and extract the primary product capabilities.`;

    onSelectPrompt?.(contextPrompt);
    setCopiedContext(true);
    setTimeout(() => setCopiedContext(false), 2000);
  };

  if (isCollapsed) {
    return (
      <div
        data-testid="atlas-studio-collapsed"
        className="w-8 border-l border-border bg-card/60 backdrop-blur flex flex-col items-center py-4 select-none shrink-0"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          data-testid="atlas-studio-expand-btn"
          title="Expand ChatGPT Atlas Companion"
          aria-label="Expand ChatGPT Atlas Companion"
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground hover:scale-105 transition"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-500" />
          <Compass className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-semibold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            ChatGPT Atlas
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid="atlas-studio-panel"
      className="w-[540px] xl:w-[620px] border-l border-border bg-card/90 backdrop-blur flex flex-col h-full shrink-0 select-none z-10 transition-all duration-200"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-tight text-foreground">ChatGPT Atlas</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/20 font-medium">
                Live Web Companion
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Browser Side-Chat & DOM Intelligence</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('browser')}
            data-testid="atlas-tab-browser"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'browser'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Browser</span>
          </button>
          <button
            onClick={() => setActiveTab('dom')}
            data-testid="atlas-tab-dom"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'dom'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>DOM Context</span>
          </button>
          <button
            onClick={() => setActiveTab('screenshot')}
            data-testid="atlas-tab-screenshot"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'screenshot'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Playwright MCP</span>
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(true)}
          data-testid="atlas-studio-collapse-btn"
          title="Collapse Atlas Companion"
          aria-label="Collapse Atlas Companion"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Workspace Stage */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        {/* TAB 1: LIVE WEB BROWSER VIEW */}
        {activeTab === 'browser' && (
          <div data-testid="atlas-browser-stage" className="flex-1 flex flex-col overflow-hidden">
            {/* Address Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/20 text-xs gap-2">
              <div className="flex items-center gap-1.5 flex-1">
                <button
                  onClick={handleReload}
                  data-testid="atlas-reload-btn"
                  className={cn(
                    'p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition',
                    isReloading && 'animate-spin text-emerald-400',
                  )}
                  title="Reload Page"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-1 flex-1 bg-background border border-border rounded px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-transparent border-none text-foreground text-[11px] font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Viewport & Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 bg-muted/50 p-0.5 rounded border border-border">
                  <button
                    onClick={() => setViewport('desktop')}
                    className={cn(
                      'p-1 rounded transition',
                      viewport === 'desktop' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground',
                    )}
                    title="Desktop"
                  >
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setViewport('tablet')}
                    className={cn(
                      'p-1 rounded transition',
                      viewport === 'tablet' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground',
                    )}
                    title="Tablet"
                  >
                    <Tablet className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setViewport('mobile')}
                    className={cn(
                      'p-1 rounded transition',
                      viewport === 'mobile' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground',
                    )}
                    title="Mobile"
                  >
                    <Smartphone className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={handleTakeScreenshot}
                  data-testid="atlas-screenshot-btn"
                  className="px-2 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1 text-[11px] font-medium transition"
                  title="Capture Screenshot via Playwright MCP"
                >
                  <Camera className="w-3 h-3" />
                  <span>Snap</span>
                </button>
              </div>
            </div>

            {/* Browser Viewport Canvas */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-zinc-950/40">
              <div
                className={cn(
                  'h-full border border-border rounded-xl bg-card shadow-lg flex flex-col overflow-hidden transition-all duration-200',
                  viewport === 'desktop' && 'w-full',
                  viewport === 'tablet' && 'w-[440px] max-w-full',
                  viewport === 'mobile' && 'w-[320px] max-w-full',
                )}
              >
                {/* Simulated Webpage Content */}
                <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
                  <div className="space-y-1 border-b border-border pb-3">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                      OpenAI Research & Announcements
                    </span>
                    <h2 className="text-base font-bold text-foreground">{metadata.title}</h2>
                    <p className="text-muted-foreground text-[11px]">{metadata.description}</p>
                  </div>

                  <div className="space-y-2 text-zinc-300">
                    <h3 className="font-semibold text-xs text-foreground">{metadata.headings[0]}</h3>
                    <p>
                      Side-Chat mode allows ChatGPT to seamlessly inspect the active webpage DOM, extract tables, and summarize dense documentation without context switching.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                    <span className="text-xs font-semibold text-foreground">Live Actions</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleSendContextToChat}
                        data-testid="atlas-send-context-btn"
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-xs flex items-center gap-1"
                      >
                        {copiedContext ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                        <span>{copiedContext ? 'Injected in Chat' : 'Attach Page Context'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE DOM CONTEXT INSPECTION */}
        {activeTab === 'dom' && (
          <div data-testid="atlas-dom-stage" className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Page Hierarchy & Extracted Headings
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Live tree parsed directly from the active tab.
              </p>
            </div>

            <div className="border border-border rounded-lg p-3 bg-card space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Document Title</span>
                <span className="text-[10px] font-mono text-muted-foreground">{metadata.wordCount} words</span>
              </div>
              <p className="text-xs font-mono text-emerald-400 bg-muted/30 p-2 rounded border border-border">
                {metadata.title}
              </p>
            </div>

            <div className="border border-border rounded-lg p-3 bg-card space-y-2">
              <span className="text-xs font-semibold text-foreground">Extracted Outline</span>
              <div className="space-y-1.5">
                {metadata.headings.map((h, idx) => (
                  <div key={idx} className="p-2 rounded bg-muted/20 border border-border text-[11px] text-zinc-300 font-mono">
                    {h}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLAYWRIGHT MCP SCREENSHOT */}
        {activeTab === 'screenshot' && (
          <div data-testid="atlas-screenshot-stage" className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground">Playwright MCP Viewport Capture</h3>
                <p className="text-[11px] text-muted-foreground">High-fidelity pixel canvas captured from active tab</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                1920x1080 Viewport
              </span>
            </div>

            <div className="flex-1 border border-border rounded-xl bg-zinc-950 p-4 flex flex-col items-center justify-center space-y-3">
              <div className="w-full max-w-md aspect-video rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl flex flex-col items-center justify-center p-6 text-center space-y-2">
                <Camera className="w-8 h-8 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-zinc-200">Playwright MCP Screen Buffer</span>
                <p className="text-[10px] text-zinc-400 max-w-xs">
                  Captured viewport at {metadata.url} with complete visual grounding.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default AtlasWorkspaceView;
