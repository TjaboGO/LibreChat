# GAP-AUDIT — Fas 12: Granskning av verklighet vs. mock

Detta dokument utgör resultatet av auditeringen i **Fas 12** enligt [MASTER-PLAN.md](../MASTER-PLAN.md).
Varje funktion i systemet har granskats mot faktisk källkod, databasmodeller och API-endpoints.

---

## 1. Stack- och Miljöverifiering

- **MongoDB:** Körs lokalt på standardport 27017 via Homebrew (`brew services start mongodb-community`). Ping: `{ ok: 1 }`.
- **Databas:** `LibreChat`-databasen är aktiv med befintliga användarkonton (`admin@example.com`, `gabriel.odenhagen@gmail.com` m.fl.).
- **Redis:** Avaktiverad i `.env` (`USE_REDIS` ej satt, in-memory cache och streams används, `SCHEDULES_SINGLE_PROCESS=true` möjliggör in-process schemaläggare).
- **Backend (API):** Startar framgångsrikt och lyssnar på `http://localhost:3080`.
- **Inloggning:** Verifierad via `POST /api/auth/login` för `admin@example.com` med HTTP 200 OK och utfärdade JWT-tokens.

---

## 2. Revisionsmatris: Verkligt vs. Mock

| Funktion | Status | Källfiler / Bevis | Beskrivning av verkligt tillstånd & Gap |
|---|---|---|---|
| **Chat, streaming, artifacts, agents, MCP, schedules** | `real` | `packages/api/src/schedules/`<br>`api/server/routes/schedules.js`<br>`api/server/routes/agents.js`<br>`librechat.yaml` | Riktig LibreChat-kärna. OpenRouter-streaming via SSE, Mongoose-persistering, schemaläggare körs via `schedules.js`, MCP filesystem server aktiv, Artifacts parsas och renderas. |
| **Cowork-uppgiftslistan** | `mock` | `client/src/components/Chat/Input/CoworkTaskList.tsx` | Hårdkodad `DEFAULT_COWORK_TASKS` med 3 statiska uppgifter. Renderar lokal `useState`. Ingen koppling till scheman, child-conversations eller agent-jobb. |
| **Minnen (Memory)** | `partial` | `client/src/components/Nav/SettingsTabs/Claude/MemoryTab.tsx`<br>`api/server/routes/memories.js`<br>`packages/api/src/agents/memory.ts` | Backend har fullständiga REST-endpoints (`GET/POST/PATCH/DELETE /api/memories`) och Mongoose-modell. Frontend i `MemoryTab.tsx` använder dock hårdkodade `INITIAL_MEMORIES` i lokal `useState` och anropar inte backend. |
| **Claude Code-dashboard** | `mock` | `client/src/components/Code/CodeDashboard.tsx`<br>`client/src/components/Nav/SettingsTabs/Claude/ClaudeCodeTab.tsx` | `CodeDashboard.tsx` visar hårdkodad statistik (42 sessions, 384 messages, 1.24M tokens) och beräknad fejk-heatmap `(idx * 17) % 7`. `ClaudeCodeTab.tsx` har `MOCK_TOKENS` med påhittade enheter. Ingen koppling till lokala CLI-sessioner eller OpenRouter-transaktioner. |
| **Design Canvas** | `mock` | `client/src/components/Design/DesignCanvasView.tsx`<br>`client/src/components/Design/DesignLandingPage.tsx` | Visar en statisk hårdkodad "Acme Corp"-layout. Ingen generativ pipeline eller koppling till LibreChats `:::artifact`-arkitektur. |
| **OutputFormatDropdown** | `dead` | `client/src/components/Chat/Input/OutputFormatDropdown.tsx`<br>`client/src/components/Chat/Input/ComposerQuickToggles.tsx`<br>`client/src/store/families.ts` | Komponenten är monterad via `ComposerQuickToggles` och sätter `outputFormatFamily(index)`, men ingen komponent eller sändningslogik konsumerar detta Recoil-atom. Valet gör ingenting. |
| **UsageLimitPopover** | `mock` | `client/src/components/Chat/Input/UsageLimitPopover.tsx`<br>`client/src/components/Chat/Input/ComposerTopBar.tsx` | Visar hårdkodade standardsträngar ("34m", "Normal", "In 3 days"). Inga riktiga data från OpenRouter, transaktionsloggar eller tokensaldon hämtas. |
| **Computer Use / browser** | `mock` | `librechat.yaml`<br>`librechat.example.yaml`<br>`docs/tasks/006-scheduled-agents-and-computer-use.md` | Uppgift 006 rapporterade full Computer Use, men webbläsar-MCP (puppeteer/playwright) är bortkommenterad i YAML. Endast filsystem-MCP är igång; ingen aktiv webbläsarmotor finns. |

---

## 3. Detaljerad Genomgång per Område

### 3.1. Cowork-uppgiftslistan (`CoworkTaskList.tsx`)
- **Faktiskt tillstånd:** `const DEFAULT_COWORK_TASKS: CoworkTask[] = [...]` innehåller 3 hårdkodade uppgifter (`task-1`, `task-2`, `task-3`). `handleClearActive` tömmer endast lokal `useState`.
- **Krävs i Fas 13:**
  - Skapa API-endpoint `/api/cowork/tasks` (eller återanvänd `/api/schedules` filtrerat på agentuppgifter).
  - Ersätt `useState(DEFAULT_COWORK_TASKS)` med React Query mot backend.

### 3.2. Minnen (`MemoryTab.tsx`)
- **Faktiskt tillstånd:** Backend är fullt implementerad i `api/server/routes/memories.js` med stöd för `GET /memories`, `POST /memories`, `PATCH /memories/:key` och `DELETE /memories/:key`. Frontend i `client/src/components/Nav/SettingsTabs/Claude/MemoryTab.tsx` använder dock `INITIAL_MEMORIES` och muterar endast lokal React-state.
- **Krävs i Fas 13:**
  - Ta bort `INITIAL_MEMORIES`.
  - Koppla `MemoryTab.tsx` och dess modaler (`ImportMemoryModal`, `MemoryDetailView`) till backendens `memories`-routes via React Query-hooks (`useGetMemories`, `useDeleteMemoryMutation`, etc.).

### 3.3. Claude Code-dashboard (`CodeDashboard.tsx` & `ClaudeCodeTab.tsx`)
- **Faktiskt tillstånd:**
  - Siffrorna 42 sessioner, 384 meddelanden, 1.24M tokens och "DeepSeek Reasoner" är rena HTML/JSX-literaler.
  - Heatmapen genereras deterministiskt: `const activityLevel = (idx * 17) % 7;`.
  - `ClaudeCodeTab.tsx` innehåller `const MOCK_TOKENS = [...]` med MacBook Pro, iMac Studio m.fl.
- **Krävs i Fas 13:**
  - Läsa faktiska användardata från transaktioner/tokens i LibreChat eller aggregera konversationshistorik.
  - Läsa verkliga sessioner eller tokens istället för `MOCK_TOKENS`.

### 3.4. Design Canvas (`DesignCanvasView.tsx`)
- **Faktiskt tillstånd:** Enbart en statisk canvas med en fejkad mockup för "Acme Corp".
- **Krävs i Fas 15:**
  - Koppla till artefakt-pipelinen (`:::artifact`) så att canvasen renderar faktiska React/HTML-artefakter genererade av modellen.

### 3.5. OutputFormatDropdown (`OutputFormatDropdown.tsx`)
- **Faktiskt tillstånd:** Monteras i composern (`ComposerQuickToggles.tsx`), sparar till `outputFormatFamily`, men värdet läses aldrig i `ChatForm` eller `api`. Det skickas inte med i prompten.
- **Krävs i Fas 13:**
  - Antingen koppla ihop atomets värde med `useSubmitMessage` så att en systemdirektiv/instruktion injiceras (t.ex. instruera modellen att svara som presentation, dokument eller artefakt), eller dölja komponenten tills pipeline finns.

### 3.6. UsageLimitPopover (`UsageLimitPopover.tsx`)
- **Faktiskt tillstånd:** Komponenten tar emot props med hårdkodade defaults ("34m", "Normal", "In 3 days"). `ComposerTopBar` skickar inga props, vilket gör att användaren alltid ser dessa statiska siffror.
- **Krävs i Fas 13:**
  - Koppla till LibreChats transaktionssaldo / OpenRouter-kvot.

### 3.7. Computer Use & Webbläsare
- **Faktiskt tillstånd:** Inget webbläsarverktyg är anslutet till LibreChat. Puppeteer är kommenterat i YAML, och Playwright MCP är inte installerat.
- **Krävs i Fas 14:**
  - Aktivera Playwright MCP (`@playwright/mcp`) i `librechat.yaml`.
  - Skapa `skill/browser-operator/SKILL.md`.

---

## 4. Slutsats & Nästa Steg för Fas 13

Appens gränssnitt (Fas 6–11) är visuellt komplett och pixelrätt matchat mot Claude-referenserna. Däremot drivs flera vyer av mockdata eller statiska tillstånd.

**Huvudåtgärder för Fas 13 (Backend-wiring):**
1. **CoworkTaskList:** Ersätt `DEFAULT_COWORK_TASKS` med React Query mot scheman/agent-jobb.
2. **MemoryTab:** Ersätt `INITIAL_MEMORIES` med anrop mot de redan fungerande `api/server/routes/memories.js`.
3. **UsageLimitPopover:** Ersätt hårdkodade defaults med riktig token- och transaktionsdata.
4. **OutputFormatDropdown:** Koppla `outputFormatFamily` till promptgenereringen så att valet påverkar modellens svar.
5. **ClaudeCodeTab & CodeDashboard:** Ersätt `MOCK_TOKENS` och statiska siffror med transaktionsdata.
