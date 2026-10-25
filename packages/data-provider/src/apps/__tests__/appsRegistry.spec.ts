import {
  APP_SECTIONS,
  APPS_REGISTRY,
  getAllApps,
  getAppDefinition,
  getRequiredAppDefinition,
  listAppsBySection,
  isValidAppId,
  getDefaultApp,
  getPinnedDefaultApps,
  getAppSections,
  searchApps,
} from '../index';

describe('Unified App Registry (Fas 26)', () => {
  it('defines 4 canonical sections with metadata', () => {
    const sections = getAppSections();
    expect(sections).toHaveLength(4);
    expect(sections.map((s) => s.id)).toEqual(['core', 'agents', 'builders', 'research']);

    expect(APP_SECTIONS.core.title).toBe('Core Apps');
    expect(APP_SECTIONS.agents.title).toBe('Autonomous Agents');
    expect(APP_SECTIONS.builders.title).toBe('Builders & Productivity');
    expect(APP_SECTIONS.research.title).toBe('Research & Browsing');
  });

  it('registers all 22 specialized applications across 4 sections', () => {
    const all = getAllApps();
    expect(all).toHaveLength(22);

    const coreApps = listAppsBySection('core');
    expect(coreApps).toHaveLength(4);
    expect(coreApps.map((a) => a.id)).toEqual(['chat', 'cowork', 'design', 'code']);

    const agentApps = listAppsBySection('agents');
    expect(agentApps).toHaveLength(8);
    expect(agentApps.map((a) => a.id)).toEqual([
      'manus',
      'devin',
      'cursor',
      'windsurf',
      'kiro',
      'replit',
      'grok',
      'cline',
    ]);

    const builderApps = listAppsBySection('builders');
    expect(builderApps).toHaveLength(6);
    expect(builderApps.map((a) => a.id)).toEqual([
      'v0',
      'lovable',
      'office',
      'notion',
      'bolt',
      'higgsfield',
    ]);

    const researchApps = listAppsBySection('research');
    expect(researchApps).toHaveLength(4);
    expect(researchApps.map((a) => a.id)).toEqual([
      'perplexity',
      'atlas',
      'deepsearch',
      'connectors',
    ]);
  });

  it('guarantees complete structural integrity on every registered app', () => {
    const all = getAllApps();

    for (const app of all) {
      expect(app.id).toBeTruthy();
      expect(app.name).toBeTruthy();
      expect(app.section).toMatch(/^(core|agents|builders|research)$/);
      expect(app.tagline).toBeTruthy();
      expect(app.description).toBeTruthy();
      expect(app.icon).toBeTruthy();
      expect(app.color).toBeTruthy();
      expect(app.systemPromptId).toBeTruthy();
      expect(app.routePath).toBe(`/app/${app.id}`);
      expect(Array.isArray(app.capabilities)).toBe(true);
      expect(app.capabilities.length).toBeGreaterThan(0);
      expect(Array.isArray(app.defaultTools)).toBe(true);
      expect(Array.isArray(app.suggestedStarters)).toBe(true);
      expect(app.suggestedStarters.length).toBeGreaterThanOrEqual(1);

      for (const starter of app.suggestedStarters) {
        expect(starter.label).toBeTruthy();
        expect(starter.prompt).toBeTruthy();
      }
    }
  });

  describe('getAppDefinition & getRequiredAppDefinition', () => {
    it('retrieves app by exact id', () => {
      const manus = getAppDefinition('manus');
      expect(manus).toBeDefined();
      expect(manus?.name).toBe('Manus Workspace');
      expect(manus?.capabilities).toContain('terminal');
    });

    it('retrieves app case-insensitively', () => {
      const v0 = getAppDefinition('V0');
      expect(v0).toBeDefined();
      expect(v0?.name).toBe('v0 Studio');

      const perplexity = getAppDefinition('  Perplexity  ');
      expect(perplexity).toBeDefined();
      expect(perplexity?.name).toBe('Perplexity Research');
    });

    it('returns undefined for non-existent app id', () => {
      expect(getAppDefinition('non-existent-app')).toBeUndefined();
      expect(getAppDefinition(null)).toBeUndefined();
      expect(getAppDefinition('')).toBeUndefined();
    });

    it('falls back to default chat app with getRequiredAppDefinition', () => {
      const fallback = getRequiredAppDefinition('invalid_id');
      expect(fallback.id).toBe('chat');

      const valid = getRequiredAppDefinition('cursor');
      expect(valid.id).toBe('cursor');
    });
  });

  describe('isValidAppId & getDefaultApp', () => {
    it('validates known app ids correctly', () => {
      expect(isValidAppId('chat')).toBe(true);
      expect(isValidAppId('manus')).toBe(true);
      expect(isValidAppId('v0')).toBe(true);
      expect(isValidAppId('perplexity')).toBe(true);
      expect(isValidAppId('office')).toBe(true);

      expect(isValidAppId('unknown')).toBe(false);
      expect(isValidAppId('')).toBe(false);
      expect(isValidAppId(null)).toBe(false);
    });

    it('returns Claude Chat as default app', () => {
      const def = getDefaultApp();
      expect(def.id).toBe('chat');
      expect(def.name).toBe('Claude Chat');
      expect(def.section).toBe('core');
    });
  });

  describe('getPinnedDefaultApps', () => {
    it('returns pinned default applications', () => {
      const pinned = getPinnedDefaultApps();
      expect(pinned.length).toBeGreaterThan(0);
      expect(pinned.some((a) => a.id === 'chat')).toBe(true);
      expect(pinned.some((a) => a.id === 'manus')).toBe(true);
      expect(pinned.some((a) => a.id === 'cursor')).toBe(true);
      expect(pinned.some((a) => a.id === 'v0')).toBe(true);
      expect(pinned.some((a) => a.id === 'perplexity')).toBe(true);
      expect(pinned.some((a) => a.id === 'office')).toBe(true);
    });
  });

  describe('searchApps', () => {
    it('finds apps by title keyword', () => {
      const results = searchApps('Devin');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('devin');
    });

    it('finds apps by capability keyword', () => {
      const results = searchApps('living_office');
      expect(results.some((a) => a.id === 'office')).toBe(true);
    });

    it('finds apps by description keywords', () => {
      const results = searchApps('multi-hop');
      expect(results.some((a) => a.id === 'perplexity')).toBe(true);
    });

    it('returns all apps on empty search query', () => {
      expect(searchApps('')).toHaveLength(22);
      expect(searchApps('   ')).toHaveLength(22);
    });
  });
});
