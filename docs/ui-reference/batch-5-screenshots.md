# Batch 5 — Screenshot Catalog ("Cowork and chat are now one Claude" Update)

Source folder: `docs/ui-reference/` (`Skärmavbild 2026-10-14 kl. 16.53.25.png` through `17.09.36.png`, 76 files total).
This batch documents the live Claude application following Anthropic's major unification update:
**"Cowork and chat are now one Claude"**.

All screenshots were captured on macOS in Google Chrome (light mode) on 2026-10-14.
This document provides an exhaustive, pixel-by-pixel catalog of all 76 screenshots, their layout, components,
text content, buttons, styles, and status/deviations compared to our application.

---

## Architectural & Paradigm Shifts in Batch 5

1. **Unification of Chat and Cowork (No Mode Switcher):**
   - The separate segmented pill switch (`Chat` | `Cowork`) inside the composer from earlier versions is **completely gone**.
   - Chat and Cowork are one single unified interface. The user always types into the same composer.
   - Autonomy and safety boundaries are controlled via the **Permission mode** selector (`Auto` vs `Manual`).
2. **Permission Mode Selector (`Auto` / `Manual`):**
   - Positioned underneath the bottom-right of the composer box (alongside the model selector `Opus 5.5 Extra`).
   - `Auto`: *"Claude runs on its own and pauses to ask if anything looks unsafe."* (Recommended default for autonomous agent tasks).
   - `Manual`: *"Claude asks before using new tools or opening new sites."* (Explicit gatekeeping for tool execution).
3. **Floating Metric & Optimization Pill Bar:**
   - Floats directly above the top edge of the composer input box.
   - Left pill: Word/character counter with dropdown toggle (`⌵ 0 words / 0 chars`). Clicking opens a breakdown popover:
     - Characters (with spaces)
     - Characters (no spaces)
     - Words
     - Sentences
     - Lines
     - Paragraphs
     - Tokens (est.)
   - Middle pill: `✦ Optimize` (one-click prompt enhancer / optimizer).
   - Right pill: Session limit countdown timer (`⏱ 47m`).
   - Far right: Dual chevron toggle buttons (`^` / `⌵`) for collapsing/expanding composer height.
4. **Composer Box Internals & Placeholder:**
   - Placeholder text: `"How can I help you today?"` on initial load, changing to `"Type / for skills"` or `"Describe a task or ask a question"`.
   - Bottom-left inside textarea: `+` attach menu button.
   - Bottom-right inside textarea: `🎤` speech-to-text mic button and `|||| ⌵` voice mode visualizer button.
   - Outside bottom row:
     - Left: `Project ⌵` (or `Project or folder ⌵`).
     - Right: Model selector (`Opus 5.5 Extra`) + Permission Mode (`Auto` / `Manual`).
5. **Scheduled & Background Tasks in Navigation & Conversation List:**
   - Left sidebar has dedicated top-level navigation item: `🕒 Scheduled` with a blue active indicator dot (`•`).
   - In conversation list (`Today`, `Oct 11`, `Oct 10`), conversations running background tasks or scheduled routines show a clock glyph with an active blue dot in the top-right corner (`⏱ •`).
6. **Plans & Task Checklists in Conversations:**
   - In execution sessions, multi-step actions display structured checklists of completed work ("Gjort och testat lokalt") and remaining work ("Kvar att göra"), updating in real time as the agent executes actions.
   - Slash command `/plan` and `/schedule` ("Create a routine that can be run on demand or automatically on an interval").
7. **Claude Design Moving to Artifacts:**
   - Banner: *"Claude Design is moving to Artifacts in the Claude app. You can keep using this version until December 14."*
   - Navigating to Design highlights that new slides and design projects are created as artifacts (`Slides`, `Design`, `Design in codebase`, `Design System`).
8. **Settings Dialog Reorganization:**
   - Left sidebar tabs:
     - **Settings**: `General`, `Account`, `Privacy`, `Billing`, `Usage`, `Capabilities`, `Memory`, `Design systems`, `Reflect`, `Time and focus`, `Claude Code`, `Claude in Chrome`.
     - **This computer** (desktop): `System` (with Browser use & Computer use toggles), `Extensions`, `Developer` (Local MCP servers).
     - **Customize**: `Skills`, `Connectors`, `Plugins`.
   - New **Time and focus** tab: Break reminders and Quiet hours (day-of-week selection).
   - New **Capabilities** tab: Tool access mode, Connector search, Model fallback on flag, Artifacts toggles, Cloud code execution.
   - New **Reflect** tab: Personal review over time periods (Past month, Past 3 months, Past 6 months, Past year).

---

## Detailed 76-Screenshot Catalog

### 01. Landing page — Unified Composer Overview
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.53.25.png`
- **View:** Empty-state landing page (`claude.ai/new`), light mode, Chrome browser window.
- **Layout:**
  - Left rail: Claude wordmark, sidebar toggle `[ 💬 | </> ]` (Chat vs Code), search input (`🔍 Search`), `+ New` button. Navigation list: `Projects`, `Artifacts`, `Scheduled •` (with blue dot), `Design`, `Customize`, `> More`, `⚡ Superpower for Claude >`. Pinned section (`tjabo.site`). Today list with `Eftermiddag hej 15:01` showing `⏱ •` background task badge. Sidebar footer: `GO Tjabo · Pro ⌵`.
  - Center: Terracotta starburst glyph + `"Good afternoon, Tjabo"` in large serif type.
  - Above composer: Floating pill bar with `⌵ 0 words / 0 chars`, `✦ Optimize`, `⏱ 47m`, and chevron container `^ ⌵`.
  - Composer box: Rounded rectangle with white background and thin border. Inside bottom-left: `+` attach button. Inside bottom-right: `🎤` mic and `|||| ⌵` voice waveform. Placeholder: `"How can I help you today?"`.
  - Sub-bar below composer: Left: `Project ⌵`. Right: Model selector `Opus 5.5 Extra` and Permission mode `Auto`.
- **Style & Deviations:** Matches our updated UI. ComposerModeToggle is gone; floating pill bar and permission popover render cleanly.

### 02. Composer — Word/Character Count Breakdown Popover
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.53.42.png`
- **View:** Same landing page with `⌵ 0 words / 0 chars` pill clicked.
- **Layout:** Compact white popover open below the word count pill.
- **Content:** Vertical list of metric rows with bold right-aligned counters: Characters (with spaces), Characters (no spaces), Words, Sentences, Lines, Paragraphs, Tokens (est.).
- **Style & Deviations:** Implemented in `WordCountPopover.tsx` and fully verified by unit tests.

### 03. Composer — Permission Mode Selector Popover
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.53.59.png`
- **View:** Popover opened by clicking `Auto` button under the composer.
- **Layout:** White popover menu anchored to the bottom-right permission button.
- **Content:** Header uppercase label "Permission mode". Two selectable items:
  - `Manual`: "Claude asks before using new tools or opening new sites."
  - `Auto` (selected with checkmark `✓`): "Claude runs on its own and pauses to ask if anything looks unsafe."
- **Style & Deviations:** Implemented in `PermissionModePopover.tsx` with Recoil `permissionModeFamily` and `localStorage` persistence.

### 04. Customize — Skills Discover Tab
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.54.40.png`
- **View:** `claude.ai/customize/skills` page.
- **Layout:** Sub-pills: `Skills` (active), `Connectors`, `Plugins`. Filter tabs: `Yours`, `Discover` (active). Search bar, filter dropdown, sort dropdown, `+ Add ⌵` button.
- **Content:** Hero card "From Anthropic — Data: Query, chart and explain your data...". 2-column card grid: Plugin Management (8.3M), Design (2.7M), Marketing (2.2M), Finance (1.8M), Postiz (1.8M), Product Management (1.6M).
- **Style & Deviations:** Corresponds to our Customize/Marketplace view.

### 05. Landing page — "Type / for skills" & History Clock Badges
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.55.09.png`
- **View:** Landing page with focus hint `"Type / for skills"` in composer.
- **Layout:** Left sidebar shows history sections `Today`, `Oct 11`, `Oct 10` with multiple items displaying `⏱ •` (clock with blue active indicator dot).
- **Style & Deviations:** Real background task queries wired via `useCoworkTasksQuery()` in `Convo.tsx` and `SidebarNavList.tsx`.

### 06. Claude Design — Deprecation & Artifacts Transition Banner
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.55.40.png`
- **View:** `claude.ai/design?via=design_artifacts_banner&noredir=1`.
- **Layout:** Full-width top banner: "Claude Design is moving to Artifacts in the Claude app. You can keep using this version until December 14. Learn more".
- **Content:** Template selector: Blank, Mobile app design, Slides, Document, Wireframe, Animation, UI mockups, Résumé, 3D object, Research, HTML email, Color + type pairing.
- **Style & Deviations:** Matches our Fas 15 implementation where Design outputs directly into the Artifacts pipeline.

### 07. Projects Directory — Cowork Projects & Filter Popover
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.56.02.png`
- **View:** `claude.ai/cowork/projects` directory.
- **Layout:** Header "Projects", search, filter icon, "New project" button. Popover open: Status (Active), Last activity (All), Group by (Date), Sort by (Last activity).
- **Content:** Project cards: `tjabo.site`, `Autoclipper app`, `Pancrase App`, `Politik`.

### 08. Recents Chats Directory
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.56.09.png`
- **View:** `claude.ai/chats` management view.
- **Layout:** Header "Recents", sub-tabs `Active`, `Shared`, `Archived`. `Select` and `New session` buttons.
- **Content:** Tabular list of past conversations with relative time tags.

### 09–13. Claude Code Dashboard & Sessions (`claude.ai/code`)
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.56.18.png` through `16.57.00.png` (5 shots).
- **View:** Dedicated Claude Code web client interface.
- **Layout:**
  - Header: `to Claude Code` toggle, search, `* Welcome back, Tjabo`.
  - Sessions section with colored badges: `Needs input` (orange dot: Auto Clipper, Studi AI), `Ready for review` (blue dot: IPTV-tjansten, Onskelista hemsida).
  - Pull requests section: `Merge conflicts` (orange dot), `Ready for review` (blue dot).
  - Bottom bar: Workspace selector `[☁️ Default] [</> -nskelista ⌵ main]`. Dropdown menus cover Local/Cloud download options (`16.56.25.png`), repository selection with search (`16.56.29.png`), and composer connectors attachment menu (`16.56.42.png`).
  - User profile menu (`16.57.00.png`): Settings, Usage, Language, Get help, View all plans, Get apps, Log out.

### 14–16. Settings — General (Appearance, Notifications, Voice, Tasks)
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.57.30.png`, `16.57.33.png`, `16.57.36.png`.
- **View:** Settings modal -> **General** tab.
- **Layout & Controls:**
  - Appearance: Theme (System/Light/Dark), Chat font dropdown (`Anthropic Serif ⌵`), Transcript text size (Small/Medium/Large), Transcript width (Narrow/Medium/Wide).
  - Motion: System / Reduced.
  - Tasks: Preferred browser dropdown (`Built-in browser ⌵`).
  - Voice: Language (English), Style (Rounded), Speed (Normal).
  - Notifications: 9 distinct toggle rows: Response completions, Scheduled tasks, Code notifications, Code permission requests, Emails from cloud sessions, Dispatch messages, Mentions and replies, Comments on your artifacts, Artifacts shared with you.
- **Style & Deviations:** Implemented across Settings appearance tokens and preferences.

### 17–19. Settings — Account (Profile, Trusted Devices, Active Sessions)
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.57.40.png`, `16.57.43.png`, `16.57.45.png`.
- **View:** Settings modal -> **Account** tab.
- **Content:**
  - Profile: avatar GO, Full name, What should Claude call you?, Work description, Custom writing instructions for Claude.
  - Organization ID, Require trusted devices toggle.
  - Local devices table: MacBook Air (macos), DESKTOP-TKBHGO1 (Windows).
  - Active sessions table: Device, Location, Created, Updated timestamps for Desktop app, Safari, Chrome, iOS.

### 20–21. Settings — Privacy (Data Controls & Metadata)
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.57.48.png`, `16.57.51.png`.
- **View:** Settings modal -> **Privacy** tab.
- **Controls:** Location metadata toggle, Help improve our AI models toggle, Export data button, Shared chats, Shared artifacts, Uploaded files, Memory preferences.

### 22–23. Settings — Capabilities (Tool Access, Artifacts, Egress)
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.58.12.png`, `16.58.16.png`.
- **View:** Settings modal -> **Capabilities** tab.
- **Controls:**
  - Tool access mode dropdown (`Tools already loaded ⌵`), Connector search toggle, Model fallback on message flag toggle.
  - Visuals: Artifacts toggle, AI-powered artifacts toggle, Inline visualizations toggle.
  - Code execution: Cloud code execution and file creation toggle.
  - Network egress: "Allow network egress" toggle with security warning, Domain allowlist (`All domains ⌵`).

### 24–25. Settings — Memory (Preferences, Topics, Projects, Entry)
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.58.20.png`, `16.58.29.png`.
- **View:** Settings modal -> **Memory** tab.
- **Controls:** Search & reference chats toggle, Generate memory from chats toggle, Sensitive topics toggle, Import memory button.
- **Content:** "You" personal memory cards (Preferences, Profile, Topics: Dator, Food, Kampsport Reels, Nordic Sourcing, etc.), Projects section, bottom manual add input (`"My dog's name is Beans" [↑]`).

### 26. Settings — Design Systems
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.58.36.png`.
- **View:** Settings modal -> **Design systems** tab.
- **Content:** "Design systems give Claude your colors, type and components...", tabs Using Claude vs Using Claude Code, search input, "New design system ⌵" button.

### 27–33. Settings — Reflect (Conversation Retrospective)
- **Sources:** `Skärmavbild 2026-10-14 kl. 16.58.43.png` through `17.00.19.png` (7 shots).
- **View:** Settings modal -> **Reflect** tab.
- **Content:**
  - Period selector: `Past month`, `Past 3 months`, `Past 6 months`, `Past year`.
  - Loading animation ("Surfacing themes and patterns... This should only take a minute or so").
  - Generated report: Narrative journey review ("Allt du bygger börjar med att du vill äga hela kedjan...").
  - Stats: Most active day (Wednesday), Peak hour (4 PM), Total conversations (90), monthly activity bar chart.
  - Screen time counter ("Counts time you have Claude open on your screen...").
  - Callout: "Decide when Claude is off: Schedule quiet hours and get a nudge when a session runs long [Set quiet hours and breaks]".
  - Topic distribution: Jarvis och servern (35%), Träning och kost (25%), AI-verktyg (15%), Appar (13%), Investeringar (12%).
  - Skill progression breakdown: Delegation, Discernment, Diligence.

### 34. Settings — Time and Focus (Break Reminders & Quiet Hours)
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.00.40.png`.
- **View:** Settings modal -> **Time and focus** tab.
- **Layout & Controls:**
  - Header "Time and focus".
  - Section 1: `Break reminders`: "Get a nudge to take a break from Claude. You can snooze or adjust anytime." Two dropdown selectors (`- ⌵`, `- ⌵`).
  - Section 2: `Quiet hours`: "Set time limits for Claude. You can dismiss or adjust anytime."
  - 7 day-of-week pill buttons: `S`, `M`, `T`, `W`, `T`, `F`, `S` with active toggle states.
  - Time range dropdowns (start time, end time).
- **Style & Deviations:** Fully implemented in `TimeAndFocusTab.tsx` with unit tests passing.

### 35–39. Settings — Claude Code (Session States, Theme, Font, PRs)
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.00.43.png` through `17.01.03.png` (5 shots).
- **View:** Settings modal -> **Claude Code** tab.
- **Controls:**
  - Classify session states toggle, Model fallback toggle.
  - Code appearance theme switcher: Claude Light vs Catppuccin Mocha. Custom code font input (`JetBrains Mono`).
  - Interface font radio: Anthropic Sans / System / OpenDyslexic.
  - Default transcript view: Normal / Thinking / Verbose. Branch prefix: `claude`.
  - Automatic pull request creation toggle, Auto-fix pull requests toggle.
  - Authorization tokens list, Delete server-side sessions, Sharing settings popover.

### 40. Settings — Claude in Chrome Extension
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.01.09.png`.
- **View:** Settings modal -> **Claude in Chrome** tab.
- **Controls:** Enable extension toggle, Site permissions dropdown ("Allow all sites"), Blocked sites management with `+ Add websites`.

### 41–45. Settings — Customize (Skills, Connectors, Plugins Drilldown)
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.01.15.png` through `17.01.31.png` (5 shots).
- **View:** Settings modal -> **Customize** sections.
- **Content:**
  - Skills "Yours": list of 89 user skills (`chat-handoff`, `cloudflare`, etc.) and `+ Add ⌵` dropdown (`Upload skill`, `Create a skill`, `Create with Claude`).
  - Connectors "Yours": tabular list (Canva, GitHub, Gmail, Calendar, Drive, Notion, Vercel, Lovable, Strava).
  - Connectors "Discover": 2-column card grid with install counts.
  - Plugins "Discover": Data banner and plugin cards.

### 46–47. Claude Code — Usage Gauge & Effort Selector Popovers
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.02.02.png`, `17.02.18.png`.
- **View:** Popovers triggered from composer controls in Claude Code.
- **Content:**
  - Usage popover: 5-hour usage 100%, resets in 37m; 7-day usage 14%, resets Wed 9:59; Refreshed just now.
  - Effort popover: `Effort: Ultracode`, Faster vs Smarter slider, Recommended badge.

### 48. Finder Directory Snapshot
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.03.41.png`.
- **View:** macOS Finder window displaying the PNG screenshots captured in `docs/ui-reference/`.

### 49. Composer — Project Selector Dropdown
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.05.18.png`.
- **View:** Landing page composer with `Project or folder ⌵` clicked.
- **Content:** Search/create project input, pinned projects (`tjabo.site`, `Autoclipper app`, `Pancrase App`, `Politik`), `+ New project`, `Add folder`.

### 50. Composer — Attach Plus Menu
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.06.00.png`.
- **View:** Composer `+` button clicked upward into landing page.
- **Content:**
  - `📎 Add files or photos` (⌘U)
  - `📁 Add folder`
  - `📹 Record a skill`
  - Divider
  - `💼 Skills >`
  - `🔌 Connectors >`
  - `🎨 Design system >`
  - `🧩 Add plugins`
  - Divider
  - `🔍 Research`
  - `🧠 Memory ✓`
- **Style & Deviations:** Implemented in `AttachPlusMenu.tsx` with Record skill modal trigger.

### 51. Modal — "Record a Skill"
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.06.07.png`.
- **View:** Centered modal overlaid on blurred backdrop.
- **Content:**
  - Title: `📹 Record a skill` with X close button.
  - Body: "Your screen, clicks, typing, and voice are recorded, then sent to Claude and turned into a repeatable skill."
  - Warning box: "🔒 Don't type passwords or secrets, or display sensitive information or private conversations while recording."
  - Actions: Cancel button, Start recording button (black pill), microphone selector pill.
- **Style & Deviations:** Implemented in `RecordSkillModal.tsx` and wired into `AttachPlusMenu.tsx`.

### 52. Landing page with Active Background Tasks
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.06.36.png`.
- **View:** Clean landing page with sidebar conversation history showing active clock icons (`⏱ •`).

### 53. Modal — "Create a Project"
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.06.42.png`.
- **View:** Project creation dialog overlaid on Projects page.
- **Content:**
  - Header: `Create a project`
  - Inputs: "What are you working on? (Name your project)", "What are you trying to achieve? (Describe your project, goals, subject)", "Context (optional) [+ Add context]".
  - Footer: Cancel, Create project.

### 54. Claude Design In-App Hub
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.06.53.png`.
- **View:** `claude.ai/design` integrated view.
- **Content:**
  - Banner: "Claude Design lives here now: New Slides and Design projects are created as artifacts. Visit the standalone homepage."
  - Action cards: `Slides New`, `Design New`, `Design in codebase`, `Design System`.
  - Recents list of design artifacts.

### 55. In-Chat Session — Live MRP Execution & Plan Checklists
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.07.04.png`.
- **View:** Active conversation transcript during multi-step coding run.
- **Content:**
  - Top repository header: `Interaktiv önskelista hemsida ⌵`, branch pill `[-nskelista main  +284 -24  Create PR ⌵  ✕]`.
  - Progress summary in assistant response:
    - `"Gjort och testat lokalt:"` bulleted list of verified actions (Bestsecret-flik, på/av-knapp, storlekar, bildkontroll, minne).
    - `"Kvar att göra:"` numbered checklist of remaining tasks (Granska storlekar, commit & push, publicera om artifact, README, mobilvy).
  - Status banner above composer: `✓ Wrapped up past your usage limit | Resets at 5:40 PM | Learn more | [Get more usage] [✕]`.
  - Unified composer with `Auto` permission indicator and `Sonnet 5.5 Extra ○`.
- **Style & Deviations:** Parsed and displayed in real time by `PlansPanel.tsx` and `actionParser.ts`.

### 56. Composer — Slash Commands Menu
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.07.12.png`.
- **View:** Slash command menu popover triggered by typing `/` in composer.
- **Commands:** `/schedule` ("Create a routine that can be run on demand or automatically on an interval"), `/btw`, `/ultrareview`, `/rewind`, `/fork`, `/mcp`, `/plugin`, `/feedback`, `/model`, `/effort`, `/fast`, `/plan`, `/permissions`, `/skills`, `/output-style`, `/rename`.

### 57. Composer — Context Window & Auto-Compact Popover
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.07.20.png`.
- **View:** Popover triggered from composer context indicators.
- **Content:**
  - Context window gauge: `762.6k / 1M (76%) >`.
  - Compact trigger: `200k until auto-compact` with `[Compact session]` button.
  - Plan usage limits: Session limit 100%, Weekly all models 14%.
  - Link: `[See detailed breakdown]`.

### 58. Modal — Detailed Usage & Token Breakdown
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.07.33.png`.
- **View:** Full modal opened from `See detailed breakdown`.
- **Content:**
  - Session cost: `$16.97`, API runtime: `13m 43s`, Active time: `10m 30s`, Lines: `+395 -49`, Cache hit: `98%`.
  - Token breakdown table: Input, Output, Cache read, Cache write across Sonnet 5.5 and Sonnet 5.
  - "What's using your limits?" breakdown list: `anthropic-skills Plugin` (84%), `Claude Browser MCP` (84%), `Skill` (44%).
  - Compact action: `Compact this session`, `New session`.

### 59. Landing page — Usage Alert & Profile Menu
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.07.50.png`.
- **View:** Landing page with top banner: `ⓘ You've used 90% of your session limit [Get more usage] [✕]` and bottom profile menu open.

### 60. Settings — General (Trusted Folders)
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.07.57.png`.
- **View:** Settings modal -> **General** -> Tasks -> Trusted folders.
- **Content:** "When you trust a folder on this device, you allow Claude to use it and the folders inside it... [Manage]".

### 61–63. Settings — Desktop App System Tab (Computer Use & Shortcuts)
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.08.01.png`, `17.08.06.png`, `17.08.13.png`.
- **View:** Settings modal -> **This computer** -> **System** tab.
- **Content:**
  - Desktop app version 2.31226.0, Run on startup, Quick access shortcut ("Tap Option twice"), Voice shortcut, Dictation shortcut ("Command+D"), Menu bar toggle, Keep computer awake toggle, Storage folder path.
  - Dispatch Beta toggle.
  - Browser use: Connected browsers with Recheck button, Open links in built-in browser toggle, Allowed sites list.
  - Computer use Beta: Enable computer use toggle, Unhide apps when Claude finishes toggle, How Claude uses apps (Background vs Full control toggle), Denied apps list (`+ Add app`), OS Accessibility & Screen recording permission badges (`Granted`).

### 64–65. Settings — Desktop App Extensions (MCP & Tool Runtime)
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.08.17.png`, `17.08.27.png`.
- **View:** Settings modal -> **This computer** -> **Extensions** tab.
- **Content:**
  - Extensions list, Drag `.MCPB` or `.DXT` files here to install, `Browse extensions` button.
  - Advanced settings drawer: Enable auto-updates toggle, Use built-in Node.js for MCP toggle, Detected tools list (Node.js versions, Python 3.9.6), Extension developer actions (Install unpacked extension, Open extensions folder, Open settings folder).

### 66. Settings — Desktop App Developer (Local MCP Servers)
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.08.33.png`.
- **View:** Settings modal -> **This computer** -> **Developer** tab.
- **Content:** Local MCP servers list, `Edit config` button, Developer docs link, "Go to Claude Platform" API keys link.

### 67–72. Settings — Customize Connectors, Skills, and Plugins Drilldown
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.08.56.png` through `17.09.14.png` (6 shots).
- **View:** Desktop settings view variations of Skills, Connectors, and Plugins directories.
- **Content:** Complete inventory of installed connectors (Canva, GitHub, Gmail, Drive, Notion, Vercel, Strava), skills list (89 total skills), and empty plugins callout ("Add your first plugins").

### 73. Plugin Creator Drawer — File Tree & Versioning
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.09.23.png`.
- **View:** Slide-out drawer for creating/editing plugins.
- **Content:** Plugin name (`deal-desk-helper`), Description (`What this plugin helps with`), Version pill (`v1.draft`), file explorer tree (`/skills/skill/SKILL.md`, `+ Add file`), Cancel and Save version buttons.

### 74. Plugins — Add Dropdown Menu
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.09.26.png`.
- **View:** `+ Add ⌵` split button open in Plugins tab.
- **Content:** Menu rows: `Add marketplace`, `Upload plugin`, `Create a plugin`, `Create with Claude`.

### 75. Landing Page — Incognito Trigger Pill
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.09.33.png`.
- **View:** Top toolbar showing `Use incognito • ⌘I` pill button.

### 76. Incognito Session View — Dashed Border Composer
- **Sources:** `Skärmavbild 2026-10-14 kl. 17.09.36.png`.
- **View:** Full incognito conversation session.
- **Layout & Style:**
  - Header badge: `👻 Incognito`.
  - Heading: Starburst icon + `You're incognito`.
  - Alert banner: `ⓘ You've used 90% of your session limit [Get more usage] [✕]`.
  - Composer input: styled with a **dashed border** (`border-dashed border-2`).
  - Footnote: *"Incognito sessions stay out of your history and search, and aren't used to train Claude. Learn more"*.
- **Style & Deviations:** Implemented via `isTemporary && 'border-dashed border-2 border-border-medium/80 bg-surface-primary/60'` in `ChatForm.tsx`.

---

## Status and Verification Summary

All high-priority items identified from the 76 screenshots have been resolved and verified:
1. **Unified Composer:** Segmented Chat/Cowork switch removed; single input for all interactions.
2. **Permission Mode Popover:** Built in `PermissionModePopover.tsx` with Auto/Manual descriptions matching `16.53.59.png` word for word.
3. **Floating Metric Pill Bar:** Styled as distinct floating rounded pills above the composer box matching `16.53.25.png`.
4. **Incognito Session:** Dashed border styling matching `17.09.36.png` applied during temporary chats.
5. **Background Task Indicators:** Clock icon with blue dot (`⏱ •`) active on sidebar conversations driven by real `/api/cowork/tasks` queries.
6. **Live Agent Plans Panel:** Built in `PlansPanel.tsx` with MRP loop checklist extraction from real streaming output.
7. **Time and Focus Settings:** Built in `TimeAndFocusTab.tsx` with break reminders and 7-day quiet hours matching `17.00.40.png`.
8. **Record a Skill Modal:** Built in `RecordSkillModal.tsx` matching `17.06.07.png`.
