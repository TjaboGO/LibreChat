import {
  PERPLEXITY_DEEP_RESEARCH_PROMPT,
  PERPLEXITY_RESEARCH_PROMPT,
  PERPLEXITY_COMPUTER_PROMPT,
} from '../prompts/perplexityResearch';
import { getAuthenticPrompt, hasPrompt } from '../promptStore';
import { getAppDefinition } from '../appsRegistry';

describe('Perplexity Deep Research System Prompts (Fas 43)', () => {
  describe('PERPLEXITY_DEEP_RESEARCH_PROMPT', () => {
    it('contains identity, multi-hop research rules, and citation brackets [1][2]', () => {
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('<identity>');
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('Perplexity Deep Research');
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('<deep_research_capabilities>');
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('<citations>');
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('Enclose the index of the relevant search result in brackets');
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('[1][2]');
    });

    it('contains dynamic environment placeholders', () => {
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('{{CURRENT_OS}}');
      expect(PERPLEXITY_DEEP_RESEARCH_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');
    });

    it('exports PERPLEXITY_RESEARCH_PROMPT alias', () => {
      expect(PERPLEXITY_RESEARCH_PROMPT).toBe(PERPLEXITY_DEEP_RESEARCH_PROMPT);
    });
  });

  describe('PERPLEXITY_COMPUTER_PROMPT', () => {
    it('contains identity and autonomous computer tools exploration', () => {
      expect(PERPLEXITY_COMPUTER_PROMPT).toContain('<identity>');
      expect(PERPLEXITY_COMPUTER_PROMPT).toContain('Perplexity Computer');
      expect(PERPLEXITY_COMPUTER_PROMPT).toContain('list_external_tools');
    });
  });

  describe('PromptStore & Apps Registry Integration', () => {
    it('registers prompts for perplexity and research', () => {
      expect(hasPrompt('research')).toBe(true);
      expect(hasPrompt('deep-research')).toBe(true);
      expect(hasPrompt('perplexity-deep-research')).toBe(true);
      expect(hasPrompt('perplexity')).toBe(true);
      expect(hasPrompt('perplexity-computer')).toBe(true);
    });

    it('matches appsRegistry definitions and interpolates correctly for Research', () => {
      const researchApp = getAppDefinition('research');
      expect(researchApp).toBeDefined();
      expect(researchApp?.name).toBe('Perplexity Deep Research');
      expect(researchApp?.systemPromptId).toBe('perplexity-deep-research');

      const interpolated = getAuthenticPrompt(researchApp?.systemPromptId, {
        currentDate: '2026-10-26',
        workingDirectory: '/home/researcher/papers',
        currentOs: 'macOS',
      });
      expect(interpolated).not.toContain('{{CURRENT_DATE}}');
      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).toContain('Date: 2026-10-26.');
      expect(interpolated).toContain('Working directory: /home/researcher/papers.');
    });

    it('matches appsRegistry definitions for Perplexity', () => {
      const perplexityApp = getAppDefinition('perplexity');
      expect(perplexityApp).toBeDefined();
      expect(perplexityApp?.name).toBe('Perplexity Research');
      expect(hasPrompt(perplexityApp?.systemPromptId)).toBe(true);
    });
  });
});
