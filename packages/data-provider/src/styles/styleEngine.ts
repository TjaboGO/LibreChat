import type { CognitiveStyle, StyleDefinition, SlashStyleDetectionResult } from './types';

export const COGNITIVE_STYLES: Record<CognitiveStyle, StyleDefinition> = {
  default: {
    id: 'default',
    name: 'Default',
    label: 'Balanced',
    description: 'Natural, articulate, and well-balanced communication.',
    slashCommand: '/default',
    iconName: 'Sparkles',
    tag: 'Standard',
    color: 'text-text-secondary bg-surface-secondary border-border-light',
    directive: '',
  },
  concise: {
    id: 'concise',
    name: 'Concise',
    label: 'Concise (Code-First)',
    description: 'Maximum information density. Zero filler, pleasantries, or preamble.',
    slashCommand: '/concise',
    iconName: 'Zap',
    tag: 'Minimal Fluff',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    directive: `[Cognitive Output Style: CONCISE (Claude Code Persona)]
- Output with absolute maximum information density.
- Omit all conversational filler, pleasantries, apologies, and introductory meta-commentary (e.g. do NOT say "Sure!", "Here is...", "I'd be glad to help").
- Do not restate or paraphrase the user's premise.
- Answer directly in 1-3 crisp sentences, precise bullet points, or immediate executable code blocks.
- If code is requested, provide the complete, working code with minimal comments.`,
  },
  learning: {
    id: 'learning',
    name: 'Learning',
    label: 'Learning (Socratic Mentor)',
    description: 'Pedagogical step-by-step guidance, progressive disclosure, and guiding questions.',
    slashCommand: '/learning',
    iconName: 'GraduationCap',
    tag: 'Pedagogy',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    directive: `[Cognitive Output Style: LEARNING (Socratic Mentor Persona)]
- Adopt the persona of a world-class senior engineering mentor.
- Use progressive disclosure: explain the foundational "why" and underlying mechanisms before showing the code.
- Deconstruct mental models, architectural invariants, and common beginner pitfalls.
- Conclude with a thought-provoking guiding question or comprehension check to test understanding.`,
  },
  explanatory: {
    id: 'explanatory',
    name: 'Explanatory',
    label: 'Explanatory (Deep Architecture)',
    description: 'Deep conceptual breakdowns, design trade-offs, and before/after comparisons.',
    slashCommand: '/explanatory',
    iconName: 'BookOpen',
    tag: 'Deep Dive',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    directive: `[Cognitive Output Style: EXPLANATORY (Deep Architecture Breakdown)]
- Provide an exhaustive, multi-perspective conceptual exploration of the topic.
- Contrast current patterns against historical alternatives; explain the trade-offs that led to modern conventions.
- Include structured before/after comparisons, architectural diagrams where helpful, and explicit failure-mode analysis.
- Unpack edge cases, concurrency hazards, and scalability implications.`,
  },
  proactive: {
    id: 'proactive',
    name: 'Proactive',
    label: 'Proactive (Autonomous Next-Steps)',
    description: 'Anticipates unstated prerequisites, security risks, and next 3 logical moves.',
    slashCommand: '/proactive',
    iconName: 'Rocket',
    tag: 'Anticipatory',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    directive: `[Cognitive Output Style: PROACTIVE (Anticipatory Engineer)]
- Think three steps ahead of the user's immediate question.
- Proactively identify unstated prerequisites, potential security vulnerabilities, performance bottlenecks, and regressions.
- Conclude with 2-3 concrete, actionable next steps or automated suggestions ("Shall I scaffold the test suite, write the Dockerfile, or configure CI/CD?").`,
  },
};

/**
 * Detects if a user prompt starts with a cognitive style slash command
 * (e.g. "/concise Refactor this function" or "/learning How does Raft consensus work?").
 */
export function detectSlashStyle(input: string): SlashStyleDetectionResult {
  const trimmed = input.trim();
  const match = /^\/([a-z_-]+)(?:\s+([\s\S]*))?$/i.exec(trimmed);

  if (!match) {
    return {
      cleanText: input,
      detectedStyle: null,
      hadSlashCommand: false,
    };
  }

  const command = match[1].toLowerCase();
  const remainingText = match[2] ? match[2].trim() : '';

  if (command === 'concise' || command === 'terse' || command === 'brief') {
    return {
      cleanText: remainingText,
      detectedStyle: 'concise',
      hadSlashCommand: true,
    };
  }

  if (command === 'learning' || command === 'teach' || command === 'mentor' || command === 'socratic') {
    return {
      cleanText: remainingText,
      detectedStyle: 'learning',
      hadSlashCommand: true,
    };
  }

  if (command === 'explanatory' || command === 'explain' || command === 'deep' || command === 'architecture') {
    return {
      cleanText: remainingText,
      detectedStyle: 'explanatory',
      hadSlashCommand: true,
    };
  }

  if (command === 'proactive' || command === 'anticipate' || command === 'next') {
    return {
      cleanText: remainingText,
      detectedStyle: 'proactive',
      hadSlashCommand: true,
    };
  }

  if (command === 'default' || command === 'normal' || command === 'balanced') {
    return {
      cleanText: remainingText,
      detectedStyle: 'default',
      hadSlashCommand: true,
    };
  }

  // Check for "/style <name>" pattern
  if (command === 'style' || command === 'persona') {
    const subParts = remainingText.split(/\s+/);
    const subCmd = subParts[0]?.toLowerCase();
    const subRemaining = subParts.slice(1).join(' ');

    if (subCmd && subCmd in COGNITIVE_STYLES) {
      return {
        cleanText: subRemaining,
        detectedStyle: subCmd as CognitiveStyle,
        hadSlashCommand: true,
      };
    }
  }

  return {
    cleanText: input,
    detectedStyle: null,
    hadSlashCommand: false,
  };
}

/**
 * Returns the prompt directive for a given cognitive style.
 */
export function getStyleDirective(style: CognitiveStyle): string {
  const def = COGNITIVE_STYLES[style];
  return def ? def.directive : '';
}

/**
 * Injects cognitive style directive into message text if not already present.
 */
export function injectCognitiveStyle(text: string, style: CognitiveStyle): string {
  if (style === 'default') {
    return text;
  }

  const directive = getStyleDirective(style);
  if (!directive || text.includes('[Cognitive Output Style:')) {
    return text;
  }

  return `${text.trim()}\n\n${directive}`;
}
