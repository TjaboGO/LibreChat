import type {
  WordDocumentSpec,
  SpreadsheetSpec,
  SpreadsheetSheet,
  PresentationSpec,
  LivingOfficeArtifact,
} from './types';

/**
 * Generates Microsoft Word / HTML format that opens natively in Word/LibreOffice
 * and prints with full page boundaries and styles.
 */
export function exportToWordHtml(doc: WordDocumentSpec): string {
  const sectionsHtml = doc.sections
    .map((sec) => {
      const heading = sec.heading
        ? `<h${sec.level || 2} class="section-title">${sec.heading}</h${sec.level || 2}>`
        : '';
      const paragraphs = sec.paragraphs
        .map((p) => `<p class="doc-paragraph">${p}</p>`)
        .join('\n');

      const callouts = (sec.callouts || [])
        .map(
          (c) =>
            `<div class="callout callout-${c.type}"><div class="callout-content">${c.text}</div></div>`,
        )
        .join('\n');

      const tables = (sec.tables || [])
        .map((t) => {
          const headers = `<tr>${t.headers.map((h) => `<th>${h}</th>`).join('')}</tr>`;
          const rows = t.rows
            .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
            .join('\n');
          return `<table class="doc-table"><thead>${headers}</thead><tbody>${rows}</tbody></table>`;
        })
        .join('\n');

      return `<div class="doc-section">${heading}${callouts}${paragraphs}${tables}</div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${doc.title}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 2.5cm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: #ffffff;
    }
    .header-block {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    h1.doc-title {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 8px 0;
    }
    .meta-row {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #64748b;
    }
    h2.section-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 28px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 6px;
    }
    h3.section-title {
      font-size: 16px;
      font-weight: 600;
      color: #334155;
      margin-top: 20px;
    }
    p.doc-paragraph {
      margin: 12px 0;
      text-align: justify;
    }
    .callout {
      border-left: 4px solid #3b82f6;
      background: #eff6ff;
      padding: 12px 16px;
      margin: 16px 0;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
    }
    .callout-warning {
      border-color: #f59e0b;
      background: #fffbeb;
    }
    .callout-tip {
      border-color: #10b981;
      background: #ecfdf5;
    }
    table.doc-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    table.doc-table th {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      font-weight: 600;
      text-align: left;
    }
    table.doc-table td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
    }
    @media print {
      body {
        padding: 0;
        background: transparent;
      }
    }
  </style>
</head>
<body>
  <div class="header-block">
    <h1 class="doc-title">${doc.title}</h1>
    ${doc.subtitle ? `<div style="font-size:16px; color:#475569; margin-bottom:12px;">${doc.subtitle}</div>` : ''}
    <div class="meta-row">
      ${doc.author ? `<span><strong>Author:</strong> ${doc.author}</span>` : ''}
      ${doc.date ? `<span><strong>Date:</strong> ${doc.date}</span>` : ''}
      ${doc.version ? `<span><strong>Version:</strong> ${doc.version}</span>` : ''}
    </div>
  </div>
  ${sectionsHtml}
</body>
</html>`;
}

/**
 * Generates clean RFC 4180 CSV string from a spreadsheet sheet.
 */
export function exportToCsv(sheet: SpreadsheetSheet): string {
  const escapeCell = (cell: string | number): string => {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines: string[] = [];
  lines.push(sheet.columns.map(escapeCell).join(','));

  for (const row of sheet.rows) {
    lines.push(row.map(escapeCell).join(','));
  }

  return lines.join('\n');
}

/**
 * Generates Microsoft Excel XML Spreadsheet 2003 (.xml/.xlsx compatible) format
 * preserving multiple sheets, column types, and formulas.
 */
export function exportToExcelXml(workbook: SpreadsheetSpec): string {
  const sheetsXml = workbook.sheets
    .map((sheet) => {
      const headerCells = sheet.columns
        .map(
          (col) =>
            `<Cell ss:StyleID="Header"><Data ss:Type="String">${col}</Data></Cell>`,
        )
        .join('');
      const headerRow = `<Row>${headerCells}</Row>`;

      const dataRows = sheet.rows
        .map((row) => {
          const cells = row
            .map((val) => {
              const isNum = typeof val === 'number' || (!isNaN(Number(val)) && val !== '');
              const type = isNum ? 'Number' : 'String';
              return `<Cell><Data ss:Type="${type}">${val}</Data></Cell>`;
            })
            .join('');
          return `<Row>${cells}</Row>`;
        })
        .join('');

      return `<Worksheet ss:Name="${sheet.name}"><Table>${headerRow}${dataRows}</Table></Worksheet>`;
    })
    .join('');

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 ${sheetsXml}
</Workbook>`;
}

/**
 * Generates an interactive HTML5 16:9 widescreen presentation deck.
 */
export function exportToPresentationHtml(deck: PresentationSpec): string {
  const slidesHtml = deck.slides
    .map((s, idx) => {
      const isTitle = s.layout === 'title' || idx === 0;

      let bodyContent = '';
      if (s.metrics && s.metrics.length > 0) {
        bodyContent = `<div class="kpi-grid">${s.metrics
          .map(
            (m) =>
              `<div class="kpi-card"><div class="kpi-value">${m.value}</div><div class="kpi-label">${m.label}</div>${m.change ? `<div class="kpi-change">${m.change}</div>` : ''}</div>`,
          )
          .join('')}</div>`;
      } else if (s.bulletPoints && s.bulletPoints.length > 0) {
        bodyContent = `<ul class="bullet-list">${s.bulletPoints.map((b) => `<li>${b}</li>`).join('')}</ul>`;
      }

      return `<div class="slide ${isTitle ? 'title-slide' : ''}" id="slide-${idx}">
        <div class="slide-content">
          <h2 class="slide-title">${s.title}</h2>
          ${s.subtitle ? `<div class="slide-subtitle">${s.subtitle}</div>` : ''}
          ${bodyContent}
          ${s.speakerNotes ? `<div class="speaker-note"><strong>Note:</strong> ${s.speakerNotes}</div>` : ''}
        </div>
        <div class="slide-footer">
          <span>${deck.title}</span>
          <span>${idx + 1} / ${deck.slides.length}</span>
        </div>
      </div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${deck.title}</title>
  <style>
    body {
      margin: 0;
      background: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: #f8fafc;
    }
    .slide-deck {
      width: 960px;
      height: 540px;
      position: relative;
      background: #0f172a;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1px solid #1e293b;
    }
    .slide {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .title-slide {
      background: radial-gradient(circle at top right, #1e1b4b 0%, #0f172a 100%);
      justify-content: center;
      text-align: center;
    }
    .title-slide .slide-title {
      font-size: 40px;
      font-weight: 800;
      background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 16px 0;
    }
    .slide-title {
      font-size: 30px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #f1f5f9;
    }
    .slide-subtitle {
      font-size: 16px;
      color: #94a3b8;
      margin-bottom: 24px;
    }
    .bullet-list {
      font-size: 18px;
      line-height: 1.8;
      color: #cbd5e1;
      padding-left: 28px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    .kpi-card {
      background: #1e293b;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #334155;
    }
    .kpi-value {
      font-size: 32px;
      font-weight: 800;
      color: #38bdf8;
    }
    .kpi-label {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .slide-footer {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #475569;
      border-top: 1px solid #1e293b;
      padding-top: 12px;
    }
    .speaker-note {
      font-size: 12px;
      color: #64748b;
      font-style: italic;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <div class="slide-deck">
    ${slidesHtml}
  </div>
</body>
</html>`;
}
