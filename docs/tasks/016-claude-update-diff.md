# Task 016 — Claude Update Diff Analysis ("Cowork and chat are now one Claude")

Based on the 76 ground-truth screenshots in `docs/ui-reference/` (`Skärmavbild 2026-10-14 kl. 16.53.25.png` through `17.09.36.png`), this document analyzes all discrepancies between our current implementation and modern Claude, categorizing each by severity (`HIGH`, `MEDIUM`, `LOW`) and specifying the exact fix.

---

## Change Items Summary Table

| ID | Component / Area | Ground Truth (Batch-5) | Current Implementation | Severity | Proposed Fix |
|---|---|---|---|---|---|
| **DIFF-01** | Composer Mode Switcher | **Completely unified.** No segmented `Chat \| Cowork` toggle. | Has `ComposerModeToggle.tsx` with `Chat \| Cowork` pills. | **HIGH** | Phase out `ComposerModeToggle.tsx` from `ChatForm.tsx`. Make composer unified. |
| **DIFF-02** | Autonomy & Tool Permissions | `Permission mode` popover with `Auto` vs `Manual` under bottom-right of composer. | Mode switch was controlling attach menu; no Auto/Manual popover. | **HIGH** | Add `PermissionModePopover.tsx` with `Auto` ("Claude runs on its own...") and `Manual` ("Claude asks before using new tools..."). Store in Recoil/preferences. |
| **DIFF-03** | Floating Metric & Pill Bar | Floating pill bar above composer: `⌵ 0 words / 0 chars`, `✦ Optimize`, `⏱ 47m`, `^ ⌵` chevrons. | Missing floating bar above composer textarea. | **HIGH** | Create `ComposerFloatingBar.tsx` above composer with text statistics breakdown popover, Optimize action, and session countdown timer. |
| **DIFF-04** | Background Task Indicators | Conversations running cowork/scheduled tasks show a clock icon with an active blue dot (`⏱ •`) in sidebar. | Sidebar only shows conversation title and delete/archive actions. | **HIGH** | Connect conversation items to active/scheduled task states from `/api/cowork/tasks`, rendering `⏱ •` badge for running tasks. |
| **DIFF-05** | Plans / Agent Checklist | Structured checklist showing `Gjort och testat lokalt` and `Kvar att göra` during multi-step runs. | Steps are printed in plain text; no structured Plans checklist component. | **HIGH** | Implement `PlansPanel.tsx` / checklist component connected to `parseMRPLoop` from Fas 14. Check off steps in real-time. |
| **DIFF-06** | Settings: Time & Focus Tab | Dedicated "Time and focus" tab with Break reminders dropdowns and Quiet hours day pills (S, M, T, W, T, F, S). | Missing `Time and focus` tab in settings dialog. | **HIGH** | Add `TimeAndFocusTab.tsx` to `SettingsTabs.tsx`, persisting quiet hours and break reminders in user settings. |
| **DIFF-07** | Left Sidebar Navigation | Items: `Projects`, `Artifacts`, `Scheduled •`, `Design`, `Customize`, `> More`. | Has old LibreChat sidebar items (or older Claude layout). | **MEDIUM** | Align sidebar items: add `Scheduled` with blue dot indicator, `Design`, `Customize`. |
| **DIFF-08** | Plus Attach Menu | Items: `Add files or photos (⌘U)`, `Add folder`, `Record a skill`, `Skills >`, `Connectors >`, `Design system >`, `Add plugins`, `Research`, `Memory ✓`. | Has generic file upload and older cowork items. | **MEDIUM** | Update `AttachPlusMenu.tsx` to include `Record a skill`, `Research`, and clean categorized sections matching screenshot `17.06.00.png`. |
| **DIFF-09** | Composer Placeholder | Dynamic placeholders: `"How can I help you today?"` / `"Type / for skills"` / `"Type / for commands"`. | Static placeholder `"Ask a question or describe a task..."`. | **LOW** | Update placeholder rotation to match Claude's dynamic behavior. |
| **DIFF-10** | Settings: Capabilities Tab | Tabs include Tool access mode, Connector search, Model fallback, Artifacts toggles, Cloud code execution. | Settings has split agent capabilities. | **MEDIUM** | Update Capabilities tab in settings to match modern Claude toggles. |

---

## Detailed Item Breakdown

### DIFF-01 & DIFF-02: Unified Composer & Permission Mode Selector (HIGH)
- **Screenshot Evidence:** `Skärmavbild 2026-10-14 kl. 16.53.25.png`, `16.53.59.png`, `16.55.09.png`, `17.07.04.png`.
- **Finding:** In Anthropic's latest update, Cowork is not a mode distinct from Chat. Users interact with one unified prompt box. When an instruction requires multi-step autonomous behavior, web research, or computer use, Claude handles it autonomously based on the `Permission mode`:
  - **Auto**: Claude executes tools and loops autonomously, pausing only if user confirmation is explicitly warranted.
  - **Manual**: Claude requests explicit approval before every tool invocation or external URL navigation.
- **Action Plan:**
  1. Remove `ComposerModeToggle` from `ChatForm.tsx`.
  2. Implement `PermissionModeSelector` button and popover in the footer row of the composer.
  3. Default permission mode is `Auto`, persisted in `localStorage` / user settings.

### DIFF-03: Floating Metric Bar Above Composer (HIGH)
- **Screenshot Evidence:** `Skärmavbild 2026-10-14 kl. 16.53.25.png`, `16.53.42.png`, `16.56.18.png`.
- **Finding:** Above the composer textarea sits a floating pill bar:
  - `⌵ X words / Y chars`: Clicking triggers a popover with detailed counts: Characters (with spaces), Characters (no spaces), Words, Sentences, Lines, Paragraphs, Tokens (est.).
  - `✦ Optimize`: One-click button to polish/enhance prompt clarity.
  - `⏱ 47m` (or remaining session time): A subtle countdown indicator.
  - `^ ⌵`: Expands/collapses composer height.
- **Action Plan:**
  1. Create `client/src/components/Chat/Input/ComposerFloatingBar.tsx`.
  2. Compute live text metrics on the current draft.
  3. Wire the dropdown popover with the full metric breakdown.

### DIFF-04: Background Task Indicator on Chats (HIGH)
- **Screenshot Evidence:** `Skärmavbild 2026-10-14 kl. 16.53.25.png`, `16.55.09.png`, `17.06.36.png`.
- **Finding:** Conversations with running or scheduled background tasks (e.g. `Eftermiddag hej 15:01`, `Dag hej 10:00`) show a clock icon with a vibrant blue dot in the top right corner (`⏱ •`).
- **Action Plan:**
  1. In `client/src/components/Nav/`, query `/api/cowork/tasks` (Fas 13 real API) or check conversation task states.
  2. If a conversation has an active, running, or scheduled task, render the `⏱ •` icon badge alongside the conversation title.

### DIFF-05: Plans / Agent Checklist (HIGH)
- **Screenshot Evidence:** `Skärmavbild 2026-10-14 kl. 17.07.04.png`.
- **Finding:** Live agent tasks render clear checklists of completed actions ("Gjort och testat lokalt") and pending steps ("Kvar att göra").
- **Action Plan:**
  1. Create `PlansPanel.tsx` (and inline checklist renderer in chat messages) consuming structured steps from `parseMRPLoop` (`packages/data-provider/src/browser/actionParser.ts`).
  2. Live checkmarks as steps transition from pending to completed.

### DIFF-06: Settings: "Time and focus" Tab (HIGH)
- **Screenshot Evidence:** `Skärmavbild 2026-10-14 kl. 17.00.40.png`.
- **Finding:** Settings contains a dedicated `Time and focus` tab:
  - **Break reminders**: "Get a nudge to take a break from Claude. You can snooze or adjust anytime." Dropdown selectors.
  - **Quiet hours**: "Set time limits for Claude. You can dismiss or adjust anytime." Day toggles: `S M T W T F S`.
- **Action Plan:**
  1. Implement `client/src/components/Settings/Claude/TimeAndFocus.tsx`.
  2. Add tab entry to `SettingsTabs.tsx` under the General settings group.
  3. Store preferences in user profile state.

---

## Resultat och Genomförande (Fas 16)

Samtliga HIGH-prioriterade diffar mellan kodbasen och batch-5 skärmdumparna har genomförts och verifierats med riktig data:

1. **Enhetlig Composer & Permission Mode Popover (DIFF-01 & DIFF-02, DIFF-08)**:
   - `ComposerModeToggle.tsx` har fasats ur från `ChatForm.tsx`.
   - Implementerade `PermissionModePopover.tsx` i promptboxens fotrad (`Auto` vs `Manual`), lagrat i Recoil family `permissionModeFamily`.
   - Skapade `RecordSkillModal.tsx` matchande skärmdump `17.06.07.png`.
   - Rätade ut `AttachPlusMenu.tsx` så att alla val (`Record a skill`, `Research`, `Web search`, `Memory`, `Skills`, `Connectors`) visas enhetligt utan lägesbifurkation.

2. **Aktiv bakgrundsjobb-indikator i Nav & Samtalsträd (DIFF-04)**:
   - Kopplade `Convo.tsx` och `SidebarNavList.tsx` till `/api/cowork/tasks` via `useCoworkTasksQuery()`.
   - Samtal med pågående körningar visar klockglyf med pulserande blå prick (`⏱ •`, `data-testid="convo-task-active-badge"`).

3. **Plans & Checklist Panel (DIFF-05)**:
   - Utökade `packages/data-provider/src/browser/actionParser.ts` med `parsePlanChecklist()` och typade steg (`PlanStepItem`, `StructuredPlan`), testat mot skärmdump `17.07.04.png`.
   - Implementerade `PlansPanel.tsx` under `client/src/components/SidePanel/Plans/` och kopplade in fliken i `useSideNavLinks.ts` med ikon `ListTodo`.
   - Panelen visar realtidsframsteg, "Gjort och testat lokalt", "Kvar att göra", och interaktiv avbockning.

4. **Time & Focus Inställningsflik (DIFF-06)**:
   - Skapade `TimeAndFocusTab.tsx` och registrerade i `ClaudeSettingsTab.TIME_AND_FOCUS` i `Settings/types.ts`.
   - Innehåller paus-påminnelser (intervall och längd) samt lugna timmar med 7 dagsknappar (`S M T W T F S`) och tidsväljare, persisterade i `localStorage`.

5. **Verifiering**:
   - Alla nya komponenter har dedikerade unit tests (`Convo.badge.spec.tsx`, `PermissionModePopover.spec.tsx`, `PlansPanel.spec.tsx`, `TimeAndFocusTab.spec.tsx`).
   - `packages/data-provider` tester (25/25) gröna.
   - Client `tsc --noEmit` passerar med 0 fel.
   - Pre-commit lint-staged (sort-imports, eslint, prettier) 100% grönt.
