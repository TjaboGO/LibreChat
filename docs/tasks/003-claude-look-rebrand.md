# Task 003 — Rebrand till Claude-look

**Förutsättning:** Task 001–002 klara (appen fungerar funktionellt).

**Mål:** Appen ser ut som Claude-appen på skärmnivå, utan att bryta LibreChats
tema-arkitektur.

**Steg:**

1. Läs "Frontend theming and styling" i `docs/upstream/LIBRECHAT_AGENTS.md` innan du
   rör en enda komponent. Regeln: semantiska tema-roller, inga hårdkodade färger.
2. Definiera Claude-paletten (varm off-white bakgrund, den distinkta orange/terrakotta
   accentfärgen, mörkt kolgrå text, serif-rubriker om det ska matcha exakt) i
   temaregistret — troligen `packages/client` eller motsvarande tokens-fil som
   `Theme definition` i `docs/upstream/LIBRECHAT_CONTEXT.md` beskriver.
3. Byt logotyp/favicon/produktnamn i konfigurationen (`librechat.yaml`
   `interface`-sektion och motsvarande klient-konstanter) — inte hårdkodat i
   komponenter.
4. Gå igenom: sidopanel (konversationslista), chattbubblor, input-fält,
   Artifacts-split-view, modellväljare. Jämför sida vid sida mot skärmdumpar av
   Claude-appen (be användaren om aktuella skärmdumpar om det behövs — gissa inte på
   exakta hex-koder från minnet).
5. Kör visuell regression manuellt i ljust OCH mörkt läge — LibreChat har båda.

**Klart när:** en person som inte känner till projektet skulle gissa att det här är
Claude vid en snabb titt, och `npx tsc --noEmit` + `npm run lighthouse` är gröna.

**Rör inte:** backend-logik. Det här är ett rent frontend/tema-task.
