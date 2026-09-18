# Batch 4 — Screenshot Catalog (files 61–78 of 78)

Source folder: `Claude Screenshots/`. This batch covers the Settings → Connectors/Plugins
panel, the composer's empty-state landing page (in-browser claude.ai, light mode),
the "+" attach menu, the model/effort selector, the Chat Info modal, and the
Claude Code (claude.ai/code) Folders/Artifacts (Prompts & Chains) modals.

All screenshots in this batch are **light mode**, taken inside Google Chrome (visible
browser chrome: traffic-light buttons, tab strip, address bar, bookmarks bar with
folder bookmarks). A macOS screenshot-capture thumbnail appears in the bottom-right
corner of several images — that is an OS artifact, not app UI, and is ignored below.
The left sidebar's personal chat/task list and any Swedish-language personal item
names are visible in the background of most shots; per the privacy rule their content
is not transcribed here, only the structural pattern they demonstrate.

---

## Settings — Connectors — "Add custom connector" modal

- Sources: `Skärmavbild 2026-09-18 kl. 20.20.47.png`
- View: Settings dialog open to **Customize → Connectors → Discover** tab, with a
  centered modal "Add custom connector" overlaid on top.
- Layout: Settings dialog has its own two-pane layout — a fixed-width left rail
  (search field, then grouped nav lists) and a wider right content pane. Left rail
  groups, top to bottom: **Settings** (Preferences, Account, Privacy, Billing,
  Capabilities, Memory, Design systems, Claude Code, Cowork, Claude in Chrome),
  **Desktop app** (General, Extensions, Developer), **Customize** (Skills, Connectors,
  Plugins — "Connectors" highlighted/active). Each nav row has a small leading icon.
- Right pane header: "Connectors" title, tabs "Your connectors" / "Discover" (Discover
  active), breadcrumb "Connectors / Directory", a search input, a "Filter: All"
  dropdown top-right, and a black "Add" button top-right of the whole dialog. A row of
  connector cards is visible behind the modal (grid of 2 columns, each card has an
  icon, name, one-line description, install/"+" button) — visible partial labels
  include "Atlassian MCP" and "HubSpot" cards with descriptions and a "+" add button.
- Modal content ("Add custom connector"): bold title + X close icon top-right; body
  text "Connect Claude to your data and tools. **Learn more about connectors** or get
  started with **pre-built ones**." (links underlined); a "Name" text input labeled
  "Shown in the connectors list."; an "MCP server URL" text input labeled "The HTTPS
  address where the server accepts MCP requests, for example
  https://mcp.example.com/mcp."; a warning paragraph "Only use connectors from
  developers you trust. Anthropic does not control which tools developers make
  available and cannot verify that they will work as intended or that they won't
  change."; a line "Building an MCP server? **Report issues and subscribe to updates
  here**"; footer buttons "Cancel" (outline) and "Continue" (disabled/grey until
  filled).
- Style: white modal on dimmed/blurred backdrop, rounded corners, black primary
  buttons, orange/terracotta accent only on small icon badges in the connector grid
  behind the modal. Sans-serif UI type throughout the dialog.

## Settings — Connectors — "Your connectors" list

- Sources: `Skärmavbild 2026-09-18 kl. 20.20.55.png`
- View: Same Settings dialog, **Connectors → "Your connectors"** tab (not Discover).
- Layout: header "Connectors", a "Search connectors" input, black "Add" button
  top-right. Sub-filter pills: "All" (active/outlined), "Connected", "Not connected".
  Below, a table with column headers "Connector", "Type", "Status" and rows, each row:
  leading square icon, connector name, "Type" value (Web/Desktop) with a small grey
  "Custom" or "Included" tag next to some type values, and a right-aligned "Status"
  cell that is either a checkmark (connected), a black "Connect" button, or a
  "Reconnect" button next to a warning triangle icon. Rows visible: Claude Docs (Web,
  Custom tag, checkmark), Claude in Chrome (Desktop, Included tag, checkmark), GitHub
  Integration (Web, Connect), Gmail (Web, Connect), Google Calendar (Web, Connect),
  Google Drive (Web, checkmark), Lovable (Web, checkmark), Vercel (Web, warning icon +
  Reconnect button).
- Below the table, a "Popular" section header with three horizontal cards (icon, name,
  "Connect" button): Gmail, Slack, Google Calendar.
- Style: clean tabular list, thin row dividers, no zebra striping, black pill buttons
  for actions, grey pill for tags, orange/red warning triangle icon is the only accent
  color used.

## Settings — Plugins — empty "Your plugins" state

- Sources: `Skärmavbild 2026-09-18 kl. 20.20.59.png`
- View: Settings dialog, **Customize → Plugins → "Your plugins"** tab, empty state.
- Layout/text: header "Plugins", search input placeholder "Search skills and plugins",
  black "Add ⌄" split-button top-right. Tabs "Your plugins" (active) / "Discover".
  Below, a full-width light-grey callout card: bold "Add your first plugins", body text
  "Give Claude role-level expertise with plugins. Add them from Discover, or create
  your own.", a black "Discover plugins" button, and a small line-art illustration
  (stacked blocks/steps icon) on the right side of the card.
- Style: identical dialog chrome to the Connectors pages; empty-state card uses a
  slightly darker off-white/grey fill than the white dialog background to distinguish
  it as a callout.

## Settings — Plugins — Discover tab

- Sources: `Skärmavbild 2026-09-18 kl. 20.21.03.png`, `Skärmavbild 2026-09-18 kl. 20.21.07.png`
- View: Settings dialog, **Plugins → "Discover"** tab, populated. The second file adds
  the "Add" button's dropdown menu open on top.
- Layout/text: header "Plugins", search input, "Filter ⌄" and "Sort ⌄" buttons
  top-right (Discover-only controls), plus the black "Add ⌄" button.
- Featured banner (full width, pale blue-grey fill, rounded corners): small label
  "From Anthropic", large serif-ish bold title "Data", description "Query, chart and
  explain your data — SQL, spreadsheets and dashboards in one place.", black "Add"
  button, and a line-art icon (spreadsheet grid + trend-line badge) on the right.
- Section header "For you" followed by a 2-column grid of plugin cards, each with a
  leading icon, bold name, 1–2 line description, small grey metadata line
  "from `<publisher>` · `<N>` installs", and a circular "+" add button top-right of the
  card. Cards visible: Productivity ("from Anthropic · 2.7M installs"), Design
  ("2.6M installs"), Marketing ("2.1M installs"), Postiz ("from Nevo David · 1.7M
  installs"), Finance ("1.7M installs"), Product Management ("1.5M installs"), and
  partially visible Operations / Small Business cards cut off at the bottom.
- "Add ⌄" dropdown menu (second screenshot) — a small white popover menu with 4 rows,
  each with a leading icon: "Add marketplace" (globe icon), "Upload plugin" (upload
  icon), "Create a plugin" (pencil icon), "Create with Claude" (chat-bubble icon).
- Style: card grid uses consistent 2-column layout with generous padding; the featured
  "Data" banner is the only tinted-background card, everything else is white/outlined.

## Cowork "New task" empty-state landing page

- Sources: `Skärmavbild 2026-09-18 kl. 20.25.08.png`, `Skärmavbild 2026-09-18 kl. 20.25.24.png` (near-duplicate)
- View: claude.ai opened in a normal Chrome tab (not the desktop app chrome), empty
  new-chat/new-task landing page, light/cream background.
- Layout: Left sidebar (collapsible via icon top-left next to "Claude" wordmark, plus
  a small "chat bubbles" search icon and a "</>" code icon beside it): "+ New" button
  (bold), then nav items **Projects**, **Artifacts**, **Scheduled**, **Design**,
  **Customize**, and a collapsible **More** chevron. Below that a "Scheduled" section
  header listing scheduled items, each row with a colored status dot, a title, and a
  right-aligned grey "N new" count pill. Below that, a "Pinned" section header with a
  pinned project row (stack icon) and nested sub-items (bullet/circle icons) indented
  underneath it. Sidebar footer: user avatar chip with plan label ("· Pro"), download
  icon, and search icon.
- Center content: centered greeting "🌟 Evening, `<name>`" in large serif display type
  (the only serif text on the page — everything else is sans-serif), directly above
  the message composer.
- Top toolbar above the composer, right-aligned in a horizontal strip: an info "ⓘ"
  icon, a download icon, a "</>" code icon, and a ghost/mask icon at the far right.
- Usage banner directly above the composer: "Usage limit reached · Resets 9:00 PM ·
  limits shared with Claude Code" (the middle link underlined) with a black "Get more
  usage" button pinned to the right edge of the same bar.
- Composer card: a top row of pill controls — "⌄ 0 words / 0 chars" (expandable),
  "✦ Optimize", a clock-icon pill showing a countdown ("34m") — plus small chevron-up/
  chevron-down icons far right (collapse/expand). Below that, the empty textarea with
  placeholder "How can I help you today?" (or "Type / for skills" pre-focus). Bottom
  row of the composer: a circular "+" attach button, a segmented "Chat" / "Cowork"
  toggle (pill-shaped, active segment shaded), then right-aligned "Sonnet 5" model name
  with "Max" badge and a small warning triangle, a microphone icon, a waveform/voice
  icon, and a chevron.
- Browser chrome above the app: standard Chrome window controls, two tabs ("Claude",
  "New chat - Claude"), address bar showing `claude.ai/new?redirect=claude.com&via=cookie`,
  and a bookmarks bar with a mix of text bookmarks (some styled as colored pill
  "reading list" tags) and folder bookmarks.
- Colors: warm cream/off-white app background, black primary buttons and toggle-active
  state, orange/terracotta appears only in the small sparkle/burst emoji-style icon
  next to the greeting. No dark-mode elements present.

## Composer — usage tooltip popover

- Sources: `Skärmavbild 2026-09-18 kl. 20.25.18.png`
- View: same empty-state landing page, with the countdown pill ("34m") hovered/active,
  revealing a small white tooltip/popover above the usage banner.
- Content structure (label — value rows, right-aligned bold values): "5-hour usage",
  "Resets in", "7-day usage", "7-day resets", "Refreshed" (values themselves are the
  user's personal usage data and are intentionally omitted here per the privacy rule).
- Style: compact white card, thin border/shadow, small sans-serif text, tabular
  label/value alignment.

## Composer — word/character count breakdown popover

- Sources: `Skärmavbild 2026-09-18 kl. 20.25.28.png`
- View: same landing page, with the "⌄ 0 words / 0 chars" pill expanded, showing a
  detail popover to its lower-left.
- Content: a vertical list of label/value pairs, label left-aligned and numeric value
  right-aligned in bold: "Characters (with spaces)", "Characters (no spaces)", "Words",
  "Sentences", "Lines", "Paragraphs", "Tokens (est.)" — all reading 0 in this empty
  composer. A "‹" back-chevron appears at the left edge of the pill when this detail
  view is open.
- Style: same compact white popover card style as the usage tooltip; monospaced/tabular
  numeral alignment for the value column.

## Composer "+" attach menu (Chat mode)

- Sources: `Skärmavbild 2026-09-18 kl. 20.25.47.png`
- View: the circular "+" button in the composer clicked, opening an attach/insert menu
  upward from the bottom-left of the composer, overlapping the greeting text.
- Menu items, each with a leading icon and, where applicable, a trailing chevron for a
  submenu: "Add files or photos" (paperclip icon, trailing keyboard shortcut "⌘U"),
  "Take a screenshot" (camera icon), "Add to project" (stack icon, chevron), a
  divider, "Skills" (icon, chevron), "Connectors" (icon, chevron), "Design system"
  (icon, chevron), "Add plugins" (icon, no chevron), a divider, "Research" (magnifier
  icon, no chevron/toggle), "Web search" (globe icon, checkmark on the right = enabled),
  "Memory" (icon, checkmark on the right = enabled).
- Style: white rounded menu on the cream background, generous vertical padding per row,
  checkmarks in a muted blue/black rather than orange, dividers as thin full-width
  hairlines grouping related actions.

## Composer "+" attach menu (Cowork mode, with Devices submenu)

- Sources: `Skärmavbild 2026-09-18 kl. 20.25.54.png`
- View: same "+" menu but with the composer's mode toggle set to **Cowork** (browser
  tab title changes to "New task - Claude"; top-right toolbar icon changes from the
  ghost/mask icon to a "Beta" text badge). The menu contents differ slightly from Chat
  mode, and a second-level "Devices" submenu is open to the right.
- Menu items (Cowork mode): "Add files or photos" (⌘U), "Take a screenshot", divider,
  "Skills" (chevron), "Connectors" (chevron), "Design system" (chevron), "Add plugins",
  "Devices" (icon, chevron — highlighted/active since its submenu is open), "Memory"
  (checkmark, enabled). Note "Add to project" and "Research"/"Web search" rows from
  the Chat-mode menu are not present in this list.
- "Devices" submenu (separate white card to the right of the main menu): header "Run
  tasks on", then a list of paired rows, each with a small device icon (laptop/desktop
  icon) plus a device name and a relative last-seen timestamp underneath (e.g. a
  laptop device and a desktop-PC device, each labeled with a device name and a
  "`<time>` ago" caption — the specific device names are personal/account information
  and are not reproduced here).
- Also visible behind the menu: the Cowork task list has appeared with a "Clear active"
  link top-right of a task section (see next entry).

## Cowork task list — "Active" section

- Sources: `Skärmavbild 2026-09-18 kl. 20.26.01.png` (with model/effort dropdown open),
  `Skärmavbild 2026-09-18 kl. 20.26.08.png`, `Skärmavbild 2026-09-18 kl. 20.26.11.png`
  (near-duplicate; top-right toolbar button reads "Wide chat" instead of "Export chat" —
  apparently two states/labels of the same toolbar control area)
- View: Cowork mode's task list appears below the composer once at least one task
  exists. Top-right of the whole page now shows either an "Export chat" black button or
  a "Wide chat" black button (variants seen across shots) plus the "</>" icon and a
  "Beta" badge, replacing the icon row from the empty state.
- Layout: below the composer, a row of plain-text filter tabs "Project", "Auto",
  "Output" (no active-state styling distinguishable at this zoom). Below that, a
  section header "Active" with a "Clear active" link right-aligned. Each task row: a
  leading status icon (a clock-with-dot icon for scheduled/recurring items, a
  small "checklist" icon for a plain task) with a small colored dot badge overlaid
  bottom-right of the icon, a bold task title (one row also shows a lightning-bolt
  icon before the title, presumably indicating an "active/running" task), and a grey
  relative-time caption underneath ("`N` minutes/hours ago"). Task titles themselves
  are personal content and are not reproduced here beyond noting the pattern.
- Model selector popover (first screenshot only), opened from the "Sonnet 5 Max"
  control bottom-right of the composer: a two-level flyout. Primary list: "Fable 5.1"
  (with a small "ⓘ Requires usage credits" note and a "Buy credits" pill badge,
  description "For your toughest challenges"), "Opus 5" ("For complex tasks"),
  "Sonnet 5" ("Most efficient for everyday tasks", checkmarked as selected), "Haiku
  4.5" ("Fastest for quick answers"); then a divider, an "Effort" row showing current
  value "Max" with a warning icon and chevron, and a "More models" row with chevron.
  Hovering/opening "Effort" reveals a second flyout to the right: header text "Higher
  effort means more thorough responses, but takes longer and uses your limits
  faster.", then options "Low", "Medium", "High" (tagged "Default"), "Extra", "Max"
  (tagged with a warning icon and "2.5× or more usage", checkmarked as selected); below
  a divider, a "Thinking" row with description "Can think for more complex tasks" and
  a toggle switch (on/blue).
- Style: task rows are plain list rows with hairline dividers, no card backgrounds;
  the model/effort flyout is a compact white popover with clear visual grouping via
  dividers and right-aligned metadata (checkmarks, badges).

## Chat Info modal

- Sources: `Skärmavbild 2026-09-18 kl. 20.26.15.png`
- View: a centered modal titled "Chat info", opened via the info "ⓘ" icon in the top
  toolbar, over a dimmed backdrop.
- Content: four stacked light-grey field blocks, each with a small uppercase label and
  a value line below (all showing "—" placeholder since no chat is open/selected):
  "CREATION DATE", "LAST INTERACTED", "TOTAL MESSAGES", and a "NOTES" block containing
  a larger free-text textarea with placeholder "Open a chat to add notes…". Close "X"
  icon top-right of the modal.
- Style: modal fields use a soft grey fill (matching the empty-state plugin callout
  style seen earlier) with rounded corners; uppercase micro-labels in grey, values in
  black; generous spacing between the four blocks.

## Claude Code (claude.ai/code) — Folders modal

- Sources: `Skärmavbild 2026-09-18 kl. 20.27.15.png`
- View: browser tab now on a distinct sub-app, "Claude Code" (address bar:
  `claude.ai/code`), with a "Folders" modal open over it.
- Background page (dimmed/blurred): sidebar header "Claude Code" instead of "Claude",
  with a "+"-style icon and a second icon beside the wordmark; nav items include
  "New", an item under it (blurred/personal, likely a project or "Superpowers"-style
  label), "Folders", "Prompts", "Settings", "Artifacts", "Customize", "More". Center
  content shows a greeting "🔥 What's up next, `<name>`?" (orange/red icon, not the
  sparkle used on the main Claude landing page) and a composer below it. A left empty
  area has a faint dashed-diamond illustration with caption "`<placeholder text>`" and
  the sidebar footer shows a "Try Claude Tag" promo row with a "Set up" link.
- Folders modal: title "Folders" top-left, top-right controls "Hide foldered chats"
  (checkbox, checked/active with an orange checkmark), a "+ Add Folder" button
  (outlined), and an "X" close icon. Below, a search input "Search folders and
  chats…". Empty state centered in the modal body: an outlined folder icon (drawn in
  the orange/terracotta accent color), bold text "No folders yet", and caption "Create
  folders to organize your chats."
- Style/colors: this is the first use of the orange/terracotta accent color as a line-
  art icon color (the folder icon) and as a checkbox-checked fill, rather than just a
  small logo mark — notable for matching the "Claude Code" sub-brand's accent usage.

## Claude Code — Artifacts page — Prompts/Chains modal

- Sources: `Skärmavbild 2026-09-18 kl. 20.27.26.png` (Prompts tab active),
  `Skärmavbild 2026-09-18 kl. 20.27.29.png` (Chains tab active)
- View: address bar `claude.ai/code/artifacts`; background page header "Artifacts"
  with a secondary row (icon + "Team"/shared-with-you label, blurred) and top-right
  icons plus an "All types ⌄" filter dropdown; a modal is open on top.
- Modal chrome: two segmented tabs top-left, "Prompts" and "Chains" (active tab shown
  as a solid orange/terracotta filled pill; inactive tab is plain text) — this is the
  first appearance of the orange accent used as a solid active-tab fill rather than an
  outline. Top-right of the modal: a "+ Add Prompt" / "+ Add Chain" button (outlined,
  label changes with the active tab) and a greyed-out "🗑 Delete Selected" button
  (disabled state, no items selected), and an "X" close icon.
- Body: a search input ("Search prompts…" / "Search chains…"), then a list of items.
  Each list row: checkbox, a leading icon (plain document/file icon for a prompt, a
  chain-link icon for a chain), a bold item title, a grey metadata caption below it
  ("`N` variables" for a prompt; "`N` variable · `N` steps" for a chain), and a
  right-aligned solid orange/terracotta "📋 Use" button. Visible rows: "Email
  Rewriter" (2 variables) under Prompts; "Research & Summarize" (1 variable · 2
  steps) under Chains.
- Style: this modal is visually the most "branded" of the batch — it's the only one
  using solid orange fill for both the active-tab pill and the primary action button,
  versus the black buttons used throughout Settings/Connectors/Plugins dialogs
  elsewhere in this batch.

---

### Cross-cutting observations for this batch

- Two distinct primary-button color languages appear: **black** pill/rounded-rect
  buttons dominate the Settings dialogs (Connectors, Plugins) and the main composer
  ("Get more usage", "Add", "Continue", "Discover plugins", mode toggle), while
  **orange/terracotta** solid fills are reserved for the Claude Code sub-app's
  Folders/Prompts/Chains surfaces ("Use" buttons, active tab pill, folder icon,
  checked checkbox).
- Serif type is used sparingly and only for the large landing-page greetings
  ("Evening, `<name>`", "What's up next, `<name>`?"); all dialog titles, menu items,
  buttons, and body copy are sans-serif.
- Popovers/tooltips (usage stats, word-count breakdown, model/effort selector, "+"
  attach menu, Devices submenu) consistently render as small white rounded cards with
  hairline borders/soft shadows, anchored near the control that opened them, and use
  label-left/value-right alignment for any stat rows.
- Settings dialogs share one consistent shell: fixed left icon-labeled nav rail
  grouped under section headers (Settings / Desktop app / Customize), search field
  pinned at the top of that rail, and a scrollable right content pane — this shell is
  reused identically across Connectors and Plugins.
