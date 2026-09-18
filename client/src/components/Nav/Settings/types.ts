import { createElement } from 'react';
import { DataIcon, SpeechIcon } from '@librechat/client';
import { SettingsTabValues } from 'librechat-data-provider';
import {
  SlidersHorizontal,
  User,
  ShieldCheck,
  CreditCard,
  Wrench,
  Brain,
  Palette,
  Terminal,
  FolderSync,
  Globe,
  Monitor,
  Puzzle,
  Code2,
  Sparkles,
  Plug,
  Package,
  Info,
  MessageSquare,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import type { TranslationKeys } from '~/hooks';
import {
  PreferencesTab,
  AccountTab,
  PrivacyTab,
  BillingApiTab,
  PlaceholderTab,
  CapabilitiesTab,
  MemoryTab,
  SkillsTab,
  ConnectorsTab,
} from '../SettingsTabs/Claude';
import LangfuseConnection from '../SettingsTabs/Integrations/LangfuseConnection';
import About from '../SettingsTabs/About/About';

export type SettingsGroup = 'settings' | 'desktop' | 'customize';

export enum ClaudeSettingsTab {
  PREFERENCES = 'preferences',
  ACCOUNT = 'account',
  PRIVACY = 'privacy',
  BILLING = 'billing',
  CAPABILITIES = 'capabilities',
  MEMORY = 'memory',
  DESIGN_SYSTEMS = 'design_systems',
  CLAUDE_CODE = 'claude_code',
  COWORK = 'cowork',
  CHROME = 'chrome',
  GENERAL = 'general',
  EXTENSIONS = 'extensions',
  DEVELOPER = 'developer',
  SKILLS = 'skills',
  CONNECTORS = 'connectors',
  PLUGINS = 'plugins',
  ABOUT = 'about',
  LANGFUSE = 'langfuse',
}

export type SettingsTab =
  | ClaudeSettingsTab
  | SettingsTabValues.GENERAL
  | SettingsTabValues.CHAT
  | SettingsTabValues.SPEECH
  | SettingsTabValues.LANGFUSE
  | SettingsTabValues.DATA
  | SettingsTabValues.ACCOUNT
  | SettingsTabValues.ABOUT
  | string;

export type SectionId =
  | 'appearance'
  | 'layout'
  | 'accessibility'
  | 'admin'
  | 'sending'
  | 'commands'
  | 'messages'
  | 'conversations'
  | 'prompts'
  | 'stt'
  | 'tts'
  | 'memory'
  | 'codeExecution'
  | 'data'
  | 'apiKeys'
  | 'langfuse'
  | 'danger'
  | 'profile'
  | 'security'
  | 'billing'
  | 'about';

export interface SettingsContextValue {
  balanceEnabled: boolean;
  hasAnyPersonalizationFeature: boolean;
  hasMemoryOptOut: boolean;
  hasStatefulCodeSessions: boolean;
  hasRemoteAgents: boolean;
  hasUserProvidedEndpoints: boolean;
  hasMultiConvo: boolean;
  hasPrompts: boolean;
  isLocalProvider: boolean;
  twoFactorEnabled: boolean;
  allowAccountDeletion: boolean;
  aboutEnabled: boolean;
  engineTTS: string;
  langfuseConnectionAccess: boolean;
  adminPanelURL: string;
}

export interface SettingEntry {
  id: string;
  tab: SettingsTab;
  section: SectionId;
  labelKey: TranslationKeys;
  keywords?: string[];
  Component: ComponentType;
  show?: (ctx: SettingsContextValue) => boolean;
}

export interface SectionMeta {
  id: SectionId;
  labelKey: TranslationKeys;
  icon?: ReactNode;
  danger?: boolean;
}

export interface TabMeta {
  id: SettingsTab;
  group?: SettingsGroup;
  labelKey: TranslationKeys;
  icon: ReactNode;
  sections: SectionMeta[];
  Component?: ComponentType;
  show?: (ctx: SettingsContextValue) => boolean;
}

function createLangfuseIcon(className: string): ReactNode {
  return createElement('span', {
    className: `${className} inline-block shrink-0 bg-current`,
    'aria-hidden': true,
    style: {
      WebkitMask: 'url(/assets/langfuse-icon-monochrome.svg) center / contain no-repeat',
      mask: 'url(/assets/langfuse-icon-monochrome.svg) center / contain no-repeat',
    },
  });
}

export const TABS: TabMeta[] = [
  // --- GROUP 1: SETTINGS ---
  {
    id: ClaudeSettingsTab.PREFERENCES,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_preferences' as TranslationKeys,
    icon: createElement(SlidersHorizontal, { className: 'h-4 w-4' }),
    Component: PreferencesTab,
    sections: [
      { id: 'appearance', labelKey: 'com_ui_settings_section_appearance' as TranslationKeys },
    ],
  },
  {
    id: ClaudeSettingsTab.ACCOUNT,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_account' as TranslationKeys,
    icon: createElement(User, { className: 'h-4 w-4' }),
    Component: AccountTab,
    sections: [
      { id: 'profile', labelKey: 'com_ui_settings_section_profile' as TranslationKeys },
      { id: 'security', labelKey: 'com_ui_settings_section_security' as TranslationKeys },
      { id: 'billing', labelKey: 'com_ui_settings_section_billing' as TranslationKeys },
      {
        id: 'danger',
        labelKey: 'com_ui_settings_section_danger_zone' as TranslationKeys,
        danger: true,
      },
    ],
  },
  {
    id: ClaudeSettingsTab.PRIVACY,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_privacy' as TranslationKeys,
    icon: createElement(ShieldCheck, { className: 'h-4 w-4' }),
    Component: PrivacyTab,
    sections: [{ id: 'security', labelKey: 'com_ui_settings_section_security' as TranslationKeys }],
  },
  {
    id: ClaudeSettingsTab.BILLING,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_billing' as TranslationKeys,
    icon: createElement(CreditCard, { className: 'h-4 w-4' }),
    Component: BillingApiTab,
    sections: [{ id: 'billing', labelKey: 'com_ui_settings_section_billing' as TranslationKeys }],
  },
  {
    id: ClaudeSettingsTab.CAPABILITIES,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_capabilities' as TranslationKeys,
    icon: createElement(Wrench, { className: 'h-4 w-4' }),
    Component: CapabilitiesTab,
    sections: [
      {
        id: 'codeExecution',
        labelKey: 'com_ui_settings_section_code_execution' as TranslationKeys,
      },
    ],
  },
  {
    id: ClaudeSettingsTab.MEMORY,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_memory' as TranslationKeys,
    icon: createElement(Brain, { className: 'h-4 w-4' }),
    Component: MemoryTab,
    sections: [{ id: 'memory', labelKey: 'com_ui_settings_section_memory' as TranslationKeys }],
  },
  {
    id: ClaudeSettingsTab.DESIGN_SYSTEMS,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_design_systems' as TranslationKeys,
    icon: createElement(Palette, { className: 'h-4 w-4' }),
    Component: () =>
      createElement(PlaceholderTab, {
        title: 'Design systems',
        description: 'Figma tokens, component systems, and design palettes.',
        phase: 'Fas 8',
        icon: Palette,
        features: [
          'Create design systems using Claude or Claude Code',
          'Design token sync with Figma/GitHub',
        ],
      }),
    sections: [],
  },
  {
    id: ClaudeSettingsTab.CLAUDE_CODE,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_claude_code' as TranslationKeys,
    icon: createElement(Terminal, { className: 'h-4 w-4' }),
    Component: () =>
      createElement(PlaceholderTab, {
        title: 'Claude Code',
        description: 'Terminal routines, cloud sessions, and worktree tracking.',
        phase: 'Fas 9',
        icon: Terminal,
        features: [
          'Cloud session management',
          'Routines & scheduled background runs',
          'Worktree and branch context chips',
        ],
      }),
    sections: [],
  },
  {
    id: ClaudeSettingsTab.COWORK,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_cowork' as TranslationKeys,
    icon: createElement(FolderSync, { className: 'h-4 w-4' }),
    Component: () =>
      createElement(PlaceholderTab, {
        title: 'Cowork',
        description: 'Trusted local folders and multi-agent workspaces.',
        phase: 'Fas 7',
        icon: FolderSync,
        features: [
          'Require trusted devices',
          'Cowork files directory configuration',
          'Trusted Cowork folders',
          'Preferred browser automation setup',
        ],
      }),
    sections: [],
  },
  {
    id: ClaudeSettingsTab.CHROME,
    group: 'settings',
    labelKey: 'com_ui_settings_tab_chrome' as TranslationKeys,
    icon: createElement(Globe, { className: 'h-4 w-4' }),
    Component: () =>
      createElement(PlaceholderTab, {
        title: 'Claude in Chrome',
        description: 'Browser companion extension for web research.',
        phase: 'Fas 7',
        icon: Globe,
        features: [
          'Browser tab interaction and reading',
          'Companion page context sync',
          'Live search augmentation',
        ],
      }),
    sections: [],
  },

  // --- GROUP 2: DESKTOP APP ---
  {
    id: ClaudeSettingsTab.GENERAL,
    group: 'desktop',
    labelKey: 'com_ui_settings_tab_general' as TranslationKeys,
    icon: createElement(Monitor, { className: 'h-4 w-4' }),
    Component: () =>
      createElement(PlaceholderTab, {
        title: 'General',
        description: 'Desktop application configuration.',
        phase: 'Fas 7',
        icon: Monitor,
        features: [
          'Default startup workspace',
          'Notification sounds & badge counts',
          'Hardware acceleration and cache',
        ],
      }),
    sections: [
      { id: 'appearance', labelKey: 'com_ui_settings_section_appearance' as TranslationKeys },
      { id: 'layout', labelKey: 'com_ui_settings_section_layout' as TranslationKeys },
      { id: 'accessibility', labelKey: 'com_ui_settings_section_accessibility' as TranslationKeys },
      { id: 'admin', labelKey: 'com_ui_settings_section_admin' as TranslationKeys },
    ],
  },
  {
    id: ClaudeSettingsTab.EXTENSIONS,
    group: 'desktop',
    labelKey: 'com_ui_settings_tab_extensions' as TranslationKeys,
    icon: createElement(Puzzle, { className: 'h-4 w-4' }),
    Component: () =>
      createElement(PlaceholderTab, {
        title: 'Extensions',
        description: 'Installed local extensions and runtime connectors.',
        phase: 'Fas 8',
        icon: Puzzle,
        features: ['Local extension manager', 'Permissions & sandbox configuration'],
      }),
    sections: [],
  },
  {
    id: ClaudeSettingsTab.DEVELOPER,
    group: 'desktop',
    labelKey: 'com_ui_settings_tab_developer' as TranslationKeys,
    icon: createElement(Code2, { className: 'h-4 w-4' }),
    Component: () =>
      createElement(PlaceholderTab, {
        title: 'Developer',
        description: 'Local MCP servers and debug tools.',
        phase: 'Fas 8',
        icon: Code2,
        features: [
          'Local MCP server discovery & inspection',
          'Debug diagnostics and raw request logs',
        ],
      }),
    sections: [],
  },
  {
    id: ClaudeSettingsTab.ABOUT,
    group: 'desktop',
    labelKey: 'com_nav_setting_about' as TranslationKeys,
    icon: createElement(Info, { className: 'h-4 w-4', 'aria-hidden': true }),
    Component: About,
    sections: [{ id: 'about', labelKey: 'com_nav_setting_about' as TranslationKeys }],
    show: (ctx) => ctx.aboutEnabled,
  },

  // --- GROUP 3: CUSTOMIZE ---
  {
    id: ClaudeSettingsTab.SKILLS,
    group: 'customize',
    labelKey: 'com_ui_settings_tab_skills' as TranslationKeys,
    icon: createElement(Sparkles, { className: 'h-4 w-4' }),
    Component: SkillsTab,
    sections: [],
  },
  {
    id: ClaudeSettingsTab.CONNECTORS,
    group: 'customize',
    labelKey: 'com_ui_settings_tab_connectors' as TranslationKeys,
    icon: createElement(Plug, { className: 'h-4 w-4' }),
    Component: ConnectorsTab,
    sections: [],
  },
  {
    id: ClaudeSettingsTab.PLUGINS,
    group: 'customize',
    labelKey: 'com_ui_settings_tab_plugins' as TranslationKeys,
    icon: createElement(Package, { className: 'h-4 w-4' }),
    Component: () =>
      createElement(PlaceholderTab, {
        title: 'Plugins',
        description: 'Integrated tool bundles and extensions.',
        phase: 'Fas 8',
        icon: Package,
        features: ['Discover and install plugins', 'Bundled connector + skill packs'],
      }),
    sections: [],
  },
  {
    id: ClaudeSettingsTab.LANGFUSE,
    group: 'customize',
    labelKey: 'com_ui_settings_tab_langfuse' as TranslationKeys,
    icon: createLangfuseIcon('h-4 w-4'),
    Component: LangfuseConnection,
    sections: [
      {
        id: 'langfuse',
        labelKey: 'com_ui_settings_section_langfuse' as TranslationKeys,
        icon: createLangfuseIcon('h-3.5 w-3.5'),
      },
    ],
    show: (ctx) => ctx.langfuseConnectionAccess,
  },

  // --- REGISTRY / SEARCH INDEX COMPATIBILITY ---
  {
    id: SettingsTabValues.CHAT,
    labelKey: 'com_nav_setting_chat' as TranslationKeys,
    icon: createElement(MessageSquare, { className: 'h-4 w-4', 'aria-hidden': true }),
    sections: [
      { id: 'sending', labelKey: 'com_ui_settings_section_sending' as TranslationKeys },
      { id: 'commands', labelKey: 'com_ui_settings_section_commands' as TranslationKeys },
      { id: 'messages', labelKey: 'com_ui_settings_section_messages' as TranslationKeys },
      { id: 'conversations', labelKey: 'com_ui_settings_section_conversations' as TranslationKeys },
      { id: 'prompts', labelKey: 'com_ui_settings_section_prompts' as TranslationKeys },
    ],
    show: () => false,
  },
  {
    id: SettingsTabValues.SPEECH,
    labelKey: 'com_nav_setting_speech' as TranslationKeys,
    icon: createElement(SpeechIcon, { className: 'h-4 w-4' }),
    sections: [
      { id: 'stt', labelKey: 'com_ui_settings_section_stt' as TranslationKeys },
      { id: 'tts', labelKey: 'com_ui_settings_section_tts' as TranslationKeys },
    ],
    show: () => false,
  },
  {
    id: SettingsTabValues.DATA,
    labelKey: 'com_ui_settings_tab_data' as TranslationKeys,
    icon: createElement(DataIcon),
    sections: [
      { id: 'memory', labelKey: 'com_ui_settings_section_memory' as TranslationKeys },
      {
        id: 'codeExecution',
        labelKey: 'com_ui_settings_section_code_execution' as TranslationKeys,
      },
      { id: 'data', labelKey: 'com_ui_settings_section_data' as TranslationKeys },
      { id: 'apiKeys', labelKey: 'com_ui_settings_section_api_keys' as TranslationKeys },
      {
        id: 'danger',
        labelKey: 'com_ui_settings_section_danger_zone' as TranslationKeys,
        danger: true,
      },
    ],
    show: () => false,
  },
];
