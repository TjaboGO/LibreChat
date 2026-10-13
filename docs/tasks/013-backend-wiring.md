# Task 013: Backend-wiring — Gör det befintliga verkligt (Fas 13)

## Sammanfattning

I **Fas 13** har samtliga mock-datakällor och statiska tillstånd i huvudnavigationen och composern kopplats till verkliga backend-källor i LibreChat.

Ingen mock-import återstår i någon tab eller vy som nås från huvudnavigationen.

---

## Genomförda åtgärder

### 1. Minnen (`MemoryTab.tsx` & `MemoryDetailView.tsx`)
- **Före:** `INITIAL_MEMORIES` i lokal `useState`, muterade endast React state.
- **Efter:**
  - `INITIAL_MEMORIES` togs bort helt.
  - Kopplad via React Query till `/api/memories` med `useMemoriesQuery`, `useCreateMemoryMutation`, `useUpdateMemoryMutation`, `useDeleteMemoryMutation`, och `useUpdateMemoryPreferencesMutation`.
  - Stöd för direkt skapande via naturligt språk-kommandorad längst ner (genererar giltiga minnesnycklar enligt schema `/^[a-z_]+$/`).
  - Stöd för import av minnen via `ImportMemoryModal`.
  - Redigering och radering av minnen i `MemoryDetailView` slår direkt mot databasen.
  - Togglingen av "Generate memory from chats" synkas med användarens `personalization.memories` i backend.

### 2. Cowork-uppgiftslistan (`CoworkTaskList.tsx` & `/api/cowork/tasks`)
- **Före:** Hårdkodad `DEFAULT_COWORK_TASKS` med 3 statiska mock-tasks.
- **Efter:**
  - Ny backend-rutt `api/server/routes/cowork.js` monterad på `/api/cowork`.
  - `GET /api/cowork/tasks` aggregerar verkliga aktiva schemakörningar (`getActiveRunsForUser`), väntande scheman (`getSchedulesByUser`), och aktiva subagent-trådar (`listActiveSubagentThreadLeases`), samt stöd för ad-hoc cowork-uppgifter.
  - `POST /api/cowork/tasks/clear` och `DELETE /api/cowork/tasks/:id` för avfärdande/stopp.
  - Ny React Query-hook `useCoworkTasksQuery` och `useClearCoworkTasksMutation` i `client/src/data-provider/Cowork/`.
  - `CoworkTaskList` läser `useCoworkTasksQuery` och döljs när inga aktiva uppgifter körs. `DEFAULT_COWORK_TASKS` borttagen.

### 3. UsageLimitPopover (`UsageLimitPopover.tsx`)
- **Före:** Hårdkodade standardvärden ("34m", "Normal", "In 3 days").
- **Efter:**
  - Kopplad till `useGetUserBalance` och `useGetStartupConfig`.
  - Visar användarens verkliga tokensaldo, kvotläge, refill-intervall och OpenRouter-status.

### 4. OutputFormatDropdown (`OutputFormatDropdown.tsx` & `ChatForm.tsx`)
- **Före:** Död kod: dropdown sparade till `outputFormatFamily`, men värdet lästes aldrig vid meddelandesändning.
- **Efter:**
  - `ChatForm.tsx` läser `outputFormatFamily(index)`.
  - Vid val av `docs`, `slides` eller `design` injiceras ett formatdirektiv i `submitComposerText` som instruerar modellen att strukturera svaret som dokument, presentation eller designspecifikation.
  - Standardläget `artifact` bibehåller normal interaktiv artefaktgenerering.

### 5. Claude Code-vyer (`ClaudeCodeTab.tsx` & `CodeDashboard.tsx`)
- **Före:** `MOCK_TOKENS` med 6 fejkade enheter i `ClaudeCodeTab.tsx`; statiska 42 sessioner, 384 meddelanden och fejk-heatmap `(idx * 17) % 7` i `CodeDashboard.tsx`.
- **Efter:**
  - `ClaudeCodeTab.tsx`: `MOCK_TOKENS` togs bort helt. Kopplad till `/api/api-keys` med `useQuery` och `useMutation` för att lista och återkalla auktoriserade klientnycklar.
  - `CodeDashboard.tsx`: Sessions, meddelanden, aktiva dagar, aktivitetstopp och heatmap beräknas deterministiskt från användarens faktiska konversationshistorik via `useConversationsInfiniteQuery` och verkligt tokensaldo via `useGetUserBalance`.

---

## Verifiering

- `npm --prefix client run typecheck`: **0 fel (100% grönt)**
- Inga `MOCK_`, `DEFAULT_COWORK_TASKS` eller `INITIAL_MEMORIES` kvar i gränssnittet.
- Samtliga commits genomförda med godkända husky pre-commit hooks (ESLint, Prettier, Import sorting).
