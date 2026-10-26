import type { AppDefinition, AppSection, SectionDefinition } from './types';

export const APP_SECTIONS: Record<AppSection, SectionDefinition> = {
  core: {
    id: 'core',
    title: 'Core Apps',
    description: 'Frontier AI reasoning, pair programming & visual design',
    icon: 'Sparkles',
    badge: '4 Apps',
    order: 1,
  },
  agents: {
    id: 'agents',
    title: 'Autonomous Agents',
    description: 'Self-executing agentic workflows, terminals & multi-tool runtimes',
    icon: 'Cpu',
    badge: '8 Agents',
    order: 2,
  },
  builders: {
    id: 'builders',
    title: 'Builders & Productivity',
    description: 'Generative UI, living office artifacts & full-stack development',
    icon: 'Layers',
    badge: '6 Studios',
    order: 3,
  },
  research: {
    id: 'research',
    title: 'Research & Browsing',
    description: 'Recursive multi-hop research, live citations & external connectors',
    icon: 'Compass',
    badge: '4 Hubs',
    order: 4,
  },
};

export const APPS_REGISTRY: Record<string, AppDefinition> = {
  // ==========================================
  // CORE APPS (Anthropic Frontier Suite)
  // ==========================================
  chat: {
    id: 'chat',
    name: 'Claude Chat',
    section: 'core',
    tagline: 'World-Class Conversational Intelligence & Nuance',
    description:
      'Natural, articulate, and thoughtful general intelligence. Excels at complex problem-solving, intellectual synthesis, and creative ideation.',
    icon: 'MessageSquare',
    badge: 'Standard',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    systemPromptId: 'claude-chat',
    capabilities: ['artifacts', 'web_search', 'generative_ui'],
    defaultTools: ['web_search'],
    suggestedStarters: [
      {
        label: 'Explain concept',
        prompt: 'Explain how distributed Byzantine fault tolerance works in clear, intuitive terms.',
      },
      {
        label: 'Refactor code',
        prompt: 'Review this architecture and suggest optimizations for concurrent throughput.',
      },
      {
        label: 'Draft strategy',
        prompt: 'Draft an executive briefing outlining our AI agent adoption roadmap.',
      },
    ],
    order: 1,
    isPinnedDefault: true,
    routePath: '/app/chat',
  },
  cowork: {
    id: 'cowork',
    name: 'Claude Cowork',
    section: 'core',
    tagline: 'Autonomous Pair Programming & Workspace Coordination',
    description:
      'Deep workspace collaboration with real-time file tree analysis, multi-agent dispatch, and background task orchestration.',
    icon: 'Users',
    badge: 'Pair Coding',
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    systemPromptId: 'claude-cowork',
    capabilities: ['artifacts', 'code_execution', 'terminal', 'file_editing', 'diff_viewer'],
    defaultTools: ['read_file', 'bash_tool'],
    suggestedStarters: [
      {
        label: 'Audit workspace',
        prompt: 'Audit the repository architecture and identify circular module dependencies.',
      },
      {
        label: 'Scaffold tests',
        prompt: 'Generate unit tests for our data provider services with 100% coverage.',
      },
      {
        label: 'Orchestrate task',
        prompt: 'Coordinate a multi-file refactoring across api and client workspaces.',
      },
    ],
    order: 2,
    isPinnedDefault: true,
    routePath: '/app/cowork',
  },
  design: {
    id: 'design',
    name: 'Claude Design',
    section: 'core',
    tagline: 'Visual UI/UX Design, Typography & Design Tokens',
    description:
      'Creative aesthetic studio tailored for modern design systems, micro-interactions, responsive layouts, and Tailwind token palettes.',
    icon: 'Palette',
    badge: 'Design System',
    color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    systemPromptId: 'claude-design',
    capabilities: ['artifacts', 'generative_ui', 'fullstack_preview'],
    defaultTools: ['web_search'],
    suggestedStarters: [
      {
        label: 'Create theme tokens',
        prompt: 'Design a cohesive dark/light token palette matching Anthropic typography.',
      },
      {
        label: 'Design component',
        prompt: 'Create a responsive, accessible pricing card with animated monthly/annual toggles.',
      },
      {
        label: 'Micro-interactions',
        prompt: 'Suggest fluid hover and focus animations using Framer Motion and Tailwind.',
      },
    ],
    order: 3,
    isPinnedDefault: false,
    routePath: '/app/design',
  },
  code: {
    id: 'code',
    name: 'Claude Code',
    section: 'core',
    tagline: 'High-Velocity CLI Agent & Repo Exploration',
    description:
      'Zero-fluff, code-first terminal persona. Executes surgical edits, inspects stack traces, and runs local test suites.',
    icon: 'Terminal',
    badge: 'CLI Agent',
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    systemPromptId: 'claude-code',
    capabilities: ['artifacts', 'code_execution', 'terminal', 'file_editing', 'diff_viewer'],
    defaultTools: ['bash_tool', 'read_file'],
    suggestedStarters: [
      {
        label: 'Debug build failure',
        prompt: 'Run the build command, analyze typescript compile errors, and fix them in place.',
      },
      {
        label: 'Fast refactor',
        prompt: 'Convert all legacy callback functions in this file to async/await with error boundaries.',
      },
      {
        label: 'Git branch review',
        prompt: 'Inspect the last 5 git commits and write a concise, conventional release changelog.',
      },
    ],
    order: 4,
    isPinnedDefault: true,
    routePath: '/app/code',
  },

  // ==========================================
  // AUTONOMOUS AGENTS
  // ==========================================
  manus: {
    id: 'manus',
    name: 'Manus Workspace',
    section: 'agents',
    tagline: 'Autonomous 30+ Tool Agent Runtime with Process Controls',
    description:
      'General-purpose autonomous agent with long-running shell process management, browser control, and deployment port exposure.',
    icon: 'Cpu',
    badge: '30+ Tools',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    systemPromptId: 'manus-agent',
    capabilities: ['terminal', 'code_execution', 'file_editing', 'browser_control', 'artifacts'],
    defaultTools: ['shell_write_to_process', 'deploy_expose_port', 'bash_tool', 'read_file'],
    suggestedStarters: [
      {
        label: 'Start dev server',
        prompt: 'Spawn Vite dev server in the background and monitor its port with live log streaming.',
      },
      {
        label: 'Automate workflow',
        prompt: 'Scrape product specs from public API docs and output structured JSON and CSV.',
      },
      {
        label: 'Deploy microservice',
        prompt: 'Build a Docker container, expose port 8080, and verify health check endpoints.',
      },
    ],
    order: 1,
    isPinnedDefault: true,
    routePath: '/app/manus',
  },
  devin: {
    id: 'devin',
    name: 'Cognition Devin',
    section: 'agents',
    tagline: 'Autonomous Software Engineer with Isolated Sandboxes',
    description:
      'Engineered for end-to-end bug fixing, library upgrades, migration scripts, and self-verifying test pipelines.',
    icon: 'Bot',
    badge: 'Autonomous SWE',
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    systemPromptId: 'cognition-devin',
    capabilities: ['terminal', 'code_execution', 'file_editing', 'diff_viewer', 'browser_control'],
    defaultTools: ['bash_tool', 'read_file'],
    suggestedStarters: [
      {
        label: 'Fix GitHub issue',
        prompt: 'Reproduce bug #402 with a failing test case, patch the logic, and verify test passes.',
      },
      {
        label: 'Migrate library',
        prompt: 'Migrate all Recoil atom families in this directory to Jotai primitives safely.',
      },
      {
        label: 'Full repo benchmark',
        prompt: 'Run our benchmark suite and identify the top 3 memory allocation hot spots.',
      },
    ],
    order: 2,
    isPinnedDefault: false,
    routePath: '/app/devin',
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor Studio',
    section: 'agents',
    tagline: 'Multi-File Diffs, Composer Editing & Code Intelligence',
    description:
      'Lightning-fast multi-file Composer agent. Generates inline red/green diffs with one-click workspace acceptance.',
    icon: 'Code',
    badge: 'Inline Diffs',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    systemPromptId: 'cursor-composer',
    capabilities: ['artifacts', 'diff_viewer', 'file_editing', 'code_execution'],
    defaultTools: ['read_file', 'bash_tool'],
    suggestedStarters: [
      {
        label: 'Multi-file edit',
        prompt: 'Rename the storage family atoms and update all client consumer imports consistently.',
      },
      {
        label: 'Generate diff',
        prompt: 'Implement rate limiting middleware and show me the proposed diff before writing.',
      },
      {
        label: 'Composer refactor',
        prompt: 'Extract duplicated validation schemas into a shared data-provider helper.',
      },
    ],
    order: 3,
    isPinnedDefault: true,
    routePath: '/app/cursor',
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf Wave',
    section: 'agents',
    tagline: 'Self-Healing Dev Preview with Real-Time Console Feedback',
    description:
      'Cascade flow with integrated browser dev server and automatic error correction loops from browser console logs.',
    icon: 'Waves',
    badge: 'Self-Healing',
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    systemPromptId: 'windsurf-cascade',
    capabilities: ['fullstack_preview', 'terminal', 'file_editing', 'code_execution'],
    defaultTools: ['bash_tool', 'read_file'],
    suggestedStarters: [
      {
        label: 'Spin up preview',
        prompt: 'Launch dev server on port 3090, capture any console runtime errors, and auto-heal.',
      },
      {
        label: 'Interactive UI loop',
        prompt: 'Build a responsive kanban board and verify with live component mounting.',
      },
      {
        label: 'Fix console warnings',
        prompt: 'Scan the frontend runtime for unhandled promise rejections and patch them.',
      },
    ],
    order: 4,
    isPinnedDefault: false,
    routePath: '/app/windsurf',
  },
  kiro: {
    id: 'kiro',
    name: 'Kiro / Traycer',
    section: 'agents',
    tagline: 'Dual-Mode Engine: Spec / Plan Mode vs Vibe Mode',
    description:
      'Enforces architectural discipline. Refuses premature code execution in Spec Mode while delivering rapid prototypes in Vibe Mode.',
    icon: 'Sliders',
    badge: 'Dual-Mode',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    systemPromptId: 'kiro-dual-mode',
    capabilities: ['dual_mode', 'artifacts', 'file_editing'],
    defaultTools: ['read_file'],
    suggestedStarters: [
      {
        label: 'Spec mode plan',
        prompt: 'Write an exhaustive specification and invariant checklist for a payment webhook handler.',
      },
      {
        label: 'Vibe mode build',
        prompt: 'Fast-forward into Vibe Mode: generate a vibrant landing page with smooth CSS transitions.',
      },
      {
        label: 'Classify intent',
        prompt: 'Analyze this feature request and categorize whether it requires Spec or Vibe mode.',
      },
    ],
    order: 5,
    isPinnedDefault: false,
    routePath: '/app/kiro',
  },
  replit: {
    id: 'replit',
    name: 'Replit Studio',
    section: 'agents',
    tagline: 'Instant Cloud Environments & Package Management',
    description:
      'Cloud sandbox orchestration with automated package installation, Nix configurations, and web service deployments.',
    icon: 'Layers',
    badge: 'Cloud Sandbox',
    color: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
    systemPromptId: 'replit-agent',
    capabilities: ['terminal', 'code_execution', 'fullstack_preview'],
    defaultTools: ['bash_tool', 'read_file'],
    suggestedStarters: [
      {
        label: 'Setup environment',
        prompt: 'Configure a Node.js 22 + TypeScript runtime with pnpm package caching.',
      },
      {
        label: 'Deploy API',
        prompt: 'Create a lightweight Express microservice with CORS and healthcheck endpoints.',
      },
    ],
    order: 6,
    isPinnedDefault: false,
    routePath: '/app/replit',
  },
  grok: {
    id: 'grok',
    name: 'xAI Grok Build',
    section: 'agents',
    tagline: 'High-Speed Iteration & Deep Technical CLI Tooling',
    description:
      'Witty, direct, and unconstrained engineering persona with raw systems reasoning and speed.',
    icon: 'Zap',
    badge: 'High Speed',
    color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
    systemPromptId: 'xai-grok-build',
    capabilities: ['terminal', 'code_execution', 'file_editing'],
    defaultTools: ['bash_tool'],
    suggestedStarters: [
      {
        label: 'Stress test script',
        prompt: 'Write a high-concurrency bash script to stress-test our websocket connection limits.',
      },
      {
        label: 'Unpack binary protocol',
        prompt: 'Dissect this hexadecimal network frame and parse its header fields.',
      },
    ],
    order: 7,
    isPinnedDefault: false,
    routePath: '/app/grok',
  },
  cline: {
    id: 'cline',
    name: 'Cline Autonomous',
    section: 'agents',
    tagline: 'Surgical System Operator with Approval Safeguards',
    description:
      'Safety-first system agent with human-in-the-loop approvals before file writes or shell command executions.',
    icon: 'ShieldCheck',
    badge: 'Safe Execution',
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    systemPromptId: 'cline-operator',
    capabilities: ['terminal', 'file_editing', 'diff_viewer', 'code_execution'],
    defaultTools: ['bash_tool', 'read_file'],
    suggestedStarters: [
      {
        label: 'Guided migration',
        prompt: 'Propose step-by-step database migration commands and await confirmation before running.',
      },
      {
        label: 'System cleanup',
        prompt: 'Find and safely remove orphaned node_modules and build artifacts across directories.',
      },
    ],
    order: 8,
    isPinnedDefault: false,
    routePath: '/app/cline',
  },

  // ==========================================
  // BUILDERS & PRODUCTIVITY
  // ==========================================
  v0: {
    id: 'v0',
    name: 'v0 Studio',
    section: 'builders',
    tagline: 'Generative UI with shadcn/ui, Tailwind & React',
    description:
      'World-class generative UI builder. Creates accessible, modern React 19 components with shadcn/ui and Lucide icons.',
    icon: 'Sparkles',
    badge: 'shadcn/ui',
    color: 'text-zinc-100 bg-zinc-800 border-zinc-700',
    systemPromptId: 'v0-generative-ui',
    capabilities: ['artifacts', 'generative_ui', 'fullstack_preview'],
    defaultTools: ['web_search'],
    suggestedStarters: [
      {
        label: 'Build dashboard',
        prompt: 'Generate an executive analytics dashboard with KPI metric cards, tabs, and chart placeholders.',
      },
      {
        label: 'Interactive form',
        prompt: 'Build a multi-step user onboarding form card with input validation and progress indicator.',
      },
      {
        label: 'Data table',
        prompt: 'Create a responsive data table with sortable columns, search filter, and pagination.',
      },
    ],
    order: 1,
    isPinnedDefault: true,
    routePath: '/app/v0',
  },
  lovable: {
    id: 'lovable',
    name: 'Lovable Studio',
    section: 'builders',
    tagline: 'Full-Stack Web App Scaffolding with Live Preview',
    description:
      'Rapid prototype builder connecting modern React frontends with Supabase authentication and PostgreSQL tables.',
    icon: 'Heart',
    badge: 'Full-Stack',
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    systemPromptId: 'lovable-builder',
    capabilities: ['artifacts', 'generative_ui', 'fullstack_preview', 'connectors'],
    defaultTools: ['web_search'],
    suggestedStarters: [
      {
        label: 'Create web app',
        prompt: 'Scaffold a complete task management web app with authentication and task status tags.',
      },
      {
        label: 'Build landing page',
        prompt: 'Design a sleek SaaS landing page with hero banner, feature grid, and testimonials.',
      },
    ],
    order: 2,
    isPinnedDefault: false,
    routePath: '/app/lovable',
  },
  office: {
    id: 'office',
    name: 'Living Office Suite',
    section: 'builders',
    tagline: 'Interactive Word, Excel with Formulas & PowerPoint',
    description:
      'Living business document generator. Edit Word documents, calculate Excel models with live formulas, and present slide decks.',
    icon: 'FileSpreadsheet',
    badge: 'Living Suite',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    systemPromptId: 'living-office',
    capabilities: ['artifacts', 'living_office'],
    defaultTools: [],
    suggestedStarters: [
      {
        label: 'Financial model',
        prompt: 'Create a 4-quarter revenue projection in Excel with =SUM and =AVERAGE formulas.',
      },
      {
        label: 'Strategy memo',
        prompt: 'Draft an executive Word document summarizing our AI safety and governance posture.',
      },
      {
        label: 'Pitch slide deck',
        prompt: 'Generate an 8-slide PowerPoint deck with KPI metric cards for our Series A pitch.',
      },
    ],
    order: 3,
    isPinnedDefault: true,
    routePath: '/app/office',
  },
  notion: {
    id: 'notion',
    name: 'Notion AI Studio',
    section: 'builders',
    tagline: 'Hierarchical Wikis, Relational Databases & Documents',
    description:
      'Structured workspace documents with nested callout blocks, table schemas, and clean executive summaries.',
    icon: 'FileText',
    badge: 'Knowledge Wiki',
    color: 'text-stone-400 bg-stone-500/10 border-stone-500/20',
    systemPromptId: 'notion-studio',
    capabilities: ['artifacts', 'living_office', 'connectors'],
    defaultTools: ['web_search'],
    suggestedStarters: [
      {
        label: 'Team knowledge base',
        prompt: 'Structure an engineering onboarding wiki with links, architecture guides, and checklist items.',
      },
      {
        label: 'Product requirement spec',
        prompt: 'Create a PRD document with problem statement, user stories, and acceptance criteria.',
      },
    ],
    order: 4,
    isPinnedDefault: false,
    routePath: '/app/notion',
  },
  bolt: {
    id: 'bolt',
    name: 'Bolt.new',
    section: 'builders',
    tagline: 'In-Browser WebContainers & Zero-Config Deployment',
    description:
      'Runs Node.js environments directly in the browser container for zero-friction full-stack testing.',
    icon: 'Zap',
    badge: 'WebContainers',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    systemPromptId: 'bolt-new',
    capabilities: ['artifacts', 'fullstack_preview', 'code_execution'],
    defaultTools: ['bash_tool'],
    suggestedStarters: [
      {
        label: 'Spin up Vite app',
        prompt: 'Generate a minimal React + Tailwind Vite app with instant hot module reloading.',
      },
    ],
    order: 5,
    isPinnedDefault: false,
    routePath: '/app/bolt',
  },
  higgsfield: {
    id: 'higgsfield',
    name: 'Higgsfield Website Builder',
    section: 'builders',
    tagline: 'Next-Gen Full-Stack Web Development with AI Multimedia',
    description:
      'Combines modern React 19 SSR code generation with embedded AI video and imagery for stunning web presence.',
    icon: 'Globe',
    badge: 'Multimedia Web',
    color: 'text-lime-500 bg-lime-500/10 border-lime-500/20',
    systemPromptId: 'higgsfield-builder',
    capabilities: ['artifacts', 'generative_ui', 'fullstack_preview'],
    defaultTools: ['web_search'],
    suggestedStarters: [
      {
        label: 'Hero website',
        prompt: 'Build a high-impact luxury brand website with full-width video hero and interactive gallery.',
      },
    ],
    order: 6,
    isPinnedDefault: false,
    routePath: '/app/higgsfield',
  },

  // ==========================================
  // RESEARCH & BROWSING
  // ==========================================
  research: {
    id: 'research',
    name: 'Perplexity Deep Research',
    section: 'research',
    tagline: 'Recursive Multi-Hop Research with Citation Badges',
    description:
      'Grounded fact-extraction engine. Deconstructs ambiguous topics into multi-hop queries and synthesizes reports with sentence-level citations.',
    icon: 'Search',
    badge: 'Deep Research',
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    systemPromptId: 'perplexity-deep-research',
    capabilities: ['multi_hop_research', 'web_search', 'artifacts', 'connectors'],
    defaultTools: ['deep_research', 'list_external_tools', 'tavily_web_search'],
    suggestedStarters: [
      {
        label: 'Deep market research',
        prompt: 'Conduct a multi-hop deep research report on state-of-the-art inference optimization in 2026.',
      },
      {
        label: 'Compare competitors',
        prompt: 'Research and construct an authoritative comparison matrix of vector database engines.',
      },
      {
        label: 'Verify factual claims',
        prompt: 'Synthesize verified academic findings regarding context length scaling laws with citations.',
      },
    ],
    order: 1,
    isPinnedDefault: true,
    routePath: '/app/research',
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity Research',
    section: 'research',
    tagline: 'Recursive 4-Hop Deep Research with Citation Badges',
    description:
      'Grounded fact-extraction engine. Deconstructs ambiguous topics into multi-hop queries and synthesizes reports with sentence-level citations.',
    icon: 'Search',
    badge: 'Multi-Hop',
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    systemPromptId: 'perplexity-deep-research',
    capabilities: ['multi_hop_research', 'web_search', 'artifacts', 'connectors'],
    defaultTools: ['deep_research', 'list_external_tools', 'tavily_web_search'],
    suggestedStarters: [
      {
        label: 'Deep market research',
        prompt: 'Conduct a multi-hop deep research report on state-of-the-art inference optimization in 2026.',
      },
      {
        label: 'Compare competitors',
        prompt: 'Research and construct an authoritative comparison matrix of vector database engines.',
      },
      {
        label: 'Verify factual claims',
        prompt: 'Synthesize verified academic findings regarding context length scaling laws with citations.',
      },
    ],
    order: 2,
    isPinnedDefault: true,
    routePath: '/app/perplexity',
  },
  atlas: {
    id: 'atlas',
    name: 'ChatGPT Atlas',
    section: 'research',
    tagline: 'Full-Page Web Navigation & Live Side-Chat',
    description:
      'Multi-mode web browsing and side-chat companion designed for real-time document summarization and web page scraping.',
    icon: 'Compass',
    badge: 'Web Atlas',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    systemPromptId: 'chatgpt-atlas',
    capabilities: ['web_search', 'browser_control', 'artifacts'],
    defaultTools: ['web_search'],
    suggestedStarters: [
      {
        label: 'Browse live URL',
        prompt: 'Extract key takeaways and pricing tiers from the OpenAI official announcements page.',
      },
      {
        label: 'Live web synthesis',
        prompt: 'Synthesize breaking news on renewable energy battery density breakthroughs.',
      },
    ],
    order: 2,
    isPinnedDefault: false,
    routePath: '/app/atlas',
  },
  deepsearch: {
    id: 'deepsearch',
    name: 'Brave & Deep Search',
    section: 'research',
    tagline: 'Privacy-Preserving Independent Web Index',
    description:
      'Broad, unbiased search without commercial tracking or algorithmic bias. Optimal for academic research and code snippets.',
    icon: 'Globe',
    badge: 'Clean Index',
    color: 'text-orange-600 bg-orange-600/10 border-orange-600/20',
    systemPromptId: 'brave-deepsearch',
    capabilities: ['web_search', 'artifacts'],
    defaultTools: ['web_search'],
    suggestedStarters: [
      {
        label: 'Technical documentation',
        prompt: 'Search the web for the official RFC specification on HTTP/3 connection migration.',
      },
    ],
    order: 3,
    isPinnedDefault: false,
    routePath: '/app/deepsearch',
  },
  connectors: {
    id: 'connectors',
    name: 'Connector Hub',
    section: 'research',
    tagline: 'Dynamic On-Demand MCP Tool Catalog & Cloud Integration',
    description:
      'Connects GitHub, Slack, Notion, Jira, Linear, Stripe, and PostgreSQL. Invokes external APIs on demand without prompt bloating.',
    icon: 'Plug',
    badge: 'On-Demand',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    systemPromptId: 'connector-hub',
    capabilities: ['connectors', 'code_execution', 'terminal'],
    defaultTools: ['list_external_tools', 'describe_external_tools', 'call_external_tool'],
    suggestedStarters: [
      {
        label: 'Check open PRs',
        prompt: 'Query @GitHub for all open pull requests assigned to me across our core repositories.',
      },
      {
        label: 'Query Stripe revenue',
        prompt: 'Fetch current account balance and active subscription metrics via @Stripe.',
      },
      {
        label: 'Search Notion docs',
        prompt: 'Search @Notion workspace pages for "Q1 Strategy Roadmap" and summarize key dates.',
      },
    ],
    order: 4,
    isPinnedDefault: true,
    routePath: '/app/connectors',
  },
};

export const appsRegistry = APPS_REGISTRY;
export const appSections = APP_SECTIONS;
export const DEFAULT_APP_ID = 'chat';

/**
 * Returns an array of all registered applications in catalog.
 */
export function getAllApps(): AppDefinition[] {
  return Object.values(APPS_REGISTRY).sort((a, b) => {
    if (a.section !== b.section) {
      return APP_SECTIONS[a.section].order - APP_SECTIONS[b.section].order;
    }
    return a.order - b.order;
  });
}

/**
 * Retrieves an app definition by its unique identifier (case-insensitive).
 */
export function getAppDefinition(appId?: string | null): AppDefinition | undefined {
  if (!appId) {
    return undefined;
  }
  const cleanId = appId.trim().toLowerCase();
  return APPS_REGISTRY[cleanId];
}

/**
 * Retrieves an app definition by ID, falling back to the default 'chat' app if missing.
 */
export function getRequiredAppDefinition(appId?: string | null): AppDefinition {
  return getAppDefinition(appId) || APPS_REGISTRY.chat;
}

/**
 * Returns all registered apps belonging to a given section, sorted by priority.
 */
export function listAppsBySection(section: AppSection): AppDefinition[] {
  return getAllApps().filter((app) => app.section === section);
}

/**
 * Validates whether a string corresponds to a known app identifier.
 */
export function isValidAppId(appId?: string | null): boolean {
  if (!appId) {
    return false;
  }
  const cleanId = appId.trim().toLowerCase();
  return cleanId in APPS_REGISTRY;
}

/**
 * Returns the default system application (Claude Chat).
 */
export function getDefaultApp(): AppDefinition {
  return APPS_REGISTRY.chat;
}

/**
 * Returns apps that are pinned by default for new users.
 */
export function getPinnedDefaultApps(): AppDefinition[] {
  return getAllApps().filter((app) => app.isPinnedDefault);
}

/**
 * Returns the list of all defined sections in execution order.
 */
export function getAppSections(): SectionDefinition[] {
  return Object.values(APP_SECTIONS).sort((a, b) => a.order - b.order);
}

/**
 * Searches apps across titles, taglines, descriptions, capabilities, and sections.
 */
export function searchApps(query: string): AppDefinition[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) {
    return getAllApps();
  }

  return getAllApps().filter((app) => {
    const target = [
      app.id,
      app.name,
      app.tagline,
      app.description,
      app.section,
      app.badge || '',
      ...app.capabilities,
    ]
      .join(' ')
      .toLowerCase();

    return target.includes(cleanQuery);
  });
}
