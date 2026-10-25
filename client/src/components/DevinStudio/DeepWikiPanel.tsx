import { useState, useMemo, memo } from 'react';
import {
  BookOpen,
  Layers,
  Code,
  FileText,
  Search,
  RefreshCw,
  ChevronRight,
  Check,
  Copy,
  Cpu,
  GitBranch,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import {
  useDeepWikiQuery,
  useInspectCodeMutation,
  useGenerateWikiMutation,
  type ArchitectureModule,
  type WikiCitation,
} from '~/data-provider/Devin/queries';
import { cn } from '~/utils';

export interface DeepWikiPanelProps {
  className?: string;
  onSelectPrompt?: (prompt: string) => void;
}

export const DeepWikiPanel = memo(function DeepWikiPanel({
  className,
  onSelectPrompt,
}: DeepWikiPanelProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'wiki' | 'inspect'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('client');
  const [inspectPath, setInspectPath] = useState<string>('client/src/routes/AppRoute.tsx');
  const [inspectStartLine, setInspectStartLine] = useState<number>(1);
  const [inspectEndLine, setInspectEndLine] = useState<number>(50);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Queries & Mutations
  const { data: wikiData, isLoading, refetch } = useDeepWikiQuery();
  const inspectMutation = useInspectCodeMutation();
  const generateWikiMutation = useGenerateWikiMutation();

  const modules = wikiData?.modules ?? [];
  const citations = wikiData?.citations ?? [];

  // Filter modules by search
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) {
      return modules;
    }
    const q = searchQuery.toLowerCase();
    return modules.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.path.toLowerCase().includes(q) ||
        m.tech.some((t) => t.toLowerCase().includes(q)) ||
        m.keyFiles.some((f) => f.toLowerCase().includes(q)),
    );
  }, [modules, searchQuery]);

  const activeModule = useMemo(() => {
    return modules.find((m) => m.id === selectedModuleId) || modules[0];
  }, [modules, selectedModuleId]);

  const handleInspectFile = (filePath: string, start = 1, end = 50) => {
    setInspectPath(filePath);
    setInspectStartLine(start);
    setInspectEndLine(end);
    setActiveTab('inspect');
    inspectMutation.mutate({ path: filePath, startLine: start, endLine: end });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const starterPrompts = [
    {
      title: 'Explain Scoped Routing',
      prompt: 'Explain how AppRoute and useCurrentApp scope conversations to specific AI applications.',
    },
    {
      title: 'Audit App Dispatcher',
      prompt: 'Analyze appDispatcher.ts and describe how OpenRouter reasoning content is preserved.',
    },
    {
      title: 'Trace Manus Execution Loop',
      prompt: 'Review packages/data-provider/src/manus/ and list all 31 discrete tools and stdin flow.',
    },
    {
      title: 'Generate Architecture Report',
      prompt: 'Use DeepWiki guidelines to generate a full architectural report with <cite> citations.',
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full bg-surface-primary text-text-primary border-l border-border-light text-sm select-none',
        className,
      )}
      data-testid="deepwiki-panel"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-surface-secondary/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-xs text-text-primary">
              <span>Cognition Devin</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                DeepWiki
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">Codebase Architecture Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors"
            title="Refresh DeepWiki"
            aria-label="Refresh DeepWiki"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-light bg-surface-secondary/30 px-3 pt-2 gap-1">
        <button
          onClick={() => setActiveTab('map')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors border-b-2',
            activeTab === 'map'
              ? 'border-indigo-500 text-indigo-500 bg-surface-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary',
          )}
          data-testid="deepwiki-tab-map"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture Map</span>
        </button>

        <button
          onClick={() => setActiveTab('wiki')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors border-b-2',
            activeTab === 'wiki'
              ? 'border-indigo-500 text-indigo-500 bg-surface-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary',
          )}
          data-testid="deepwiki-tab-wiki"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>DeepWiki Docs</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('inspect');
            if (!inspectMutation.data && inspectPath) {
              inspectMutation.mutate({ path: inspectPath, startLine: inspectStartLine, endLine: inspectEndLine });
            }
          }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors border-b-2',
            activeTab === 'inspect'
              ? 'border-indigo-500 text-indigo-500 bg-surface-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary',
          )}
          data-testid="deepwiki-tab-inspect"
        >
          <Code className="w-3.5 h-3.5" />
          <span>Code Inspector</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2 border-b border-border-light/60 bg-surface-primary">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules, files, technology..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-surface-secondary border border-border-light rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'map' && (
          <div className="space-y-4" data-testid="architecture-map-content">
            {/* Visual Interactive Subsystem Map */}
            <div className="p-3.5 bg-surface-secondary/40 border border-border-light rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  System Topology & Data Flow
                </span>
                <span className="text-[10px] text-text-secondary">Click module to inspect</span>
              </div>

              {/* Node Flow Representation */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {modules.map((mod) => {
                  const isSelected = mod.id === selectedModuleId;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedModuleId(mod.id)}
                      className={cn(
                        'flex flex-col text-left p-2.5 rounded-lg border transition-all',
                        isSelected
                          ? 'border-indigo-500/80 bg-indigo-500/10 shadow-sm'
                          : 'border-border-light bg-surface-primary hover:border-border-medium hover:bg-surface-secondary/50',
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-semibold text-text-primary truncate">{mod.title}</span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-surface-tertiary text-text-secondary font-mono">
                          {mod.path}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary line-clamp-2">{mod.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Module Deep Dive */}
            {activeModule && (
              <div className="p-4 bg-surface-secondary/20 border border-border-light rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-text-primary">{activeModule.title}</h3>
                    <p className="text-xs text-text-secondary font-mono mt-0.5">{activeModule.path}</p>
                  </div>
                  <button
                    onClick={() => {
                      generateWikiMutation.mutate({ topic: activeModule.id, targetPath: activeModule.path });
                    }}
                    disabled={generateWikiMutation.isLoading}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>DeepWiki Analyze</span>
                  </button>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">{activeModule.description}</p>

                {/* Tech Tags */}
                <div>
                  <span className="text-[11px] font-medium text-text-secondary block mb-1.5">Technologies:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeModule.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[11px] rounded bg-surface-secondary text-text-secondary border border-border-light"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Files with clickable Inspect badge */}
                <div>
                  <span className="text-[11px] font-medium text-text-secondary block mb-1.5">Key Source Files:</span>
                  <div className="space-y-1">
                    {activeModule.keyFiles.map((file) => (
                      <div
                        key={file}
                        onClick={() => handleInspectFile(file, 1, 60)}
                        className="group flex items-center justify-between p-1.5 rounded hover:bg-surface-secondary border border-transparent hover:border-border-light cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="text-xs font-mono text-text-primary truncate">{file}</span>
                        </div>
                        <span className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity">
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wiki' && (
          <div className="space-y-4" data-testid="deepwiki-docs-content">
            {/* Architecture Invariants Card */}
            <div className="p-3.5 bg-surface-secondary/40 border border-border-light rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-indigo-500">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  DeepWiki Architectural Invariants
                </span>
              </div>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-text-primary">Multi-App Shell:</strong> 72 independent application suites
                  routed through <code className="text-indigo-400">/app/:appId</code> with isolated conversation histories.
                </li>
                <li>
                  <strong className="text-text-primary">Authentic System Prompts:</strong> Loaded directly from verified
                  official prompts with zero placeholder leakage and strict model layer independence.
                </li>
                <li>
                  <strong className="text-text-primary">Reasoning Content Preservation:</strong> OpenRouter thinking tags
                  and COT tokens retained in assistant turns across streaming dispatches.
                </li>
                <li>
                  <strong className="text-text-primary">Code Citation Discipline:</strong> All architectural claims end in
                  verifiable <code className="text-indigo-400">&lt;cite repo=&quot;...&quot; path=&quot;...&quot; /&gt;</code> tags.
                </li>
              </ul>
            </div>

            {/* Clickable Citations List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
                Verified Codebase Citations
              </span>
              <div className="space-y-2">
                {citations.map((cite, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleInspectFile(cite.path, cite.start, cite.end)}
                    className="p-3 bg-surface-primary hover:bg-surface-secondary/60 border border-border-light hover:border-indigo-500/40 rounded-lg cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-indigo-500">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-semibold">{cite.path}</span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-surface-secondary text-text-secondary">
                          L{cite.start}–L{cite.end}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-secondary group-hover:text-indigo-500 flex items-center gap-1 transition-colors">
                        <span>View lines</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-snug">{cite.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Devin Starters */}
            <div className="p-3 bg-surface-secondary/20 border border-border-light rounded-lg space-y-2">
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
                Devin Quick Questions
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {starterPrompts.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectPrompt?.(starter.prompt)}
                    className="flex items-center justify-between text-left p-2 rounded bg-surface-primary hover:bg-surface-secondary border border-border-light text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-medium text-text-primary block">{starter.title}</span>
                      <span className="text-[11px] text-text-secondary truncate block">{starter.prompt}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-text-secondary" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inspect' && (
          <div className="space-y-3" data-testid="code-inspector-content">
            {/* Inspector Controls */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inspectPath}
                  onChange={(e) => setInspectPath(e.target.value)}
                  placeholder="File path to inspect (e.g. client/src/routes/AppRoute.tsx)"
                  className="w-full px-2.5 py-1.5 text-xs bg-surface-secondary font-mono border border-border-light rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() =>
                  inspectMutation.mutate({
                    path: inspectPath,
                    startLine: inspectStartLine,
                    endLine: inspectEndLine,
                  })
                }
                disabled={inspectMutation.isLoading}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shrink-0"
              >
                {inspectMutation.isLoading ? 'Reading...' : 'Inspect'}
              </button>
            </div>

            {/* Snippet / Code Display */}
            {inspectMutation.data && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-text-primary font-semibold">
                      {inspectMutation.data.path}
                    </span>
                    {inspectMutation.data.totalLines && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-secondary border border-border-light">
                        {inspectMutation.data.totalLines} lines
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(inspectMutation.data?.content || '')}
                    className="flex items-center gap-1 text-[11px] text-indigo-500 hover:text-indigo-400 transition-colors"
                  >
                    {copiedSnippet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy Content'}</span>
                  </button>
                </div>

                <div className="p-3 bg-gray-950 text-gray-200 rounded-lg font-mono text-[11px] overflow-x-auto max-h-[460px] border border-gray-800 leading-relaxed whitespace-pre select-text">
                  {inspectMutation.data.snippet || inspectMutation.data.content || 'No content found.'}
                </div>
              </div>
            )}

            {inspectMutation.isError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                Failed to inspect file. Make sure the path is inside the repository root.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default DeepWikiPanel;
