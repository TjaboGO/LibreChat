/**
 * Design Extractor for Design Canvas
 *
 * Extracts dynamic layers (DOM hierarchy) and design tokens (color palette,
 * typography) from live React/HTML artifacts.
 * Inspired by ByteDance UI-TARS AST inspection and Browser-Use DOM tree serialization.
 */

export interface DesignLayerItem {
  id: string;
  name: string;
  tag: string;
  elementCount: number;
  type: 'header' | 'hero' | 'section' | 'grid' | 'form' | 'button' | 'footer' | 'component';
}

export interface ColorToken {
  name: string;
  value: string;
  cssClass?: string;
}

export interface TypographyToken {
  category: string;
  value: string;
  fontFamily: string;
}

/**
 * Extracts layer hierarchy from JSX/HTML code.
 */
export function extractLayersFromCode(code: string): DesignLayerItem[] {
  if (!code || typeof code !== 'string') {
    return [];
  }

  const layers: DesignLayerItem[] = [];
  let layerIndex = 1;

  // Check for Header / Nav
  const navMatch = code.match(/<(header|nav)[^>]*>([\s\S]*?)<\/\1>/i);
  if (navMatch) {
    const buttons = (navMatch[2].match(/<(button|a)[^>]*>/gi) || []).length;
    layers.push({
      id: `layer-${layerIndex++}`,
      name: 'Navigation Bar',
      tag: navMatch[1].toLowerCase(),
      elementCount: Math.max(buttons, 1),
      type: 'header',
    });
  }

  // Check for Hero / Main heading
  const h1Match = code.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    const rawHeading = h1Match[1].replace(/<[^>]+>/g, '').trim();
    const headingText = rawHeading.length > 25 ? `${rawHeading.slice(0, 22)}...` : rawHeading;
    layers.push({
      id: `layer-${layerIndex++}`,
      name: headingText ? `Hero: "${headingText}"` : 'Hero Section',
      tag: 'h1',
      elementCount: 1,
      type: 'hero',
    });
  }

  // Check for Forms and Inputs
  const formMatches = code.match(/<form[^>]*>([\s\S]*?)<\/form>/gi);
  if (formMatches) {
    for (const formHtml of formMatches) {
      const inputs = (formHtml.match(/<(input|select|textarea)[^>]*>/gi) || []).length;
      layers.push({
        id: `layer-${layerIndex++}`,
        name: 'Interactive Form',
        tag: 'form',
        elementCount: Math.max(inputs, 1),
        type: 'form',
      });
    }
  } else {
    const looseInputs = (code.match(/<(input|select|textarea)[^>]*>/gi) || []).length;
    if (looseInputs > 0) {
      layers.push({
        id: `layer-${layerIndex++}`,
        name: 'Form Controls',
        tag: 'input',
        elementCount: looseInputs,
        type: 'form',
      });
    }
  }

  // Check for Grids or Cards
  const gridMatches = code.match(
    /className=["'][^"']*\b(grid|flex-wrap|space-y-[0-9]+)[^"']*["']/gi,
  );
  if (gridMatches && gridMatches.length > 0) {
    layers.push({
      id: `layer-${layerIndex++}`,
      name: 'Component Grid Layout',
      tag: 'div',
      elementCount: gridMatches.length,
      type: 'grid',
    });
  }

  // Check for Interactive Buttons
  const buttonMatches = (code.match(/<button[^>]*>([\s\S]*?)<\/button>/gi) || []).length;
  if (buttonMatches > 0) {
    layers.push({
      id: `layer-${layerIndex++}`,
      name: 'Action Buttons',
      tag: 'button',
      elementCount: buttonMatches,
      type: 'button',
    });
  }

  // Check for Section containers
  const sectionCount = (code.match(/<(section|article|main)[^>]*>/gi) || []).length;
  if (sectionCount > 0) {
    layers.push({
      id: `layer-${layerIndex++}`,
      name: 'Content Sections',
      tag: 'section',
      elementCount: sectionCount,
      type: 'section',
    });
  }

  // Check for Footer
  const footerMatch = code.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
  if (footerMatch) {
    layers.push({
      id: `layer-${layerIndex++}`,
      name: 'Footer Block',
      tag: 'footer',
      elementCount: 1,
      type: 'footer',
    });
  }

  // Fallback if no specific structures matched
  if (layers.length === 0) {
    layers.push({
      id: `layer-1`,
      name: 'Root Canvas Component',
      tag: 'div',
      elementCount: 1,
      type: 'component',
    });
  }

  return layers;
}

/**
 * Extracts design tokens (colors and typography) from artifact code.
 */
export function extractTokensFromCode(code: string): {
  palette: ColorToken[];
  typography: TypographyToken[];
} {
  const palette: ColorToken[] = [];
  const typography: TypographyToken[] = [];
  const seenColors = new Set<string>();

  // Extract Tailwind color classes (e.g., bg-orange-600, text-slate-900, border-amber-500)
  const tailwindColorRegex =
    /\b(bg|text|border|ring)-(orange|amber|blue|indigo|emerald|teal|purple|rose|red|slate|gray|zinc)-([1-9]00)\b/g;
  let match: RegExpExecArray | null;
  while ((match = tailwindColorRegex.exec(code)) !== null) {
    const role = match[1];
    const hue = match[2];
    const shade = match[3];
    const colorKey = `${hue}-${shade}`;

    if (!seenColors.has(colorKey) && palette.length < 8) {
      seenColors.add(colorKey);
      const isPrimary = palette.length === 0;
      let label = 'Accent';
      if (isPrimary) {
        label = 'Primary';
      } else if (role === 'bg') {
        label = 'Surface';
      } else if (role === 'border') {
        label = 'Border';
      }

      palette.push({
        name: `${label} (${hue}-${shade})`,
        value: `var(--color-${colorKey}, ${colorKey})`,
        cssClass: `${role}-${colorKey}`,
      });
    }
  }

  // Extract hex colors
  const hexRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
  while ((match = hexRegex.exec(code)) !== null) {
    const hex = match[0].toUpperCase();
    if (!seenColors.has(hex) && palette.length < 8) {
      seenColors.add(hex);
      palette.push({
        name: `Hex ${hex}`,
        value: hex,
      });
    }
  }

  // Default color palette fallback if code has few explicit color tokens
  if (palette.length === 0) {
    palette.push(
      { name: 'Primary Accent', value: '#D97706', cssClass: 'bg-orange-600' },
      { name: 'Surface Cream', value: '#FAF9F5', cssClass: 'bg-[#FAF9F5]' },
      { name: 'Card Background', value: '#FFFFFF', cssClass: 'bg-white' },
      { name: 'Charcoal Text', value: '#1F1E1D', cssClass: 'text-[#1F1E1D]' },
    );
  }

  // Extract Typography tokens
  if (code.includes('font-serif')) {
    typography.push({
      category: 'Headings / Display',
      value: 'Anthropic Serif Display',
      fontFamily: 'serif',
    });
  }
  if (code.includes('font-mono')) {
    typography.push({
      category: 'Code / Technical',
      value: 'JetBrains Mono',
      fontFamily: 'monospace',
    });
  }
  typography.push({
    category: 'Body / Interface',
    value: 'Inter / System Sans-serif',
    fontFamily: 'sans-serif',
  });

  return { palette, typography };
}

/**
 * Generates an initial starter React + Tailwind design artifact
 * based on project title and design system name.
 */
export function generateStarterDesignCode(title: string, designSystem: string): string {
  const cleanTitle = title.trim() || 'Interactive Design Prototype';
  const isDarkAccent = designSystem.toLowerCase().includes('brutalist');
  const accentColor = isDarkAccent ? 'bg-slate-900 text-white' : 'bg-orange-600 text-white';

  return `import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Star, Layers, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'pricing'>('overview');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1F1E1D] font-sans antialiased p-6 md:p-12">
      {/* Header & Nav */}
      <header className="max-w-5xl mx-auto flex items-center justify-between border-b border-stone-200/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight">${cleanTitle}</span>
        </div>
        <nav className="flex items-center gap-6 text-xs font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'text-orange-600 font-semibold' : 'hover:text-stone-900'}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={activeTab === 'features' ? 'text-orange-600 font-semibold' : 'hover:text-stone-900'}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={activeTab === 'pricing' ? 'text-orange-600 font-semibold' : 'hover:text-stone-900'}
          >
            Pricing
          </button>
        </nav>
      </header>

      {/* Hero Artboard */}
      <main className="max-w-5xl mx-auto py-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-700">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>${designSystem} Design System</span>
        </div>

        <h1 className="mt-6 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1F1E1D] max-w-2xl mx-auto leading-tight">
          Crafting exceptional interfaces with precision.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
          Self-contained interactive artifact with live React state, responsive viewports, and design tokens.
        </p>

        {/* Action Form */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-auto flex-1 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
          <button
            type="button"
            onClick={() => setSubscribed(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl ${accentColor} px-5 py-2.5 text-xs font-semibold shadow-sm transition-all hover:opacity-90 active:scale-98"
          >
            <span>{subscribed ? 'Subscribed!' : 'Get Started'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {subscribed && (
          <p className="mt-3 text-xs text-emerald-600 font-medium animate-fade-in">
            ✓ Welcome aboard! Your sandbox project is ready.
          </p>
        )}

        {/* Feature Cards Grid */}
        <section className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
            <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">Dynamic Hierarchy</h3>
            <p className="mt-1 text-xs text-stone-600 leading-normal">
              Inspected in real-time by the Design Canvas layer parser.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
            <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">Zero Mocks</h3>
            <p className="mt-1 text-xs text-stone-600 leading-normal">
              Direct connection to the LibreChat artifacts execution pipeline.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">Multi-Viewport</h3>
            <p className="mt-1 text-xs text-stone-600 leading-normal">
              Seamlessly toggle between Desktop, Tablet, and Mobile scales.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}`;
}
