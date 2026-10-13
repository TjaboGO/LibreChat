# Roadmap

Faserna är sekventiella men inte strikt blockerande — Orca kan dispatcha flera
uppgifter inom en fas parallellt till olika worktrees så länge de inte rör samma
filer. Varje fas har motsvarande biljetter i [docs/tasks/](tasks/).

## Fas 0 — Bootstrap (klart eller nästan klart)

- [x] Forka LibreChat, arkivera uppströms-dokumentation i `docs/upstream/`
- [x] Skriva planeringsdokumenten (den här filen + RESEARCH/FEATURES/ARCHITECTURE)
- [x] Skaffa OpenRouter-nyckel, verifiera lokal uppstart (inkl. MongoDB-fixen för
      Apple Silicon)
- [ ] Döpa om projektet från arbetsnamnet "Claude Copycat" om du vill ha ett riktigt
      produktnamn

→ [docs/tasks/001-bootstrap-and-openrouter.md](tasks/001-bootstrap-and-openrouter.md)

## Fas 1 — Modell-lager och grundläggande verifiering

- [x] Koppla in OpenRouter enligt ARCHITECTURE.md, lägg till DeepSeek direkt som
      andra provider
- [x] Verifiera streaming, modellbyte, extended-thinking-rendering fungerar mot
      minst en reasoning-modell (DeepSeek-R1) och en icke-reasoning-modell
- [x] Verifiera Artifacts-panelen renderar kod/React/Mermaid från en OpenRouter-modell
      (inte bara Anthropic/OpenAI som LibreChat testar mot som standard)

→ [docs/tasks/002-verify-model-layer.md](tasks/002-verify-model-layer.md)

## Fas 2 — Rebrand till Claude-look

- [x] Definiera Claude-liknande färgpalett/typografi i temaregistret (inte per
      komponent)
- [x] Byt logotyp, produktnamn, favicon, onboarding-texter
- [x] Gå igenom layouten (sidopanel, chattbubblor, Artifacts-split-view) mot
      referensskärmdumpar av Claude-appen

→ [docs/tasks/003-claude-look-rebrand.md](tasks/003-claude-look-rebrand.md)

## Fas 3 — Skills, Agents-marknadsplats, MCP i praktiken

- [x] Skapa 2-3 egna Skills (SKILL.md + ev. scripts) som verkligt test av
      skills-systemet
- [x] Koppla in minst en extern MCP-server (t.ex. filsystem eller webbsök) och
      verifiera OAuth-flödet / funktionalitet
- [x] Gå igenom agent-marknadsplatsens UI och städa bort det som är LibreChat-
      specifikt varumärke

→ [docs/tasks/004-skills-and-mcp.md](tasks/004-skills-and-mcp.md)

## Fas 4 — "Cowork" och subagents synligt i UI — ⚠️ KORRIGERAS I FAS 6

- [x] Exponera subagent-/child-conversation-modellen som en tydlig
      "samarbeta med fler agenter i den här sessionen"-yta (backend finns redan,
      se ARCHITECTURE.md)
- [x] Bygg en enkel vy för "Subagent activity stream" (finns redan som datakälla)

**Efter en genomgång av 79 referensskärmdumpar (se
[docs/ui-reference/PLAN.md](ui-reference/PLAN.md)) visade det sig att
`CoworkButton` i chat-headern inte matchar den riktiga Cowork-funktionen.**
Riktiga Cowork är en Chat/Cowork-segmentväxlare i composern + en uppgiftslista
under den + en egen Settings-flik — inte en headerknapp som öppnar en
subagent-panel. Ersätts i Fas 6.

→ [docs/tasks/005-cowork-and-subagents.md](tasks/005-cowork-and-subagents.md)

## Fas 5 — De riktiga luckorna

- [x] Schemalagda/bakgrundskörande agenter (bygg på "Subagent completion
      wakeup"-mönstret, se ARCHITECTURE.md — inte ett nytt system)
- [x] Computer use (sandboxad browser/skärm-worker) — störst enskild insats,
      gör sist och bara om det faktiskt behövs
- [x] (Stretch) Claude Docs/Slides-liknande levande dokument

→ [docs/tasks/006-scheduled-agents-and-computer-use.md](tasks/006-scheduled-agents-and-computer-use.md)

## Fas 6 — Pixelmatchning: Claude chat-appen (P0)

Baserat på skärm-för-skärm-inventeringen i
[docs/ui-reference/PLAN.md](ui-reference/PLAN.md). Skärmdumparna är facit —
inklusive den dubbla Chat/Cowork-växlaren, eftersom Anthropics egen
sammanslagning ("Cowork and chat are now one Claude", 16 sep) ännu inte
rullats ut till det kontot skärmdumparna togs från.

- [x] Sidopanel-nav ombyggd: `+ New`, Projects, Artifacts, Scheduled, Design,
      Customize, More — i den ordningen, ersätter dagens "Start new chat"-knapp
- [x] Composer: Chat/Cowork-segmentväxlare (`ComposerModeToggle`, UI-läge
      klart — uppgiftslista/Devices-undermeny är Fas 7). `CoworkButton`
      omdöpt till `SubagentActivityButton` (rätt funktion, fel varumärke).
- [x] Composer `+`-meny: Chat- och Cowork-varianter med exakt de rader som
      syns i skärmdumparna (Add files, Screenshot, Add to project, Skills,
      Connectors, Design system, Add plugins, Research, Web search, Memory, Devices)
- [x] Effort/Thinking-väljare (fristående composer-knapp, se
      `docs/tasks/007-chat-app-p0.md` för avvikelsen mot en nästlad
      modell-flyout). Modellväljaren själv är oförändrad — Task 002
      verifierade redan att modellbyte fungerar mot alla OpenRouter-modeller.
- [x] Ordräknare-popover, usage-popover, output-format-dropdown (Docs/Slides/Design/Artifact)
- [x] Settings-skal: vänster-nav grupperad i Settings/Desktop app/Customize
- [x] Settings — Preferences, Account, Privacy, Billing & APIs samt placeholders för efterföljande faser
- [x] Ersätt `CoworkButton` med den riktiga Cowork-modellen (se Fas 4-anteckning)

→ [docs/tasks/007-chat-app-p0.md](tasks/007-chat-app-p0.md)

## Fas 7 — Pixelmatchning: Claude chat-appen (P1)

- [x] Projects: lista + detaljsida (Instructions/Memory/Context/Folder/Scheduled) +
      "Set project instructions"-modal
- [x] Artifacts-lista: All/Yours/Shared, "Make something new"-kort, datumgrupperad lista
- [x] Settings — Memory-flik (UI ovanpå befintlig `packages/api/src/memory`-backend)
- [x] Settings — Capabilities-flik
- [x] Settings — Skills-flik (UI ovanpå befintligt skills-system)
- [x] Settings — Connectors-flik (UI ovanpå befintlig MCP-config)
- [x] Cowork-uppgiftslista + Devices-undermeny

→ [docs/tasks/008-chat-app-p1.md](tasks/008-chat-app-p1.md)

## Fas 8 — Pixelmatchning: Claude chat-appen (P2)

- [x] Chats-and-tasks-fullista med filter (All/Chat/Shared/Cowork/Archived)
- [x] Settings — Design systems, Plugins, Extensions/Developer-flikar
- [x] Chat Info-modal
- [x] Kontomeny (Settings/Usage/Language/Get help/osv.)

→ [docs/tasks/009-chat-app-p2.md](tasks/009-chat-app-p2.md)

## Fas 9 — Claude Codes eget dashboard (claude.ai/code)

Stor, separat produktyta: eget dashboard ("What's up next?"), Routines,
Folders, repo/branch/worktree-chips, användningsstatistik med heatmap,
Artifacts-sida med Prompts/Chains. Kräver egen detaljplanering när Fas 6–8 är
klara — börja inte innan chat-appens grund (tema, komponenter, Settings-skal)
är på plats, eftersom allt här återanvänder den grunden.

- [x] Detaljplan skriven (bryt ner i egna tasks, likt Fas 6–8)
- [x] Dashboard med usage-stats + heatmap
- [x] Routines (mappa mot befintlig scheduled-agents-backend, se Fas 5)
- [x] Folders + Prompts/Chains

## Fas 10 — Claude Design-appen

Fristående design-canvas: mallgalleri, designsystem (Figma/GitHub-koppling),
tabellvy för projekt. Störst enskild insats i hela planen — kräver ett
canvas/design-rendering-lager som inte finns i LibreChat alls. Börja sist.

- [x] Detaljplan skriven
- [x] Mallgalleri + tom "What should we create?"-startsida
- [x] Designsystem-hantering
- [x] Canvas-renderare

→ [docs/tasks/011-claude-design-canvas.md](tasks/011-claude-design-canvas.md)

## Fas 11 — Systemintegration, Claude Code & Cowork Settings samt Polering

Slutförande av återstående inställningspaneler och systemintegration:
- [x] Settings — Claude Code-flik (`ClaudeCodeTab.tsx`) med General, Code appearance (teman och live diff-previews), Local sessions, Browser/Mobile simulators, Pull requests, och Authorization tokens-tabell
- [x] Settings — Cowork-flik (`CoworkTab.tsx`) med Require trusted devices, Cowork files-katalog, Trusted Cowork folders, Only on this computer, Preferred browser, Allowed sites
- [x] Fullständig navigationsintegration med rutter till `/code`, `/design`, `/chats`, `/artifacts`, `/scheduled`
- [x] 100% gröna enhetstester och noll TypeScript-fel i hela monorepot

→ [docs/tasks/012-system-integration-and-polish.md](tasks/012-system-integration-and-polish.md)

## Fas 12 — Sanning & Grund (Gap-audit)

- [x] Lokal uppstart av hela stacken verifierad (MongoDB på port 27017, inloggning mot `admin@example.com` fungerar och returnerar HTTP 200)
- [x] Fullständig auditering genomförd av samtliga funktioner i tabellen "Vad som är verkligt vs. mock" mot källkod och backend
- [x] `docs/tasks/GAP-AUDIT.md` upprättad med status `real|mock|dead|partial` per funktion

→ [docs/tasks/GAP-AUDIT.md](tasks/GAP-AUDIT.md)

## Fas 13 — Backend-wiring: Gör det befintliga verkligt

- [x] `MemoryTab.tsx` och dess modaler kopplade till `/api/memories` via React Query; `INITIAL_MEMORIES` borttaget
- [x] `/api/cowork/tasks` implementerad och kopplad till `scheduleSchema`, `ScheduleRun` och subagent-trådar; `CoworkTaskList` läser `useCoworkTasksQuery`, `DEFAULT_COWORK_TASKS` borttaget
- [x] `UsageLimitPopover.tsx` kopplad till verkligt tokensaldo och kvotinställningar via `useGetUserBalance`
- [x] `OutputFormatDropdown.tsx` / `outputFormatFamily` kopplad till promptgenerering i `ChatForm.tsx` (docs/slides/design-direktiv)
- [x] `ClaudeCodeTab.tsx` och `CodeDashboard.tsx`: `MOCK_TOKENS` borttaget och ersatt med `/api/api-keys`; statistik och heatmap beräknas dynamiskt från faktiska konversationer

→ [docs/tasks/013-backend-wiring.md](tasks/013-backend-wiring.md)

## Fas 14 — Verklig Computer Use: Browser Operator

- [x] Playwright MCP aktiverat i `librechat.yaml` (`@playwright/mcp` med `--headless` och `--caps=vision,pdf`)
- [x] Repo-extraktioner genomförda i `docs/refs/ui-tars-EXTRACTION.md` och `docs/refs/browser-use-EXTRACTION.md` med licensattribuering (Apache-2.0 / MIT)
- [x] Multimodal action-parser och koordinat-grounding implementerad i `packages/data-provider/src/browser/actionParser.ts` med 22 gröna unit-tester
- [x] `skill/browser-operator/SKILL.md` skapad med Reflection-Plan-Act-loop, HITL-säkerhetsgate och full MCP-verktygsmappning
- [x] Verifierad mot sandlådewebbplats utan mock (`scripts/demo-browser-operator.ts` kör mötesbokning end-to-end via Playwright MCP)

→ [docs/tasks/014-browser-operator.md](tasks/014-browser-operator.md)

## Explicit ute ur scope tills vidare

Team-/orgadministration, fakturering, enterprise-SSO, native mobilapp, samt
desktop-native OS-inställningar (Run on startup, menyradsikon, globala
tangentbordsgenvägar) — meningslöst för en självhostad webbapp. Se
FEATURES.md "Inte relevant" och PLAN.md "Explicit uteslutet".

