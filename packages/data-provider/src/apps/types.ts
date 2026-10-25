export type AppSection = 'core' | 'agents' | 'builders' | 'research';

export type AppCapability =
  | 'artifacts'
  | 'code_execution'
  | 'web_search'
  | 'terminal'
  | 'file_editing'
  | 'multi_hop_research'
  | 'living_office'
  | 'connectors'
  | 'generative_ui'
  | 'diff_viewer'
  | 'browser_control'
  | 'fullstack_preview'
  | 'dual_mode';

export interface AppStarterPrompt {
  label: string;
  prompt: string;
  description?: string;
}

export interface AppDefinition {
  /** Unique URL-safe identifier (e.g. 'chat', 'manus', 'v0', 'perplexity') */
  id: string;
  /** Human-readable display title */
  name: string;
  /** Categorization section in sidebar */
  section: AppSection;
  /** Snappy subtitle or motto */
  tagline: string;
  /** Detailed description of superpowers and purpose */
  description: string;
  /** Lucide icon identifier name */
  icon: string;
  /** Short badge label displayed next to title (e.g. 'Standard', '30+ Tools', 'shadcn/ui') */
  badge?: string;
  /** Tailwind color classes for icon, backgrounds, and badges */
  color: string;
  /** Reference key to the authentic system prompt in promptStore */
  systemPromptId: string;
  /** Set of supported platform capabilities */
  capabilities: AppCapability[];
  /** Default tool names mounted for this app */
  defaultTools: string[];
  /** 3-4 curated starter prompts displayed on the empty state */
  suggestedStarters: AppStarterPrompt[];
  /** Ordering priority within the section */
  order: number;
  /** Whether the app is pinned to the sidebar top bar by default */
  isPinnedDefault?: boolean;
  /** Client route path (e.g. '/app/chat', '/app/manus') */
  routePath: string;
}

export interface SectionDefinition {
  id: AppSection;
  title: string;
  description: string;
  icon: string;
  badge: string;
  order: number;
}
