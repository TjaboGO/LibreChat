import {
  DEEPSEEK_R1_PROMPT,
  XAI_GROK_BUILD_PROMPT,
  QWEN_CODER_PROMPT,
  MOONSHOT_KIMI_PROMPT,
} from '../prompts/frontierAlternative';
import { getAuthenticPrompt, hasPrompt, interpolatePrompt } from '../promptStore';
import { getAppDefinition } from '../appsRegistry';

describe('Frontier Open-Source & Challenger Prompts (Fas 36)', () => {
  describe('DEEPSEEK_R1_PROMPT (Deep Think & Hallucination Elimination)', () => {
    it('contains all required structural sections and <think> tag discipline', () => {
      expect(DEEPSEEK_R1_PROMPT).toContain('<identity>');
      expect(DEEPSEEK_R1_PROMPT).toContain('<thinking_process_and_reasoning>');
      expect(DEEPSEEK_R1_PROMPT).toContain('<citation_and_synthesis_standards>');

      // <think> exploration and reasoning
      expect(DEEPSEEK_R1_PROMPT).toContain('<think>...</think>');
      expect(DEEPSEEK_R1_PROMPT).toContain('Deep Step-by-Step Chain-of-Thought');
      expect(DEEPSEEK_R1_PROMPT).toContain('Elimination of Hallucinations');
      expect(DEEPSEEK_R1_PROMPT).toContain('boundary conditions');
      expect(DEEPSEEK_R1_PROMPT).toContain('epistemic calibration');

      // Citation standards
      expect(DEEPSEEK_R1_PROMPT).toContain('[citation:X]');
      expect(DEEPSEEK_R1_PROMPT).toContain('Never cluster all citations together at the end');
    });

    it('interpolates placeholders cleanly without leaking templates', () => {
      expect(DEEPSEEK_R1_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(DEEPSEEK_R1_PROMPT).toContain('{{CURRENT_OS}}');
      expect(DEEPSEEK_R1_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');

      const interpolated = interpolatePrompt(DEEPSEEK_R1_PROMPT, {
        currentDate: '2026-10-26',
        currentOs: 'macOS Sequoia',
        knowledgeCutoff: 'July 2025',
      });

      expect(interpolated).not.toContain('{{CURRENT_DATE}}');
      expect(interpolated).not.toContain('{{CURRENT_OS}}');
      expect(interpolated).not.toContain('{{KNOWLEDGE_CUTOFF}}');
      expect(interpolated).toContain('今天是2026-10-26。');
      expect(interpolated).toContain('当前操作系统为macOS Sequoia。');
    });
  });

  describe('XAI_GROK_BUILD_PROMPT (High-Velocity Engineering & Parallel Tooling)', () => {
    it('contains all required sections and engineering standards', () => {
      expect(XAI_GROK_BUILD_PROMPT).toContain('<identity>');
      expect(XAI_GROK_BUILD_PROMPT).toContain('<tool_calling>');
      expect(XAI_GROK_BUILD_PROMPT).toContain('<background_terminal_commands>');
      expect(XAI_GROK_BUILD_PROMPT).toContain('<surgical_code_modifications>');
      expect(XAI_GROK_BUILD_PROMPT).toContain('<tone_and_formatting>');

      // Parallel tooling & background commands
      expect(XAI_GROK_BUILD_PROMPT).toContain('Parallel Tool Execution');
      expect(XAI_GROK_BUILD_PROMPT).toContain('execute all independent tool calls in parallel');
      expect(XAI_GROK_BUILD_PROMPT).toContain('background: true');
      expect(XAI_GROK_BUILD_PROMPT).toContain('task_id');

      // Code hygiene & minimal complexity
      expect(XAI_GROK_BUILD_PROMPT).toContain('Prefer editing existing files rather than creating new files');
      expect(XAI_GROK_BUILD_PROMPT).toContain('Do not introduce speculative abstractions');
      expect(XAI_GROK_BUILD_PROMPT).toContain('Verification Before Completion');
    });

    it('interpolates workspace and system parameters dynamically', () => {
      const interpolated = getAuthenticPrompt('xai-grok-build', {
        workingDirectory: '/workspace/autonomous-agent',
        currentOs: 'linux',
      });

      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).not.toContain('{{CURRENT_OS}}');
      expect(interpolated).toContain('Working workspace: /workspace/autonomous-agent.');
      expect(interpolated).toContain('Host OS: linux.');
    });
  });

  describe('QWEN_CODER_PROMPT (Repository Conventions & Verification)', () => {
    it('contains all required engineering mandates', () => {
      expect(QWEN_CODER_PROMPT).toContain('<identity>');
      expect(QWEN_CODER_PROMPT).toContain('<engineering_mandates>');
      expect(QWEN_CODER_PROMPT).toContain('<cli_discipline>');

      // Conventions, comments, tests, verification
      expect(QWEN_CODER_PROMPT).toContain('Adherence to Existing Conventions');
      expect(QWEN_CODER_PROMPT).toContain('Verify that libraries and frameworks are already configured');
      expect(QWEN_CODER_PROMPT).toContain('Default to zero unnecessary comments');
      expect(QWEN_CODER_PROMPT).toContain('Test-Driven Permanence');
      expect(QWEN_CODER_PROMPT).toContain('Verification Standards');
      expect(QWEN_CODER_PROMPT).toContain('Run project-specific type checks (tsc)');
    });

    it('interpolates platform name and workspace directory cleanly', () => {
      const interpolated = getAuthenticPrompt('qwen-coder', {
        appName: 'Claude Copycat Suite',
        workingDirectory: '/srv/projects/repo',
        currentOs: 'mac',
      });

      expect(interpolated).not.toContain('{{APP_NAME}}');
      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).toContain('Platform: Claude Copycat Suite.');
      expect(interpolated).toContain('Active directory: /srv/projects/repo.');
    });
  });

  describe('MOONSHOT_KIMI_PROMPT (Long-Context & Recursive Reasoning)', () => {
    it('contains long-context and multi-hop reasoning principles', () => {
      expect(MOONSHOT_KIMI_PROMPT).toContain('<identity>');
      expect(MOONSHOT_KIMI_PROMPT).toContain('<reasoning_and_context_synthesis>');
      expect(MOONSHOT_KIMI_PROMPT).toContain('Ultra Long-Context Processing');
      expect(MOONSHOT_KIMI_PROMPT).toContain('multi-hop recursive reasoning');
      expect(MOONSHOT_KIMI_PROMPT).toContain('Epistemic Rigor');
    });

    it('interpolates knowledge cutoff correctly', () => {
      const interpolated = getAuthenticPrompt('moonshot-kimi', {
        knowledgeCutoff: 'June 2026',
      });

      expect(interpolated).not.toContain('{{KNOWLEDGE_CUTOFF}}');
      expect(interpolated).toContain('Knowledge cutoff: June 2026.');
    });
  });

  describe('App Registry & System Prompt Resolution Aliases', () => {
    it('maps grok app and xai-grok-build prompt identifier', () => {
      const app = getAppDefinition('grok');
      expect(app).toBeDefined();
      expect(app?.systemPromptId).toBe('xai-grok-build');

      const byAppId = getAuthenticPrompt('grok');
      const byPromptId = getAuthenticPrompt('xai-grok-build');
      expect(byAppId).toBe(byPromptId);
      expect(byAppId).toContain('You are Grok Build');
    });

    it('resolves deepseek-r1 aliases (deepseek-r1, deepseek, r1)', () => {
      expect(hasPrompt('deepseek-r1')).toBe(true);
      expect(hasPrompt('deepseek')).toBe(true);
      expect(hasPrompt('r1')).toBe(true);

      const p1 = getAuthenticPrompt('deepseek-r1');
      const p2 = getAuthenticPrompt('deepseek');
      const p3 = getAuthenticPrompt('r1');

      expect(p1).toBe(p2);
      expect(p2).toBe(p3);
      expect(p1).toContain('该助手为DeepSeek-R1');
      expect(p1).toContain('<think>...</think>');
    });

    it('resolves qwen-coder aliases (qwen-coder, qwen)', () => {
      expect(hasPrompt('qwen-coder')).toBe(true);
      expect(hasPrompt('qwen')).toBe(true);

      const p1 = getAuthenticPrompt('qwen-coder');
      const p2 = getAuthenticPrompt('qwen');

      expect(p1).toBe(p2);
      expect(p1).toContain('You are Qwen Code');
    });

    it('resolves moonshot-kimi aliases (moonshot-kimi, kimi)', () => {
      expect(hasPrompt('moonshot-kimi')).toBe(true);
      expect(hasPrompt('kimi')).toBe(true);

      const p1 = getAuthenticPrompt('moonshot-kimi');
      const p2 = getAuthenticPrompt('kimi');

      expect(p1).toBe(p2);
      expect(p1).toContain('You are Kimi');
    });
  });
});
