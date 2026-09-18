# Task 007 — Chat-appen, P0 (pixelmatchning)

**Förutsättning:** Task 001–006 klara. Läs
[docs/ui-reference/PLAN.md](../ui-reference/PLAN.md) och motsvarande sektioner i
`docs/ui-reference/batch-1..4-screenshots.md` innan du börjar — de innehåller den
exakta UI-texten och layouten detta task ska matcha.

**Mål:** Sidopanel, landningssida, composer och Settings-skal matchar skärmdumparna
funktionellt och visuellt (samma nav-ordning, samma text, samma kontrollstruktur).

**Delmoment (kan göras i valfri ordning, men gör Sidopanel-nav och Settings-skal
först eftersom flera senare delmoment hänger på dem):**

1. **Sidopanel-nav** — ersätt dagens "Start new chat"-pillerknapp med rätt
   struktur: `+ New` (fetstil, pill vid val) → Projects → Artifacts → Scheduled
   → Design → Customize → More (kollapsbar). Under navlistan: "Scheduled >"-rad,
   "Pinned"-sektion, "Chats and tasks"-sektion (sök + filter-ikon). Se batch-1
   "Chat app — empty-state home" för exakt layout.

2. **Composer — Chat/Cowork-växlare.** Detta ersätter `CoworkButton.tsx` (som
   flaggades fel i Fas 4 — se ROADMAP.md). Segmentkontroll i composerns
   verktygsrad, "Chat" / "Cowork", vald variant får vit/ljus pill-bakgrund.
   Cowork-läget ändrar `+`-menyns innehåll (se batch-4 "Composer + attach menu
   (Cowork mode)") och visar senare (Fas 7) en uppgiftslista under composern.

3. **Composer — kvicktoggles** under composer-kortet: "Project or folder",
   "Auto", "Output" som platta textknappar. Varje öppnar en dropdown enligt
   batch-1 (Project/folder-picker, Auto-godkännandeläge, Output-format).

4. **Composer — `+`-meny** (Chat-läge): Add files or photos (⌘U), Take a
   screenshot, Add to project, divider, Skills, Connectors, Design system, Add
   plugins, divider, Research, Web search (checkmark=på), Memory
   (checkmark=på). Exakt ordning och ikoner enligt batch-4.

5. ~~**Modell/Effort/Thinking-väljare**~~ — **Klart, men med en medveten
   avvikelse.** Byggde `EffortSelector.tsx` som en fristående composer-knapp
   (Low/Medium/High "Default"/Extra/Max + Thinking-toggle) istället för att
   nästla den i den befintliga modellväljarens flyout. Modellväljaren
   (`ModelSelector.tsx`) är en komplex, generisk multi-endpoint-meny
   (`CustomMenu`/`ModelSelectorContext`) som redan listar alla riktiga
   OpenRouter-modeller korrekt (verifierat i Task 002) — att kirurgiskt
   nästla en Claude-specifik flyout där inne riskerade regressioner jag inte
   kan verifiera utan en körande app. Funktionellt likvärdigt
   (`conversation.reasoning_effort`, samma `ReasoningEffort`-enum), bara
   placerad som en egen knapp bredvid modellväljaren istället för inuti den.
   Visas bara på Agents-endpointen (vår OpenRouter-väg); ingen
   modell-per-modell-koll av vilka som faktiskt stödjer reasoning.

6. **Settings-skal** — modal med vänster-nav grupperad: "Settings" (Preferences,
   Account, Privacy, Billing, Capabilities, Memory, Design systems, Claude Code,
   Cowork, Claude in Chrome), "Desktop app" (General, Extensions, Developer),
   "Customize" (Skills, Connectors, Plugins). Bygg skalet så alla flikar (även
   tomma placeholder-flikar för sådant som kommer i Fas 7–8) kan hängas på det
   utan omarbete.

7. **Settings — Preferences-fliken**: Appearance (Theme/Chat font/Motion),
   Voice (Language/Style/Speed), Notifications (5 toggles, exakt text enligt
   batch-2).

8. **Settings — Account-fliken**: Profile-sektion, Instructions for Claude,
   Log out/Delete account, Trusted devices, Active sessions-tabell. Exakt text
   enligt batch-2.

**Rör inte:** Backend/API-lager — det här är rent frontend. Om ett UI-element
kräver ny backend-data som inte finns (t.ex. riktiga "Active sessions"), bygg
UI:t mot en rimlig platshållare/mock och notera det i resultat-avsnittet
istället för att bygga ny backend-infrastruktur som inte är beställd än.

**Klart när:** `npx tsc --noEmit` och `npm --prefix packages/client run test`
är gröna, och varje delmoment ovan är visuellt/funktionellt jämförbart med
motsvarande skärmdump.

## Resultat — +-menyn och Settings-skalet (Fas 6)

### Vad som har gjorts:
1. **Composer `+`-meny (`AttachPlusMenu.tsx`):**
   - Implementerad som en cirkulär `+`-knapp med tooltip och snabbkommandot `⌘U`.
   - **Chat-läge:** "Add files or photos" (`⌘U`), "Take a screenshot" (web API `getDisplayMedia`), "Add to project" (submenu), skiljelinje, "Skills" (submenu), "Connectors" (submenu), "Design system" (submenu), "Add plugins", skiljelinje, "Research", "Web search" (med checkmark kopplad till `BadgeRowContext.webSearch`), "Memory" (med checkmark kopplad till `BadgeRowContext.memory`).
   - **Cowork-läge:** "Add files or photos", "Take a screenshot", skiljelinje, "Skills", "Connectors", "Design system", "Add plugins", "Devices" (med "Run tasks on"-enhetslista), "Memory".
   - Full testtäckning i `AttachPlusMenu.spec.tsx` (6/6 tester gröna) och full regressionstestning mot `AttachFileChat.spec.tsx` (29/29 tester gröna).

2. **Settings-skal och grupperad navigering (`Sidebar.tsx`, `Content.tsx`, `Dialog.tsx`):**
   - Vänsternavigeringen är grupperad exakt enligt Claude-skärmdumparna (`batch-2-screenshots.md`):
     - **Settings:** Preferences, Account, Privacy, Billing & APIs, Capabilities, Memory, Design systems, Claude Code, Cowork, Claude in Chrome.
     - **Desktop app:** General, Extensions, Developer, About (villkorad på `aboutEnabled`).
     - **Customize:** Skills, Connectors, Plugins, Langfuse (villkorad på `langfuseConnectionAccess`).
   - Sökfältet överst med sökning mot `registry.tsx` och direkt rensningsknapp (`X` och `Escape`).
   - Bakåtkompatibel med sökindexering för legacy-tabbarna (Chat, Speech, Data) så sökning fungerar friktionsfritt utan att bryta `registry.spec.ts`.

3. **Settings — Flikar:**
   - **Preferences (`PreferencesTab.tsx`):** Appearance (System/Light/Dark med temaintegration mot `ThemeContext`, Anthropic Serif chat font-dropdown, System/Reduced motion-kontroll), Voice (Language, Style, Speed dropdowns), Notifications (exakt de 5 togglarna från Anthropics UI med `aria-label`).
   - **Account (`AccountTab.tsx`):** Profil (Avatar med initierad användare och ändra-knapp, Full name, "What should Claude call you?", arbetsbeskrivning-dropdown, "Instructions for Claude"-textarea), Account (Log out, inaktiverad Delete account, Organisation ID), Trusted devices (tom state-kort), Active sessions-datamodell med "Current"-badge.
   - **Privacy (`PrivacyTab.tsx`):** Introkopiering och expanderbara paneler ("How we protect your data", "How we use your data"), Location metadata-toggle, Help improve AI-toggle, Your data-knappar (Export data, Shared chats, Shared artifacts, Uploaded files, Your feedback, Memory preferences).
   - **Billing & APIs (`BillingApiTab.tsx`):** Anpassad för vår självhostade OpenRouter-gateway och DeepSeek direct API istället för Claude Pro: länk till `openrouter.ai/credits`, visning av token credits vid aktiverat saldo, statusindikatorer för aktiv primär OpenRouter-gateway och DeepSeek Direct-endpoint, informationsrutor för Extended Thinking (Effort-selector) och Stop-Token-skydd (`dropParams: ['stop']`), samt integrerad `ProviderKeys`-hanterare.
   - **Placeholder-skal (`PlaceholderTab.tsx`):** Modulärt skal för Capabilities, Memory, Design systems, Claude Code, Cowork, Chrome, Extensions, Developer, Skills, Connectors och Plugins inför Fas 7–9.

4. **Composer Top Bar & Quick-Toggles (`ComposerTopBar.tsx`, `WordCountPopover.tsx`, `UsageLimitPopover.tsx`, `ComposerQuickToggles.tsx`, `OutputFormatDropdown.tsx`, `ProjectPickerDropdown.tsx`, `AutoApprovalDropdown.tsx`):**
   - **Composer Top Bar:** Placerad överst i formulärkortet ovanför `TextareaHeader`. Innehåller `WordCountPopover` (visar levande `⌄ {words} words / {chars} chars` med utfällbar popover för Characters m/u mellanslag, Words, Sentences, Lines, Paragraphs och Tokens), `✦ Optimize`-promptförbättringsknapp, `UsageLimitPopover` (klockikon med dynamisk nedräkning t.ex. `34m` och popover för 5-timmars- och 7-dagarsanvändning/återställning), samt expandera/kollapsa-växlare.
   - **Composer Quick-Toggles:** Placerad direkt under composern:
     - **ProjectPickerDropdown:** "Project or folder"-väljare med projektsökning, Pinned-sektion, "+ New project" och "Add folder".
     - **AutoApprovalDropdown:** "Auto"-väljare motsvarande Anthropics godkännandemeny ("Automatically approve", "Manually approve", "Skip all approvals") kopplad till Recoil (`autoApprovalFamily`).
     - **OutputFormatDropdown:** "Output: Artifact" med val för Docs (Beta), Slides (Beta), Design (Beta) och skiljelinje till Artifact ("Let Claude pick the format") kopplad till Recoil (`outputFormatFamily`).
   - Tester: `WordCountPopover.spec.tsx` (3/3 gröna) och `ComposerQuickToggles.spec.tsx` (4/4 gröna).

### Verifiering och tester:
- `npm --prefix client run typecheck` (`tsc --noEmit`): 0 fel, exit code 0.
- `npm --prefix client run test:ci -- src/components/Nav/Settings/`: Samtliga 7 testsviter och 39 enhetstester gröna.
- `npm --prefix client run test:ci -- src/components/Chat/Input/Files/`: Samtliga 8 testsviter och 145 enhetstester gröna.
- `npm --prefix client run test:ci -- src/components/Chat/Input/__tests__/`: Samtliga enhetstester gröna (inklusive nya WordCountPopover och ComposerQuickToggles).
- Pre-commit hooks (`prettier`, `sort-imports`, `eslint --max-warnings=0`): Godkända utan varningar.
