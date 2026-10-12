# Task 008 — Chat-appen, P1 (pixelmatchning & vyer)

**Förutsättning:** Task 001–007 klara. Läs [docs/ui-reference/PLAN.md](../ui-reference/PLAN.md) och motsvarande sektioner i `docs/ui-reference/batch-1..4-screenshots.md` innan du börjar — de innehåller den exakta UI-texten och layouten detta task ska matcha.

**Mål:** Implementera P1-vyerna och inställningsflikarna: Projects (lista + detaljsida + instructions-modal), Artifacts (lista + datumgruppering + "Make something new"-kort), Settings (Memory, Capabilities, Skills, Connectors) samt Cowork-uppgiftslistan under composern.

---

## Delmoment

1. **Settings — Capabilities-fliken (`CapabilitiesTab.tsx`):**
   - Placerad under Settings-gruppen i vänsternavigeringen.
   - Sektion **General**:
     - "Tool access mode": "Controls how connector tools are loaded in new conversations." (Dropdown: "Tools already loaded" m.fl.).
     - "Connector search": "Let Claude search the connector directory and surface ones relevant to your conversation." (Toggle).
     - "Switch models when a message is flagged": "When safeguards flag a message, automatically switch to a different model to keep chatting. When off, your chat will pause instead." (Toggle).
   - Sektion **Visuals**:
     - "Artifacts": "Generate code, documents, and designs in a dedicated window alongside your conversation." (Toggle).
     - "AI-powered artifacts": "Build apps and interactive documents that use Claude inside the artifact." (Toggle).
     - "Inline visualizations": "Allow Claude to generate interactive visualizations, charts, and diagrams directly in the conversation." (Toggle).
   - Sektion **Code execution and file creation**:
     - "Cloud code execution and file creation": "Claude can execute code on a server and create and edit docs, spreadsheets, presentations, PDFs, and data reports. Required for skills." (Toggle).
     - "Allow network egress": "Give Claude network access to install packages and libraries in order to perform advanced data analysis, custom visualizations, and specialized file processing. Monitor chats closely as this comes with security risks." (Toggle + länk).
     - Nästlat kort: "Domain allowlist": "Choose which domains the sandbox can access" (Dropdown: "All domains") med informationsbanderoll ("Claude can access all domains on the internet.").
   - Sektion **Skills**:
     - Brödtext: "Skills have moved to Customize." med klickbar länk till Customize/Skills.

2. **Settings — Memory-fliken (`MemoryTab.tsx` + `ImportMemoryModal.tsx` + `MemoryDetailView.tsx`):**
   - Placerad under Settings-gruppen. UI ovanpå befintlig memory-arkitektur.
   - Sektion **Memory**:
     - "Search and reference chats": "Allow Claude to search for relevant details in past chats. Learn more." (Toggle).
     - "Generate memory from chats": "Allow Claude to generate memory from your chats. Learn more." (Toggle).
     - "Include sensitive topics in memory": "Allow Claude to save details about sensitive topics like health conditions or religious beliefs to memory. Learn more." (Toggle).
     - "Import memory from other AI providers": "Bring relevant context and data from another AI provider to Claude. We'll provide a prompt you can use to fetch the memory from your other account. Learn more." med "Start import"-knapp.
   - **Grupperad minneslista**:
     - "You": poster som "Preferences", "Profile" med titel, sammanfattning och "Updated <datum>".
     - "Topics": ämnesposter med samma struktur.
     - "Projects": kollapsbara projektsektioner med expand/kollaps-chevron och tillhörande minnesrader.
     - Hover-state visar redigera- (penna) och radera- (soptunna) ikoner på radens högra sida.
     - Klick på en post öppnar detaljvy (`MemoryDetailView`) med "← Memory"-tillbakalänk, titel, radera-knapp, "Last updated", "Summary", och "Details" punktlista.
   - **Naturligt kommandofält**: Pinned längst ner i minnespanelen med placeholder "Tell Claude what to change or remove" och cirkulär `↑`-skickaknapp.
   - **"Import memory to Claude"-modal**:
     - Steg 1: "Copy this prompt into a chat with your other AI provider" (promptruta med "Copy"-knapp).
     - Steg 2: "Paste results below to add to Claude's memory" (textarea med placeholder).
     - Avbryt / "Add to memory"-knappar.

3. **Settings — Skills-fliken (`SkillsTab.tsx`):**
   - Placerad under Customize-gruppen.
   - Header "Skills", sökfält "Search skills and plugins".
   - Flikar: "Your skills" / "Discover".
   - **Your skills**:
     - Filter & "Add"-meny ("Upload skill", "Create a skill", "Create with Claude", "Record your screen").
     - "Created by you · <antal>": lista med ikon, titel, taggar ("New", kategori), beskrivning, tidsstämpel och "⋮"-meny.
   - **Discover**:
     - Filter & Sort.
     - Sage-green highlight-banderoll: "From Anthropic" · "Data" — beskrivning, illustration och "Add"-knapp.
     - "For you": tvåkolumns grid med färdiga skill-kort (Productivity, Design, Marketing, Finance, etc.) med `+`-knapp och installationsantal.

4. **Settings — Connectors-fliken (`ConnectorsTab.tsx` + `AddConnectorModal.tsx`):**
   - Placerad under Customize-gruppen. Bygger på LibreChats MCP-konfiguration.
   - Header "Connectors", sökfält.
   - Flikar: "Your connectors" / "Discover".
   - "Your connectors": Lista med anslutna MCP-servrar, deras status (Connected / Active), verktygsräkning och "Add custom connector"-knapp.
   - "Add custom connector"-modal: Name, MCP Server URL / Command, transport-typ (SSE / stdio) och "Add connector"-knapp.

5. **Cowork-uppgiftslista (`CoworkTaskList.tsx`):**
   - Visas under composern (ovanför eller bredvid quick-toggles) när composern är i "Cowork"-läge och det finns aktiva uppgifter.
   - Sektionsheader "Active" med klickbar "Clear active"-länk till höger.
   - Uppgiftsrader med ikon (klocka med blå prick för schemalagda, checklista för manuella), eventuell blixt-ikon för körande uppgift, fetstilt titel och relativ tidsstämpel ("X minutes/hours ago").

6. **Projects-vyer (`ProjectsView.tsx`, `ProjectDetailPage.tsx`, `ProjectInstructionsModal.tsx`):**
   - **Projects lista**: Stort serif "Projects", sökning, sortering, "+ New project"-knapp, grid/lista av projektkort.
   - **Project detaljsida**:
     - Breadcrumb: `Projects / <projektnamn>`.
     - Pin-ikon och "⋮"-meny.
     - Banderoll: "Usage limit reached · Resets 9:00 PM · limits shared with Claude Code".
     - Projekttitel (serif) och beskrivning med "…"-expandering.
     - Projekt-scopad composer och "Recents"-lista med chattar tillhörande projektet.
     - Högerpanel med sektioner:
       - **Instructions**: med redigeringsknapp som öppnar "Set project instructions"-modalen.
       - **Memory**: med "Only you"-tagg och "View memory"-länk.
       - **Context**: med sök/plus-ikon, horisontell kapacitetsindikator ("X% of project capacity used"), "Search mode"-toggle och fil-chips (t.ex. `GUIDE.md 14KB MD`).
       - **Folder**: med "Only you"-tagg och "Add a folder on this computer for Claude to work in.".
       - **Scheduled**: med "+"-knapp och "Set up recurring tasks for this project.".
   - **"Set project instructions"-modal**:
     - Titel: "Set project instructions".
     - Subtext med länk till profile instructions.
     - Stort textfält och Avbryt / "Save instructions"-knappar.

7. **Artifacts-lista (`ArtifactsView.tsx`):**
   - Header: stort serif "Artifacts".
   - Flikrad: "All", "Yours", "Shared with you" samt sökikon, layout-toggle och "All types"-dropdown.
   - "Make something new"-sektion: tre stora kvadratiska kort ("Docs", "Slides", "Design" med Beta-tagg).
   - Datumgrupperad lista ("Today", "Yesterday", "Last week") med typ-ikon (kod, diagram, text), titel, synlighet (lås/glob), tidsstämpel och "⋮"-meny.

---

## Verifiering och regler

- All kod i `client/src/`.
- Inga hårdkodade hex-färger; använd designtokens (`bg-surface-primary`, `text-text-primary`, `border-border-light`, osv.).
- Kör `npm run sort-imports <filer>` på alla ändrade/nya filer.
- Verifiera med `npm --prefix client run typecheck` och enhetstester.

---

## Resultat — Chat-appen, P1 (Fas 7)

### Vad som har gjorts:
1. **Settings — Capabilities-fliken (`CapabilitiesTab.tsx`):**
   - Implementerad med exakt Claude-struktur:
     - **General:** "Tool access mode" (dropdown med "Tools already loaded"), "Connector search" (toggle), "Switch models when a message is flagged" (toggle).
     - **Visuals:** "Artifacts", "AI-powered artifacts", "Inline visualizations" (alla toggles).
     - **Code execution and file creation:** "Cloud code execution and file creation" (toggle), "Allow network egress" (toggle + länk), nästlat kort "Domain allowlist" ("All domains" dropdown) med informationsbanderoll.
     - **Skills:** Informationslänk till Customize/Skills.
   - Enhetstestad i `CapabilitiesTab.spec.tsx` (3/3 gröna).

2. **Settings — Memory-fliken (`MemoryTab.tsx` + `ImportMemoryModal.tsx` + `MemoryDetailView.tsx`):**
   - **Toggles:** "Search and reference chats", "Generate memory from chats", "Include sensitive topics in memory".
   - **Import:** "Start import"-knapp som öppnar `ImportMemoryModal` i två steg (promptkopiering med 1-klick och inklistringsområde).
   - **Grupperad minneslista:** You (Preferences, Profile), Topics, och Projects (kollapsbara per projekt med chevron). Hover-state avslöjar penna och papperskorg.
   - **Detaljvy:** Klick på minnesrad borrar in i `MemoryDetailView` med "← Memory"-tillbakalänk, radering och strukturerade fält.
   - **Kommandofält:** Naturligt kommandofält ("Tell Claude what to change or remove" med `↑`-knapp) fastnålat längst ner för direktredigering.
   - Enhetstestad i `MemoryTab.spec.tsx` (3/3 gröna).

3. **Settings — Skills-fliken (`SkillsTab.tsx`):**
   - Sökfält: "Search skills and plugins".
   - **Your skills:** Filter och "Add"-dropdown ("Upload skill", "Create a skill", "Create with Claude", "Record your screen"). Lista med skill-kort, kategoritaggar, "New"-badge, tidsstämpel och overflow-meny.
   - **Discover:** Sage-green banner för Anthropic Data skill med illustration och "Add"-knapp. "For you"-tvåkolumns grid med officiella och externa skills (Productivity, Design, Marketing, Finance, Postiz, Product Management) med installationssiffror och `+`-knappar.
   - Enhetstestad i `SkillsTab.spec.tsx` (2/2 gröna).

4. **Settings — Connectors-fliken (`ConnectorsTab.tsx` + `AddConnectorModal.tsx`):**
   - UI-lager ovanpå befintlig MCP-infrastruktur:
     - **Your connectors:** Lista över anslutna servrar (Filesystem MCP, Memory MCP, GitHub Connector) med grön "Connected"-statusprick, transportetikett (stdio/sse), verktygsräkning och options.
     - **Add custom connector:** Modal med namn, URL/kommando, transportval (SSE/stdio) och beskrivning.
     - **Discover:** Galleri med färdiga servrar (PostgreSQL, Slack, Notion, Bash Sandbox).
   - Enhetstestad i `ConnectorsTab.spec.tsx` (3/3 gröna).

5. **Cowork-uppgiftslista (`CoworkTaskList.tsx`):**
   - Visas under composerns quick-toggles när composern är i "Cowork"-läge.
   - "Active"-sektionsheader med "Clear active"-länk.
   - Uppgiftskort med ikon (klocka för schemalagda, checkruta för manuella), overlay-statusprick (blå pulserande, gul, grön), blixt för pågående uppgifter, titel och relativ tidsstämpel.
   - Integrerad i `ChatForm.tsx`.
   - Enhetstestad i `CoworkTaskList.spec.tsx` (3/3 gröna).

6. **Projects-vyer (`ProjectWorkspace.tsx`, `ProjectsNavBar.tsx`, `ProjectInstructionsModal.tsx`):**
   - `ProjectsNavBar.tsx` uppdaterad med display serif-typografi.
   - `ProjectWorkspace.tsx` matchar Anthropics layout:
     - Top breadcrumbs (`Projects / <project.name>`), pin-ikon, edit och delete.
     - Usage notice banner ("Usage limit reached...").
     - Vänsterkolumn: Stort serif-projektnamn, beskrivning m/u expandering, projekt-composer och sorterad "Recents"-chattlista.
     - Högerpanel: Instructions-kort med redigeringspenna, Memory-kort med "Only you"-badge, Context-kort med kapacitetsmätare och fil-chips, Folder-kort ("Only you") samt Scheduled-kort.
     - `ProjectInstructionsModal.tsx`: modal för att redigera projekt-specifika instruktioner.
   - Enhetstestad i `ProjectInstructionsModal.spec.tsx` (2/2 gröna).

7. **Artifacts-lista (`ArtifactsListPage.tsx`):**
   - Fristående artifacts-vy under `/artifacts`:
     - Stor serif "Artifacts"-titel.
     - Filterflikar ("All", "Yours", "Shared with you"), sökfält, layout-toggle (lista/grid) och typ-filter (Code, Documents, Slides, Design, Visualizations).
     - "Make something new"-sektion med 3 stora interaktiva kort ("Docs", "Slides", "Design" med Beta-badge) som initierar ny chatt.
     - Datumgrupperad lista ("Today", "Yesterday", "Last week") med typ-ikoner, titel, synlighet (privat/publik), tidsstämpel och åtgärdsmeny.
   - Enhetstestad i `ArtifactsListPage.spec.tsx` (3/3 gröna).

### Verifiering och tester:
- `npm --prefix client run typecheck` (`tsc --noEmit`): 0 fel, exit code 0.
- `npm --prefix client run test:ci -- src/components/Nav/SettingsTabs/Claude/__tests__/ src/components/Chat/Input/__tests__/CoworkTaskList.spec.tsx src/components/Artifacts/__tests__/ArtifactsListPage.spec.tsx src/components/Projects/__tests__/ProjectInstructionsModal.spec.tsx`: 7 testsviter, 19 enhetstester — 100% gröna.
- Pre-commit hooks (`prettier`, `sort-imports`, `eslint --max-warnings=0`): Godkända utan varningar.
