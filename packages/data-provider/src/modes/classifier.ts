import type {
  ModeClassificationResult,
  ModeConfidence,
  ResolvedEngineMode,
} from './types';

export const SPEC_MODE_DIRECTIVE = `
[Engine Mode: SPEC MODE (Architect & Plan)]
You are operating in SPEC MODE (inspired by Kiro and Traycer AI lead architect discipline).
1. READ-ONLY ARCHITECT DISCIPLINE: Do NOT write full implementation code or make premature file modifications yet.
2. FORMAL SPECIFICATION: Focus on producing a clear, rigorous specification containing:
   - Problem Statement & Requirements
   - Architecture, Data Models & Interface Contracts
   - Acceptance Criteria & TDD Test Plan
   - Phased Implementation Tasks (- [ ] task checklist)
3. VERIFICATION FIRST: Outline exact edge cases, validation rules, and testing strategies before any code is generated.
4. GATE: Ask for user confirmation on the specification before progressing to execution.
`.trim();

export const VIBE_MODE_DIRECTIVE = `
[Engine Mode: VIBE MODE (Rapid Flow & Execution)]
You are operating in VIBE MODE (inspired by Kiro rapid prototyping and developer flow).
1. RAPID EXECUTION DISCIPLINE: Build working, runnable implementations directly without unnecessary bureaucracy.
2. SHOW, DON'T TELL: Write clean, idiomatic code directly to files or artifacts. Focus on high velocity and instant visual or functional feedback.
3. MINIMAL BOILERPLATE: Write the absolute minimal amount of code needed to achieve the requirement immediately and correctly.
4. RUNNABLE OUT OF THE BOX: Ensure all code, components, and scripts can execute immediately without syntax errors.
`.trim();

export const MODE_CLASSIFIER_PROMPT = `
You are an intent classifier for a language model.
Your job is to classify the user's intent based on their conversation history into one of two main categories:
1. Do mode / Vibe mode (default for most requests)
2. Spec mode (only for specific specification/planning requests)

Return ONLY a JSON object with 3 properties (chat, do, spec) representing your confidence in each category. The values must always sum to 1.

### Category Definitions
1. Do mode / Vibe mode (DEFAULT CHOICE):
- Modifies code or files in the workspace
- Imperative sentences asking for direct action ("Write", "Create", "Build", "Fix", "Refactor")
- Requests to run commands, create components, or make changes
- General queries or questions
- When in doubt, ALWAYS choose Do/Vibe mode.

2. Spec mode (ONLY for formal specification requests):
- Asks to create a formal specification or requirements document
- Uses words like "spec", "specification", "kravspec", "TDD plan", "architecture plan"
- Involves executing or referencing tasks from an existing spec (e.g. "Execute task 2 from spec", "Start next task")

Format: {"chat": 0.05, "do": 0.85, "spec": 0.10}
`.trim();

// Regex patterns for Spec Mode detection
const SPEC_PATTERNS = [
  /\b(create|write|generate|draft|design|skapa|skriv|ta fram)\b.*\b(spec|specification|kravspec|kravspecifikation|requirements? (doc|document)|architecture (doc|plan)|tdd plan)\b/i,
  /\b(spec mode|plan mode|formal spec|requirements doc|tdd test plan|acceptance criteria checklist)\b/i,
  /\b(execute|run|start|utför|kör)\b.*\b(task|deluppgift|uppgift)\s*(\d+(\.\d+)?|\bnext\b)/i,
  /\b(what is the next task in the|vad är nästa task i|nästa deluppgift)\b/i,
  /^\s*(task|uppgift)\s*\d+(\.\d+)?\b/i,
  /\b(skapa|skriv)\b.*\b(en|ett)?\s*(spec|kravspec|arkitekturdokument)\b/i,
];

// Regex patterns for Vibe/Do Mode detection
const VIBE_PATTERNS = [
  /\b(write|create|build|implement|fix|refactor|add|make|generate|produce)\b.*\b(code|function|component|button|screen|page|api|file|script|hook|service|app)\b/i,
  /\b(skapa|bygg|koda|laga|fixa|ändra|lägg till)\b.*\b(kod|funktion|komponent|knapp|sida|vy|fil|skript)\b/i,
  /\b(quick prototype|fast prototype|vibe|just build it|hack|snabb prototyp|släng ihop|gör bara)\b/i,
  /\b(run dev|start dev|preview|animering|animation|tailwind|layout|css|ui)\b/i,
  /\b(show me the code|ge mig koden|implementera direkt)\b/i,
];

/**
 * Fast synchronous intent classifier evaluating user prompt and context.
 * Strictly adheres to Kiro's "When in doubt, classify as Do/Vibe" principle.
 */
export function classifyIntent(
  text: string,
  history?: Array<{ role: string; content: string }>,
): ModeClassificationResult {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return {
      mode: 'vibe',
      confidence: { spec: 0.1, vibe: 0.8, chat: 0.1 },
      reasoning: 'Empty input defaults to Vibe mode.',
      isAuto: true,
    };
  }

  let specScore = 0;
  let vibeScore = 0;

  for (const pattern of SPEC_PATTERNS) {
    if (pattern.test(trimmed)) {
      specScore += 3.5;
    }
  }

  for (const pattern of VIBE_PATTERNS) {
    if (pattern.test(trimmed)) {
      vibeScore += 2.0;
    }
  }

  // Check recent history context for spec continuity (e.g. user answering task followups)
  if (history && history.length > 0) {
    const lastAssistantMsg = [...history].reverse().find((m) => m.role === 'assistant');
    if (lastAssistantMsg && /\[Engine Mode: SPEC MODE\]|### Tasks|Task \d+/i.test(lastAssistantMsg.content)) {
      if (/^(yes|ja|ok|next|nästa|task \d+|proceed|fortsätt)/i.test(trimmed)) {
        specScore += 2.5;
      }
    }
  }

  // Explicit spec keyword isolated mention
  if (/\b(spec|kravspec)\b/i.test(trimmed) && !/\b(inspection|spectacle|species)\b/i.test(trimmed)) {
    specScore += 1.0;
  }

  // Base normalization
  let total = specScore + vibeScore;
  let confidence: ModeConfidence;
  let resolvedMode: ResolvedEngineMode;
  let reasoning: string;

  if (specScore >= 3.0 && specScore > vibeScore) {
    resolvedMode = 'spec';
    const specConf = Math.min(0.92, 0.6 + specScore * 0.05);
    const remaining = 1 - specConf;
    confidence = {
      spec: Number(specConf.toFixed(2)),
      vibe: Number((remaining * 0.7).toFixed(2)),
      chat: Number((remaining * 0.3).toFixed(2)),
    };
    reasoning = 'Prompt explicitly requests formal specification, architecture planning, or spec-task execution.';
  } else {
    resolvedMode = 'vibe';
    const vibeConf = Math.min(0.95, 0.7 + vibeScore * 0.05);
    const remaining = 1 - vibeConf;
    confidence = {
      spec: Number((remaining * 0.3).toFixed(2)),
      vibe: Number(vibeConf.toFixed(2)),
      chat: Number((remaining * 0.7).toFixed(2)),
    };
    reasoning =
      specScore > 0
        ? 'Prompt mentions planning keywords but defaults to rapid execution (Do/Vibe) per default bias.'
        : 'Prompt requests direct action, coding, or prototyping.';
  }

  // Extract suggested tasks if present in text
  const taskMatches = trimmed.match(/task\s+(\d+(\.\d+)?)/gi);
  const suggestedTasks = taskMatches ? taskMatches.map((t) => t.trim()) : undefined;

  return {
    mode: resolvedMode,
    confidence,
    reasoning,
    isAuto: true,
    suggestedTasks,
  };
}

/**
 * Returns the prompt directive to inject into the user prompt or system messages.
 */
export function getModeDirective(mode: ResolvedEngineMode): string {
  return mode === 'spec' ? SPEC_MODE_DIRECTIVE : VIBE_MODE_DIRECTIVE;
}
