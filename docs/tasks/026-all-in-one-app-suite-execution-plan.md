# Task 026: All-in-One Multi-App Suite — Granulär Exekveringsplan (Fas 26 till Fas 45)

> **Motto:** *"In order to trust the output, one must understand the input."*  
> **Arkitekturprincip:** 100% dolda systemprompter i API-lagret • Full modellfrihet via OpenRouter • Isolerad historik per app + samlad startsida.  
> **Visuell översikt:** Se SVG-diagrammet [docs/images/all-in-one-master-phases.svg](../images/all-in-one-master-phases.svg).

---

## Översikt över Arkitekturen

Plattformen förvandlas från en traditionell chattapplikation till en komplett **All-in-One AI-arbetsstation**. Världens alla ledande AI-plattformar (omfattande samtliga 72 undersökta modeller och tjänster från `My system prompts/` och `Anthropic/`) integreras som inbyggda specialiserade appar i sidomenyn.

Varje app representeras av ett manifest som automatiskt injicerar dess **autentiska, dolda systemprompt** och monterar dess verktyg (Manus tools, v0 form cards, Perplexity citations etc.) i anropet till OpenRouter utan att någon prompttext någonsin syns i användarens chattbubbla.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   UNIFIED SIDEBAR                                      │
├───────────────────┬───────────────────┬───────────────────────┬────────────────────────┤
│   🌟 CORE APPS    │ 🤖 AUTONOMOUS     │ 🛠️ BUILDERS & OFFICE  │ 🔍 RESEARCH & BROWSING │
├───────────────────┼───────────────────┼───────────────────────┼────────────────────────┤
│ • Claude Chat     │ • Manus Workspace │ • v0 Studio (shadcn)  │ • Perplexity Research  │
│ • Claude Cowork   │ • Cognition Devin │ • Lovable Studio      │ • ChatGPT Atlas        │
│ • Claude Design   │ • Cursor Studio   │ • Living Office Suite │ • Brave & Deep Search  │
│ • Claude Code     │ • Windsurf Wave   │ • Notion AI Studio    │                        │
│                   │ • Kiro/Traycer    │ • Bolt.new            │                        │
│                   │ • Replit Studio   │                       │                        │
│                   │ • xAI Grok Build  │                       │                        │
└───────────────────┴───────────────────┴───────────────────────┴────────────────────────┘
```

---

## 20 Granulära Faser för Implementering

---

### BLOCK 1: App Registry, Prompt Store & Datamodell (Fas 26–29)

#### Fas 26: Unified App Registry & Types Definition
- **Syfte:** Skapa den centrala typ- och registermotorn för alla appar i monorepot.
- **Filer:**
  - `packages/data-provider/src/apps/types.ts`
  - `packages/data-provider/src/apps/appsRegistry.ts`
  - `packages/data-provider/src/apps/appsRegistry.spec.ts`
- **Checklista:**
  - [x] Definiera `AppDefinition`, `AppSection` (`'core' | 'agents' | 'builders' | 'research'`), `AppCapability`.
  - [x] Implementera `appsRegistry` med metadata för samtliga 20+ appar.
  - [x] Skapa hjälpfunktioner: `getAppDefinition(appId)`, `listAppsBySection(section)`, `isValidAppId(id)`.
  - [x] Skriv 100% täckande enhetstester.
- **Verifiering:** `npm test packages/data-provider/src/apps/appsRegistry.spec.ts`.

#### Fas 27: Authentic Prompt Store & Placeholder Engine
- **Syfte:** Extrahera och strukturera de autentiska systemprompterna från mappen `My system prompts/` och kapsla in dem säkert.
- **Filer:**
  - `packages/data-provider/src/apps/promptStore.ts`
  - `packages/data-provider/src/apps/promptStore.spec.ts`
- **Checklista:**
  - [ ] Importera och lagra råa systemprompts för Manus, v0, Cursor, Devin, Perplexity, Office, Lovable, Claude etc.
  - [ ] Bygg en snabb interpoleringsmotor för dynamiska placeholders: `{{CURRENT_DATE}}`, `{{WORKING_DIRECTORY}}`, `{{USER_NAME}}`, `{{CURRENT_OS}}`.
  - [ ] Garantera strängsanering och skydd mot läckage till klienten.
- **Verifiering:** Enhetstester som verifierar att interpolation och prompt-hämtning fungerar felfritt.

#### Fas 28: Databasschema & Session Scoping (`appId`)
- **Syfte:** Utöka databasmodellen så att varje konversation kopplas till ett specifikt `appId` med blixtsnabb indexering.
- **Filer:**
  - `packages/data-schemas/src/schema/conversation.ts`
  - `api/models/Conversation.js`
  - `packages/data-provider/src/types/queries.ts`
- **Checklista:**
  - [ ] Lägg till fältet `appId: { type: String, default: 'chat', index: true }` i Conversation-schemat.
  - [ ] Säkerställ bakåtkompatibilitet: Äldre konversationer utan `appId` mappas implicit till `'chat'`.
  - [ ] Skapa sammansatt MongoDB-index: `{ user: 1, appId: 1, updatedAt: -1 }`.
  - [ ] Uppdatera queries och API-kontrakt för att tillåta filtrering på `appId`.
- **Verifiering:** Starta API lokalt eller kör schematest för att bekräfta att `appId` sparas och hämtas korrekt.

#### Fas 29: Backend Hidden Prompt Dispatcher & OpenRouter Payload Assembler
- **Syfte:** Kärnmotorn som fångar upp inkommande `appId` och monterar den dolda systemprompten direkt i API-anropet till OpenRouter.
- **Filer:**
  - `packages/api/src/endpoints/chat/index.ts` (eller motsvarande meddelandeprocessor)
  - `api/server/routes/ask/openAI.js` / OpenRouter handler
- **Checklista:**
  - [ ] Läs av `appId` från request body.
  - [ ] Slå upp appens systemprompt från `promptStore` och montera den som det första meddelandet (`role: 'system'` eller `role: 'developer'`).
  - [ ] Koppla appens specifika verktyg (Manus tools för manus, research tools för perplexity, etc.).
  - [ ] Strikt isolering: Se till att systemprompten ALDRIG sparas i meddelandelistan som skickas tillbaka till användargränssnittet.
- **Verifiering:** Verifiera med ett curl-anrop eller mock-anrop att OpenRouter tar emot systemprompten medan klienten endast ser användarmeddelandet och modellsvaret.

---

### BLOCK 2: Sidomeny, Navigation & Scoped Routing (Fas 30–33)

#### Fas 30: Sidomeny med 4 Sektioner (Core, Agents, Builders, Research)
- **Syfte:** Bygg om sidomenyn (`UnifiedSidebar`) så att den strukturerar apparna i eleganta, fällbara kategorier.
- **Filer:**
  - `client/src/components/UnifiedSidebar/SidebarNavList.tsx`
  - `client/src/components/UnifiedSidebar/ExpandedPanel.tsx`
  - `client/src/components/UnifiedSidebar/AppSectionGroup.tsx`
- **Checklista:**
  - [ ] Skapa sektionsrubriker med diskreta badges och kollapsmöjlighet: Core Apps, Autonomous Agents, Builders & Productivity, Research & Browsing.
  - [ ] Mappa varje app till en distinkt Lucide-ikon (t.ex. Terminal för Manus, Palette för Design, Search för Perplexity, Code för Cursor).
  - [ ] Lägg till hover-kort och verktygstips med appens beskrivning.
- **Verifiering:** Visuell inspektion av sidomenyn i både expanderat och minimerat läge.

#### Fas 31: Favoriter & Pinning System
- **Syfte:** Tillåt användaren att stjärnmärka eller pinna sina favoritappar till en snabbåtkomst-rad högst upp i sidomenyn.
- **Filer:**
  - `client/src/store/pinnedApps.ts` (Jotai/Recoil atom eller localStorage hook)
  - `client/src/components/UnifiedSidebar/PinnedAppsRow.tsx`
- **Checklista:**
  - [ ] Skapa state för `pinnedAppIds` (persisterat i `localStorage`).
  - [ ] Lägg till "Pin to Top" / "Unpin" i apparnas kontextmeny eller via stjärnikon vid hovring.
  - [ ] Rendera en horisontell eller vertikal snabbdocka för pinnade appar.
- **Verifiering:** Lägg till/ta bort pinnade appar och ladda om sidan; tillståndet ska bestå.

#### Fas 32: Scoped Routing & App Shell (`/app/:appId`)
- **Syfte:** Etablera enhetlig URL-struktur för apparna med en dedikerad layout som injicerar aktivt app-tillstånd.
- **Filer:**
  - `client/src/routes/AppRoute.tsx`
  - `client/src/routes/index.tsx`
  - `client/src/hooks/useCurrentApp.ts`
- **Checklista:**
  - [ ] Skapa rutter: `/app/:appId` och `/app/:appId/:conversationId`.
  - [ ] Implementera `useCurrentApp()` som läser aktiv rutt och returnerar appens manifest, ikon och färgtema.
  - [ ] Anpassa chat-headern med appens namn, ikon och dedikerade åtgärdsknappar.
- **Verifiering:** Navigering till `/app/manus`, `/app/v0` och `/app/research` laddar rätt app-header och kontext.

#### Fas 33: Isolerad Historik per App vs. Startsida ("All Activity")
- **Syfte:** Säkerställ att när man befinner sig i en app visas endast den appens konversationer, medan startsidan ger full översikt.
- **Filer:**
  - `client/src/components/UnifiedSidebar/HistoryList.tsx`
  - `client/src/hooks/useConversationFilters.ts`
  - `client/src/components/Activity/AllActivityTimeline.tsx`
- **Checklista:**
  - [ ] Filtrera historikhämtningen med `currentAppId` när användaren är på `/app/:appId`.
  - [ ] Skapa startsidan `/all` (eller `/`) med en kombinerad tidslinje som visar alla sessioner märkta med app-specifika badges.
  - [ ] Lägg till en toggle-knapp i historiken: "Bara denna app" / "Alla appar".
- **Verifiering:** Skapa en tråd i Manus och en i v0; kontrollera att Manus-tråden inte syns under v0 men syns på Startsidan.

---

### BLOCK 3: Core Apps & Frontier Prompts Integration (Fas 34–36)

#### Fas 34: Core Claude Suite (Chat, Cowork, Design, Code)
- **Syfte:** Montera Anthropics officiella systemprompter för de 4 kärnupplevelserna.
- **Filer:**
  - `packages/data-provider/src/apps/prompts/claudeCore.ts`
  - Promptkällor: `Anthropic/official/2026-09-22-claude-opus-5.5.md`, `Anthropic/claude-cowork/`, `Anthropic/claude-design/`, `Anthropic/claude-code/`
- **Checklista:**
  - [ ] Koppla `/app/chat` till Claude Opus 5.5 Artifacts & Thinking prompt.
  - [ ] Koppla `/app/cowork` till Claude Cowork Background Task & Subagent prompt.
  - [ ] Koppla `/app/design` till Claude Design Canvas prompt.
  - [ ] Koppla `/app/code` till Claude Code terminal- och diff-prompt.
- **Verifiering:** Verifiera att XML-taggar (`<thinking>`, `:::artifact`) tolkas och renderas sömlöst.

#### Fas 35: OpenAI Frontier Suite (ChatGPT Atlas, GPT-5.6 Sol, o3-mini)
- **Syfte:** Integrera OpenAIs banbrytande systemprompter och sandlådestrukturer.
- **Filer:**
  - `packages/data-provider/src/apps/prompts/openAiFrontier.ts`
  - Promptkällor: `My system prompts/OpenAI/gpt-5.6-sol.md`, `My system prompts/OpenAI/chatgpt-atlas.md`, `My system prompts/OpenAI/o3-mini.md`
- **Checklista:**
  - [ ] Integrera ChatGPT Atlas webbläsarprompt och multi-mode kontext.
  - [ ] Integrera GPT-5.6 Sol resonemangs-, coding- och verktygsprioritering.
  - [ ] Montera sandlådedirektiven för Office/Slides/Spreadsheets.
- **Verifiering:** Verifiera att modellen strukturerar resonemang och filhantering enligt OpenAIs standarder.

#### Fas 36: Frontier Open-Source & Alternatives (DeepSeek R1/V3, Grok Build, Qwen)
- **Syfte:** Integrera resonemangs- och kodningsdirektiv från ledande open-source och utmanare.
- **Filer:**
  - `packages/data-provider/src/apps/prompts/frontierAlternative.ts`
  - Promptkällor: `My system prompts/DeepSeek/`, `My system prompts/xAI/grok-build.md`, `My system prompts/Qwen/`
- **Checklista:**
  - [ ] DeepSeek R1 prompt med strikt `<think>`-verifiering och eliminering av hallisar.
  - [ ] xAI Grok Build prompt med stöd för parallella verktygsanrop och Jinja2-mallar.
  - [ ] Qwen 2.5 Coder & Moonshot Kimi K2 direktiv.
- **Verifiering:** Testa anrop via OpenRouter mot DeepSeek-R1 och bekräfta att tankekedjor parsas korrekt.

---

### BLOCK 4: Autonomous Agents Workspaces (Fas 37–39)

#### Fas 37: Manus Autonomous Workspace (`/app/manus`)
- **Syfte:** Fullständig dedikerad miljö för Manus med dess 31 verktyg, processhanterare och dashboard.
- **Filer:**
  - `client/src/components/ManusStudio/ManusWorkspaceView.tsx`
  - `packages/data-provider/src/manus/manusTools.ts`
  - Promptkälla: `My system prompts/Manus Agent loop.txt`
- **Checklista:**
  - [ ] Montera den autentiska Manus Agent Loop-prompten som dold systemprompt.
  - [ ] Injicera samtliga 31 diskreta Manus-verktyg (`shell_write_to_process`, `deploy_expose_port`, browser tools).
  - [ ] Bygg en delad vy med Live Terminal (med interaktiv stdin-inmatning) och Browser Live Preview.
- **Verifiering:** Kör ett autonomt bash-kommando via Manus-vy och interagera med en process via `stdin`.

#### Fas 38: Cognition Devin & DeepWiki Engine (`/app/devin`)
- **Syfte:** Integrera Devins autonoma ingenjörsflöde och dess arkitektur-wiki.
- **Filer:**
  - `client/src/components/DevinStudio/DeepWikiPanel.tsx`
  - Promptkälla: `My system prompts/Devin AI/DeepWiki Prompt.txt`
- **Checklista:**
  - [ ] Montera Devin AI systemprompt.
  - [ ] Skapa en DeepWiki-sidopanel som automatiskt genererar och visar arkitekturkartor och moduldokumentation för kodbasen.
  - [ ] Koppla arkitektur-noder till klickbara fillänkar i repot.
- **Verifiering:** Generera en DeepWiki-översikt över ett delprojekt och verifiera visualiseringen.

#### Fas 39: Coding Specialist Studios (Cursor, Windsurf, Kiro/Traycer)
- **Syfte:** Specialiserade kodningsmiljöer med snabba diffar, TDD-disciplin och självläkande dev-servers.
- **Filer:**
  - `client/src/components/CodeStudios/`
  - Promptkällor: `Cursor Prompts/Agent Prompt 2.0.txt`, `Windsurf/Prompt Wave 11.txt`, `Kiro/Spec_Prompt.txt`, `Traycer/`
- **Checklista:**
  - [ ] `/app/cursor`: Monaco DiffEditor med blixtsnabb search/replace och cherry-pick accept/reject.
  - [ ] `/app/windsurf`: Live Dev Server preview med automatisk konsolfelsfångare och auto-healing loop.
  - [ ] `/app/kiro`: Dual-Mode väljare (Spec Mode för arkitektur/TDD vs. Vibe Mode för snabb UI-kod).
- **Verifiering:** Testa att växla mellan Spec Mode och Vibe Mode i composern.

---

### BLOCK 5: Builders & Living Office Workspaces (Fas 40–42)

#### Fas 40: v0 Studio Integration (`/app/v0`)
- **Syfte:** Blixtsnabb generering av moderna React 19 UI-komponenter med interaktiva form-kort och live preview.
- **Filer:**
  - `client/src/components/v0Studio/v0StudioView.tsx`
  - Promptkälla: `My system prompts/v0 Prompts and Tools/Prompt.txt`
- **Checklista:**
  - [ ] Montera den officiella v0-systemprompten och dess shadcn/ui komponentstandarder.
  - [ ] Koppla verktyget `AskUserQuestions` som automatiskt renderar interaktiva formulärkort i chatten vid otydliga specifikationer.
  - [ ] Integrera Sandpack React 19 Runner med responsiv multi-viewport (Desktop, Tablet, Mobile) i högerpanelen.
- **Verifiering:** Be v0 bygga en "Dashboard" och besvara de genererade formulärkorten direkt i chatten.

#### Fas 41: Lovable & Full-Stack App Builders (`/app/lovable` & `/app/bolt`)
- **Syfte:** Full-stack app-generering med databasscheman och live molndriftsättning.
- **Filer:**
  - `client/src/components/Builders/FullStackStudio.tsx`
  - Promptkällor: `My system prompts/Lovable/Agent Prompt.txt`, `My system prompts/Bolt/`
- **Checklista:**
  - [ ] Montera Lovable Agent prompt med Supabase SQL schema design och realtids-prenumerationer.
  - [ ] Bolt.new snabbstartsmallar för Vite + Tailwind.
  - [ ] Fullskärms iframe-preview med konsolloggar.
- **Verifiering:** Generera ett Supabase SQL-schema och se komponenten uppdateras i förhandsgranskningen.

#### Fas 42: Living Office & Notion AI Suite (`/app/office` & `/app/notion`)
- **Syfte:** Interaktiv kontorssvit och relationsdatabaser direkt i appen.
- **Filer:**
  - `client/src/components/Artifacts/OfficeStudio/`
  - Promptkällor: `OpenAI/gpt-5.6-sol.md` (Office Skills), `NotionAi/Prompt.txt`
- **Checklista:**
  - [ ] `/app/office`: Interaktiv Word (.docx), Excel (.xlsx med formelberäkning), PowerPoint (.pptx) och PDF-studio.
  - [ ] Exportknappar med ett klick till äkta `.docx`, `.xlsx` och `.pptx`-filer.
  - [ ] `/app/notion`: Skapa relationsdatabaser, tabellvyer och strukturerade hierarkiska dokument.
- **Verifiering:** Skapa en Excel-kalkyl med formler (`SUM`, `AVERAGE`), verifiera beräkningen och exportera till `.xlsx`.

---

### BLOCK 6: Research, Intelligence & Master Verification (Fas 43–45)

#### Fas 43: Perplexity Deep Research Studio (`/app/research`)
- **Syfte:** Grundlig djupforskning med flerstegs sök-syntes och verifierade källhänvisningar.
- **Filer:**
  - `client/src/components/Research/ResearchStudioView.tsx`
  - Promptkälla: `My system prompts/PERPLEXITY/Perplexity_Deep_Research.txt`
- **Checklista:**
  - [ ] Montera den autentiska Perplexity Deep Research-systemprompten.
  - [ ] Koppla Multi-Hop Query Planner (Hop 0: bred kartläggning, Hop 1: nischad analys, Hop 2: syntes).
  - [ ] Klickbara citatbadges `[1]` med hovringskort (favikon, domän, titel, utdrag) och samlad källbibliografi.
- **Verifiering:** Ställ en komplex forskningsfråga och verifiera att trädet av sökfrågor och källcitat renderas snyggt.

#### Fas 44: Web Intelligence & Connectors (`/app/atlas` & `/app/search`)
- **Syfte:** Webbläsarassistent och on-demand connector-hub med stöd för externa verktyg och @mentions.
- **Filer:**
  - `packages/data-provider/src/connectors/connectorHub.ts`
  - Promptkällor: `OpenAI/chatgpt-atlas.md`, `Brave Leo/`
- **Checklista:**
  - [ ] Perplexity Computer Connector Hub med `list_external_tools` on-demand.
  - [ ] Känslig @mention-detektering i composern (`@GitHub`, `@Slack`, `@Notion`, `@Postgres`).
  - [ ] ChatGPT Atlas sidopanelsläge med direkt webbkontext och skärmdumpar via Playwright MCP.
- **Verifiering:** Skriv `@GitHub` i composern och verifiera att externa verktyg listas och kan anropas.

#### Fas 45: Master Smoke Test, Säkerhetsgranskning & Prestandaoptimering
- **Syfte:** Helhetstestning av hela monorepot, nollställning av fel och verifiering av prompt-sekretess.
- **Filer:** Hela projektet.
- **Checklista:**
  - [ ] Verifiera med nätverkssniffer/loggar att **ingen systemprompttext någonsin läcker** till användarens chattbubbla i någon app.
  - [ ] Verifiera modelloberoende: Växla mellan DeepSeek-R1, Claude 3.7 Sonnet och GPT-5 i varje app och bekräfta stabilt svar.
  - [ ] Kör fullständig typecheck i alla workspaces:
    - `cd packages/data-provider && npx tsc --noEmit`
    - `cd packages/api && npx tsc --noEmit`
    - `cd client && npx tsc --noEmit`
  - [ ] Kör enhetstester: `npm test`.
  - [ ] Sortera imports: `npm run sort-imports`.
- **Verifiering:** Alla tester passerar grönt, inga konsolfel, och appen startar felfritt.

---

## Filmappning och Promptreferenser

| App ID | Namn | Sektion | Dold Systempromptfil | Primära Verktyg |
|---|---|---|---|---|
| `chat` | Claude Chat | Core | `Anthropic/official/2026-09-22-claude-opus-5.5.md` | Artifacts (React, Mermaid, SVG), Thinking |
| `cowork` | Claude Cowork | Core | `Anthropic/claude-cowork/claude-cowork.md` | Task Dispatcher, Subagents, Schedule |
| `design` | Claude Design | Core | `Anthropic/claude-design/claude-design.md` | Design Canvas, SVG Component Extractor |
| `code` | Claude Code | Core | `Anthropic/claude-code/claude-code-opus-5.5.md` | Subagents (Explore, Plan), Monaco Diff |
| `manus` | Manus Workspace | Agents | `My system prompts/Manus Agent loop.txt` | **Alla 31 Manus-verktyg**, ProcessManager, Ports |
| `devin` | Cognition Devin | Agents | `My system prompts/Devin AI/DeepWiki Prompt.txt` | DeepWiki Engine, Codebase Explorer |
| `cursor` | Cursor Studio | Agents | `My system prompts/Cursor Prompts/Agent Prompt 2.0.txt` | Fast search/replace, diff editor |
| `windsurf` | Windsurf Cascade | Agents | `My system prompts/Windsurf/Prompt Wave 11.txt` | Dev Server Preview, Error Interceptor |
| `kiro` | Kiro / Traycer | Agents | `My system prompts/Kiro/Spec_Prompt.txt` | Spec vs Vibe Engine, TDD Validator |
| `replit` | Replit Studio | Agents | `My system prompts/REPLIT/Replit_Agent.md` | VNC visual feedback, cloud deploy |
| `grok` | xAI Grok Build | Agents | `My system prompts/xAI/grok-build.md` | Parallella verktyg, Jinja2 Search |
| `v0` | v0 Studio | Builders | `My system prompts/v0 Prompts and Tools/Prompt.txt` | `AskUserQuestions` Form Cards, Sandpack Viewport |
| `lovable` | Lovable Studio | Builders | `My system prompts/Lovable/Agent Prompt.txt` | Supabase connector, Schema designer |
| `office` | Living Office | Builders | `My system prompts/OpenAI/gpt-5.6-sol.md` | Office Studio (.docx, .xlsx, .pptx, PDF) |
| `notion` | Notion AI Studio | Builders | `My system prompts/NotionAi/Prompt.txt` | Database creator, rich docs |
| `bolt` | Bolt.new | Builders | `My system prompts/Bolt/` | Vite sandbox, instant deploy |
| `research` | Perplexity Research | Research | `My system prompts/PERPLEXITY/Perplexity_Deep_Research.txt` | Multi-hop planner, citation badges |
| `atlas` | ChatGPT Atlas | Research | `My system prompts/OpenAI/chatgpt-atlas.md` | Full-page browser, side chat |
| `search` | Brave & Deep Search | Research | `My system prompts/Brave Leo/` | Privacy search, on-demand MCP tools |

---

## Genomfört Arbete: Fas 26 (Unified App Registry & Types Definition)

### 1. Kärnmotor & Datamodeller (`packages/data-provider/src/apps/`)
- Skapade `types.ts`:
  - `AppSection`: `'core' | 'agents' | 'builders' | 'research'`.
  - `AppCapability`: `artifacts`, `code_execution`, `web_search`, `terminal`, `file_editing`, `multi_hop_research`, `living_office`, `connectors`, `generative_ui`, `diff_viewer`, `browser_control`, `fullstack_preview`, `dual_mode`.
  - `AppStarterPrompt`: `label`, `prompt`, `description`.
  - `AppDefinition`: `id`, `name`, `section`, `tagline`, `description`, `icon`, `badge`, `color`, `systemPromptId`, `capabilities`, `defaultTools`, `suggestedStarters`, `order`, `isPinnedDefault`, `routePath`.
  - `SectionDefinition`: `id`, `title`, `description`, `icon`, `badge`, `order`.
- Skapade `appsRegistry.ts`:
  - `APP_SECTIONS`: 4 sektioner med metadata och display badges (`Core Apps`, `Autonomous Agents`, `Builders & Productivity`, `Research & Browsing`).
  - `APPS_REGISTRY`: Samtliga 22 specialiserade applikationer registrerade med unika metadata, färger, starter prompts och förmågor:
    - **Core Apps (4 st):** `chat` (Claude Chat), `cowork` (Claude Cowork), `design` (Claude Design), `code` (Claude Code).
    - **Autonomous Agents (8 st):** `manus` (Manus Workspace), `devin` (Cognition Devin), `cursor` (Cursor Studio), `windsurf` (Windsurf Wave), `kiro` (Kiro / Traycer), `replit` (Replit Studio), `grok` (xAI Grok Build), `cline` (Cline Autonomous).
    - **Builders & Productivity (6 st):** `v0` (v0 Studio), `lovable` (Lovable Studio), `office` (Living Office Suite), `notion` (Notion AI Studio), `bolt` (Bolt.new), `higgsfield` (Higgsfield Website Builder).
    - **Research & Browsing (4 st):** `perplexity` (Perplexity Research), `atlas` (ChatGPT Atlas), `deepsearch` (Brave & Deep Search), `connectors` (Perplexity Computer Connector Hub).
  - Hjälpfunktioner:
    - `getAllApps()`: Returnerar alla appar sorterade efter sektionsordning och intern prioritet.
    - `getAppDefinition(appId)`: Hämtar app case-insensitivt.
    - `getRequiredAppDefinition(appId)`: Hämtar app med fallback till `'chat'`.
    - `listAppsBySection(section)`: Filtrerar appar per sektion.
    - `isValidAppId(appId)`: Validerar app-ID.
    - `getDefaultApp()`: Returnerar standardappen (`Claude Chat`).
    - `getPinnedDefaultApps()`: Returnerar standardpinnade appar för snabbåtkomst.
    - `getAppSections()`: Returnerar alla sektioner i visningsordning.
    - `searchApps(query)`: Söker över namn, taglines, beskrivningar och förmågor.
- Re-exporterade modulen i `packages/data-provider/src/index.ts`, `dist/types/index.d.ts` och `dist/index.mjs`.

### 2. Verifiering & Enhetstester
- `appsRegistry.spec.ts`:
  - 100% godkända tester för alla 22 appar och 4 sektioner.
  - Verifierar strukturell integritet (strängar, arrays, starters, routePath `/app/:appId`).
  - Verifierar sökning, sektionsfiltrering, fallbacks och pinning.
- Formatering med `npm run sort-imports`.

