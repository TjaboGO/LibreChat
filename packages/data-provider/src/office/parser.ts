import type {
  WordDocumentSpec,
  WordSection,
  SpreadsheetSpec,
  SpreadsheetSheet,
  PresentationSpec,
  PresentationSlide,
  OfficeTable,
  OfficeCallout,
  OfficeDocumentType,
  LivingOfficeArtifact,
} from './types';

/**
 * Parses markdown table lines into an OfficeTable object.
 */
export function parseMarkdownTable(tableLines: string[]): OfficeTable | null {
  if (tableLines.length < 2) return null;

  const parseRow = (line: string): string[] => {
    return line
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((cell) => cell.trim());
  };

  const headers = parseRow(tableLines[0]);
  // line 1 is usually separator |---|---|
  const rows: string[][] = [];

  for (let i = 2; i < tableLines.length; i++) {
    const line = tableLines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      rows.push(parseRow(line));
    }
  }

  return { headers, rows };
}

/**
 * Parses markdown text into a structured WordDocumentSpec.
 */
export function parseWordDocument(markdown: string): WordDocumentSpec {
  const lines = markdown.split('\n');
  let title = 'Document Title';
  let subtitle: string | undefined;
  let author: string | undefined;
  let date: string | undefined;
  const sections: WordSection[] = [];

  let currentSection: WordSection = {
    paragraphs: [],
    tables: [],
    callouts: [],
  };

  let inTable = false;
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      const parsed = parseMarkdownTable(tableBuffer);
      if (parsed) {
        currentSection.tables = currentSection.tables || [];
        currentSection.tables.push(parsed);
      }
      tableBuffer = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for title (# Title)
    if (line.startsWith('# ') && title === 'Document Title' && sections.length === 0) {
      title = line.replace('# ', '').trim();
      continue;
    }

    // Check for metadata like *Author: Gabriel* or *Date: 2026-02-15*
    const authorMatch = /^\*?(?:Author|Författare):\s*([^*]+)\*?$/i.exec(line);
    if (authorMatch) {
      author = authorMatch[1].trim();
      continue;
    }

    const dateMatch = /^\*?(?:Date|Datum):\s*([^*]+)\*?$/i.exec(line);
    if (dateMatch) {
      date = dateMatch[1].trim();
      continue;
    }

    // Markdown Table detection
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true;
      tableBuffer.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Heading 2 or 3 starts a new section
    if (line.startsWith('## ')) {
      if (currentSection.paragraphs.length > 0 || (currentSection.tables && currentSection.tables.length > 0)) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: line.replace('## ', '').trim(),
        level: 2,
        paragraphs: [],
        tables: [],
        callouts: [],
      };
      continue;
    }

    if (line.startsWith('### ')) {
      if (currentSection.paragraphs.length > 0 || (currentSection.tables && currentSection.tables.length > 0)) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: line.replace('### ', '').trim(),
        level: 3,
        paragraphs: [],
        tables: [],
        callouts: [],
      };
      continue;
    }

    // Blockquote or Callout
    if (line.startsWith('>')) {
      const quoteText = line.replace(/^>\s*/, '').trim();
      let type: OfficeCallout['type'] = 'quote';
      let cleanText = quoteText;

      if (quoteText.startsWith('[!NOTE]') || quoteText.startsWith('[!INFO]')) {
        type = 'info';
        cleanText = quoteText.replace(/^\[!(?:NOTE|INFO)\]\s*/, '');
      } else if (quoteText.startsWith('[!WARNING]') || quoteText.startsWith('[!CAUTION]')) {
        type = 'warning';
        cleanText = quoteText.replace(/^\[!(?:WARNING|CAUTION)\]\s*/, '');
      } else if (quoteText.startsWith('[!TIP]')) {
        type = 'tip';
        cleanText = quoteText.replace(/^\[!TIP\]\s*/, '');
      }

      currentSection.callouts = currentSection.callouts || [];
      currentSection.callouts.push({ type, text: cleanText });
      continue;
    }

    // Plain text paragraph
    if (line.length > 0) {
      currentSection.paragraphs.push(line);
    }
  }

  flushTable();
  if (currentSection.paragraphs.length > 0 || (currentSection.tables && currentSection.tables.length > 0)) {
    sections.push(currentSection);
  }

  return {
    title,
    subtitle,
    author: author || 'Claude Executive Office',
    date: date || new Date().toLocaleDateString('sv-SE'),
    version: '1.0',
    sections: sections.length > 0 ? sections : [{ paragraphs: [markdown] }],
  };
}

/**
 * Parses CSV or Markdown tables into a SpreadsheetSpec.
 */
export function parseSpreadsheet(content: string, title = 'Workbook'): SpreadsheetSpec {
  const lines = content.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const isPiped = lines.some((l) => l.startsWith('|') && l.endsWith('|'));

  let columns: string[] = [];
  const rows: Array<Array<string | number>> = [];

  if (isPiped) {
    // Markdown table parsing
    const tableLines = lines.filter((l) => l.startsWith('|') && l.endsWith('|'));
    if (tableLines.length >= 2) {
      columns = tableLines[0].replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      for (let i = 2; i < tableLines.length; i++) {
        const cells = tableLines[i]
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => {
            const val = c.trim();
            const num = parseFloat(val.replace(/[$,%]/g, ''));
            return !isNaN(num) && /^[0-9.,$%-]+$/.test(val) ? num : val;
          });
        rows.push(cells);
      }
    }
  } else {
    // CSV parsing
    for (let i = 0; i < lines.length; i++) {
      const cells = lines[i].split(',').map((c) => {
        const val = c.replace(/^["']|["']$/g, '').trim();
        const num = parseFloat(val);
        return !isNaN(num) && /^[0-9.-]+$/.test(val) ? num : val;
      });
      if (i === 0) {
        columns = cells.map((c) => String(c));
      } else {
        rows.push(cells);
      }
    }
  }

  if (columns.length === 0) {
    columns = ['Column A', 'Column B', 'Column C', 'Total'];
    rows.push(['Q1 Actuals', 12000, 15000, 27000]);
    rows.push(['Q2 Forecast', 14500, 18200, 32700]);
    rows.push(['Q3 Estimate', 17000, 21000, 38000]);
  }

  const sheet: SpreadsheetSheet = {
    name: 'Sheet 1',
    columns,
    rows,
    formulas: {},
  };

  return {
    title,
    sheets: [sheet],
    activeSheetIndex: 0,
  };
}

/**
 * Parses markdown into 16:9 Presentation slides.
 */
export function parsePresentation(markdown: string): PresentationSpec {
  // Slides are split by "---" horizontal rules or "# Slide" headers
  const rawSlides = markdown.split(/\n---\n|\n(?=# Slide|\n# )/g);
  const slides: PresentationSlide[] = [];
  let mainTitle = 'Executive Pitch Deck';
  let mainSubtitle = 'Strategic Overview & Key Metrics';

  rawSlides.forEach((raw, idx) => {
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) return;

    let slideTitle = `Slide ${idx + 1}`;
    let slideSubtitle: string | undefined;
    const bullets: string[] = [];
    const metrics: PresentationSlide['metrics'] = [];
    let speakerNotes = '';

    for (const line of lines) {
      if (line.startsWith('# ')) {
        slideTitle = line.replace('# ', '').trim();
        if (idx === 0) mainTitle = slideTitle;
      } else if (line.startsWith('## ')) {
        slideSubtitle = line.replace('## ', '').trim();
        if (idx === 0) mainSubtitle = slideSubtitle;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        bullets.push(line.slice(2).trim());
      } else if (/^(?:Note|Talarnoter|Speaker Note):\s*(.*)/i.test(line)) {
        speakerNotes = line.replace(/^(?:Note|Talarnoter|Speaker Note):\s*/i, '');
      } else {
        // Check for KPI pattern: "Metric: $12M (+20%)"
        const metricMatch = /^([A-Za-z\s]+):\s*([$€£¥0-9.,%MKB]+)(?:\s*\(([^)]+)\))?$/i.exec(line);
        if (metricMatch) {
          metrics.push({
            label: metricMatch[1].trim(),
            value: metricMatch[2].trim(),
            change: metricMatch[3]?.trim(),
          });
        }
      }
    }

    const layout =
      idx === 0
        ? 'title'
        : metrics.length >= 2
          ? 'kpi_cards'
          : 'bullet_split';

    slides.push({
      id: `slide-${idx + 1}`,
      title: slideTitle,
      subtitle: slideSubtitle,
      layout,
      bulletPoints: bullets.length > 0 ? bullets : undefined,
      metrics: metrics.length > 0 ? metrics : undefined,
      speakerNotes: speakerNotes || undefined,
    });
  });

  return {
    title: mainTitle,
    subtitle: mainSubtitle,
    theme: 'navy_executive',
    slides: slides.length > 0 ? slides : [
      {
        id: 'slide-1',
        title: mainTitle,
        subtitle: mainSubtitle,
        layout: 'title',
      },
    ],
  };
}

/**
 * Unified parser returning a LivingOfficeArtifact.
 */
export function parseLivingOfficeArtifact(
  content: string,
  typeHint: OfficeDocumentType = 'docx',
  title = 'Living Office Document',
): LivingOfficeArtifact {
  const now = new Date().toISOString();
  const artifact: LivingOfficeArtifact = {
    id: `office_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: typeHint,
    title,
    rawContent: content,
    createdAt: now,
    updatedAt: now,
  };

  if (typeHint === 'xlsx') {
    artifact.spreadsheetSpec = parseSpreadsheet(content, title);
  } else if (typeHint === 'pptx') {
    artifact.presentationSpec = parsePresentation(content);
  } else {
    artifact.wordSpec = parseWordDocument(content);
  }

  return artifact;
}
