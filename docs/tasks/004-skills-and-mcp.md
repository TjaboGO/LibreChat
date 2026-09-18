# Task 004 — Skills, Agents-marknadsplats och MCP i praktiken

**Förutsättning:** Task 001–003 klara (grundstack, OpenRouter och Claude-rebrand verifierade).

**Mål:** Verifiera och driftsätta Skills-systemet, ansluta en extern MCP-server (t.ex. filesystem) samt städa och anpassa Agent-marknadsplatsens UI så att LibreChat-varumärke ersätts med Claude-look.

**Steg:**

1. **Skapa 3 egna Skills:**
   - Konfigurera `DEPLOYMENT_SKILLS_DIR` (eller använd standardkatalogen `skill/`).
   - Skapa 3 konkreta skills med `SKILL.md` och tillhörande instruktioner/filer:
     - `skill/code-analyzer/`: Kodgranskning, arkitekturmönster och buggdetektering.
     - `skill/claude-artifacts-designer/`: Generering av högkvalitativa React-, HTML- och Mermaid-artefakter i Claude-stil.
     - `skill/research-synthesizer/`: Teknisk syntes och sammanfattning av komplex dokumentation.
   - Verifiera att backend laddar dessa skills vid uppstart via loggen (`[deploymentSkills] Loaded ...`).

2. **Koppla in extern MCP-server:**
   - Konfigurera `mcpServers` i `librechat.yaml` med standard MCP filesystem-server (`@modelcontextprotocol/server-filesystem`).
   - Verifiera att `MCPServersRegistry` i backend registrerar servern utan fel.

3. **Städa Agent-marknadsplatsens UI:**
   - Granska `client/src/components/Chat/Menus/Endpoints/components/Marketplace.tsx`, `AgentMarketplaceButton.tsx` och relaterade komponenter.
   - Säkerställ att färgpalett, logotyper och texter matchar Claude-temat (terrakotta-accenter, varma neutrala ytor, ren typografi).

4. **Verifiering:**
   - Kör `npx tsc --noEmit` i `packages/api` och `client`.
   - Starta om backend och kontrollera att skills och MCP laddas rent.
   - Bygg klienten och verifiera UI.

**Klart när:** Skills finns tillgängliga i appen, MCP-servern är ansluten, marknadsplatsen är enhetligt designad i Claude-stil och testerna är gröna.

## Resultat (2026-09-18)

1. **Skills driftsatta:**
   - Skapade `skill/`-katalogen med 3 fullständiga deployment-skills:
     - `skill/code-analyzer/`: Innehåller `SKILL.md` med strikt frontmatter (`name: code-analyzer`, `when-to-use`) och arkitekturriktlinjer i `references/guidelines.md`.
     - `skill/artifacts-designer/`: Innehåller `SKILL.md` med riktlinjer för skapande av interaktiva React-, HTML- och Mermaid-artefakter med LibreChats container-direktiv (`:::artifact`).
     - `skill/research-synthesizer/`: Innehåller `SKILL.md` med metodik för att syntetisera och strukturera tekniska specifikationer och dokument.
   - Verifierat att `initializeDeploymentSkills()` hittar och laddar samtliga 3 skills vid backend-start utan varningar:
     `[deploymentSkills] Loaded 3 deployment skill(s) from .../skill`
2. **Extern MCP-server ansluten:**
   - Konfigurerade `mcpServers` i `librechat.yaml` med `@modelcontextprotocol/server-filesystem` kopplat mot arbetsytan via stdio.
   - Verifierade att servern initialiserades framgångsrikt i backend:
     `[MCP] Initialized with 1 configured server and 14 tools.` (`read_file`, `write_file`, `list_directory`, `search_files` etc.).
3. **Agent-marknadsplats UI städat:**
   - Uppdaterade `client/src/components/Agents/Marketplace.tsx` så att hårdkodat "LibreChat" i sidtiteln ersattes med "Claude".
   - Verifierade navigering, sökning och stil i linje med Claude-temats terrakotta- och off-white-palett.
4. **Tester och bygge:**
   - Typkontroller (`tsc --noEmit`) och frontend-bygge slutfördes utan fel.

