import {
  getAppDefinition,
  isValidAppId,
  getAuthenticPrompt,
  hasPrompt,
  type AppDefinition,
  type PromptInterpolationOptions,
  type Agent,
} from 'librechat-data-provider';

export interface AppScopeOptions {
  user?: { name?: string; id?: string };
  workingDirectory?: string;
  timezone?: string;
  currentOs?: string;
  variables?: Record<string, string>;
}

export interface AppDispatchedPayload {
  appId: string;
  appDefinition: AppDefinition | null;
  authenticPrompt: string;
  defaultTools: string[];
}

export interface OpenRouterMessage {
  role: 'system' | 'developer' | 'user' | 'assistant' | 'tool';
  content: string | unknown[];
  name?: string;
  tool_call_id?: string;
  tool_calls?: unknown[];
}

export interface OpenRouterPayloadAssembly {
  appId: string;
  messages: OpenRouterMessage[];
  defaultTools: string[];
}

/**
 * Resolves the target appId from a server request, request body, or conversation object.
 * Always resolves to a valid registered appId, defaulting to 'chat' for standard chat.
 */
export function resolveAppId(reqOrBody: unknown): string {
  if (!reqOrBody || typeof reqOrBody !== 'object') {
    return 'chat';
  }

  const record = reqOrBody as Record<string, any>;

  const candidate =
    record.body?.appId ??
    record.appId ??
    record.body?.endpointOption?.appId ??
    record.endpointOption?.appId ??
    record.body?.conversation?.appId ??
    record.conversation?.appId ??
    record.resolvedConversation?.appId;

  if (typeof candidate === 'string') {
    const trimmed = candidate.trim().toLowerCase();
    if (trimmed && (isValidAppId(trimmed) || hasPrompt(trimmed))) {
      return trimmed;
    }
  }

  return 'chat';
}

/**
 * Dispatches and interpolates the authentic system prompt and default tools
 * for a specific app identifier.
 */
export function dispatchAppPrompt(
  appId: string,
  options: AppScopeOptions = {},
): AppDispatchedPayload {
  const resolvedAppId = isValidAppId(appId) || hasPrompt(appId) ? appId.trim().toLowerCase() : 'chat';
  const appDefinition = getAppDefinition(resolvedAppId) ?? null;

  const promptOptions: PromptInterpolationOptions = {
    userName: options.user?.name || 'Developer',
    workingDirectory: options.workingDirectory || '/workspace',
    currentTime: options.timezone ? new Date().toLocaleTimeString('en-US', { timeZone: options.timezone }) : undefined,
    currentOs: options.currentOs || 'mac',
    appName: appDefinition?.name || 'Claude All-in-One AI Suite',
    variables: options.variables,
  };

  const systemPromptId = appDefinition?.systemPromptId || resolvedAppId;
  const authenticPrompt = getAuthenticPrompt(systemPromptId, promptOptions);
  const defaultTools = appDefinition?.defaultTools ? [...appDefinition.defaultTools] : [];

  return {
    appId: resolvedAppId,
    appDefinition,
    authenticPrompt,
    defaultTools,
  };
}

/**
 * Applies app-scoped authentic system instructions and default tools to an Agent.
 *
 * Guaranteed Strict Isolation:
 * - Injects the foundation prompt onto `agent.instructions` as foundation prompt
 * - Never touches user messages or database conversation history
 * - Injects app-specific tools (e.g. Manus tools, Perplexity tools, Office tools)
 */
export function applyAppScopeToAgent(
  agent: Partial<Agent> & { appId?: string },
  appId: string,
  options: AppScopeOptions = {},
): AppDispatchedPayload {
  const dispatched = dispatchAppPrompt(appId, options);

  // 1. Mount foundation authentic prompt as system instructions
  if (agent.instructions && agent.instructions.trim().length > 0) {
    // If agent already has custom/user instructions (e.g. promptPrefix), prepend foundation prompt
    if (!agent.instructions.includes(dispatched.authenticPrompt.slice(0, 40))) {
      agent.instructions = [dispatched.authenticPrompt, agent.instructions].filter(Boolean).join('\n\n');
    }
  } else {
    agent.instructions = dispatched.authenticPrompt;
  }

  // 2. Connect app-specific default tools
  if (dispatched.defaultTools.length > 0) {
    const existingTools = new Set(agent.tools || []);
    for (const tool of dispatched.defaultTools) {
      existingTools.add(tool);
    }
    agent.tools = Array.from(existingTools);
  }

  // 3. Stamp appId onto the agent runtime metadata
  agent.appId = dispatched.appId;

  return dispatched;
}

/**
 * Filters out any system or developer messages from a message list.
 * Guarantees strict UI and DB isolation so that system prompts are never returned
 * to the client or saved into conversational turn lists.
 */
export function filterSystemPromptFromMessages<T extends { role?: string; isCreatedByUser?: boolean }>(
  messages: T[],
): T[] {
  if (!Array.isArray(messages)) {
    return [];
  }
  return messages.filter((msg) => {
    if (!msg) {
      return false;
    }
    const role = (msg.role || '').toLowerCase();
    return role !== 'system' && role !== 'developer';
  });
}

/**
 * Validates that no internal system prompt has leaked into a user-visible message list.
 */
export function isSystemPromptIsolated(messages: unknown[]): boolean {
  if (!Array.isArray(messages)) {
    return true;
  }
  return messages.every((msg: any) => {
    if (!msg || typeof msg !== 'object') {
      return true;
    }
    const role = (msg.role || '').toLowerCase();
    return role !== 'system' && role !== 'developer';
  });
}

/**
 * Assembles a clean, authenticated OpenRouter / OpenAI payload:
 * - Mounts the authentic system prompt as the FIRST message (role: 'system')
 * - Strictly keeps sanitized user/assistant history in subsequent turns
 * - Attaches app default tools to the payload definition
 */
export function assembleOpenRouterPayload(
  appId: string,
  rawMessages: Array<Record<string, any>>,
  options: AppScopeOptions = {},
): OpenRouterPayloadAssembly {
  const dispatched = dispatchAppPrompt(appId, options);

  // Clean raw messages to ensure no pre-existing system prompt conflicts
  const sanitizedMessages: OpenRouterMessage[] = filterSystemPromptFromMessages(rawMessages).map((m) => ({
    role: (m.role || (m.isCreatedByUser ? 'user' : 'assistant')) as any,
    content: m.content || m.text || '',
    ...(m.name && { name: m.name }),
    ...(m.tool_call_id && { tool_call_id: m.tool_call_id }),
    ...(m.tool_calls && { tool_calls: m.tool_calls }),
  }));

  // Mount authentic prompt as first message
  const assembledMessages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: dispatched.authenticPrompt,
    },
    ...sanitizedMessages,
  ];

  return {
    appId: dispatched.appId,
    messages: assembledMessages,
    defaultTools: dispatched.defaultTools,
  };
}
