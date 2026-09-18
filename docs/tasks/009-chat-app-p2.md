# Task 009 — Chat-appen, P2 (pixelmatchning & hjälpdialoger)

**Förutsättning:** Task 001–008 klara. Läs [docs/ui-reference/PLAN.md](../ui-reference/PLAN.md) och motsvarande sektioner i `docs/ui-reference/batch-1..4-screenshots.md` innan du börjar — de innehåller den exakta UI-texten och layouten detta task ska matcha.

**Mål:** Implementera P2-funktionerna: Chats and tasks-fullista med filter, Settings-flikar för Design systems, Plugins, Extensions och Developer, Chat Info-modal samt kontomenyn i sidopanelens fot.

---

## Delmoment

1. **Chats and tasks fullista (`ChatsAndTasksPage.tsx`):**
   - Rutt under `/chats` eller liknande vy i huvudytan.
   - Sidhuvud: Stort serif "Chats and tasks".
   - Verktygsrad höger: Sökikon/sökfält, filter/sliders-ikon (öppnar dropdown: "All", "Chat", "Shared", "Cowork", "Archived" med checkmark på aktiv), "Select"-knapp (outline pill), "New"-knapp (svart pill).
   - Lista över chattar och uppgifter med titel, typ/status och relativ tidsstämpel, separerade med tunna hairlines.

2. **Settings — Design systems-fliken (`DesignSystemsTab.tsx`):**
   - Placerad under Settings-gruppen.
   - Header "Design systems", subtext "Design systems give Claude your colors, type and components to use when making designs, decks and prototypes.".
   - Knapp uppe till höger: "+ New design system" med chevron som fäller ut:
     - "Using Claude" — "Upload brand files, pull from design connectors, or describe it"
     - "Using Claude Code" — "Claude Code reads your repo's tokens and components"
   - Sökfält: "Search by name".
   - Tabellkolumner: "Name", "Usable by", "Published".
   - Tomt tillstånd: "No design systems yet. Make one, or ask a teammate to share one with you, and it shows up here.".

3. **Settings — Plugins-fliken (`PluginsTab.tsx`):**
   - Placerad under Customize-gruppen.
   - Header "Plugins", sökfält "Search plugins".
   - Flikar: "Your plugins" / "Discover".
   - Your plugins: tomt tillstånd ("No plugins installed yet. Explore plugins below or create your own.") eller installerade insticksprogram.
   - Discover: grid med färdiga plugin-paket (t.ex. GitHub + PR Reviewer, Figma + UI Generator, Slack + Standup Assistant, Postgres + Data Analyst) med `+`-knappar.

4. **Settings — Extensions-fliken (`ExtensionsTab.tsx`) & Developer-fliken (`DeveloperTab.tsx`):**
   - Placerade under Desktop app-gruppen.
   - **ExtensionsTab:** Header "Extensions", subtext "Manage installed desktop extensions.", tomt tillstånd med pusselikon, "No extensions installed" och "Browse extensions"-knapp.
   - **DeveloperTab:** Header "Local MCP servers", subtext "Add and manage MCP servers that you're working on.", centrerat tomt läge med terminal/monitorikon, "No servers added", två knappar: "Edit config" (svart primär) och "Developer docs ↗" (outline med extern länk).

5. **Chat Info-modal (`ChatInfoModal.tsx`):**
   - Titel: "Chat info" med stängningskryss.
   - Metadatafält: Created date, Last interacted, Total messages, Model (t.ex. DeepSeek Reasoner via OpenRouter), Estimated tokens.
   - "Notes"-fält (anteckningar om chatten).
   - "Done"-knapp.

6. **Kontomeny i sidopanelens fot (`AccountMenu.tsx` / `AccountSettings.tsx`):**
   - Anchored ovanför användarens avatar/namn i sidopanelens fot.
   - Header: användarens e-postadress i dämpad text.
   - Menyelement med ikoner: "Settings" (med tangentbordsgenväg `⌘,`), "Usage", "Language", "Get help", "Give feedback".
   - Skiljelinje.
   - "View all plans", "Get apps and extensions", "View changelog", "Learn more" (med `>` chevron).
   - Skiljelinje.
   - "Log out".

---

## Verifiering och regler

- All kod i `client/src/`.
- Inga hårdkodade hex-färger; använd designtokens (`bg-surface-primary`, `text-text-primary`, `border-border-light`, osv.).
- Kör `npm run sort-imports <filer>` på alla ändrade/nya filer.
- Verifiera med `npm --prefix client run typecheck` och enhetstester.

---

## Resultat

### Genomförda åtgärder

1. **Chats and tasks fullista (`ChatsAndTasksPage.tsx`):**
   - Skapad under `/chats` via routerkonfiguration i `client/src/routes/index.tsx`.
   - Serif-displaytitel "Chats and tasks", sökfält, filter-dropdown ("All", "Chat", "Shared", "Cowork", "Archived"), "Select"-pill (togglar multiselect-läge med checkboxes) och "New"-pill (navigerar till ny chatt).
   - Informationsikon på varje rad öppnar `ChatInfoModal`.

2. **Settings — Design systems-fliken (`DesignSystemsTab.tsx`):**
   - Skapad och bunden till `ClaudeSettingsTab.DESIGN_SYSTEMS` i `types.ts`.
   - Innehåller "+ New design system" dropdown med "Using Claude" och "Using Claude Code", sökfält "Search by name", tabellhuvud ("Name", "Usable by", "Published") och tomt läge med palettikon.

3. **Settings — Plugins-fliken (`PluginsTab.tsx`):**
   - Skapad och bunden till `ClaudeSettingsTab.PLUGINS` i `types.ts`.
   - Innehåller sökfält "Search plugins", flikarna "Your plugins" och "Discover", plugin-paket för GitHub, Figma, PostgreSQL och Slack med installera/avinstallera-interaktion.

4. **Settings — Developer (`DeveloperTab.tsx`) och Extensions (`ExtensionsTab.tsx`):**
   - Skapade och bundna till `ClaudeSettingsTab.DEVELOPER` och `ClaudeSettingsTab.EXTENSIONS`.
   - Developer: MCP server management, "Edit config" och "Developer docs ↗".
   - Extensions: Desktop-tillägg och "Browse extensions".

5. **Chat Info-modal (`ChatInfoModal.tsx`):**
   - Modal för detaljerad chattmetadata (Created, Last active, Messages, Model) samt redigerbart Notes-fält med "Done"-knapp.

6. **Kontomeny (`AccountSettings.tsx`):**
   - Uppdaterad till Claude profillayout med e-post i dämpad text i sidhuvudet.
   - Sektion 1: "Settings" (med `⌘,` kortkommando), "Usage" (öppnar Billing), "Language" (öppnar Preferences), "Get help", "Give feedback".
   - Sektion 2: "View all plans", "Get apps and extensions", "View changelog", "Learn more" (undermeny med Docs, Shortcuts, Archived chats, ToS, Privacy).
   - Sektion 3: "Log out".
   - Stöd för `initialTab` i `SettingsDialog` och `Settings.tsx` så att menylänkar öppnar rätt inställningsflik direkt.

7. **Testtäckning & verifiering:**
   - 11 testsviter / 32 enhetstester gröna (`AccountSettings.spec.tsx`, `DesignSystemsTab.spec.tsx`, `PluginsTab.spec.tsx`, `DeveloperTab.spec.tsx`, `ExtensionsTab.spec.tsx`, `ChatInfoModal.spec.tsx`, `ChatsAndTasksPage.spec.tsx`, m.fl.).
   - TypeScript typkontroll passerar utan fel (`npm --prefix client run typecheck`).
   - ESLint och Prettier validerade med `--max-warnings=0`.

