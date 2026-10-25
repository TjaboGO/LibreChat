import {
  getAllConnectors,
  getConnector,
  updateConnectorStatus,
  resetConnectorsToDefault,
  listExternalTools,
  describeExternalTools,
  callExternalTool,
  connectExternalTool,
  disconnectExternalTool,
  detectConnectorMention,
  PERPLEXITY_CONNECTOR_TOOLS,
} from '../index';

describe('Perplexity Computer Connector Hub', () => {
  beforeEach(() => {
    resetConnectorsToDefault();
  });

  it('exposes core Perplexity Computer tool definitions', () => {
    expect(PERPLEXITY_CONNECTOR_TOOLS.list_external_tools).toBeDefined();
    expect(PERPLEXITY_CONNECTOR_TOOLS.describe_external_tools).toBeDefined();
    expect(PERPLEXITY_CONNECTOR_TOOLS.call_external_tool).toBeDefined();

    expect(PERPLEXITY_CONNECTOR_TOOLS.list_external_tools.name).toBe('list_external_tools');
    expect(PERPLEXITY_CONNECTOR_TOOLS.describe_external_tools.name).toBe('describe_external_tools');
    expect(PERPLEXITY_CONNECTOR_TOOLS.call_external_tool.name).toBe('call_external_tool');
  });

  describe('listExternalTools', () => {
    it('returns all connectors when called without parameters', () => {
      const res = listExternalTools();
      expect(res.totalCount).toBeGreaterThanOrEqual(10);
      expect(res.connectors.some((c) => c.id === 'github')).toBe(true);
      expect(res.connectors.some((c) => c.id === 'slack')).toBe(true);
      expect(res.connectors.some((c) => c.id === 'notion')).toBe(true);
    });

    it('filters connectors by keyword queries', () => {
      const res = listExternalTools({ queries: ['github', 'repository'] });
      expect(res.totalCount).toBeGreaterThan(0);
      expect(res.connectors.every((c) => c.id === 'github' || c.description.toLowerCase().includes('github') || c.tools.some(t => t.includes('github')))).toBe(true);
    });

    it('filters connectors by category', () => {
      const financeRes = listExternalTools({ category: 'finance' });
      expect(financeRes.totalCount).toBeGreaterThan(0);
      expect(financeRes.connectors.some((c) => c.id === 'stripe')).toBe(true);

      const devRes = listExternalTools({ category: 'developer' });
      expect(devRes.connectors.some((c) => c.id === 'github')).toBe(true);
    });

    it('filters connectors by status', () => {
      const connectedRes = listExternalTools({ status: 'CONNECTED' });
      expect(connectedRes.connectors.every((c) => c.status === 'CONNECTED')).toBe(true);
    });
  });

  describe('describeExternalTools', () => {
    it('returns full JSON parameter schema for specified tool names', () => {
      const res = describeExternalTools({
        tool_names: ['github_search_repos', 'slack_post_message'],
      });

      expect(res.tools.length).toBe(2);
      expect(res.tools[0].name).toBe('github_search_repos');
      expect(res.tools[0].sourceId).toBe('github');
      expect(res.tools[0].parameters.required).toContain('query');

      expect(res.tools[1].name).toBe('slack_post_message');
      expect(res.tools[1].sourceId).toBe('slack');
      expect(res.tools[1].parameters.required).toContain('channel');
    });
  });

  describe('callExternalTool', () => {
    it('executes tool when connector is CONNECTED', async () => {
      const res = await callExternalTool({
        tool_name: 'github_search_repos',
        source_id: 'github',
        arguments: { query: 'librechat' },
      });

      expect(res.success).toBe(true);
      expect(res.source_id).toBe('github');
      expect(res.data).toBeDefined();
      expect(res.data.items).toBeDefined();
    });

    it('requires authentication when connector is DISCONNECTED', async () => {
      // Ensure Jira is disconnected
      updateConnectorStatus('jira', 'DISCONNECTED');

      const res = await callExternalTool({
        tool_name: 'jira_search_issues',
        source_id: 'jira',
        arguments: { jql: 'project = ENG' },
      });

      expect(res.success).toBe(false);
      expect(res.needsAuth).toBe(true);
      expect(res.authUrl).toBeDefined();
      expect(res.error).toContain('disconnected');
    });
  });

  describe('connectExternalTool & disconnectExternalTool', () => {
    it('connects a disconnected tool and updates state', () => {
      updateConnectorStatus('jira', 'DISCONNECTED');
      const connBefore = getConnector('jira');
      expect(connBefore?.status).toBe('DISCONNECTED');

      const connectRes = connectExternalTool('jira');
      expect(connectRes.success).toBe(true);
      expect(connectRes.status).toBe('CONNECTED');

      const connAfter = getConnector('jira');
      expect(connAfter?.status).toBe('CONNECTED');
    });

    it('disconnects an active connector', () => {
      const disconnectRes = disconnectExternalTool('github');
      expect(disconnectRes.success).toBe(true);
      expect(disconnectRes.status).toBe('DISCONNECTED');

      const conn = getConnector('github');
      expect(conn?.status).toBe('DISCONNECTED');
    });
  });

  describe('detectConnectorMention', () => {
    it('detects single @mention in prompt text', () => {
      const res = detectConnectorMention('Can you check my recent PRs on @GitHub?');
      expect(res.hasMention).toBe(true);
      expect(res.mentionedConnectors).toContain('github');
    });

    it('detects multiple @mentions in prompt text', () => {
      const res = detectConnectorMention('Sync @Stripe MRR into @Notion database');
      expect(res.hasMention).toBe(true);
      expect(res.mentionedConnectors).toContain('stripe');
      expect(res.mentionedConnectors).toContain('notion');
    });

    it('returns false when no connectors are mentioned', () => {
      const res = detectConnectorMention('Explain how transformer attention heads work');
      expect(res.hasMention).toBe(false);
      expect(res.mentionedConnectors).toHaveLength(0);
    });
  });
});
