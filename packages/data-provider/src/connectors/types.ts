export type ConnectorCategory =
  | 'developer'
  | 'productivity'
  | 'communication'
  | 'finance'
  | 'data'
  | 'design'
  | 'storage';

export type ConnectorAuthStatus = 'CONNECTED' | 'DISCONNECTED' | 'NEEDS_AUTH' | 'PENDING';

export type ConnectorAuthType = 'oauth2' | 'api_key' | 'bearer' | 'mcp_server' | 'native';

export interface ConnectorToolSummary {
  name: string;
  description: string;
  parametersSummary?: string;
}

export interface ConnectorToolSchema {
  name: string;
  sourceId: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ConnectorDefinition {
  id: string;
  name: string;
  category: ConnectorCategory;
  description: string;
  status: ConnectorAuthStatus;
  authType: ConnectorAuthType;
  icon: string;
  tools: ConnectorToolSummary[];
  cliHint?: string;
  authUrl?: string;
  docsUrl?: string;
  version?: string;
}

export interface ListExternalToolsParams {
  queries?: string[];
  category?: string;
  status?: ConnectorAuthStatus | 'ALL';
}

export interface ListExternalToolsResult {
  connectors: Array<{
    id: string;
    name: string;
    status: ConnectorAuthStatus;
    category: string;
    description: string;
    tools: string[];
    cliHint?: string;
  }>;
  totalCount: number;
}

export interface DescribeExternalToolsParams {
  tool_names: string[];
  source_ids?: string[];
}

export interface DescribeExternalToolsResult {
  tools: ConnectorToolSchema[];
}

export interface CallExternalToolParams {
  tool_name: string;
  source_id: string;
  arguments: Record<string, any>;
}

export interface CallExternalToolResult {
  success: boolean;
  tool_name: string;
  source_id: string;
  data?: any;
  error?: string;
  needsAuth?: boolean;
  authUrl?: string;
}

export interface ConnectExternalToolParams {
  source_id: string;
  credentials?: Record<string, any>;
}

export interface MentionDetectionResult {
  hasMention: boolean;
  mentionedConnectors: string[];
  cleanText: string;
}
