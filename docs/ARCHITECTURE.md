# Arkitektur

## Stack (ärvd från LibreChat, oförändrad)

- **Klient**: React + Vite, Jotai (state migreras bort från Recoil — se
  `docs/upstream/LIBRECHAT_AGENTS.md` under "Client state ownership" innan du rör
  delad state), Tailwind + `@librechat/client`-designsystem.
- **API**: Node/Express (`/api`) + TypeScript-paket i `packages/api` för faktisk
  affärslogik. Regel att komma ihåg: `/api` ska bara innehålla wiring (route-registrering,
  requires), inte logik — logiken hör hemma i `packages/api`.
- **Databaser**: MongoDB (konversationer, användare, skills, memory), Meilisearch
  (fulltextsökning), en vektor-DB för RAG.
- **Monorepo-verktyg**: npm/bun workspaces, `tsdown` för paketbygge (emitterar utan
  typecheck — kör alltid `npx tsc --noEmit` separat per ändrad workspace).

Vi ändrar inte den här grundstacken. Allt nytt bygger ovanpå den, via samma mönster
som redan finns (t.ex. schemalagda agenter ska likna "Subagent completion wakeup",
inte bli ett helt fristående system — se FEATURES.md P3).

## Modell-lager: OpenRouter som primär gateway

LibreChat pratar redan med "custom endpoints" via ett OpenAI-kompatibelt REST-schema.
OpenRouter exponerar exakt det gränssnittet (`https://openrouter.ai/api/v1`) och ger
tillgång till DeepSeek, Qwen, GLM, Llama, Gemini, Mistral m.fl. genom en enda nyckel.

```yaml
# librechat.yaml — endpoints.custom
- name: 'OpenRouter'
  apiKey: '${OPENROUTER_KEY}'
  baseURL: 'https://openrouter.ai/api/v1'
  models:
    default: ['deepseek/deepseek-r1', 'qwen/qwen3-235b-a22b', 'z-ai/glm-4.6']
    fetch: true          # hämtar hela OpenRouter-modellistan automatiskt
  titleConvo: true
  titleModel: 'deepseek/deepseek-chat'
  dropParams: ['stop']    # OpenRouter-modeller använder varierande stop-tokens
  modelDisplayLabel: 'OpenRouter'
```

**Reasoning/thinking-mappning:** Anthropics extended-thinking-fält och DeepSeek-R1:s
`reasoning_content`-fält är inte identiska på wire-nivå. `Thinking.tsx`/`Reasoning.tsx`
i klienten måste verifieras mot vad OpenRouter faktiskt streamar tillbaka för
R1-modeller (OpenRouter normaliserar en del, men inte allt) — första punkten att testa
manuellt när nyckeln är på plats, inte något att anta fungerar.

**DeepSeek direkt (utan OpenRouter):** går också via ett eget `endpoints.custom`-block
mot `https://api.deepseek.com` om du vill undvika OpenRouters marginal för just den
modellen — samma mönster, ny post i listan. Ingen anledning att välja bort det ena
för det andra; lägg till båda.

## MongoDB på Apple Silicon

Din maskin är arm64 (`Darwin ... arm64`). LibreChats standard-`docker-compose.yml`
drar en MongoDB-image som kräver AVX-instruktioner — de finns inte på M1–M4 och
containern kraschar direkt vid uppstart. Åtgärda med **en** av:

1. Byt MongoDB-image i `docker-compose.override.yml` till en arm64-kompatibel tagg
   (t.ex. en nyare officiell `mongo`-image som inte kräver AVX, eller
   `bitnami/mongodb`).
2. Kör MongoDB nativt via Homebrew (`brew install mongodb-community`) istället för i
   Docker, och peka `MONGO_URI` i `.env` mot `localhost` — enklast för lokal utveckling.

Verifiera med `docker compose up mongodb` isolerat innan hela stacken startas, så
felet inte gömmer sig bakom tio andra containrars loggar.

## Var rebrand-arbetet ska ske

Byt aldrig hårdkodade färger i enskilda komponenter. LibreChat har ett
tema-token-register (se "Frontend theming and styling" i
`docs/upstream/LIBRECHAT_AGENTS.md`) — Claude-utseendet (färgpalett, typsnitt,
hörnradier, spacing) ska definieras där, en gång, så det slår igenom överallt
automatiskt. Detta är samma disciplin som redan gäller i uppströmsprojektet, inte
något nytt påhitt.

## Vad som INTE ska byggas som ett separat system

- Schemalagda agenter → bygg vidare på det redan existerande
  "Subagent completion wakeup"-mönstret (durable trigger, Redis-routing, Mongo som
  källa till sanning) istället för ett nytt cron-ramverk från grunden.
- "Cowork" → finns redan som subagent/child-conversation-modell. Arbetet är att
  exponera det tydligare i UI:t (en synlig "bjud in en agent till den här mappen"-yta),
  inte att bygga om backend.
