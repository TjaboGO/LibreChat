# Task 001 — Bootstrap: lokal uppstart + OpenRouter

**Mål:** Appen startar lokalt och svarar på en chattfråga via en OpenRouter-modell.

**Bakgrund:** Se `docs/ARCHITECTURE.md`. Repot är ett färskt fork av LibreChat på en
Apple Silicon-Mac (arm64), vilket triggar ett känt MongoDB/Docker-problem.

**Steg:**

1. Kör `docker compose up mongodb` isolerat. Om containern kraschar med ett
   illegal-instruction/AVX-relaterat fel: byt MongoDB-image i
   `docker-compose.override.yml` till en arm64-kompatibel tagg, ELLER installera
   MongoDB nativt (`brew install mongodb-community`) och peka `MONGO_URI` i `.env`
   mot `localhost`. Dokumentera vilken lösning som valdes i denna fils "Resultat"-
   sektion (lägg till en om den saknas).
2. `cp .env.example .env`, lägg till en `OPENROUTER_KEY` (be användaren om nyckeln om
   den inte redan finns i miljön — skriv aldrig en placeholder-nyckel som ser giltig
   ut).
3. `cp librechat.example.yaml librechat.yaml`, avkommentera OpenRouter-blocket under
   `endpoints.custom` (rad ~975 i exempelfilen).
4. Starta hela stacken, skapa ett konto (första kontot blir admin), skicka ett
   testmeddelande mot en OpenRouter-modell (t.ex. `deepseek/deepseek-chat`), verifiera
   att svaret streamar och att modellbytesmenyn listar fler OpenRouter-modeller
   (`fetch: true` ska hämta hela listan).

**Klart när:** en riktig konversation med ett OpenRouter-modellsvar syns i UI:t, och
`.env`/`librechat.yaml` är i `.gitignore` (kolla — hemligheter ska aldrig committas).

**Rör inte:** `docker-compose.yml` direkt — lägg overrides i
`docker-compose.override.yml` så uppströms-filen förblir mergebar.

## Resultat (2026-09-18)

- **MongoDB på Apple Silicon:** Docker fanns inte installerat på maskinen. Vi valde alternativ 2 från `docs/ARCHITECTURE.md` och installerade MongoDB nativt via Homebrew (`brew tap mongodb/brew`, `brew install mongodb-community`). Tjänsten startades via `brew services start mongodb/brew/mongodb-community` och svarar på standardporten. `MONGO_URI` i `.env` pekar mot `mongodb://127.0.0.1:27017/LibreChat`.
- **Bygge och miljö:** `npm ci` kördes och samtliga workspaces (`packages/data-provider`, `packages/data-schemas`, `packages/api`, `packages/client`) samt frontendklienten i `client/` byggdes utan fel med Node v26 (Homebrew).
- **Konfiguration:** 
  - `.env` och `librechat.yaml` skapades och bekräftades vara inkluderade i `.gitignore`.
  - Användaren la in `OPENROUTER_KEY` manuellt i `.env`.
  - `librechat.yaml` konfigurerades med `OpenRouter` som custom endpoint med `fetch: true` och standardmodeller (`deepseek/deepseek-r1`, `qwen/qwen3-235b-a22b`, `z-ai/glm-4.6`, `deepseek/deepseek-chat`).
  - `BAN_VIOLATIONS=false` och `SCHEDULES_SINGLE_PROCESS=true` konfigurerades i `.env` för smidig lokal utveckling.
- **Verifiering:**
  - Första användarkontot (`admin@example.com`) skapades och fick `ADMIN`-roll.
  - `/api/models` hämtade framgångsrikt hela modellkatalogen från OpenRouter (445 modeller returnerade och synliga i endpoints-konfigurationen).
  - Skickade ett chattmeddelande till OpenRouter med `deepseek/deepseek-chat`. Svaret streamades korrekt över SSE (`on_message_delta`-händelser) och sparades i MongoDB i `messages`- och `convos`-kollektionerna.
  - Hela appen körs och svarar på `http://localhost:3080`.
- **Nästa steg:** Task 002 (verifiering av modell-lager, streaming, extended thinking/reasoning-visning mot DeepSeek-R1 samt Artifacts-panelen).
