import {
  extractCitationsFromText,
  injectCitationLinks,
  synthesizeDeepResearch,
} from '../synthesizer';
import type { ResearchQuery, ResearchSource } from '../types';

describe('synthesizer', () => {
  it('extracts unique citation numbers from text', () => {
    const text = 'Findings show massive improvements [1] and lower latencies [^2], confirmed by [1] and [3].';
    const citations = extractCitationsFromText(text);

    expect(citations).toEqual([1, 2, 3]);
  });

  it('injects markdown link targets for citations', () => {
    const sources: ResearchSource[] = [
      {
        id: 1,
        url: 'https://arxiv.org/abs/2401.001',
        domain: 'arxiv.org',
        title: 'Frontier AI Research',
        snippet: 'Abstract snippet',
        reliability: 'academic',
        relevanceScore: 0.95,
      },
      {
        id: 2,
        url: 'https://docs.anthropic.com/claude',
        domain: 'docs.anthropic.com',
        title: 'Claude System Architecture',
        snippet: 'Architecture overview',
        reliability: 'primary',
        relevanceScore: 0.99,
      },
    ];

    const input = 'Models demonstrate strong reasoning [1] and robust tool use [2].';
    const output = injectCitationLinks(input, sources);

    expect(output).toContain('[1](https://arxiv.org/abs/2401.001 "Frontier AI Research")');
    expect(output).toContain('[2](https://docs.anthropic.com/claude "Claude System Architecture")');
  });

  it('synthesizes a complete deep research report with matrix, timeline, and bibliography', () => {
    const queries: ResearchQuery[] = [
      {
        id: 'q-root',
        query: 'AI Agents 2026',
        depth: 0,
        category: 'broad',
        status: 'completed',
        rationale: 'Overview',
        resultsCount: 10,
      },
    ];

    const sources: ResearchSource[] = [
      {
        id: 1,
        url: 'https://arxiv.org/abs/2401.001',
        domain: 'arxiv.org',
        title: 'Autonomous System Paper',
        snippet: 'Architecture benchmark results',
        reliability: 'academic',
        relevanceScore: 0.96,
      },
      {
        id: 2,
        url: 'https://bloomberg.com/news/123',
        domain: 'bloomberg.com',
        title: 'Industry Adoption 2026',
        snippet: 'Commercial adoption metrics benchmark',
        reliability: 'news',
        relevanceScore: 0.88,
      },
    ];

    const report = synthesizeDeepResearch('AI Agents 2026', queries, sources);

    expect(report.topic).toBe('AI Agents 2026');
    expect(report.executiveSummary).toContain('Comprehensive multi-hop deep research');
    expect(report.keyFindings.length).toBeGreaterThanOrEqual(3);
    expect(report.comparativeMatrix?.headers).toBeDefined();
    expect(report.timeline?.length).toBeGreaterThan(0);
    expect(report.markdownReport).toContain('# Deep Research Report: AI Agents 2026');
    expect(report.markdownReport).toContain('## Comparative Matrix');
    expect(report.markdownReport).toContain('## Chronological Milestones');
    expect(report.markdownReport).toContain('## Sources & References');
  });
});
