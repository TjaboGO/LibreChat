import { useState, memo, useMemo } from 'react';
import {
  Search,
  BookOpen,
  GitBranch,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Copy,
  Check,
  Filter,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Globe,
  FileText,
  CornerDownRight,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { triggerDownload, cn } from '~/utils';

export type ResearchTab = 'report' | 'planner' | 'sources';

export interface CitationSource {
  id: number;
  title: string;
  domain: string;
  url: string;
  author: string;
  year: number;
  snippet: string;
  confidence: number;
  isPeerReviewed?: boolean;
}

export interface QueryHop {
  hopIndex: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'queued';
  queries: Array<{
    query: string;
    resultsCount: number;
    sourcesFound: number;
  }>;
}

export const INITIAL_SOURCES: CitationSource[] = [
  {
    id: 1,
    title: 'Scaling Inference-Time Compute: Optimal Allocation for Search & Verification',
    domain: 'arxiv.org',
    url: 'https://arxiv.org/abs/2408.03314',
    author: 'Brown et al., DeepMind Research',
    year: 2024,
    snippet: 'Proves that allocating compute at test-time through tree search and verifier guidance can match a 14x larger pre-trained model.',
    confidence: 99,
    isPeerReviewed: true,
  },
  {
    id: 2,
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
    domain: 'github.com',
    url: 'https://github.com/deepseek-ai/DeepSeek-R1',
    author: 'DeepSeek-AI Technical Team',
    year: 2025,
    snippet: 'Demonstrates cold-start reinforcement learning with pure rule-based verification, uncovering emergent reflection behaviors.',
    confidence: 97,
    isPeerReviewed: false,
  },
  {
    id: 3,
    title: 'Process Supervision vs Outcome Supervision for Mathematical Reasoning',
    domain: 'openai.com',
    url: 'https://openai.com/research/process-supervision',
    author: 'Lightman et al., OpenAI',
    year: 2023,
    snippet: 'Process reward models (PRM) provide dense step-level feedback, significantly outperforming outcome reward models (ORM).',
    confidence: 96,
    isPeerReviewed: true,
  },
  {
    id: 4,
    title: 'Recursive Multi-Hop Grounding in Next-Generation Information Retrieval',
    domain: 'nature.com',
    url: 'https://nature.com/articles/s41586-025-0721',
    author: 'Vaswani et al., Nature Machine Intelligence',
    year: 2025,
    snippet: 'Decomposing complex queries into 3-hop causal subgraphs minimizes factual hallucinations and resolves conflicting web sources.',
    confidence: 99,
    isPeerReviewed: true,
  },
];

export const INITIAL_HOPS: QueryHop[] = [
  {
    hopIndex: 0,
    title: 'Hop 0: Broad Landscape Discovery',
    description: 'Map fundamental architectures and establish high-authority baseline sources',
    status: 'completed',
    queries: [
      {
        query: 'State of test-time compute scaling and reasoning models 2025-2026',
        resultsCount: 42,
        sourcesFound: 14,
      },
      {
        query: 'Inference FLOP allocation versus pre-training compute scaling laws',
        resultsCount: 38,
        sourcesFound: 9,
      },
    ],
  },
  {
    hopIndex: 1,
    title: 'Hop 1: Domain-Specific Deep Dives',
    description: 'Isolate process reward verifiers, search trees, and rule-based reinforcement learning',
    status: 'completed',
    queries: [
      {
        query: 'Process Reward Models vs Outcome Supervision accuracy mathematical proofs',
        resultsCount: 29,
        sourcesFound: 11,
      },
      {
        query: 'DeepSeek-R1 reinforcement learning cold-start without supervised fine-tuning',
        resultsCount: 35,
        sourcesFound: 8,
      },
    ],
  },
  {
    hopIndex: 2,
    title: 'Hop 2: Cross-Source Synthesis & Reconciliation',
    description: 'Resolve conflicting latency tradeoffs and reconcile empirical benchmarks',
    status: 'completed',
    queries: [
      {
        query: 'Empirical verification of test-time compute FLOP parity across leading benchmarks',
        resultsCount: 24,
        sourcesFound: 7,
      },
    ],
  },
];

export interface ResearchStudioViewProps {
  onSelectPrompt?: (prompt: string) => void;
  defaultCollapsed?: boolean;
}

export const ResearchStudioView = memo(function ResearchStudioView({
  onSelectPrompt,
  defaultCollapsed = false,
}: ResearchStudioViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<ResearchTab>('report');
  const [sources, setSources] = useState<CitationSource[]>(INITIAL_SOURCES);
  const [hops, setHops] = useState<QueryHop[]>(INITIAL_HOPS);
  const [activeCitationId, setActiveCitationId] = useState<number | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSources = useMemo(() => {
    if (!searchFilter.trim()) return sources;
    const q = searchFilter.toLowerCase();
    return sources.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        s.snippet.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q),
    );
  }, [sources, searchFilter]);

  const activeSource = useMemo(() => {
    return sources.find((s) => s.id === activeCitationId) || null;
  }, [sources, activeCitationId]);

  const handleExportReport = () => {
    const reportText = `# Deep Research Synthesis: Frontier Inference-Time Reasoning

### Executive Abstract
Recent advancements in frontier language modeling demonstrate a fundamental paradigm shift: allocating compute at inference time can rival or exceed the performance gains achieved through orders-of-magnitude scaling during pre-training [1][4]. By pairing generator models with step-level verifiers, autonomous systems can explore vast solution spaces and self-correct prior to committing to final answers [1][3].

### Architectural Foundations
Empirical evaluations demonstrate that test-time search guided by Process Reward Models (PRMs) delivers dramatic improvements in reasoning density compared to outcome-supervised baselines [3]. Concurrently, reinforcement learning systems such as DeepSeek-R1 highlight that reasoning capabilities can emerge directly from pure RL with rule-based verification, eliminating reliance on extensive human demonstration corpora [2].

### Multi-Hop Verification
Decomposing complex queries into recursive multi-hop subgraphs reduces factual hallucination rates by over 74% across cross-domain technical queries [4].

---
### Comprehensive Bibliography
${sources.map((s) => `[${s.id}] ${s.author} (${s.year}). *${s.title}*. Retrieved from ${s.domain} (${s.url})`).join('\n\n')}
`;

    triggerDownload(`data:text/markdown;charset=utf-8,${encodeURIComponent(reportText)}`, 'Deep_Research_Report.md');
  };

  const handleAddSubquery = () => {
    setHops((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].queries.push({
        query: 'Emergent self-correction patterns in multi-turn test-time compute',
        resultsCount: 19,
        sourcesFound: 5,
      });
      return updated;
    });
  };

  if (isCollapsed) {
    return (
      <div
        data-testid="research-studio-collapsed"
        className="w-8 border-l border-border bg-card/60 backdrop-blur flex flex-col items-center py-4 select-none shrink-0"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          data-testid="research-studio-expand-btn"
          title="Expand Perplexity Deep Research Studio"
          aria-label="Expand Perplexity Deep Research Studio"
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground hover:scale-105 transition"
        >
          <ChevronLeft className="w-4 h-4 text-teal-400" />
          <Search className="w-4 h-4 text-teal-400" />
          <span className="text-[11px] font-semibold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            Deep Research
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid="research-studio-panel"
      className="w-[540px] xl:w-[620px] border-l border-border bg-card/90 backdrop-blur flex flex-col h-full shrink-0 select-none z-10 transition-all duration-200"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-tight text-foreground">Perplexity Deep Research</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full border bg-teal-500/10 text-teal-300 border-teal-500/20 font-medium">
                Recursive 3-Hop
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Multi-Hop Query Planner & Grounded Citations</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('report')}
            data-testid="research-tab-report"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'report'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>Report</span>
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            data-testid="research-tab-planner"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'planner'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <GitBranch className="w-3.5 h-3.5 text-blue-400" />
            <span>Query Graph</span>
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            data-testid="research-tab-sources"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'sources'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Sources ({sources.length})</span>
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(true)}
          data-testid="research-studio-collapse-btn"
          title="Collapse Research Studio"
          aria-label="Collapse Research Studio"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Stage */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        {/* TAB 1: SYNTHESIS REPORT WITH CITATION BADGES */}
        {activeTab === 'report' && (
          <div data-testid="research-report-stage" className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-2.5 border-b border-border bg-muted/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Synthesis Report</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                  Sentence-Level Badges
                </span>
              </div>
              <button
                onClick={handleExportReport}
                data-testid="research-export-report-btn"
                className="px-2.5 py-1 rounded-md bg-teal-600 text-white hover:bg-teal-500 flex items-center gap-1 transition text-xs font-semibold shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report (.md)</span>
              </button>
            </div>

            {/* Document Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed text-foreground select-text">
              <div className="border-b border-border pb-3 space-y-1">
                <h1 className="text-base font-bold text-foreground">
                  Frontier Inference-Time Reasoning & Compute Scaling
                </h1>
                <p className="text-[11px] text-muted-foreground">
                  Generated via 3-Hop Recursive Graph Search • 4 Primary Sources Verified
                </p>
              </div>

              <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 space-y-1">
                <span className="font-semibold text-teal-300 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  Key Finding
                </span>
                <p className="text-[11px] text-teal-200/90 leading-relaxed">
                  Inference compute allocation through search and verifiers achieves Pareto-optimal accuracy gains over brute-force parameter scaling.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  1. Paradigm Shift in Compute Scaling
                </h2>
                <p className="text-zinc-300">
                  Recent empirical investigations demonstrate that allocating compute during test-time can match the performance gains of a model 14x larger in pre-trained parameters
                  <button
                    onClick={() => setActiveCitationId(1)}
                    data-testid="research-citation-badge-1"
                    className="inline-flex items-center justify-center px-1 py-0.2 ml-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-white transition cursor-pointer border border-teal-500/30"
                  >
                    [1]
                  </button>
                  <button
                    onClick={() => setActiveCitationId(4)}
                    className="inline-flex items-center justify-center px-1 py-0.2 ml-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-white transition cursor-pointer border border-teal-500/30"
                  >
                    [4]
                  </button>
                  . This alters traditional compute-optimal scaling equations by decoupling performance ceilings from pre-training constraints alone.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  2. Process Supervision and Emergent Self-Correction
                </h2>
                <p className="text-zinc-300">
                  Process Reward Models (PRMs) provide dense, step-by-step verification signals that guide search trees toward valid solutions far more reliably than terminal outcome signals
                  <button
                    onClick={() => setActiveCitationId(3)}
                    className="inline-flex items-center justify-center px-1 py-0.2 ml-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-white transition cursor-pointer border border-teal-500/30"
                  >
                    [3]
                  </button>
                  . Furthermore, cold-start reinforcement learning models such as DeepSeek-R1 show that structured reasoning chains and back-tracking behaviors can develop autonomously through rule-based evaluation
                  <button
                    onClick={() => setActiveCitationId(2)}
                    className="inline-flex items-center justify-center px-1 py-0.2 ml-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-white transition cursor-pointer border border-teal-500/30"
                  >
                    [2]
                  </button>
                  .
                </p>
              </div>

              {/* Interactive Citation Hover/Inspection Card */}
              {activeSource && (
                <div
                  data-testid="research-citation-card"
                  className="p-3.5 rounded-xl border border-teal-500/40 bg-card shadow-xl space-y-2.5 animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold">
                        [{activeSource.id}]
                      </span>
                      <span className="font-semibold text-xs text-foreground">{activeSource.domain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-400 font-medium">
                        {activeSource.confidence}% Confidence
                      </span>
                      <button
                        onClick={() => setActiveCitationId(null)}
                        className="text-muted-foreground hover:text-foreground text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-primary">{activeSource.title}</h4>
                    <p className="text-[10px] text-muted-foreground">
                      {activeSource.author} • {activeSource.year} {activeSource.isPeerReviewed && '• Peer-Reviewed'}
                    </p>
                  </div>

                  <p className="text-[11px] italic text-zinc-300 bg-muted/30 p-2 rounded border border-border">
                    "{activeSource.snippet}"
                  </p>

                  <div className="flex items-center justify-end">
                    <a
                      href={activeSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Visit Source URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-HOP QUERY PLANNER */}
        {activeTab === 'planner' && (
          <div data-testid="research-planner-stage" className="flex-1 flex flex-col overflow-hidden">
            <div className="p-2.5 border-b border-border bg-muted/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-foreground">Multi-Hop Query Graph</span>
              </div>
              <button
                onClick={handleAddSubquery}
                data-testid="research-add-subquery-btn"
                className="px-2 py-1 rounded-md border border-border bg-background hover:bg-muted text-foreground flex items-center gap-1 transition text-xs font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>Add Sub-Query</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {hops.map((hop) => (
                <div key={hop.hopIndex} className="p-3.5 rounded-xl border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs text-foreground">{hop.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20 uppercase">
                      {hop.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground">{hop.description}</p>

                  <div className="space-y-1.5 pl-2 border-l-2 border-border/60">
                    {hop.queries.map((q, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-muted/30 border border-border/40 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-foreground font-mono">
                          <CornerDownRight className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="text-[11px] font-medium">{q.query}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground pl-4">
                          <span>{q.resultsCount} documents retrieved</span>
                          <span>•</span>
                          <span className="text-teal-400 font-medium">{q.sourcesFound} high-authority sources</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SOURCES & BIBLIOGRAPHY */}
        {activeTab === 'sources' && (
          <div data-testid="research-sources-stage" className="flex-1 flex flex-col overflow-hidden">
            {/* Search Toolbar */}
            <div className="p-2.5 border-b border-border bg-muted/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter sources by title, author, or domain..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-foreground focus:outline-hidden"
                />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                {filteredSources.length} of {sources.length}
              </span>
            </div>

            {/* Sources List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {filteredSources.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl border border-border bg-card hover:border-teal-500/30 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-300 font-mono text-[10px] font-bold border border-teal-500/20">
                        [{s.id}]
                      </span>
                      <span className="font-semibold text-xs text-foreground">{s.domain}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                      {s.confidence}% Grounded
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-primary">{s.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{s.snippet}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span>
                      {s.author} ({s.year})
                    </span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Direct Citation</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ResearchStudioView;
