import {
  generateResearchPlan,
  expandQueryNode,
  buildQueryHierarchy,
} from '../queryPlanner';
import type { ResearchQuery } from '../types';

describe('queryPlanner', () => {
  it('generates a multi-hop research plan for technical topic', () => {
    const queries = generateResearchPlan('Autonomous AI Agents 2026', {
      maxDepth: 2,
      focus: 'technical',
    });

    expect(queries.length).toBeGreaterThanOrEqual(5);

    // Root query (depth 0)
    const root = queries.find((q) => q.depth === 0);
    expect(root).toBeDefined();
    expect(root?.category).toBe('broad');
    expect(root?.query).toContain('Autonomous AI Agents 2026');

    // Sub-queries (depth 1)
    const subqueries = queries.filter((q) => q.depth === 1);
    expect(subqueries.length).toBeGreaterThanOrEqual(4);
    expect(subqueries[0].parentQueryId).toBe('q-root');

    // Verification queries (depth 2)
    const verifications = queries.filter((q) => q.depth === 2);
    expect(verifications.length).toBeGreaterThanOrEqual(2);
    expect(verifications[0].category).toBe('verification');
  });

  it('generates academic-focused research plan when focus is academic', () => {
    const queries = generateResearchPlan('Transformer Attention Bottlenecks', {
      focus: 'academic',
    });

    const sub = queries.find((q) => q.query.includes('arxiv'));
    expect(sub).toBeDefined();
    expect(sub?.rationale).toContain('academic');
  });

  it('incorporates userMemoryContext if provided', () => {
    const queries = generateResearchPlan('Vector Databases', {
      userMemoryContext: 'Focus on HNSW vs ScaNN with Rust implementations',
    });

    const memQuery = queries.find((q) => q.id === 'q-mem-context');
    expect(memQuery).toBeDefined();
    expect(memQuery?.query).toContain('HNSW');
  });

  it('expands query nodes recursively with gap queries', () => {
    const parent: ResearchQuery = {
      id: 'q-facet-1',
      query: 'AI agents latency benchmarks',
      depth: 1,
      category: 'subquery',
      status: 'completed',
      rationale: 'Benchmark latency',
      resultsCount: 5,
    };

    const gaps = ['TTFT degradation in long turns', 'Speculative decoding impact'];
    const expanded = expandQueryNode(parent, gaps);

    expect(expanded.length).toBe(2);
    expect(expanded[0].id).toBe('q-facet-1-gap-1');
    expect(expanded[0].depth).toBe(2);
    expect(expanded[0].category).toBe('gap');
    expect(expanded[0].query).toContain('TTFT');
  });

  it('builds query hierarchy correctly', () => {
    const queries = generateResearchPlan('Robotics Foundation Models');
    const hierarchy = buildQueryHierarchy(queries);

    expect(hierarchy.has('root')).toBe(true);
    expect(hierarchy.get('root')?.length).toBe(1); // root query has no parent
    expect(hierarchy.has('q-root')).toBe(true);
    expect(hierarchy.get('q-root')?.length).toBeGreaterThanOrEqual(4);
  });
});
