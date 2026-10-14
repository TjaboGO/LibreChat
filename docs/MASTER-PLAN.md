# MASTER-PLAN — Från mock till riktigt fungerande Claude-lik app

**Det här dokumentet är den övergripande planen som kompletterar [ROADMAP.md](ROADMAP.md).**
ROADMAP fas 0–11 markerar mycket som "klart" — men en genomgång av koden visar att
många funktioner är **UI byggd ovanpå mockdata**. Målet med den här planen är att få
funktionerna att *faktiskt fungera*, lika bra som Claude, och att löpande anpassa
appen när Anthropic uppdaterar Claude.

Allt i den här planen är **100 % gratis**: ingen avgiftsbelagd mjukvara, inga
API-avgifter utöver det du redan betalar (OpenRouter). All mjukvara är open source
(MIT/Apache-2.0), allt körs lokalt hos dig, och alla AI-modeller går via OpenRouter
som idag. Kostnaden är din tid + agentens körzeit.

---

## Vad som är verkligt vs. mock (verifierad i koden)

| Funktion | Status | Bevis / fil |
|---|---|---|
| Chat, streaming, artifacts, agents, MCP, schedules | ✅ Riktigt (LibreChat-backend) | `packages/api/src/schedules`, `api/server/routes/schedules.js` |
| Cowork-uppgiftslistan | ❌ Mock | `DEFAULT_COWORK_TASKS` hårdkodad i `CoworkTaskList` |
| Minnen (Memory) | ⚠️ Delvis | `INITIAL_MEMORIES` mock i `MemoryTab`; riktiga `memories-routes` finns i backenden men är inte kopplade |
| Claude Code-dashboard | ❌ Mock | `MOCK_TOKENS` i `ClaudeCodeTab`; `/code`-rutten renderar statisk data |
| Design Canvas | ❌ Mock | Renderar placeholder, ingen riktig genereringspipeline |
| OutputFormatDropdown | ❌ Död kod | Finns som komponent men ingen konsument importerar den |
| UsageLimitPopover | ⚠️ Mock-siffror | Visar påhittade procentvärden, ingen riktig usage-källa |
| Computer Use / browser | ❌ Påstått i task 006 men ingen aktiv browser-MCP | `librechat.example.yaml` har puppeteer-MCP **kommenterad**; ingen playwright i config |

**Slutsats:** Fas 6–11 har byggt *pixelrätt skal* — nu ska organ in.

---

## Beslut: de tre rekommenderade reposen

Alla tre är gratis och open source. Rekommendationen är **att läsa dem som referenskällor och plocka kodsnitt/mönster — aldrig vendora hela repo:t** in i LibreChat-forken (underhållsmardröm vid upstream-merge).

### 1. bytedance/ui-tars (Apache-2.0) — LÅNA TÄNKANDET, inte motorn
- **Varför:** Världsklass på just computer use. deras "Agent-TARS" system prompt, Grounding Prompt (MRP = Micro Actions / Report / Plan), action-schema och refusal/safety-mönster är exakt det som gör agenter som "ser" skärmen bra.
- **Hur vi använder det:** Antigravity-läsning av `packages/electron-app/.../prompt`, `operator/`, `umount-action-parser`. Vi **implementerar om mönstren** som:
  - En ny skill `skill/computer-use-operator/SKILL.md` med översatta/omskrivna MRP- och grounding-prompter.
  - Ett TypeScript action-parser-mönster för verktygsanrop (klik/scroll/dra/tangenttryck) som vår browser-MCP-användning följer.
- **Vi tar INTE:** Electron-shell, den lokala TARS-visionmodellen (kräver GPU), RL-träningen.

### 2. browser-use/browser-use (MIT) — KÖR SOM TJÄNST, låna DOM-beskrivningen
- **Varför:** Braaste open source-webbläsaragenten; dess sätt att serialisera sidan till numrerade, siktbara element ("indexed DOM tree") är det bästa fria alternativet till Anthropics proprietary screenshot-computer-use.
- **Hur vi använder det:**
  - Primärt: kör **Playwright MCP** (`@playwright/mcp`, Apache-2.0, gratis) som LibreChats browser-MCP — det ger deterministic accessibility-tree-verktyg utan visionmodell.
  - Inspiration från browser-use: läsa `browser_use/dom/`, `browser_use/agent/system_prompt.py`, `browser_use/agent/message_manager/` och lyft idéer till vår egen MCP-agent-prompt + ev. köra browser-use självt i en container bakom en liten HTTP/MCP-wrapper som en *valfri* motor.
  - Inget Python-kod importeras direkt i TS-koden; antingen wrapper-service eller rena mönster.
- **Vi tar INTE:** deras LLM-beroenden (de kör sina egna modeller via API) — våra modeller kommer från OpenRouter.

### 3. aaif-goose/goose (Apache-2.0) — AVSTÅ SOM MOTOR, låna extension-idéer
- **Varför:** Goose är Block/AAIFs agent-ramverk — det dubblerar i stort sett det LibreChats eget agents+MCP-lager redan gör. Att köra två agentmotorer i samma app blir bara konflikt.
- **Hur vi använder det:** Läsning för inspiration: `goose/extensions/` (särskilt desktop/tmux/screen-reader-extensioner för hur man exponerar OS-nivåverktyg via MCP), deras subagent-reducering/journalling-mönster → idéer för vår Cowork-backend.
- **Undantag:** Enskilda goose extensions som redan finns som fristående MCP-servrar kan kopplas in direkt i `librechat.yaml` utan att ta med resten.

**Prioritetsordning:** browser-use (får webben att fungera NU) → ui-tars (gör agenten smart på skärmen) → goose (polish/subagent-mönster).

---

## Kostnads­garanti (varför allt är gratis)

| Post | Kostnad |
|---|---|
| ui-tars, browser-use, goose, Playwright MCP | 0 kr — MIT/Apache-2.0, self-hostat |
| Chromium/Playwright-browsers | 0 kr — laddas ner lokalt |
| Modellanrop | Oförändrat — samma OpenRouter-nyckel som idag (ev. DeepSeek för billiga agentloop) |
| Anthropic-Claude-uppdateringsspaning | 0 kr — gratis webbsök/newsletter + manuell koll; ingen betal-API krävs |
| Testkörningar | 0 kr — existerande vitest/playwright-e2e i repo:t |

Enda potentiella kostnad: om du väljer att köra en lokal visionmodell för screen-grounding (rekommenderas EJ — Playwright MCP:s accessibility-träd behövs ingen modellextra).

---

## Faser

### Fas 12 — Sanning & Grund (blockerande för allt annat)
**Mål:** Kunna köra appen och veta exakt vad som är sant.
1. Starta hela stacken (mongo, redis, api, client) och logga i med riktig användare.
2. Agenten läser igenom varje "klart"-funktion mot listan ovan och skriver
   `docs/tasks/GAP-AUDIT.md`: per funktion — *verklig datakälla? mock? död kod?*
3. Tag bort eller flytta mock-komponenter till `client/src/components/mockups/` så
   att inget ljuger i huvud-flödet (OutputFormatDropdown: koppla in ELLER ta bort).
4. Committa en "känd god grund": kör `npm run lint`, typecheck, tester gröna.
**Klar när:** GAP-AUDIT.md existerar och varje rad har status `real|mock|dead|partial`.

### Fas 13 — Backend-wiring: gör det befintliga verkligt
**Mål:** Koppla UI som redan ser rätt ut till datakällor som redan finns.
1. **Cowork-tasklist** → riktig data via schedules/agents: skapa endpoint-par
   (`/api/cowork/tasks`) backed av `scheduleSchema` + child-conversations; `CoworkTaskList`
   läser query istället för `DEFAULT_COWORK_TASKS`.
2. **Memory-tab** → befintliga `memories-routes` (search/create/delete) via React Query;
   ta bort `INITIAL_MEMORIES`.
3. **UsageLimitPopover** → riktig token-användning ur LibreChats transaction-/usage-tabeller.
4. **Claude Code-dashboard** → ersätt `MOCK_TOKENS` med riktiga: läs sessioner från
   Claude Code lokalt (`~/.claude/projects/*.jsonl`-liknande) eller från OpenRouter-
   usage-endpointen; tokens från transactions.
**Klar när:** Ingen mock-import återstår i någon tab som nås från huvudnavigtionen.

### Fas 14 — Verklig Computer Use (kärnan i "fungerar lika bra som Claude")
**Mål:** Agenten kan navigera webben och utföra uppgifter på riktigt.
1. Aktivera **Playwright MCP** i `librechat.yaml` (av-commenta puppeteer-blocket,
   byt till `npx @playwright/mcp` med `--headless` + `--caps=vision,pdf` valfritt).
2. Läs browser-use-repo:t (se nedan "Repos-läsningsprotocollet") och skriv
   `skill/browser-operator/SKILL.md`: systemprompt med numrerade element,
   plan→action→verify-loop, max-steg, failure-recovery.
3. Läs ui-tars MRP-prompter och implementera motsvarande **action-parser + grounding
   loop** som MCP-agenten använder (TS, inte python).
4. Säkerhet: HITL-gate — skärmbilder av viktiga åtgärder (submit/köp/login) kräver
   knapptryck i chat-UI:t (LibreChat har redan tool-approval-flöde).
5. Verifiera end-to-end: "boka ett testmöte på en sandlådewebbplats" körs utan mock.
**Klar när:** Demo-video/flöde där agenten utför en riktig webbuppgift via MCP.

### Fas 15 — Djupa luckor: Design Canvas & Aggregering
1. **Design Canvas:** koppla till artifacts-pipelinen (`:::artifact`-flödet) så canvas-
   output blir riktiga React/HTML-artifacts med versioner, inte placeholder.
2. **Live Docs/Slides:** förläng `skill/live-docs-and-slides` med export (PDF via
   Playwright print — gratis).
3. Eventuellt: kör browser-use som separat container-service för tunga multi-tab-jobb,
   anripplet via en tunn MCP-wrapper (fortfarande gratis, CPU-only).
**Klar när:** Design-/Docs-flöden producerar nedladdningsbara artefakter.

### Fas 16 — Anpassning till nya Claude-uppdateringen
Anthropics stora förändring (2026): **"Cowork and chat are now one Claude"** —
Chat/Cowork-växlaren i composern fasas ut till förmån för en enhetlig agent som
själva bestämmer när den jobbar asynkront; nytt Plans-panel-läge; nya settings för
"Working hours"/behörigheter.
1. **Före all UI-ändring:** uppdatera `docs/ui-reference/` med nya skärmdumpar av
  den riktiga Claude-appen (manuellt, gratis). Jämför mot nuvarande Fas 4/6-beslut.
2. Ersätt segmentväxlaren med enhetlig composer + en "background task"-indikator som
   drivs av riktiga schedule-runs (kopplad till Fas 13-data).
3. Ny flik "Plans": agentens plan-steg som checklista — datakälla: MRP-planen från
   Fas 14-skillen (redan strukturerad!).
4. Uppdatera `docs/FEATURES.md` med diff-listan; dispatcha per-ändring som tasks 0xx.
**Klar när:** Appens beteende matchar dagens Claude enligt färsk skärmdumpsjämförelse.

### Fas 17 — Polering & Regression
1. e2e-tester för varje verkligt flöde (cowork-create, memory-crud, browser-task).
2. Kolla uppströms-sync (`git fetch upstream`) — lös konflikter tidigt.
3. Städa docs: markera ROADMAP-fas 4–11-rader som "UI klart, data klart" korrekt.

---

## Repos-läsningsprotocollet (ge detta till Antigravity-agenten)

För varje repo: **klona till `~/refs/` (ALDRIG in i worktree), läs, extrahera, implementera om.**

```bash
mkdir -p ~/refs && cd ~/refs
git clone --depth 1 https://github.com/bytedance/ui-tars.git
git clone --depth 1 https://github.com/browser-use/browser-use.git
git clone --depth 1 https://github.com/aaif-goose/goose.git
```

Per repo, agenten ska:
1. Lista filstrukturen (`ls -R` fast, eller `find . -name "*.py" -path "*prompt*"`).
2. Läsa **allt** relevant: promptfiler, action-/schema-definitioner, parsers,
   safety/refusal-logik, message-manager, DOM-serialisering.
3. Skriva `docs/refs/<repo>-EXTRACTION.md`: korta kodcitat + "vad vi bör göra annorlunda i TS/LibreChat".
4. Implementera mönstren i vårt repo som skills/TS-moduler med egen implementation
   (attribuera Apache/MIT-source i filhuvud).
5. Aldrig: copy-paste hela moduler, importera python i node, eller addera repo:t som dependency.

**Ui-tars fokus:** `packages/*/src/prompt*`, operator/action-parsers, grounding (MRP),
refusal-detectors. **Browser-use fokus:** `dom/service.py` (indexed elements),
`agent/prompts.py`, `message_manager/utils.py`, `controller/service.py` (action registry).
**Goose fokus:** `extensions/desktop`, journal/subagent-reducer, scheduler-mönster.

---

## STARTPROMPT för Antigravity CLI

Klistra in detta som första meddelande i en ny Antigravity-session (contextfilen nedan antas finnas):

```
Du arbetar i /workspace — en personlig LibreChat-fork som byggs om till en
Claude-liknande app mot OpenRouter. LÄS FÖRST I DEN HÄR ORDNINGEN:
1. AGENTS.md (viktiga arbetsregler, bl.a. kontrollera avbrutna sessioner)
2. docs/MASTER-PLAN.md (hela strategin — följ den)
3. docs/ROADMAP.md + aktuellt biljett i docs/tasks/
4. docs/refs/ om den mappen finns (repo-extraktioner)

DIN UPPGIFT NU: Kör FAS 12 i MASTER-PLAN.md.
Steg:
a) git status + git log --oneline -5 — hantera ev. halvfärdigt arbete först.
b) Starta stacken (docker compose for mongo/redis, sedan api+client) och
   bekräfta att appen går att logga in i. Om nej: felsök innan något annat.
c) Genomför GAP-AUDIT: granska varje punkt i tabellen "Vad som är verkligt vs.
   mock" i MASTER-PLAN.md mot faktisk kod (grep efter DEFAULT_COWORK_TASKS,
   INITIAL_MEMORIES, MOCK_TOKENS, OutputFormatDropdown-konsumenter osv.) och
   skriv docs/tasks/GAP-AUDIT.md med status real|mock|dead|partial per funktion.
d) Committa: "docs: gap audit (fas 12)". Skriv ENBARUPP en kort sammanfattning
   av vad som är mock och vilken nästa åtgärd i fas 13 är.
Regler: ändra inget utanför /workspace, vendorINGA externa repos, allt arbete
committas i små steg, tests/lint/typecheck måste vara gröna före commit.
När fas 12 är klar: vänta på mig innan du startar fas 13.
```

**Uppföljningsprompt när fas 12 är klar:**

```
Kör FAS 14 steg 1–2 i docs/MASTER-PLAN.md: aktivera Playwright MCP i
librechat.yaml, klona sedan browser-use och ui-tars till ~/refs, läs enligt
"Repos-läsningsprotocollet", skriv docs/refs/browser-use-EXTRACTION.md och
docs/refs/ui-tars-EXTRACTION.md, och implementera därefter
skill/browser-operator/SKILL.md. Verifiera med en riktig körd demo mot en
sandlådewebbplats. Committa i delsteg.
```

---

## Kontextpaket för agenten

`AGENTS.md` + `docs/MASTER-PLAN.md` (den här filen) + `docs/ROADMAP.md` räcker som
kontextpaket. Lägg till följande rad i AGENTS.md läst-ordningen:
*"Läs alltid docs/MASTER-PLAN.md efter ROADMAP — ROADMAP säger vad som är byggt,
MASTER-PLAN säger vad som faktiskt fungerar och hur mock ska bli verkligt."*

---

## Checklista per fas (kortversion)

- [x] **Fas 12** — appen startbar, GAP-AUDIT.md skriven, mock flyttade/borttagna
- [x] **Fas 13** — Cowork/Memory/Usage/ClaudeCode-tabbac mot riktiga endpoints
- [x] **Fas 14** — Playwright MCP aktivt; browser-operator-skill från ui-tars+browser-use-mönster; HITL-gate; riktig demo
- [x] **Fas 15** — Design Canvas→artifact-pipeline; Docs/Slides-export
- [x] **Fas 16** — nya Claude-skärmdumpar → enhetlig composer + Plans-panel + Time & focus
- [ ] **Fas 17** — e2e-grönt, upstream-syncat, docs korrigerade
