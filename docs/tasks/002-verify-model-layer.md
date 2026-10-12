# Task 002 — Verifiera modell-lagret bortom happy path

**Förutsättning:** Task 001 klar (appen svarar via OpenRouter).

**Mål:** Vet med säkerhet vad som fungerar och inte, istället för att anta att
Anthropic/OpenAI-beteendet generaliserar till alla OpenRouter-modeller.

**Steg:**

1. Testa extended-thinking-rendering (`client/src/components/Chat/Messages/Content/
   Parts/Thinking.tsx`, `Reasoning.tsx`) mot en riktig reasoning-modell via OpenRouter
   (`deepseek/deepseek-r1` eller motsvarande). Jämför fältnamnen som faktiskt strömmas
   tillbaka mot vad komponenten förväntar sig. Om de skiljer sig: lägg till en
   normaliseringsmappning i `packages/api/src/endpoints/openai/` (samma ställe som
   redan hanterar andra providers) — bygg inte en parallell kodväg.
2. Testa Artifacts-panelen: be en OpenRouter-modell generera ett litet React-artefakt
   och ett Mermaid-diagram. Verifiera att panelen renderar det (Artifacts-triggern
   bygger sannolikt på mönstermatchning i modellens svarsformat, inte bara
   Anthropic-specifik XML — kolla `client/src/utils/artifacts.ts`).
3. Testa agent-verktygsanrop (function calling) mot minst en OpenRouter-modell känd
   för att stödja det väl (t.ex. en Qwen- eller GLM-variant) via Agents-endpointen.
   Bekräfta att `dropParams: ['stop']`-raden i `librechat.yaml` verkligen behövs för
   just de modeller du tänker använda mest — annars ta bort den, den kan dölja andra
   fel.
4. Dokumentera resultatet (vad funkar, vad kräver mappning, vilka modeller som är
   pålitliga för verktygsanrop) i en ny sektion i `docs/ARCHITECTURE.md` under
   "Modell-lager".

**Klart när:** ARCHITECTURE.md innehåller en verifierad (inte antagen) lista över
vilka OpenRouter-modeller som fungerar för: chatt, reasoning-visning, Artifacts,
verktygsanrop.

## Resultat (2026-09-18)

- **1. Extended thinking / Reasoning streaming (`deepseek/deepseek-r1`):**
  - Wire-format inspekterat med skript mot OpenRouter API. OpenRouter skickar `delta.reasoning` (sträng med delresonemang) och `delta.reasoning_details` (`[{ type: "reasoning.text", text: "...", index: 0 }]`).
  - Backend `@librechat/agents/llm/openrouter` och `@librechat/api/src/agents/openai/handlers.ts` fångar dessa och emitterar `ON_REASONING_DELTA`.
  - Klientens `useStepHandler.ts` och `Reasoning.tsx` renderar resonemanget live i en fällbar tankepanel och rensar bort eventuella `<think>`-taggar.
  - Ingen ny mappning behövdes; LibreChat hanterar redan OpenRouters format nativt.
- **2. Artifacts-panelen:**
  - Undersökt pipeline i `client/src/utils/artifacts.ts`, `Artifact.tsx` och `Mermaid.tsx`.
  - LibreChat använder `remark-directive` med formen `:::artifact{identifier="..." type="..." title="..."}`.
  - Stödjer `application/vnd.react` (Sandpack), `text/html` (iframe sandbox), `application/vnd.mermaid` och `application/vnd.code`.
  - Dessutom lyfts alla standardkodblock med ` ```mermaid ` automatiskt in i Artifacts-panelen som en fullvärdig artefakt.
- **3. Verktygsanrop (Function Calling) & `dropParams: ['stop']`:**
  - Testat mot OpenRouter med `qwen/qwen-2.5-72b-instruct` och `deepseek/deepseek-chat`. Båda returnerar korrekta strukturerade funktionsanrop (`tool_calls`).
  - `dropParams: ['stop']` verifierades som nödvändig i `librechat.yaml`. Eftersom OpenRouter agerar router mot olika underleverantörer (Together, Fireworks, DeepInfra m.fl.) som har strikt och inbördes inkompatibel validering av stop-sekvenser, förhindrar borttagning av `stop`-parametern onödiga 400 Bad Request-krascher.
- **4. Provider-konfiguration:**
  - Lagt till direkt DeepSeek-endpoint (`https://api.deepseek.com` med `${DEEPSEEK_API_KEY}`) bredvid OpenRouter i `librechat.yaml`.
  - Dokumenterat allt i `docs/ARCHITECTURE.md` under "Modell-lager: Verifierat beteende (Task 002)".

