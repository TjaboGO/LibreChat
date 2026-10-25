import type {
  ConnectorDefinition,
  ConnectorToolSchema,
  ConnectorCategory,
  ConnectorAuthStatus,
} from './types';

export const INITIAL_CONNECTORS: ConnectorDefinition[] = [
  {
    id: 'github',
    name: 'GitHub',
    category: 'developer',
    description: 'Repositories, pull requests, issues, branch commits, and release tags.',
    status: 'CONNECTED',
    authType: 'oauth2',
    icon: 'Github',
    cliHint: 'gh repo list --limit 10',
    authUrl: 'https://github.com/login/oauth/authorize',
    docsUrl: 'https://docs.github.com/en/rest',
    version: '1.4.0',
    tools: [
      {
        name: 'github_search_repos',
        description: 'Search public and private GitHub repositories by keywords or qualifiers.',
        parametersSummary: 'query: string, sort?: string, limit?: number',
      },
      {
        name: 'github_create_pull_request',
        description: 'Create a new pull request across repository branches.',
        parametersSummary: 'repo: string, title: string, head: string, base: string, body?: string',
      },
      {
        name: 'github_list_issues',
        description: 'List and filter issues for a specific repository.',
        parametersSummary: 'repo: string, state?: "open" | "closed" | "all", limit?: number',
      },
      {
        name: 'github_get_file_contents',
        description: 'Fetch raw file contents from a repository at a given ref or branch.',
        parametersSummary: 'repo: string, path: string, ref?: string',
      },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    description: 'Workspace channels, direct messages, thread replies, and reminders.',
    status: 'CONNECTED',
    authType: 'oauth2',
    icon: 'MessageSquare',
    cliHint: 'slack-cli chat post --channel general',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    docsUrl: 'https://api.slack.com/methods',
    version: '2.1.0',
    tools: [
      {
        name: 'slack_post_message',
        description: 'Send a formatted rich message to a channel or DM.',
        parametersSummary: 'channel: string, text: string, thread_ts?: string',
      },
      {
        name: 'slack_read_channel_history',
        description: 'Read the recent message history from a public or private channel.',
        parametersSummary: 'channel: string, limit?: number',
      },
      {
        name: 'slack_search_messages',
        description: 'Search messages across workspace channels by keyword or user.',
        parametersSummary: 'query: string, count?: number',
      },
    ],
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    description: 'Workspaces, databases, project roadmaps, documents, and nested pages.',
    status: 'CONNECTED',
    authType: 'oauth2',
    icon: 'FileText',
    cliHint: 'notion-cli search --query "Q1 Roadmap"',
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    docsUrl: 'https://developers.notion.com/reference',
    version: '1.8.0',
    tools: [
      {
        name: 'notion_search_pages',
        description: 'Search Notion pages and databases by title or query string.',
        parametersSummary: 'query: string, filter_type?: "page" | "database"',
      },
      {
        name: 'notion_get_page_content',
        description: 'Retrieve blocks and full markdown content of a Notion page.',
        parametersSummary: 'page_id: string',
      },
      {
        name: 'notion_query_database',
        description: 'Query structured items from a Notion database with filters.',
        parametersSummary: 'database_id: string, filter?: Record<string, any>',
      },
      {
        name: 'notion_append_block',
        description: 'Append content blocks or paragraphs to an existing page.',
        parametersSummary: 'page_id: string, text: string',
      },
    ],
  },
  {
    id: 'jira',
    name: 'Jira Cloud',
    category: 'productivity',
    description: 'Atlassian Jira sprints, epics, bug tickets, and workflow transitions.',
    status: 'DISCONNECTED',
    authType: 'oauth2',
    icon: 'CheckSquare',
    cliHint: 'jira issue list -q "project = ENG AND status = Open"',
    authUrl: 'https://auth.atlassian.com/authorize',
    docsUrl: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/',
    version: '2.0.0',
    tools: [
      {
        name: 'jira_search_issues',
        description: 'Search Jira issues using JQL syntax.',
        parametersSummary: 'jql: string, maxResults?: number',
      },
      {
        name: 'jira_create_issue',
        description: 'Create a new ticket or task in a project.',
        parametersSummary: 'projectKey: string, summary: string, description: string, issueType?: string',
      },
      {
        name: 'jira_update_issue_status',
        description: 'Transition an issue to a new status (e.g. In Progress, Done).',
        parametersSummary: 'issueIdOrKey: string, transitionName: string',
      },
    ],
  },
  {
    id: 'linear',
    name: 'Linear',
    category: 'developer',
    description: 'Linear issue tracking, cycles, initiatives, and roadmap milestones.',
    status: 'DISCONNECTED',
    authType: 'api_key',
    icon: 'Radio',
    cliHint: 'linear issue list --team ENG',
    authUrl: 'https://linear.app/oauth/authorize',
    docsUrl: 'https://developers.linear.app',
    version: '1.2.0',
    tools: [
      {
        name: 'linear_search_issues',
        description: 'Search Linear issues across teams with filters.',
        parametersSummary: 'query: string, teamId?: string, state?: string',
      },
      {
        name: 'linear_create_issue',
        description: 'Create a Linear task or feature ticket.',
        parametersSummary: 'teamId: string, title: string, description?: string, priority?: number',
      },
      {
        name: 'linear_list_projects',
        description: 'List active and planned Linear projects.',
        parametersSummary: 'teamId?: string',
      },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'finance',
    description: 'Payments, subscriptions, MRR analytics, invoices, and customer accounts.',
    status: 'DISCONNECTED',
    authType: 'api_key',
    icon: 'CreditCard',
    cliHint: 'stripe balance retrieve',
    authUrl: 'https://dashboard.stripe.com/apikeys',
    docsUrl: 'https://stripe.com/docs/api',
    version: '3.0.0',
    tools: [
      {
        name: 'stripe_get_balance',
        description: 'Retrieve current available and pending account balances.',
        parametersSummary: 'currency?: string',
      },
      {
        name: 'stripe_search_customers',
        description: 'Search customers by email, name, or metadata.',
        parametersSummary: 'query: string, limit?: number',
      },
      {
        name: 'stripe_list_subscriptions',
        description: 'List active and past-due recurring customer subscriptions.',
        parametersSummary: 'status?: "active" | "past_due" | "canceled", limit?: number',
      },
      {
        name: 'stripe_create_payment_link',
        description: 'Create a hosted payment link for a line item or price.',
        parametersSummary: 'priceId: string, quantity?: number',
      },
    ],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Database',
    category: 'data',
    description: 'Direct SQL execution, schema inspection, and relational database queries.',
    status: 'CONNECTED',
    authType: 'native',
    icon: 'Database',
    cliHint: 'psql $DATABASE_URL -c "SELECT count(*) FROM users;"',
    docsUrl: 'https://www.postgresql.org/docs/',
    version: '16.0',
    tools: [
      {
        name: 'postgres_run_query',
        description: 'Execute read-only or transactional SQL queries against database.',
        parametersSummary: 'sql: string, params?: any[]',
      },
      {
        name: 'postgres_list_tables',
        description: 'List all public and system tables with row count estimates.',
        parametersSummary: 'schema?: string',
      },
      {
        name: 'postgres_describe_schema',
        description: 'Inspect columns, primary keys, and foreign relations of a table.',
        parametersSummary: 'tableName: string',
      },
    ],
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'design',
    description: 'Design files, frames, vector components, design tokens, and CSS properties.',
    status: 'DISCONNECTED',
    authType: 'oauth2',
    icon: 'Figma',
    cliHint: 'figma export --file-key ABC123XYZ',
    authUrl: 'https://www.figma.com/oauth',
    docsUrl: 'https://www.figma.com/developers/api',
    version: '1.0.0',
    tools: [
      {
        name: 'figma_get_file_components',
        description: 'Fetch component hierarchy and layout structures for a Figma file.',
        parametersSummary: 'fileKey: string, nodeIds?: string[]',
      },
      {
        name: 'figma_export_frames',
        description: 'Export specific canvas frames as SVG, PNG, or PDF images.',
        parametersSummary: 'fileKey: string, frameIds: string[], format?: "svg" | "png"',
      },
      {
        name: 'figma_inspect_layer_css',
        description: 'Extract computed CSS styles, flex layouts, and color tokens from a node.',
        parametersSummary: 'fileKey: string, nodeId: string',
      },
    ],
  },
  {
    id: 'google_drive',
    name: 'Google Drive & Docs',
    category: 'storage',
    description: 'Cloud files, Google Docs, Sheets, Slides, and folder permissions.',
    status: 'DISCONNECTED',
    authType: 'oauth2',
    icon: 'HardDrive',
    cliHint: 'gdrive list --query "mimeType = \'application/pdf\'"',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    docsUrl: 'https://developers.google.com/drive/api',
    version: '3.0.0',
    tools: [
      {
        name: 'google_drive_search_files',
        description: 'Search user Drive files by name, type, or full-text query.',
        parametersSummary: 'query: string, mimeType?: string, limit?: number',
      },
      {
        name: 'google_drive_read_doc',
        description: 'Fetch and convert Google Doc text content to Markdown.',
        parametersSummary: 'fileId: string',
      },
      {
        name: 'google_drive_export_pdf',
        description: 'Export Docs or Slides as downloadable PDF binary buffer.',
        parametersSummary: 'fileId: string',
      },
    ],
  },
  {
    id: 'tavily',
    name: 'Tavily Search Engine',
    category: 'data',
    description: 'High-authority web search, real-time knowledge retrieval, and fact extraction.',
    status: 'CONNECTED',
    authType: 'api_key',
    icon: 'Search',
    cliHint: 'tavily-search "Latest AI benchmarks 2026"',
    docsUrl: 'https://docs.tavily.com',
    version: '1.1.0',
    tools: [
      {
        name: 'tavily_web_search',
        description: 'Search live web sources with synthesized text snippets and verified citations.',
        parametersSummary: 'query: string, search_depth?: "basic" | "advanced", max_results?: number',
      },
      {
        name: 'tavily_deep_extract',
        description: 'Extract raw cleaned markdown content and tables from a web URL.',
        parametersSummary: 'urls: string[]',
      },
    ],
  },
  {
    id: 'filesystem',
    name: 'Filesystem MCP',
    category: 'storage',
    description: 'Local workspace file manipulation, directory reading, and code search.',
    status: 'CONNECTED',
    authType: 'native',
    icon: 'Folder',
    cliHint: 'ls -la packages/client',
    docsUrl: 'https://modelcontextprotocol.io',
    version: '1.0.0',
    tools: [
      {
        name: 'fs_read_file',
        description: 'Read complete content of a workspace file.',
        parametersSummary: 'path: string',
      },
      {
        name: 'fs_write_file',
        description: 'Write or update a file in the workspace directory.',
        parametersSummary: 'path: string, content: string',
      },
      {
        name: 'fs_list_directory',
        description: 'List contents of a directory with file sizes and timestamps.',
        parametersSummary: 'path: string, recursive?: boolean',
      },
    ],
  },
  {
    id: 'spotify',
    name: 'Spotify Player',
    category: 'communication',
    description: 'Music playback controls, playlists, artist discovery, and podcast tracking.',
    status: 'DISCONNECTED',
    authType: 'oauth2',
    icon: 'Music',
    cliHint: 'spotify-api status',
    authUrl: 'https://accounts.spotify.com/authorize',
    docsUrl: 'https://developer.spotify.com/documentation/web-api',
    version: '1.0.0',
    tools: [
      {
        name: 'spotify_search_tracks',
        description: 'Search tracks, albums, or playlists on Spotify.',
        parametersSummary: 'query: string, type?: "track" | "album" | "playlist"',
      },
      {
        name: 'spotify_get_current_playback',
        description: 'Get details of currently playing track, artist, and progress.',
        parametersSummary: '',
      },
      {
        name: 'spotify_start_playback',
        description: 'Start playback of a URI or resume playback on active device.',
        parametersSummary: 'contextUri?: string, trackUri?: string',
      },
    ],
  },
];

export const TOOL_SCHEMAS: Record<string, ConnectorToolSchema> = {
  github_search_repos: {
    name: 'github_search_repos',
    sourceId: 'github',
    description: 'Search public and private GitHub repositories by keywords or qualifiers.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keywords, e.g. "agentic deep learning"' },
        sort: { type: 'string', enum: ['stars', 'forks', 'updated'], description: 'Sort field' },
        limit: { type: 'number', description: 'Max results (default 10)' },
      },
      required: ['query'],
    },
  },
  github_create_pull_request: {
    name: 'github_create_pull_request',
    sourceId: 'github',
    description: 'Create a new pull request across repository branches.',
    parameters: {
      type: 'object',
      properties: {
        repo: { type: 'string', description: 'Repo in owner/repo format' },
        title: { type: 'string', description: 'PR Title' },
        head: { type: 'string', description: 'Branch containing your changes' },
        base: { type: 'string', description: 'Target branch to merge into (e.g. main)' },
        body: { type: 'string', description: 'PR description in markdown' },
      },
      required: ['repo', 'title', 'head', 'base'],
    },
  },
  slack_post_message: {
    name: 'slack_post_message',
    sourceId: 'slack',
    description: 'Send a formatted rich message to a channel or DM.',
    parameters: {
      type: 'object',
      properties: {
        channel: { type: 'string', description: 'Channel name (e.g. #general) or channel ID' },
        text: { type: 'string', description: 'Message text or markdown payload' },
        thread_ts: { type: 'string', description: 'Parent message timestamp for thread reply' },
      },
      required: ['channel', 'text'],
    },
  },
  notion_search_pages: {
    name: 'notion_search_pages',
    sourceId: 'notion',
    description: 'Search Notion pages and databases by title or query string.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term for page titles' },
        filter_type: { type: 'string', enum: ['page', 'database'], description: 'Filter by entity type' },
      },
      required: ['query'],
    },
  },
  jira_search_issues: {
    name: 'jira_search_issues',
    sourceId: 'jira',
    description: 'Search Jira issues using JQL syntax.',
    parameters: {
      type: 'object',
      properties: {
        jql: { type: 'string', description: 'Jira Query Language string, e.g. "assignee = currentUser()"' },
        maxResults: { type: 'number', description: 'Maximum issues to return' },
      },
      required: ['jql'],
    },
  },
  stripe_get_balance: {
    name: 'stripe_get_balance',
    sourceId: 'stripe',
    description: 'Retrieve current available and pending account balances.',
    parameters: {
      type: 'object',
      properties: {
        currency: { type: 'string', description: '3-letter ISO currency code (e.g. usd, eur)' },
      },
    },
  },
  postgres_run_query: {
    name: 'postgres_run_query',
    sourceId: 'postgres',
    description: 'Execute read-only or transactional SQL queries against database.',
    parameters: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: 'SQL query text to execute' },
        params: { type: 'array', items: { type: 'string' }, description: 'Query parameters' },
      },
      required: ['sql'],
    },
  },
  tavily_web_search: {
    name: 'tavily_web_search',
    sourceId: 'tavily',
    description: 'Search live web sources with synthesized text snippets and verified citations.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        search_depth: { type: 'string', enum: ['basic', 'advanced'] },
        max_results: { type: 'number', description: 'Max citations to return' },
      },
      required: ['query'],
    },
  },
  fs_read_file: {
    name: 'fs_read_file',
    sourceId: 'filesystem',
    description: 'Read complete content of a workspace file.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Absolute or relative workspace path' },
      },
      required: ['path'],
    },
  },
};

/** In-memory connector state store */
let currentConnectors = [...INITIAL_CONNECTORS];

export function getAllConnectors(): ConnectorDefinition[] {
  return [...currentConnectors];
}

export function getConnector(id: string): ConnectorDefinition | undefined {
  return currentConnectors.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function getConnectorsByCategory(category: ConnectorCategory): ConnectorDefinition[] {
  return currentConnectors.filter((c) => c.category === category);
}

export function updateConnectorStatus(id: string, status: ConnectorAuthStatus): boolean {
  const index = currentConnectors.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
  if (index === -1) {
    return false;
  }
  currentConnectors[index] = {
    ...currentConnectors[index],
    status,
  };
  return true;
}

export function resetConnectorsToDefault(): void {
  currentConnectors = [...INITIAL_CONNECTORS];
}

export function getToolSchema(toolName: string): ConnectorToolSchema | undefined {
  if (TOOL_SCHEMAS[toolName]) {
    return TOOL_SCHEMAS[toolName];
  }
  // Synthesize schema if known from a connector's tools
  for (const conn of currentConnectors) {
    const matchingTool = conn.tools.find((t) => t.name === toolName);
    if (matchingTool) {
      return {
        name: matchingTool.name,
        sourceId: conn.id,
        description: matchingTool.description,
        parameters: {
          type: 'object',
          properties: {
            input: { type: 'string', description: matchingTool.parametersSummary || 'Parameters' },
          },
        },
      };
    }
  }
  return undefined;
}
