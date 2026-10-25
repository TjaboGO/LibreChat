---
name: living-office-artifacts
description: Living interactive Microsoft Word (.docx), Excel (.xlsx), PowerPoint (.pptx), and print-ready PDF generator, reverse engineered from GPT-5.6 Sol Office and Claude Office.
when-to-use: Use when authoring formal business reports, financial models with live formulas, executive presentation slide decks, or multi-sheet data workbooks.
always-apply: false
user-invocable: true
---

# Living Office Artifacts Suite (Word, Excel, PowerPoint)

## 1. Systemöversikt & Filosofi
Denna färdighet implementerar den interaktiva Office-sviten från **GPT-5.6 Sol Office** och **Claude Office**:

1. **Word Document (`.docx`):**
   - Strukturerad layout med metadata (Titel, Författare, Datum, Version).
   - Formaterade rubriknivåer (H1, H2, H3), stycken och datatabeller.
   - Visuella callout-block (`[!NOTE]`, `[!WARNING]`, `[!TIP]`) med distinkta ikon- och färgteman.
   - Sömlös export till `.doc` / `.docx` samt browser-native `@media print` till PDF.

2. **Excel Spreadsheet (`.xlsx`):**
   - Interaktivt kalkylblad med formelmotor: `=SUM(A1:A5)`, `=AVERAGE(B1:B10)`, `=MAX(...)`, `=MIN(...)` och grundläggande aritmetik.
   - Interaktiv cellredigering med omedelbar omräkning av beroenden.
   - Multipla flikar/arbetsblad (t.ex. `Summary`, `Projections`, `Detailed Breakdown`).
   - Direkt export till Excel XML / `.xls` och RFC 4180 `.csv`.

3. **PowerPoint Presentation (`.pptx`):**
   - 16:9 Widescreen bildspelskänsla direkt i webbläsaren.
   - Optimerade layouter: Titelsida, Bullet split, KPI-metrikkort (`ARR: $28M (+140%)`), och citatsidor.
   - Talarnoter per bild via `Note:` eller `Speaker Note:`.
   - Thumbnail-navigering och tangentbordsstyrning.

---

## 2. Hur agenten skapar Living Office-artefakter

### Exempel 1: Skapa ett Word-dokument
Skriv artefakt med typ `docx` eller `document`:
````markdown
:::artifact{identifier="q1-review" type="docx" title="Q1 Strategic Review.docx"}
# Q1 Strategic Review
*Author: Gabriel Odenhagen*
*Date: 2026-02-15*

> [!NOTE] Executive Summary
> Strong double-digit revenue growth driven by autonomous agent deployments.

## 1. Platform Metrics
Our operational latency dropped by 40% following multi-hop search integration.

| Platform | Q4 Baseline | Q1 Result | Delta |
| --- | --- | --- | --- |
| Deep Research | 14s | 8.2s | -41% |
| Self-Healing Dev | 35s | 18.5s | -47% |

## 2. Next Horizon
> [!TIP] Living Artifacts
> Transition all business exports to native living office formats.
:::
````

### Exempel 2: Skapa ett Excel-kalkylblad med formler
Skriv artefakt med typ `xlsx` eller `spreadsheet`:
````markdown
:::artifact{identifier="fin-model" type="xlsx" title="Financial Projections.xlsx"}
Quarter,Revenue,Expenses,Operating Profit
Q1 2026,120000,75000,45000
Q2 2026,150000,82000,68000
Q3 2026,195000,95000,100000
Q4 2026,260000,110000,150000
Total,=SUM(B2:B5),=SUM(C2:C5),=SUM(D2:D5)
:::
````

### Exempel 3: Skapa en PowerPoint-presentation
Skriv artefakt med typ `pptx` eller `presentation`:
````markdown
:::artifact{identifier="pitch-deck" type="pptx" title="Board Pitch Deck.pptx"}
# Autonomous AI Platform 2026
## Board of Directors Strategy

---

# Key Growth Highlights
ARR: $28M (+140%)
Active Enterprise Teams: 1200 (+95%)
Net Dollar Retention: 148%

Note: Point out that NDR increased primarily due to multi-agent cowork seats.

---

# Strategic Architecture
- Recursive multi-hop research planner
- In-browser live development server with auto-heal
- Deterministic process and port management
- Living Office document suite
:::
````
