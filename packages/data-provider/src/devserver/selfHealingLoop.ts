import type { DevServerSession, DiagnosedError, SelfHealingReport, WebConsoleLog } from './types';
import { buildSelfHealingPrompt, diagnoseConsoleError } from './errorAnalyzer';

export class SelfHealingManager {
  private sessions = new Map<string, DevServerSession>();

  /**
   * Registers a new dev server session.
   */
  public registerSession(id: string, name: string, port = 5173, url?: string): DevServerSession {
    const session: DevServerSession = {
      id,
      name,
      port,
      url: url || `http://localhost:${port}`,
      status: 'running',
      logs: [],
      healingHistory: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.sessions.set(id, session);
    return session;
  }

  public getSession(id: string): DevServerSession | undefined {
    return this.sessions.get(id);
  }

  public listSessions(): DevServerSession[] {
    return Array.from(this.sessions.values());
  }

  public deleteSession(id: string): boolean {
    return this.sessions.delete(id);
  }

  /**
   * Ingests a browser console log, analyzes runtime errors and triggers self-healing detection.
   */
  public ingestConsoleLog(sessionId: string, log: Omit<WebConsoleLog, 'id' | 'timestamp'>): {
    log: WebConsoleLog;
    diagnosed?: DiagnosedError;
    prompt?: string;
  } {
    const session = this.sessions.get(sessionId);
    const timestamp = Date.now();
    const fullLog: WebConsoleLog = {
      ...log,
      id: `log_${timestamp}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
    };

    if (!session) {
      return { log: fullLog };
    }

    session.logs.push(fullLog);
    // Keep max 200 logs
    if (session.logs.length > 200) {
      session.logs.shift();
    }
    session.updatedAt = timestamp;

    let diagnosed: DiagnosedError | undefined;
    let prompt: string | undefined;

    if (log.level === 'error') {
      diagnosed = diagnoseConsoleError(fullLog);
      session.activeError = diagnosed;
      session.status = 'error';

      const report: SelfHealingReport = {
        id: `heal_${timestamp}`,
        diagnosedError: diagnosed,
        status: 'detected',
        detectedAt: timestamp,
      };
      session.healingHistory.unshift(report);

      prompt = buildSelfHealingPrompt(diagnosed);
    }

    return { log: fullLog, diagnosed, prompt };
  }

  /**
   * Marks that the self-healing fix was applied and verifies resolution.
   */
  public markHealed(sessionId: string, diff?: string, fixDescription?: string): SelfHealingReport | null {
    const session = this.sessions.get(sessionId);
    if (!session || !session.activeError) {
      return null;
    }

    const report = session.healingHistory.find((h) => h.status === 'detected' || h.status === 'attempting_fix');
    const now = Date.now();

    if (report) {
      report.status = 'healed';
      report.fixedAt = now;
      report.diff = diff;
      report.fixDescription = fixDescription || 'Code patched by AI self-healing agent.';
    }

    session.activeError = undefined;
    session.status = 'running';
    session.updatedAt = now;

    return report || null;
  }
}

export const globalSelfHealingManager = new SelfHealingManager();
