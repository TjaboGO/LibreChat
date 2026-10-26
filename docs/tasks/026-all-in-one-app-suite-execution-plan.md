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
  - [x] Importera och lagra råa systemprompts för Manus, v0, Cursor, Devin, Perplexity, Office, Lovable, Claude etc.
  - [x] Bygg en snabb interpoleringsmotor för dynamiska placeholders: `{{CURRENT_DATE}}`, `{{WORKING_DIRECTORY}}`, `{{USER_NAME}}`, `{{CURRENT_OS}}`.
  - [x] Garantera strängsanering och skydd mot läckage till klienten.
- **Verifiering:** Enhetstester som verifierar att interpolation och prompt-hämtning fungerar felfritt.

#### Fas 28: Databasschema & Session Scoping (`appId`)
- **Syfte:** Utöka databasmodellen så att varje konversation kopplas till ett specifikt `appId` med blixtsnabb indexering.
- **Filer:**
  - `packages/data-schemas/src/schema/convo.ts`
  - `packages/data-schemas/src/types/convo.ts`
  - `packages/data-schemas/src/methods/conversation.ts`
  - `packages/data-schemas/src/schema/convoAppId.spec.ts`
  - `packages/data-provider/src/schemas.ts`
  - `packages/data-provider/src/types/queries.ts`
  - `api/server/routes/convos.js`
- **Checklista:**
  - [x] Lägg till fältet `appId: { type: String, default: 'chat', index: true }` i Conversation-schemat.
  - [x] Säkerställ bakåtkompatibilitet: Äldre konversationer utan `appId` mappas implicit till `'chat'`.
  - [x] Skapa sammansatta MongoDB-index: `{ user: 1, appId: 1, updatedAt: -1, _id: -1 }`, `{ user: 1, appId: 1, createdAt: -1, _id: -1 }`, `{ user: 1, appId: 1, isArchived: 1, updatedAt: -1, _id: -1 }`.
  - [x] Uppdatera queries och API-kontrakt för att tillåta filtrering på `appId` i `getConvosByCursor` och Express-routern.
- **Verifiering:** Enhetstester i `packages/data-schemas/src/schema/convoAppId.spec.ts` och `tsc` typecheck verifierade.
- **Resultat:** Databasschema och session scoping är implementerat med fullständig bakåtkompatibilitet för befintliga konversationer.

#### Fas 29: Backend Hidden Prompt Dispatcher & OpenRouter Payload Assembler
- **Syfte:** Kärnmotorn som fångar upp inkommande `appId` och monterar den dolda systemprompten direkt i API-anropet till OpenRouter.
- **Filer:**
  - `packages/api/src/agents/appDispatcher.ts`
  - `packages/api/src/agents/load.ts`
  - `packages/api/src/agents/initialize.ts`
  - `packages/data-provider/src/createPayload.ts`
  - `api/app/clients/BaseClient.js`
  - `api/server/controllers/agents/request.js`
- **Checklista:**
  - [x] Läs av `appId` från request body, endpointOption och conversation (`resolveAppId`).
  - [x] Slå upp appens systemprompt från `promptStore` och montera den som det första meddelandet (`role: 'system'` eller `agent.instructions`).
  - [x] Koppla appens specifika verktyg (Manus tools för manus, research tools för perplexity, connectors för connector hub, etc.).
  - [x] Strikt isolering: Se till att systemprompten ALDRIG sparas i databasens meddelandelista eller skickas tillbaka i klientens meddelandeträd (`filterSystemPromptFromMessages`, `isSystemPromptIsolated`).
- **Verifiering:** Enhetstester i `packages/api/src/agents/appDispatcher.spec.ts` verifierade med 100% assertions godkända för promptinjicering, verktygskoppling, payload-montering och strikt isolering.
- **Resultat:** Fas 29 fullt implementerad och verifierad. Backend Hidden Prompt Dispatcher är aktiv i runtime, laddar och interpolerar dolda systemprompter samt fäster verktyg för alla 22 appar med garanterad noll-läckage-isolering.

---

### BLOCK 2: Sidomeny, Navigation & Scoped Routing (Fas 30–33)

#### Fas 30: Sidomeny med 4 Sektioner (Core, Agents, Builders, Research)
- **Syfte:** Bygg om sidomenyn (`UnifiedSidebar`) så att den strukturerar apparna i eleganta, fällbara kategorier.
- **Filer:**
  - `client/src/components/UnifiedSidebar/SidebarNavList.tsx`
  - `client/src/components/UnifiedSidebar/ExpandedPanel.tsx`
  - `client/src/components/UnifiedSidebar/AppSectionGroup.tsx`
- **Checklista:**
  - [x] Skapa sektionsrubriker med diskreta badges och kollapsmöjlighet: Core Apps, Autonomous Agents, Builders & Productivity, Research & Browsing.
  - [x] Mappa varje app till en distinkt Lucide-ikon (t.ex. Terminal för Manus, Palette för Design, Search för Perplexity, Code för Cursor).
  - [x] Lägg till hover-kort och verktygstips med appens beskrivning.
- **Verifiering:** Visuell inspektion av sidomenyn i både expanderat och minimerat läge (`AppSectionGroup.spec.tsx` och `RailSectionFlyout`).
- **Resultat (Fas 30 slutförd):**
  - Implementerade `AppSectionGroup.tsx` med Ariakit/Collapse, animerade pilar, sektionsbadges (`4 Apps`, `8 Agents`, `6 Studios`, `4 Hubs`), och per-sektion `localStorage`-persistering (`side:app-section:${id}`).
  - Skapade `appIcons.ts` med deterministisk mapping för samtliga 22 appar och sektionsikoner.
  - Integrerade 4 sektioner i `SidebarNavList.tsx` ovanför konversationer/historik med rika hover-kort och verktygstips via `TooltipAnchor`.
  - Uppdaterade `ExpandedPanel.tsx` med flyout-menyer (`RailSectionFlyout`) för blixtsnabb åtkomst till alla 22 appar även när sidomenyn är kollapsad.
  - Skapade testsvit `AppSectionGroup.spec.tsx` som verifierar rendering, struktur och kollapsbeteende för alla sektioner.

#### Fas 31: Favoriter & Pinning System
- **Syfte:** Tillåt användaren att stjärnmärka eller pinna sina favoritappar till en snabbåtkomst-rad högst upp i sidomenyn.
- **Filer:**
  - `client/src/store/pinnedApps.ts` (Jotai/Recoil atom eller localStorage hook)
  - `client/src/components/UnifiedSidebar/PinnedAppsRow.tsx`
- **Checklista:**
  - [x] Skapa state för `pinnedAppIds` (persisterat i `localStorage`).
  - [x] Lägg till "Pin to Top" / "Unpin" i apparnas kontextmeny eller via stjärnikon vid hovring.
  - [x] Rendera en horisontell eller vertikal snabbdocka för pinnade appar.
- **Verifiering:** Lägg till/ta bort pinnade appar och ladda om sidan; tillståndet ska bestå (`PinnedApps.spec.tsx` och browser verification).
- **Resultat (Fas 31 slutförd):**
  - Skapade `client/src/store/pinnedApps.ts` med Jotai-atom `pinnedAppIdsAtom` persisterad i `localStorage` (`side:pinned-apps`) samt kurerade default-appar (`chat`, `cowork`, `manus`, `v0`, `perplexity`).
  - Implementerade reaktiv hook `usePinnedApps()` med `pinApp`, `unpinApp`, `togglePin`, `reorderPinnedApps`, `clearAllPinned` och `resetToDefault`.
  - Skapade snabbdocka-komponenten `PinnedAppsRow.tsx` med bärnstensfärgad pin-badge, fällbar header och 2-kolumns interaktiv grid med app-ikoner, kompakta namn, unpin-åtgärder och rika verktygstips.
  - Integrerade pin-knappar i `AppSectionGroup.tsx` så att användare med 1 klick kan pinna/unpinna vilken som helst av de 22 apparna direkt från listan.
  - Integrerade 1-klicks snabbdocka i minimerat läge (`ExpandedPanel.tsx`) som visar upp till 5 pinnade appar direkt i railen ovanför sektionsflyouterna.
  - Byggde testsvit i `client/src/components/UnifiedSidebar/__tests__/PinnedApps.spec.tsx`.

#### Fas 32: Scoped Routing & App Shell (`/app/:appId`)
- **Syfte:** Etablera enhetlig URL-struktur för apparna med en dedikerad layout som injicerar aktivt app-tillstånd.
- **Filer:**
  - `client/src/routes/AppRoute.tsx`
  - `client/src/routes/index.tsx`
  - `client/src/hooks/useCurrentApp.ts`
- **Checklista:**
  - [x] Skapa rutter: `/app/:appId` och `/app/:appId/:conversationId`.
  - [x] Implementera `useCurrentApp()` som läser aktiv rutt och returnerar appens manifest, ikon och färgtema.
  - [x] Anpassa chat-headern med appens namn, ikon och dedikerade åtgärdsknappar.
- **Verifiering:** Navigering till `/app/manus`, `/app/v0` och `/app/research` laddar rätt app-header och kontext (`AppRoute.spec.tsx`).
- **Resultat (Fas 32 slutförd):**
  - Implementerade `useCurrentApp.ts` som läser aktiv URL-rutt, conversation-state och manifest från `APPS_REGISTRY`. Returnerar appdetaljer, brandikoner, sektion, taggar och hjälpare (`navigateToApp`, `startNewAppChat`).
  - Skapade `AppHeaderBadge.tsx` som injiceras i `Header.tsx` och visar app-badge, färgikon, pill, tooltip och "New [App] Session"-knapp när man befinner sig i en specialiserad app.
  - Skapade `AppRoute.tsx` med routing till `/app/:appId/:conversationId?` och `/apps/:appId/:conversationId?` som validerar `isValidAppId(appId)`, redirectar saknat `conversationId` till `/app/:appId/new`, och monterar `ChatRoute`.
  - Uppdaterade `ChatRoute.tsx` så att `newConversation` automatiskt sätter `appId: currentAppId` i sessionsmallen, och återställer sessionen när man byter mellan appar i utkastläge (`draftAppMismatch`).
  - Byggde testsvit i `client/src/routes/__tests__/AppRoute.spec.tsx`.

#### Fas 33: Isolerad Historik per App vs. Startsida ("All Activity")
- **Syfte:** Säkerställ att när man befinner sig i en app visas endast den appens konversationer, medan startsidan ger full översikt.
- **Filer:**
  - `client/src/components/UnifiedSidebar/HistoryList.tsx`
  - `client/src/hooks/useConversationFilters.ts`
  - `client/src/components/Activity/AllActivityTimeline.tsx`
- **Checklista:**
  - [x] Filtrera historikhämtningen med `currentAppId` när användaren är på `/app/:appId`.
  - [x] Skapa startsidan `/all` (eller `/`) med en kombinerad tidslinje som visar alla sessioner märkta med app-specifika badges.
  - [x] Lägg till en toggle-knapp i historiken: "Bara denna app" / "Alla appar".
- **Verifiering:** Skapa en tråd i Manus och en i v0; kontrollera att Manus-tråden inte syns under v0 men syns på Startsidan (`HistoryScoping.spec.tsx`).
- **Resultat (Fas 33 slutförd):**
  - Implementerade `useConversationFilters.ts` med `conversationFilterScopeAtom` (`side:conversation-filter-scope`) som tillåter användare att växla mellan isolerad apphistorik och full översikt.
  - Uppdaterade `useConversationsInfiniteQuery` i `queries.ts` och `ConversationsSection.tsx` så att `appId: effectiveAppId` skickas till backend Mongo-frågan (`getConvosByCursor`).
  - Skapade scope-toggle-listen i `ConversationsSection.tsx` som visas när man är i en specialiserad app med knapparna "This App" och "All Apps".
  - Uppdaterade `ConversationEndpointIcon.tsx` så att konversationer i historiklistan märkta med specialiserade appar renderar appens brandikon i färg.
  - Skapade `AllActivityTimeline.tsx` och registrerade `/all` i `client/src/routes/index.tsx` med sektionsflikar, kronologisk datumgruppering (`Today`, `Yesterday`, `Earlier`), sökning och direktlänkar till trådar.
  - Lade till direktlänk "All Activity" i `SidebarNavList.tsx`.
  - Byggde testsvit i `client/src/components/UnifiedSidebar/__tests__/HistoryScoping.spec.tsx`.

---

### BLOCK 3: Core Apps & Frontier Prompts Integration (Fas 34–36)

#### Fas 34: Core Claude Suite (Chat, Cowork, Design, Code)
- **Syfte:** Montera Anthropics officiella systemprompter för de 4 kärnupplevelserna.
- **Filer:**
  - `packages/data-provider/src/apps/prompts/claudeCore.ts`
  - `packages/data-provider/src/apps/promptStore.ts`
  - `packages/data-provider/src/apps/__tests__/claudeCore.spec.ts`
  - Promptkällor: `Anthropic/official/2026-09-22-claude-opus-5.5.md`, `Anthropic/claude-cowork/`, `Anthropic/claude-design/`, `Anthropic/claude-code/`
- **Checklista:**
  - [x] Koppla `/app/chat` till Claude Opus 5.5 Artifacts & Thinking prompt.
  - [x] Koppla `/app/cowork` till Claude Cowork Background Task & Subagent prompt.
  - [x] Koppla `/app/design` till Claude Design Canvas prompt.
  - [x] Koppla `/app/code` till Claude Code terminal- och diff-prompt.
- **Verifiering:** Verifiera att XML-taggar (`<thinking>`, `:::artifact`) tolkas och renderas sömlöst, samt att alla dynamiska platshållare interpoleras (`CURRENT_DATE`, `CURRENT_TIME`, `CURRENT_OS`, `WORKING_DIRECTORY`, `APP_NAME`, `KNOWLEDGE_CUTOFF`).
- **Resultat (Fas 34 slutförd):**
  - Skapade `packages/data-provider/src/apps/prompts/claudeCore.ts` med fullständiga autentiska systemprompter:
    - `CLAUDE_CHAT_PROMPT`: "Articulate & Nuanced" (anti-sycophancy, epistemic calibration, intellectual rigor, depth, artifact guidelines).
    - `CLAUDE_COWORK_PROMPT`: "Deep Pair Programmer & Strategist" (proaktiv staff-level arkitektur, minimala kirurgiska editeringar, intermediär verktygsdisciplin, testverifiering).
    - `CLAUDE_DESIGN_PROMPT`: "Visual Systems & Generative UI" (typografisk skala, Tailwind CSS token-paletter, färgtonsharmoni, Lucide-ikoner, tillgängliga Radix/Ariakit-primitiver).
    - `CLAUDE_CODE_PROMPT`: "Terminal Agent" (maximal signal-till-brus, zero pleasantries, kirurgisk felanalys av stack traces, konventionell git-disciplin).
  - Uppdaterade `packages/data-provider/src/apps/promptStore.ts` för att montera och exportera dessa prompter i `AUTHENTIC_PROMPTS` under både systemPromptId (`claude-chat`, `claude-cowork`, `claude-design`, `claude-code`) och appId (`chat`, `cowork`, `design`, `code`).
  - Lade till `appId?: string;` i `TPayload` (`packages/data-provider/src/types.ts`) för full typintegritet i dispatchern.
  - Kompilerade `packages/data-provider/dist/apps/` med `tsc`.
  - Skapade komplett testsvit `packages/data-provider/src/apps/__tests__/claudeCore.spec.ts` (14/14 tester gröna) som validerar alla sektioner, principer och platshållarinterpolation.

#### Fas 35: OpenAI Frontier Suite (ChatGPT Atlas, GPT-5.6 Sol, o3-mini)
- **Syfte:** Integrera OpenAIs banbrytande systemprompter och sandlådestrukturer.
- **Filer:**
  - `packages/data-provider/src/apps/prompts/openAiFrontier.ts`
  - `packages/data-provider/src/apps/promptStore.ts`
  - `packages/data-provider/src/apps/__tests__/openAiFrontier.spec.ts`
  - Promptkällor: `My system prompts/OpenAI/gpt-5.6-sol.md`, `My system prompts/OpenAI/chatgpt-atlas.md`, `My system prompts/OpenAI/o3-mini.md`
- **Checklista:**
  - [x] Integrera ChatGPT Atlas webbläsarprompt och multi-mode kontext.
  - [x] Integrera GPT-5.6 Sol resonemangs-, coding- och verktygsprioritering.
  - [x] Montera sandlådedirektiven för Office/Slides/Spreadsheets.
- **Verifiering:** Verifiera att modellen strukturerar resonemang och filhantering enligt OpenAIs standarder.
- **Resultat (Fas 35 slutförd):**
  - Skapade `packages/data-provider/src/apps/prompts/openAiFrontier.ts` med fullständiga autentiska systemprompter:
    - `OPENAI_ATLAS_PROMPT` (`/app/atlas`, `chatgpt-atlas`): Multimodala lägen (Full-Page Chat, Web Browsing, Web Browsing with Side Chat), strikt instruktionsprioritet 1–7, hantering av sidokontext vs. bilagor, verktygsvägledning för sökning och blockerade domäner.
    - `OPENAI_GPT5_SOL_PROMPT` (`gpt-5-sol`, `gpt5`, `sol`): Sandlådemiljö och färdigheter (Word docx, Slides pptx, Spreadsheets openpyxl via artifact_tool), sandlådeciteringar `[Label](sandbox:/mnt/data/<filename>.<ext>)`, anti-patronizing principer (inga "let's pause" eller "let's take a breath"), förbud mot ytliga "real-talk"-flufffraser ("# My honest recommendation", "Honestly?..."), kompakta stycken och 45s Python timeout.
    - `OPENAI_O3_MINI_PROMPT` (`o3-mini`, `o3`): Djup steg-för-steg tankekedja i privat analyskanal, verifiering siffra-för-siffra vid aritmetik/trick-frågor, rigorös STEM/algoritmverifiering och tillståndskänslig Jupyter-miljö i `/mnt/data`.
    - `OPENAI_OFFICE_SANDBOX_DIRECTIVES` & `OPENAI_LIVING_OFFICE_PROMPT` (`/app/office`, `living-office`): Fullständiga produktionsdirektiv för Word (.docx med GitHub callouts), Excel (.xlsx med formelmotor och multi-flikar) och PowerPoint (.pptx 16:9 widescreen med talaranteckningar) levererade via `sandbox:/mnt/data/`.
  - Integrerade och exporterade alla prompter och alias i `packages/data-provider/src/apps/promptStore.ts`.
  - Kompilerade `packages/data-provider/dist/apps/` med `tsc`.
  - Skapade fullständig enhetstestsvit `packages/data-provider/src/apps/__tests__/openAiFrontier.spec.ts` som verifierar alla sektioner, principer, sandlådedirektiv, alias och platshållarinterpolering. Alla tester gröna (100%).

#### Fas 36: Frontier Open-Source & Alternatives (DeepSeek R1/V3, Grok Build, Qwen)
- **Syfte:** Integrera resonemangs- och kodningsdirektiv från ledande open-source och utmanare.
- **Filer:**
  - `packages/data-provider/src/apps/prompts/frontierAlternative.ts`
  - `packages/data-provider/src/apps/promptStore.ts`
  - `packages/data-provider/src/apps/__tests__/frontierAlternative.spec.ts`
  - `packages/api/src/agents/appDispatcher.ts`
  - `packages/api/src/agents/appDispatcher.spec.ts`
  - Promptkällor: `My system prompts/DeepSeek/`, `My system prompts/xAI/grok-build.md`, `My system prompts/Qwen/`, `My system prompts/Kimi/`
- **Checklista:**
  - [x] DeepSeek R1 prompt med strikt `<think>`-verifiering och eliminering av hallisar.
  - [x] xAI Grok Build prompt med stöd för parallella verktygsanrop och Jinja2-mallar.
  - [x] Qwen 2.5 Coder & Moonshot Kimi K2 direktiv.
- **Verifiering:** Testa anrop via OpenRouter mot DeepSeek-R1 och bekräfta att tankekedjor och `reasoning_content` parsas och bevaras korrekt.
- **Resultat (Fas 36 & Block 3 slutförda och granskade):**
  - Skapade `packages/data-provider/src/apps/prompts/frontierAlternative.ts` med fullständiga autentiska prompter:
    - `DEEPSEEK_R1_PROMPT` (`deepseek-r1`, `deepseek`, `r1`): Kedjeresonemang i `<think>...</think>`, eliminering av hallisar, randvillkorsanalys, epistemisk kalibrering samt meningsnära källhänvisning via `[citation:X]`.
    - `XAI_GROK_BUILD_PROMPT` (`/app/grok`, `xai-grok-build`): Parallell verktygsexekvering (`<tool_calling>`), asynkrona bakgrundsprocesser med `background: true` och `task_id`, kirurgiska kodändringar utan onödiga abstraktioner samt verifiering innan slutrapportering.
    - `QWEN_CODER_PROMPT` (`qwen-coder`, `qwen`): Strikt anpassning till repots befintliga kodkonventioner, kontroll av bibliotek före import, minimala kommentarer, permanenta automatiska tester och typkontroller.
    - `MOONSHOT_KIMI_PROMPT` (`moonshot-kimi`, `kimi`): Långkontextuell syntes upp till 2M tokens, rekursivt multi-hop resonemang och epistemisk stringens.
  - Uppdaterade `packages/data-provider/src/apps/promptStore.ts` med integration, export och alias.
  - Granskade och förstärkte `packages/api/src/agents/appDispatcher.ts` för att bevara `reasoning_content` i OpenRouter assistant-turer för DeepSeek R1 och resonemangsmodeller.
  - Kompilerade `packages/data-provider/dist/apps/` med `tsc`.
  - Skapade testsvit `packages/data-provider/src/apps/__tests__/frontierAlternative.spec.ts` och utökade `packages/api/src/agents/appDispatcher.spec.ts`.
  - Genomförde fullständig Block 3-audit: Samtliga 22 appar i `APPS_REGISTRY` samt alla 12 modellalias verifierade mot `AUTHENTIC_PROMPTS` utan olösta platshållare (100% gröna tester).

---

### BLOCK 4: Autonomous Agents Workspaces (Fas 37–39)

#### Fas 37: Manus Autonomous Workspace (`/app/manus`)
- **Syfte:** Fullständig dedikerad miljö för Manus med dess 31 verktyg, processhanterare och dashboard.
- **Filer:**
  - `client/src/components/ManusStudio/ManusWorkspaceView.tsx`
  - `client/src/components/ManusStudio/index.ts`
  - `client/src/components/ManusStudio/__tests__/ManusWorkspaceView.spec.tsx`
  - `client/src/routes/AppRoute.tsx`
  - `client/src/routes/__tests__/AppRoute.spec.tsx`
  - `packages/data-provider/src/manus/manusPrompt.ts`
  - `packages/data-provider/src/manus/__tests__/manusPrompt.spec.ts`
  - `packages/data-provider/src/apps/prompts/manusPrompt.ts`
  - `packages/data-provider/src/apps/promptStore.ts`
  - Promptkälla: `My system prompts/Manus Agent loop.txt`
- **Checklista:**
  - [x] Montera den autentiska Manus Agent Loop-prompten som dold systemprompt.
  - [x] Injicera samtliga 31 diskreta Manus-verktyg (`shell_write_to_process`, `deploy_expose_port`, browser tools).
  - [x] Bygg en delad vy med Live Terminal (med interaktiv stdin-inmatning) och Browser Live Preview.
- **Verifiering:** Kör ett autonomt bash-kommando via Manus-vy och interagera med en process via `stdin`.
- **Resultat (Fas 37 slutförd):**
  - Skapade `packages/data-provider/src/apps/prompts/manusPrompt.ts` och `packages/data-provider/src/manus/manusPrompt.ts` med den autentiska Manus Agent Loop-systemprompten (kompetenser, 6-stegs loop, interaktiv processhantering med `shell_write_to_process` och portexponering med `deploy_expose_port`).
  - Kopplade in `MANUS_AGENT_PROMPT` i `packages/data-provider/src/apps/promptStore.ts` under både `manus-agent` och `manus`.
  - Verifierade och exporterade samtliga 31 diskreta Manus-verktyg från `packages/data-provider/src/manus/manusTools.ts` och byggde dist-artefakter i `packages/data-provider/dist/manus/`.
  - Skapade split-workspace-komponenten `client/src/components/ManusStudio/ManusWorkspaceView.tsx` med:
    - **Live Terminal & Stdin:** Processväljare med status, mörk monospace-terminal med automatisk rullning och färgkodad loggutmatning, interaktiv stdin-kommandobar (`useSendStdinMutation`), processavslutning (`useKillProcessMutation`) och realtidsuppdatering.
    - **Live Browser & Port Preview:** Portväljare (`useExposedPortsQuery`), snabbexponering av portar (`useExposePortMutation`), URL-fält med direktlänk i nytt fönster och inbäddad sandbox-iframe.
    - **Responsive Dock:** Flexibel bredd (460px/540px) med kollapsknapp som minimerar vyn till en smidig vertikal sidoknapp för full bredd åt chatten vid behov.
  - Monterade `ManusWorkspaceView` i `client/src/routes/AppRoute.tsx` så att alla som navigerar till `/app/manus/:conversationId?` direkt får den delade Manus-arbetsytan.
  - Byggde enhetstestsviter i `packages/data-provider/src/manus/__tests__/manusPrompt.spec.ts` och `client/src/components/ManusStudio/__tests__/ManusWorkspaceView.spec.tsx` (100% gröna tester).

#### Fas 38: Cognition Devin & DeepWiki Engine (`/app/devin`)
- **Syfte:** Integrera Devins autonoma ingenjörsflöde och dess arkitektur-wiki.
- **Filer:**
  - `client/src/components/DevinStudio/DeepWikiPanel.tsx`
  - `client/src/components/DevinStudio/DevinWorkspaceView.tsx`
  - `client/src/components/DevinStudio/index.ts`
  - `client/src/components/DevinStudio/__tests__/DeepWikiPanel.spec.tsx`
  - `client/src/components/DevinStudio/__tests__/DevinWorkspaceView.spec.tsx`
  - `client/src/data-provider/Devin/queries.ts`
  - `client/src/data-provider/Devin/index.ts`
  - `client/src/routes/AppRoute.tsx`
  - `client/src/routes/__tests__/AppRoute.spec.tsx`
  - `api/server/routes/cowork.js`
  - `packages/data-provider/src/apps/prompts/devinPrompt.ts`
  - `packages/data-provider/src/apps/promptStore.ts`
  - `packages/data-provider/src/apps/__tests__/devinPrompt.spec.ts`
  - Promptkälla: `My system prompts/Devin AI/DeepWiki Prompt.txt` & `My system prompts/Devin AI/Prompt.txt`
- **Checklista:**
  - [x] Montera Devin AI systemprompt.
  - [x] Skapa en DeepWiki-sidopanel som automatiskt genererar och visar arkitekturkartor och moduldokumentation för kodbasen.
  - [x] Koppla arkitektur-noder till klickbara fillänkar i repot.
- **Verifiering:** Generera en DeepWiki-översikt över ett delprojekt och verifiera visualiseringen.
- **Resultat (Fas 38 slutförd):**
  - Monterade Cognition Devins autentiska systemprompter (`DEVIN_SWE_PROMPT`, `DEVIN_DEEPWIKI_PROMPT` och `DEVIN_AGENT_PROMPT`) i `packages/data-provider/src/apps/prompts/devinPrompt.ts` och `promptStore.ts`. Inkluderar fullständiga kommandon (`<think>`, `<shell>`, `<open_file>`, `<str_replace>`, `<find_filecontent>`, `<go_to_definition>`, `<navigate_browser>`, `<deploy_frontend>`) samt `<cite repo="..." path="..." start="..." end="..." />`-disciplin och uncolored quoted Mermaid-standard.
  - Implementerade backend-endpoints i `api/server/routes/cowork.js`:
    - `GET /api/cowork/devin/wiki`: Returnerar systemarkitektur, nodtopologi, modullista och verifierade källkodscitat.
    - `POST /api/cowork/devin/inspect`: Säker filinspektion med gränssnittskontroll (path traversal guard mot reporoten) och radnummerformatterade kodsnuttar.
    - `POST /api/cowork/devin/wiki/generate`: Målstyrd arkitekturanalys per delsystem/modul.
  - Skapade `client/src/data-provider/Devin/queries.ts` med `useDeepWikiQuery`, `useInspectCodeMutation` och `useGenerateWikiMutation`.
  - Byggde `client/src/components/DevinStudio/DeepWikiPanel.tsx` och `DevinWorkspaceView.tsx`:
    - **Architecture Map:** Interaktiv systemtopologi över moduler (Client, API Server, Agent Runtime, Data Provider, Manus Workspace, Devin DeepWiki) med klickbara modulkort och djupdykning.
    - **DeepWiki Docs:** Strukturerade arkitekturinvarianter och klickbara `<cite>`-referenser som omedelbart öppnar kodrader.
    - **Code Inspector:** Live källkodsgranskare med radnummer, kopieringsfunktion och direktfilinspektion.
    - **Responsive Dock:** Kollapsbar sidopanel med 32px vertikal dockningsknapp (`devin-workspace-expand-btn`).
  - Monterade `DevinWorkspaceView` i `client/src/routes/AppRoute.tsx` under `/app/devin/:conversationId?`.
  - Byggde fullständiga enhetstester i `packages/data-provider/src/apps/__tests__/devinPrompt.spec.ts`, `client/src/components/DevinStudio/__tests__/DeepWikiPanel.spec.tsx`, `client/src/components/DevinStudio/__tests__/DevinWorkspaceView.spec.tsx` och `client/src/routes/__tests__/AppRoute.spec.tsx` (100% gröna tester).

#### Fas 39: Coding Specialist Studios (Cursor, Windsurf, Kiro/Traycer)
- **Syfte:** Specialiserade kodningsmiljöer med snabba diffar, TDD-disciplin och självläkande dev-servers.
- **Filer:**
  - `client/src/components/CodeStudios/CursorDiffStudio.tsx`
  - `client/src/components/CodeStudios/WindsurfDevServerStudio.tsx`
  - `client/src/components/CodeStudios/KiroDualModeStudio.tsx`
  - `client/src/components/CodeStudios/CodingStudioWorkspaceView.tsx`
  - `client/src/components/CodeStudios/index.ts`
  - `client/src/components/CodeStudios/__tests__/CursorDiffStudio.spec.tsx`
  - `client/src/components/CodeStudios/__tests__/WindsurfDevServerStudio.spec.tsx`
  - `client/src/components/CodeStudios/__tests__/KiroDualModeStudio.spec.tsx`
  - `client/src/components/CodeStudios/__tests__/CodingStudioWorkspaceView.spec.tsx`
  - `client/src/routes/AppRoute.tsx`
  - `client/src/routes/__tests__/AppRoute.spec.tsx`
  - `packages/data-provider/src/apps/prompts/codingSpecialists.ts`
  - `packages/data-provider/src/apps/promptStore.ts`
  - `packages/data-provider/src/apps/__tests__/codingSpecialists.spec.ts`
  - Promptkällor: `Cursor Prompts/Agent Prompt 2.0.txt`, `Windsurf/Prompt Wave 11.txt`, `Kiro/Spec_Prompt.txt`, `Traycer/`
- **Checklista:**
  - [x] `/app/cursor`: Monaco DiffEditor med blixtsnabb search/replace och cherry-pick accept/reject.
  - [x] `/app/windsurf`: Live Dev Server preview med automatisk konsolfelsfångare och auto-healing loop.
  - [x] `/app/kiro`: Dual-Mode väljare (Spec Mode för arkitektur/TDD vs. Vibe Mode för snabb UI-kod).
- **Verifiering:** Testa att växla mellan Spec Mode och Vibe Mode i composern.
- **Resultat (Fas 39 slutförd):**
  - Monterade autentiska systemprompter för Coding Specialists i `packages/data-provider/src/apps/prompts/codingSpecialists.ts` och `promptStore.ts`:
    - `CURSOR_COMPOSER_PROMPT`: Kirurgisk multi-file diff-redigering, semantisk `codebase_search` och atomic diff-regler.
    - `WINDSURF_CASCADE_PROMPT`: Windsurf AI Flow paradigm, proaktiv konsolfelsavlyssning och självläkande dev-server loop.
    - `KIRO_SPEC_PROMPT`, `KIRO_VIBE_PROMPT`, `KIRO_DUAL_MODE_PROMPT`: Dual-mode väljare med TDD/minimal-code invariant för Spec Mode och snabb scaffolding för Vibe Mode.
  - Byggde specialiserade komponenter i `client/src/components/CodeStudios/`:
    - **Cursor Studio (`CursorDiffStudio`):** Röd/grön diffvy (Original vs Proposed), filväljare, snabb search/replace i ändringsblock och cherry-pick accept/reject med visual statusindikering (`PENDING`, `ACCEPTED`, `REJECTED`).
    - **Windsurf Wave (`WindsurfDevServerStudio`):** Integrerad med `/api/cowork/dev-server/*`, live sandboxed preview-iframe, realtidsavlyssnare för webbläsarkonsolloggar samt interaktiv "Auto-Heal"-åtgärd.
    - **Kiro / Traycer (`KiroDualModeStudio`):** Direkt omkopplare mellan Spec Mode (arkitekturinvarianter, TDD-checklista) och Vibe Mode (snabbkomponentmallar).
    - **Unified Dock (`CodingStudioWorkspaceView`):** Delad split-vy med responsiv 32px vertikal dockningsknapp som frigör full bredd åt chatten vid behov.
  - Integrerade i `client/src/routes/AppRoute.tsx` under `/app/cursor`, `/app/windsurf` och `/app/kiro`.
  - Skapade fullständiga enhetstester med 100% gröna resultat i samtliga sviter.

---

### BLOCK 5: Builders & Living Office Workspaces (Fas 40–42)

#### Fas 40: v0 Studio Integration (`/app/v0`)
- **Syfte:** Blixtsnabb generering av moderna React 19 UI-komponenter med interaktiva form-kort och live preview.
- **Filer:**
  - `client/src/components/v0Studio/v0StudioView.tsx`
  - `client/src/components/v0Studio/v0AskUserQuestionsCard.tsx`
  - `client/src/components/v0Studio/index.ts`
  - `client/src/components/v0Studio/__tests__/v0StudioView.spec.tsx`
  - `client/src/routes/AppRoute.tsx`
  - `client/src/routes/__tests__/AppRoute.spec.tsx`
  - `packages/data-provider/src/apps/prompts/v0Prompt.ts`
  - `packages/data-provider/src/apps/promptStore.ts`
  - `packages/data-provider/src/apps/__tests__/v0Prompt.spec.ts`
  - Promptkälla: `My system prompts/v0 Prompts and Tools/Prompt.txt`
- **Checklista:**
  - [x] Montera den officiella v0-systemprompten och dess shadcn/ui komponentstandarder.
  - [x] Koppla verktyget `AskUserQuestions` som automatiskt renderar interaktiva formulärkort i chatten vid otydliga specifikationer.
  - [x] Integrera Sandpack React 19 Runner med responsiv multi-viewport (Desktop, Tablet, Mobile) i högerpanelen.
- **Verifiering:** Be v0 bygga en "Dashboard" och besvara de genererade formulärkorten direkt i chatten.
- **Resultat (Fas 40 slutförd):**
  - Monterade den officiella v0-systemprompten (48 kB) i `packages/data-provider/src/apps/prompts/v0Prompt.ts` och `promptStore.ts`:
    - Innehåller shadcn/ui komponentregler, Next.js App Router, Tailwind CSS, Radix UI-primitiver och Lucide Icons.
    - Fullständig integrering av verktyget `AskUserQuestions` (prohibition mot parallella anrop, formulärkort med flervalsfrågor och rekommendationer).
    - React 19 / Next.js 16 cachingdirektiv (`use cache`, `revalidateTag`, `updateTag`) och dubbeldollar-LaTeX (`$$`).
  - Byggde v0 Studio i `client/src/components/v0Studio/`:
    - **Multi-Viewport Runner:** Desktop (100% Fluid), Tablet (768px) och Mobile (375px) med direkt växling och responsiv visning.
    - **Interactive Clarification Card (`v0AskUserQuestionsCard`):** Fullt interaktivt formulärkort för `AskUserQuestions` med flervalsalternativ, radioknappar och "Submit Answers to v0"-flöde som matar in svaren i chatten.
    - **Component Presets & TSX Code:** Färdiga moderna komponentmallar (Dashboard Analytics, SaaS Pricing Cards) samt syntax-kopiering.
    - **Responsive Dock:** Kollapsbar sidopanel med 32px vertikal dockningsknapp (`v0-studio-expand-btn`).
  - Monterade `v0StudioView` i `client/src/routes/AppRoute.tsx` under `/app/v0/:conversationId?`.
  - Byggde fullständiga enhetstester i `packages/data-provider/src/apps/__tests__/v0Prompt.spec.ts`, `client/src/components/v0Studio/__tests__/v0StudioView.spec.tsx` och `client/src/routes/__tests__/AppRoute.spec.tsx` (100% gröna tester).

#### Fas 41: Lovable & Full-Stack App Builders (`/app/lovable` & `/app/bolt`)
- **Syfte:** Full-stack app-generering med databasscheman och live molndriftsättning.
- **Filer:**
  - `packages/data-provider/src/apps/prompts/fullStackBuilders.ts`
  - `packages/data-provider/src/apps/promptStore.ts`
  - `packages/data-provider/src/apps/__tests__/fullStackBuilders.spec.ts`
  - `client/src/components/Builders/FullStackStudio.tsx`
  - `client/src/components/Builders/index.ts`
  - `client/src/components/Builders/__tests__/FullStackStudio.spec.tsx`
  - `client/src/routes/AppRoute.tsx`
  - `client/src/routes/__tests__/AppRoute.spec.tsx`
  - Promptkällor: `My system prompts/senast uppdaterad 2 veckor sedan/Lovable/Agent Prompt.txt`, `My system prompts/senaste uppdatering förra månaden/LOVABLE/Lovable_2.0.txt`, `My system prompts/senast uppdaterad 2 veckor sedan/Open Source prompts/Bolt/Prompt.txt`
- **Checklista:**
  - [x] Montera Lovable Agent prompt med Supabase SQL schema design och realtids-prenumerationer.
  - [x] Bolt.new snabbstartsmallar för Vite + Tailwind.
  - [x] Fullskärms iframe-preview med konsolloggar.
- **Verifiering:** Generera ett Supabase SQL-schema och se komponenten uppdateras i förhandsgranskningen.
- **Resultat & Genomförande:**
  - Skapade `packages/data-provider/src/apps/prompts/fullStackBuilders.ts` med fullständiga autentiska `LOVABLE_BUILDER_PROMPT` och `BOLT_BUILDER_PROMPT` samt dynamiska miljövariabler (`{{CURRENT_DATE}}`, `{{WORKING_DIRECTORY}}`, `{{CURRENT_OS}}`, `{{KNOWLEDGE_CUTOFF}}`).
  - Registrerade och monterade prompts i `promptStore.ts` för nycklarna `lovable`, `lovable-builder`, `bolt`, `bolt-new`.
  - Byggde `FullStackStudio.tsx` med:
    - **Live Sandboxed App Preview:** Responsive viewport (Desktop 100%, Tablet 768px, Mobile 375px), URL bar (`http://localhost:5173/`), port-väljare och realtids konsolfeed med rensningsmöjlighet.
    - **Supabase SQL Schema Studio:** Interaktiv tabellväljare (`profiles`, `products`, `messages`), kolumndefinitioner med datatyper/nycklar, RLS policy viewer med aktiva säkerhetsregler (`auth.uid() = id`), och simulerad "Run SQL Migration" med animerad bekräftelsenotis och export.
    - **Starter Templates:** Snabbstartsmallar för SaaS Supabase Auth, Real-Time Chat och E-Commerce Marketplace med "Use Starter"-injektion.
    - **Collapsible Responsive Dock:** Samma 32px slimmade vertikala dockningsknapp som i Devin och v0 (`lovable-studio-expand-btn` / `bolt-studio-expand-btn`).
  - Monterade i `client/src/routes/AppRoute.tsx` för både `/app/lovable` och `/app/bolt`.
  - Skapade fullständiga enhetstester i `fullStackBuilders.spec.ts`, `FullStackStudio.spec.tsx` och `AppRoute.spec.tsx` med 100% testtäckning.

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

---

## Genomfört Arbete: Fas 27 (Authentic Prompt Store & Placeholder Engine)

### 1. Kärnmotor & Autentiska Prompter (`packages/data-provider/src/apps/promptStore.ts`)
- **Autentiska Prompts (`AUTHENTIC_PROMPTS`):**
  - Strukturerade och kapslade in råa systemprompts för samtliga 22 appar (100% täckning mot `APPS_REGISTRY`):
    - `claude-chat`, `claude-cowork`, `claude-design`, `claude-code`.
    - `manus-agent` (30+ verktyg, process loop, port exposure).
    - `cognition-devin` (test-first felreproduktion, sandbox isolering).
    - `cursor-composer` (multi-fil diffs, symbol tracing, search/replace).
    - `windsurf-cascade` (dev server preview, real-time console feedback).
    - `kiro-dual-mode` (Spec mode arkitektur vs Vibe mode rapid UI).
    - `replit-agent` (container sandbox, host binding 0.0.0.0, cloud deployment).
    - `xai-grok-build` (höghastighets systems coding, parrallella anrop).
    - `cline-operator` (human-in-the-loop bekräftelsespärrar).
    - `v0-generative-ui` (shadcn/ui, Tailwind CSS, AskUserQuestions form cards).
    - `lovable-builder` (Supabase, PostgreSQL RLS, live preview).
    - `living-office` (Word, Excel formler `=SUM`, `=AVERAGE`, PowerPoint 16:9).
    - `notion-studio` (hierarkiska dokumentblock, databastabeller).
    - `bolt-new` (WebContainers i webbläsaren, Vite scaffolding).
    - `higgsfield-builder` (React 19 SSR, multimedia AI video/foto).
    - `perplexity-computer` (multi-hop 4-stegs syntes, citatbadges `[1]`, on-demand `list_external_tools`).
    - `chatgpt-atlas` (fliknavigering, sidchatt, källsyntes).
    - `brave-deepsearch` (oberoende index, spårningsfri webbextraktion).
    - `connector-hub` (on-demand MCP discovery, `@mention`-triggere).
- **Dynamisk Interpoleringsmotor:**
  - `interpolatePrompt(template, options)`: Blixtsnabb regex-ersättning av `{{CURRENT_DATE}}`, `{{WORKING_DIRECTORY}}`, `{{USER_NAME}}`, `{{CURRENT_OS}}`, `{{KNOWLEDGE_CUTOFF}}`, `{{APP_NAME}}` samt valfria custom parametrar.
  - `getDefaultPlaceholders()`: Genererar realtidsdatum, användarnamn och standardmiljö.
  - `getAuthenticPrompt(promptId, options)`: Hämtar och interpolerar prompt med fallback till `claude-chat`.
  - `hasPrompt(promptId)` och `getAllPromptIds()`: Säker validering och uppslagning.
- Re-exporterat från `packages/data-provider/src/apps/index.ts`.

### 2. Verifiering & Enhetstester
- `promptStore.spec.ts`:
  - 100% assertions godkända.
  - Verifierar att samtliga 22 appar i `APPS_REGISTRY` har en matchande autentisk prompt.
  - Verifierar interpolation av standardplaceholders, anpassade variabler och case-insensitiv uppslagning.
  - Verifierar säker fallback till `claude-chat`.
- Formatering med `npm run sort-imports`.


