import {
  LOVABLE_BUILDER_PROMPT,
  LOVABLE_AGENT_PROMPT,
  BOLT_BUILDER_PROMPT,
  BOLT_NEW_PROMPT,
} from '../prompts/fullStackBuilders';
import { getAuthenticPrompt, hasPrompt, interpolatePrompt } from '../promptStore';
import { getAppDefinition } from '../appsRegistry';

describe('Full-Stack Builders System Prompts (Fas 41: Lovable & Bolt.new)', () => {
  describe('LOVABLE_BUILDER_PROMPT', () => {
    it('contains identity, React/Vite/Tailwind stack, and Supabase integration', () => {
      expect(LOVABLE_BUILDER_PROMPT).toContain('<identity>');
      expect(LOVABLE_BUILDER_PROMPT).toContain('You are Lovable');
      expect(LOVABLE_BUILDER_PROMPT).toContain('React');
      expect(LOVABLE_BUILDER_PROMPT).toContain('Vite');
      expect(LOVABLE_BUILDER_PROMPT).toContain('Tailwind CSS');
      expect(LOVABLE_BUILDER_PROMPT).toContain('Supabase');
    });

    it('contains Supabase SQL database and RLS policy directives', () => {
      expect(LOVABLE_BUILDER_PROMPT).toContain('<supabase-integration>');
      expect(LOVABLE_BUILDER_PROMPT).toContain('RLS policies');
      expect(LOVABLE_BUILDER_PROMPT).toContain('tables');
    });

    it('contains dynamic environment placeholders', () => {
      expect(LOVABLE_BUILDER_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(LOVABLE_BUILDER_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(LOVABLE_BUILDER_PROMPT).toContain('{{CURRENT_OS}}');
      expect(LOVABLE_BUILDER_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');
    });

    it('exports LOVABLE_AGENT_PROMPT alias', () => {
      expect(LOVABLE_AGENT_PROMPT).toBe(LOVABLE_BUILDER_PROMPT);
    });
  });

  describe('BOLT_BUILDER_PROMPT', () => {
    it('contains identity and WebContainer runtime constraints', () => {
      expect(BOLT_BUILDER_PROMPT).toContain('<identity>');
      expect(BOLT_BUILDER_PROMPT).toContain('You are Bolt');
      expect(BOLT_BUILDER_PROMPT).toContain('WebContainer');
      expect(BOLT_BUILDER_PROMPT).toContain('<system_constraints>');
    });

    it('contains database instructions with Supabase migrations and safety requirements', () => {
      expect(BOLT_BUILDER_PROMPT).toContain('<database_instructions>');
      expect(BOLT_BUILDER_PROMPT).toContain('CRITICAL: Use Supabase for databases by default');
      expect(BOLT_BUILDER_PROMPT).toContain('DATA INTEGRITY IS THE HIGHEST PRIORITY');
      expect(BOLT_BUILDER_PROMPT).toContain('<boltAction type="supabase"');
    });

    it('contains dynamic environment placeholders', () => {
      expect(BOLT_BUILDER_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(BOLT_BUILDER_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(BOLT_BUILDER_PROMPT).toContain('{{CURRENT_OS}}');
      expect(BOLT_BUILDER_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');
    });

    it('exports BOLT_NEW_PROMPT alias', () => {
      expect(BOLT_NEW_PROMPT).toBe(BOLT_BUILDER_PROMPT);
    });
  });

  describe('PromptStore Integration', () => {
    it('registers prompts for lovable and bolt', () => {
      expect(hasPrompt('lovable')).toBe(true);
      expect(hasPrompt('lovable-builder')).toBe(true);
      expect(hasPrompt('bolt')).toBe(true);
      expect(hasPrompt('bolt-new')).toBe(true);
    });

    it('matches appsRegistry definitions and interpolates correctly for Lovable', () => {
      const lovableApp = getAppDefinition('lovable');
      expect(lovableApp).toBeDefined();
      expect(lovableApp?.name).toBe('Lovable Studio');
      expect(lovableApp?.systemPromptId).toBe('lovable-builder');

      const interpolated = getAuthenticPrompt(lovableApp?.systemPromptId, {
        currentDate: '2026-10-26',
        workingDirectory: '/home/project/lovable-app',
        currentOs: 'macOS',
      });
      expect(interpolated).not.toContain('{{CURRENT_DATE}}');
      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).toContain('Date: 2026-10-26.');
      expect(interpolated).toContain('Working directory: /home/project/lovable-app.');
    });

    it('matches appsRegistry definitions and interpolates correctly for Bolt', () => {
      const boltApp = getAppDefinition('bolt');
      expect(boltApp).toBeDefined();
      expect(boltApp?.name).toBe('Bolt.new');
      expect(boltApp?.systemPromptId).toBe('bolt-new');

      const interpolated = getAuthenticPrompt(boltApp?.systemPromptId, {
        currentDate: '2026-10-26',
        workingDirectory: '/home/project/bolt-app',
        currentOs: 'macOS',
      });
      expect(interpolated).not.toContain('{{CURRENT_DATE}}');
      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).toContain('Date: 2026-10-26.');
      expect(interpolated).toContain('Working directory: /home/project/bolt-app.');
    });
  });
});
