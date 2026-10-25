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

## Fas 15 — Djupa luckor: Design Canvas & Aggregering

- [x] Design Canvas kopplad till artifacts-pipelinen (`:::artifact` och `store.artifactsState`), Sandpack React runner och sandboxed iframe för HTML-artefakter; "Acme Corp"-placeholder borttagen
- [x] Dynamisk lager- och tokenextraktion (`designExtractor.ts`) inspirerad av UI-TARS AST-parsing och Browser-Use element-indexering med 5 gröna enhetstester
- [x] Multi-viewport preview (Desktop/Tablet/Mobile), versionshistorik och direkt export till `.tsx` / `.html`-filer samt urklipp
- [x] Utökad `skill/live-docs-and-slides/SKILL.md` med `@media print`-regler och PDF-export via Playwright print-capability (`browser_pdf_save`)
- [x] Verifierad PDF-generering end-to-end (125 KB presentationsdokument genererat utan mock)
- [x] Arkitekturskiss för `browser-use` som separat isolerad container-service dokumenterad i `docs/tasks/015-design-aggregation.md`

→ [docs/tasks/015-design-aggregation.md](tasks/015-design-aggregation.md)

## Fas 16 — Anpassning till nya Claude-uppdateringen ("Cowork and chat are now one Claude")

- [x] Katalogisering och systematisk analys av 76 batch-5 skärmdumpar i `docs/ui-reference/batch-5-screenshots.md`
- [x] Detaljerad diff-analys i `docs/tasks/016-claude-update-diff.md`
- [x] Enhetlig promptbox: segmenterad `ComposerModeToggle` borttagen, ersatt med `PermissionModePopover` (`Auto` vs `Manual`), prompt-optimerare och `RecordSkillModal`
- [x] Aktiv bakgrundsjobb-indikator (`⏱ •`) på samtal och sidonavigering kopplad till verkliga `/api/cowork/tasks`
- [x] Plans & Checklist-panel (`PlansPanel.tsx` under SidePanel) driven av `parsePlanChecklist` i `actionParser.ts` med realtidsuppdatering och interaktiv avbockning
- [x] Inställningar: "Time and focus"-flik (`TimeAndFocusTab.tsx`) med paus-påminnelser och 7-dagars lugna timmar (`S M T W T F S`)
- [x] Fullständig verifiering med dedikerade tester och noll TypeScript/ESLint-fel

→ [docs/tasks/016-claude-update-diff.md](tasks/016-claude-update-diff.md)

## Fas 17 — Superpower Platform: Från Videokritik till Marknadsledande App

Systematisk integration av styrkorna från marknadens bästa verktyg (Cursor, Perplexity, Make.com, Claude, Nano Banana 2, Higgsfield) och eliminering av svagheterna i ChatGPT, Gemini, Apple Shortcuts och Lovable:
- [x] Detaljerad video-breakdown och komparativ "Varför"-analys dokumenterad i `docs/tasks/017-video-critique-masterplan.md`
- [x] Brainstorming: Sokratisk idéutveckling utan sycophancy via `skill/socratic-brainstorm/`
- [x] Coding: In-app visual diffs i Artifacts (Monaco DiffEditor med Accept/Revert/Copy) samt utökad repo-medvetenhet
- [x] Automations: Deterministiska triggers och visuell exekveringslogg (Make.com node flow + execution logs) kopplad till `/api/cowork/tasks`
- [x] Image generation: Integrera Nano Banana 2 / Google Imagen 3 och conversational in-painting i Artifacts
- [x] Learning: Källhänvisningar i realtid med klickbara citationsbadges `[1]` och utdragspanel
- [x] Web building: Higgsfield MCP Website Builder-koppling och live React 19 / TanStack preview i Artifacts

→ [docs/tasks/017-video-critique-masterplan.md](tasks/017-video-critique-masterplan.md)

## Fas 18–25 — Reverse Engineering All-in-One Superpower Architecture

Omfattande syntes av **samtliga 72 extraherade systemprompts och plattformar** (omfattande över 2 285 filer och 1 685 verktyg): Anthropic (Claude 1.0 till Opus 5.5/Fable 5.1, 39 skills), OpenAI (GPT-3.5 till GPT-6 Astra/Sol, Atlas, o3), Google (Gemini 1.5 till 3.7 Flash, Nano Banana 2, Jules, Antigravity), xAI (Grok 1 till 4.7-CLI, Grok Build), Meta (Llama 4, Muse Spark 1.0–1.2), DeepSeek (V3, R1), GLM-4/ZCode, Moonshot Kimi, Mistral, Qwen, MiniMax, Doubao, samt samtliga 60 agenter och verktyg (Manus, Cursor, Windsurf, Devin, Trae, Replit, Kiro, Traycer, Augment, Same.dev, Cline, Blackbox, Xcode, v0, Lovable, Bolt, Perplexity, Notion, Docker Gordon, DuckAI, Atlassian Rovo, Roblox, Clyde, Opera, Proton, Hume m.fl.):

- [x] **Fas 18: Manus-Grade 30+ Tools & Interaktiv Process-Management** (`shell_write_to_process`, `deploy_expose_port`, Manus Agent State Machine)
- [x] **Fas 19: Dual-Mode Engine** (Spec Mode / Plan Mode vs. Vibe Mode / Phase Mode med Intent Classifier från Kiro & Traycer)
- [x] **Fas 20: Interactive In-Chat Form Cards** (`AskUserQuestions` / Generative UI form cards i chatten inspirerat av v0 och Antigravity)
- [x] **Fas 21: Full-Stack Web App Generator med Self-Healing Dev Server** (Live preview + Web console error feedback loop från Windsurf & Lovable)
- [x] **Fas 22: Deep Research Engine & Citation Badges** (Rekursiv sök-expansion och källcitatbadges från Perplexity & OpenAI Deep Research)
- [x] **Fas 23: Living Office Artifacts Generator** (Word `.docx`, Excel `.xlsx`, PowerPoint `.pptx`, PDF generator från GPT-5.6 Sol & Claude Office)
- [x] **Fas 24: Kognitiva Output Styles & Persona Switcher** (`/concise`, `/learning`, `/explanatory`, `/proactive` från Claude Code)
- [ ] **Fas 25: Perplexity Computer Connector Hub** (MCP Dynamic Tool Hub och on-demand `list_external_tools`)

→ [docs/tasks/018-reverse-engineer-all-in-one-masterplan.md](tasks/018-reverse-engineer-all-in-one-masterplan.md)

## Explicit ute ur scope tills vidare

Team-/orgadministration, fakturering, enterprise-SSO, native mobilapp, samt
desktop-native OS-inställningar (Run on startup, menyradsikon, globala
tangentbordsgenvägar) — meningslöst för en självhostad webbapp. Se
FEATURES.md "Inte relevant" och PLAN.md "Explicit uteslutet".

