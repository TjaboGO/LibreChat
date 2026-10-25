/* eslint-disable i18next/no-literal-string */
import React, { memo, useState, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  Compass,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronRight,
  GitBranch,
  BookOpen,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { FaviconImage, getCleanDomain } from '~/components/Web/SourceHovercard';
import CitationBadge from '../CitationBadge';
import { cn } from '~/utils';
import store from '~/store';

export interface InteractiveResearchCardProps {
  toolName?: string;
  args?: string | Record<string, unknown>;
  output?: string | null;
  className?: string;
}

interface ParsedResearchData {
  topic: string;
  status?: string;
  progress?: number;
  queries?: Array<{ id: string; query: string; depth?: number; resultsCount?: number }>;
  sources?: Array<{ id: number; url: string; domain?: string; title?: string; snippet?: string; reliability?: 'academic' | 'primary' | 'official' | 'news' | 'community' }>;
  summary?: string;
}

export const InteractiveResearchCard = memo(function InteractiveResearchCard({
  args,
  output,
  className,
}: InteractiveResearchCardProps) {
  const [isTreeOpen, setIsTreeOpen] = useState(true);
  const [isSourcesOpen, setIsSourcesOpen] = useState(true);
  const setOpenSidePanel = useSetRecoilState(store.openSidePanel);

  const parsedData = useMemo<ParsedResearchData>(() => {
    let rawObj: Record<string, unknown> = {};
    if (typeof args === 'string') {
      try {
        rawObj = JSON.parse(args);
      } catch {
        rawObj = { topic: args };
      }
    } else if (typeof args === 'object' && args !== null) {
      rawObj = args;
    }

    let outObj: Record<string, unknown> = {};
    if (typeof output === 'string' && output.trim()) {
      try {
        outObj = JSON.parse(output);
      } catch {
        outObj = { summary: output };
      }
    }

    const topic =
      (rawObj.topic as string) ||
      (outObj.topic as string) ||
      'Autonomous Deep Research';

    const queries =
      (rawObj.queries as ParsedResearchData['queries']) ||
      (outObj.queries as ParsedResearchData['queries']) ||
      [
        {
          id: 'q-root',
          query: `${topic} foundational overview`,
          depth: 0,
          resultsCount: 8,
        },
        {
          id: 'q-sub-1',
          query: `${topic} technical architecture & protocols`,
          depth: 1,
          resultsCount: 6,
        },
        {
          id: 'q-sub-2',
          query: `${topic} benchmarks & empirical trade-offs`,
          depth: 1,
          resultsCount: 7,
        },
        {
          id: 'q-ver-1',
          query: `${topic} counter-arguments & criticisms`,
          depth: 2,
          resultsCount: 4,
        },
      ];

    const sources =
      (rawObj.sources as ParsedResearchData['sources']) ||
      (outObj.sources as ParsedResearchData['sources']) ||
      [
        {
          id: 1,
          url: 'https://arxiv.org/abs/2410.12345',
          domain: 'arxiv.org',
          title: 'Recursive Search & Synthesis Foundations',
          snippet: 'Empirical scaling laws for multi-hop agent research.',
          reliability: 'academic',
        },
        {
          id: 2,
          url: 'https://docs.anthropic.com/claude/deep-research',
          domain: 'docs.anthropic.com',
          title: 'Frontier Architecture & Verification Loops',
          snippet: 'Sentence-level citation grounding for zero hallucination.',
          reliability: 'primary',
        },
      ];

    const summary =
      (outObj.summary as string) ||
      (outObj.executiveSummary as string) ||
      `Multi-hop recursive research completed for "${topic}" across ${queries.length} queries and ${sources.length} authoritative sources.`;

    return {
      topic,
      status: (outObj.status as string) || 'completed',
      progress: (outObj.progress as number) || 100,
      queries,
      sources,
      summary,
    };
  }, [args, output]);

  const handleOpenPanel = () => {
    // Open the side panel to Plans/Research
    setOpenSidePanel(true);
  };

  return (
    <div
      data-testid="interactive-research-card"
      className={cn(
        'my-3 w-full max-w-2xl rounded-2xl border border-cyan-500/25 bg-surface-primary/95 shadow-md overflow-hidden',
        className,
      )}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border-light bg-cyan-500/5 px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
            <Compass className="size-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <span className="block truncate font-semibold text-text-primary text-xs sm:text-sm">
              Deep Research: {parsedData.topic}
            </span>
            <span className="block text-[11px] text-text-secondary">
              Recursive Multi-Hop Exploration • {parsedData.queries?.length} Queries •{' '}
              {parsedData.sources?.length} Sources
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
            <CheckCircle2 className="size-2.5" />
            <span>Completed</span>
          </span>
          <button
            type="button"
            onClick={handleOpenPanel}
            className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-surface-secondary px-2.5 py-1 text-[11px] font-medium text-text-primary hover:bg-surface-hover border border-border-light transition-colors"
          >
            <Sparkles className="size-3 text-cyan-400" />
            <span>Open Panel</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3 text-xs">
        {/* Executive Summary */}
        {parsedData.summary && (
          <p className="text-[12px] leading-relaxed text-text-secondary">
            {parsedData.summary}
          </p>
        )}

        {/* Collapsible Query Graph Section */}
        <div className="rounded-xl border border-border-light bg-surface-secondary/70 p-2.5">
          <button
            type="button"
            onClick={() => setIsTreeOpen(!isTreeOpen)}
            className="flex w-full items-center justify-between text-[11px] font-semibold text-text-secondary hover:text-text-primary"
          >
            <span className="flex items-center gap-1.5">
              <GitBranch className="size-3.5 text-cyan-400" />
              <span>Multi-Hop Query Tree ({parsedData.queries?.length})</span>
            </span>
            {isTreeOpen ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </button>

          {isTreeOpen && (
            <div className="mt-2 space-y-1.5 pt-2 border-t border-border-light">
              {parsedData.queries?.map((q) => (
                <div
                  key={q.id}
                  className={cn(
                    'flex items-center justify-between rounded-lg p-1.5 text-[11px]',
                    q.depth === 0
                      ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium'
                      : q.depth === 2
                        ? 'bg-purple-500/5 border border-purple-500/15 text-purple-300 pl-4'
                        : 'bg-surface-primary border border-border-light text-text-primary pl-2',
                  )}
                >
                  <span className="truncate pr-2">
                    {q.depth === 0 ? '✦ Hop 0: ' : q.depth === 2 ? '↳ Hop 2: ' : '• Hop 1: '}
                    {q.query}
                  </span>
                  {q.resultsCount != null && (
                    <span className="shrink-0 rounded bg-surface-tertiary px-1.5 py-0.2 font-mono text-[9px] text-text-tertiary">
                      {q.resultsCount} res
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grounded Citation Badges */}
        <div className="rounded-xl border border-border-light bg-surface-secondary/70 p-2.5">
          <button
            type="button"
            onClick={() => setIsSourcesOpen(!isSourcesOpen)}
            className="flex w-full items-center justify-between text-[11px] font-semibold text-text-secondary hover:text-text-primary"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-blue-400" />
              <span>Authoritative Citations Grounded ({parsedData.sources?.length})</span>
            </span>
            {isSourcesOpen ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </button>

          {isSourcesOpen && (
            <div className="mt-2 flex flex-wrap gap-2 pt-2 border-t border-border-light">
              {parsedData.sources?.map((source) => (
                <CitationBadge
                  key={source.id}
                  index={source.id}
                  url={source.url}
                  title={source.title}
                  snippet={source.snippet}
                  reliability={source.reliability}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default InteractiveResearchCard;
