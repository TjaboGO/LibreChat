import {
  parseMarkdownTable,
  parseWordDocument,
  parseSpreadsheet,
  parsePresentation,
  parseLivingOfficeArtifact,
} from '../parser';

describe('office parser', () => {
  it('parses markdown tables accurately', () => {
    const tableLines = [
      '| Metric | Q1 | Q2 |',
      '| --- | --- | --- |',
      '| Revenue | $10M | $12M |',
      '| Margin | 40% | 45% |',
    ];

    const table = parseMarkdownTable(tableLines);
    expect(table).not.toBeNull();
    expect(table?.headers).toEqual(['Metric', 'Q1', 'Q2']);
    expect(table?.rows.length).toBe(2);
    expect(table?.rows[0]).toEqual(['Revenue', '$10M', '$12M']);
  });

  it('parses structured Word documents with callouts and sections', () => {
    const md = `# Quarterly Strategic Review
*Author: Gabriel Odenhagen*
*Date: 2026-02-15*

> [!NOTE] Executive Summary
> This quarter demonstrated strong double digit growth across all sectors.

## 1. Architectural Strategy
We migrated from single-agent pipelines to distributed multi-agent systems.

| Component | Status | Latency |
| --- | --- | --- |
| Planner | Active | 120ms |
| Synthesizer | Active | 85ms |

## 2. Risk Factors
> [!WARNING] Context Window Contraction
> Watch out for tool parameter degradation.
`;

    const doc = parseWordDocument(md);
    expect(doc.title).toBe('Quarterly Strategic Review');
    expect(doc.author).toBe('Gabriel Odenhagen');
    expect(doc.date).toBe('2026-02-15');
    expect(doc.sections.length).toBeGreaterThanOrEqual(2);

    const sec1 = doc.sections.find((s) => s.heading?.includes('Architectural'));
    expect(sec1).toBeDefined();
    expect(sec1?.tables?.length).toBe(1);
    expect(sec1?.tables?.[0].headers).toEqual(['Component', 'Status', 'Latency']);
  });

  it('parses CSV into spreadsheet workbook', () => {
    const csv = `Quarter,Revenue,Expenses,Net Income
Q1,10000,6000,4000
Q2,12500,7000,5500
Q3,15000,8000,7000`;

    const wb = parseSpreadsheet(csv, 'Financial Model');
    expect(wb.title).toBe('Financial Model');
    expect(wb.sheets.length).toBe(1);
    expect(wb.sheets[0].columns).toEqual(['Quarter', 'Revenue', 'Expenses', 'Net Income']);
    expect(wb.sheets[0].rows.length).toBe(3);
    expect(wb.sheets[0].rows[0][1]).toBe(10000);
  });

  it('parses 16:9 presentation slides with KPI cards', () => {
    const slidesMd = `# AI Agents Platform 2026
## Board of Directors Presentation

---

# Key Growth Highlights
ARR: $24M (+120%)
Enterprise Customers: 450 (+85%)
Net Retention: 142%

Note: Mention our expansion into Fortune 500 accounts.

---

# Strategic Roadmap
- Autonomous deep research engine
- Self-healing live development server
- Living office document suite
`;

    const deck = parsePresentation(slidesMd);
    expect(deck.title).toBe('AI Agents Platform 2026');
    expect(deck.slides.length).toBe(3);
    expect(deck.slides[0].layout).toBe('title');

    const kpiSlide = deck.slides[1];
    expect(kpiSlide.layout).toBe('kpi_cards');
    expect(kpiSlide.metrics?.length).toBe(3);
    expect(kpiSlide.metrics?.[0].value).toBe('$24M');
    expect(kpiSlide.speakerNotes).toContain('Fortune 500');

    const bulletSlide = deck.slides[2];
    expect(bulletSlide.bulletPoints?.length).toBe(3);
  });

  it('creates unified LivingOfficeArtifact wrapper', () => {
    const artifact = parseLivingOfficeArtifact('# My Document\nContent paragraph.', 'docx', 'My Title');
    expect(artifact.id).toMatch(/^office_/);
    expect(artifact.type).toBe('docx');
    expect(artifact.wordSpec?.title).toBe('My Document');
  });
});
