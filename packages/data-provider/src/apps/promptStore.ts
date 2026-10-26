/**
 * Authentic System Prompt Store & Placeholder Interpolator
 *
 * Encapsulates the authentic system prompts reverse-engineered from:
 * Anthropic (Claude Chat, Cowork, Design, Code), Manus, Devin, Cursor, Windsurf,
 * Kiro, Replit, xAI Grok, Cline, v0, Lovable, Living Office, Notion, Bolt.new,
 * Higgsfield, Perplexity Computer, ChatGPT Atlas, Brave Search, and Connector Hub.
 */

import {
  OPENAI_ATLAS_PROMPT,
  OPENAI_GPT5_SOL_PROMPT,
  OPENAI_O3_MINI_PROMPT,
  OPENAI_LIVING_OFFICE_PROMPT,
  OPENAI_OFFICE_SANDBOX_DIRECTIVES,
} from './prompts/openAiFrontier';
import {
  CURSOR_COMPOSER_PROMPT,
  WINDSURF_CASCADE_PROMPT,
  KIRO_SPEC_PROMPT,
  KIRO_VIBE_PROMPT,
  KIRO_DUAL_MODE_PROMPT,
} from './prompts/codingSpecialists';
import {
  DEEPSEEK_R1_PROMPT,
  XAI_GROK_BUILD_PROMPT,
  QWEN_CODER_PROMPT,
  MOONSHOT_KIMI_PROMPT,
} from './prompts/frontierAlternative';
import {
  CLAUDE_CHAT_PROMPT,
  CLAUDE_COWORK_PROMPT,
  CLAUDE_DESIGN_PROMPT,
  CLAUDE_CODE_PROMPT,
} from './prompts/claudeCore';
import {
  PERPLEXITY_DEEP_RESEARCH_PROMPT,
  PERPLEXITY_COMPUTER_PROMPT,
} from './prompts/perplexityResearch';
import {
  DEVIN_SWE_PROMPT,
  DEVIN_DEEPWIKI_PROMPT,
  DEVIN_AGENT_PROMPT,
} from './prompts/devinPrompt';
import {
  NOTION_AI_STUDIO_PROMPT,
  LIVING_OFFICE_SUITE_PROMPT,
} from './prompts/officeNotionPrompts';
import {
  LOVABLE_BUILDER_PROMPT,
  BOLT_BUILDER_PROMPT,
} from './prompts/fullStackBuilders';
import { MANUS_AGENT_PROMPT } from './prompts/manusPrompt';
import { V0_OFFICIAL_PROMPT } from './prompts/v0Prompt';

export * from './prompts/claudeCore';
export * from './prompts/openAiFrontier';
export * from './prompts/frontierAlternative';
export * from './prompts/manusPrompt';
export * from './prompts/devinPrompt';
export * from './prompts/codingSpecialists';
export * from './prompts/v0Prompt';
export * from './prompts/fullStackBuilders';
export * from './prompts/officeNotionPrompts';
export * from './prompts/perplexityResearch';

export interface PromptInterpolationOptions {
  currentDate?: string;
  currentTime?: string;
  workingDirectory?: string;
  userName?: string;
  currentOs?: string;
  knowledgeCutoff?: string;
  appName?: string;
  variables?: Record<string, string>;
}

/**
 * Returns dynamic default placeholders.
 */
export function getDefaultPlaceholders(): Record<string, string> {
  const now = new Date();
  return {
    CURRENT_DATE: now.toISOString().split('T')[0],
    CURRENT_TIME: now.toTimeString().split(' ')[0],
    WORKING_DIRECTORY: '/workspace',
    USER_NAME: 'Developer',
    CURRENT_OS: 'mac',
    KNOWLEDGE_CUTOFF: 'March 2026',
    APP_NAME: 'Claude All-in-One AI Suite',
  };
}

/**
 * Interpolates variables formatted as `{{KEY}}` inside a prompt template.
 */
export function interpolatePrompt(
  template: string,
  options: PromptInterpolationOptions = {},
): string {
  const defaults = getDefaultPlaceholders();

  const mergedVars: Record<string, string> = {
    ...defaults,
    ...(options.currentDate && { CURRENT_DATE: options.currentDate }),
    ...(options.currentTime && { CURRENT_TIME: options.currentTime }),
    ...(options.workingDirectory && { WORKING_DIRECTORY: options.workingDirectory }),
    ...(options.userName && { USER_NAME: options.userName }),
    ...(options.currentOs && { CURRENT_OS: options.currentOs }),
    ...(options.knowledgeCutoff && { KNOWLEDGE_CUTOFF: options.knowledgeCutoff }),
    ...(options.appName && { APP_NAME: options.appName }),
    ...(options.variables || {}),
  };

  return template.replace(/{{\s*([A-Z0-9_]+)\s*}}/g, (match, key) => {
    if (key in mergedVars) {
      return mergedVars[key];
    }
    return match;
  });
}

/**
 * Authentic System Prompt Templates for all 22 platform manifestations.
 */
export const AUTHENTIC_PROMPTS: Record<string, string> = {
  // ==========================================
  // CORE ANTHROPIC FRONTIER PROMPTS
  // ==========================================
  'claude-chat': CLAUDE_CHAT_PROMPT,
  'claude-cowork': CLAUDE_COWORK_PROMPT,
  'claude-design': CLAUDE_DESIGN_PROMPT,
  'claude-code': CLAUDE_CODE_PROMPT,

  // ==========================================
  // AUTONOMOUS AGENTS PROMPTS
  // ==========================================
  'manus-agent': MANUS_AGENT_PROMPT,
  'cognition-devin': DEVIN_AGENT_PROMPT,
  devin: DEVIN_AGENT_PROMPT,
  'devin-swe': DEVIN_SWE_PROMPT,
  'devin-wiki': DEVIN_DEEPWIKI_PROMPT,
  deepwiki: DEVIN_DEEPWIKI_PROMPT,
  cognition: DEVIN_AGENT_PROMPT,

  'cursor-composer': CURSOR_COMPOSER_PROMPT,
  cursor: CURSOR_COMPOSER_PROMPT,
  'windsurf-cascade': WINDSURF_CASCADE_PROMPT,
  windsurf: WINDSURF_CASCADE_PROMPT,
  'kiro-dual-mode': KIRO_DUAL_MODE_PROMPT,
  kiro: KIRO_DUAL_MODE_PROMPT,
  'kiro-spec': KIRO_SPEC_PROMPT,
  'kiro-vibe': KIRO_VIBE_PROMPT,
  traycer: KIRO_DUAL_MODE_PROMPT,

  'replit-agent': `<identity>
You are Replit Agent, cloud software architect and deployment orchestrator.
Date: {{CURRENT_DATE}}.
Workspace: {{WORKING_DIRECTORY}}.
</identity>

<cloud_runtime>
- Provision dependencies automatically in the cloud container sandbox.
- Configure web servers with correct host bindings (0.0.0.0) and port mappings.
- Provide instant deployment readiness and live URL generation.
</cloud_runtime>`,

  'xai-grok-build': XAI_GROK_BUILD_PROMPT,

  'cline-operator': `<identity>
You are Cline, an autonomous software development assistant with human-in-the-loop safeguards.
Date: {{CURRENT_DATE}}.
Workspace: {{WORKING_DIRECTORY}}.
</identity>

<safety_invariants>
- Provide transparent reasoning before executing terminal commands or modifying critical files.
- Provide step-by-step confirmation for destructive file system actions or git resets.
- Verify every code change by checking compiler output and test results.
</safety_invariants>`,

  // ==========================================
  // BUILDERS & PRODUCTIVITY PROMPTS
  // ==========================================
  'v0-generative-ui': V0_OFFICIAL_PROMPT,
  v0: V0_OFFICIAL_PROMPT,

  'lovable-builder': LOVABLE_BUILDER_PROMPT,
  lovable: LOVABLE_BUILDER_PROMPT,

  'living-office': LIVING_OFFICE_SUITE_PROMPT,
  office: LIVING_OFFICE_SUITE_PROMPT,

  'notion-studio': NOTION_AI_STUDIO_PROMPT,
  notion: NOTION_AI_STUDIO_PROMPT,

  'bolt-new': BOLT_BUILDER_PROMPT,
  bolt: BOLT_BUILDER_PROMPT,

  'higgsfield-builder': `<identity>
You are Higgsfield Website Builder, next-generation web creator with AI multimedia assets.
Date: {{CURRENT_DATE}}.
</identity>

<superhero_builder>
- Generate full-stack SSR web applications combining React 19, Tailwind CSS, and embedded AI video/photography assets.
- Deliver bold typography, high-impact hero sections, and immersive product storytelling.
</superhero_builder>`,

  // ==========================================
  // RESEARCH & BROWSING PROMPTS
  // ==========================================
  'perplexity-deep-research': PERPLEXITY_DEEP_RESEARCH_PROMPT,
  'deep-research': PERPLEXITY_DEEP_RESEARCH_PROMPT,
  research: PERPLEXITY_DEEP_RESEARCH_PROMPT,
  'perplexity-computer': PERPLEXITY_COMPUTER_PROMPT,
  perplexity: PERPLEXITY_DEEP_RESEARCH_PROMPT,

  'chatgpt-atlas': OPENAI_ATLAS_PROMPT,
  'gpt-5-sol': OPENAI_GPT5_SOL_PROMPT,
  'o3-mini': OPENAI_O3_MINI_PROMPT,

  'brave-deepsearch': `<identity>
You are Brave & Deep Search, the privacy-first independent web researcher.
Date: {{CURRENT_DATE}}.
</identity>

<independent_indexing>
- Query the open, independent web index without commercial bias or tracking cookies.
- Extract unbiased technical specifications, RFCs, and academic preprints with factual neutrality.
</independent_indexing>`,

  'connector-hub': `<identity>
You are the Perplexity Computer Connector Hub.
Date: {{CURRENT_DATE}}.
Available Connectors: GitHub, Slack, Notion, Jira, Linear, Stripe, PostgreSQL, Figma, Google Drive.
</identity>

<connector_protocol>
- On-demand discovery: Use list_external_tools to find tools without polluting context.
- Fetch parameter schemas dynamically via describe_external_tools before execution.
- If a connector is DISCONNECTED, prompt authentication rather than failing silently.
- When the user @mentions a service (e.g. @GitHub, @Stripe), treat it as an explicit directive to use that connector.
</connector_protocol>`,

  // ==========================================
  // FRONTIER OPEN-SOURCE & CHALLENGER PROMPTS
  // ==========================================
  'deepseek-r1': DEEPSEEK_R1_PROMPT,
  'qwen-coder': QWEN_CODER_PROMPT,
  'moonshot-kimi': MOONSHOT_KIMI_PROMPT,
};

/**
 * Maps known app IDs to their respective systemPromptId if they differ.
 */
export const APP_ID_TO_PROMPT_ID: Record<string, string> = {
  chat: 'claude-chat',
  cowork: 'claude-cowork',
  design: 'claude-design',
  code: 'claude-code',
  manus: 'manus-agent',
  devin: 'cognition-devin',
  cursor: 'cursor-composer',
  windsurf: 'windsurf-cascade',
  kiro: 'kiro-dual-mode',
  replit: 'replit-agent',
  grok: 'xai-grok-build',
  'grok-build': 'xai-grok-build',
  'xai-grok-build': 'xai-grok-build',
  cline: 'cline-operator',
  v0: 'v0-generative-ui',
  lovable: 'lovable-builder',
  office: 'living-office',
  notion: 'notion-studio',
  bolt: 'bolt-new',
  higgsfield: 'higgsfield-builder',
  perplexity: 'perplexity-deep-research',
  research: 'perplexity-deep-research',
  'perplexity-deep-research': 'perplexity-deep-research',
  atlas: 'chatgpt-atlas',
  'chatgpt-atlas': 'chatgpt-atlas',
  'gpt-5-sol': 'gpt-5-sol',
  gpt5: 'gpt-5-sol',
  sol: 'gpt-5-sol',
  'o3-mini': 'o3-mini',
  o3: 'o3-mini',
  deepsearch: 'brave-deepsearch',
  connectors: 'connector-hub',
  'deepseek-r1': 'deepseek-r1',
  deepseek: 'deepseek-r1',
  r1: 'deepseek-r1',
  'qwen-coder': 'qwen-coder',
  qwen: 'qwen-coder',
  'moonshot-kimi': 'moonshot-kimi',
  kimi: 'moonshot-kimi',
  'devin-ai': 'cognition-devin',
  cognition: 'cognition-devin',
  deepwiki: 'devin-wiki',
  'devin-swe': 'devin-swe',
  traycer: 'kiro-dual-mode',
  'kiro-spec': 'kiro-spec',
  'kiro-vibe': 'kiro-vibe',
};

export const AUTHENTIC_SYSTEM_PROMPTS = AUTHENTIC_PROMPTS;
export const authenticPrompts = AUTHENTIC_PROMPTS;

/**
 * Retrieves the authentic system prompt for a given systemPromptId or appId,
 * interpolating all dynamic placeholders.
 */
export function getAuthenticPrompt(
  promptId?: string | null,
  options: PromptInterpolationOptions = {},
): string {
  if (!promptId) {
    return interpolatePrompt(AUTHENTIC_PROMPTS['claude-chat'], options);
  }

  const cleanId = promptId.trim().toLowerCase();
  const resolvedId = APP_ID_TO_PROMPT_ID[cleanId] || cleanId;
  const template =
    AUTHENTIC_PROMPTS[resolvedId] ||
    AUTHENTIC_PROMPTS[cleanId] ||
    AUTHENTIC_PROMPTS['claude-chat'];

  return interpolatePrompt(template, options);
}

/**
 * Checks whether a given prompt identifier or appId exists in the prompt store.
 */
export function hasPrompt(promptId?: string | null): boolean {
  if (!promptId) {
    return false;
  }
  const cleanId = promptId.trim().toLowerCase();
  const resolvedId = APP_ID_TO_PROMPT_ID[cleanId] || cleanId;
  return resolvedId in AUTHENTIC_PROMPTS || cleanId in AUTHENTIC_PROMPTS;
}

/**
 * Returns a list of all registered authentic prompt identifiers.
 */
export function getAllPromptIds(): string[] {
  return Object.keys(AUTHENTIC_PROMPTS);
}
