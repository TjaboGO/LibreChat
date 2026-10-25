import { useState, memo } from 'react';
import { HelpCircle, Check, Send, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '~/utils';

export interface FormQuestion {
  id: string;
  question: string;
  options: { label: string; recommended?: boolean }[];
  isMultiSelect?: boolean;
}

export const DEMO_V0_QUESTIONS: FormQuestion[] = [
  {
    id: 'q-palette',
    question: 'What visual theme and color palette do you prefer for this dashboard?',
    options: [
      { label: 'Zinc & Slate (Modern Neutral)', recommended: true },
      { label: 'Indigo & Violet (Enterprise SaaS)' },
      { label: 'Emerald & Teal (Fresh / Fintech)' },
      { label: 'Amber & Dark Zinc (High Contrast)' },
    ],
    isMultiSelect: false,
  },
  {
    id: 'q-backend',
    question: 'Which authentication and database integration should be configured?',
    options: [
      { label: 'Supabase Auth + PostgreSQL (Recommended)', recommended: true },
      { label: 'NextAuth / Auth.js + Prisma' },
      { label: 'Neon Serverless PostgreSQL' },
      { label: 'Local In-Memory / Client State' },
    ],
    isMultiSelect: false,
  },
  {
    id: 'q-features',
    question: 'Select additional interactive UI capabilities:',
    options: [
      { label: 'Collapsible responsive sidebar', recommended: true },
      { label: 'Dark / Light mode toggle', recommended: true },
      { label: 'Export data to CSV / JSON' },
      { label: 'Real-time WebSocket notifications' },
    ],
    isMultiSelect: true,
  },
];

export interface v0AskUserQuestionsCardProps {
  className?: string;
  questions?: FormQuestion[];
  onSubmitAnswers?: (answers: Record<string, string | string[]>) => void;
}

export const v0AskUserQuestionsCard = memo(function v0AskUserQuestionsCard({
  className,
  questions = DEMO_V0_QUESTIONS,
  onSubmitAnswers,
}: v0AskUserQuestionsCardProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    'q-palette': 'Zinc & Slate (Modern Neutral)',
    'q-backend': 'Supabase Auth + PostgreSQL (Recommended)',
    'q-features': ['Collapsible responsive sidebar', 'Dark / Light mode toggle'],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (questionId: string, optionLabel: string, isMulti?: boolean) => {
    if (isSubmitted) return;
    if (isMulti) {
      setAnswers((prev) => {
        const current = (prev[questionId] as string[]) || [];
        const next = current.includes(optionLabel)
          ? current.filter((x) => x !== optionLabel)
          : [...current, optionLabel];
        return { ...prev, [questionId]: next };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: optionLabel }));
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitted(true);
    onSubmitAnswers?.(answers);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-surface-primary border border-border-medium rounded-xl shadow-md p-4 text-xs select-none space-y-4',
        className,
      )}
      data-testid="v0-ask-user-questions-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-light pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-zinc-800 text-zinc-100 font-mono font-bold text-[11px]">
            v0
          </div>
          <div>
            <h4 className="font-semibold text-text-primary text-xs flex items-center gap-1.5">
              <span>Interactive Clarification Card</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-text-secondary border border-border-light">
                AskUserQuestions
              </span>
            </h4>
            <p className="text-[11px] text-text-secondary">
              v0 needs a few decisions to tailor your React 19 UI component
            </p>
          </div>
        </div>

        {isSubmitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-text-primary transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {questions.map((q) => {
          const currentAnswer = answers[q.id];
          return (
            <div key={q.id} className="space-y-2">
              <span className="font-semibold text-text-primary text-xs flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{q.question}</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5">
                {q.options.map((opt) => {
                  const isSelected = q.isMultiSelect
                    ? ((currentAnswer as string[]) || []).includes(opt.label)
                    : currentAnswer === opt.label;

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, opt.label, q.isMultiSelect)}
                      className={cn(
                        'flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg border text-[11px] transition-all',
                        isSelected
                          ? 'border-zinc-800 dark:border-zinc-200 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium shadow-xs'
                          : 'border-border-light bg-surface-secondary/40 text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
                        isSubmitted && 'cursor-default opacity-85',
                      )}
                    >
                      <div className="flex items-center gap-1.5 truncate pr-1">
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isSelected ? (
                        <Check className="w-3 h-3 shrink-0" />
                      ) : opt.recommended ? (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-500/10 text-zinc-400 shrink-0">
                          Rec
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Footer */}
      <div className="pt-2 border-t border-border-light flex items-center justify-between">
        <span className="text-[11px] text-text-secondary">
          {isSubmitted ? '✓ Answers submitted to v0' : 'Select options and submit to resume generation'}
        </span>

        {isSubmitted ? (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium text-xs border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Answers Recorded</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-medium text-xs transition-colors shadow-sm"
            data-testid="v0-submit-answers-btn"
          >
            <span>Submit Answers to v0</span>
            <Send className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
});

export default v0AskUserQuestionsCard;
