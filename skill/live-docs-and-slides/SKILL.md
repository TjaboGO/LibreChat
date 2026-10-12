---
name: live-docs-and-slides
description: Create live interactive presentations (Claude Slides) and structured dynamic documents (Claude Docs) using responsive HTML/React artifacts with full presentation controls.
when-to-use: When the user requests slides, presentations, pitches, executive summaries, live docs, or structured interactive reports.
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
   - Print/Export-friendly styling with clean `@media print` rules.
