import { getAuthenticPrompt, hasPrompt, interpolatePrompt } from '../promptStore';
import { V0_OFFICIAL_PROMPT, V0_PROMPT } from '../prompts/v0Prompt';
import { getAppDefinition } from '../appsRegistry';

describe('Official Vercel v0 Generative UI Prompt (Fas 40)', () => {
  describe('V0_OFFICIAL_PROMPT', () => {
    it('contains identity, framework standards, and shadcn/ui rules', () => {
      expect(V0_OFFICIAL_PROMPT).toContain('<identity>');
      expect(V0_OFFICIAL_PROMPT).toContain("You are v0, Vercel's");
      expect(V0_OFFICIAL_PROMPT).toContain('shadcn/ui');
      expect(V0_OFFICIAL_PROMPT).toContain('Tailwind CSS');
      expect(V0_OFFICIAL_PROMPT).toContain('React 19');
      expect(V0_OFFICIAL_PROMPT).toContain('Next.js App Router');
    });

    it('contains AskUserQuestions tool rules and interactive clarification guidance', () => {
      expect(V0_OFFICIAL_PROMPT).toContain('AskUserQuestions');
      expect(V0_OFFICIAL_PROMPT).toContain('Do not call AskUserQuestions in parallel with other tools');
    });

    it('contains React 19 / Next.js caching directives and math rules', () => {
      expect(V0_OFFICIAL_PROMPT).toContain('revalidateTag');
      expect(V0_OFFICIAL_PROMPT).toContain('DOUBLE dollar signs ($$)');
    });

    it('contains dynamic environment placeholders', () => {
      expect(V0_OFFICIAL_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(V0_OFFICIAL_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(V0_OFFICIAL_PROMPT).toContain('{{CURRENT_OS}}');
      expect(V0_OFFICIAL_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');
    });
  });

  describe('PromptStore Integration', () => {
    it('is registered for v0 and v0-generative-ui', () => {
      expect(hasPrompt('v0')).toBe(true);
      expect(hasPrompt('v0-generative-ui')).toBe(true);
    });

    it('matches appsRegistry v0 application definition', () => {
      const v0App = getAppDefinition('v0');
      expect(v0App).toBeDefined();
      expect(v0App?.name).toBe('v0 Studio');
      expect(v0App?.systemPromptId).toBe('v0-generative-ui');
      expect(hasPrompt(v0App?.systemPromptId)).toBe(true);

      const prompt = getAuthenticPrompt(v0App?.systemPromptId, {
        currentDate: '2026-10-26',
        workingDirectory: '/home/ubuntu/v0-project',
        currentOs: 'linux',
      });
      expect(prompt).not.toContain('{{CURRENT_DATE}}');
      expect(prompt).not.toContain('{{WORKING_DIRECTORY}}');
      expect(prompt).toContain('Date: 2026-10-26.');
      expect(prompt).toContain('Working directory: /home/ubuntu/v0-project.');
    });
  });
});
