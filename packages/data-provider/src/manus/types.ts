/**
 * Manus Agent Types & Protocols
 *
 * Reverse-engineered from Manus Agent runtime architecture:
 * - 29+ Discretionary Tools across Messaging, Files, Shell/Processes, Browser, Search, and Deployment
 * - Event Stream State Machine (Message -> Action -> Observation -> Plan -> Knowledge -> Datasource)
 * - Interactive Background Process Management (stdin writing, tail viewing, signal killing)
 * - Deterministic Local/Public Port Exposure Engine
 */

export type ManusToolName =
  | 'message_notify_user'
  | 'message_ask_user'
  | 'file_read'
  | 'file_write'
  | 'file_str_replace'
  | 'file_find_in_content'
  | 'file_find_by_name'
  | 'shell_exec'
  | 'shell_view'
  | 'shell_wait'
  | 'shell_write_to_process'
  | 'shell_kill_process'
  | 'browser_view'
  | 'browser_navigate'
  | 'browser_restart'
  | 'browser_click'
  | 'browser_input'
  | 'browser_move_mouse'
  | 'browser_press_key'
  | 'browser_select_option'
  | 'browser_scroll_up'
  | 'browser_scroll_down'
  | 'browser_console_exec'
  | 'browser_console_view'
  | 'info_search_web'
  | 'deploy_expose_port'
  | 'deploy_get_exposed_ports'
  | 'deploy_close_port'
  | 'deploy_apply_deployment'
  | 'make_manus_page'
  | 'idle';

export type ManusEventType =
  | 'message'
  | 'action'
  | 'observation'
  | 'plan'
  | 'knowledge'
  | 'datasource'
  | 'system';

export interface ManusEvent {
  id: string;
  type: ManusEventType;
  timestamp: number;
  data: Record<string, unknown>;
  summary?: string;
}

export type ManusAgentState =
  | 'IDLE'
  | 'ANALYZE_EVENTS'
  | 'SELECT_TOOL'
  | 'WAIT_EXECUTION'
  | 'ITERATE'
  | 'SUBMIT_RESULTS'
  | 'STANDBY';

export interface ManusStateTransition {
  from: ManusAgentState;
  to: ManusAgentState;
  reason?: string;
  timestamp: number;
  iteration: number;
}

export type ProcessStatus = 'running' | 'completed' | 'failed' | 'killed' | 'timed_out';

export interface ManagedProcessInfo {
  id: string;
  command: string;
  pid?: number;
  status: ProcessStatus;
  startedAt: number;
  completedAt?: number;
  exitCode?: number | null;
  outputBuffer: string[];
  lastActivity: number;
}

export interface ProcessExecOptions {
  id?: string;
  command: string;
  cwd?: string;
  env?: Record<string, string>;
  background?: boolean;
  timeoutMs?: number;
}

export interface ProcessExecResult {
  id: string;
  pid?: number;
  status: ProcessStatus;
  exitCode?: number | null;
  output: string;
  durationMs: number;
}

export type PortProtocol = 'http' | 'https' | 'ws' | 'tcp';

export interface ExposedPortInfo {
  port: number;
  protocol: PortProtocol;
  exposedUrl: string;
  localUrl: string;
  targetService?: string;
  createdAt: number;
  expiresAt?: number;
  status: 'active' | 'closed';
}

export interface ManusToolParameter {
  type: string;
  description: string;
  enum?: string[];
  items?: Record<string, unknown>;
  properties?: Record<string, ManusToolParameter>;
  required?: string[];
}

export interface ManusToolDefinition {
  type: 'function';
  function: {
    name: ManusToolName;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, Record<string, unknown>>;
      required: string[];
    };
  };
}
