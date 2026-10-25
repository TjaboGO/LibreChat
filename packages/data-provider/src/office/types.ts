export type OfficeDocumentType = 'docx' | 'xlsx' | 'pptx' | 'pdf';

export interface OfficeCallout {
  type: 'info' | 'warning' | 'tip' | 'quote';
  title?: string;
  text: string;
}

export interface OfficeTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface WordSection {
  heading?: string;
  level?: 1 | 2 | 3;
  paragraphs: string[];
  tables?: OfficeTable[];
  callouts?: OfficeCallout[];
}

export interface WordDocumentSpec {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  version?: string;
  sections: WordSection[];
}

export interface SpreadsheetCell {
  row: number;
  col: number;
  value: string | number;
  formula?: string;
  format?: 'text' | 'number' | 'currency' | 'percent';
}

export interface SpreadsheetSheet {
  name: string;
  columns: string[];
  rows: Array<Array<string | number>>;
  formulas?: Record<string, string>; // cell coordinate "B5" -> "=SUM(B1:B4)"
}

export interface SpreadsheetSpec {
  title: string;
  sheets: SpreadsheetSheet[];
  activeSheetIndex?: number;
}

export type SlideLayout = 'title' | 'bullet_split' | 'kpi_cards' | 'quote' | 'table';

export interface SlideMetric {
  label: string;
  value: string;
  change?: string;
}

export interface PresentationSlide {
  id: string;
  title: string;
  subtitle?: string;
  layout: SlideLayout;
  bulletPoints?: string[];
  speakerNotes?: string;
  metrics?: SlideMetric[];
  table?: OfficeTable;
  callout?: string;
}

export interface PresentationSpec {
  title: string;
  subtitle?: string;
  author?: string;
  theme: 'modern_dark' | 'navy_executive' | 'minimal_light' | 'emerald_venture';
  slides: PresentationSlide[];
}

export interface LivingOfficeArtifact {
  id: string;
  type: OfficeDocumentType;
  title: string;
  wordSpec?: WordDocumentSpec;
  spreadsheetSpec?: SpreadsheetSpec;
  presentationSpec?: PresentationSpec;
  rawContent?: string;
  createdAt: string;
  updatedAt: string;
}
