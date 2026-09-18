# Task 007 — Chat-appen, P0 (pixelmatchning)

**Förutsättning:** Task 001–006 klara. Läs
[docs/ui-reference/PLAN.md](../ui-reference/PLAN.md) och motsvarande sektioner i
`docs/ui-reference/batch-1..4-screenshots.md` innan du börjar — de innehåller den
exakta UI-texten och layouten detta task ska matcha.

**Mål:** Sidopanel, landningssida, composer och Settings-skal matchar skärmdumparna
funktionellt och visuellt (samma nav-ordning, samma text, samma kontrollstruktur).

**Delmoment (kan göras i valfri ordning, men gör Sidopanel-nav och Settings-skal
först eftersom flera senare delmoment hänger på dem):**

1. **Sidopanel-nav** — ersätt dagens "Start new chat"-pillerknapp med rätt
   struktur: `+ New` (fetstil, pill vid val) → Projects → Artifacts → Scheduled
   → Design → Customize → More (kollapsbar). Under navlistan: "Scheduled >"-rad,
   "Pinned"-sektion, "Chats and tasks"-sektion (sök + filter-ikon). Se batch-1
   "Chat app — empty-state home" för exakt layout.

2. **Composer — Chat/Cowork-växlare.** Detta ersätter `CoworkButton.tsx` (som
   flaggades fel i Fas 4 — se ROADMAP.md). Segmentkontroll i composerns
   verktygsrad, "Chat" / "Cowork", vald variant får vit/ljus pill-bakgrund.
   Cowork-läget ändrar `+`-menyns innehåll (se batch-4 "Composer + attach menu
   (Cowork mode)") och visar senare (Fas 7) en uppgiftslista under composern.

3. **Composer — kvicktoggles** under composer-kortet: "Project or folder",
   "Auto", "Output" som platta textknappar. Varje öppnar en dropdown enligt
   batch-1 (Project/folder-picker, Auto-godkännandeläge, Output-format).

4. **Composer — `+`-meny** (Chat-läge): Add files or photos (⌘U), Take a
   screenshot, Add to project, divider, Skills, Connectors, Design system, Add
   plugins, divider, Research, Web search (checkmark=på), Memory
   (checkmark=på). Exakt ordning och ikoner enligt batch-4.

5. ~~**Modell/Effort/Thinking-väljare**~~ — **Klart, men med en medveten
   avvikelse.** Byggde `EffortSelector.tsx` som en fristående composer-knapp
   (Low/Medium/High "Default"/Extra/Max + Thinking-toggle) istället för att
   nästla den i den befintliga modellväljarens flyout. Modellväljaren
   (`ModelSelector.tsx`) är en komplex, generisk multi-endpoint-meny
   (`CustomMenu`/`ModelSelectorContext`) som redan listar alla riktiga
   OpenRouter-modeller korrekt (verifierat i Task 002) — att kirurgiskt
   nästla en Claude-specifik flyout där inne riskerade regressioner jag inte
   kan verifiera utan en körande app. Funktionellt likvärdigt
   (`conversation.reasoning_effort`, samma `ReasoningEffort`-enum), bara
   placerad som en egen knapp bredvid modellväljaren istället för inuti den.
   Visas bara på Agents-endpointen (vår OpenRouter-väg); ingen
   modell-per-modell-koll av vilka som faktiskt stödjer reasoning.

6. **Settings-skal** — modal med vänster-nav grupperad: "Settings" (Preferences,
   Account, Privacy, Billing, Capabilities, Memory, Design systems, Claude Code,
   Cowork, Claude in Chrome), "Desktop app" (General, Extensions, Developer),
   "Customize" (Skills, Connectors, Plugins). Bygg skalet så alla flikar (även
   tomma placeholder-flikar för sådant som kommer i Fas 7–8) kan hängas på det
   utan omarbete.

7. **Settings — Preferences-fliken**: Appearance (Theme/Chat font/Motion),
   Voice (Language/Style/Speed), Notifications (5 toggles, exakt text enligt
   batch-2).

8. **Settings — Account-fliken**: Profile-sektion, Instructions for Claude,
   Log out/Delete account, Trusted devices, Active sessions-tabell. Exakt text
   enligt batch-2.

**Rör inte:** Backend/API-lager — det här är rent frontend. Om ett UI-element
kräver ny backend-data som inte finns (t.ex. riktiga "Active sessions"), bygg
UI:t mot en rimlig platshållare/mock och notera det i resultat-avsnittet
istället för att bygga ny backend-infrastruktur som inte är beställd än.

**Klart när:** `npx tsc --noEmit` och `npm --prefix packages/client run test`
är gröna, och varje delmoment ovan är visuellt/funktionellt jämförbart med
motsvarande skärmdump.
