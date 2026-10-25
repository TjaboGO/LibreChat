import {
  COGNITIVE_STYLES,
  detectSlashStyle,
  getStyleDirective,
  injectCognitiveStyle,
} from '../styleEngine';

describe('styleEngine', () => {
  it('contains complete definitions for all 5 cognitive styles', () => {
    expect(COGNITIVE_STYLES.default).toBeDefined();
    expect(COGNITIVE_STYLES.concise).toBeDefined();
    expect(COGNITIVE_STYLES.learning).toBeDefined();
    expect(COGNITIVE_STYLES.explanatory).toBeDefined();
    expect(COGNITIVE_STYLES.proactive).toBeDefined();

    expect(COGNITIVE_STYLES.concise.slashCommand).toBe('/concise');
    expect(COGNITIVE_STYLES.learning.slashCommand).toBe('/learning');
    expect(COGNITIVE_STYLES.explanatory.slashCommand).toBe('/explanatory');
    expect(COGNITIVE_STYLES.proactive.slashCommand).toBe('/proactive');
  });

  describe('detectSlashStyle', () => {
    it('detects /concise and cleans prompt', () => {
      const res = detectSlashStyle('/concise Rewrite this in Rust');
      expect(res.hadSlashCommand).toBe(true);
      expect(res.detectedStyle).toBe('concise');
      expect(res.cleanText).toBe('Rewrite this in Rust');
    });

    it('detects /learning and cleans prompt', () => {
      const res = detectSlashStyle('/learning Explain consensus protocols');
      expect(res.hadSlashCommand).toBe(true);
      expect(res.detectedStyle).toBe('learning');
      expect(res.cleanText).toBe('Explain consensus protocols');
    });

    it('detects /explanatory and cleans prompt', () => {
      const res = detectSlashStyle('/explanatory Deep dive into Raft vs Paxos');
      expect(res.hadSlashCommand).toBe(true);
      expect(res.detectedStyle).toBe('explanatory');
      expect(res.cleanText).toBe('Deep dive into Raft vs Paxos');
    });

    it('detects /proactive and cleans prompt', () => {
      const res = detectSlashStyle('/proactive Review this pull request');
      expect(res.hadSlashCommand).toBe(true);
      expect(res.detectedStyle).toBe('proactive');
      expect(res.cleanText).toBe('Review this pull request');
    });

    it('detects /style <name> syntax', () => {
      const res = detectSlashStyle('/style learning Teach me Docker');
      expect(res.hadSlashCommand).toBe(true);
      expect(res.detectedStyle).toBe('learning');
      expect(res.cleanText).toBe('Teach me Docker');
    });

    it('returns null when prompt does not start with a style slash command', () => {
      const res = detectSlashStyle('Can you write a poem?');
      expect(res.hadSlashCommand).toBe(false);
      expect(res.detectedStyle).toBeNull();
      expect(res.cleanText).toBe('Can you write a poem?');
    });
  });

  describe('injectCognitiveStyle', () => {
    it('leaves text unchanged for default style', () => {
      const text = 'Hello world';
      expect(injectCognitiveStyle(text, 'default')).toBe('Hello world');
    });

    it('injects concise directive into message', () => {
      const text = 'Optimize this query';
      const result = injectCognitiveStyle(text, 'concise');
      expect(result).toContain('Optimize this query');
      expect(result).toContain('[Cognitive Output Style: CONCISE (Claude Code Persona)]');
    });

    it('injects learning directive into message', () => {
      const text = 'Explain closures';
      const result = injectCognitiveStyle(text, 'learning');
      expect(result).toContain('[Cognitive Output Style: LEARNING (Socratic Mentor Persona)]');
    });

    it('does not double-inject if directive already exists', () => {
      const text = 'Hello\n\n[Cognitive Output Style: CONCISE]';
      expect(injectCognitiveStyle(text, 'concise')).toBe(text);
    });
  });
});
