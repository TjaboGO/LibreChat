import type {
  ListExternalToolsParams,
  ListExternalToolsResult,
  DescribeExternalToolsParams,
  DescribeExternalToolsResult,
  CallExternalToolParams,
  CallExternalToolResult,
  MentionDetectionResult,
  ConnectorAuthStatus,
  ConnectorDefinition,
  ConnectorToolSchema,
} from './types';
import {
  getAllConnectors,
  getConnector,
  updateConnectorStatus,
  getToolSchema,
} from './connectorRegistry';

/**
 * Discovers available external connectors and their tools on demand.
 * Modeled directly after Perplexity Computer's `list_external_tools`.
 */
export function listExternalTools(params: ListExternalToolsParams = {}): ListExternalToolsResult {
  const all = getAllConnectors();
  const { queries = [], category, status } = params;

  let filtered = all;

  // Filter by status if requested
  if (status && status !== 'ALL') {
    filtered = filtered.filter((c) => c.status === status);
  }

  // Filter by category if requested
  if (category) {
    const cleanCat = category.toLowerCase().trim();
    filtered = filtered.filter((c) => c.category.toLowerCase() === cleanCat);
  }

  // Filter by search queries
  if (queries.length > 0) {
    const cleanQueries = queries.map((q) => q.toLowerCase().trim()).filter(Boolean);

    filtered = filtered.filter((connector) => {
      const matchTarget = [
        connector.id,
        connector.name,
        connector.description,
        connector.category,
        ...connector.tools.map((t) => `${t.name} ${t.description}`),
      ]
        .join(' ')
        .toLowerCase();

      return cleanQueries.some((q) => matchTarget.includes(q));
    });
  }

  const resultConnectors = filtered.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    category: c.category,
    description: c.description,
    tools: c.tools.map((t) => t.name),
    cliHint: c.cliHint,
  }));

  return {
    connectors: resultConnectors,
    totalCount: resultConnectors.length,
  };
}

/**
 * Returns input parameter schemas for specific tool names on demand.
 */
export function describeExternalTools(params: DescribeExternalToolsParams): DescribeExternalToolsResult {
  const { tool_names = [] } = params;
  const tools: ConnectorToolSchema[] = [];

  for (const name of tool_names) {
    const schema = getToolSchema(name);
    if (schema) {
      tools.push(schema);
    }
  }

  return { tools };
}

/**
 * Executes an external tool call via the connector hub.
 */
export async function callExternalTool(params: CallExternalToolParams): Promise<CallExternalToolResult> {
  const { tool_name, source_id, arguments: args } = params;
  const connector = getConnector(source_id);

  if (!connector) {
    return {
      success: false,
      tool_name,
      source_id,
      error: `Connector '${source_id}' is not registered in the connector catalog.`,
    };
  }

  // If connector is disconnected, signal auth requirement
  if (connector.status === 'DISCONNECTED' || connector.status === 'NEEDS_AUTH') {
    return {
      success: false,
      tool_name,
      source_id,
      needsAuth: true,
      authUrl: connector.authUrl || `https://app.librechat.ai/connect/${source_id}`,
      error: `Connector '${connector.name}' is disconnected. Please connect before calling '${tool_name}'.`,
    };
  }

  // Dispatch mock/built-in responses for known tool types
  switch (tool_name) {
    case 'github_search_repos': {
      const query = args.query || 'repos';
      return {
        success: true,
        tool_name,
        source_id,
        data: {
          total_count: 3,
          items: [
            { full_name: `gabrielodenhagen/${query}-core`, stars: 42, language: 'TypeScript' },
            { full_name: `gabrielodenhagen/${query}-agent`, stars: 128, language: 'Python' },
            { full_name: `gabrielodenhagen/${query}-studio`, stars: 15, language: 'React' },
          ],
        },
      };
    }

    case 'slack_post_message': {
      return {
        success: true,
        tool_name,
        source_id,
        data: {
          ok: true,
          channel: args.channel,
          ts: `${Date.now() / 1000}`,
          message: { text: args.text },
        },
      };
    }

    case 'notion_search_pages': {
      return {
        success: true,
        tool_name,
        source_id,
        data: {
          results: [
            { id: 'page-1', title: 'Q1 2026 Strategic Roadmap', last_edited: '2026-02-15' },
            { id: 'page-2', title: 'Agentic Architecture Invariants', last_edited: '2026-02-14' },
          ],
        },
      };
    }

    case 'stripe_get_balance': {
      return {
        success: true,
        tool_name,
        source_id,
        data: {
          available: [{ amount: 1485000, currency: args.currency || 'usd' }],
          pending: [{ amount: 235000, currency: args.currency || 'usd' }],
          instant_available: [{ amount: 500000, currency: args.currency || 'usd' }],
        },
      };
    }

    case 'postgres_run_query': {
      return {
        success: true,
        tool_name,
        source_id,
        data: {
          command: 'SELECT',
          rowCount: 2,
          rows: [
            { id: 1, name: 'Gabriel Odenhagen', tier: 'Pro Agent Developer' },
            { id: 2, name: 'Orca Antigravity', tier: 'Autonomous Agent' },
          ],
        },
      };
    }

    case 'fs_read_file': {
      return {
        success: true,
        tool_name,
        source_id,
        data: {
          path: args.path,
          content: `// Content of ${args.path}\n// Read via Filesystem MCP`,
        },
      };
    }

    default: {
      return {
        success: true,
        tool_name,
        source_id,
        data: {
          message: `Executed external tool '${tool_name}' successfully on '${connector.name}'.`,
          arguments: args,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}

/**
 * Initiates connection to an external tool connector.
 */
export function connectExternalTool(
  sourceId: string,
  credentials?: Record<string, any>,
): { success: boolean; status: ConnectorAuthStatus; authUrl?: string; message: string } {
  const connector = getConnector(sourceId);
  if (!connector) {
    return {
      success: false,
      status: 'DISCONNECTED',
      message: `Connector '${sourceId}' not found.`,
    };
  }

  // Update in-memory status
  updateConnectorStatus(sourceId, 'CONNECTED');

  return {
    success: true,
    status: 'CONNECTED',
    authUrl: connector.authUrl,
    message: `Connected ${connector.name} successfully.`,
  };
}

/**
 * Disconnects an external tool connector.
 */
export function disconnectExternalTool(
  sourceId: string,
): { success: boolean; status: ConnectorAuthStatus; message: string } {
  const connector = getConnector(sourceId);
  if (!connector) {
    return {
      success: false,
      status: 'DISCONNECTED',
      message: `Connector '${sourceId}' not found.`,
    };
  }

  updateConnectorStatus(sourceId, 'DISCONNECTED');

  return {
    success: true,
    status: 'DISCONNECTED',
    message: `Disconnected ${connector.name}.`,
  };
}

/**
 * Detects `@<service>` mentions in prompt text (e.g. `@GitHub`, `@Notion`, `@Slack`, `@Stripe`).
 */
export function detectConnectorMention(input: string): MentionDetectionResult {
  const regex = /@([a-zA-Z0-9_-]+)/g;
  const matches = Array.from(input.matchAll(regex));

  if (matches.length === 0) {
    return {
      hasMention: false,
      mentionedConnectors: [],
      cleanText: input,
    };
  }

  const allConnectors = getAllConnectors();
  const mentioned: string[] = [];

  for (const match of matches) {
    const rawTag = match[1].toLowerCase();
    const matchedConn = allConnectors.find(
      (c) => c.id.toLowerCase() === rawTag || c.name.toLowerCase() === rawTag,
    );
    if (matchedConn && !mentioned.includes(matchedConn.id)) {
      mentioned.push(matchedConn.id);
    }
  }

  return {
    hasMention: mentioned.length > 0,
    mentionedConnectors: mentioned,
    cleanText: input,
  };
}

/**
 * Core Perplexity Computer Connector Hub tool schemas
 */
export const PERPLEXITY_CONNECTOR_TOOLS = {
  list_external_tools: {
    name: 'list_external_tools',
    description:
      'Search and discover available external connectors (Slack, GitHub, Notion, Jira, Stripe, PostgreSQL, Figma, Google Drive) and their available tool names. ALWAYS call this before stating you cannot access external data.',
    parameters: {
      type: 'object',
      properties: {
        queries: {
          type: 'array',
          items: { type: 'string' },
          description: 'Search keywords or service names, e.g. ["github", "pull request"] or ["slack"]',
        },
        category: {
          type: 'string',
          description: 'Optional category filter: developer, productivity, communication, finance, data, design, storage',
        },
        status: {
          type: 'string',
          enum: ['CONNECTED', 'DISCONNECTED', 'ALL'],
          description: 'Filter by connection status (default: ALL)',
        },
      },
    },
  },
  describe_external_tools: {
    name: 'describe_external_tools',
    description:
      'Fetch complete parameter schemas and input specifications for designated external tools before calling them.',
    parameters: {
      type: 'object',
      properties: {
        tool_names: {
          type: 'array',
          items: { type: 'string' },
          description: 'Names of tools to retrieve schemas for',
        },
      },
      required: ['tool_names'],
    },
  },
  call_external_tool: {
    name: 'call_external_tool',
    description:
      'Execute an external tool action against a connected service. Requires tool_name, source_id, and arguments matching the tool schema.',
    parameters: {
      type: 'object',
      properties: {
        tool_name: { type: 'string', description: 'Name of the tool to execute' },
        source_id: { type: 'string', description: 'Connector source identifier (e.g. "github", "slack", "notion")' },
        arguments: { type: 'object', description: 'Input arguments matching the tool parameters schema' },
      },
      required: ['tool_name', 'source_id', 'arguments'],
    },
  },
};
