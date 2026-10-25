import {
  exportToWordHtml,
  exportToCsv,
  exportToExcelXml,
  exportToPresentationHtml,
} from '../exporters';
import type { WordDocumentSpec, SpreadsheetSpec, PresentationSpec } from '../types';

describe('office exporters', () => {
  it('exports Word document to Word-compliant HTML with metadata and tables', () => {
    const doc: WordDocumentSpec = {
      title: 'Annual Report',
      author: 'Gabriel Odenhagen',
      date: '2026-02-15',
      sections: [
        {
          heading: 'Overview',
          paragraphs: ['Executive summary paragraph.'],
          callouts: [{ type: 'tip', text: 'Important tip' }],
          tables: [{ headers: ['Item', 'Cost'], rows: [['License', '$500']] }],
        },
      ],
    };

    const html = exportToWordHtml(doc);
    expect(html).toContain('urn:schemas-microsoft-com:office:word');
    expect(html).toContain('<h1 class="doc-title">Annual Report</h1>');
    expect(html).toContain('Gabriel Odenhagen');
    expect(html).toContain('Executive summary paragraph.');
    expect(html).toContain('class="callout callout-tip"');
    expect(html).toContain('<table class="doc-table">');
  });

  it('exports spreadsheet to RFC 4180 CSV with proper cell escaping', () => {
    const sheet = {
      name: 'Summary',
      columns: ['Name', 'Role, Scope', 'Salary'],
      rows: [
        ['Alice', 'Engineering Lead, Core', 180000],
        ['Bob', 'Designer', 140000],
      ],
    };

    const csv = exportToCsv(sheet);
    expect(csv).toContain('Name,"Role, Scope",Salary');
    expect(csv).toContain('Alice,"Engineering Lead, Core",180000');
  });

  it('exports spreadsheet to Excel XML preserving worksheets and cells', () => {
    const wb: SpreadsheetSpec = {
      title: 'Financials',
      sheets: [
        {
          name: 'P&L',
          columns: ['Metric', 'Value'],
          rows: [['Revenue', 50000]],
        },
      ],
    };

    const xml = exportToExcelXml(wb);
    expect(xml).toContain('urn:schemas-microsoft-com:office:spreadsheet');
    expect(xml).toContain('<Worksheet ss:Name="P&L">');
    expect(xml).toContain('<Data ss:Type="Number">50000</Data>');
  });

  it('exports presentation deck to interactive 16:9 widescreen HTML', () => {
    const deck: PresentationSpec = {
      title: 'Investor Pitch',
      theme: 'navy_executive',
      slides: [
        {
          id: 's1',
          title: 'Future of Autonomous AI',
          layout: 'title',
        },
        {
          id: 's2',
          title: 'Key Traction',
          layout: 'kpi_cards',
          metrics: [{ label: 'ARR', value: '$10M' }],
          speakerNotes: 'Highlight 100% YoY expansion.',
        },
      ],
    };

    const html = exportToPresentationHtml(deck);
    expect(html).toContain('class="slide-deck"');
    expect(html).toContain('Future of Autonomous AI');
    expect(html).toContain('$10M');
    expect(html).toContain('Highlight 100% YoY expansion.');
  });
});
