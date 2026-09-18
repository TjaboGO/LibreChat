# Claude Copycat

Ett eget, självhostat AI-chattgränssnitt byggt för att se ut och fungera som Claude-appen
(chatt, Artifacts, Projects, Agents/tool-use-looping, Skills, MCP, subagents/"Cowork",
extended thinking) — men körande mot valfri modell via **OpenRouter** (DeepSeek, Qwen,
GLM, Llama, Gemini, m.fl.) istället för Anthropics egna modeller.

Byggs genom att forka [LibreChat](https://github.com/danny-avila/LibreChat) (MIT-licens,
`upstream`-remote) och sedan vibecoda vidare med Claude Code + Gemini CLI, orkestrerat av
Orca.

## Status

Repo är precis klonat och omdöpt (`origin` → `upstream`). Inget projektspecifikt är
byggt än — det här är underlaget för nästa fas. Se [docs/ROADMAP.md](docs/ROADMAP.md)
för vad som är kvar.

## Läsordning

1. [docs/RESEARCH.md](docs/RESEARCH.md) — varför LibreChat valdes som grund, och vilka
   alternativ som utvärderades.
2. [docs/FEATURES.md](docs/FEATURES.md) — varje Claude-funktion, vad LibreChat redan har
   inbyggt, och vad som måste byggas.
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — teknisk stack, hur OpenRouter kopplas
   in, kända fallgropar (bl.a. Apple Silicon + MongoDB).
4. [docs/ROADMAP.md](docs/ROADMAP.md) — faserna, i ordning.
5. [docs/tasks/](docs/tasks/) — konkreta, avgränsade uppgifter redo att ge till en
   Claude Code- eller Gemini CLI-agent i en egen worktree.
6. [AGENTS.md](AGENTS.md) — instruktioner till kodningsagenterna som jobbar i det här
   repot (läses automatiskt av Claude Code/Codex-liknande verktyg).

## Snabbstart (lokal utveckling)

```bash
cp .env.example .env
# Lägg till OPENROUTER_KEY=sk-or-... i .env
cp librechat.example.yaml librechat.yaml
# Avkommentera OpenRouter-blocket under `endpoints.custom` i librechat.yaml
```

**Apple Silicon (M1–M4):** standard-Docker-imagen för MongoDB i LibreChats
`docker-compose.yml` kräver AVX-instruktioner som inte finns på arm64 och kraschar vid
uppstart. Se [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#mongodb-på-apple-silicon) för
fixen innan du kör `docker compose up`.

## Ursprunglig LibreChat-dokumentation

Bevarad oförändrad i [docs/upstream/](docs/upstream/) — använd den när en agent behöver
förstå LibreChats egna kodkonventioner (modulgränser, typecheck-kommandon,
branch-policy mot upstream-projektet, domänbegrepp för agents/subagents/MCP).
