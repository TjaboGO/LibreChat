# Task 012 — Systemintegration, Claude Code & Cowork Settings samt Polering (Fas 11)

**Förutsättning:** Task 001–011 klara. Läs `docs/ui-reference/batch-3-screenshots.md` (rad 34–135).

**Mål:** Slutföra systemintegrationen och alla kvarvarande inställningspaneler från skärmdumparna:
1. **Settings — Claude Code-fliken (`ClaudeCodeTab.tsx`):**
   - **General:** "Classify session states", "Switch models when a message is flagged".
   - **Code appearance:**
     - Två kolumner med temaväljare och live code-diff syntax preview (Light: Claude Light, One Light, Catppuccin Latte; Dark: Catppuccin Mocha, Claude Dark, One Dark Pro, Dracula).
     - "Code font" input ("e.g. JetBrains Mono").
     - "Interface font" segmenterad kontroll (Anthropic Sans, System, OpenDyslexic).
     - "Transcript text size" (Small, Medium, Large).
     - "Transcript width" (Narrow, Medium, Wide).
     - "Default transcript view" (Normal, Thinking, Verbose).
   - **Local sessions:**
     - "Allow bypass permissions mode" (toggle med varningsbeskrivning).
     - "Connect new sessions to Remote Control".
     - "Dynamic workflows".
     - "Keep computer awake while Claude works" (med underinställning "Keep awake on battery power").
     - "Archive inactive sessions" ("Never").
     - "Worktree location" ("Inside project").
     - "Local sandbox" (med "Strict sandbox mode").
   - **Browser & Mobile simulators:**
     - "Browser tools", "Open links in built-in browser", "Keep cookies" ("Until quit").
     - "iOS Simulator" toggle.
   - **Pull requests:**
     - "Branch prefix" ("claude"), "Create pull requests automatically", "Auto-fix pull requests", "Auto-archive after PR merge or close".
   - **Authorization tokens:**
     - Tabell över anslutna applikationer med scope-brickor (`user:file_upload`, `user:inference`, etc.) och paginering.
2. **Settings — Cowork-fliken (`CoworkTab.tsx`):**
   - "Require trusted devices".
   - "Cowork files" (sökväg och Change-knapp).
   - "Trusted Cowork folders" (Manage-knapp).
   - "Only on this computer".
   - "Preferred browser" ("Built-in browser").
   - "Open links in built-in browser".
   - "Allowed sites".
3. **Navigering & Inställningsregistrering:**
   - Registrera `ClaudeCodeTab` och `CoworkTab` i `types.ts` och `TABS`.
   - Se till att sidopanelens navlänkar leder direkt till `/code`, `/design`, `/chats`, `/artifacts`, `/scheduled` och `/c/new`.
4. **Enhetstester och verifiering:**
   - Enhetstester för `ClaudeCodeTab.spec.tsx` och `CoworkTab.spec.tsx`.
   - Full typkontroll och CI-testkörning.

## Resultat

- **Claude Code Settings-flik (`ClaudeCodeTab.tsx`):**
  - Fullständig implementering i exakt pixelmatchning mot `docs/ui-reference/batch-3-screenshots.md` (rad 34–119).
  - General: Classify session states & Switch models when flagged togglar.
  - Code appearance: Två kolumner med Light/Dark-temaväljare och live TypeScript syntax diff previews, Code font-textfält, Interface font-segmenterad väljare med Font licenses-hyperlänk, Transcript text size (Small, Medium, Large), Transcript width (Narrow, Medium, Wide) samt Default transcript view (Normal, Thinking, Verbose).
  - Local sessions: Allow bypass permissions mode (med säkerhetsvarning och extern länk), Connect new sessions to Remote Control, Dynamic workflows, Draw attention on notifications, Keep computer awake while Claude works (med indenterad Keep awake on battery power), Archive inactive sessions, Worktree location, Switch models when flagged, Output style samt Local sandbox (med indenterad Strict sandbox mode).
  - Browser & Mobile simulators: Browser tools, Open links in built-in browser, Keep cookies ("Until quit"), Allowed sites modal samt iOS Simulator-toggle.
  - Pull requests: Branch prefix, Create pull requests automatically, Auto-fix pull requests och Auto-archive after PR merge or close.
  - Authorization tokens: Tabell över anslutna Claude Code-applikationer och scopes (`user:file_upload`, `user:inference`, etc.), paginering med fram-/bakåtbläddring samt Revoke-funktionalitet; Claude Code (CLI, Desktop, IDE) modal för Delete server-side sessions och Sharing settings.

- **Cowork Settings-flik (`CoworkTab.tsx`):**
  - Implementerad enligt `docs/ui-reference/batch-3-screenshots.md` (rad 121–135).
  - Require trusted devices med Learn more-länk.
  - Cowork files-katalogkonfiguration med Change-modal och katalogväljare.
  - Trusted Cowork folders med Manage-modal för att lägga till/ta bort betrodda mappar.
  - Only on this computer-toggle med länk till filhanteringsdokumentation.
  - Preferred browser-dropdown (Built-in browser, System default, Google Chrome, Safari).
  - Open links in built-in browser-toggle.
  - Allowed sites med Manage-modal för att hantera godkända webbplatser utan bekräftelseruta.

- **Navigerings- & Inställningsregistrering:**
  - `ClaudeSettingsTab.CLAUDE_CODE` och `ClaudeSettingsTab.COWORK` fullt inkopplade i `Settings/types.ts` och `TABS`-registret med `SettingsGroup.DESKTOP_APP`.
  - Export av `ClaudeCodeTab` och `CoworkTab` i `client/src/components/Nav/SettingsTabs/Claude/index.ts`.
  - `SidebarNavList.tsx` uppdaterad med direkt länk till `/code` ("Code" med `Terminal`-ikon) och länk till "Chats and tasks" (`/chats`) via MoreMenu.

- **Verifiering:**
  - 100% gröna Jest-enhetstester i `ClaudeCodeTab.spec.tsx` och `CoworkTab.spec.tsx`.
  - Alla relaterade sviter (`UnifiedSidebar`, `Code`, `Design`, `Chats`, `SettingsTabs`) gröna (44/44 tester).
  - TypeScript typecheck ren utan fel (`tsc --noEmit`, exit 0).
  - ESLint och Prettier rena med `--max-warnings=0`.
