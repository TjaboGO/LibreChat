import {
  OPENAI_ATLAS_PROMPT,
  OPENAI_GPT5_SOL_PROMPT,
  OPENAI_O3_MINI_PROMPT,
  OPENAI_LIVING_OFFICE_PROMPT,
  OPENAI_OFFICE_SANDBOX_DIRECTIVES,
} from '../prompts/openAiFrontier';
import { getAuthenticPrompt, hasPrompt, interpolatePrompt } from '../promptStore';
import { getAppDefinition } from '../appsRegistry';

describe('OpenAI Frontier Suite Prompts (Fas 35)', () => {
  describe('OPENAI_ATLAS_PROMPT (ChatGPT Atlas Browser Companion)', () => {
    it('contains all required browser modes and context hierarchy', () => {
      expect(OPENAI_ATLAS_PROMPT).toContain('<identity>');
      expect(OPENAI_ATLAS_PROMPT).toContain('<browser_modes>');
      expect(OPENAI_ATLAS_PROMPT).toContain('<context_hierarchy_and_priority>');
      expect(OPENAI_ATLAS_PROMPT).toContain('<browser_tools_guidance>');

      // Browser modes
      expect(OPENAI_ATLAS_PROMPT).toContain('Full-Page Chat');
      expect(OPENAI_ATLAS_PROMPT).toContain('Web Browsing');
      expect(OPENAI_ATLAS_PROMPT).toContain('Web Browsing with Side Chat');

      // Context hierarchy & priorities
      expect(OPENAI_ATLAS_PROMPT).toContain('Developer messages');
      expect(OPENAI_ATLAS_PROMPT).toContain('Page context');
      expect(OPENAI_ATLAS_PROMPT).toContain('Instruction Priority:');
      expect(OPENAI_ATLAS_PROMPT).toContain('User selected text');

      // Tools guidance
      expect(OPENAI_ATLAS_PROMPT).toContain('file_search tool');
      expect(OPENAI_ATLAS_PROMPT).toContain('Python tool');
      expect(OPENAI_ATLAS_PROMPT).toContain('web tool');
      expect(OPENAI_ATLAS_PROMPT).toContain('Blocked or Missing Content');
    });

    it('contains expected placeholders and interpolates cleanly', () => {
      expect(OPENAI_ATLAS_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(OPENAI_ATLAS_PROMPT).toContain('{{CURRENT_TIME}}');
      expect(OPENAI_ATLAS_PROMPT).toContain('{{CURRENT_OS}}');
      expect(OPENAI_ATLAS_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');

      const interpolated = interpolatePrompt(OPENAI_ATLAS_PROMPT, {
        currentDate: '2026-10-26',
        currentTime: '12:00:00 UTC',
        currentOs: 'macOS Sequoia',
        knowledgeCutoff: 'June 2026',
      });

      expect(interpolated).not.toContain('{{CURRENT_DATE}}');
      expect(interpolated).not.toContain('{{CURRENT_TIME}}');
      expect(interpolated).not.toContain('{{CURRENT_OS}}');
      expect(interpolated).not.toContain('{{KNOWLEDGE_CUTOFF}}');
      expect(interpolated).toContain('Current date: 2026-10-26.');
      expect(interpolated).toContain('Operating system: macOS Sequoia.');
    });
  });

  describe('OPENAI_GPT5_SOL_PROMPT (GPT-5.6 Sol Multi-Artifact & Reasoning)', () => {
    it('contains all required structural sections and sandbox skills', () => {
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('<identity>');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('<environment_and_sandbox_skills>');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('<sandbox_artifacts_guidelines>');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('<communication_style_and_anti_patronizing>');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('<tool_execution_discipline>');

      // Artifact & Sandbox specifications
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('Word document creation and editing (.docx)');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('slide presentation creation and editing (.pptx)');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('openpyxl are installed for spreadsheet tasks (.xlsx)');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('sandbox:/mnt/data/<filename>.<ext>');

      // Anti-patronizing & anti-verbal tics
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('let\'s pause');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('let\'s take a breath');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('Honestly?...');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('# My honest recommendation');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('Write cohesive, compact prose paragraphs');

      // Tool discipline
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('timeout of 45 seconds');
      expect(OPENAI_GPT5_SOL_PROMPT).toContain('OCR as a high-cost, last-resort tool');
    });

    it('interpolates workspace and OS dynamically', () => {
      const interpolated = getAuthenticPrompt('gpt-5-sol', {
        workingDirectory: '/home/developer/app',
        currentOs: 'linux',
      });

      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).not.toContain('{{CURRENT_OS}}');
      expect(interpolated).toContain('Workspace environment: /home/developer/app on linux.');
    });
  });

  describe('OPENAI_O3_MINI_PROMPT (Deep Step-by-Step Thinking & STEM Reasoning)', () => {
    it('contains all required reasoning principles and analysis channel directives', () => {
      expect(OPENAI_O3_MINI_PROMPT).toContain('<identity>');
      expect(OPENAI_O3_MINI_PROMPT).toContain('<reasoning_and_thinking_principles>');
      expect(OPENAI_O3_MINI_PROMPT).toContain('<python_analysis_channel>');
      expect(OPENAI_O3_MINI_PROMPT).toContain('<tone_and_citation_discipline>');

      // Step-by-step thinking & arithmetic verification
      expect(OPENAI_O3_MINI_PROMPT).toContain('internal chain-of-thought analysis channel');
      expect(OPENAI_O3_MINI_PROMPT).toContain('calculate step-by-step and digit-by-digit');
      expect(OPENAI_O3_MINI_PROMPT).toContain('Second-guess classic riddles');
      expect(OPENAI_O3_MINI_PROMPT).toContain('/mnt/data persists user files');
      expect(OPENAI_O3_MINI_PROMPT).toContain('Avoid purple prose');
    });

    it('interpolates date and cutoff correctly', () => {
      const interpolated = getAuthenticPrompt('o3-mini', {
        knowledgeCutoff: 'June 2026',
      });

      expect(interpolated).not.toContain('{{KNOWLEDGE_CUTOFF}}');
      expect(interpolated).toContain('Knowledge cutoff: June 2026.');
    });
  });

  describe('Living Office Suite & Sandbox Directives', () => {
    it('contains directives for Word, Excel, and PowerPoint generation', () => {
      expect(OPENAI_OFFICE_SANDBOX_DIRECTIVES).toContain('Word Documents (.docx)');
      expect(OPENAI_OFFICE_SANDBOX_DIRECTIVES).toContain('Excel Workbooks (.xlsx)');
      expect(OPENAI_OFFICE_SANDBOX_DIRECTIVES).toContain('PowerPoint Presentations (.pptx)');
      expect(OPENAI_OFFICE_SANDBOX_DIRECTIVES).toContain('sandbox:/mnt/data/<filename>.<ext>');

      expect(OPENAI_LIVING_OFFICE_PROMPT).toContain('<identity>');
      expect(OPENAI_LIVING_OFFICE_PROMPT).toContain('Living Office Suite Generator');
      expect(OPENAI_LIVING_OFFICE_PROMPT).toContain(OPENAI_OFFICE_SANDBOX_DIRECTIVES);
    });

    it('resolves office app to OPENAI_LIVING_OFFICE_PROMPT with platform interpolation', () => {
      const prompt = getAuthenticPrompt('office', {
        appName: 'Claude All-in-One AI Suite',
      });

      expect(prompt).not.toContain('{{APP_NAME}}');
      expect(prompt).toContain('Platform: Claude All-in-One AI Suite.');
      expect(prompt).toContain('Word Documents (.docx)');
      expect(prompt).toContain('Excel Workbooks (.xlsx)');
    });
  });

  describe('App Registry & System Prompt Resolution Aliases', () => {
    it('resolves atlas app and chatgpt-atlas prompt identifier', () => {
      const app = getAppDefinition('atlas');
      expect(app).toBeDefined();
      expect(app?.systemPromptId).toBe('chatgpt-atlas');

      const byAppId = getAuthenticPrompt('atlas');
      const byPromptId = getAuthenticPrompt('chatgpt-atlas');
      expect(byAppId).toBe(byPromptId);
      expect(byAppId).toContain('You are ChatGPT Atlas');
    });

    it('resolves gpt-5-sol aliases (gpt-5-sol, gpt5, sol)', () => {
      expect(hasPrompt('gpt-5-sol')).toBe(true);
      expect(hasPrompt('gpt5')).toBe(true);
      expect(hasPrompt('sol')).toBe(true);

      const p1 = getAuthenticPrompt('gpt-5-sol');
      const p2 = getAuthenticPrompt('gpt5');
      const p3 = getAuthenticPrompt('sol');

      expect(p1).toBe(p2);
      expect(p2).toBe(p3);
      expect(p1).toContain('GPT-5.6 Sol');
    });

    it('resolves o3-mini aliases (o3-mini, o3)', () => {
      expect(hasPrompt('o3-mini')).toBe(true);
      expect(hasPrompt('o3')).toBe(true);

      const p1 = getAuthenticPrompt('o3-mini');
      const p2 = getAuthenticPrompt('o3');

      expect(p1).toBe(p2);
      expect(p1).toContain('OpenAI o3-mini');
    });
  });
});
