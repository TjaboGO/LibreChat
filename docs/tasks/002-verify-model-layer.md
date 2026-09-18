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
