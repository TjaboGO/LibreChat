---
name: higgsfield-site-builder
description: Generates production-ready, full-stack React 19 and TanStack Start websites with immersive multimedia, cinematic hero sections, and superhero-level visual design.
when-to-use: Use when building modern web apps, landing pages, interactive SaaS dashboards, or full-stack web applications with rich visual appeal and live Artifacts preview.
always-apply: false
user-invocable: true
---

# Higgsfield Superhero Website Builder Protocol

## 1. Operativ Vision & Mål
Verktyg som Lovable fastnar i eviga regenereringsloopar där buggar lagas med nya buggar medan credits rinner iväg; verktyg som Framer låser in användaren i en proprietär miljö utan full kodfrihet.

**Higgsfield-modellen** förenar full kodfrihet (React 19, TypeScript, TanStack Start, Tailwind CSS) med generativ multimedia i världsklass:
1. **Superhero Wow-Faktor:** Ingen tråkig "Bootstrap/Tailwind-mall" med grå rutor. Varje sajt får filmiska hjälteavsnitt (cinematic hero video/backgrounds), levande typografi och mikroskopiska interaktionsdetaljer.
2. **Realtids Sandpack & Iframe Preview:** Webbplatsen renderas och interageras med direkt i Artifacts-panelen bredvid chatten med viewport-växlare (Desktop / Tablet / Mobile).
3. **One-Click Export:** Direkt nedladdning av komplett produktionskod (`.tsx` / ZIP) redo för hosting på Vercel, Netlify eller Cloudflare Workers.

---

## 2. Arkitektur & Komponentstandard

När du bygger webbplatser med denna färdighet, följ strikt:

### 2.1 Teknisk Stack
- **Framework:** React 19 (Hooks, Actions, Server Components readiness).
- **Styling:** Tailwind CSS med genomtänkta dark/light-klasser och färgpaletter (slate/indigo/amber/emerald).
- **Ikonografi:** `lucide-react` för rena, moderna symboler.
- **State & Interaktivitet:** Fullt fungerande formulär, interaktiva flikar, modaler och animerade övergångar i ren React.

### 2.2 Visuella Designprinciper
1. **Hero Section med Hög Immersion:**
   - Djup mörk eller ren canvas med subtila gradient-mesh eller abstrakta bakgrunder.
   - Kristallklar värdepremiss (H1 med gradient-text, max 8 ord).
   - Primär och sekundär Call to Action (CTA) med hover-effekter och ikoner.
2. **Social Proof & Metrics:**
   - Riktiga siffror, företags- eller verktygslogotyper och interaktiva betygskort.
3. **Feature Grid med Interaktiva Kort:**
   - 3-kolumners bento-grid med ikoner, korta förklaringar och mikro-interaktioner vid hover.
4. **Live Interactive Playground / Widget:**
   - En miniräknare, interaktiv demo eller interaktiv tidslinje som visar produktens värde direkt i webbläsaren.

---

## 3. Artefakt-format för Sandpack Preview

För att webbplatsen ska renderas omedelbart i Artifacts-panelen, omslut alltid källkoden i ett React-artefaktblock:

````markdown
:::artifact{identifier="higgsfield-landing" type="application/vnd.react" title="Modern AI SaaS Landing Page"}
```tsx
import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, Shield, Zap, Globe, Github } from 'lucide-react';

export default function App() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Fullständig ren React 19-komponentkod
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-black">
      {/* Navigation, Hero, Bento Grid, Interactive Demo, Footer */}
    </div>
  );
}
```
:::
````

---

## 4. Multi-Viewport & Export
Användaren kan i Artifacts-panelen:
- Växla mellan **Desktop** (100%), **Tablet** (768px) och **Mobile** (375px) via snabbknapparna i panelens verktygsfält.
- Klicka på **"Download"** eller **"Copy"** för att hämta källkoden eller öppna i Design Canvas (`/design`).

---

## 5. Kvalitetssäkring
- [ ] Är koden 100 % självständig utan trasiga externa beroenden?
- [ ] Fungerar alla knappar, flikar och inmatningsfält interaktivt i Sandpack?
- [ ] Är layouten fullt responsiv över mobil och desktop?
- [ ] Skapas en omedelbar "superhero"-känsla med professionell visuell finish?
