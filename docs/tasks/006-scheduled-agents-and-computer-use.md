# Uppgift 006: Schemalagda agenter, Computer Use och Live Docs/Slides (Fas 5)

## Mål

1. **Schemalagda agenter:** Aktivera och verifiera LibreChats inbyggda schemaläggare (`packages/api/src/schedules` och `client/src/components/SidePanel/Schedules`) för autonoma bakgrundskörningar utan att bygga ett separat system.
2. **Computer Use / Browser automation:** Etablera mönstret för MCP-driven webbläsarautomation och sandlådor.
3. **Live Docs & Slides:** Tillhandahålla stöd för levande presentationer och dokument likt Anthropics lanseringar (Claude Slides / Claude Docs) via interaktiva artefakter och specialiserade skills.

## Bakgrund & Källforskning

- LibreChat innehåller redan en komplett, härdad och feltolerant schemaläggarmotor:
  - Backend: `packages/api/src/schedules/` (med Redis- eller Single-process-stöd via `SCHEDULES_SINGLE_PROCESS=true`).
  - REST API: `api/server/routes/schedules.js` (`GET/POST/PATCH/DELETE /api/schedules`, `POST /api/schedules/:id/run`).
  - Datamodell: `packages/data-schemas/src/methods/schedule.ts` och `scheduleSchema`.
  - Frontend: `client/src/components/SidePanel/Schedules/` med `SchedulePanel`, `ScheduleDialog` och kadenshantering (`hourly`, `daily`, `weekdays`, `weekly`, `cron`).
  - Aktiveras deklarativt via `interface.schedules` i `librechat.yaml`.
- Computer use mappas mot standarden för Model Context Protocol (MCP) och Sandlådad kodexekvering:
  - Extern filsystem-MCP (`@modelcontextprotocol/server-filesystem`) är aktiv och ger 14 verktyg.
  - Browser-automation exponeras via MCP-servrar (t.ex. Puppeteer) och `endpoints.agents` capabilities (`execute_code`, `run_in_background`, `fileSharing`).
- Claude Slides & Claude Docs realiseras via interaktiva HTML/React-artefakter (`text/html` / `application/vnd.react`) styrda av en dedikerad deployment skill.

## Resultat (2026-09-18)

1. **Schemalagda agenter aktiverade & live-verifierade:**
   - Konfigurerade `interface.schedules` i `librechat.yaml`:
     ```yaml
     schedules:
       use: true
       create: true
       maxPerUser: 10
       minIntervalMinutes: 1
       autoDisableAfterFailures: 5
       admissionConcurrency: 20
       fireConcurrency: 5
       requireProject: false
     ```
   - Skapade en autonom agent ("Claude Assistant", ID: `agent_Zb1dqk43UoX7bGjUX3BtG`) med `deepseek/deepseek-chat` över OpenRouter.
   - Skapade ett återkommande schema ("Daily Morning Briefing", ID: `sched_8faf927e-a5d2-4fa1-9bb8-379fa3d4cbba`) med daglig körning kl 09:00 CET.
   - Verifierade manuell exekvering via `POST /api/schedules/:id/run` — schemaläggaren skapade omedelbart en dedikerad konversation och matade in agentens prompt.
   - Schemalistan är synlig i UI:t via sidopanelens navigeringslänk för Schemalagda chattar.

2. **Computer Use & Sandbox:**
   - Konfigurerade `endpoints.agents` i `librechat.yaml` med stöd för run-scoped file sharing (`fileSharing: enabled: true, allowSiblingSharing: true`), bakgrundskörning (`run_in_background`), samt kodkörningskapabiliteter.
   - MCP-filesystem är aktivt för säker filhantering och inspektion.

3. **Live Docs & Slides (Claude Slides / Claude Docs):**
   - Skapade deployment-skillen `skill/live-docs-and-slides/SKILL.md`.
   - Instruerar modellen att generera eleganta HTML5/Tailwind-presentationer med tangentbordsstyrning (piltangenter, Space, fullskärm, bildräknare) och Claude-inspirerad färgpalett (`#FAF9F5`, `#1F1E1D`, varm terrakotta `#C2410C`), samt strukturerade dynamiska dokument med innehållsförteckning och expanderbara block.
   - Backend laddar skillen vid uppstart (`[deploymentSkills] Loaded 4 deployment skill(s)`).

4. **Typkontroll och produktion:**
   - `npm --prefix client run typecheck` slutfördes utan ett enda fel (exit code 0).
   - Samtliga workspaces (`packages/data-provider`, `packages/data-schemas`, `packages/api`) byggdes utan fel.
   - `npm --prefix client run build` genererade produktionsbundeln på 4.62s.
