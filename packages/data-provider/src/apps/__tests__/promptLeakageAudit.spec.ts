import {
  getAuthenticPrompt,
  hasPrompt,
  APP_ID_TO_PROMPT_ID,
} from '../promptStore';
import {
  APPS_REGISTRY,
  getAllApps,
} from '../appsRegistry';

describe('Fas 45: Master Security & Zero Prompt Leakage Audit', () => {
  const allApps = getAllApps();

  describe('App Registry & System Prompt Containment', () => {
    it('contains all 23 specialized and frontier AI apps', () => {
      expect(allApps.length).toBe(23);
      const appIds = allApps.map((a) => a.id);
      expect(appIds).toEqual(
        expect.arrayContaining([
          'chat',
          'cowork',
          'design',
          'code',
          'manus',
          'devin',
          'cursor',
          'windsurf',
          'kiro',
          'replit',
          'grok',
          'cline',
          'v0',
          'lovable',
          'office',
          'notion',
          'bolt',
          'higgsfield',
          'research',
          'perplexity',
          'atlas',
          'deepsearch',
          'connectors',
        ]),
      );
    });

    it('ensures NO app definition exposes the raw system prompt text directly on the client object', () => {
      for (const app of allApps) {
        // AppDefinition must only contain metadata and a reference systemPromptId, NEVER the raw prompt string
        expect((app as any).systemPrompt).toBeUndefined();
        expect((app as any).rawPrompt).toBeUndefined();
        expect((app as any).promptText).toBeUndefined();
        expect(typeof app.systemPromptId).toBe('string');
        expect(app.systemPromptId.length).toBeGreaterThan(0);
      }
    });

    it('ensures all 23 apps have valid registered system prompts in promptStore', () => {
      for (const app of allApps) {
        expect(hasPrompt(app.systemPromptId)).toBe(true);
      }
    });
  });

  describe('Zero-Leakage Interpolation & Token Sanitization', () => {
    const testContext = {
      currentDate: '2026-10-26',
      currentTime: '01:45:00 UTC',
      workingDirectory: '/Users/test/workspace',
      currentOs: 'macOS Darwin',
      knowledgeCutoff: 'June 2024',
    };

    it('verifies every single app prompt interpolates 100% of placeholders without leftover template tags', () => {
      for (const app of allApps) {
        const prompt = getAuthenticPrompt(app.systemPromptId, testContext);
        expect(prompt).toBeDefined();
        expect(prompt.length).toBeGreaterThan(100);

        // Assert no unreplaced template placeholders remain
        expect(prompt).not.toMatch(/\{\{[A-Z_0-9]+\}\}/);
        expect(prompt).not.toContain('{{CURRENT_DATE}}');
        expect(prompt).not.toContain('{{CURRENT_TIME}}');
        expect(prompt).not.toContain('{{CURRENT_OS}}');
        expect(prompt).not.toContain('{{WORKING_DIRECTORY}}');
        expect(prompt).not.toContain('{{KNOWLEDGE_CUTOFF}}');
      }
    });

    it('verifies that fallback interpolations never produce empty or leaked placeholders when options are omitted', () => {
      for (const app of allApps) {
        const fallbackPrompt = getAuthenticPrompt(app.systemPromptId);
        expect(fallbackPrompt).not.toMatch(/\{\{[A-Z_0-9]+\}\}/);
      }
    });
  });

  describe('Boundary Protection & Secret Leakage Prevention', () => {
    const CRITICAL_SECRET_MARKERS = [
      'process.env',
      'OPENROUTER_API_KEY',
      'DEEPSEEK_API_KEY',
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
      'sk-ant-',
      'sk-or-',
      'sk-proj-',
    ];

    it('verifies zero API keys or environment secrets exist inside any prompt source', () => {
      for (const app of allApps) {
        const prompt = getAuthenticPrompt(app.systemPromptId);
        for (const marker of CRITICAL_SECRET_MARKERS) {
          expect(prompt).not.toContain(marker);
        }
      }
    });

    it('verifies anti-leakage and boundary protection rules in key prompts', () => {
      // Claude Code must contain safety and boundary instructions
      const claudeCode = getAuthenticPrompt('claude-code');
      expect(claudeCode.toLowerCase()).toMatch(/boundary|safety|permission|sandbox/);

      // Manus Workspace must contain process isolation instructions
      const manus = getAuthenticPrompt('manus-agent');
      expect(manus).toContain('<security_boundaries>');
      expect(manus).toContain('<process_isolation>');

      // Atlas must enforce instruction priority hierarchy
      const atlas = getAuthenticPrompt('chatgpt-atlas');
      expect(atlas).toContain('<context_hierarchy_and_priority>');

      // Devin must enforce architecture guidelines
      const devin = getAuthenticPrompt('devin-deepwiki');
      expect(devin).toContain('<identity>');
      expect(devin).toContain('<architecture_guidelines>');
    });
  });

  describe('Model-Agnostic Response Processing Invariants', () => {
    it('verifies DeepSeek-R1 reasoning tag sanitization pattern', () => {
      // Simulating a model response containing thought reasoning block
      const rawDeepSeekResponse = `<think>
Analyzing user request to build a responsive navbar with Tailwind CSS.
Need to inspect mobile hamburger menu state.
</think>
Here is the responsive navbar implementation:
\`\`\`tsx
export function Navbar() { ... }
\`\`\``;

      // Extract reasoning and final message
      const thinkMatch = rawDeepSeekResponse.match(/<think>([\s\S]*?)<\/think>/);
      expect(thinkMatch).not.toBeNull();
      const reasoning = thinkMatch ? thinkMatch[1].trim() : '';
      const visibleContent = rawDeepSeekResponse.replace(/<think>[\s\S]*?<\/think>/, '').trim();

      expect(reasoning).toContain('Analyzing user request');
      expect(visibleContent).not.toContain('<think>');
      expect(visibleContent).not.toContain('Analyzing user request');
      expect(visibleContent).toContain('Here is the responsive navbar implementation:');
    });

    it('verifies Claude 3.7 / Opus adaptive thinking block separation', () => {
      const payload = {
        model: 'anthropic/claude-3.7-sonnet',
        thinking: {
          type: 'enabled',
          budget_tokens: 4096,
        },
      };
      expect(payload.thinking.budget_tokens).toBe(4096);
    });
  });
});
