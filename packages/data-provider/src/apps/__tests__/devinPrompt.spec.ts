import {
  DEVIN_SWE_PROMPT,
  DEVIN_DEEPWIKI_PROMPT,
  DEVIN_AGENT_PROMPT,
} from '../prompts/devinPrompt';
import { getAuthenticPrompt, hasPrompt, interpolatePrompt } from '../promptStore';
import { getAppDefinition } from '../appsRegistry';

describe('Cognition Devin & DeepWiki Prompts (Fas 38)', () => {
  describe('DEVIN_SWE_PROMPT', () => {
    it('contains all required structural sections and autonomous commands', () => {
      expect(DEVIN_SWE_PROMPT).toContain('<identity>');
      expect(DEVIN_SWE_PROMPT).toContain('autonomous software engineer created by Cognition');
      expect(DEVIN_SWE_PROMPT).toContain('Approach to Work');
      expect(DEVIN_SWE_PROMPT).toContain('Coding Best Practices');
      expect(DEVIN_SWE_PROMPT).toContain('Command Reference');

      // Commands
      expect(DEVIN_SWE_PROMPT).toContain('<think>');
      expect(DEVIN_SWE_PROMPT).toContain('<shell');
      expect(DEVIN_SWE_PROMPT).toContain('<open_file');
      expect(DEVIN_SWE_PROMPT).toContain('<str_replace');
      expect(DEVIN_SWE_PROMPT).toContain('<create_file');
      expect(DEVIN_SWE_PROMPT).toContain('<find_filecontent');
      expect(DEVIN_SWE_PROMPT).toContain('<go_to_definition');
      expect(DEVIN_SWE_PROMPT).toContain('<navigate_browser');
      expect(DEVIN_SWE_PROMPT).toContain('<deploy_frontend');
      expect(DEVIN_SWE_PROMPT).toContain('<message_user');
    });

    it('contains dynamic environment placeholders', () => {
      expect(DEVIN_SWE_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(DEVIN_SWE_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(DEVIN_SWE_PROMPT).toContain('{{CURRENT_OS}}');
      expect(DEVIN_SWE_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');
    });
  });

  describe('DEVIN_DEEPWIKI_PROMPT', () => {
    it('contains architecture wiki and citation discipline', () => {
      expect(DEVIN_DEEPWIKI_PROMPT).toContain('<identity>');
      expect(DEVIN_DEEPWIKI_PROMPT).toContain('codebase-grounded architectural insight');
      expect(DEVIN_DEEPWIKI_PROMPT).toContain('Code Citation Instructions');
      expect(DEVIN_DEEPWIKI_PROMPT).toContain('<cite repo="REPO_NAME" path="FILE_PATH" start="START_LINE" end="END_LINE" />');
      expect(DEVIN_DEEPWIKI_PROMPT).toContain('mermaid diagrams');
      expect(DEVIN_DEEPWIKI_PROMPT).toContain('never use colors in the diagrams');
      expect(DEVIN_DEEPWIKI_PROMPT).toContain('<budget:token_budget>200000</budget:token_budget>');
    });
  });

  describe('DEVIN_AGENT_PROMPT & PromptStore Integration', () => {
    it('contains dual-mode switching between SWE and DeepWiki', () => {
      expect(DEVIN_AGENT_PROMPT).toContain('<mode_switching>');
      expect(DEVIN_AGENT_PROMPT).toContain('Autonomous SWE Mode');
      expect(DEVIN_AGENT_PROMPT).toContain('DeepWiki Architecture Mode');
      expect(DEVIN_AGENT_PROMPT).toContain('<deepwiki_guidelines>');
    });

    it('is registered in promptStore for devin and aliases', () => {
      expect(hasPrompt('cognition-devin')).toBe(true);
      expect(hasPrompt('devin')).toBe(true);
      expect(hasPrompt('devin-swe')).toBe(true);
      expect(hasPrompt('devin-wiki')).toBe(true);
      expect(hasPrompt('deepwiki')).toBe(true);
      expect(hasPrompt('cognition')).toBe(true);
    });

    it('matches appsRegistry devin application', () => {
      const devinApp = getAppDefinition('devin');
      expect(devinApp).toBeDefined();
      expect(devinApp?.name).toBe('Cognition Devin');
      expect(devinApp?.systemPromptId).toBe('cognition-devin');
      expect(hasPrompt(devinApp?.systemPromptId)).toBe(true);

      const prompt = getAuthenticPrompt(devinApp?.systemPromptId, {
        currentDate: '2026-10-26',
        workingDirectory: '/workspace/claude-copycat',
        currentOs: 'macOS Darwin',
        knowledgeCutoff: 'March 2026',
      });

      expect(prompt).not.toContain('{{CURRENT_DATE}}');
      expect(prompt).not.toContain('{{WORKING_DIRECTORY}}');
      expect(prompt).toContain('Today is 2026-10-26.');
      expect(prompt).toContain('Working directory: /workspace/claude-copycat.');
      expect(prompt).toContain('Environment: Linux sandbox on macOS Darwin.');
    });
  });
});
