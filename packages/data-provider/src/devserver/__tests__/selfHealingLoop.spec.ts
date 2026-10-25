import { SelfHealingManager } from '../selfHealingLoop';

describe('SelfHealingManager', () => {
  it('manages sessions, ingests logs, and detects runtime errors', () => {
    const manager = new SelfHealingManager();
    const session = manager.registerSession('sess_1', 'AI Dashboard', 3000);

    expect(session.id).toBe('sess_1');
    expect(session.status).toBe('running');
    expect(session.port).toBe(3000);

    // Ingest info log
    const log1 = manager.ingestConsoleLog('sess_1', {
      level: 'info',
      message: '[vite] connected.',
    });
    expect(log1.diagnosed).toBeUndefined();
    expect(session.status).toBe('running');

    // Ingest error log
    const log2 = manager.ingestConsoleLog('sess_1', {
      level: 'error',
      message: 'ReferenceError: isLoaded is not defined in src/App.tsx:15:3',
    });
    expect(log2.diagnosed).toBeDefined();
    expect(log2.diagnosed?.errorType).toBe('ReferenceError');
    expect(session.status).toBe('error');
    expect(session.activeError?.file).toBe('src/App.tsx');
    expect(session.healingHistory).toHaveLength(1);
    expect(session.healingHistory[0].status).toBe('detected');

    // Mark healed
    const healed = manager.markHealed('sess_1', 'diff content', 'Declared isLoaded boolean');
    expect(healed?.status).toBe('healed');
    expect(session.status).toBe('running');
    expect(session.activeError).toBeUndefined();
  });
});
