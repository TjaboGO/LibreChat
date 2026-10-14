import {
  extractLayersFromCode,
  extractTokensFromCode,
  generateStarterDesignCode,
} from '../designExtractor';

describe('designExtractor', () => {
  describe('extractLayersFromCode', () => {
    it('returns a fallback layer when given empty or minimal code', () => {
      const layers = extractLayersFromCode('');
      expect(layers).toEqual([]);

      const minimal = extractLayersFromCode('<div>Plain text</div>');
      expect(minimal).toHaveLength(1);
      expect(minimal[0].name).toBe('Root Canvas Component');
    });

    it('extracts navigation, hero, form, buttons, and footer', () => {
      const sampleCode = `
        <div className="app">
          <header>
            <nav>
              <a href="/">Home</a>
              <button>Menu</button>
            </nav>
          </header>
          <main>
            <h1>Autonomous Agent Platform</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Prompt" />
              <button type="submit">Submit</button>
            </form>
            <section className="grid grid-cols-3">
              <div>Card 1</div>
              <div>Card 2</div>
            </section>
          </main>
          <footer>
            <p>Copyright 2026</p>
          </footer>
        </div>
      `;

      const layers = extractLayersFromCode(sampleCode);
      const types = layers.map((l) => l.type);

      expect(types).toContain('header');
      expect(types).toContain('hero');
      expect(types).toContain('form');
      expect(types).toContain('grid');
      expect(types).toContain('button');
      expect(types).toContain('section');
      expect(types).toContain('footer');

      const heroLayer = layers.find((l) => l.type === 'hero');
      expect(heroLayer?.name).toContain('Autonomous Agent');
    });
  });

  describe('extractTokensFromCode', () => {
    it('extracts tailwind colors and hex values', () => {
      const code = `
        <div className="bg-orange-600 text-slate-900 border-amber-500 bg-[#FAF9F5] text-[#1F1E1D] font-serif font-mono">
          <h1>Tokens Demo</h1>
        </div>
      `;

      const { palette, typography } = extractTokensFromCode(code);

      expect(palette.length).toBeGreaterThan(0);
      const values = palette.map((p) => p.value);
      const hasTailwindOrHex = values.some(
        (v) => v.includes('orange-600') || v.includes('#FAF9F5') || v.includes('#1F1E1D'),
      );
      expect(hasTailwindOrHex).toBe(true);

      const typoCategories = typography.map((t) => t.category);
      expect(typoCategories).toContain('Headings / Display');
      expect(typoCategories).toContain('Code / Technical');
      expect(typoCategories).toContain('Body / Interface');
    });

    it('falls back to default Claude tokens if no explicit styles found', () => {
      const { palette, typography } = extractTokensFromCode('<div>Simple</div>');
      expect(palette.length).toBeGreaterThan(0);
      expect(palette[0].name).toBe('Primary Accent');
      expect(typography.length).toBe(1);
      expect(typography[0].category).toBe('Body / Interface');
    });
  });

  describe('generateStarterDesignCode', () => {
    it('generates a starter React component containing title and design system', () => {
      const code = generateStarterDesignCode('Enterprise Analytics', 'Broadsheet');
      expect(code).toContain('Enterprise Analytics');
      expect(code).toContain('Broadsheet Design System');
      expect(code).toContain('export default function App()');
      expect(code).toContain('import React');
    });
  });
});
