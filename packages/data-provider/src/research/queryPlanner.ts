import type { ResearchQuery, DeepResearchPlanOptions } from './types';

/**
 * Generates an initial recursive research query plan from a user topic.
 * Modeled after Perplexity Deep Research and OpenAI Deep Research.
 */
export function generateResearchPlan(
  topic: string,
  options: DeepResearchPlanOptions = {},
): ResearchQuery[] {
  const cleanTopic = topic.trim();
  const maxDepth = options.maxDepth ?? 2;
  const focus = options.focus ?? 'technical';

  const queries: ResearchQuery[] = [];

  // Hop 0: Broad discovery query
  const rootId = 'q-root';
  queries.push({
    id: rootId,
    query: `${cleanTopic} overview landscape latest developments`,
    depth: 0,
    category: 'broad',
    status: 'pending',
    rationale: 'Establish broad foundation, identify key entities, authoritative organizations, and timeline.',
    resultsCount: 0,
  });

  // Hop 1: Sub-queries covering core facets based on focus
  let facetThemes: Array<{ theme: string; rationale: string }> = [];

  if (focus === 'market') {
    facetThemes = [
      {
        theme: 'market size growth forecast market share key players',
        rationale: 'Quantify market adoption, CAGR, leading companies, and venture capital flows.',
      },
      {
        theme: 'customer adoption case studies enterprise use cases ROI',
        rationale: 'Analyze real-world business implementations and quantifiable performance metrics.',
      },
      {
        theme: 'regulatory antitrust legal challenges compliance risks',
        rationale: 'Evaluate compliance hurdles, regulatory scrutiny, and policy frameworks.',
      },
      {
        theme: 'pricing models unit economics margin analysis cost drivers',
        rationale: 'Examine business models, infrastructure costs, and monetization strategy.',
      },
    ];
  } else if (focus === 'academic') {
    facetThemes = [
      {
        theme: 'arxiv peer-reviewed benchmark datasets methodology empirical results',
        rationale: 'Gather rigorous academic papers and empirical evaluation benchmarks.',
      },
      {
        theme: 'theoretical limitations complexity mathematical proofs bounds',
        rationale: 'Analyze foundational constraints, computational complexity, and theoretical bounds.',
      },
      {
        theme: 'novel architectures ablation studies algorithmic trade-offs',
        rationale: 'Inspect model design decisions and architectural components.',
      },
      {
        theme: 'reproducibility open source implementations code repositories datasets',
        rationale: 'Verify open weights, public artifact availability, and reproduction results.',
      },
    ];
  } else {
    // Default: 'technical' or 'general'
    facetThemes = [
      {
        theme: 'system architecture technical specifications design patterns',
        rationale: 'Deconstruct underlying technical components, APIs, and protocol specs.',
      },
      {
        theme: 'benchmarks performance latency throughput efficiency comparisons',
        rationale: 'Collect standardized empirical benchmarks and performance head-to-heads.',
      },
      {
        theme: 'production failure modes edge cases security vulnerabilities limitations',
        rationale: 'Investigate known failure states, CVEs, security attack surfaces, and pitfalls.',
      },
      {
        theme: 'future roadmap planned capabilities next generation preview',
        rationale: 'Identify upcoming releases, active RFCs, and emerging research horizons.',
      },
    ];
  }

  // Add memory context to search if provided
  if (options.userMemoryContext && options.userMemoryContext.trim().length > 0) {
    queries.push({
      id: 'q-mem-context',
      query: `${cleanTopic} ${options.userMemoryContext.slice(0, 50)}`,
      depth: 1,
      category: 'subquery',
      status: 'pending',
      rationale: 'Incorporate user profile preferences and specific domain constraints from memory.',
      parentQueryId: rootId,
      resultsCount: 0,
    });
  }

  facetThemes.forEach((item, index) => {
    const subId = `q-facet-${index + 1}`;
    queries.push({
      id: subId,
      query: `${cleanTopic} ${item.theme}`,
      depth: 1,
      category: 'subquery',
      status: 'pending',
      rationale: item.rationale,
      parentQueryId: rootId,
      resultsCount: 0,
    });

    // Hop 2: Deeper verification & counter-arguments if depth >= 2
    if (maxDepth >= 2 && index < 2) {
      queries.push({
        id: `q-verify-${index + 1}`,
        query: `${cleanTopic} criticisms controversies opposing view debunked ${index === 0 ? 'limitations' : 'benchmarks'}`,
        depth: 2,
        category: 'verification',
        status: 'pending',
        rationale: 'Search for contradictory data, criticisms, and independent third-party audits.',
        parentQueryId: subId,
        resultsCount: 0,
      });
    }
  });

  return queries;
}

/**
 * Recursively expands a query node into follow-up gap queries based on
 * discoveries or unanswered questions from previous hops.
 */
export function expandQueryNode(
  parentQuery: ResearchQuery,
  discoveredGaps: string[],
): ResearchQuery[] {
  if (!discoveredGaps || discoveredGaps.length === 0) {
    return [];
  }

  return discoveredGaps.map((gap, index) => ({
    id: `${parentQuery.id}-gap-${index + 1}`,
    query: `${parentQuery.query.split(' ').slice(0, 3).join(' ')} ${gap}`,
    depth: parentQuery.depth + 1,
    category: 'gap',
    status: 'pending',
    rationale: `Follow-up gap query targeting: "${gap}" discovered during hop ${parentQuery.depth}.`,
    parentQueryId: parentQuery.id,
    resultsCount: 0,
  }));
}

/**
 * Builds a query hierarchy mapping parentQueryId -> child ResearchQuery[].
 */
export function buildQueryHierarchy(queries: ResearchQuery[]): Map<string, ResearchQuery[]> {
  const map = new Map<string, ResearchQuery[]>();
  for (const q of queries) {
    const parent = q.parentQueryId || 'root';
    if (!map.has(parent)) {
      map.set(parent, []);
    }
    map.get(parent)!.push(q);
  }
  return map;
}
