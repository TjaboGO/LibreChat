import type { FormCardData, FormCardOption, FormCardQuestion, FormCardSubmission } from './types';

export const INTERACTIVE_FORM_TOOL_NAMES = [
  'ask_user_question',
  'ask_question',
  'AskUserQuestions',
  'ask_user_questions',
  'message_ask_user',
] as const;

export function isInteractiveFormTool(toolName?: string | null): boolean {
  if (!toolName) {
    return false;
  }
  const normalized = toolName.toLowerCase().replace(/[-_]/g, '');
  return INTERACTIVE_FORM_TOOL_NAMES.some(
    (name) => name.toLowerCase().replace(/[-_]/g, '') === normalized,
  );
}

/**
 * Normalizes an option item whether it's a raw string or structured object.
 * Detects "(Recommended)" labels and tags isRecommended automatically.
 */
export function normalizeOption(raw: unknown): FormCardOption | null {
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      return null;
    }
    const isRecommended =
      /\((recommended|rekommenderas)\)/i.test(trimmed) ||
      /\[(recommended|rekommenderas)\]/i.test(trimmed);
    const cleanedLabel = trimmed
      .replace(/\s*\((recommended|rekommenderas)\)\s*/gi, '')
      .replace(/\s*\[(recommended|rekommenderas)\]\s*/gi, '')
      .trim();

    return {
      label: cleanedLabel,
      value: cleanedLabel,
      isRecommended,
    };
  }

  if (raw != null && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const rawLabel = typeof obj.label === 'string' ? obj.label.trim() : '';
    const rawValue = typeof obj.value === 'string' ? obj.value.trim() : rawLabel;
    if (!rawLabel && !rawValue) {
      return null;
    }
    const isRecommended =
      obj.isRecommended === true ||
      /\((recommended|rekommenderas)\)/i.test(rawLabel) ||
      /\[(recommended|rekommenderas)\]/i.test(rawLabel);
    const cleanedLabel = (rawLabel || rawValue)
      .replace(/\s*\((recommended|rekommenderas)\)\s*/gi, '')
      .replace(/\s*\[(recommended|rekommenderas)\]\s*/gi, '')
      .trim();

    return {
      label: cleanedLabel,
      value: rawValue || cleanedLabel,
      isRecommended,
      description: typeof obj.description === 'string' ? obj.description.trim() : undefined,
    };
  }

  return null;
}

/**
 * Normalizes arbitrary form card args (from Antigravity, v0, Manus, or LibreChat HITL)
 * into a single unified FormCardData structure.
 */
export function normalizeFormCardQuestions(raw: unknown): FormCardData | null {
  let parsed: unknown = raw;

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      return null;
    }
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      // If it's a plain string, treat as single text question
      return {
        questions: [
          {
            id: 'q_1',
            question: trimmed,
            options: [],
            isMultiSelect: false,
            allowOther: true,
          },
        ],
      };
    }
  }

  if (parsed == null || typeof parsed !== 'object') {
    return null;
  }

  const root = parsed as Record<string, unknown>;
  const title = typeof root.title === 'string' ? root.title.trim() : undefined;
  const description = typeof root.description === 'string' ? root.description.trim() : undefined;
  const actionId = typeof root.actionId === 'string' ? root.actionId : undefined;
  const submitLabel = typeof root.submitLabel === 'string' ? root.submitLabel.trim() : undefined;

  let rawQuestions: unknown[] = [];

  if (Array.isArray(root.questions)) {
    rawQuestions = root.questions;
  } else if (typeof root.question === 'string' || typeof root.text === 'string') {
    // Single question object
    rawQuestions = [root];
  }

  if (rawQuestions.length === 0) {
    return null;
  }

  const questions: FormCardQuestion[] = [];

  for (let i = 0; i < rawQuestions.length; i++) {
    const qObj = rawQuestions[i];
    if (qObj == null || typeof qObj !== 'object') {
      continue;
    }
    const q = qObj as Record<string, unknown>;
    const questionText =
      typeof q.question === 'string'
        ? q.question.trim()
        : typeof q.text === 'string'
          ? q.text.trim()
          : typeof q.prompt === 'string'
            ? q.prompt.trim()
            : '';

    if (!questionText) {
      continue;
    }

    const id =
      typeof q.id === 'string' && q.id.trim()
        ? q.id.trim()
        : `q_${i + 1}`;

    const header =
      typeof q.header === 'string'
        ? q.header.trim()
        : typeof q.category === 'string'
          ? q.category.trim()
          : undefined;

    const qDesc =
      typeof q.description === 'string'
        ? q.description.trim()
        : typeof q.context === 'string'
          ? q.context.trim()
          : undefined;

    const isMultiSelect =
      q.is_multi_select === true ||
      q.multi_select === true ||
      q.multiSelect === true;

    const allowOther = q.allow_other !== false && q.allowOther !== false;

    const rawOptions = Array.isArray(q.options) ? q.options : [];
    const options: FormCardOption[] = [];

    for (const opt of rawOptions) {
      const normalizedOpt = normalizeOption(opt);
      if (normalizedOpt) {
        options.push(normalizedOpt);
      }
    }

    questions.push({
      id,
      question: questionText,
      header,
      description: qDesc,
      options,
      isMultiSelect,
      allowOther,
    });
  }

  if (questions.length === 0) {
    return null;
  }

  return {
    title,
    description,
    questions,
    actionId,
    submitLabel,
  };
}

/**
 * Formats a user's form submission answers into a markdown string for prompt resumption.
 */
export function formatFormSubmissionResponse(
  submission: FormCardSubmission,
  form: FormCardData,
): string {
  const lines: string[] = [];
  lines.push('[Interactive Form Response]');

  for (const q of form.questions) {
    const ans = submission.answers[q.id];
    const qTitle = q.header ? `${q.header}: ${q.question}` : q.question;
    if (ans === undefined || ans === null || (Array.isArray(ans) && ans.length === 0)) {
      lines.push(`- **${qTitle}**: (Skipped / No answer)`);
    } else if (Array.isArray(ans)) {
      lines.push(`- **${qTitle}**: ${ans.join(', ')}`);
    } else {
      lines.push(`- **${qTitle}**: ${ans}`);
    }
  }

  return lines.join('\n');
}
