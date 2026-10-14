# Task 015: Design Canvas & Aggregation (Fas 15)

## Översikt & Mål
Fas 15 i `docs/MASTER-PLAN.md` fokuserar på att göra Design Canvas verklig genom att koppla den till LibreChats artifacts-pipeline (`:::artifact`), förlänga live docs och slides med PDF-export via Playwright print-capabilities, samt skissa på hur `browser-use` kan köras som en isolerad container-service för tunga multi-tab-jobb.

---

## 1. Design Canvas Verklig Datakälla & Artifacts Pipeline

### Tidigare tillstånd
- `DesignCanvasView.tsx` renderade hårdkodad placeholder ("Acme Corp") med statiska HTML-element och mock-tokens.
- Valet "design" i `OutputFormatDropdown` genererade ingen exekverbar artefakt som kunde öppnas i canvasen.
- Canvasen saknade koppling till `store.artifactsState` och `store.currentArtifactId`.

### Implementerat arbete
1. **Fullständig Recoil- & Artifacts-koppling**:
   - `client/src/components/Design/DesignCanvasView.tsx` är kopplad till `store.artifactsState` och `store.currentArtifactId`.
   - Använder LibreChats inbyggda `useArtifactProps` för att ladda Sandpack React Preview-miljön med fullt Tailwind CSS-stöd, samt sandboxad iframe för HTML-artefakter.
   - När ett design-artefakt skapas i chatten kan användaren med 1 klick öppna det i canvasen via knappen "Open in Design Canvas" i artefakt-verktygsraden (`client/src/components/Artifacts/Artifacts.tsx`).
   - `client/src/components/Design/DesignView.tsx` känner automatiskt av om det finns ett aktivt artefakt i sessionen och öppnar canvasen direkt.
   - `client/src/components/Design/DesignLandingPage.tsx` visar nu levande artefakter i projektlistan bredvid exempelprojekten. Klick på en levande artefakt sätter `currentArtifactId` och laddar koden direkt i canvasen.

2. **Dynamisk lager- & token-extraktion (`designExtractor.ts`)**:
   - Skapade `client/src/components/Design/designExtractor.ts` inspirerad av ByteDance UI-TARS AST-parsing och Browser-Use DOM-serialisering.
   - `extractLayersFromCode`: Inspekterar JSX/HTML-strukturen och identifierar semantiska lager (`header`, `hero`, `form`, `grid`, `section`, `button`, `footer`).
   - `extractTokensFromCode`: Extraherar dynamiskt Tailwind-färgklasser (`bg-orange-600`, `text-slate-900`, `border-amber-500`), hex-färger och typografiklasser (`font-serif`, `font-mono`, `font-sans`) från den faktiska koden.
   - `generateStarterDesignCode`: Genererar en responsiv starter-komponent i React + Tailwind anpassad efter valt designsystem (Modernist, Brutalist, etc.).

3. **Versionshantering & Export**:
   - Versionsväljare (`v1`, `v2`, etc.) för artefakter med samma identifierare.
   - Responsiv förhandsgranskning (Desktop, Tablet, Mobile) och zoomkontroll.
   - Riktig kodexport: Kopiering till urklipp samt nedladdning av `.tsx` / `.html`-fil direkt till användarens dator.
   - Dela-knapp som genererar `:::artifact{identifier="design-canvas" ...}`-kodblock.

4. **Koppling mot `OutputFormatDropdown`**:
   - `FORMAT_DIRECTIVES.design` i `ChatForm.tsx` instruerar modellen att returnera en `:::artifact{identifier="design-canvas" type="application/vnd.react" title="..."}` med modern Tailwind-styling och ren komponenthierarki.

---

## 2. Live Docs & Slides PDF Export

### Implementerat arbete
1. **Utökad skill `skill/live-docs-and-slides/SKILL.md`**:
   - Lade till fullständiga `@media print`-regler för både presentationsbilder (landscape, `page-break-after: always`, döljer navigeringskontroller) och dynamiska dokument (portrait, rena marginaler, undviker brutna tabeller/kodblock).
   - Inbäddad klientknapp (`window.print()`) i HTML-mallen för direkt PDF-utskrift i webbläsaren.
2. **Playwright MCP `browser_pdf_save`**:
   - `@playwright/mcp` i `librechat.yaml` är konfigurerad med `--caps=vision,pdf`.
   - Modellen och agenten kan anropa `browser_pdf_save({ filename: "deck-title.pdf" })` för att autonomt exportera presentationer och dokument till PDF.
3. **Verifierad körd demo**:
   - Ett genererat slide deck kördes genom Playwright och producerade en giltig PDF-artefakt på 125 032 byte utan mockdata.

---

## 3. Arkitekturskiss: `browser-use` som separat container-service

*Detta avsnitt är en teoretisk design och arkitekturskiss (ingen kod introduceras i detta steg).*

### Bakgrund & Problemställning
Playwright MCP fungerar utmärkt för deterministisk tillgänglighetsträdsnavigering och enskilda sidor. För tunga multi-tab-undersökningar (t.ex. parallell scraping av 10 sökresultat, långvarig webbresearch eller bakgrundsaggregering) är en fristående Python-container med `browser-use` lämplig för att inte belasta huvud-API:et.

### Arkitekturöversikt
```
┌────────────────────────────────────────────────────────┐
│ LibreChat Agent / Chat Interface (Node.js/TypeScript)  │
└──────────────────────────┬─────────────────────────────┘
                           │ Stdio / SSE MCP Protocol
                           ▼
┌────────────────────────────────────────────────────────┐
│ Thin MCP Proxy Adapter (`browser-use-mcp-proxy.ts`)   │
│ - Implementerar standard MCP tools                    │
│ - HTTP/WebSocket-klient mot browser-use daemon         │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP POST / WebSocket
                           ▼
┌────────────────────────────────────────────────────────┐
│ Docker Container: `librechat-browser-worker`           │
│ - Base: python:3.11-slim + Chromium                    │
│ - Framework: FastAPI + browser-use                     │
│ - Endpoints:                                           │
│     POST /tasks (start multi-tab aggregation)          │
│     GET /tasks/{id}/status (progress & telemetry)      │
│     GET /tasks/{id}/artifacts (PDFs, screenshots, DOM) │
│     WS /tasks/{id}/events (live stream of actions)     │
└────────────────────────────────────────────────────────┘
```

### Komponenter
1. **FastAPI Container Daemon**:
   - Exponerar ett REST- och WebSocket-API över localhost.
   - Initierar `Browser(config=BrowserConfig(headless=True))` från `browser-use`.
   - Isolerar varje uppgift i ett eget `BrowserContext` med egna cookies och cookies-rensning.
2. **Thin MCP Wrapper**:
   - En lättviktig Node.js/TS MCP-server som deklareras i `librechat.yaml`.
   - Mappar MCP-verktygsanrop som `browser_use_research({ goal: string, max_tabs: number })` till HTTP-anrop mot containern.
3. **Resurser & Kostnad**:
   - 100 % gratis & open source (MIT/Apache 2.0).
   - Körs på CPU, inga betalda externa vision-modeller behövs (Playwright/browser-use DOM accessibility-extraktion).

---

## Verifiering & Tester
- **Client typecheck**: `npx tsc --noEmit` i `client/` passerade utan fel (kod 0).
- **Unit tests**: `client/src/components/Design/__tests__/designExtractor.spec.ts` kördes med Jest och passerade alla 5 tester.
- **Git pre-commit hooks**: Husky lint-staged (sort-imports, prettier, eslint) godkändes.
- **End-to-end PDF demo**: Genererade och validerade 125 KB PDF-fil med Playwright print capability.
