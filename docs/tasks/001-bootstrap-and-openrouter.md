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
