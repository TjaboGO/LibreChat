import {
  cleanUrl,
  extractCleanDomain,
  classifySourceReliability,
  SourceCollector,
} from '../sourceCollector';

describe('sourceCollector', () => {
  describe('cleanUrl', () => {
    it('strips tracking parameters and hash', () => {
      const dirty = 'https://example.com/article?utm_source=twitter&utm_medium=cpc&gclid=123#heading-1';
      expect(cleanUrl(dirty)).toBe('https://example.com/article');
    });

    it('strips trailing slashes from path', () => {
      const url = 'https://example.com/blog/post/';
      expect(cleanUrl(url)).toBe('https://example.com/blog/post');
    });

    it('preserves root domain slash', () => {
      const url = 'https://example.com/';
      expect(cleanUrl(url)).toBe('https://example.com/');
    });
  });

  describe('extractCleanDomain', () => {
    it('strips www. prefix and extracts lowercase hostname', () => {
      expect(extractCleanDomain('https://www.nature.com/articles/123')).toBe('nature.com');
      expect(extractCleanDomain('https://docs.anthropic.com/en/docs')).toBe('docs.anthropic.com');
    });
  });

  describe('classifySourceReliability', () => {
    it('identifies academic domains', () => {
      expect(classifySourceReliability('https://arxiv.org/abs/1234', 'arxiv.org')).toBe('academic');
      expect(classifySourceReliability('https://cs.stanford.edu/paper', 'cs.stanford.edu')).toBe('academic');
    });

    it('identifies official and regulatory domains', () => {
      expect(classifySourceReliability('https://sec.gov/filing', 'sec.gov')).toBe('official');
      expect(classifySourceReliability('https://w3.org/spec', 'w3.org')).toBe('official');
    });

    it('identifies primary documentation domains', () => {
      expect(classifySourceReliability('https://github.com/danny-avila/LibreChat', 'github.com')).toBe('primary');
      expect(classifySourceReliability('https://anthropic.com/research', 'anthropic.com')).toBe('primary');
    });

    it('identifies authoritative news outlets', () => {
      expect(classifySourceReliability('https://bloomberg.com/tech', 'bloomberg.com')).toBe('news');
      expect(classifySourceReliability('https://reuters.com/markets', 'reuters.com')).toBe('news');
    });

    it('defaults unknown domains to community', () => {
      expect(classifySourceReliability('https://randomblog.xyz/post', 'randomblog.xyz')).toBe('community');
    });
  });

  describe('SourceCollector', () => {
    it('assigns sequential 1-based IDs and deduplicates identical URLs', () => {
      const collector = new SourceCollector();

      const s1 = collector.addSource({
        url: 'https://arxiv.org/abs/2401.001?utm_source=rss',
        title: 'Title 1',
        snippet: 'Snippet 1',
      });

      const s2 = collector.addSource({
        url: 'https://docs.anthropic.com/overview',
        title: 'Title 2',
        snippet: 'Snippet 2',
      });

      // Duplicate of s1 with different tracking param
      const s1Dup = collector.addSource({
        url: 'https://arxiv.org/abs/2401.001?utm_medium=feed',
        title: 'Title 1 Longer Title',
        snippet: 'Snippet 1 Updated Longer',
      });

      expect(s1.id).toBe(1);
      expect(s2.id).toBe(2);
      expect(s1Dup.id).toBe(1);
      expect(collector.getCount()).toBe(2);
      expect(collector.getSourceById(1)?.title).toBe('Title 1 Longer Title');
    });

    it('formats clean Markdown bibliography with citations', () => {
      const collector = new SourceCollector();
      collector.addSource({
        url: 'https://nature.com/articles/s41586-024-001',
        title: 'Quantum Advantage in 2026',
        snippet: 'Demonstration of fault-tolerant logical qubits.',
        publishedDate: '2026-01-15',
      });

      const bib = collector.formatBibliographyMarkdown();
      expect(bib).toContain('### Sources & References');
      expect(bib).toContain('[1] [Quantum Advantage in 2026](https://nature.com/articles/s41586-024-001)');
      expect(bib).toContain('`academic`');
      expect(bib).toContain('nature.com');
    });
  });
});
