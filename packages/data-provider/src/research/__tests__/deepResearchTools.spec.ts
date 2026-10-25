import {
  isDeepResearchTool,
  deepResearchTools,
  DEEP_RESEARCH_TOOL_NAMES,
} from '../deepResearchTools';

describe('deepResearchTools', () => {
  it('correctly identifies deep research tool names', () => {
    expect(isDeepResearchTool('deep_research')).toBe(true);
    expect(isDeepResearchTool('DEEP_RESEARCH')).toBe(true);
    expect(isDeepResearchTool('research_plan_queries')).toBe(true);
    expect(isDeepResearchTool('research_expand_query')).toBe(true);
    expect(isDeepResearchTool('research_synthesize')).toBe(true);
    expect(isDeepResearchTool('deep_search')).toBe(true);

    expect(isDeepResearchTool('web_search')).toBe(false);
    expect(isDeepResearchTool('file_search')).toBe(false);
    expect(isDeepResearchTool(null)).toBe(false);
  });

  it('provides complete OpenAI/Anthropic tool definitions', () => {
    const dr = deepResearchTools.deep_research;
    expect(dr.type).toBe('function');
    expect(dr.function.name).toBe('deep_research');
    expect(dr.function.parameters.required).toContain('topic');

    const expand = deepResearchTools.research_expand_query;
    expect(expand.function.parameters.required).toContain('parentQueryId');
    expect(expand.function.parameters.required).toContain('gaps');
  });
});
