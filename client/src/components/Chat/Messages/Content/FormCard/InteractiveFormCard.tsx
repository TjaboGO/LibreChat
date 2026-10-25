/* eslint-disable i18next/no-literal-string */
import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { formatFormSubmissionResponse, normalizeFormCardQuestions } from 'librechat-data-provider';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Send,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { FormCardData, FormCardOption, FormCardQuestion, FormCardSubmission } from 'librechat-data-provider';
import { ChatContext } from '~/Providers/ChatContext';
import { cn } from '~/utils';

export interface InteractiveFormCardProps {
  data?: FormCardData | null;
  rawArgs?: unknown;
  actionId?: string;
  isSubmitting?: boolean;
  onSubmit?: (submission: FormCardSubmission) => void;
  onSkip?: () => void;
  submittedAnswers?: Record<string, string | string[]>;
}

function InteractiveFormCard({
  data: propData,
  rawArgs,
  actionId: propActionId,
  isSubmitting = false,
  onSubmit,
  onSkip,
  submittedAnswers: initialSubmittedAnswers,
}: InteractiveFormCardProps) {
  const chatContext = useContext(ChatContext);

  const form: FormCardData | null = useMemo(() => {
    if (propData) {
      return propData;
    }
    if (rawArgs) {
      return normalizeFormCardQuestions(rawArgs);
    }
    return null;
  }, [propData, rawArgs]);

  const effectiveActionId = propActionId || form?.actionId;

  // Selected options map: { [questionId]: string[] }
  const [selectedMap, setSelectedMap] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    if (form && form.questions) {
      for (const q of form.questions) {
        // Pre-select recommended option by default for faster developer flow
        const recommended = q.options.find((opt) => opt.isRecommended);
        if (recommended && !q.isMultiSelect) {
          initial[q.id] = [recommended.value];
        } else {
          initial[q.id] = [];
        }
      }
    }
    return initial;
  });

  // Custom text answers map (for "Other / Annat")
  const [customTextMap, setCustomTextMap] = useState<Record<string, string>>({});
  const [activeOtherQuestionId, setActiveOtherQuestionId] = useState<string | null>(null);

  // Submitted state
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string | string[]> | null>(
    initialSubmittedAnswers ?? null,
  );

  const handleToggleOption = useCallback((question: FormCardQuestion, option: FormCardOption) => {
    setSelectedMap((prev) => {
      const current = prev[question.id] || [];
      const isAlreadySelected = current.includes(option.value);

      if (question.isMultiSelect) {
        const next = isAlreadySelected
          ? current.filter((val) => val !== option.value)
          : [...current, option.value];
        return { ...prev, [question.id]: next };
      } else {
        // Single select toggles or selects
        return { ...prev, [question.id]: [option.value] };
      }
    });
  }, []);

  const handleCustomTextChange = useCallback((questionId: string, text: string) => {
    setCustomTextMap((prev) => ({ ...prev, [questionId]: text }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form) {
      return;
    }

    const answers: Record<string, string | string[]> = {};

    for (const q of form.questions) {
      const selected = selectedMap[q.id] || [];
      const custom = (customTextMap[q.id] || '').trim();

      if (q.isMultiSelect) {
        const combined = [...selected];
        if (custom) {
          combined.push(custom);
        }
        answers[q.id] = combined;
      } else {
        answers[q.id] = custom || selected[0] || '';
      }
    }

    const submission: FormCardSubmission = {
      actionId: effectiveActionId,
      answers,
      submittedAt: new Date().toISOString(),
    };

    setSubmittedAnswers(answers);

    if (onSubmit) {
      onSubmit(submission);
    } else if (chatContext?.ask) {
      // Send directly into the conversation stream
      const formattedText = formatFormSubmissionResponse(submission, form);
      chatContext.ask({ text: formattedText });
    }
  }, [form, selectedMap, customTextMap, effectiveActionId, onSubmit, chatContext]);

  const handleSkip = useCallback(() => {
    if (!form) {
      return;
    }
    const answers: Record<string, string | string[]> = {};
    for (const q of form.questions) {
      answers[q.id] = '(Skipped)';
    }
    const submission: FormCardSubmission = {
      actionId: effectiveActionId,
      answers,
      submittedAt: new Date().toISOString(),
    };
    setSubmittedAnswers(answers);
    if (onSkip) {
      onSkip();
    } else if (onSubmit) {
      onSubmit(submission);
    } else if (chatContext?.ask) {
      chatContext.ask({ text: '[User skipped form decisions. Proceed with recommended defaults.]' });
    }
  }, [form, effectiveActionId, onSkip, onSubmit, chatContext]);

  if (!form || !form.questions || form.questions.length === 0) {
    return null;
  }

  const isCompleted = submittedAnswers !== null;

  return (
    <div
      data-testid="interactive-form-card"
      className={cn(
        'my-3.5 flex w-full flex-col overflow-hidden rounded-2xl border border-border-light/80 bg-surface-primary dark:bg-surface-secondary/50',
        'shadow-sm transition-all duration-200 hover:shadow-md',
        isCompleted && 'border-green-500/30 bg-green-500/[0.02]',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-light/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            {isCompleted ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Sparkles className="h-4 w-4" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary">
              {form.title || 'Clarification & Choices'}
            </h4>
            {form.description && (
              <p className="text-xs text-text-secondary">{form.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-[11px] font-medium text-green-600 dark:text-green-400">
              <Check className="h-3 w-3" />
              <span>Answers Submitted</span>
            </span>
          ) : (
            <span className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-[11px] font-medium text-text-tertiary">
              {form.questions.length} {form.questions.length === 1 ? 'question' : 'questions'}
            </span>
          )}
        </div>
      </div>

      {/* Questions Body */}
      <div className="flex flex-col gap-5 p-4">
        {form.questions.map((question, qIdx) => {
          const selected = isCompleted
            ? Array.isArray(submittedAnswers[question.id])
              ? (submittedAnswers[question.id] as string[])
              : [submittedAnswers[question.id] as string]
            : selectedMap[question.id] || [];

          const customAnswer = isCompleted
            ? ''
            : customTextMap[question.id] || '';

          return (
            <div
              key={question.id}
              data-testid={`form-question-${question.id}`}
              className="flex flex-col gap-2.5"
            >
              {/* Question Header & Title */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  {question.header && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                      {question.header}
                    </span>
                  )}
                  <p className="text-sm font-medium text-text-primary">
                    <span className="mr-1.5 font-semibold text-text-tertiary">
                      {qIdx + 1}.
                    </span>
                    {question.question}
                  </p>
                  {question.description && (
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {question.description}
                    </p>
                  )}
                </div>
                {question.isMultiSelect && !isCompleted && (
                  <span className="shrink-0 rounded bg-surface-secondary px-1.5 py-0.5 text-[10px] text-text-tertiary">
                    Multi-select
                  </span>
                )}
              </div>

              {/* Options Grid */}
              {question.options.length > 0 && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const isChecked = selected.includes(option.value);

                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={isCompleted || isSubmitting}
                        onClick={() => handleToggleOption(question, option)}
                        className={cn(
                          'group relative flex items-center justify-between rounded-xl border p-2.5 text-left transition-all',
                          isChecked
                            ? 'border-purple-500 bg-purple-500/[0.06] shadow-sm dark:border-purple-400 dark:bg-purple-500/10'
                            : 'border-border-light/70 bg-surface-secondary/40 hover:border-border-light hover:bg-surface-secondary',
                          (isCompleted || isSubmitting) && 'cursor-default opacity-85',
                        )}
                      >
                        <div className="flex flex-1 items-center gap-2.5 pr-2">
                          {/* Radio/Checkbox indicator */}
                          <div
                            className={cn(
                              'flex h-4 w-4 shrink-0 items-center justify-center border transition-all',
                              question.isMultiSelect ? 'rounded' : 'rounded-full',
                              isChecked
                                ? 'border-purple-500 bg-purple-500 text-white dark:border-purple-400 dark:bg-purple-400'
                                : 'border-border-light/90 bg-surface-primary',
                            )}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-text-primary">
                              {option.label}
                            </span>
                            {option.description && (
                              <span className="text-[10px] text-text-tertiary">
                                {option.description}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Recommended Badge */}
                        {option.isRecommended && (
                          <span className="shrink-0 rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-semibold text-purple-600 dark:bg-purple-400/15 dark:text-purple-300">
                            ✦ Recommended
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Custom 'Other' Answer field */}
              {question.allowOther && !isCompleted && (
                <div className="mt-1">
                  {activeOtherQuestionId === question.id || customAnswer ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type custom answer or notes..."
                        value={customAnswer}
                        onChange={(e) => handleCustomTextChange(question.id, e.target.value)}
                        className="w-full rounded-xl border border-border-light bg-surface-secondary/60 px-3 py-1.5 text-xs text-text-primary placeholder-text-tertiary focus:border-text-primary focus:outline-none"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveOtherQuestionId(question.id)}
                      className="text-[11px] text-text-tertiary transition-colors hover:text-text-primary hover:underline"
                    >
                      + Write custom answer
                    </button>
                  )}
                </div>
              )}

              {/* If completed, show custom answer if present */}
              {isCompleted && submittedAnswers[question.id] && (
                <div className="text-xs text-text-secondary">
                  <span className="font-medium text-text-tertiary">Selected: </span>
                  <span className="font-semibold text-text-primary">
                    {Array.isArray(submittedAnswers[question.id])
                      ? (submittedAnswers[question.id] as string[]).join(', ')
                      : submittedAnswers[question.id]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions Footer */}
      {!isCompleted && (
        <div className="flex items-center justify-between border-t border-border-light/50 bg-surface-secondary/20 px-4 py-2.5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSkip}
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-text-tertiary transition-colors hover:text-text-primary"
          >
            Skip & Use Defaults
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className={cn(
              'flex items-center gap-1.5 rounded-xl bg-text-primary px-4 py-1.5 text-xs font-medium text-surface-primary transition-opacity',
              'hover:opacity-90 disabled:opacity-50',
            )}
          >
            <span>{form.submitLabel || 'Submit Answers'}</span>
            <Send className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(InteractiveFormCard);
