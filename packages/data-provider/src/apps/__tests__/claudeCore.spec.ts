import {
  CLAUDE_CHAT_PROMPT,
  CLAUDE_COWORK_PROMPT,
  CLAUDE_DESIGN_PROMPT,
  CLAUDE_CODE_PROMPT,
} from '../prompts/claudeCore';
import { getAuthenticPrompt, hasPrompt, interpolatePrompt } from '../promptStore';
import { getAppDefinition } from '../appsRegistry';

describe('Core Claude Suite Prompts (Fas 34)', () => {
  describe('CLAUDE_CHAT_PROMPT (Articulate & Nuanced)', () => {
    it('contains all required structural sections and principles', () => {
      expect(CLAUDE_CHAT_PROMPT).toContain('<identity>');
      expect(CLAUDE_CHAT_PROMPT).toContain('<tone_and_demeanor>');
      expect(CLAUDE_CHAT_PROMPT).toContain('<extended_reasoning_and_structure>');
      expect(CLAUDE_CHAT_PROMPT).toContain('<artifacts_guidelines>');

      // Anti-sycophancy and epistemic calibration
      expect(CLAUDE_CHAT_PROMPT).toContain('nuance, depth, intellectual curiosity');
      expect(CLAUDE_CHAT_PROMPT).toContain('Avoid hollow pleasantries, robotic sycophancy');
      expect(CLAUDE_CHAT_PROMPT).toContain('Calibrate your certainty with precision');
      expect(CLAUDE_CHAT_PROMPT).toContain('NEVER truncate code or insert placeholders');
    });

    it('contains expected placeholders', () => {
      expect(CLAUDE_CHAT_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(CLAUDE_CHAT_PROMPT).toContain('{{CURRENT_TIME}}');
      expect(CLAUDE_CHAT_PROMPT).toContain('{{CURRENT_OS}}');
      expect(CLAUDE_CHAT_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');
    });

    it('interpolates successfully via interpolatePrompt and getAuthenticPrompt', () => {
      const interpolated = interpolatePrompt(CLAUDE_CHAT_PROMPT, {
        currentDate: '2026-10-26',
        currentTime: '14:30:00 UTC',
        currentOs: 'macOS Sequoia',
        knowledgeCutoff: 'March 2026',
      });

      expect(interpolated).not.toContain('{{CURRENT_DATE}}');
      expect(interpolated).not.toContain('{{CURRENT_TIME}}');
      expect(interpolated).not.toContain('{{CURRENT_OS}}');
      expect(interpolated).not.toContain('{{KNOWLEDGE_CUTOFF}}');
      expect(interpolated).toContain("Today's date is 2026-10-26.");
      expect(interpolated).toContain('Current time is 14:30:00 UTC.');
      expect(interpolated).toContain('The user\'s active operating system is macOS Sequoia.');
    });
  });

  describe('CLAUDE_COWORK_PROMPT (Deep Pair Programmer & Strategist)', () => {
    it('contains all required structural sections and pair-programming rules', () => {
      expect(CLAUDE_COWORK_PROMPT).toContain('<identity>');
      expect(CLAUDE_COWORK_PROMPT).toContain('<pair_programming_philosophy>');
      expect(CLAUDE_COWORK_PROMPT).toContain('<cowork_runtime_rules>');

      // Staff-level pair programming, tool discipline, test verification
      expect(CLAUDE_COWORK_PROMPT).toContain('staff-level principal software engineer');
      expect(CLAUDE_COWORK_PROMPT).toContain('Surgical File Modifications');
      expect(CLAUDE_COWORK_PROMPT).toContain('Intermediate Tool Discipline');
      expect(CLAUDE_COWORK_PROMPT).toContain('Do not narrate intermediate tool calls');
      expect(CLAUDE_COWORK_PROMPT).toContain('Verification & Testing');
    });

    it('contains expected placeholders', () => {
      expect(CLAUDE_COWORK_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(CLAUDE_COWORK_PROMPT).toContain('{{CURRENT_TIME}}');
      expect(CLAUDE_COWORK_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(CLAUDE_COWORK_PROMPT).toContain('{{CURRENT_OS}}');
    });

    it('interpolates workspace and OS dynamically', () => {
      const interpolated = getAuthenticPrompt('claude-cowork', {
        workingDirectory: '/Users/developer/project',
        currentOs: 'mac',
      });

      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).toContain('Current workspace directory: /Users/developer/project.');
      expect(interpolated).toContain('Environment: mac developer workstation.');
    });
  });

  describe('CLAUDE_DESIGN_PROMPT (Visual Systems & Generative UI)', () => {
    it('contains all required structural sections and design tokens', () => {
      expect(CLAUDE_DESIGN_PROMPT).toContain('<identity>');
      expect(CLAUDE_DESIGN_PROMPT).toContain('<visual_design_philosophy>');
      expect(CLAUDE_DESIGN_PROMPT).toContain('<generative_ui_specifications>');

      // Design system, Tailwind, Radix/Ariakit, accessibility
      expect(CLAUDE_DESIGN_PROMPT).toContain('Modern React 19, Tailwind CSS, Lucide Icons');
      expect(CLAUDE_DESIGN_PROMPT).toContain('WCAG AA compliant');
      expect(CLAUDE_DESIGN_PROMPT).toContain('Typographic Scale');
      expect(CLAUDE_DESIGN_PROMPT).toContain('Accessibility & Interaction Design');
    });

    it('contains expected placeholders', () => {
      expect(CLAUDE_DESIGN_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(CLAUDE_DESIGN_PROMPT).toContain('{{APP_NAME}}');
    });

    it('interpolates platform and date cleanly', () => {
      const interpolated = getAuthenticPrompt('claude-design', {
        appName: 'Claude Copycat Suite',
      });

      expect(interpolated).not.toContain('{{APP_NAME}}');
      expect(interpolated).toContain('Platform: Claude Copycat Suite.');
    });
  });

  describe('CLAUDE_CODE_PROMPT (Terminal Agent)', () => {
    it('contains all required structural sections and terminal discipline', () => {
      expect(CLAUDE_CODE_PROMPT).toContain('<identity>');
      expect(CLAUDE_CODE_PROMPT).toContain('<terminal_velocity_and_density>');
      expect(CLAUDE_CODE_PROMPT).toContain('<git_and_workflow_discipline>');

      // Zero-fluff, surgical stack trace fixing, git conventions
      expect(CLAUDE_CODE_PROMPT).toContain('Maximum information density');
      expect(CLAUDE_CODE_PROMPT).toContain('Zero pleasantries, zero apologies');
      expect(CLAUDE_CODE_PROMPT).toContain('Inspect the stack trace surgically');
      expect(CLAUDE_CODE_PROMPT).toContain('conventional commit messages');
    });

    it('contains expected placeholders', () => {
      expect(CLAUDE_CODE_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(CLAUDE_CODE_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(CLAUDE_CODE_PROMPT).toContain('{{CURRENT_OS}}');
    });

    it('interpolates terminal runtime options correctly', () => {
      const interpolated = getAuthenticPrompt('claude-code', {
        workingDirectory: '/var/repos/service',
        currentOs: 'linux',
      });

      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).not.toContain('{{CURRENT_OS}}');
      expect(interpolated).toContain('Working directory: /var/repos/service.');
      expect(interpolated).toContain('Host OS: linux.');
    });
  });

  describe('App Registry & System Prompt Wiring', () => {
    it('maps all 4 core apps to their respective authentic prompts', () => {
      const coreAppIds = ['chat', 'cowork', 'design', 'code'] as const;

      for (const appId of coreAppIds) {
        const app = getAppDefinition(appId);
        expect(app).toBeDefined();
        expect(app?.section).toBe('core');
        expect(hasPrompt(app!.systemPromptId)).toBe(true);

        // Verify resolving via both app ID and systemPromptId produces the same authentic prompt template
        const promptByAppId = getAuthenticPrompt(appId);
        const promptBySystemPromptId = getAuthenticPrompt(app!.systemPromptId);

        expect(promptByAppId).toBe(promptBySystemPromptId);
        expect(promptByAppId.length).toBeGreaterThan(200);
      }
    });

    it('resolves chat app to claude-chat prompt', () => {
      const chatPrompt = getAuthenticPrompt('chat');
      expect(chatPrompt).toContain('You are Claude, a helpful, harmless, and honest AI assistant');
    });

    it('resolves cowork app to claude-cowork prompt', () => {
      const coworkPrompt = getAuthenticPrompt('cowork');
      expect(coworkPrompt).toContain('You are Claude powering Cowork Mode');
    });

    it('resolves design app to claude-design prompt', () => {
      const designPrompt = getAuthenticPrompt('design');
      expect(designPrompt).toContain('You are Claude Design');
    });

    it('resolves code app to claude-code prompt', () => {
      const codePrompt = getAuthenticPrompt('code');
      expect(codePrompt).toContain('You are Claude Code');
    });
  });
});
