import {
  NOTION_AI_STUDIO_PROMPT,
  NOTION_PROMPT,
  LIVING_OFFICE_SUITE_PROMPT,
  OFFICE_PROMPT,
} from '../prompts/officeNotionPrompts';
import { getAuthenticPrompt, hasPrompt } from '../promptStore';
import { getAppDefinition } from '../appsRegistry';

describe('Living Office Suite & Notion AI Studio Prompts (Fas 42)', () => {
  describe('LIVING_OFFICE_SUITE_PROMPT', () => {
    it('contains identity and office suite capabilities for Word, Excel, PPT, and PDF', () => {
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('<identity>');
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('Living Office Suite Generator');
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('Word Documents (.docx)');
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('Excel Spreadsheets (.xlsx)');
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('PowerPoint Slide Decks (.pptx)');
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('=SUM, =AVERAGE');
    });

    it('contains dynamic environment placeholders', () => {
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('{{CURRENT_OS}}');
      expect(LIVING_OFFICE_SUITE_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');
    });

    it('exports OFFICE_PROMPT alias', () => {
      expect(OFFICE_PROMPT).toBe(LIVING_OFFICE_SUITE_PROMPT);
    });
  });

  describe('NOTION_AI_STUDIO_PROMPT', () => {
    it('contains identity, workspace concepts, and relational database directives', () => {
      expect(NOTION_AI_STUDIO_PROMPT).toContain('<identity>');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('Notion AI Studio');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('<notion_capabilities>');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('Databases');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('Data Sources');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('Pages');
    });

    it('contains property types and rich block formatting', () => {
      expect(NOTION_AI_STUDIO_PROMPT).toContain('select');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('formula');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('relation');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('callout');
    });

    it('contains dynamic environment placeholders', () => {
      expect(NOTION_AI_STUDIO_PROMPT).toContain('{{CURRENT_DATE}}');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('{{WORKING_DIRECTORY}}');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('{{CURRENT_OS}}');
      expect(NOTION_AI_STUDIO_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');
    });

    it('exports NOTION_PROMPT alias', () => {
      expect(NOTION_PROMPT).toBe(NOTION_AI_STUDIO_PROMPT);
    });
  });

  describe('PromptStore Integration', () => {
    it('registers prompts for office and notion', () => {
      expect(hasPrompt('office')).toBe(true);
      expect(hasPrompt('living-office')).toBe(true);
      expect(hasPrompt('notion')).toBe(true);
      expect(hasPrompt('notion-studio')).toBe(true);
    });

    it('matches appsRegistry definition and interpolates correctly for Office', () => {
      const officeApp = getAppDefinition('office');
      expect(officeApp).toBeDefined();
      expect(officeApp?.name).toBe('Living Office Suite');
      expect(officeApp?.systemPromptId).toBe('living-office');

      const interpolated = getAuthenticPrompt(officeApp?.systemPromptId, {
        currentDate: '2026-10-26',
        workingDirectory: '/home/documents/office',
        currentOs: 'macOS',
      });
      expect(interpolated).not.toContain('{{CURRENT_DATE}}');
      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).toContain('Date: 2026-10-26.');
      expect(interpolated).toContain('Working directory: /home/documents/office.');
    });

    it('matches appsRegistry definition and interpolates correctly for Notion', () => {
      const notionApp = getAppDefinition('notion');
      expect(notionApp).toBeDefined();
      expect(notionApp?.name).toBe('Notion AI Studio');
      expect(notionApp?.systemPromptId).toBe('notion-studio');

      const interpolated = getAuthenticPrompt(notionApp?.systemPromptId, {
        currentDate: '2026-10-26',
        workingDirectory: '/home/workspace/notion',
        currentOs: 'macOS',
      });
      expect(interpolated).not.toContain('{{CURRENT_DATE}}');
      expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
      expect(interpolated).toContain('Date: 2026-10-26.');
      expect(interpolated).toContain('Working directory: /home/workspace/notion.');
    });
  });
});
