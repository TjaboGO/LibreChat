# Task 005 — "Cowork" och Subagents synligt i UI

**Förutsättning:** Task 001–004 klara (grundstack, OpenRouter, Claude-rebrand, Skills & MCP).

**Mål:** Exponera LibreChats subagent-/child-conversation-modell som en intuitiv "Cowork"-yta i gränssnittet, i linje med Claudes samarbetskoncept för multi-agent-arbetsflöden.

**Steg:**

1. **Undersök och återanvänd befintlig subagent-arkitektur:**
   - LibreChat har redan fullt stöd för subagents i backend (`@librechat/agents`, `packages/api/src/agents/`, `ParentSubagentsProvider`, `EventSubagentActivityGroup`, `SubagentThreadPanel`).
   - Barnprocesser streamar händelser över SSE via `useSubagentActivityStream` och lagras durabelt.

2. **Bygg Cowork-indikator och navigering i UI:**
   - Skapa `CoworkButton` i `client/src/components/Chat/Subagents/CoworkButton.tsx`.
   - Placera knappen i chattens `Header` intill modellväljaren:
     - Visar antalet aktiva/totalt genomförda subagent-uppdrag med en animerad badge.
     - Klick växlar smidigt upp/ned `SubagentThreadPanel` i split-view (samma delade vy som Artifacts).

3. **Verifiering av aktivitetsström:**
   - Bekräfta att `EventSubagentActivityGroup` och `SubagentThreadPanel` visar realtidsuppdateringar, statusindikatorer (dispatched, running, completed, failed) och verktygsanrop.

4. **Kvalitetssäkring:**
   - `npx tsc --noEmit` i `client`.
   - `npm --prefix client run build`.

**Klart när:** Cowork/Subagents är synligt integrerat i chattgränssnittet och ger användaren direkt insyn i och kontroll över assisterande subagenter.

## Resultat (2026-09-18)

1. **Subagent-infrastruktur sammanflätad:**
   - LibreChats underliggande subagent-arkitektur (`ParentSubagentsProvider`, `SubagentThreadPanel`, `EventSubagentActivityGroup`, `activeSubagentPanel`) integrerad direkt mot chattgränssnittets top-level `Header`.
2. **Cowork UI-komponent implementerad:**
   - Skapade `CoworkButton.tsx` i `client/src/components/Chat/Subagents/CoworkButton.tsx`.
   - Monterade knappen i `Header.tsx` bredvid `ModelSelector`. Knappen känner av när subagents exekveras eller finns lagrade för konversationen:
     - Visar en levande badge med antalet pågående/slutförda uppdrag.
     - Klick öppnar den aktiva subagentens detaljerade aktivitetsström och verktygsexekveringar i split-panelen (`SubagentThreadPanel`).
3. **Kvalitetssäkring och verifiering:**
   - `npx tsc --noEmit` felfri i `client`.
   - `npm --prefix client run build` genererade produktionsbygget utan fel.

