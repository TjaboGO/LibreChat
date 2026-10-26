import { useState, memo, useMemo } from 'react';
import {
  evaluateFormula,
  exportToExcelXml,
  exportToWordHtml,
  exportToPresentationHtml,
} from 'librechat-data-provider';
import {
  FileSpreadsheet,
  FileText,
  Presentation,
  FileDown,
  Printer,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Copy,
  Info,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { triggerDownload, cn } from '~/utils';

export type OfficeTab = 'xlsx' | 'docx' | 'pptx' | 'pdf';

export interface SpreadsheetRow {
  id: string;
  category: string;
  q1: number | string;
  q2: number | string;
  q3: number | string;
  q4: number | string;
  totalFormula: string;
}

export interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  kpis: Array<{ label: string; value: string; change: string }>;
  speakerNotes: string;
}

export const INITIAL_SPREADSHEET_ROWS: SpreadsheetRow[] = [
  { id: '1', category: 'Software Subscriptions (SaaS)', q1: 12500, q2: 15400, q3: 18900, q4: 24500, totalFormula: '=SUM(B2:E2)' },
  { id: '2', category: 'Cloud Infrastructure & AI Compute', q1: 32000, q2: 41000, q3: 52000, q4: 67000, totalFormula: '=SUM(B3:E3)' },
  { id: '3', category: 'Professional Services & Consulting', q1: 8500, q2: 9200, q3: 11000, q4: 14000, totalFormula: '=SUM(B4:E4)' },
  { id: '4', category: 'R&D Product Innovations', q1: 18000, q2: 21500, q3: 26000, q4: 31000, totalFormula: '=SUM(B5:E5)' },
];

export const INITIAL_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: 'Series A Executive Strategy',
    subtitle: 'Accelerating AI Transformation & Living Document Workspaces',
    bulletPoints: [
      'Empower knowledge workers with conversational office document generation',
      'Unified reactive spreadsheet models with dynamic live formulas',
      'Seamless multi-format exports to authentic .docx, .xlsx, and .pptx',
    ],
    kpis: [
      { label: 'ARR Run-Rate', value: '$4.2M', change: '+184% YoY' },
      { label: 'Active Teams', value: '1,420', change: '+68% QoQ' },
      { label: 'Net Dollar Retention', value: '138%', change: 'Top Decile' },
    ],
    speakerNotes: 'Open with high-level trajectory. Emphasize our unique AI-native formula recalculation engine.',
  },
  {
    id: 2,
    title: 'Platform Architecture & Engine',
    subtitle: 'From LLM Reasoning to Strict Office OpenXML Binary Specifications',
    bulletPoints: [
      'Pure browser client execution for zero-latency instant calculation',
      'Sandboxed formula evaluation supporting standard Excel functions',
      'Direct compatibility with Microsoft 365, Google Workspace, and Apple iWork',
    ],
    kpis: [
      { label: 'Latency', value: '<25ms', change: 'Real-Time' },
      { label: 'Formula Accuracy', value: '100%', change: 'Verified' },
      { label: 'Zero Cloud Leak', value: 'Local', change: 'Secure' },
    ],
    speakerNotes: 'Highlight client-side safety and adherence to ISO/IEC 29500 Office Open XML standards.',
  },
];

export interface OfficeWorkspaceViewProps {
  onSelectPrompt?: (prompt: string) => void;
  defaultCollapsed?: boolean;
}

export const OfficeWorkspaceView = memo(function OfficeWorkspaceView({
  onSelectPrompt,
  defaultCollapsed = false,
}: OfficeWorkspaceViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<OfficeTab>('xlsx');
  const [spreadsheetRows, setSpreadsheetRows] = useState<SpreadsheetRow[]>(INITIAL_SPREADSHEET_ROWS);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Compute live matrix for Excel formulas
  const matrix = useMemo(() => {
    return spreadsheetRows.map((r) => [r.category, Number(r.q1) || 0, Number(r.q2) || 0, Number(r.q3) || 0, Number(r.q4) || 0]);
  }, [spreadsheetRows]);

  // Compute column totals and overall sums dynamically
  const totals = useMemo(() => {
    let q1Total = 0;
    let q2Total = 0;
    let q3Total = 0;
    let q4Total = 0;

    const rowTotals = spreadsheetRows.map((r, idx) => {
      const rowVals = [Number(r.q1) || 0, Number(r.q2) || 0, Number(r.q3) || 0, Number(r.q4) || 0];
      q1Total += rowVals[0];
      q2Total += rowVals[1];
      q3Total += rowVals[2];
      q4Total += rowVals[3];
      // Evaluate row sum using evaluateFormula
      const evaluated = evaluateFormula(`=SUM(B${idx + 2}:E${idx + 2})`, [
        ['Category', 'Q1', 'Q2', 'Q3', 'Q4'],
        ...matrix,
      ]);
      return typeof evaluated === 'number' ? evaluated : rowVals.reduce((a, b) => a + b, 0);
    });

    const grandTotal = q1Total + q2Total + q3Total + q4Total;
    const averagePerQuarter = grandTotal / 4;

    return { q1Total, q2Total, q3Total, q4Total, rowTotals, grandTotal, averagePerQuarter };
  }, [spreadsheetRows, matrix]);

  const handleCellChange = (rowIndex: number, field: keyof SpreadsheetRow, val: string) => {
    setSpreadsheetRows((prev) => {
      const updated = [...prev];
      const numericVal = parseFloat(val) || 0;
      updated[rowIndex] = {
        ...updated[rowIndex],
        [field]: field === 'category' ? val : numericVal,
      };
      return updated;
    });
  };

  const handleAddRow = () => {
    setSpreadsheetRows((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        category: 'New Expansion Initiative',
        q1: 10000,
        q2: 12000,
        q3: 15000,
        q4: 18000,
        totalFormula: `=SUM(B${prev.length + 2}:E${prev.length + 2})`,
      },
    ]);
  };

  const handleExportExcel = () => {
    const rawMatrix: Array<Array<string | number>> = [
      ['Initiative / Category', 'Q1 (USD)', 'Q2 (USD)', 'Q3 (USD)', 'Q4 (USD)', 'Total (USD)'],
      ...spreadsheetRows.map((r, idx) => [
        r.category,
        Number(r.q1),
        Number(r.q2),
        Number(r.q3),
        Number(r.q4),
        totals.rowTotals[idx],
      ]),
      ['Grand Total', totals.q1Total, totals.q2Total, totals.q3Total, totals.q4Total, totals.grandTotal],
    ];

    const xml = exportToExcelXml({
      title: 'Living_Office_Financial_Model',
      sheets: [
        {
          name: 'Forecast Model',
          columns: ['Category', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
          rows: rawMatrix.slice(1),
        },
      ],
    });

    triggerDownload(`data:application/vnd.ms-excel;charset=utf-8,${encodeURIComponent(xml)}`, 'Financial_Model.xlsx');
    setExportNotice('Exported Financial_Model.xlsx successfully!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleExportWord = () => {
    const wordHtml = exportToWordHtml({
      title: 'Strategic Executive Brief',
      sections: [
        {
          heading: '1. Executive Overview',
          paragraphs: ['This document presents the strategic initiatives and calculated financial projections for 2026.'],
        },
        {
          heading: '2. Financial Summary Matrix',
          paragraphs: [`Total annual projected revenue stands at $${totals.grandTotal.toLocaleString()} with average quarterly delivery of $${totals.averagePerQuarter.toLocaleString()}.`],
        },
      ],
    });

    triggerDownload(`data:application/msword;charset=utf-8,${encodeURIComponent(wordHtml)}`, 'Executive_Brief.docx');
    setExportNotice('Exported Executive_Brief.docx successfully!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleExportPresentation = () => {
    const pptHtml = exportToPresentationHtml({
      title: 'Series A Executive Strategy',
      slides: INITIAL_SLIDES.map((s) => ({
        title: s.title,
        subtitle: s.subtitle,
        bulletPoints: s.bulletPoints,
        speakerNotes: s.speakerNotes,
      })),
    });

    triggerDownload(`data:application/vnd.ms-powerpoint;charset=utf-8,${encodeURIComponent(pptHtml)}`, 'Strategy_Deck.pptx');
    setExportNotice('Exported Strategy_Deck.pptx successfully!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  if (isCollapsed) {
    return (
      <div
        data-testid="office-studio-collapsed"
        className="w-8 border-l border-border bg-card/60 backdrop-blur flex flex-col items-center py-4 select-none shrink-0"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          data-testid="office-studio-expand-btn"
          title="Expand Living Office Suite"
          aria-label="Expand Living Office Suite"
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground hover:scale-105 transition"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-500" />
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-semibold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            Living Office
          </span>
        </button>
      </div>
    );
  }

  const activeSlide = INITIAL_SLIDES[currentSlideIndex];

  return (
    <div
      data-testid="office-workspace-panel"
      className="w-[540px] xl:w-[620px] border-l border-border bg-card/90 backdrop-blur flex flex-col h-full shrink-0 select-none z-10 transition-all duration-200"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-tight text-foreground">Living Office Suite</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/20 font-medium">
                ISO/IEC 29500
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Word (.docx), Excel (.xlsx), PPT (.pptx) & PDF</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('xlsx')}
            data-testid="office-tab-xlsx"
            className={cn(
              'px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'xlsx'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => setActiveTab('docx')}
            data-testid="office-tab-docx"
            className={cn(
              'px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'docx'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Word</span>
          </button>
          <button
            onClick={() => setActiveTab('pptx')}
            data-testid="office-tab-pptx"
            className={cn(
              'px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'pptx'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span>Slides</span>
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            data-testid="office-tab-pdf"
            className={cn(
              'px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'pdf'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Printer className="w-3.5 h-3.5 text-rose-400" />
            <span>PDF</span>
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(true)}
          data-testid="office-studio-collapse-btn"
          title="Collapse Living Office"
          aria-label="Collapse Living Office"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Notification Banner */}
      {exportNotice && (
        <div className="px-3 py-1.5 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Main Content Stage */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        {/* TAB 1: EXCEL SPREADSHEET WITH LIVE FORMULAS */}
        {activeTab === 'xlsx' && (
          <div data-testid="office-xlsx-stage" className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-2.5 border-b border-border bg-muted/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Financial Forecast Model</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  =SUM & =AVERAGE Live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddRow}
                  data-testid="office-add-row-btn"
                  className="px-2 py-1 rounded-md border border-border bg-background hover:bg-muted text-foreground flex items-center gap-1 transition text-xs font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Row</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  data-testid="office-export-xlsx-btn"
                  className="px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1 transition text-xs font-semibold shadow-xs"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Export .xlsx</span>
                </button>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 gap-2 p-3 border-b border-border bg-muted/10">
              <div className="p-2.5 rounded-lg border border-border bg-card space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Annual Forecast</span>
                <div className="text-lg font-bold font-mono text-emerald-400">
                  ${totals.grandTotal.toLocaleString()}
                </div>
                <span className="text-[10px] text-zinc-500">Live sum of all line items</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-card space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Average Quarterly Velocity</span>
                <div className="text-lg font-bold font-mono text-primary">
                  ${Math.round(totals.averagePerQuarter).toLocaleString()}
                </div>
                <span className="text-[10px] text-zinc-500">=AVERAGE(Q1:Q4) calculated</span>
              </div>
            </div>

            {/* Editable Spreadsheet Grid */}
            <div className="flex-1 overflow-auto p-3">
              <table className="w-full text-xs text-left border-collapse border border-border font-mono">
                <thead>
                  <tr className="bg-muted/60 text-muted-foreground uppercase text-[10px]">
                    <th className="p-2 border border-border">Initiative / Category</th>
                    <th className="p-2 border border-border text-right">Q1 ($)</th>
                    <th className="p-2 border border-border text-right">Q2 ($)</th>
                    <th className="p-2 border border-border text-right">Q3 ($)</th>
                    <th className="p-2 border border-border text-right">Q4 ($)</th>
                    <th className="p-2 border border-border text-right font-bold text-emerald-400">Total (=SUM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {spreadsheetRows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-muted/20 transition">
                      <td className="p-1.5 border border-border">
                        <input
                          type="text"
                          value={row.category}
                          onChange={(e) => handleCellChange(idx, 'category', e.target.value)}
                          className="w-full bg-transparent border-none text-foreground text-xs focus:outline-hidden"
                        />
                      </td>
                      <td className="p-1.5 border border-border text-right">
                        <input
                          type="number"
                          value={row.q1}
                          onChange={(e) => handleCellChange(idx, 'q1', e.target.value)}
                          className="w-20 bg-transparent border-none text-right text-foreground text-xs font-mono focus:outline-hidden"
                        />
                      </td>
                      <td className="p-1.5 border border-border text-right">
                        <input
                          type="number"
                          value={row.q2}
                          onChange={(e) => handleCellChange(idx, 'q2', e.target.value)}
                          className="w-20 bg-transparent border-none text-right text-foreground text-xs font-mono focus:outline-hidden"
                        />
                      </td>
                      <td className="p-1.5 border border-border text-right">
                        <input
                          type="number"
                          value={row.q3}
                          onChange={(e) => handleCellChange(idx, 'q3', e.target.value)}
                          className="w-20 bg-transparent border-none text-right text-foreground text-xs font-mono focus:outline-hidden"
                        />
                      </td>
                      <td className="p-1.5 border border-border text-right">
                        <input
                          type="number"
                          value={row.q4}
                          onChange={(e) => handleCellChange(idx, 'q4', e.target.value)}
                          className="w-20 bg-transparent border-none text-right text-foreground text-xs font-mono focus:outline-hidden"
                        />
                      </td>
                      <td className="p-2 border border-border text-right font-bold text-emerald-400">
                        ${totals.rowTotals[idx]?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-muted/40 font-bold">
                    <td className="p-2 border border-border">Grand Total</td>
                    <td className="p-2 border border-border text-right">${totals.q1Total.toLocaleString()}</td>
                    <td className="p-2 border border-border text-right">${totals.q2Total.toLocaleString()}</td>
                    <td className="p-2 border border-border text-right">${totals.q3Total.toLocaleString()}</td>
                    <td className="p-2 border border-border text-right">${totals.q4Total.toLocaleString()}</td>
                    <td className="p-2 border border-border text-right text-emerald-400 text-sm">
                      ${totals.grandTotal.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: WORD DOCUMENT (.docx) */}
        {activeTab === 'docx' && (
          <div data-testid="office-docx-stage" className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-2.5 border-b border-border bg-muted/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Strategic Executive Brief</span>
              <button
                onClick={handleExportWord}
                data-testid="office-export-docx-btn"
                className="px-2.5 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-1 transition text-xs font-semibold shadow-xs"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export .docx</span>
              </button>
            </div>

            {/* Rendered Document View */}
            <div className="flex-1 overflow-y-auto p-6 bg-card space-y-4 max-w-2xl mx-auto shadow-sm my-4 border border-border rounded-lg text-foreground">
              <div className="border-b border-border pb-3 space-y-1">
                <h1 className="text-xl font-bold tracking-tight">Strategic Executive Brief: FY2026</h1>
                <p className="text-xs text-muted-foreground">Prepared for Executive Committee • ISO/IEC 29500 Compliant</p>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Key Strategic Recommendation
                </span>
                <p className="text-[11px] leading-relaxed">
                  Adopt AI-native office tooling to eliminate manual spreadsheet reconciliation and streamline boardroom slide creation.
                </p>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
                <h2 className="text-sm font-bold text-foreground">1. Financial Trajectory</h2>
                <p>
                  Annual projected revenue run-rate reaches <strong className="text-emerald-400 font-mono">${totals.grandTotal.toLocaleString()}</strong> across SaaS subscriptions and scalable compute pipelines.
                </p>
                <p>
                  Operating margin expansion continues through automated model generation, cutting reporting cycle time by 82%.
                </p>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
                <h2 className="text-sm font-bold text-foreground">2. Governance & Compliance</h2>
                <p>
                  All exported artifacts maintain strict OpenXML binary integrity, allowing uninterrupted collaboration across desktop Microsoft Office, Apple Pages/Keynote, and Google Workspace.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POWERPOINT SLIDE DECK (.pptx) */}
        {activeTab === 'pptx' && (
          <div data-testid="office-pptx-stage" className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-2.5 border-b border-border bg-muted/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Slide {currentSlideIndex + 1} of {INITIAL_SLIDES.length}</span>
                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.min(INITIAL_SLIDES.length - 1, prev + 1))}
                  disabled={currentSlideIndex === INITIAL_SLIDES.length - 1}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40"
                  title="Next Slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={handleExportPresentation}
                data-testid="office-export-pptx-btn"
                className="px-2.5 py-1 rounded-md bg-amber-600 text-white hover:bg-amber-500 flex items-center gap-1 transition text-xs font-semibold shadow-xs"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export .pptx</span>
              </button>
            </div>

            {/* 16:9 Slide Canvas */}
            <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-zinc-950/60">
              <div className="w-full max-w-xl aspect-video bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl flex flex-col justify-between text-zinc-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Series A Strategy</span>
                  <h2 className="text-lg font-bold">{activeSlide.title}</h2>
                  <p className="text-xs text-zinc-400">{activeSlide.subtitle}</p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 my-3">
                  {activeSlide.kpis.map((kpi, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1">
                      <span className="text-[10px] text-zinc-400">{kpi.label}</span>
                      <div className="text-base font-bold font-mono text-emerald-400">{kpi.value}</div>
                      <span className="text-[9px] text-zinc-500">{kpi.change}</span>
                    </div>
                  ))}
                </div>

                <ul className="space-y-1 text-xs text-zinc-300">
                  {activeSlide.bulletPoints.map((bp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Speaker Notes */}
              <div className="w-full max-w-xl mt-3 p-2.5 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground">
                <span className="font-semibold text-foreground text-[11px] block mb-0.5">Speaker Notes:</span>
                <p className="italic text-[11px]">{activeSlide.speakerNotes}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PDF & PRINT PREVIEW */}
        {activeTab === 'pdf' && (
          <div data-testid="office-pdf-stage" className="flex-1 flex flex-col overflow-hidden">
            <div className="p-2.5 border-b border-border bg-muted/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Print / PDF Layout View</span>
              <button
                onClick={handlePrintPdf}
                data-testid="office-print-pdf-btn"
                className="px-2.5 py-1 rounded-md bg-rose-600 text-white hover:bg-rose-500 flex items-center gap-1 transition text-xs font-semibold shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print to PDF</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center bg-zinc-950/40">
              <div className="w-full max-w-lg bg-card border border-border p-8 rounded-lg shadow-md space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-bold text-sm">Living Office Report: FY2026</h3>
                  <span className="text-muted-foreground text-[10px]">Page 1 of 1</span>
                </div>

                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Automated consolidated print export including live calculated spreadsheet totals, executive summary briefing, and PowerPoint deck summaries.
                </p>

                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                  <span className="font-semibold text-[11px]">Consolidated Balance Total:</span>
                  <div className="text-xl font-bold font-mono text-emerald-500">
                    ${totals.grandTotal.toLocaleString()} USD
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default OfficeWorkspaceView;
