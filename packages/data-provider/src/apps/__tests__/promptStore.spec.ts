import {
  AUTHENTIC_PROMPTS,
  getDefaultPlaceholders,
  interpolatePrompt,
  getAuthenticPrompt,
  hasPrompt,
  getAllPromptIds,
} from '../promptStore';
import { getAllApps } from '../appsRegistry';

describe('Authentic Prompt Store & Interpolator (Fas 27)', () => {
  it('provides comprehensive default placeholders', () => {
    const defaults = getDefaultPlaceholders();
    expect(defaults.CURRENT_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(defaults.WORKING_DIRECTORY).toBe('/workspace');
    expect(defaults.USER_NAME).toBe('Developer');
    expect(defaults.CURRENT_OS).toBe('mac');
    expect(defaults.KNOWLEDGE_CUTOFF).toBe('March 2026');
    expect(defaults.APP_NAME).toBe('Claude All-in-One AI Suite');
  });

  describe('interpolatePrompt', () => {
    it('interpolates default placeholders when no custom options provided', () => {
      const template = 'Today is {{CURRENT_DATE}} in {{WORKING_DIRECTORY}}.';
      const result = interpolatePrompt(template);
      expect(result).not.toContain('{{CURRENT_DATE}}');
      expect(result).not.toContain('{{WORKING_DIRECTORY}}');
      expect(result).toContain('/workspace');
    });

    it('interpolates custom options overriding defaults', () => {
      const template = 'Hello {{USER_NAME}} on {{CURRENT_OS}} in {{WORKING_DIRECTORY}}.';
      const result = interpolatePrompt(template, {
        userName: 'Gabriel',
        currentOs: 'linux',
        workingDirectory: '/home/gabriel/project',
      });

      expect(result).toBe('Hello Gabriel on linux in /home/gabriel/project.');
    });

    it('interpolates arbitrary custom dictionary variables', () => {
      const template = 'Connecting to {{SERVICE_NAME}} on port {{PORT_NUM}}.';
      const result = interpolatePrompt(template, {
        variables: {
          SERVICE_NAME: 'Redis',
          PORT_NUM: '6379',
        },
      });

      expect(result).toBe('Connecting to Redis on port 6379.');
    });
  });

  describe('AUTHENTIC_PROMPTS coverage', () => {
    it('contains an authentic prompt for every single app in APPS_REGISTRY', () => {
      const allApps = getAllApps();
      expect(allApps.length).toBe(22);

      for (const app of allApps) {
        expect(hasPrompt(app.systemPromptId)).toBe(true);
        const prompt = getAuthenticPrompt(app.systemPromptId);
        expect(prompt).toBeTruthy();
        expect(prompt.length).toBeGreaterThan(100);
      }
    });

    it('registers exactly 22 authentic prompts', () => {
      const promptIds = getAllPromptIds();
      expect(promptIds.length).toBe(22);
    });
  });

  describe('getAuthenticPrompt', () => {
    it('returns interpolated prompt for manus-agent', () => {
      const prompt = getAuthenticPrompt('manus-agent', {
        workingDirectory: '/custom/manus/dir',
        currentOs: 'linux',
      });

      expect(prompt).toContain('Manus Agent');
      expect(prompt).toContain('/custom/manus/dir');
      expect(prompt).toContain('Linux sandbox on linux');
      expect(prompt).not.toContain('{{WORKING_DIRECTORY}}');
      expect(prompt).not.toContain('{{CURRENT_OS}}');
    });

    it('returns interpolated prompt for v0-generative-ui', () => {
      const prompt = getAuthenticPrompt('v0-generative-ui');
      expect(prompt).toContain('You are v0');
      expect(prompt).toContain('shadcn/ui');
      expect(prompt).toContain('AskUserQuestions');
      expect(prompt).not.toContain('{{CURRENT_DATE}}');
    });

    it('is case-insensitive for prompt identifiers', () => {
      const promptUpper = getAuthenticPrompt('MANUS-AGENT');
      const promptLower = getAuthenticPrompt('manus-agent');
      expect(promptUpper).toBe(promptLower);
    });

    it('falls back to claude-chat for unknown or null prompt IDs', () => {
      const fallback = getAuthenticPrompt('unknown-prompt-id');
      expect(fallback).toContain('You are Claude');
      expect(fallback).toContain('helpful, harmless, and honest');

      const nullFallback = getAuthenticPrompt(null);
      expect(nullFallback).toContain('You are Claude');
    });
  });

  describe('hasPrompt', () => {
    it('returns true for known prompt IDs', () => {
      expect(hasPrompt('claude-chat')).toBe(true);
      expect(hasPrompt('claude-cowork')).toBe(true);
      expect(hasPrompt('manus-agent')).toBe(true);
      expect(hasPrompt('v0-generative-ui')).toBe(true);
      expect(hasPrompt('perplexity-computer')).toBe(true);
      expect(hasPrompt('living-office')).toBe(true);
    });

    it('returns false for unknown or invalid prompt IDs', () => {
      expect(hasPrompt('non-existent')).toBe(false);
      expect(hasPrompt('')).toBe(false);
      expect(hasPrompt(null)).toBe(false);
    });
  });
});
