/* eslint-disable i18next/no-literal-string */
import React, { memo, useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Table,
  Presentation,
  Download,
  Printer,
  Copy,
  Check,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  AlertTriangle,
  Lightbulb,
  FileSpreadsheet,
} from 'lucide-react';
import {
  parseWordDocument,
  parseSpreadsheet,
  parsePresentation,
  evaluateFormula,
  exportToWordHtml,
  exportToCsv,
  exportToExcelXml,
  exportToPresentationHtml,
  type WordDocumentSpec,
  type SpreadsheetSpec,
  type PresentationSpec,
  type OfficeDocumentType,
} from 'librechat-data-provider';
import type { Artifact } from '~/common/artifacts';
import { triggerDownload } from '~/utils';
import { cn } from '~/utils';

interface ArtifactOfficeStudioProps {
  artifact: Artifact;
  isSharedConvo?: boolean;
}

export const ArtifactOfficeStudio = memo(function ArtifactOfficeStudio({
  artifact,
}: ArtifactOfficeStudioProps) {
  // Infer initial document type from artifact type or extension
  const initialType: OfficeDocumentType = useMemo(() => {
    const t = (artifact.type || '').toLowerCase();
    const title = (artifact.title || '').toLowerCase();
    if (t.includes('spreadsheet') || t.includes('xlsx') || t.includes('csv') || title.endsWith('.xlsx') || title.endsWith('.csv')) {
      return 'xlsx';
    }
    if (t.includes('presentation') || t.includes('pptx') || title.endsWith('.pptx')) {
      return 'pptx';
    }
    return 'docx';
  }, [artifact.type, artifact.title]);

  const [docType, setDocType] = useState<OfficeDocumentType>(initialType);
  const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');
  const [copied, setCopied] = useState(false);

  // Raw text content
  const rawContent = useMemo(() => {
    return artifact.content || artifact.text || '';
  }, [artifact.content, artifact.text]);

  // Parsed documents
  const [wordDoc, setWordDoc] = useState<WordDocumentSpec>(() => parseWordDocument(rawContent));
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetSpec>(() => parseSpreadsheet(rawContent, artifact.title));
  const [presentation, setPresentation] = useState<PresentationSpec>(() => parsePresentation(rawContent));

  // Update specs when rawContent changes
  useEffect(() => {
    if (docType === 'docx') {
      setWordDoc(parseWordDocument(rawContent));
    } else if (docType === 'xlsx') {
      setSpreadsheet(parseSpreadsheet(rawContent, artifact.title));
    } else if (docType === 'pptx') {
      setPresentation(parsePresentation(rawContent));
    }
  }, [rawContent, docType, artifact.title]);

  // Excel State
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  const [editingValue, setEditingValue] = useState<string>('');

  // PPTX State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);

  // Active Excel sheet
  const activeSheet = spreadsheet.sheets[activeSheetIndex] || spreadsheet.sheets[0];

  // Excel Cell Change Handler
  const handleCellChange = (rIdx: number, cIdx: number, newVal: string) => {
    const updatedSheets = [...spreadsheet.sheets];
    const targetSheet = { ...updatedSheets[activeSheetIndex] };
    const updatedRows = targetSheet.rows.map((row) => [...row]);

    // Check if formula or numeric
    const evaluated = newVal.startsWith('=') ? evaluateFormula(newVal, updatedRows) : newVal;
    const num = parseFloat(String(evaluated));
    updatedRows[rIdx][cIdx] = !isNaN(num) && /^[0-9.,$%-]+$/.test(String(evaluated)) ? num : evaluated;

    targetSheet.rows = updatedRows;
    updatedSheets[activeSheetIndex] = targetSheet;
    setSpreadsheet({ ...spreadsheet, sheets: updatedSheets });
  };

  // Downloads and Exports
  const handleDownload = () => {
    const title = artifact.title || 'living-office-artifact';
    if (docType === 'docx') {
      const html = exportToWordHtml(wordDoc);
      const blob = new Blob([html], { type: 'application/msword' });
      triggerDownload(blob, `${title.replace(/\.[^.]+$/, '')}.doc`);
    } else if (docType === 'xlsx') {
      const xml = exportToExcelXml(spreadsheet);
      const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
      triggerDownload(blob, `${title.replace(/\.[^.]+$/, '')}.xls`);
    } else if (docType === 'pptx') {
      const html = exportToPresentationHtml(presentation);
      const blob = new Blob([html], { type: 'text/html' });
      triggerDownload(blob, `${title.replace(/\.[^.]+$/, '')}-deck.html`);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopySource = () => {
    navigator.clipboard.writeText(rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full w-full flex-col bg-surface-secondary/40 text-text-primary overflow-hidden">
      {/* Top Office Suite Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border-light bg-surface-primary px-3 py-2 text-xs">
        {/* Left: Mode switcher pills */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDocType('docx')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-colors',
              docType === 'docx'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
            )}
          >
            <FileText className="size-3.5" />
            <span>Word (.docx)</span>
          </button>
          <button
            type="button"
            onClick={() => setDocType('xlsx')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-colors',
              docType === 'xlsx'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
            )}
          >
            <Table className="size-3.5" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            type="button"
            onClick={() => setDocType('pptx')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-colors',
              docType === 'pptx'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
            )}
          >
            <Presentation className="size-3.5" />
            <span>PowerPoint (.pptx)</span>
          </button>
        </div>

        {/* Center: View Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-secondary p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={cn(
              'rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-colors',
              activeTab === 'preview'
                ? 'bg-surface-primary text-text-primary shadow-xs'
                : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            Live Office
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('source')}
            className={cn(
              'rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-colors',
              activeTab === 'source'
                ? 'bg-surface-primary text-text-primary shadow-xs'
                : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            Source Structure
          </button>
        </div>

        {/* Right: Export & Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopySource}
            title="Copy Source"
            className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1 text-[11px] font-medium hover:bg-surface-hover"
          >
            {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {docType === 'docx' && (
            <button
              type="button"
              onClick={handlePrintPdf}
              title="Print to PDF"
              className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1 text-[11px] font-medium hover:bg-surface-hover"
            >
              <Printer className="size-3" />
              <span>Print / PDF</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 rounded-lg bg-text-primary px-3 py-1 text-[11px] font-semibold text-surface-primary hover:opacity-90 transition-opacity"
          >
            <Download className="size-3" />
            <span>Export .{docType}</span>
          </button>
        </div>
      </div>

      {/* Main Surface */}
      <div className="flex flex-1 overflow-auto p-4 justify-center">
        {activeTab === 'source' ? (
          <div className="w-full max-w-4xl h-full rounded-xl border border-border-light bg-surface-primary p-4 font-mono text-xs overflow-auto">
            <pre className="whitespace-pre-wrap">{rawContent}</pre>
          </div>
        ) : (
          <>
            {/* VIEW 1: WORD (.docx) */}
            {docType === 'docx' && (
              <div
                data-testid="word-document-viewer"
                className="w-full max-w-3xl rounded-xl border border-border-medium bg-surface-primary p-8 md:p-12 shadow-xl my-2 text-text-primary space-y-6 min-h-[600px]"
              >
                {/* Header Banner */}
                <div className="border-b-2 border-border-light pb-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                    Word Document • Living Office
                  </span>
                  <h1 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
                    {wordDoc.title}
                  </h1>
                  {wordDoc.subtitle && (
                    <p className="mt-1 text-sm text-text-secondary">{wordDoc.subtitle}</p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-tertiary">
                    {wordDoc.author && (
                      <span>
                        <strong>Author:</strong> {wordDoc.author}
                      </span>
                    )}
                    {wordDoc.date && (
                      <span>
                        <strong>Date:</strong> {wordDoc.date}
                      </span>
                    )}
                    {wordDoc.version && (
                      <span className="rounded bg-surface-tertiary px-1.5 py-0.5 font-mono text-[10px]">
                        v{wordDoc.version}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-6 text-sm leading-relaxed text-text-primary">
                  {wordDoc.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      {section.heading && (
                        <h2 className="text-lg font-bold text-text-primary border-b border-border-light pb-1">
                          {section.heading}
                        </h2>
                      )}

                      {/* Callout Boxes */}
                      {section.callouts?.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className={cn(
                            'flex items-start gap-2.5 rounded-r-xl border-l-4 p-3 text-xs',
                            c.type === 'warning'
                              ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200'
                              : c.type === 'tip'
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                                : 'border-blue-500 bg-blue-500/10 text-blue-900 dark:text-blue-200',
                          )}
                        >
                          {c.type === 'warning' ? (
                            <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-500" />
                          ) : c.type === 'tip' ? (
                            <Lightbulb className="size-4 shrink-0 mt-0.5 text-emerald-500" />
                          ) : (
                            <Info className="size-4 shrink-0 mt-0.5 text-blue-500" />
                          )}
                          <div className="flex-1 font-medium">{c.text}</div>
                        </div>
                      ))}

                      {/* Paragraphs */}
                      {section.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-text-secondary leading-relaxed">
                          {p}
                        </p>
                      ))}

                      {/* Tables */}
                      {section.tables?.map((tbl, tIdx) => (
                        <div
                          key={tIdx}
                          className="overflow-x-auto rounded-lg border border-border-light my-3"
                        >
                          <table className="w-full text-xs">
                            <thead className="bg-surface-secondary text-text-primary font-semibold">
                              <tr>
                                {tbl.headers.map((h, hIdx) => (
                                  <th
                                    key={hIdx}
                                    className="border-b border-border-light p-2.5 text-left"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tbl.rows.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className="border-b border-border-light/50 hover:bg-surface-secondary/50"
                                >
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-2.5 text-text-secondary">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: EXCEL (.xlsx) */}
            {docType === 'xlsx' && (
              <div
                data-testid="excel-spreadsheet-viewer"
                className="w-full max-w-5xl rounded-xl border border-border-medium bg-surface-primary shadow-xl my-2 flex flex-col h-[650px] overflow-hidden"
              >
                {/* Excel Ribbon & Formula Bar */}
                <div className="flex items-center gap-2 border-b border-border-light bg-surface-secondary/80 px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500 font-bold">
                    <FileSpreadsheet className="size-4" />
                    <span>
                      {selectedCell
                        ? `${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1}`
                        : 'A1'}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border-light mx-1" />
                  <span className="font-mono text-text-tertiary">fx</span>
                  <input
                    type="text"
                    value={
                      selectedCell
                        ? String(activeSheet.rows[selectedCell.row]?.[selectedCell.col] ?? '')
                        : ''
                    }
                    onChange={(e) => {
                      if (selectedCell) {
                        handleCellChange(selectedCell.row, selectedCell.col, e.target.value);
                      }
                    }}
                    placeholder="Enter value or formula like =SUM(A1:A5)"
                    className="flex-1 rounded border border-border-light bg-surface-primary px-2 py-1 text-xs text-text-primary focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Grid Container */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full border-collapse text-xs font-mono">
                    <thead className="sticky top-0 z-10 bg-surface-secondary text-text-secondary">
                      <tr>
                        <th className="w-10 border border-border-light bg-surface-tertiary p-1.5 text-center text-[10px] text-text-tertiary">
                          #
                        </th>
                        {activeSheet.columns.map((col, cIdx) => (
                          <th
                            key={cIdx}
                            className="border border-border-light p-1.5 text-center font-bold text-text-primary min-w-[120px]"
                          >
                            <span className="text-[10px] text-text-tertiary block">
                              {String.fromCharCode(65 + cIdx)}
                            </span>
                            <span>{col}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeSheet.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-surface-secondary/40">
                          {/* Row Number */}
                          <td className="border border-border-light bg-surface-tertiary p-1 text-center text-[10px] font-bold text-text-tertiary select-none">
                            {rIdx + 1}
                          </td>
                          {/* Row Cells */}
                          {activeSheet.columns.map((_, cIdx) => {
                            const val = row[cIdx] ?? '';
                            const isSelected =
                              selectedCell?.row === rIdx && selectedCell?.col === cIdx;
                            const isNum = typeof val === 'number';

                            return (
                              <td
                                key={cIdx}
                                onClick={() => setSelectedCell({ row: rIdx, col: cIdx })}
                                className={cn(
                                  'border border-border-light p-1.5 transition-colors cursor-cell',
                                  isSelected
                                    ? 'bg-emerald-500/10 ring-2 ring-emerald-500 font-semibold'
                                    : '',
                                  isNum ? 'text-right' : 'text-left',
                                )}
                              >
                                {isNum && val > 999 ? val.toLocaleString() : String(val)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Sheet Navigation */}
                <div className="flex items-center justify-between border-t border-border-light bg-surface-secondary px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-1">
                    {spreadsheet.sheets.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSheetIndex(idx)}
                        className={cn(
                          'rounded-t px-3 py-1 text-xs font-medium transition-colors border-t-2',
                          activeSheetIndex === idx
                            ? 'bg-surface-primary text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-xs'
                            : 'text-text-secondary border-transparent hover:text-text-primary',
                        )}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] text-text-tertiary">
                    {activeSheet.rows.length} Rows • {activeSheet.columns.length} Columns
                  </span>
                </div>
              </div>
            )}

            {/* VIEW 3: POWERPOINT (.pptx) */}
            {docType === 'pptx' && (
              <div
                data-testid="presentation-viewer"
                className="w-full max-w-4xl rounded-xl border border-border-medium bg-surface-primary shadow-2xl my-2 flex flex-col overflow-hidden"
              >
                {/* 16:9 Presentation Stage */}
                <div className="relative aspect-[16/9] w-full bg-[#0b1120] text-slate-100 p-8 md:p-12 flex flex-col justify-between overflow-hidden shadow-inner">
                  {/* Slide Content */}
                  {(() => {
                    const slide =
                      presentation.slides[currentSlideIndex] || presentation.slides[0];
                    if (!slide) return null;

                    return (
                      <>
                        <div className="space-y-4">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">
                            {presentation.title} • SLIDE {currentSlideIndex + 1}
                          </span>
                          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            {slide.title}
                          </h2>
                          {slide.subtitle && (
                            <p className="text-sm md:text-lg text-slate-400 font-medium">
                              {slide.subtitle}
                            </p>
                          )}

                          {/* Layout: KPI Cards */}
                          {slide.metrics && slide.metrics.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                              {slide.metrics.map((m, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-4 shadow-lg"
                                >
                                  <div className="text-2xl md:text-3xl font-black text-amber-400">
                                    {m.value}
                                  </div>
                                  <div className="text-xs text-slate-300 font-medium mt-1">
                                    {m.label}
                                  </div>
                                  {m.change && (
                                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                                      {m.change}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Layout: Bullet Points */}
                          {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                            <ul className="list-disc list-inside space-y-2.5 pt-4 text-sm md:text-base text-slate-200">
                              {slide.bulletPoints.map((b, bIdx) => (
                                <li key={bIdx} className="leading-snug">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Slide Footer */}
                        <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[10px] text-slate-500">
                          <span>{slide.title}</span>
                          <span>
                            {currentSlideIndex + 1} / {presentation.slides.length}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Presentation Controls Bar */}
                <div className="flex items-center justify-between border-t border-border-light bg-surface-secondary px-4 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentSlideIndex === 0}
                      onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                      className="rounded-lg border border-border-light bg-surface-primary p-1.5 hover:bg-surface-hover disabled:opacity-40"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <span className="font-mono text-xs font-semibold text-text-primary">
                      {currentSlideIndex + 1} of {presentation.slides.length}
                    </span>
                    <button
                      type="button"
                      disabled={currentSlideIndex >= presentation.slides.length - 1}
                      onClick={() =>
                        setCurrentSlideIndex((prev) =>
                          Math.min(presentation.slides.length - 1, prev + 1),
                        )
                      }
                      className="rounded-lg border border-border-light bg-surface-primary p-1.5 hover:bg-surface-hover disabled:opacity-40"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>

                  {/* Thumbnail scrubber */}
                  <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-[300px]">
                    {presentation.slides.map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={cn(
                          'h-6 w-10 rounded border text-[9px] font-mono font-bold transition-all',
                          currentSlideIndex === idx
                            ? 'border-amber-500 bg-amber-500/20 text-amber-500'
                            : 'border-border-light bg-surface-primary text-text-tertiary hover:border-border-heavy',
                        )}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                    className="text-[11px] text-text-secondary hover:text-text-primary"
                  >
                    {showSpeakerNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}
                  </button>
                </div>

                {/* Speaker Notes Drawer */}
                {showSpeakerNotes && presentation.slides[currentSlideIndex]?.speakerNotes && (
                  <div className="border-t border-border-light bg-surface-primary p-3 text-xs italic text-text-secondary">
                    <strong>Speaker Note:</strong>{' '}
                    {presentation.slides[currentSlideIndex].speakerNotes}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default ArtifactOfficeStudio;
