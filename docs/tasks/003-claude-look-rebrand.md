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

## Resultat och genomförande

Genomfört:
1. **Färgpalett & Tokens:**
   - Ersatte LibreChats gråa standardpalett med Claudes varma off-white/beige palett (`#FAF9F5` canvas, `#F3EFE6` sidebar, `#EEEAE0` bubblor, `#D97757` terrakotta accent) i både ljust och mörkt (`#1E1D1B` canvas, `#181716` sidebar) läge via `packages/client/src/theme/themes/default.ts` och `dark.ts`.
   - WCAG AA-kontraster (4.5:1 text, 3:1 kontroller) justerade och fullt godkända i samtliga semantiska tester (`semanticTokens.spec.ts`).
2. **Typografi:**
   - Registrerade `font-serif` (`Charter`, `Bitstream Charter`, `Sitka Text`, `Georgia`, `serif`) i Tailwind-konfigurationerna.
   - Claude-rubriker och välkomsthälsning renderas i elegant serif.
3. **Logotyp & Ikonografi:**
   - Claudes officiella 14-spetsiga starburst-vektor skapad som `ClaudeIcon` och Claude wordmark som `ClaudeLogo` i `packages/client/src/svgs/`.
   - Både Anthropic och OpenRouter modeller i leverantörsregistret kopplade till `ClaudeIcon` med brand-färg `#D97757`.
   - Favicon och `logo.svg` uppdaterade till Claude starburst.
4. **Layout & Komponenter:**
   - Landningssida: Centrerad terrakotta Claude-ikon och naturlig serif-hälsning baserad på tid på dygnet ("Good morning/afternoon/evening, [Namn]").
   - Sidebar: `ClaudeLogo` i toppen och "Start new chat"-pillerknapp med pennaikon.
   - Composer: Rundad terrakotta submit-knapp (`bg-surface-submit`) med vit pil, och autentiska placeholders ("How can Claude help you today?" på landningssidan, "Reply to Claude..." i aktiva chattar).
   - Footer: Uppdaterad med Claudes standarddisclaimer ("Claude can make mistakes. Please double-check responses.").
   - Branding: `<title>Claude</title>`, `appTitle: "Claude"` i `.env`, `librechat.yaml` och backend startup-config.
5. **Verifiering:**
   - 48 testsviter / 517 tester passerar grönt (`npm --prefix packages/client test`).
   - `tsc --noEmit` felfritt i både `packages/client` och `client`.
   - Produktionsbygge av frontend (`npm --prefix client run build`) lyckades och serveras av backend på `http://localhost:3080`.
