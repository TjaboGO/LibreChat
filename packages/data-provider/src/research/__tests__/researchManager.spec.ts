import { DeepResearchManager } from '../researchManager';

describe('DeepResearchManager', () => {
  let manager: DeepResearchManager;

  beforeEach(() => {
    manager = new DeepResearchManager();
  });

  afterEach(() => {
    manager.clear();
  });

  it('initializes a research session and generates query tree', () => {
    const session = manager.startResearch('Next-Gen Web Frameworks', 'conv-123', {
      focus: 'technical',
      maxDepth: 2,
    });

    expect(session.id).toMatch(/^res_/);
    expect(session.topic).toBe('Next-Gen Web Frameworks');
    expect(session.conversationId).toBe('conv-123');
    expect(session.status).toBe('planning');
    expect(session.progress).toBe(10);
    expect(session.queryGraph.length).toBeGreaterThanOrEqual(5);
    expect(session.stepsLog.length).toBe(1);

    const fetched = manager.getSession(session.id);
    expect(fetched).toBe(session);
  });

  it('updates session status, progress, and query nodes', () => {
    const session = manager.startResearch('Distributed Consensus');

    manager.updateStatus(session.id, 'searching', 40, 'Searching Hop 1 queries');
    expect(session.status).toBe('searching');
    expect(session.progress).toBe(40);
    expect(session.currentStep).toBe('Searching Hop 1 queries');

    const updated = manager.updateQueryStatus(session.id, 'q-root', 'completed', 12);
    expect(updated).toBe(true);
    expect(session.queryGraph.find((q) => q.id === 'q-root')?.resultsCount).toBe(12);
  });

  it('adds sources and dedupes them', () => {
    const session = manager.startResearch('Robotics');

    const s1 = manager.addSource(session.id, {
      url: 'https://arxiv.org/abs/2401.999',
      title: 'Humanoid Control',
      snippet: 'Walking locomotion',
    });

    expect(s1).toBeDefined();
    expect(session.sources.length).toBe(1);
    expect(session.sources[0].id).toBe(1);
  });

  it('expands queries with follow-up gaps', () => {
    const session = manager.startResearch('Fusion Energy');

    const newQueries = manager.expandQuery(session.id, 'q-root', [
      'Magnetic confinement vs inertial confinement Q factor',
    ]);

    expect(newQueries.length).toBe(1);
    expect(newQueries[0].category).toBe('gap');
    expect(session.queryGraph.some((q) => q.id === newQueries[0].id)).toBe(true);
  });

  it('completes research and produces final synthesis report', () => {
    const session = manager.startResearch('Solid-State Batteries');
    const report = manager.completeResearch(session.id);

    expect(report).toBeDefined();
    expect(session.status).toBe('completed');
    expect(session.progress).toBe(100);
    expect(session.report).toBe(report);
    expect(session.sources.length).toBeGreaterThanOrEqual(3);
  });
});
