# Batch 3 — Screenshots 41–60 (Settings dialog deep-dive: Design systems, Claude Code, Cowork, General, Extensions, Developer, Skills)

General note applying to all entries below: every screenshot in this batch shows the **Settings** surface of the Claude desktop app, rendered as a large centered modal (rounded corners, drop shadow) over a dimmed/blurred background of the main app (left sidebar with chat/task list, top bar). The dimmed background's chat list items are personal conversation titles and are intentionally omitted here per the privacy rule. Several screenshots also show a small floating screenshot-thumbnail overlay in the bottom-right corner and a solid black bar across the very top of the frame — these are artifacts of the screen-capture process itself, not part of the app's UI, and are not treated as UI chrome. All screenshots in this batch are **light mode**.

Persistent modal chrome (present in nearly every entry, described once here rather than repeated):
- Top-left of modal: a "Search" input with a magnifying-glass icon.
- Left nav column of the modal, grouped under three unlabeled/labeled headers:
  - **"Settings"** section header, then: Preferences, Account, Privacy, Billing, Capabilities, Memory, Design systems, Claude Code, Cowork, Claude in Chrome.
  - **"Desktop app"** section header, then: General, Extensions, Developer.
  - **"Customize"** section header, then: Skills, Connectors, Plugins.
- Each nav item has a small line icon to the left of its label; the active item has a light gray rounded-rectangle highlight and bold/darker text.
- Top-right of modal: a circular "X" close button.
- Main content pane to the right of the nav is white/off-white, with bold section headers, gray descriptive subtext under each setting label, and blue pill toggle switches (filled blue + white knob when on, outlined gray + white knob when off) aligned to the right edge for boolean settings.

---

## Settings — Design systems tab

- Skärmavbild 2026-09-18 kl. 20.18.20.png
- Skärmavbild 2026-09-18 kl. 20.18.22.png

**Text:** Header "Design systems" with subtext "Design systems give Claude your colors, type and components to use when making designs, decks and prototypes." Button top-right: "+ New design system" with chevron. Search field placeholder "Search by name". Table column headers: "Name", "Usable by" (with small info "i" icon), "Published". Empty-state message centered in the table area: "No design systems yet. Make one, or ask a teammate to share one with you, and it shows up here."

**Interactive state:** In the first screenshot (20.18.20), the "New design system" button is clicked and shows an open dropdown with two options, each with an icon, bold title, and gray description line below:
- "Using Claude" — "Upload brand files, pull from design connectors, or describe it"
- "Using Claude Code" — "Claude Code reads your repo's tokens and components" (this row is highlighted/hovered with a light gray background)

The second screenshot (20.18.22) is the same page with the dropdown closed.

**Layout/style:** Standard modal chrome as described above, "Design systems" nav item active. Content area is otherwise mostly empty white space below the table header row (thin gray divider line under column headers).

---

## Settings — Claude Code tab — General / Code appearance section

- Skärmavbild 2026-09-18 kl. 20.18.26.png
- Skärmavbild 2026-09-18 kl. 20.18.33.png
- Skärmavbild 2026-09-18 kl. 20.18.37.png

**Text:** Section header "General". Setting rows:
- "Classify session states" — "Allow Claude to automatically classify sessions as blocked, ready for review, or done. Classifying sessions counts towards your plan usage. Applies to new sessions." (toggle ON)
- "Switch models when a message is flagged" — "When safeguards flag a message, automatically switch to a different model to keep chatting. When off, your session will pause instead. Applies to cloud sessions." (toggle ON)

Section header "Code appearance" with two side-by-side dropdown selectors labeled implicitly by their current values: "Claude Light" (light theme) and "Catppuccin Mocha" (dark theme), each showing a live code-diff preview snippet below it (a TypeScript `greet` function with a removed line in red/pink and an added line in green, demonstrating the diff colors of that theme). Below that: "Code font" — "Set a custom monospace font for code and terminal." with a text input placeholder "e.g. JetBrains Mono". Section header "Appearance": "Interface font" — "Font for the whole interface — menus, sidebars, and panels. Font licenses" (with "Font licenses" as a hyperlink), and a segmented control with options "Anthropic Sans" (selected), "System", "OpenDyslexic". "Transcript text size" — "Size of the conversation transcript text." with segmented control "Small", "Medium" (selected), "Large".

**Interactive states:**
- 20.18.33 shows the light-theme dropdown open, listing (some grayed/unavailable at top, cut off as "...Light"): Pierre Light, One Light (highlighted/hovered), Catppuccin Latte, Solarized Light, Vitesse Light, Min Light, Rosé Pine Dawn, Slack Ochin.
- 20.18.37 shows the dark-theme dropdown open with a text-input/filter field at top, listing: Claude Dark, GitHub Dark, GitHub Dark Dimmed (highlighted/hovered), Pierre Dark, One Dark Pro, Dracula, Dracula Soft, Catppuccin Mocha (checkmark, currently selected), and a cut-off "Nord" at the bottom.

**Layout/style:** Two-column layout for the theme pickers and their live previews sitting side by side. Code preview boxes use monospace font with syntax highlighting (purple/blue keywords, orange strings). "Claude Code" nav item active.

---

## Settings — Claude Code tab — Local sessions / session behavior section

- Skärmavbild 2026-09-18 kl. 20.18.46.png
- Skärmavbild 2026-09-18 kl. 20.18.57.png

**Text:** "Transcript width" — "Maximum width of the transcript and composer columns." segmented control: "Narrow" (selected), "Medium", "Wide". "Default transcript view" — "The view sessions open in. Picking a view from a session's Transcript view menu changes only that session." segmented control: "Normal" (selected), "Thinking", "Verbose".

Section header "Local sessions":
- "Allow bypass permissions mode" — "Bypass all permission checks and let Claude work uninterrupted. This works well for workflows like fixing lint errors or generating boilerplate code. Letting Claude run arbitrary commands is risky and can result in data loss, system corruption, or data exfiltration (e.g., via prompt injection attacks). See best practices for safe usage" (link underlined) — toggle OFF
- "Connect new sessions to Remote Control" — "Sessions you start on this computer connect to Remote Control automatically, so you can continue them from the terminal or claude.ai/code." — toggle OFF
- "Dynamic workflows" — "Let Claude run multiple agents in parallel for complex tasks. Workflows can use a lot of your usage limit quickly." — toggle OFF
- "Draw attention on notifications" — "Bounce the Dock icon when Claude needs your attention and the app isn't focused." — toggle OFF
- "Keep computer awake while Claude works" — "Prevent your computer from sleeping while a Code session is running, so long tasks can finish. Your display can still turn off. Closing the laptop lid will still put it to sleep." — toggle ON
  - Sub-row (indented): "Keep awake on battery power" — toggle ON
- "Archive inactive sessions" — "Automatically archive local sessions after a period of no activity. Sessions that are running or have background work are never archived, and a worktree with uncommitted changes is kept on disk." — dropdown showing "Never"
- "Worktree location" — "Where to store Git worktrees for isolated coding sessions." — dropdown showing "Inside project"
- "Switch models when a message is flagged" (repeated here for local sessions context) — "...Applies to local sessions on this machine." — toggle ON
- "Output style" — "How Claude structures its responses in Code sessions. Applies to new sessions; the session menu can override it for a single session." — dropdown showing "Default"
- "Local sandbox" — "Runs commands from Claude Code in an isolated sandbox. Applies to new sessions." — toggle OFF
  - Sub-row: "Strict sandbox mode" — "Blocks commands that can't run inside the sandbox (ssh, for example) instead of running them outside it or asking you. Applies to every Claude Code session on this computer, including the terminal, unless a project's own settings override it." — toggle OFF
- Section header "Browser" begins at bottom of second screenshot.

**Layout/style:** Indented sub-settings (like "Keep awake on battery power" and "Strict sandbox mode") are nested visually under their parent toggle with reduced left-margin text but same row height/style. Dropdowns are simple bordered rectangular buttons with a chevron.

---

## Settings — Claude Code tab — Browser & Mobile simulators section

- Skärmavbild 2026-09-18 kl. 20.19.04.png
- Skärmavbild 2026-09-18 kl. 20.19.10.png

**Text:** Section header "Browser":
- "Browser tools" — "Claude can start your dev servers, browse the web in a built-in browser, and verify changes with screenshots, snapshots, and DOM inspection." — toggle ON
- "Open links in built-in browser" — "Links open in the built-in browser instead of your default browser." — toggle ON
- "Keep cookies" — "Browser tabs keep cookies and logins across restarts in one saved browser shared by every session and Cowork. Per session gives each Code session its own copy instead, so sessions never see each other's logins." — dropdown "Until quit"
- "Allowed sites" — "Sites where Claude can use its Browser tools without a permission prompt." — button "Manage"

Section header "Mobile simulators":
- "iOS Simulator" — "Let Claude verify your changes in the iOS Simulator on this Mac: running your app, driving it through flows, and capturing screenshots and recordings. You will be asked before Claude uses each device. When off, Claude doesn't get its simulator tools, and you can still use the simulator in the app yourself." — toggle ON

Section header "Pull requests":
- "Branch prefix" — "Prefix added to branch names for both local and cloud sessions." — text input containing "claude"
- "Create pull requests automatically" — "When Claude pushes changes to a branch, it automatically opens a pull request without asking first. Applies to cloud sessions only." — toggle OFF
- "Auto-fix pull requests" — "When you create a pull request, Claude automatically monitors it for CI failures and review comments, then responds proactively. Claude may post comments on your behalf." — toggle OFF
- "Auto-archive after PR merge or close" — "Automatically archive desktop sessions when the associated pull request is merged or closed. Archiving also removes the session's worktree and deletes its branch once the pull request is merged. Work that isn't pushed is kept." — toggle OFF

Section header "Authorization tokens" begins at the bottom (see next entry).

**Layout/style:** Same single-column settings-row pattern (bold label, gray description paragraph, right-aligned control).

---

## Settings — Claude Code tab — Authorization tokens section

- Skärmavbild 2026-09-18 kl. 20.19.22.png
- Skärmavbild 2026-09-18 kl. 20.19.25.png (near-identical scroll position to the previous file)

**Text:** Header "Authorization tokens" — "Created when you sign in to Claude Code. Revoke a token to sign out from that device." Table with column headers "Application" and "Scopes". Rows each list "Claude Code" as the application, a relative connection time (e.g. "Connected 2 hours ago", "Connected yesterday", "Connected 2 days ago"), and a set of scope pill-tags in a monospace font (e.g. `user:file_upload`, `user:inference`, `user:plugins`, `user:profile`, `user:sessions:claude_code`, `user:mcp_servers`). Pagination footer: "Showing 1–5 of 10" with "Page 1 of 2" and left/right chevron arrows.

Below that, header "Claude Code (CLI, Desktop, IDE)":
- "Delete sessions stored by Anthropic" — "Permanently delete Anthropic's server-side copies of your Claude Code sessions. Sessions stored locally on your computer aren't affected. Cloud sessions are managed separately. Go to Claude Code." (with "Claude Code" as a hyperlink) — button "Delete…"
- "Sharing settings" — "Control how your claude.ai/code sessions are shared." — button "Manage"

**Layout/style:** Scope tags render as small rounded-rectangle chips with light-gray background and monospace text, wrapping onto a second line per row when there are more than ~4 scopes. Table rows separated by thin horizontal divider lines.

---

## Settings — Cowork tab

- Skärmavbild 2026-09-18 kl. 20.19.31.png

**Text:**
- "Require trusted devices" — "Verify each new device before it can connect to Claude on your computer remotely — applies to Claude Code Remote Control and Cowork. Learn more ↗" — toggle OFF
- "Cowork files" — "Your artifacts and scheduled tasks are stored at [a local file path under the user's home folder]." — button "Change" (folder icon)
- "Trusted Cowork folders" — "Cowork tasks may use these folders, and folders inside them, without asking you first." — button "Manage"
- "Only on this computer" — "Stops when the app closes or this computer sleeps. Learn more about how Claude reads your files" (link) — toggle OFF
- "Preferred browser" — "Claude uses this browser by default unless you ask otherwise." — dropdown "Built-in browser"
- "Open links in built-in browser" — "Links open in the built-in browser instead of your default browser." — toggle ON
- "Allowed sites" — "Sites where Claude can use its Browser tools without a permission prompt." — button "Manage"

**Layout/style:** Same settings-row pattern; "Cowork" nav item active. Note: the "Cowork files" row displays a local filesystem path that includes the machine's account username — treated as incidental account/system info rather than app-chrome text, so the literal path is not reproduced here.

---

## Settings — General (Desktop app) tab

- Skärmavbild 2026-09-18 kl. 20.19.40.png
- Skärmavbild 2026-09-18 kl. 20.19.47.png
- Skärmavbild 2026-09-18 kl. 20.19.50.png

**Text:** Header "General desktop settings":
- "Desktop app version" — value shown right-aligned (e.g. "2.2553.1")
- "Run on startup" — "Automatically start Claude when you log in to your computer." — toggle ON
- "Quick access shortcut" — "Message Claude from anywhere on your desktop." — dropdown "Tap Option twice"
- "Voice shortcut" — "Speak to Claude from anywhere on your desktop." — dropdown "No shortcut"
- "Dictation shortcut" — "Start or stop dictation in the chat you're typing in." — dropdown "Command+D"
- "Menu bar" — "Show Claude in the menu bar." — toggle ON
- "Keep computer awake" — "Prevent your computer from idle-sleeping while Claude is open so scheduled tasks can run. Your display can still turn off. Closing the laptop lid will still put it to sleep." — toggle ON

Header "Browser use" — "Not available in cloud Code sessions, which don't run on this computer."
- "Connected browsers" — "Chrome instances signed in to your account that Claude can automate." — panel showing "1 browser connected" with a "Recheck" button (circular-arrow icon), and a list row: "Browser 1 / macOS" with a checkmark and "Device ID: [id]" right-aligned.

Header "Computer use" with a gray "Beta" pill badge next to it — "Not available in cloud Code sessions, which don't run on this computer."
- "Enable computer use" — "Let Claude see and act in the apps you allow, working in the background or with full control of your screen. Learn more" — toggle ON
- "Unhide apps when Claude finishes" — "When Claude has full control of your screen, apps hidden during a task are restored when Claude stops." — toggle ON
- "How Claude uses the apps you allow" — "Background: Claude works inside the apps you allow while you keep using your computer, and asks your permission before taking full control of your screen. Full control: Claude takes control of your screen, mouse, and keyboard by default whenever Claude uses an app you allow, without asking again." — segmented control "Background" (selected) / "Full control"
- "Denied apps" — "Any request Claude makes to access these apps is automatically rejected. Claude may still affect them indirectly through actions in allowed apps." — button "Add app" (chevron), with helper text below "No apps denied. Add an app to automatically reject Claude's requests for it."
- "Accessibility" — status pill "Granted"
- "Screen recording" — status pill "Granted"

**Layout/style:** "General" nav item active under "Desktop app" group. Status pills ("Granted") render as light-gray rounded rectangles with dark text, right-aligned like the toggles.

---

## Settings — Extensions tab (empty state)

- Skärmavbild 2026-09-18 kl. 20.20.11.png

**Text:** Header "Extensions" — "Allow Claude to directly interact with apps, data, and tools on your computer." Button top-right "Browse extensions". Centered empty state: a puzzle-piece line icon, text "No extensions installed", a button "Advanced settings", and below it a hint row with a lightbulb icon: "Drag .MCPB or .DXT files here to install".

**Layout/style:** "Extensions" nav item active under "Desktop app" group. Empty state is vertically centered in an otherwise blank content pane, matching the visual pattern of the Design systems empty state (icon + message + action).

---

## Extension settings sub-page (distinct full-page layout, not the modal)

- Skärmavbild 2026-09-18 kl. 20.20.19.png

This screenshot is structurally different from the rest of the batch: instead of a centered modal over a dimmed background, it is a **full-browser-window/full-page view** with a plain warm off-white background (no dimming, no visible sidebar chat list behind it).

**Text/layout:** Top bar: a back-arrow "←" icon followed by the word "Settings" (left-aligned, plain text, no icon), and a circular avatar badge with initials "GO" at the far top-right. Thin horizontal divider below the top bar spans full width.

Left nav column (text-only list, no icons, no section-group visual separation beyond spacing and a blank line before "Desktop app" items): Preferences, Account, Privacy, Billing, Capabilities, Design systems, Connectors, Claude Code, Cowork, Claude in Chrome, then (after a gap, with faint gray "Desktop app" label) General, Extensions (currently selected — shown with a light-gray rounded highlight), Developer.

Main content: breadcrumb-style back link "‹ All extensions", header "Extension settings".
- "Enable auto-updates for extensions" — "Automatically update extensions when new versions are available. If disabled, you'll need to manually update extensions." — toggle ON
- "Use built-in Node.js for MCP" — "If enabled, Claude will never use the system Node.js for extension MCP servers. This happens automatically when the system's Node.js is missing or outdated." — toggle ON
- "Detected tools" — plain text lines: "Node.js: [version numbers] (built-in: [version])" and "Python: [version number]"

Section header "Extension developer" with a red/pink warning banner box containing a triangle-exclamation icon, bold text "Developer tools warning", and body text "These tools are intended for extension developers only. Using them incorrectly may cause extensions to malfunction or compromise your system security."

Row of four buttons below the warning: "Install extension" (solid black/filled, primary), "Install unpacked extension", "Open extensions folder", "Open extension settings folder" (all three others are outlined/secondary style).

**Visual style notes:** No terracotta/orange accent visible in this screen — the only color accent is the red/pink warning banner and the blue toggle switches. Sans-serif typography throughout. This appears to be a distinct "settings as its own page" navigation state rather than the usual overlay dialog — worth flagging as a possible alternate settings presentation to account for in the rebuild.

---

## Settings — Developer tab

- Skärmavbild 2026-09-18 kl. 20.20.26.png

**Text:** Header "Local MCP servers" — "Add and manage MCP servers that you're working on." Centered empty state: a monitor-with-cursor line icon, text "No servers added", two buttons side by side: "Edit config" (solid black, primary) and "Developer docs ↗" (outlined, secondary, with external-link arrow).

**Layout/style:** Standard modal chrome; "Developer" nav item active under "Desktop app" group. Same empty-state visual pattern (icon + message + action button(s)) as Design systems and Extensions empty states, confirming a reusable empty-state component.

---

## Settings — Skills tab — "Your skills" view with Add menu open

- Skärmavbild 2026-09-18 kl. 20.20.33.png

**Text:** Header "Skills". Search field placeholder "Search skills and plugins". Tabs: "Your skills" (active) / "Discover". Controls top-right: "Filter" (with an icon and chevron) and "Add" button (with chevron) — shown clicked open, revealing a dropdown with four rows, each with a small icon plus label: "Upload skill", "Create a skill", "Create with Claude", "Record your screen".

Below the tabs, a sub-header "Created by you · 10" introduces a scrollable list of skill entries. Each list row follows a consistent pattern: a small square icon tile on the left, a bold skill-name title, one or more small colored tag pills next to the title (a blue "New" badge appears on several rows, plus category tags such as topical labels, and a "+N" overflow tag when more categories exist than fit), a second line reading "by you · " followed by a truncated one-line description, and on the right side a relative timestamp (e.g. "yesterday", "2d ago", "Jul 25") plus a three-dot overflow-menu icon.

**Layout/style:** List rows are separated by thin horizontal divider lines, consistent left icon / title+description block / right metadata three-column layout. "Skills" nav item active under "Customize" group.

---

## Settings — Skills tab — "Discover" view

- Skärmavbild 2026-09-18 kl. 20.20.38.png

**Text:** Same header/search/tab chrome as above, but "Discover" tab is active; the right-side controls are now "Filter" and "Sort" (both with chevrons) instead of "Add".

Below the tabs, a large featured banner card with a sage-green background: small label "From Anthropic", large bold title "Data", description "Query, chart and explain your data — SQL, spreadsheets and dashboards in one place.", a black "Add" button, and a decorative icon illustration (a grid/table icon with a small circular chart-trend badge overlapping it) on the right side of the banner.

Below the banner, a section header "For you" followed by a two-column grid of category cards, each with: a small icon tile, a bold category title, a short description, an attribution line ("from Anthropic" or "from Nevo David") plus an install count (e.g. "2.7M installs", "1.7M installs"), and a "+" add button in the top-right corner of the card. Visible cards: "Productivity", "Design", "Marketing", "Postiz", "Finance", "Product Management", and the start of a second row with "Operations" and "Small Business" cut off at the bottom edge.

**Layout/style:** Grid cards have rounded corners and a thin border, consistent padding, and align the "+" button to each card's top-right corner. The featured banner uses a distinct pastel/sage accent color block, differing from the plain white background of the grid cards below it — this is the first strong use of a non-neutral background color block seen in this batch (still no terracotta/orange accent color observed anywhere in this batch; toggles and primary buttons use blue and black respectively).

---

## Cross-cutting observations for this batch

- No terracotta/orange accent color appears anywhere in these 20 screenshots — the observed accent colors are blue (toggle switches, checkmarks, links, "New" badges), black (primary buttons), light gray (secondary buttons, hover states, empty-state icons), and one sage-green featured-banner block (Skills → Discover).
- All settings screens (except the one full-page "Extension settings" sub-page) share one modal shell: fixed-width left nav + scrollable right content pane, both inside a single rounded white card floating over a dimmed backdrop.
- A reusable empty-state pattern (centered icon + bold message + one or two action buttons) recurs identically across Design systems, Extensions, and Developer (Local MCP servers) tabs.
- Typography is sans-serif throughout every settings screen; monospace font is used only for code previews, scope tags, and version numbers.
- Toggle switches are consistently right-aligned pill switches (blue-filled = on, outline = off) regardless of settings tab.
