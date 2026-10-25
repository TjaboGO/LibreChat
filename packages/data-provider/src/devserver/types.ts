export type DevServerState = 'stopped' | 'starting' | 'running' | 'error' | 'healing';

export type ConsoleLogLevel = 'log' | 'info' | 'warn' | 'error';

export interface WebConsoleLog {
  id: string;
  level: ConsoleLogLevel;
  message: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
}

export interface DiagnosedError {
  id: string;
  errorType: string;
  rawMessage: string;
  file?: string;
  line?: number;
  column?: number;
  rootCause: string;
  suggestedFix: string;
  canAutoHeal: boolean;
  timestamp: number;
}

export interface SelfHealingReport {
  id: string;
  diagnosedError: DiagnosedError;
  status: 'detected' | 'attempting_fix' | 'healed' | 'failed';
  fixDescription?: string;
  diff?: string;
  detectedAt: number;
  fixedAt?: number;
}

export interface DevServerSession {
  id: string;
  name: string;
  url: string;
  port: number;
  status: DevServerState;
  logs: WebConsoleLog[];
  activeError?: DiagnosedError;
  healingHistory: SelfHealingReport[];
  createdAt: number;
  updatedAt: number;
}

export interface ScaffoldOptions {
  appName: string;
  template: 'vite-react-tailwind' | 'nextjs' | 'node-express';
  description?: string;
  port?: number;
}
