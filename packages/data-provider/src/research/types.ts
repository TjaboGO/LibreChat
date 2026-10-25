export type QueryCategory = 'broad' | 'subquery' | 'gap' | 'verification';
export type QueryStatus = 'pending' | 'searching' | 'completed' | 'failed';
export type SourceReliability = 'academic' | 'primary' | 'official' | 'news' | 'community';
export type ResearchSessionStatus = 'idle' | 'planning' | 'searching' | 'reading' | 'synthesizing' | 'completed' | 'failed';

export interface ResearchQuery {
  id: string;
  query: string;
  depth: number;
  category: QueryCategory;
  status: QueryStatus;
  rationale: string;
  parentQueryId?: string;
  resultsCount: number;
  error?: string;
}

export interface ResearchSource {
  id: number;
  url: string;
  domain: string;
  title: string;
  snippet: string;
  publishedDate?: string;
  reliability: SourceReliability;
  relevanceScore: number;
  citedInSections?: string[];
}

export interface ResearchFinding {
  section: string;
  content: string;
  citationIds: number[];
}

export interface ComparativeMatrix {
  headers: string[];
  rows: string[][];
}

export interface TimelineMilestone {
  date: string;
  event: string;
  citationIds: number[];
}

export interface ResearchReport {
  topic: string;
  executiveSummary: string;
  keyFindings: ResearchFinding[];
  comparativeMatrix?: ComparativeMatrix;
  timeline?: TimelineMilestone[];
  knowledgeGaps: string[];
  markdownReport: string;
  generatedAt: string;
}

export interface ResearchStepLog {
  timestamp: string;
  step: string;
  details?: string;
}

export interface DeepResearchSession {
  id: string;
  conversationId?: string;
  topic: string;
  status: ResearchSessionStatus;
  progress: number;
  currentStep: string;
  queryGraph: ResearchQuery[];
  sources: ResearchSource[];
  report?: ResearchReport;
  stepsLog: ResearchStepLog[];
  createdAt: string;
  updatedAt: string;
}

export interface DeepResearchPlanOptions {
  maxDepth?: number;
  breadth?: number;
  focus?: 'academic' | 'market' | 'technical' | 'general';
  userMemoryContext?: string;
}
