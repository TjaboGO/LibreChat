# Funktionskarta: Claude → den här appen

Status baseras på en verklig kodgenomgång av det klonade LibreChat-repot
(commit `12d78909d`, sep 2026) — inte på blogginlägg. ✅ = finns och är kod, inte bara
roadmap. 🟡 = grundstruktur finns, kräver konfiguration/anpassning. 🔴 = saknas helt,
måste byggas.

## P0 — Kärnan (måste fungera för att kalla det en Claude-klon)

| Claude-funktion | Status | Var i koden / vad som krävs |
|---|---|---|
| Chatt med streaming, konversationshistorik, sök | ✅ | Kärnfunktion i `client/` + `api/`, MongoDB för historik |
| Modellbyte mitt i konversation | ✅ | `endpoints.custom` i `librechat.yaml`, redan modellagnostiskt |
| **Koppling till OpenRouter** (alla modeller, inkl. DeepSeek) | ✅ | Färdigt exempelblock i `librechat.example.yaml:975-990`. Bara `OPENROUTER_KEY` + avkommentering krävs |
| Extended thinking / reasoning-visning | ✅ | `client/src/components/Chat/Messages/Content/Parts/Thinking.tsx`, `Reasoning.tsx` — måste verifieras mot DeepSeek-R1:s reasoning-fält (annat format än Anthropics) |
| Agents (tool-use/agentic looping) | ✅ | Hela `packages/api/src/agents/` — run-lifecycle, checkpoints, HITL (human-in-the-loop) |
| Artifacts (kod/React/HTML/Mermaid i sidopanel) | ✅ | `client/src/components/Artifacts/`, `ArtifactsContext.tsx` |
| MCP-klient (koppla externa verktygsservrar) | ✅ | `packages/api/src/mcp/` — OAuth, connection pooling, per-request headers |
| Filuppladdning / RAG | ✅ | RAG-API-tjänsten i `docker-compose.yml`, vektor-DB |
| Autentisering (lokal + OAuth/LDAP) | ✅ | Inbyggt, multi-user från start |

## P1 — Det som gör det till "Claude", inte bara "en chattbot"

| Claude-funktion | Status | Var i koden / vad som krävs |
|---|---|---|
| Skills (paketerade, återanvändbara instruktioner+verktyg) | ✅ | `packages/data-schemas/src/schema/skill.ts`, `skillFile.ts`, `packages/api/src/agents/skillFiles.ts`, admin-API i `packages/api/src/admin/skills.spec.ts` — motsvarar Anthropics SKILL.md-modell |
| Agent-/Skills-marknadsplats | ✅ | `client/src/components/Chat/Menus/Endpoints/components/Marketplace.tsx`, `AgentMarketplaceButton.tsx` |
| Subagents / "Cowork" (flera agenter som samarbetar i en session) | ✅ | Väldokumenterat i `docs/upstream/LIBRECHAT_CONTEXT.md`: "Subagent thread", "Live subagent task owner", "Subagent completion wakeup", "Subagent activity stream" — en parallell child-conversation-modell, konceptuellt mycket nära Claude Cowork |
| Projects (persistent kunskap/filer per arbetsyta) | 🟡 | Agents har egen fil-/kunskapsbindning men inget renodlat "Project"-begrepp som samlar flera konversationer — behöver either mappas mot befintliga Agents+RAG, eller ett tunt UI-lager ovanpå |
| Memory (Claude minns tvärs konversationer) | ✅ | Helt eget lager: `packages/api/src/memory/`, `packages/data-schemas/src/methods/memory.ts` |
| Röst (tal-till-text, text-till-tal) | ✅ | `api/server/routes/files/speech`, `useSpeechToText*.ts`, `useTextToSpeechBrowser.ts` |
| HITL / godkänn verktygsanrop | ✅ | `packages/api/src/agents/hitl/protection.ts` |

## P2 — Polish och Claude-app-paritet på UI-nivå

| Claude-funktion | Status | Vad som krävs |
|---|---|---|
| Utseende identiskt med Claude-appen (färger, typsnitt, layout, ikoner) | 🔴 | Ren rebrand/omskinning ovanpå LibreChats komponentbibliotek (`@librechat/client`) — se ARCHITECTURE.md, respektera projektets tema-tokens istället för hårdkodade färger |
| "Fast mode" / modellhastighetsväxel | 🔴 | UI-genväg, backend redan modellagnostisk |
| Presets/anpassade personas | ✅ | Redan en LibreChat-kärnfunktion (Presets) |
| Delning av konversationer/artifacts | ✅ | `client/src/components/Share/ShareArtifacts.tsx` |

## P3 — Verkliga luckor (inget existerande att luta sig mot)

| Claude-funktion | Status | Kommentar |
|---|---|---|
| Schemalagda/bakgrundskörande agenter (cron-liknande) | 🔴 | Ingen träff i koden. Måste byggas: en scheduler-tjänst som triggar Agents-endpointen, liknande hur "Subagent completion wakeup" redan fungerar internt — bygg vidare på det mönstret istället för separat system |
| Computer use (skärm-/webbläsarautomation) | 🔴 | Ingen träff. Kräver en sandboxad browser/VM-worker + verktygsdefinition, likt Anthropics computer-use-verktyg. Största enskilda byggblocket i hela planen |
| Claude Docs / Claude Slides (levande dokument/presentationer) | 🔴 | Anthropic lanserade dessa 16 sep 2026 — helt nytt produktkoncept utan motsvarighet. Stretch goal, inte MVP |
| Native mobilapp | 🔴 | LibreChat är webb-först (PWA-möjligt). Riktig nativ app är ett separat, stort spår — lågt prioriterat |

## Inte relevant för ett självhostat projekt

Team-/orgadministration, fakturering, enterprise-SSO-nivåer m.m. finns i LibreChat men
är inte prioriterat här eftersom appen är för personligt/enskilt bruk mot din egen
OpenRouter-nyckel.
