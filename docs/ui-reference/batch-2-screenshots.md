# Batch 2 Screenshot Catalog (files 21–40)

Source folder: `Claude Screenshots/`. Batch covers the 20 files at sorted positions 21–40:
`Skärmavbild 2026-09-18 kl. 20.14.46.png` through `Skärmavbild 2026-09-18 kl. 20.18.13.png`.

Privacy note: personal chat content, names, recipes, project descriptions, IDs, device/session
details and similar substance visible in these screenshots have been deliberately omitted below.
Only fixed UI chrome (layout, labels, controls, styling) is catalogued.

---

## Project detail page (tjabo.site) — Overview / Recents

- Source files: `20.14.46`, `20.15.43`
- **View**: The detail page for a single Project, reached via `Projects / <project name>` breadcrumb. Shows project description, a project-scoped chat composer, and a "Recents" list of chats belonging to the project.
- **Text (exact)**:
  - Top breadcrumb: "Projects" (link) / project name
  - Top-right icons area: pin icon, "⋮" overflow menu
  - Notice bar: "Usage limit reached · Resets 9:00 PM · limits shared with Claude Code" (the "limits shared with Claude Code" portion is a link) with a black pill button "Get more usage" on the right
  - Composer placeholder: "Type / for skills" (20.14.46) or "How can I help you today?" (20.15.43)
  - Composer controls: "+" icon, "Chat" / "Cowork" segmented pill toggle (Chat active), right-aligned "Sonnet 5" and effort label (e.g. "High"), mic icon, waveform icon, chevron
  - Section header: "Recents"
  - List rows show a chat title on the left and a relative timestamp on the right (e.g. "2 hours ago", "2 days ago", "Sep 10")
  - Right sidebar panel headers: "Instructions" (with pencil/edit icon), "Memory" (with "Only you" pill and "View memory" link, plus body copy about migrating to a new memory system and an "export this project's legacy memory" link), "Context" (with search icon and "+" icon, a horizontal usage bar, "X% of project capacity used" caption, and a "Search mode" toggle/label with a dot), a file chip beneath Context showing a filename, file size, and a file-type tag (e.g. "MD"), "Folder" (with "Only you" pill and "+" icon, body copy "Add a folder on this computer for Claude to work in."), "Scheduled" (with "+" icon, body copy "Set up recurring tasks for this project.")
- **Layout**:
  - Left sidebar (top to bottom): sidebar-collapse icon, back/forward chevrons, a pill-shaped segmented control with two icons (chat-bubbles icon / code `</>` icon — code icon selected/highlighted white), "New" (with a "+"), "Projects", "Artifacts", "Scheduled", "Design", "Customize", "More" (collapsible chevron), a "Scheduled" entry with a `>` chevron, a "Pinned" section header with the current project listed (and, when expanded, sub-items indented beneath it), a "Chats and tasks" section with search and sort/filter icons and a scrollable list of chat titles, and a footer account row (workspace avatar initials, workspace name, plan tier e.g. "Pro", plus a download icon)
  - Center column: project title (large serif heading) at top, description paragraph beneath with a "…" expand affordance, then the usage-limit notice bar, then the composer, then "Recents" list
  - Right column: a fixed-width panel of stacked cards/sections as described above
- **Style**: Light mode. Warm off-white/cream page background. Project title rendered in a serif display typeface; body copy and UI labels in sans-serif. Buttons: solid black pill ("Get more usage"), light-gray pill toggles (Chat/Cowork). Row dividers are thin hairlines. Right-panel section labels are small-caps-weight sans-serif with generous vertical spacing between cards.
- **Interactive/state notes**: In `20.15.43`, the "Pinned" sidebar label shows a focus/selection outline and a dropdown chevron, the "Chats and tasks" list is fully expanded showing many more chat titles than in `20.14.46`, and one row ("Oracle 5") shows a hover state with a "⋮" kebab menu revealed at the row's right edge.

---

## Set project instructions — modal

- Source file: `20.14.59`
- **View**: A modal dialog for editing a project's custom instructions, opened from the project detail page's "Instructions" panel edit icon.
- **Text (exact)**:
  - Title: "Set project instructions"
  - Subtext: "Provide Claude with relevant instructions and information for chats within [project]. This will work alongside your profile instructions and the selected style in a chat." — "profile instructions" is a hyperlink.
  - Buttons: "Cancel" (outline/secondary), "Save instructions" (dark primary button, shown in a muted/disabled-looking state)
- **Layout**: Centered modal, dimmed/blurred backdrop showing the project page behind it. Title top-left, subtext below, a large multi-line textarea filling most of the modal body, action buttons bottom-right (Cancel then Save, Save on the far right).
- **Style**: Light mode. White modal surface, rounded corners, soft drop shadow. Bold sans-serif title, regular-weight subtext with an underlined link. Textarea has a thin border.

---

## Claude Code desktop app — dashboard with Effort selector open

- Source file: `20.15.17`
- **View**: This is a different application surface from claude.ai — the Claude Code desktop app's home/dashboard ("What's up next, <name>?"), showing usage stats and a floating "Effort" selector popover over the composer.
- **Text (exact)**:
  - Top-right link: "What's new"
  - Greeting heading (with a sun/orange emoji icon prefix): "What's up next, [name]?"
  - Card tabs: "Overview" / "Models" (Overview active); time-range toggle "All / 30d / 7d" (All active)
  - Stat tiles: "Sessions", "Messages", "Total tokens", "Active days", "Peak hour", "Favorite model" (each with a numeric/text value beneath the label)
  - Caption under the activity grid: "You've used ~9× more tokens than [comparison]."
  - Bottom toolbar pills: a "Local" pill (folder icon), a repo-name pill (folder/repo icon), a "main" branch pill (branch icon) plus a "worktree" checkbox, and a "+" icon
  - Notice: "Session limit reached · Turn on usage credits to keep working · Resets in 44 min" (with a clock icon)
  - Composer placeholder: "Describe a task or ask a question"
  - Composer controls: "+" icon, mic icon, chevron, "Auto" dropdown, right-aligned model label "Sonnet 5", effort label "Medium", and a circular icon
  - Floating popover: "Effort" label with a value (e.g. "Ultracode") and a "?" help icon; a slider labeled "Faster" on the left and "Smarter" on the right, rendered as a gradient dot-track
- **Layout**: Left sidebar (top to bottom): collapse icon, "New" (+), "Artifacts", "Customize", "More" (collapsible), a "Scheduled" entry, then user-named project/workspace groups each with their own chat/task items, then an "Önskelista"-style custom group, then a "No folder" group; footer account row at bottom-left. Main content is a single centered column: greeting heading, a card containing the stat-tile grid and a GitHub-style activity/contribution grid of small squares beneath it, then a large empty area, then the bottom toolbar/composer bar pinned near the bottom of the window, with the Effort popover anchored above the composer's right side.
- **Style**: Light mode, warm cream background. Stat tiles use light-gray rounded rectangle backgrounds arranged in a 3-column grid. The activity grid uses mostly empty/gray squares with a couple of highlighted blue squares. The Effort popover uses a purple gradient dot-track for its slider, contrasting with the orange/terracotta accent seen elsewhere. Warning/alert icon appears next to at least one sidebar item.

---

## Chats and tasks — full list with type filter open

- Source file: `20.15.52`
- **View**: The full "Chats and tasks" list page (not the sidebar's truncated list), with a filter dropdown open over the "sliders" icon.
- **Text (exact)**:
  - Page heading: "Chats and tasks" (large serif heading)
  - Top-right controls: search (magnifying glass) icon, filter/sliders icon, "Select" button (outline), "New" button (solid black)
  - Open dropdown menu items: "All" (checked, with a checkmark), "Chat", "Shared", "Cowork", "Archived"
  - List rows: chat/task title on the left, relative date on the right (e.g. "2 hours ago", "9 hours ago", "21 hours ago", "Yesterday", "2 days ago", "3 days ago", "5 days ago", "Sep 11")
- **Layout**: Left sidebar collapsed to a simpler state (New, Customize, More, Scheduled, Pinned with the project, then the same "Chats and tasks" list, footer account row). Main content: heading and toolbar at top, then a single-column list of rows separated by hairline dividers, each row title left-aligned and timestamp right-aligned. The filter dropdown opens directly beneath the sliders icon, right-aligned, as a small white rounded card.
- **Style**: Light mode, cream background. Heading in serif display type; row titles and dropdown items in sans-serif. Dropdown item "All" shows a blue checkmark. "New" button is solid black/dark pill; "Select" is an outline pill.

---

## Chats and tasks — account/profile menu open

- Source file: `20.16.30`
- **View**: Same "Chats and tasks" list page as above, but with the bottom-left account avatar menu open instead of the filter dropdown.
- **Text (exact)**:
  - Menu header: the account's email address (small, muted text)
  - Menu items (each with a leading icon): "Settings" (with a keyboard-shortcut hint icon on the right), "Usage", "Language", "Get help", "Give feedback", then a divider, "View all plans", "Get apps and extensions", "View changelog", "Learn more" (with a `>` chevron indicating a submenu), then a divider, "Log out"
  - "Language" row is shown in a highlighted/hovered state
- **Layout**: Menu is a vertical list anchored above the bottom-left account row, appearing as a rounded white card with a shadow, overlaying the lower portion of the sidebar's chat list.
- **Style**: Light mode. Icons are simple line icons at consistent size/spacing to the left of each label. Hover state shown as a light-gray row highlight.

---

## Settings dialog — Preferences tab

- Source files: `20.16.37`, `20.16.43`
- **View**: The global Settings modal, "Preferences" tab selected, showing Appearance, Voice, and Notifications sections (two screenshots show adjacent scroll positions of the same tab).
- **Text (exact)**:
  - Modal has a left-hand settings navigation list (see "Settings dialog navigation" note below) and a right-hand content pane.
  - Section header: "Appearance"
    - Row "Theme" with three icon options (monitor/system, sun/light, moon/dark)
    - Row "Chat font" with value "Anthropic Serif" and a chevron (dropdown)
    - Row "Motion" with description "Reduce animation in streaming responses and other interface elements." and a two-option segmented control "System" / "Reduced" (System active)
  - Section header: "Voice"
    - Row "Language" with value "English" and a dropdown chevron
    - Row "Style" with value "Rounded" and a dropdown chevron
    - Row "Speed" with value "Normal" and a dropdown chevron
  - Section header: "Notifications"
    - Row "Response completions" — "Get notified when Claude has finished a response. Useful for long-running tasks." (toggle ON)
    - Row "Scheduled tasks" — "Get notified when scheduled tasks finish, can't run, or need your input." (toggle ON)
    - Row "Code notifications" — "Claude can choose to notify you about important updates from a Code session." (toggle ON)
    - Row "Code permission requests" — "Get a push notification when Claude needs your approval to run a command in a Code session." (toggle ON)
    - Row "Emails from Claude Code cloud sessions" — "Get an email when a cloud session has finished building or needs your response." (toggle ON)
- **Layout**: Modal centered over a dimmed/blurred backdrop of the page behind it. Close "X" icon top-right of modal. Left nav column has a "Search" field with magnifying-glass icon at top, then grouped links under unlabeled/implicit "Settings" header, a "Desktop app" group, and a "Customize" group (see full item list below). Right content pane stacks section headers and setting rows, each row a label + description on the left and a control (toggle/segmented/dropdown) on the right, separated by hairline dividers.
- **Settings dialog navigation (consistent across all Settings screenshots in this batch)**: Left column top-to-bottom — search box; "Settings" group: "Preferences", "Account", "Privacy", "Billing", "Capabilities", "Memory", "Design systems", "Claude Code", "Cowork", "Claude in Chrome"; "Desktop app" group: "General", "Extensions", "Developer"; "Customize" group: "Skills", "Connectors", "Plugins". The active item has a gray rounded-rectangle highlight.
- **Style**: Light mode. White modal surface. Section headers bold sans-serif; row labels regular weight, descriptions in muted gray. Toggles are blue-filled pill switches when on, gray/outline when off. Segmented controls (System/Reduced) shown as a light-gray pill with the active option on a white inset background.

---

## Settings dialog — Account tab

- Source files: `20.17.06`, `20.17.11`, `20.17.13`
- **View**: Settings modal, "Account" tab, covering a Profile section and an Account/session-management section.
- **Text (exact)**:
  - Section header: "Profile"
    - Row "Avatar" with a circular initials avatar
    - Row "Full name" with a text input
    - Row "What should Claude call you?" with a text input
    - Row "What best describes your work?" with a dropdown (chevron)
    - Row "Instructions for Claude" with description "Claude will keep these in mind for this and any of your associated accounts across chats and Cowork within Anthropic's guidelines. Learn more." and a large multi-line text box beneath
  - Section header: "Account"
    - Row "Log out of all devices" with a "Log out" button
    - Row "To delete your account, please cancel your Claude Pro subscription first." with a grayed-out "Delete account" button
    - Row "Organization ID" with a monospace value field
  - Subsection header: "Trusted devices" — description "Devices that can control your local machine through remote sessions." — empty-state text "No trusted devices."
  - Subsection header: "Active sessions" — table with column headers "Device", "Location", "Created", "Updated"; the current session row carries a small "Current" badge/pill
- **Layout**: Same modal chrome/left-nav as the Preferences tab. Content pane scrolls through Profile → Account → Trusted devices → Active sessions (a data table). On hover, a session row reveals a "⋮" overflow icon at the row's right edge.
- **Style**: Light mode. Text inputs have thin gray borders and rounded corners. "Current" badge is a small blue/light pill. "Delete account" button rendered in a disabled/muted gray state versus the outline "Log out" button. Table rows separated by hairlines, header row in muted gray uppercase-style small text.
- **Interactive/state notes**: `20.17.13` shows a small floating rectangular thumbnail/preview overlay in the bottom-right corner of the screen (outside the modal) — appears to be a screen-recording/picture-in-picture artifact rather than app chrome, plus a small blue notification dot near the top-right of the screen.

---

## Settings dialog — Privacy tab

- Source files: `20.17.17`, `20.17.21`
- **View**: Settings modal, "Privacy" tab.
- **Text (exact)**:
  - Section header: "Privacy" — intro copy: "Anthropic believes in transparent data practices. Learn how your information is protected when using Anthropic products, and visit our Privacy Center and Privacy Policy for more details." ("Privacy Center" and "Privacy Policy" are links)
  - Expandable rows (each with a trailing `>` chevron): "How we protect your data", "How we use your data"
  - Section header: "Preferences"
    - Row "Location metadata" — "Allow Claude to use coarse location metadata (city/region) to improve product experiences. Learn more." (toggle ON)
    - Row "Help improve our AI models" — "Allow the use of your chats and coding sessions to train and improve Anthropic AI models. Learn more." (toggle OFF)
  - Section header: "Your data"
    - Row "Export data" with an "Export data" button
    - Row "Shared chats" with a "Manage" button
    - Row "Shared artifacts" with a "Manage" button
    - Row "Uploaded files" with a "Manage" button
    - Row "Your feedback" with a "Manage" button
    - Row "Memory preferences" with a "Manage" button that includes an external-link icon
- **Layout/Style**: Same modal chrome as other tabs. Toggle rows match the Preferences-tab toggle style (blue = on, gray = off). "Manage"/"Export data" are outline buttons right-aligned per row.

---

## Settings dialog — Capabilities tab

- Source files: `20.17.33`, `20.17.40`
- **View**: Settings modal, "Capabilities" tab, covering General, Visuals, and Code execution/file creation sections.
- **Text (exact)**:
  - Section header: "General"
    - Row "Tool access mode" — "Controls how connector tools are loaded in new conversations." — value "Tools already loaded" with a dropdown chevron
    - Row "Connector search" — "Let Claude search the connector directory and surface ones relevant to your conversation." (toggle ON)
    - Row "Switch models when a message is flagged" — "When safeguards flag a message, automatically switch to a different model to keep chatting. When off, your chat will pause instead." (toggle ON)
  - Section header: "Visuals"
    - Row "Artifacts" — "Generate code, documents, and designs in a dedicated window alongside your conversation." (toggle ON, shown in a lighter/muted blue than other toggles, possibly a partially-loaded state)
    - Row "AI-powered artifacts" — "Build apps and interactive documents that use Claude inside the artifact." (toggle ON)
    - Row "Inline visualizations" — "Allow Claude to generate interactive visualizations, charts, and diagrams directly in the conversation." (toggle ON)
  - Section header: "Code execution and file creation"
    - Row "Cloud code execution and file creation" — "Claude can execute code on a server and create and edit docs, spreadsheets, presentations, PDFs, and data reports. Required for skills." (toggle ON)
    - Row "Allow network egress" — "Give Claude network access to install packages and libraries in order to perform advanced data analysis, custom visualizations, and specialized file processing. Monitor chats closely as this comes with security risks." ("security risks" is a link) (toggle ON)
    - Nested card: "Domain allowlist" — "Choose which domains the sandbox can access" — value "All domains" with a dropdown chevron; an inline info banner below it with an "i" icon reading "Claude can access all domains on the internet."
  - Section header: "Skills" — body copy: "Skills have moved to Customize." ("Customize" is a link)
- **Layout/Style**: Same modal chrome. The "Domain allowlist" control sits inside a distinct light-gray rounded card nested within the "Allow network egress" row, itself containing a further nested light info banner — a two-level nesting pattern for dependent settings.

---

## Settings dialog — Memory tab (list view)

- Source files: `20.17.44`, `20.17.58`, `20.18.13`
- **View**: Settings modal, "Memory" tab, listing memory toggles plus a categorized, scrollable list of stored memory entries grouped under headers like "You", "Topics", "Projects" (with nested per-project sub-groups).
- **Text (exact)**:
  - Section header: "Memory"
    - Row "Search and reference chats" — "Allow Claude to search for relevant details in past chats. Learn more." (toggle ON)
    - Row "Generate memory from chats" — "Allow Claude to generate memory from your chats. Learn more." (toggle ON)
    - Row "Include sensitive topics in memory" — "Allow Claude to save details about sensitive topics like health conditions or religious beliefs to memory. Learn more." (toggle ON)
    - Row "Import memory from other AI providers" — "Bring relevant context and data from another AI provider to Claude. We'll provide a prompt you can use to fetch the memory from your other account. Learn more." with a "Start import" button
  - Group header: "You" — entries listed as rows with a bold label on the left, a one-line gray summary in the middle, and "Updated <date/relative time>" on the right (e.g. rows labeled "Preferences" and "Profile" in this batch)
  - Group header: "Topics" — same row pattern, several entries (topic names, one-line summaries, update dates)
  - Group header: "Projects" — nested, collapsible sub-groups (each with a `v`/expand chevron) representing individual projects; within an expanded project group, entries follow the same label/summary/date row pattern
  - Bottom of the tab: a persistent input field with placeholder text like "Tell Claude what to change or remove" / "Keep lists under five things" / "Don't ask about my former baseball career" (placeholder copy appears to rotate/vary), with a circular submit ("↑") button on the right
  - Row hover state reveals a pencil (edit) icon and a trash (delete) icon at the row's right edge
- **Layout/Style**: Same modal chrome as other tabs. The memory-entries list is a flat table-like list with generous row height, grouped by bold section headers, hairline dividers between rows, and collapsible chevrons for nested project groups. The always-visible bottom input bar is distinct from the rest of the settings UI — a rounded pill/box input pinned to the bottom of the content pane, functioning as a natural-language command box for editing memory.

---

## Settings dialog — Memory tab — "Import memory to Claude" modal

- Source file: `20.17.49`
- **View**: A secondary modal layered on top of the Settings modal's Memory tab, triggered by "Start import".
- **Text (exact)**:
  - Title: "Import memory to Claude" with a close "X" icon
  - Step "1": "Copy this prompt into a chat with your other AI provider" — a light-gray callout box containing prompt text, with a "Copy" button (clipboard icon) overlapping its bottom-right corner
  - Step "2": "Paste results below to add to Claude's memory" — a large textarea with placeholder "Paste your memory details here"
  - Buttons: "Cancel" (outline) and "Add to memory" (dark button, shown in a muted/disabled state)
- **Layout**: Centered modal-on-modal, dimmed backdrop over the already-dimmed Settings modal. Numbered steps (circular "1"/"2" badges) stacked vertically, each with a header line and its associated content block.
- **Style**: Light mode, white surface, rounded corners, drop shadow, consistent with the "Set project instructions" modal's visual treatment (bold title, numbered/stepped body, footer-right button pair).

---

## Settings dialog — Memory tab — individual memory entry detail

- Source file: `20.18.03`
- **View**: Drilled into a single memory entry from the Memory tab's list (reached by clicking a row), showing a detail view with a back navigation and delete action. This screenshot is largely dominated by the personal content of one memory entry, so only the surrounding chrome is noted.
- **Text (exact, chrome only)**:
  - Back breadcrumb: "← Memory" (back arrow + label, returns to the list view)
  - Entry title rendered as a bold heading, with a "Delete" button top-right
  - Field label "Last updated" followed by a date value
  - Field label "Summary" followed by a one-line description
  - Field label "Details" followed by a bulleted list of longer notes
  - Bottom input bar: same persistent "Tell Claude what to change or remove"-style command box with circular submit button as in the list view
- **Layout/Style**: Same modal chrome as the rest of Settings. Detail view uses a simple top-to-bottom stack of labeled fields (label in muted gray small text, value in regular/larger text beneath), no cards or borders separating fields — a plainer, document-like layout compared to the toggle-heavy rows elsewhere in Settings.

---

## Cross-cutting observations

- **Theming**: Every screenshot in this batch is light mode — warm cream/off-white page backgrounds (`Claude Copycat` main app) and pure white modal surfaces (Settings, dialogs). No dark-mode screenshots appeared in this batch.
- **Typography**: A serif display face ("Anthropic Serif", per the Preferences tab) is used for large page headings (project titles, "Chats and tasks", "What's up next, …") while all body copy, labels, buttons, and list rows use a sans-serif face.
- **Accent color**: The orange/terracotta accent seen in earlier batches is faint in this batch — the clearest instance is a sun/star emoji-style icon next to the Claude Code dashboard greeting. Most interactive affordances here instead use blue (toggles, checkmarks, links, focus rings, notification dots) and black (primary buttons).
- **Modal pattern**: All Settings-related screens share one modal shell: fixed-width left navigation list + scrollable right content pane, a top-right "X" close icon, and a dimmed/blurred backdrop of the page behind it. Secondary confirmation modals (project instructions, memory import) reuse the same white-card/rounded-corner/drop-shadow treatment with a title, body, and a right-aligned Cancel/primary button pair.
- **List row pattern**: Recurring across the app — a left-aligned primary label, optional muted secondary text, and a right-aligned timestamp or control, with hover revealing extra affordances (kebab menu, edit/delete icons) that are hidden at rest.
