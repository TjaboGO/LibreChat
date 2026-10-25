export type EngineMode = 'auto' | 'spec' | 'vibe';

export type ResolvedEngineMode = 'spec' | 'vibe';

export interface ModeConfidence {
  spec: number;
  vibe: number;
  chat: number;
}

export interface ModeClassificationResult {
  mode: ResolvedEngineMode;
  confidence: ModeConfidence;
  reasoning: string;
  isAuto: boolean;
  suggestedTasks?: string[];
}

export interface SpecTask {
  id: string;
  title: string;
  description?: string;
  done?: boolean;
  phase?: string;
}

export interface SpecDocument {
  id?: string;
  title: string;
  overview: string;
  requirements: string[];
  architecture?: string;
  acceptanceCriteria: string[];
  testPlan?: string[];
  tasks: SpecTask[];
}

export interface ModeDirectives {
  spec: string;
  vibe: string;
}
