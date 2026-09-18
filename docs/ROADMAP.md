# Roadmap

Faserna är sekventiella men inte strikt blockerande — Orca kan dispatcha flera
uppgifter inom en fas parallellt till olika worktrees så länge de inte rör samma
filer. Varje fas har motsvarande biljetter i [docs/tasks/](tasks/).

## Fas 0 — Bootstrap (klart eller nästan klart)

- [x] Forka LibreChat, arkivera uppströms-dokumentation i `docs/upstream/`
- [x] Skriva planeringsdokumenten (den här filen + RESEARCH/FEATURES/ARCHITECTURE)
- [ ] Skaffa OpenRouter-nyckel, verifiera lokal uppstart (inkl. MongoDB-fixen för
      Apple Silicon)
- [ ] Döpa om projektet från arbetsnamnet "Claude Copycat" om du vill ha ett riktigt
      produktnamn

→ [docs/tasks/001-bootstrap-and-openrouter.md](tasks/001-bootstrap-and-openrouter.md)

## Fas 1 — Modell-lager och grundläggande verifiering

- [ ] Koppla in OpenRouter enligt ARCHITECTURE.md, lägg till DeepSeek direkt som
      andra provider
- [ ] Verifiera streaming, modellbyte, extended-thinking-rendering fungerar mot
      minst en reasoning-modell (DeepSeek-R1) och en icke-reasoning-modell
- [ ] Verifiera Artifacts-panelen renderar kod/React/Mermaid från en OpenRouter-modell
      (inte bara Anthropic/OpenAI som LibreChat testar mot som standard)

→ [docs/tasks/002-verify-model-layer.md](tasks/002-verify-model-layer.md)

## Fas 2 — Rebrand till Claude-look

- [ ] Definiera Claude-liknande färgpalett/typografi i temaregistret (inte per
      komponent)
- [ ] Byt logotyp, produktnamn, favicon, onboarding-texter
- [ ] Gå igenom layouten (sidopanel, chattbubblor, Artifacts-split-view) mot
      referensskärmdumpar av Claude-appen

→ [docs/tasks/003-claude-look-rebrand.md](tasks/003-claude-look-rebrand.md)

## Fas 3 — Skills, Agents-marknadsplats, MCP i praktiken

- [ ] Skapa 2-3 egna Skills (SKILL.md + ev. scripts) som verkligt test av
      skills-systemet
- [ ] Koppla in minst en extern MCP-server (t.ex. filsystem eller webbsök) och
      verifiera OAuth-flödet
- [ ] Gå igenom agent-marknadsplatsens UI och städa bort det som är LibreChat-
      specifikt varumärke

## Fas 4 — "Cowork" och subagents synligt i UI

- [ ] Exponera subagent-/child-conversation-modellen som en tydlig
      "samarbeta med fler agenter i den här sessionen"-yta (backend finns redan,
      se ARCHITECTURE.md)
- [ ] Bygg en enkel vy för "Subagent activity stream" (finns redan som datakälla)

## Fas 5 — De riktiga luckorna

- [ ] Schemalagda/bakgrundskörande agenter (bygg på "Subagent completion
      wakeup"-mönstret, se ARCHITECTURE.md — inte ett nytt system)
- [ ] Computer use (sandboxad browser/skärm-worker) — störst enskild insats,
      gör sist och bara om det faktiskt behövs
- [ ] (Stretch) Claude Docs/Slides-liknande levande dokument

## Explicit ute ur scope tills vidare

Team-/orgadministration, fakturering, enterprise-SSO, native mobilapp — se
FEATURES.md "Inte relevant".
