import type { FunctionTool } from '../types';

export const DEEP_RESEARCH_TOOL_NAMES = [
  'deep_research',
  'research_plan_queries',
  'research_expand_query',
  'research_synthesize',
  'deep_search',
] as const;

export function isDeepResearchTool(name?: string | null): boolean {
  if (!name) {
    return false;
  }
  const clean = name.trim().toLowerCase();
  return (
    clean === 'deep_research' ||
    clean === 'research_plan_queries' ||
    clean === 'research_expand_query' ||
    clean === 'research_synthesize' ||
    clean === 'deep_search'
  );
}

/**
 * Standard function declarations for Deep Research tools
 * compatible with OpenAI, Anthropic, Gemini and OpenRouter.
 */
export const deepResearchTools: Record<string, FunctionTool> = {
  deep_research: {
    type: 'function',
    function: {
      name: 'deep_research',
      description:
        'Executes autonomous recursive multi-hop web research, builds an inspectable query graph, collects and tiers authoritative sources (academic, primary, official, news), and synthesizes a citation-grounded report with sentence-level [1] badges.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'The core research question, technology, or topic to investigate deeply.',
          },
          focus: {
            type: 'string',
            enum: ['technical', 'market', 'academic', 'general'],
            description: 'The analytical lens for query expansion and source prioritization.',
          },
          maxDepth: {
            type: 'number',
            description: 'Maximum recursive hop depth (0: broad root only, 1: facets, 2: gap & verification). Default 2.',
          },
          userMemoryContext: {
            type: 'string',
            description: 'Optional constraints or preferences from user memory to ground the research.',
          },
        },
        required: ['topic'],
      },
    },
  },
  research_plan_queries: {
    type: 'function',
    function: {
      name: 'research_plan_queries',
      description:
        'Generates an initial recursive multi-hop query tree with broad discovery, facet subqueries, and verification queries.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'Research topic to decompose into a multi-hop query tree.',
          },
          focus: {
            type: 'string',
            enum: ['technical', 'market', 'academic', 'general'],
          },
          maxDepth: {
            type: 'number',
          },
        },
        required: ['topic'],
      },
    },
  },
  research_expand_query: {
    type: 'function',
    function: {
      name: 'research_expand_query',
      description:
        'Recursively expands an existing query node with follow-up gap queries targeting contradictions, missing metrics, or opposing claims.',
      parameters: {
        type: 'object',
        properties: {
          parentQueryId: {
            type: 'string',
            description: 'ID of the parent query node (e.g. q-facet-1).',
          },
          gaps: {
            type: 'array',
            items: { type: 'string' },
            description: 'Specific knowledge gaps, contradictory findings, or counter-hypotheses to explore.',
          },
        },
        required: ['parentQueryId', 'gaps'],
      },
    },
  },
  research_synthesize: {
    type: 'function',
    function: {
      name: 'research_synthesize',
      description:
        'Synthesizes accumulated findings into a Frontier Deep Research report with comparative matrix, chronological timeline, and sentence-level citation anchors.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'Research topic.',
          },
          findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                section: { type: 'string' },
                content: { type: 'string' },
                citationIds: { type: 'array', items: { type: 'number' } },
              },
            },
          },
        },
        required: ['topic'],
      },
    },
  },
};
