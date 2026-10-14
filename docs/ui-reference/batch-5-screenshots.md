# Batch 5 — Screenshot Catalog ("Cowork and chat are now one Claude" Update)

Source folder: `docs/ui-reference/` (`Skärmavbild 2026-10-14 kl. 16.53.25.png` through `17.09.36.png`, 76 files).
This batch documents the live Claude application following Anthropic's major unification update:
**"Cowork and chat are now one Claude"**.

All screenshots were captured on macOS in Google Chrome (light mode) on 2026-10-14.

---

## 1. Core Architectural & Paradigm Shifts in Batch 5

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

## 2. Screenshot-by-Screenshot Inventory

### Group A: Composer Landing Page & Floating Pill Bar
- `Skärmavbild 2026-10-14 kl. 16.53.25.png`:
  - Full landing page in light mode.
  - Left rail: Claude wordmark, chat bubble/code toggle pill, search, `+ New`, nav items (`Projects`, `Artifacts`, `Scheduled •`, `Design`, `Customize`, `> More`, `Superpower for Claude`), Pinned project `tjabo.site`, Today chat list with `Eftermiddag hej 15:01` showing the active clock badge `⏱ •`.
  - Center: Terracotta starburst + `"Good afternoon, Tjabo"` in Anthropic Serif font.
  - Floating pill bar above composer: `⌵ 0 words / 0 chars`, `✦ Optimize`, `⏱ 47m`, and chevron container.
  - Composer input with `+` attach button on bottom-left, `🎤` mic and `|||| ⌵` voice buttons on bottom-right.
  - Sub-bar: `Project ⌵` left, `Opus 5.5 Extra` and `Auto` right. No Chat/Cowork segmented switch.
- `Skärmavbild 2026-10-14 kl. 16.53.42.png`:
  - Detail of the Word count popover triggered by clicking `0 words / 0 chars`.
  - Popover lists: Characters (with spaces), Characters (no spaces), Words, Sentences, Lines, Paragraphs, Tokens (est.).
- `Skärmavbild 2026-10-14 kl. 16.53.59.png`:
  - Detail of the **Permission mode** popover triggered by clicking `Auto`.
  - Header: `Permission mode`.
  - Option 1: `Manual` — "Claude asks before using new tools or opening new sites."
  - Option 2: `Auto` (selected with checkmark `✓`) — "Claude runs on its own and pauses to ask if anything looks unsafe."
- `Skärmavbild 2026-10-14 kl. 16.55.09.png`:
  - Landing page with placeholder `"Type / for skills"`.
  - Shows left sidebar history with multiple background task items marked with `⏱ •`.
- `Skärmavbild 2026-10-14 kl. 17.05.18.png`, `17.06.36.png`, `17.07.50.png`, `17.09.33.png`:
  - Variations of landing view under active usage and incognito toggle.
- `Skärmavbild 2026-10-14 kl. 17.09.36.png`:
  - **Incognito Session**:
  - Header badge: `👻 Incognito`.
  - Heading: terracotta starburst + `You're incognito`.
  - Banner: `ⓘ You've used 90% of your session limit` [Get more usage] [X].
  - Composer box has a dashed border (`border-dashed`).
  - Footnote: *"Incognito sessions stay out of your history and search, and aren't used to train Claude. Learn more"*.

### Group B: Attach Menu & "Record a Skill" Modal
- `Skärmavbild 2026-10-14 kl. 17.06.00.png`:
  - Floating `+` attach popover:
    - `📎 Add files or photos` (shortcut ⌘U)
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
- `Skärmavbild 2026-10-14 kl. 17.06.07.png`:
  - **Record a skill** modal:
  - Header: `📹 Record a skill` with X close button.
  - Subtitle: *"Your screen, clicks, typing, and voice are recorded, then sent to Claude and turned into a repeatable skill."*
  - Warning box: *"🔒 Don't type passwords or secrets, or display sensitive information or private conversations while recording."*
  - Footer buttons: `Cancel` (ghost), `Start recording` (solid black), `🎤 ⌵` mic selector pill.

### Group C: Customize — Skills, Connectors, Plugins
- `Skärmavbild 2026-10-14 kl. 16.54.40.png`:
  - `claude.ai/customize/skills` page.
  - Sub-navigation pills: `Skills` (active), `Connectors`, `Plugins`.
  - Filter pills: `Yours`, `Discover` (active).
  - Search input, filter button, sorting button, `+ Add ⌵` dropdown button.
  - Hero card: "From Anthropic — Data: Query, chart and explain your data — SQL, spreadsheets and dashboards in one place" [Add].
  - "For you" grid cards: Plugin Management, Design, Marketing, Finance, Postiz, Product Management.
- `Skärmavbild 2026-10-14 kl. 17.01.15.png` - `17.01.31.png`, `17.08.56.png` - `17.09.26.png`:
  - Detailed drill-down into `Yours` vs `Discover` tabs for Skills, Connectors, and Plugins.
  - Connector table: Connector, Type (Web/Desktop/Custom/Included), Status.
  - Plugin creation drawer / modal (`Create a plugin`, `deal-desk-helper`, v1.draft).

### Group D: Claude Design & Cowork Projects
- `Skärmavbild 2026-10-14 kl. 16.55.40.png`:
  - `claude.ai/design` with deprecation banner redirecting to Artifacts pipeline.
  - Templates grid: Blank, Mobile app design, Slides, Document, Wireframe, Animation, UI mockups, Résumé, 3D object, Research, HTML email, Color + type pairing.
- `Skärmavbild 2026-10-14 kl. 17.06.53.png`:
  - Main app Design view: *"Claude Design lives here now: New Slides and Design projects are created as artifacts."*
  - Creation cards: `Slides New`, `Design New`, `Design in codebase`, `Design System`.
- `Skärmavbild 2026-10-14 kl. 16.56.02.png`, `17.06.42.png`:
  - Projects view (`claude.ai/cowork/projects`):
  - Filter popover (Status: Active, Last activity: All, Group by: Date, Sort by: Last activity).
  - "Create a project" modal: "What are you working on?", "What are you trying to achieve?", "Context (optional)".

### Group E: Claude Code Sessions & Pull Requests
- `Skärmavbild 2026-10-14 kl. 16.56.18.png` - `16.56.42.png`:
  - Claude Code dedicated interface (`claude.ai/code`).
  - Top toggle switches between Chat and Code views.
  - Sessions section with statuses: `Needs input` (orange dot), `Ready for review` (blue dot).
  - Pull requests section: `Merge conflicts` (orange dot), `Ready for review` (blue dot).
  - Bottom workspace selector: `[☁️ Default] [</> -nskelista] [⑂ main] [+]`.

### Group F: Settings Dialog Tabs
- `Skärmavbild 2026-10-14 kl. 16.57.30.png`, `16.57.36.png`, `17.07.57.png`:
  - **General Settings**:
    - Appearance: Theme (System/Light/Dark), Chat font (`Anthropic Serif ⌵`), Transcript text size (`Small` / `Medium` / `Large`), Transcript width (`Narrow` / `Medium` / `Wide`).
    - Motion: `System` / `Reduced`.
    - Tasks: `Preferred browser` dropdown (`Built-in browser ⌵`).
    - Voice: Language, Style, Speed.
    - Notifications: Response completions, Scheduled tasks, Code notifications, Code permission requests, Emails from cloud sessions, Dispatch messages, Mentions and replies, Comments on artifacts, Artifacts shared with you.
- `Skärmavbild 2026-10-14 kl. 16.57.40.png` - `16.57.51.png`:
  - **Account & Privacy**: Profile details, session management, data privacy controls.
- `Skärmavbild 2026-10-14 kl. 16.58.12.png`:
  - **Capabilities**:
    - General: Tool access mode, Connector search, Switch models when message is flagged.
    - Visuals: Artifacts, AI-powered artifacts, Inline visualizations.
    - Code execution: Cloud code execution and file creation.
- `Skärmavbild 2026-10-14 kl. 16.58.29.png`:
  - **Memory**: Personal memories list, Projects section, and `"My dog's name is Beans"` bottom add input with `↑` submit.
- `Skärmavbild 2026-10-14 kl. 16.58.36.png`:
  - **Design Systems**: Upload brand files, pull from design connectors, or use Claude Code tokens.
- `Skärmavbild 2026-10-14 kl. 16.58.49.png`:
  - **Reflect**: Retrospective summary generated from conversations with time horizon dropdown (`Past month`, `Past 3 months`, `Past 6 months`, `Past year`).
- `Skärmavbild 2026-10-14 kl. 17.00.40.png`:
  - **Time and Focus**:
    - `Break reminders`: "Get a nudge to take a break from Claude. You can snooze or adjust anytime." (Dropdowns: `- ⌵`, `- ⌵`).
    - `Quiet hours`: "Set time limits for Claude. You can dismiss or adjust anytime." Day pill toggles: `S`, `M`, `T`, `W`, `T`, `F`, `S`.
- `Skärmavbild 2026-10-14 kl. 17.08.06.png` - `17.08.33.png`:
  - **This computer (Desktop App)**:
    - `System` tab: Browser use (Connected browsers, Open links in built-in browser, Allowed sites) and Computer use Beta (Enable computer use, Unhide apps when Claude finishes, How Claude uses apps: Background vs Full control, Denied apps).
    - `Developer` tab: Local MCP servers (No servers added, `Edit config`, `Developer docs ↗`, `Go to Claude Platform ↗`).

### Group G: In-Chat Execution, Slash Commands, and Plans
- `Skärmavbild 2026-10-14 kl. 17.07.04.png`:
  - Live session header: `Interaktiv önskelista hemsida ⌵` with repository branch pill `[-nskelista main  +284 -24  Create PR ⌵  ✕]`.
  - Active execution output showing structured plan progress:
    - `"Gjort och testat lokalt:"` bulleted list with detailed test confirmations.
    - `"Kvar att göra:"` numbered checklist of pending items.
  - Session status banner: `✓ Wrapped up past your usage limit | Resets at 5:40 PM | Learn more | [Get more usage] [✕]`.
  - Unified composer below: placeholder `"Type / for commands"`, `+`, `🎤`, `⌵`, `Auto` permission indicator, `Sonnet 5.5 Extra ○`.
- `Skärmavbild 2026-10-14 kl. 17.07.12.png`:
  - Slash command menu triggered by `/`:
    - `/schedule`: "Create a routine that can be run on demand or automatically on an interval."
    - `/btw`
    - `/ultrareview`
    - `/rewind`
    - `/fork`
    - `/mcp`
    - `/plugin`
    - `/feedback`
    - `/model`
    - `/effort`
    - `/fast`
    - `/plan`
    - `/permissions`
    - `/skills`
    - `/output-style`
    - `/rename`
- `Skärmavbild 2026-10-14 kl. 17.07.20.png`:
  - Context window and usage popover triggered from composer:
    - Context window gauge: `762.6k / 1M (76%) >`
    - `200k until auto-compact` [Compact session]
    - Plan usage limits Pro: Session limit (100%), Weekly all models (14%)
    - [See detailed breakdown]
