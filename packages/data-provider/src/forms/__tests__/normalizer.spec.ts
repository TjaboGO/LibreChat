import type { FormCardData, FormCardSubmission } from '../types';
import {
  formatFormSubmissionResponse,
  isInteractiveFormTool,
  normalizeFormCardQuestions,
  normalizeOption,
} from '../normalizer';

describe('Interactive Form Cards Normalizer', () => {
  describe('isInteractiveFormTool', () => {
    it('recognizes all supported form card tool variations', () => {
      expect(isInteractiveFormTool('ask_user_question')).toBe(true);
      expect(isInteractiveFormTool('ask_question')).toBe(true);
      expect(isInteractiveFormTool('AskUserQuestions')).toBe(true);
      expect(isInteractiveFormTool('ask_user_questions')).toBe(true);
      expect(isInteractiveFormTool('message_ask_user')).toBe(true);
    });

    it('returns false for non-form tools or undefined', () => {
      expect(isInteractiveFormTool('file_write')).toBe(false);
      expect(isInteractiveFormTool('search_web')).toBe(false);
      expect(isInteractiveFormTool(undefined)).toBe(false);
      expect(isInteractiveFormTool(null)).toBe(false);
    });
  });

  describe('normalizeOption', () => {
    it('normalizes raw string and detects (Recommended) tag', () => {
      const opt = normalizeOption('PostgreSQL (Recommended)');
      expect(opt).not.toBeNull();
      expect(opt?.label).toBe('PostgreSQL');
      expect(opt?.value).toBe('PostgreSQL');
      expect(opt?.isRecommended).toBe(true);
    });

    it('normalizes raw string with Swedish (Rekommenderas)', () => {
      const opt = normalizeOption('Tailwind CSS (Rekommenderas)');
      expect(opt).not.toBeNull();
      expect(opt?.label).toBe('Tailwind CSS');
      expect(opt?.isRecommended).toBe(true);
    });

    it('normalizes plain string without recommended tag', () => {
      const opt = normalizeOption('MongoDB');
      expect(opt).not.toBeNull();
      expect(opt?.label).toBe('MongoDB');
      expect(opt?.isRecommended).toBe(false);
    });

    it('normalizes object with label and value', () => {
      const opt = normalizeOption({ label: 'Vite', value: 'vite_builder', isRecommended: true });
      expect(opt).not.toBeNull();
      expect(opt?.label).toBe('Vite');
      expect(opt?.value).toBe('vite_builder');
      expect(opt?.isRecommended).toBe(true);
    });
  });

  describe('normalizeFormCardQuestions', () => {
    it('normalizes Antigravity format (options: string[], is_multi_select: boolean)', () => {
      const antigravityInput = {
        questions: [
          {
            question: 'Which database should we use?',
            options: ['PostgreSQL (Recommended)', 'MongoDB', 'SQLite'],
            is_multi_select: false,
          },
        ],
      };

      const result = normalizeFormCardQuestions(antigravityInput);
      expect(result).not.toBeNull();
      expect(result?.questions).toHaveLength(1);
      const q = result?.questions[0];
      expect(q?.question).toBe('Which database should we use?');
      expect(q?.isMultiSelect).toBe(false);
      expect(q?.options).toHaveLength(3);
      expect(q?.options[0].label).toBe('PostgreSQL');
      expect(q?.options[0].isRecommended).toBe(true);
      expect(q?.options[1].label).toBe('MongoDB');
      expect(q?.options[1].isRecommended).toBe(false);
    });

    it('normalizes v0 format with multiSelect and structured options', () => {
      const v0Input = {
        title: 'Project Setup Decisions',
        questions: [
          {
            id: 'auth_features',
            question: 'Which authentication methods do you need?',
            options: [
              { label: 'Google OAuth (Recommended)', value: 'google' },
              { label: 'GitHub OAuth', value: 'github' },
              { label: 'Email/Password', value: 'email' },
            ],
            multiSelect: true,
          },
        ],
      };

      const result = normalizeFormCardQuestions(v0Input);
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Project Setup Decisions');
      expect(result?.questions[0].id).toBe('auth_features');
      expect(result?.questions[0].isMultiSelect).toBe(true);
      expect(result?.questions[0].options[0].isRecommended).toBe(true);
    });

    it('normalizes Manus format (text and options)', () => {
      const manusInput = {
        text: 'Should I expose port 3000 to the public web?',
        options: ['Yes (Recommended)', 'No, local only'],
      };

      const result = normalizeFormCardQuestions(manusInput);
      expect(result).not.toBeNull();
      expect(result?.questions[0].question).toBe('Should I expose port 3000 to the public web?');
      expect(result?.questions[0].options).toHaveLength(2);
      expect(result?.questions[0].options[0].isRecommended).toBe(true);
    });

    it('parses JSON string representation', () => {
      const jsonStr = JSON.stringify({
        questions: [{ question: 'Confirm deploy?', options: ['Yes', 'No'] }],
      });
      const result = normalizeFormCardQuestions(jsonStr);
      expect(result).not.toBeNull();
      expect(result?.questions[0].question).toBe('Confirm deploy?');
    });

    it('returns null on invalid input', () => {
      expect(normalizeFormCardQuestions(null)).toBeNull();
      expect(normalizeFormCardQuestions({})).toBeNull();
      expect(normalizeFormCardQuestions({ questions: [] })).toBeNull();
    });
  });

  describe('formatFormSubmissionResponse', () => {
    it('formats single and multi-select answers for prompt resumption', () => {
      const form: FormCardData = {
        questions: [
          {
            id: 'db',
            question: 'Database',
            options: [],
            isMultiSelect: false,
          },
          {
            id: 'features',
            question: 'Enabled Features',
            options: [],
            isMultiSelect: true,
          },
        ],
      };

      const submission: FormCardSubmission = {
        answers: {
          db: 'PostgreSQL (Recommended)',
          features: ['Auth', 'Analytics', 'Payments'],
        },
      };

      const formatted = formatFormSubmissionResponse(submission, form);
      expect(formatted).toContain('[Interactive Form Response]');
      expect(formatted).toContain('- **Database**: PostgreSQL (Recommended)');
      expect(formatted).toContain('- **Enabled Features**: Auth, Analytics, Payments');
    });
  });
});
