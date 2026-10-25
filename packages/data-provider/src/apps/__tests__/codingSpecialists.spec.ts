import {
  CURSOR_COMPOSER_PROMPT,
  WINDSURF_CASCADE_PROMPT,
  KIRO_SPEC_PROMPT,
  KIRO_VIBE_PROMPT,
  KIRO_DUAL_MODE_PROMPT,
} from '../prompts/codingSpecialists';
import { getAuthenticPrompt, hasPrompt, interpolatePrompt } from '../promptStore';
import { getAppDefinition } from '../appsRegistry';

describe('Coding Specialist Studios Prompts (Fas 39)', () => {
  describe('CURSOR_COMPOSER_PROMPT', () => {
    it('contains surgical diff editing rules and semantic codebase search', () => {
      expect(CURSOR_COMPOSER_PROMPT).toContain('<identity>');
      expect(CURSOR_COMPOSER_PROMPT).toContain('Cursor Composer');
      expect(CURSOR_COMPOSER_PROMPT).toContain('<composer_rules>');
      expect(CURSOR_COMPOSER_PROMPT).toContain('codebase_search');
      expect(CURSOR_COMPOSER_PROMPT).toContain('targeted diffs');
      expect(CURSOR_COMPOSER_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(CURSOR_COMPOSER_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(CURSOR_COMPOSER_PROMPT).toContain('{{CURRENT_OS}}');
      expect(CURSOR_COMPOSER_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');
    });

    it('matches appsRegistry cursor application definition', () => {
      const cursorApp = getAppDefinition('cursor');
      expect(cursorApp).toBeDefined();
      expect(cursorApp?.name).toBe('Cursor Studio');
      expect(cursorApp?.systemPromptId).toBe('cursor-composer');
      expect(hasPrompt(cursorApp?.systemPromptId)).toBe(true);

      const prompt = getAuthenticPrompt(cursorApp?.systemPromptId, {
        currentDate: '2026-10-26',
        workingDirectory: '/home/ubuntu/claude-copycat',
        currentOs: 'macOS Darwin',
        knowledgeCutoff: 'June 2024',
      });
      expect(prompt).not.toContain('{{CURRENT_DATE}}');
      expect(prompt).toContain('Today is 2026-10-26' || 'Date: 2026-10-26');
      expect(prompt).toContain('/home/ubuntu/claude-copycat');
    });
  });

  describe('WINDSURF_CASCADE_PROMPT', () => {
    it('contains AI Flow paradigm and self-healing dev server loop', () => {
      expect(WINDSURF_CASCADE_PROMPT).toContain('<identity>');
      expect(WINDSURF_CASCADE_PROMPT).toContain('Cascade');
      expect(WINDSURF_CASCADE_PROMPT).toContain('Windsurf');
      expect(WINDSURF_CASCADE_PROMPT).toContain('<cascade_flow>');
      expect(WINDSURF_CASCADE_PROMPT).toContain('self-healing loop');
      expect(WINDSURF_CASCADE_PROMPT).toContain('TargetFile');
      expect(WINDSURF_CASCADE_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(WINDSURF_CASCADE_PROMPT).toContain('{{WORKING_DIRECTORY}}');
    });

    it('matches appsRegistry windsurf application definition', () => {
      const windsurfApp = getAppDefinition('windsurf');
      expect(windsurfApp).toBeDefined();
      expect(windsurfApp?.name).toBe('Windsurf Wave');
      expect(windsurfApp?.systemPromptId).toBe('windsurf-cascade');
      expect(hasPrompt(windsurfApp?.systemPromptId)).toBe(true);

      const prompt = getAuthenticPrompt(windsurfApp?.systemPromptId, {
        currentDate: '2026-10-26',
        workingDirectory: '/home/ubuntu/project',
        currentOs: 'linux',
      });
      expect(prompt).not.toContain('{{CURRENT_DATE}}');
      expect(prompt).toContain('2026-10-26');
      expect(prompt).toContain('/home/ubuntu/project');
    });
  });

  describe('KIRO Dual-Mode (Spec vs Vibe)', () => {
    it('contains Spec Mode architectural invariants and TDD discipline', () => {
      expect(KIRO_SPEC_PROMPT).toContain('Kiro (Spec Mode)');
      expect(KIRO_SPEC_PROMPT).toContain('<spec_mode_invariants>');
      expect(KIRO_SPEC_PROMPT).toContain('ABSOLUTE MINIMAL amount of code');
      expect(KIRO_SPEC_PROMPT).toContain('strict TDD');
    });

    it('contains Vibe Mode rapid prototyping and creative flow', () => {
      expect(KIRO_VIBE_PROMPT).toContain('Kiro (Vibe Mode)');
      expect(KIRO_VIBE_PROMPT).toContain('<vibe_mode_flow>');
      expect(KIRO_VIBE_PROMPT).toContain('rapid velocity');
    });

    it('contains unified dual-mode switcher', () => {
      expect(KIRO_DUAL_MODE_PROMPT).toContain('<dual_mode_switcher>');
      expect(KIRO_DUAL_MODE_PROMPT).toContain('SPEC MODE:');
      expect(KIRO_DUAL_MODE_PROMPT).toContain('VIBE MODE:');
    });

    it('matches appsRegistry kiro application definition', () => {
      const kiroApp = getAppDefinition('kiro');
      expect(kiroApp).toBeDefined();
      expect(kiroApp?.name).toBe('Kiro / Traycer');
      expect(kiroApp?.systemPromptId).toBe('kiro-dual-mode');
      expect(hasPrompt(kiroApp?.systemPromptId)).toBe(true);
      expect(hasPrompt('kiro-spec')).toBe(true);
      expect(hasPrompt('kiro-vibe')).toBe(true);
      expect(hasPrompt('traycer')).toBe(true);
    });
  });
});
