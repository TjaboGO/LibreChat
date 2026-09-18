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
- [ ] Ordräknare-popover, usage-popover, `+`-meny med exakt de rader som
      syns i skärmdumparna (kräver nya kopplingar för Design system/Add
      plugins/Research; Web search + Memory kan koppla mot befintlig
      `useToolToggle`/`BadgeRowContext`-infrastruktur)
- [x] Effort/Thinking-väljare (fristående composer-knapp, se
      `docs/tasks/007-chat-app-p0.md` för avvikelsen mot en nästlad
      modell-flyout). Modellväljaren själv är oförändrad — Task 002
      verifierade redan att modellbyte fungerar mot alla OpenRouter-modeller.
- [ ] Output-format-dropdown (Docs/Slides/Design/Artifact)
- [ ] Settings-skal: vänster-nav grupperad i Settings/Desktop app/Customize
- [ ] Settings — Preferences, Account, Privacy-flikar
- [x] Ersätt `CoworkButton` med den riktiga Cowork-modellen (se Fas 4-anteckning)

→ [docs/tasks/007-chat-app-p0.md](tasks/007-chat-app-p0.md)

## Fas 7 — Pixelmatchning: Claude chat-appen (P1)

- [ ] Projects: lista + detaljsida (Instructions/Memory/Context/Folder/Scheduled) +
      "Set project instructions"-modal
- [ ] Artifacts-lista: All/Yours/Shared, "Make something new"-kort, datumgrupperad lista
- [ ] Settings — Memory-flik (UI ovanpå befintlig `packages/api/src/memory`-backend)
- [ ] Settings — Capabilities-flik
- [ ] Settings — Skills-flik (UI ovanpå befintligt skills-system)
- [ ] Settings — Connectors-flik (UI ovanpå befintlig MCP-config)
- [ ] Cowork-uppgiftslista + Devices-undermeny

→ [docs/tasks/008-chat-app-p1.md](tasks/008-chat-app-p1.md)

## Fas 8 — Pixelmatchning: Claude chat-appen (P2)

- [ ] Chats-and-tasks-fullista med filter (All/Chat/Shared/Cowork/Archived)
- [ ] Settings — Design systems, Plugins, Extensions/Developer-flikar
- [ ] Chat Info-modal
- [ ] Kontomeny (Settings/Usage/Language/Get help/osv.)

→ [docs/tasks/009-chat-app-p2.md](tasks/009-chat-app-p2.md)

## Fas 9 — Claude Codes eget dashboard (claude.ai/code)

Stor, separat produktyta: eget dashboard ("What's up next?"), Routines,
Folders, repo/branch/worktree-chips, användningsstatistik med heatmap,
Artifacts-sida med Prompts/Chains. Kräver egen detaljplanering när Fas 6–8 är
klara — börja inte innan chat-appens grund (tema, komponenter, Settings-skal)
är på plats, eftersom allt här återanvänder den grunden.

- [ ] Detaljplan skriven (bryt ner i egna tasks, likt Fas 6–8)
- [ ] Dashboard med usage-stats + heatmap
- [ ] Routines (mappa mot befintlig scheduled-agents-backend, se Fas 5)
- [ ] Folders + Prompts/Chains

## Fas 10 — Claude Design-appen

Fristående design-canvas: mallgalleri, designsystem (Figma/GitHub-koppling),
tabellvy för projekt. Störst enskild insats i hela planen — kräver ett
canvas/design-rendering-lager som inte finns i LibreChat alls. Börja sist.

- [ ] Detaljplan skriven
- [ ] Mallgalleri + tom "What should we create?"-startsida
- [ ] Designsystem-hantering
- [ ] Canvas-renderare

## Explicit ute ur scope tills vidare

Team-/orgadministration, fakturering, enterprise-SSO, native mobilapp, samt
desktop-native OS-inställningar (Run on startup, menyradsikon, globala
tangentbordsgenvägar) — meningslöst för en självhostad webbapp. Se
FEATURES.md "Inte relevant" och PLAN.md "Explicit uteslutet".

