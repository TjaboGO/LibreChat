---
name: live-docs-and-slides
description: Create live interactive presentations (Claude Slides) and structured dynamic documents (Claude Docs) using responsive HTML/React artifacts with full presentation controls, @media print optimization, and one-click/Playwright PDF export.
when-to-use: When the user requests slides, presentations, pitches, executive summaries, live docs, structured interactive reports, or asks to export presentations/docs to PDF.
user-invocable: true
---

# Live Docs and Slides Designer

When asked to generate presentations, slide decks, or structured live documents (in the style of Claude Slides or Claude Docs), generate them as interactive artifacts.

## Presentation / Slides Guidelines (Claude Slides style)

1. **Container Directive**: Wrap slide presentations in a `text/html` artifact:
   ```markdown
   :::artifact{identifier="interactive-presentation" type="text/html" title="Executive Strategy Presentation"}
   <!-- HTML content here -->
   :::
   ```

2. **Slide Features**:
   - Built with modern Tailwind CSS via CDN (`https://cdn.tailwindcss.com`).
   - Include keyboard navigation: Left/Right arrow keys and Spacebar advance/reverse slides.
   - Include navigation buttons (Previous, Next, Fullscreen, Jump to Slide).
   - Display a live slide indicator (e.g. "Slide 3 of 10") and a progress bar.
   - Clean, elegant Claude-inspired design palette: Warm cream backgrounds (`#FAF9F5`), charcoal headers (`#1F1E1D`), terracotta/coral accent (`#D97706` / `#C2410C`), subtle borders and soft shadows.
   - High visual contrast and beautiful typography with generous whitespace.
   - **One-Click Print/Export Button**: Include an export button in the navigation header:
     ```html
     <button onclick="window.print()" class="px-3 py-1 text-xs rounded-lg border border-stone-300 hover:bg-stone-100 flex items-center gap-1.5 no-print">
       <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
       <span>Export PDF</span>
     </button>
     ```

3. **Print & PDF Styling (@media print)**:
   Always include print stylesheets so that each slide renders on its own page without UI controls:
   ```html
   <style>
     @media print {
       @page {
         size: landscape;
         margin: 0;
       }
       body {
         background: white !important;
         color: #1F1E1D !important;
         -webkit-print-color-adjust: exact !important;
         print-color-adjust: exact !important;
       }
       .no-print, .nav-controls, .progress-bar, header, footer {
         display: none !important;
       }
       .slide {
         display: flex !important;
         page-break-after: always;
         break-after: page;
         height: 100vh !important;
         width: 100vw !important;
         box-shadow: none !important;
         border: none !important;
         padding: 3rem !important;
       }
     }
   </style>
   ```

---

## Live Docs Guidelines (Claude Docs style)

1. **Container Directive**:
   ```markdown
   :::artifact{identifier="live-document" type="text/html" title="Product Specification & Architecture Doc"}
   <!-- HTML content here -->
   :::
   ```

2. **Document Features**:
   - Sticky table of contents / sidebar for rapid section navigation.
   - Reading progress indicator at top.
   - Expandable callout boxes (Note, Warning, Tip, Decision).
   - Interactive data tables with sorting or filtering if relevant.
   - One-click print/PDF button in doc header (`onclick="window.print()"`).
   - Clean, professional typographical hierarchy matching Claude's warm styling.

3. **Print & PDF Styling (@media print)**:
   ```html
   <style>
     @media print {
       @page {
         size: portrait;
         margin: 1.5cm;
       }
       body {
         background: white !important;
         color: #1F1E1D !important;
         font-size: 11pt !important;
         line-height: 1.5 !important;
         -webkit-print-color-adjust: exact !important;
         print-color-adjust: exact !important;
       }
       .no-print, .doc-sidebar, .toc, .progress-bar, nav, button {
         display: none !important;
       }
       main, article, .doc-content {
         width: 100% !important;
         margin: 0 !important;
         padding: 0 !important;
       }
       pre, code, blockquote, table, figure {
         page-break-inside: avoid;
         break-inside: avoid;
       }
       h1, h2, h3 {
         page-break-after: avoid;
         break-after: avoid;
       }
     }
   </style>
   ```

---

## Autonomous PDF Export via Playwright MCP (`browser_pdf_save`)

When the user requests an automated PDF export (e.g. "Save as PDF", "Export slides to PDF", "Generate PDF report"), the agent utilizes the built-in Playwright MCP print capability:

### Playwright MCP Configuration
In `librechat.yaml`, the Playwright MCP server is enabled with `--caps=vision,pdf`:
```yaml
mcpServers:
  playwright:
    type: stdio
    command: npx
    args:
      - -y
      - "@playwright/mcp"
      - "--headless"
      - "--caps=vision,pdf"
```

### Agentic PDF Export Protocol
1. **Prepare File or URL**:
   If the artifact is generated in the session, ensure it is rendered in the browser. You can navigate the headless browser directly to the local HTML file or localhost presentation URL using `browser_navigate`:
   ```json
   {
     "url": "http://localhost:3080/..." // or file path
   }
   ```
2. **Execute PDF Export**:
   Call the `browser_pdf_save` tool with a clean filename:
   ```json
   {
     "filename": "executive-strategy-presentation.pdf"
   }
   ```
   *Note: Playwright's `tab.page.pdf()` automatically applies the `@media print` CSS rules configured above, outputting pristine landscape slides or portrait documents.*
3. **Verify and Deliver**:
   The `browser_pdf_save` tool returns the generated file path. Confirm the saved file with the user and provide instructions for opening or downloading the file.
