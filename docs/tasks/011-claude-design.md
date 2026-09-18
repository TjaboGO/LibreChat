# Task 011 — Claude Design-appen (claude.ai/design)

**Förutsättning:** Task 001–010 klara. Läs `docs/ui-reference/batch-1-screenshots.md` (rad 197–225).

**Mål:** Implementera Claude Design-produktytan:
1. **Design Startsida (`DesignLandingPage.tsx`):**
   - Fristående top bar med "Claude Design Beta" och användarprofil.
   - Centrerad serif-rubrik: "What should we create?".
   - Centrerat composer-kort med roterande placeholders, bifoga-knapp, designsystem-väljare, modellväljare och orange sändknapp.
   - "CHOOSE A TEMPLATE"-sektion (2×6 rutnät med Blank, Mobile app design, Slides, Document, Wireframe, Animation, UI mockups, Résumé, 3D object, Research, HTML email, Color + type pairing).
   - Flikar: "Projects", "Design systems", "Templates" med sökning och tabellvy.
   - Blå "Set up a design system!"-badge i nedre högra hörnet.
2. **Designsystem-hantering (`DesignSystemModal.tsx`):**
   - Modal "Add a design system":
     - "Create here" ("Connect to Figma or GitHub, or upload slides and assets").
     - "Create using Claude Code" ("Best fidelity if you have React components.").
   - Stilförvals-galleri (Modernist, Classical, Nocturne, Organic, Broadsheet, Industry).
3. **Interaktiv Canvas-renderare (`DesignCanvasView.tsx`):**
   - Fullskärms design-canvas med artboards.
   - Responsiv förhandsgranskning (Desktop, Tablet, Mobile).
   - Lagerträd (Layers panel) och designtoken-inspektör.
   - Zoom- och panoreringskontroller.

---

## Resultat

### Genomförda åtgärder

1. **Claude Design Startsida (`DesignLandingPage.tsx`):**
   - Fristående top bar med "Claude Design Beta" och användaravatar.
   - Centrerad serif-rubrik "What should we create?".
   - Centrerad prompt-composer med bifoga-fil, designsystem-väljare och orange cirkulär sändknapp.
   - Hopfällbar "Choose a template"-sektion med 12 mallar (Blank, Mobile app design, Slides, Document, Wireframe, Animation, UI mockups, Résumé, 3D object, Research, HTML email, Color + type pairing).
   - Projekt-tabell med kolumner för Name, Last viewed, Owner, Access samt stjärn- och snabbmenyer.
   - Blå flytande "Set up a design system!" badge i nedre högra hörnet.

2. **Designsystem-modal (`DesignSystemModal.tsx`):**
   - Modal med "Create here" (Figma/GitHub) och "Create using Claude Code" (React-komponenter, märkt "BEST FIDELITY").
   - Stilförvalsgalleri med Modernist, Classical, Nocturne, Organic, Broadsheet och Industry.

3. **Interaktiv Canvas-renderare (`DesignCanvasView.tsx`):**
   - Fullskärms design-arbetsyta med zoom-kontroller (50% till 150%).
   - Responsiva vyer (Desktop 840px, Tablet 520px, Mobile 320px).
   - Sidopanel med flikar för "Layers" (lagerträd) och "Tokens" (färgpaletter och typografi).
   - Live rendered mock preview och "Export code"-åtgärd.

4. **Integration & Routing:**
   - `DesignView.tsx` växlar sömlöst mellan landing page och interaktiv canvas.
   - Rutt `/design` är fullt integrerad.

5. **Kvalitetssäkring:**
   - 4 testsviter med 9 enhetstester gröna (`npm --prefix client run test:ci -- client/src/components/Design/__tests__/`).
   - `tsc --noEmit` felfri.
   - `eslint --max-warnings=0` och `prettier` validerade.
