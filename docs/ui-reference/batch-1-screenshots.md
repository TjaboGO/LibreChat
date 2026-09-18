# Batch 1 — Screenshot UI Catalog (files 1–20, sorted alphabetically)

Privacy note: sidebar chat titles, project/folder names, artifact titles, project
descriptions, the user's display name/initials, and any usage/billing numbers
(session counts, token counts, percentages, reset timers) visible in these
screenshots are personal/account content and have been deliberately **omitted**.
Only fixed app chrome — nav items, button/tab/menu labels, placeholders, section
headers, and layout — is recorded below. Three distinct product surfaces appear
in this batch: a consumer chat app ("Claude.ai"-style), a coding-agent/workspace
app (repo/branch/worktree chrome, routines, sessions), and a standalone design
tool ("Claude Design"). All three share the same light-mode visual language.

---

## Chat app — empty-state home / landing page

- Source files: `Skärmavbild 2026-09-18 kl. 20.06.10.png`

**Layout**
- Full-height left sidebar (~370px) on an off-white/cream background; main content area is a lighter warm-white, vertically centered.
- Top-left of sidebar: sidebar-collapse icon, back/forward chevrons, then two pill-shaped icon buttons (chat-bubble icon "active/selected" style, and a `</>` code icon) — a small two-way view switcher.
- Sidebar nav list (top to bottom, each with a leading icon): "New" (bold, `+` icon, light-gray pill background indicating default/selected), "Projects", "Artifacts", "Scheduled", "Design", "Customize", "More" (with a down-chevron, collapsible).
- Below nav: a secondary "Scheduled >" row (collapsed link), then a "Pinned" section header with one pinned project entry (folder icon) and several indented sub-items under it.
- Below that: "Chats and tasks" section header with a search icon and a filter/sort icon at the right, followed by a scrollable flat list of past chat titles (plain text rows, no icons, single line each, truncated with ellipsis if long).
- Bottom-left: account chip — circular avatar with initials, display name, plan tier badge ("Pro") with a down-chevron, and a download/export icon at the far right.

**Main content (center, vertically stacked, centered column ~870px wide)**
- Orange sunburst/asterisk icon (brand mark) inline before a large serif headline reading "{Time of day greeting}, {Name}" (e.g. "Evening, ...").
- Below headline: a horizontal notice bar (rounded corners, subtle border) reading "Usage limit reached · Resets {time} · limits shared with Claude Code" (the last phrase is a blue hyperlink) with a black pill button "Get more usage" on the right.
- Below that: a large rounded input card containing:
  - Placeholder text "How can I help you today?" (light gray, serif-adjacent sans, top-aligned).
  - A toolbar row inside the card: `+` icon button (attach), a two-option segmented toggle "Chat" / "Cowork" (the selected one, "Cowork", has a white pill/active background), then right-aligned: model name "Sonnet 5", effort label "High", a microphone icon, and a down-chevron (more options).
- Below the input card, outside it: a row of three plain-text toggle labels — "Project or folder", "Auto", "Output" — acting as quick-access buttons for scoping/behavior.
- Below that: an "Active" section header with a "Clear active" link at the far right, followed by a vertical list of automation/task cards. Each card has a small clock icon (with a blue notification dot), a bolt/lightning icon plus a title line, and a relative timestamp ("X hours ago") below it.

**Style**
- Light mode. Warm cream/off-white background throughout (not pure white).
- Serif display typeface for the greeting headline; sans-serif for all body/UI text.
- Orange/terracotta accent color used for: the sunburst brand icon, the lightning-bolt icons on task cards, and (elsewhere) small notification dots.
- Cards use soft rounded corners (~12–16px radius), thin 1px borders, no heavy drop shadows — a flat, minimal look.
- Buttons: black-filled pill buttons for primary actions ("Get more usage"), light-gray pill for a selected segmented-control option.

---

## Chat app — model/effort selector dropdown (open)

- Source files: `Skärmavbild 2026-09-18 kl. 20.11.02.png`

Same base landing page as above, with a two-panel flyout menu open above the composer's model control (anchored bottom-right of the input card):

- Left panel: a vertical list of model choices, each with a bold name and a gray subtitle:
  - "Fable 5.1" — subtitle "For your toughest challenges", tagged with an info icon "Requires usage credits" and a blue "Buy credits" pill button at the far right.
  - "Opus 5" — "For complex tasks".
  - "Sonnet 5" — "Most efficient for everyday tasks" (checkmark shown, currently selected).
  - "Haiku 4.5" — "Fastest for quick answers".
  - Divider, then a row "Effort" with current value "High" and a chevron (expandable), then "More models" row with a chevron.
- Right panel (secondary flyout, opened from "Effort"): header text "Higher effort means more thorough responses, but takes longer and uses your limits faster." followed by a vertical radio-style list: "Low", "Medium", "High" (labeled "Default", currently checked), "Extra", "Max" (tagged with a warning icon "2.5× or more usage"). Below a divider: a "Thinking" row with description "Can think for more complex tasks" and a toggle switch (on, colored blue/accent).

---

## Chat app — "Project or folder" picker dropdown (open)

- Source files: `Skärmavbild 2026-09-18 kl. 20.11.15.png`

Same base landing page, with a dropdown open beneath the "Project or folder" quick-toggle:
- Search field at top with placeholder "Search projects" and a filter icon on the right.
- Section header "Pinned" listing project rows (each with a small folder/box icon).
- Below a divider: two action rows, each with a `+`-style icon — "New project" and "Add folder" (folder-with-plus icon).

---

## Chat app — "Auto" approval-mode dropdown (open)

- Source files: `Skärmavbild 2026-09-18 kl. 20.11.18.png`

Same base landing page, with a small dropdown open beneath the "Auto" quick-toggle, offering three radio-style options each with a leading icon:
- "Manually approve" (raised-hand icon)
- "Automatically approve" (double-chevron/fast-forward icon, checkmark shown — currently selected)
- "Skip all approvals" (warning-triangle icon)

A small floating preview/thumbnail card is also visible pinned to the bottom-right of the viewport in this shot (a miniature snapshot of the same page), suggesting a picture-in-picture or drag preview affordance.

---

## Chat app — "Output" format dropdown (open)

- Source files: `Skärmavbild 2026-09-18 kl. 20.11.23.png`

Same base landing page, with a dropdown open beneath the "Output" quick-toggle:
- "Docs" (document icon) tagged "Beta"
- "Slides" (layered-rectangle icon) tagged "Beta"
- "Design" (palette icon) tagged "Beta"
- Divider
- "Artifact" (hexagon/artifact icon) with subtitle "Let Claude pick the format"

Same floating mini-preview thumbnail bottom-right as the previous screenshot.

---

## Coding-agent / workspace app — home dashboard ("What's up next?")

- Source files: `Skärmavbild 2026-09-18 kl. 20.11.37.png`, `Skärmavbild 2026-09-18 kl. 20.11.53.png`, `Skärmavbild 2026-09-18 kl. 20.12.03.png`, `Skärmavbild 2026-09-18 kl. 20.12.19.png`

This is a visually related but distinct app surface: the left sidebar is narrower in scope (no "Projects/Scheduled/Design" top-level items), oriented around a single active repo/workspace, with a bottom command bar for describing coding tasks.

**Layout**
- Top-right of the whole window: a plain-text link "What's new".
- Sidebar (top to bottom): sidebar-collapse icon + back/forward chevrons + the same chat-bubble/`</>` view-switch pair (top bar); nav list "New" (`+`, selected/pill background), "Artifacts", "Customize", "More" (chevron, expandable — see below).
- Below nav: a project group header (the active repo name) with a `+` and search icon and a filter/sort icon on its row, one warning-flagged item beneath it (warning-triangle icon), then one or more custom user folders (each with a `+` to add), and a "No folder" group at the bottom for ungrouped items.
- Bottom-left: same account chip pattern as the chat app (avatar, name, "Pro" badge), plus a small sparkle/settings icon at the far right.
- Main content, top: an orange sunburst icon + serif headline "What's up next, {Name}?"
- Below headline: a boxed analytics widget with tabs "Overview" / "Models" (left) and time-range toggles "All" / "30d" / "7d" (right). Under the tabs, a 3×2 grid of stat tiles with gray uppercase-ish labels and bold values: "Sessions", "Messages", "Total tokens" (row 1); "Active days", "Peak hour", "Favorite model" (row 2) — specific values withheld per privacy note. Below the tiles, a GitHub-style contribution heatmap (grid of small square cells, mostly empty/gray, a couple of cells highlighted in accent blue). Below the heatmap, a single line of italic/gray text giving a whimsical token-usage comparison (a fixed UI feature — a fill-in-the-blank sentence comparing total tokens used to the length of a well-known book).
- Bottom command area (persistent, distinct panel above the composer):
  - A row of environment chips: an "environment" pill (e.g. "Local") with an icon, a repo/project-name pill with a folder icon, a git-branch pill (icon + branch name) next to a "worktree" checkbox, and a small icon button (new window/tab) at the end. A small orange pixel-art robot/mascot icon floats at the far right of this row.
  - Below that, a status banner (icon + bold label "Session limit reached", then lighter text "Turn on usage credits to keep working · Resets in {time}") with a black "Turn on credits" pill button at the right.
  - Composer input with placeholder "Describe a task or ask a question" and a return/enter icon at the right edge.
  - Below the input: `+` attach icon, microphone icon, a down-chevron, then a mode label "Auto"; right-aligned "Sonnet 5", "Medium" (effort), and a small circular progress/status icon.

**Variant states captured**
- `20.11.37`: sidebar "More" flyout open, showing two items — "Routines" (clock icon) and "Edit sidebar…" (below a divider).
- `20.11.53`: a usage popover open above the bottom-right status icon, containing: "Context window" with a value and a thin progress bar; a "Plan usage limits · {tier}" header row with a chevron; then two labeled progress bars, "5-hour limit" and "Weekly · all models", each showing a reset-time and a percentage (values withheld).
- `20.12.03`: the `+` attach menu open, listing: "Add files or photos" (with a ⌘U shortcut hint), "Add folder", "Import GitHub issue" (grayed out, with helper text "This folder doesn't have a GitHub remote"), "Slash commands", "Connectors" (expandable, chevron), "Add plugins". A nested flyout from "Connectors" shows: "Browse connectors", "Manage connectors", then a list of individually toggleable connectors with on/off switches — "Claude Docs", "Google Drive", "Lovable", "Claude in Chrome" (all shown toggled on/blue).
- `20.12.19`: the bottom chip row has grown two extra pills — "Design" and "Design system" — indicating the Output mode was switched to "Design"; the composer placeholder changes to "What should this design show?"; a "Design system" dropdown is open showing header "Design system" and two rows: "Manage design systems" (external-link icon) and "Make a new design system first" (`+` icon).

**Style**
- Same off-white/cream palette, serif headline + sans body as the chat app; orange accent reused for the sunburst icon and the mascot pixel-art figure.
- Stat tiles use a very light gray card background with no borders; heatmap cells are small flat squares with rounded corners.
- Popovers/dropdowns are white cards with soft shadow, rounded corners, thin dividers between grouped items — consistent with the chat app's dropdown styling.

---

## Coding-agent app — Artifacts list page

- Source files: `Skärmavbild 2026-09-18 kl. 20.12.10.png`

**Layout**
- Sidebar: same as the dashboard, with "Artifacts" now highlighted/selected.
- Page header: large serif "Artifacts" title.
- Filter row below header: text tabs "All" (selected/bold), "Yours", "Shared with you"; right-aligned a search icon, a grid/layout-toggle icon, and an "All types" dropdown with chevron.
- "Make something new" section: three large square creation cards side by side, each with an illustration, a bold label, and a "Beta" tag — "Docs", "Slides", "Design".
- Below: a reverse-chronological list grouped under date headers ("Today", "Yesterday", a specific date, a month name, etc.). Each row has: a leading type-icon in a rounded square (varies by artifact type — code brackets, bar-chart, gift-box, hexagon/artifact mark), a title (content withheld), a right-aligned visibility icon (lock = private, globe = public) plus a relative "Viewed/Edited {time}" label, and a kebab (⋮) menu button.

**Style**
- Identical visual language to the dashboard (cream background, serif page title, flat card icons with soft-pastel tinted backgrounds per artifact type).

---

## Coding-agent app — Customize / Skills marketplace ("Discover" tab)

- Source files: `Skärmavbild 2026-09-18 kl. 20.12.34.png`, `Skärmavbild 2026-09-18 kl. 20.12.41.png`, `Skärmavbild 2026-09-18 kl. 20.12.48.png`

**Layout**
- Sidebar: "Customize" highlighted/selected.
- Page header: large serif "Customize" title.
- Tab row: "Skills" (bold/selected), "Connectors", "Plugins", then a vertical divider, then "Yours", "Discover" (selected, shown as a filled pill). Right-aligned: search icon, a sliders/filter icon, a sort (up/down arrow) icon, and a black "Add" button with chevron.
- Featured banner card (sage-green background, full width): "From Anthropic" eyebrow label, bold title "Data", description "Query, chart and explain your data — SQL, spreadsheets and dashboards in one place.", a black "Add" button, and a simple line-art spreadsheet/grid illustration on the right.
- "For you" section: a responsive 2-column grid of skill-bundle cards. Each card has a small icon tile, a bold title, a 2–3 line description, a byline ("from Anthropic" or a named third party) plus an install count, and a `+` button top-right. Cards seen: "Productivity", "Design", "Marketing", "Postiz" (from a named third party), "Finance", "Product Management", "Operations", "Small Business", "PDF Viewer", "Sales", "Legal", "Enterprise Search", "Human Resources", "Customer Support".
- Further down, a "Categories" section header with a "Show all {N}" link (chevron), followed by a 3-column grid of smaller category tiles — each a plain icon + label + a count badge on the right. Categories seen include: "APIs", "Engineering", "Code", "Files & documents", "Contacts & leads", "Pipelines & jobs", "Finance", "Databases", "Tickets & tasks", "Designs & media", "Financial services", "Reference docs", "Sales", "Logs & errors", "Websites", "Email & messages", "Servers & cloud", "AI models & agents", "Marketing", "Data", "Design", "Operations", "Pull requests", "Notes & memory", "Legal", "Product", "Research".

**Style**
- Same cream background and card conventions as elsewhere; the featured banner is the one spot in this batch using a muted sage/olive-green fill instead of neutral gray, functioning as a highlight/promo treatment. Category tiles use plain black line-icons on light-gray rounded-square backgrounds.

---

## Coding-agent app — Routines page

- Source files: `Skärmavbild 2026-09-18 kl. 20.12.58.png`, `Skärmavbild 2026-09-18 kl. 20.13.05.png`

**Layout**
- Sidebar: a "Routines" item now appears as its own expandable nav entry (with chevron), between "Customize" and the project group — reflecting the "More → Routines" navigation seen earlier.
- Page header: large serif "Routines" title. Tab row: "Yours" (selected), "Templates". Right-aligned: search icon, sliders icon, sort icon, and a black "New routine" button with chevron.
- Empty state (since no routines exist yet): a large stopwatch/timer line-icon centered, with caption "No routines yet." below it, and a wavy dashed divider beneath.
- Below the divider: a 2-column list of routine template cards (not the user's own — sample/starter routines), each with a small icon tile, a bold title, a one-line description, and a schedule/trigger line prefixed with a clock or branch icon. Titles seen: "Briefing" ("Weekdays at {time}"), "Email triage" ("Weekdays at {time}"), "System health check" ("Daily at {time}"), "Issue triage" ("Weekdays at {time}"), "PR review digest" ("Weekdays at {time}"), "Dependency update check" ("Every Monday at {time}"), "Release notes drafter" ("Triggered by pull request closed"), "Flaky test tracker" ("Every Monday at {time}").

**Variant state**
- `20.13.05`: the "New routine" button's dropdown is open, showing two simple options — "Local" and "Cloud".

**Style**
- Consistent with the rest of the coding-agent app; template cards use the same rounded-icon-tile + title + description pattern as the Skills marketplace cards.

---

## Coding-agent app — Projects list page

- Source files: `Skärmavbild 2026-09-18 kl. 20.13.33.png`

**Layout**
- Sidebar: "Projects" highlighted/selected (this app does have a Projects nav item after all, distinct from the dashboard's default view).
- Page header: large serif "Projects" title. Right-aligned: search icon, sort icon, and a black "New project" button.
- Content: a grid of project cards (two shown side by side). Each card has a bold project name (one shown with a small pin icon next to the name, indicating it's pinned), a multi-line description preview beneath (content withheld — personal), and a relative/absolute last-updated date at the bottom of the card.

**Style**
- Cards are plain white/cream rectangles with thin borders and generous padding — simpler than the marketplace cards (no icon tile, no install-count byline).

---

## Claude Design app — home / "What should we create?" page

- Source files: `Skärmavbild 2026-09-18 kl. 20.13.42.png`, `Skärmavbild 2026-09-18 kl. 20.13.49.png`, `Skärmavbild 2026-09-18 kl. 20.14.03.png`, `Skärmavbild 2026-09-18 kl. 20.14.12.png`

A third, visually related but standalone surface — no left sidebar at all; a minimal top bar instead.

**Layout**
- Top bar: wordmark "Claude Design" (serif, bold) with a small gray "Beta" label beneath it, left-aligned; a circular user-avatar icon (single letter) at the far right. A thin horizontal rule separates the top bar from the page.
- Centered large serif headline: "What should we create?"
- Centered composer card below the headline:
  - Large placeholder/example text at top (rotates between examples, e.g. "Attach a file, link your design system, or describe what you want to make", "Make a pitch deck for a new product", "Turn my notes into a presentation").
  - Toolbar row: a `+` attach button, a "Design system" selector showing current value "None" with a chevron, a `</>` code-view icon button; right-aligned a "Model" selector showing "Opus 5" with a chevron, and a filled orange circular up-arrow "send" button.
- "CHOOSE A TEMPLATE" section (collapsible, chevron shown pointing up/expanded) beneath the composer: a 2-row × 6-column grid of template tiles, each a small line-art icon over a label: "Blank", "Mobile app design", "Slides", "Document", "Wireframe", "Animation" (row 1); "UI mockups", "Résumé", "3D object", "Research", "HTML email", "Color + type pairing" (row 2). The "Blank" tile shows a blue selection outline (currently highlighted/default).
- Below the template grid: a tab row "Projects" (selected) / "Design systems" / "Templates", with a search field (placeholder "Search") and star/list-view/grid-view icon buttons at the right.
- Below the tabs: a table-style list with column headers "Name", "Last viewed" (with sort chevron), "All owners", "Access" — showing project rows with a thumbnail, name, date, an owner avatar chip, and small icon buttons (attachment, kebab menu, star) at the row's right edge.
- A recurring decorative element: a blue starburst/sticker badge fixed to the bottom-right corner of the viewport reading "Set up a design system! Create more consistent, on-brand designs."

**Variant states captured**
- `20.13.49`: the "Design system" selector is open as a large flyout: header copy "Set up a design system so every project starts from your colors, type, and components.", a full-width black "Set up your design system" button, then a 2-column gallery of style-preset previews, each a mini mock layout with a style name beneath it: "Modernist", "Classical", "Nocturne", "Organic", "Broadsheet" (partially visible), "Industry" (partially visible).
- `20.14.03`: the "Design systems" tab is active in the background (page dimmed), showing an "Included design systems" gallery and a "Create design system" button; in front, a centered modal dialog titled "Add a design system" (with a close `×`) reading "Design systems teach Claude your brand. How would you like to start?" with two selectable option rows: "Create here" (download icon; "Connect to Figma or GitHub, or upload slides and assets") and "Create using Claude Code" (chat/code icon, tagged "BEST FIDELITY"; "Best fidelity if you have React components.").
- `20.14.12`: the "Templates" tab is active in the background, showing an empty-state message ("No templates yet. Claude creates templates inside design systems — open a design system and ask Claude to make one, or send it a link to an existing project to turn that project into a template."); in front, the `+` attach button's dropdown is open (its icon has become an `×` close icon while open), grouped into sections with small leading icons: "Files" (Attach file, Attach folder, Reference another project), "Code" (Connect GitHub, Link local code…), "Designs" (Upload .fig file, with a "Learn how" pill button), then below a divider three more rows: "Design system", "Skills", "Manage connectors".

**Style**
- Same cream/off-white background and serif-headline convention as the other two apps, but with a notably sparser chrome (no sidebar) — feels like a distinct "creation" landing page rather than a persistent workspace.
- The orange accent here appears mainly on the circular send button and the blue starburst promo sticker (blue, not orange, is used for that one decorative badge — the only notable non-orange accent moment in this batch).
- Template/preset tiles use flat black line-art icons on white cards with thin borders, matching the minimal illustration style seen in the "Data" skill banner from the Customize page.
- Modal dialog uses a plain white card, bold sans-serif title, black close icon, rounded-corner option rows with icon + title + description — consistent with dropdown/menu styling elsewhere.

---

## Summary of distinct light/dark mode usage

All 20 screenshots in this batch are **light mode** — warm cream/off-white backgrounds, dark charcoal/near-black text, no dark-mode surfaces were observed.
