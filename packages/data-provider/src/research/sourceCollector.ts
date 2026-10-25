import type { ResearchSource, SourceReliability } from './types';

/**
 * Strips tracking parameters, hash fragments, and trailing slashes to form a canonical URL.
 */
export function cleanUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const keys = Array.from(parsed.searchParams.keys());
    for (const key of keys) {
      if (
        key.startsWith('utm_') ||
        key.startsWith('fb_') ||
        key.startsWith('ref_') ||
        key === 'gclid' ||
        key === 'msclkid' ||
        key === 'ref' ||
        key === 'source' ||
        key === 'fbclid'
      ) {
        parsed.searchParams.delete(key);
      }
    }
    parsed.hash = '';

    let clean = parsed.toString();
    if (clean.endsWith('/') && parsed.pathname !== '/') {
      clean = clean.slice(0, -1);
    }
    return clean;
  } catch {
    return rawUrl.trim();
  }
}

/**
 * Extracts clean domain name without leading 'www.'.
 */
export function extractCleanDomain(url: string): string {
  try {
    const parsed = new URL(url);
    let domain = parsed.hostname.toLowerCase();
    if (domain.startsWith('www.')) {
      domain = domain.slice(4);
    }
    return domain;
  } catch {
    const match = /(?:https?:\/\/)?(?:www\.)?([^/]+)/i.exec(url);
    return match ? match[1].toLowerCase() : url;
  }
}

/**
 * Classifies the authority and reliability tier of a web source.
 */
export function classifySourceReliability(url: string, domain: string): SourceReliability {
  const d = domain.toLowerCase();

  // Academic & Research
  if (
    d.endsWith('.edu') ||
    d.includes('arxiv.org') ||
    d.includes('nature.com') ||
    d.includes('ieee.org') ||
    d.includes('acm.org') ||
    d.includes('science.org') ||
    d.includes('nih.gov') ||
    d.includes('researchgate.net') ||
    d.includes('biorxiv.org')
  ) {
    return 'academic';
  }

  // Official / Regulatory
  if (
    d.endsWith('.gov') ||
    d.endsWith('.mil') ||
    d.includes('w3.org') ||
    d.includes('ietf.org') ||
    d.includes('iso.org') ||
    d.includes('sec.gov') ||
    d.includes('europa.eu')
  ) {
    return 'official';
  }

  // Primary Sources & Official Documentation
  if (
    d.includes('github.com') ||
    d.includes('anthropic.com') ||
    d.includes('openai.com') ||
    d.includes('deepmind.google') ||
    d.includes('google.com') ||
    d.includes('microsoft.com') ||
    d.includes('meta.com') ||
    d.includes('apple.com') ||
    d.includes('docs.') ||
    d.includes('developer.')
  ) {
    return 'primary';
  }

  // Authoritative News & Financial Outlets
  if (
    d.includes('bloomberg.com') ||
    d.includes('reuters.com') ||
    d.includes('wsj.com') ||
    d.includes('ft.com') ||
    d.includes('nytimes.com') ||
    d.includes('techcrunch.com') ||
    d.includes('wired.com') ||
    d.includes('theverge.com') ||
    d.includes('arstechnica.com')
  ) {
    return 'news';
  }

  return 'community';
}

/**
 * Collector and normalizer for sources gathered during deep research.
 */
export class SourceCollector {
  private sources: Map<string, ResearchSource> = new Map();
  private orderedList: ResearchSource[] = [];
  private nextCitationId = 1;

  /**
   * Adds or updates a research source. Deduplicates based on clean canonical URL.
   */
  public addSource(raw: {
    url: string;
    title?: string;
    snippet?: string;
    publishedDate?: string;
    relevanceScore?: number;
    reliability?: SourceReliability;
  }): ResearchSource {
    const canonical = cleanUrl(raw.url);
    const existing = this.sources.get(canonical);

    if (existing) {
      if (raw.title && raw.title.length > existing.title.length) {
        existing.title = raw.title;
      }
      if (raw.snippet && raw.snippet.length > existing.snippet.length) {
        existing.snippet = raw.snippet;
      }
      return existing;
    }

    const domain = extractCleanDomain(canonical);
    const reliability = raw.reliability || classifySourceReliability(canonical, domain);
    const citationId = this.nextCitationId++;

    const source: ResearchSource = {
      id: citationId,
      url: canonical,
      domain,
      title: raw.title?.trim() || `${domain} source`,
      snippet: raw.snippet?.trim() || 'No preview snippet available.',
      publishedDate: raw.publishedDate,
      reliability,
      relevanceScore: Math.min(1, Math.max(0, raw.relevanceScore ?? 0.85)),
    };

    this.sources.set(canonical, source);
    this.orderedList.push(source);
    return source;
  }

  public getSources(): ResearchSource[] {
    return [...this.orderedList];
  }

  public getSourceById(id: number): ResearchSource | undefined {
    return this.orderedList.find((s) => s.id === id);
  }

  public getCount(): number {
    return this.orderedList.length;
  }

  /**
   * Formats all accumulated sources into a clean Markdown bibliography section.
   */
  public formatBibliographyMarkdown(): string {
    if (this.orderedList.length === 0) {
      return '';
    }

    const lines: string[] = ['### Sources & References', ''];
    for (const source of this.orderedList) {
      const badge = source.reliability ? `\`${source.reliability}\`` : '';
      const date = source.publishedDate ? ` (${source.publishedDate})` : '';
      lines.push(
        `[${source.id}] [${source.title}](${source.url})${date} — ${badge} *${source.domain}*`,
      );
      if (source.snippet) {
        lines.push(`> "${source.snippet.slice(0, 200)}..."`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }
}
