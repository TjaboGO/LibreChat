# Claude UI-matchning — samlad plan

Baserad på: `batch-1..4-screenshots.md` (79 skärmdumpar, katalogiserade av fyra
parallella agenter) + `anthropic-docs-summary.md` (4 PDF:er från anthropic.com).

## Viktigaste upptäckten: tre separata produkter i skärmdumparna

Skärmdumparna visar inte bara "Claude-chatten" — de spänner över **tre olika
Anthropic-produkter** som råkar dela samma visuella språk:

1. **Claude chat-appen** (claude.ai) — det egentliga målet för vårt LibreChat-fork.
2. **Claude Code** (claude.ai/code) — en helt separat kodningsagent-produkt med eget
   dashboard, Routines, Folders, Prompts/Chains, repo/branch/worktree-chips,
   användningsstatistik med heatmap osv.
3. **Claude Design** — ett fristående design-canvas-verktyg (mallar, designsystem,
   Figma/GitHub-kopplingar) utan sidopanel alls.

**Beslut (bekräftat av användaren): bygg alla tre, i faser.** Fas 6–8 (chat-appen)
går först eftersom allt annat återanvänder dess tema/komponentgrund. Fas 9
(Claude Code-dashboard) och Fas 10 (Claude Design) är egna, mycket större
produktytor och får sin egen detaljplanering när de faserna påbörjas — se
[ROADMAP.md](../ROADMAP.md).

## Ground truth-regel när dokument och skärmdumpar motsäger varandra

Anthropics blogginlägg ("Cowork and chat are now one Claude", 16 sep) säger att
Cowork-läget är borta. Men **skärmdumparna, tagna 18 sep, visar fortfarande aktivt
en Chat/Cowork-växlare, en egen Cowork-uppgiftslista och en egen Settings→Cowork-
flik.** Dokumentet förklarar själv varför: utrullningen är gradvis (Pro/Max först).//
Din inloggning har alltså inte fått den nya UI:n än.

**Beslut: skärmdumparna är facit.** Vi bygger vad som faktiskt syns (dubbla
Chat/Cowork-läget), inte Anthropics framtida målbild. Blogginläggen används bara för
korrekt terminologi och för att förstå *varför* vissa saker ser ut som de gör.

## Rättelse av redan committat arbete

`CoworkButton.tsx` (i Orca-worktreen, redan committad) matchar **inget** i
skärmdumparna — den bygger en knapp i chat-headern som öppnar en subagent-panel.
Den verkliga "Cowork"-funktionen är istället:
- en Chat/Cowork-segmentväxlare **inne i composern**,
- en betingad uppgiftslista **under composern** ("Active"-sektion, "Clear active"),
- en egen `Settings → Cowork`-flik med riktiga inställningar (Require trusted
  devices, Cowork files-sökväg, Trusted Cowork folders, Preferred browser, m.m.).

Det här behöver byggas om — inte bara poleras.

Sidopanelens "Start new chat"-pillerknapp är också fel form: riktiga UI:t har bara
en fetstilt "+ New"-rad högst upp i navlistan (New, Projects, Artifacts, Scheduled,
Design, Customize, More), ingen separat knapp under logotypen.

## Skärm-för-skärm-inventering (Claude chat-appen, i scope)

| Skärm | Nuvarande LibreChat | Mål (från skärmdumpar) | Prio |
|---|---|---|---|
| Sidopanel-nav | Egen ordning, "Start new chat"-knapp | `+ New`, Projects, Artifacts, Scheduled, Design, Customize, More; Pinned-sektion; "Chats and tasks" med sök+filter | P0 |
| Landningssida | Enkel hälsning + composer | Hälsning + usage-banner + composer + kvicktoggles (Project/Auto/Output) + "Active"-uppgiftslista | P0 |
| Composer | Enkel input | Chat/Cowork-toggle, ordräknare-popover, usage-popover, `+`-meny (Files/Screenshot/Add to project/Skills/Connectors/Design system/Plugins/Research/Web search/Memory) | P0 |
| Modell/Effort/Thinking-väljare | Finns i grunden (Task 002 verifierade det) | Två-nivå flyout: modellista m. beskrivningar → Effort (Low/Medium/High/Extra/Max) → Thinking-toggle | P0 |
| Output-format-dropdown | Saknas | Docs/Slides/Design (alla "Beta") + Artifact ("Let Claude pick the format") | P1 |
| Settings-skal | Ostrukturerat | En modal, vänster-nav grupperad i "Settings/Desktop app/Customize", höger innehållspanel | P0 |
| Settings — Preferences | Saknas troligen | Appearance (Theme/Chat font/Motion), Voice, Notifications (5 toggles) | P0 |
| Settings — Account | Saknas | Profile, Instructions for Claude, Log out/Delete account, Trusted devices, Active sessions-tabell | P0 |
| Settings — Privacy | Saknas | Data-praxis-text, toggles, "Your data"-knapparad (Export/Manage) | P1 |
| Settings — Capabilities | Saknas | Tool access mode, Artifacts/AI-powered artifacts/Inline visualizations, Code execution+network egress+domain allowlist | P1 |
| Settings — Memory | Backend finns (`packages/api/src/memory`) men inget UI av det här slaget | Toggle-rader + grupperad lista (You/Topics/Projects) + NL-kommandofält + Import-modal + entry-detalj | P1 |
| Settings — Design systems | Saknas | Tom-state + "New design system"-dropdown (Using Claude / Using Claude Code) | P2 |
| Settings — Cowork | Saknas | Se rättelse ovan | P1 |
| Settings — Skills | Backend finns (skills-systemet vi redan hittade) | Your skills/Discover-flikar, Add-meny, skill-kort med taggar/installs | P1 (mest UI, backend redo) |
| Settings — Connectors | MCP-config finns i `librechat.yaml` | Your connectors/Discover, "Add custom connector"-modal (Name + MCP server URL) — **detta är bara ett UI-lager ovanpå MCP-konfigen vi redan har** | P1 |
| Settings — Plugins | Saknas (nytt koncept: connector+skill-bundlar) | Tom-state + Discover-grid | P2 |
| Settings — Extensions/Developer | Saknas | Local MCP servers-vy — mappar mot samma MCP-lager | P2 |
| Projects | Ingen renodlad motsvarighet | Lista + detaljsida (Instructions/Memory/Context/Folder/Scheduled högerpanel) + "Set project instructions"-modal | P1 |
| Artifacts-lista | Bara split-view i chatt | Egen sida: All/Yours/Shared-flikar, "Make something new"-kort, datumgrupperad lista | P1 |
| Chats and tasks (fullista) | Bara sidopanelslistan | Egen sida m. filter (All/Chat/Shared/Cowork/Archived) | P2 |
| Chat Info-modal | Saknas | Creation date/Last interacted/Total messages/Notes | P2 |
| Kontomeny | Enkel | Settings/Usage/Language/Get help/Give feedback/View plans/Get apps/Changelog/Log out | P2 |

## Skjutet till egna faser (inte uteslutet — se ROADMAP.md Fas 9–10)

- **Claude Codes eget dashboard/Routines/Folders/Prompts-Chains/repo-chips** —
  separat, stor produktyta. Fas 9, med egen detaljplanering, efter att chat-appens
  grund (tema/komponenter/Settings-skal) är klar.
- **Claude Design-appen som helhet** (mallgalleri, designsystem, Figma-koppling) —
  eget stort verktyg som kräver ett canvas/rendering-lager LibreChat saknar helt.
  Fas 10, störst enskild insats i hela planen, byggs sist.

## Explicit uteslutet (verkligen inte relevant)

- **Desktop-native inställningar** (Run on startup, menyradsikon, Dock-studs,
  globala tangentbordsgenvägar, native skärmbehörigheter) — betydelselöst för en
  självhostad webbapp. Kan återupptas om ni senare Electron-paketerar appen.
- **Billing-fliken** — inget betalsystem i en självhostad app; kan länka till
  OpenRouters egen billing-sida istället för att bygga en egen.

## Genomförandeordning

1. **Fas 6 (P0)** — Sidopanel-nav, landningssida, composer (inkl. Chat/Cowork-
   toggle), modell/effort/thinking-väljare, Settings-skal + Preferences/Account.
2. **Fas 7 (P1)** — Projects, Artifacts-lista, Memory-inställningar, Capabilities,
   Skills-flik (UI ovanpå befintlig backend), Connectors-flik (UI ovanpå
   befintlig MCP-config), Cowork-ombyggnad (ersätter CoworkButton).
3. **Fas 8 (P2)** — Chats-and-tasks-fullista, Design systems-flik, Plugins,
   Extensions/Developer, Chat Info-modal, kontomeny.
4. **Fas 9** — Claude Codes eget dashboard (egen detaljplanering).
5. **Fas 10** — Claude Design-appen (egen detaljplanering).
