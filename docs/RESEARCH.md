# Grundval: varför LibreChat

Utvärderade fyra självhostade alternativ mot kraven: agent-looping, MCP, Skills,
Artifacts, subagents/multi-agent-samarbete ("Cowork"), extended thinking-visning, och
enkel koppling till OpenRouter/valfri OpenAI-kompatibel provider.

## Kandidater

| Projekt | Licens | Aktivitet (sep 2026) | Agents + MCP | Skills | Artifacts | Multi-agent/"Cowork" | Custom/OpenRouter-providers |
|---|---|---|---|---|---|---|---|
| **LibreChat** | MIT | Aktiv, förvärvat av ClickHouse nov 2025, ~43k stjärnor | Ja, moget — Agents-endpoint med tool-use, MCP-klient, HITL | Ja — SKILL.md-liknande paketering + skills-marketplace inbyggt | Ja — React/HTML/Mermaid-rendering i sidopanel | Ja — subagents som egna "child conversations" med live-aktivitetsström | Ja — `endpoints.custom` i `librechat.yaml`, OpenRouter är ett dokumenterat exempel |
| **Open WebUI** | BSD-3 (delvis proprietär "hosted"-gren) | Aktiv, störst community (~140k stjärnor) | Pipelines/plugins, enklare än LibreChat | Delvis via plugins | Ja, uppskattad kodpanel | Nej, inget renodlat subagent-system | Ja, brett providerstöd |
| **LobeChat / LobeHub** | Skiftande licens mellan versioner — verifiera innan produktion | Aktiv, pivoterar mot "agent-team"-produkt (LobeHub) | MCP-marknadsplats (10k+ verktyg) | Ja | Ja, plus "Thinking"-visning | Ja — "Agent Groups", konceptuellt närmast "Cowork" | Ja |
| **Open Claude / övriga Claude-kloner** | Varierar, ofta små hobbyprojekt | Låg — enstaka underhållare | Nej/begränsat | Nej | Delvis | Nej | Varierar |

## Beslut: LibreChat

Avgörande skäl:

1. **Redan har det mesta byggt.** En kodgenomgång av det klonade repot (inte bara
   marknadsföringstext) visar att Agents, MCP-klient, Skills, Artifacts, Memory,
   röst (STT/TTS) och en agent-marknadsplats redan finns som riktig, testad kod —
   inte bara på roadmapen. Se [FEATURES.md](FEATURES.md) för radnivå-bevis (filvägar).
2. **OpenRouter är redan ett förstklassigt exempel-block** i `librechat.example.yaml`,
   inte något som måste byggas från grunden.
3. **MIT-licens** — fri att forka och kommersialisera/anpassa utan restriktioner.
4. **Aktivt underhållen och välfinansierad** (ClickHouse-förvärvet), vilket minskar
   risken att grunden överges mitt i projektet.
5. **Arkitekturen matchar målet**: Node/Express-API + React-klient + MongoDB, samma
   familj av verktyg som Claude Code/Gemini CLI redan är vana att jobba i.

## Varför inte de andra

- **Open WebUI** är ett starkare val om målet vore en bred, community-driven
  RAG/kunskapsbas-produkt för icke-tekniska team — men saknar ett renodlat
  subagent-/"Cowork"-koncept och är svagare på MCP/agent-djup än LibreChat.
- **LobeChat/LobeHub** har den mest Cowork-lika visionen (Agent Groups) men projektet
  har bytt riktning och licens flera gånger under 2025–2026; innan man bygger en
  produkt ovanpå det bör licensen för den exakta version man forkar dubbelkollas.
  Värt att återbesöka som inspirationskälla för hur "Agent Groups"-UX kan se ut.
- **Renodlade "Claude-kloner"** är oftast enmansprojekt utan agent-infrastruktur —
  de vinner på utseende men förlorar allt som gör Claude faktiskt användbart
  (verktygsanvändning, MCP, Skills).

## Öppna risker att hålla koll på

- LibreChats Agents/Subagents-lager är byggt kring Anthropics/OpenAIs
  reasoning-format. När modellen bakom OpenRouter är t.ex. DeepSeek-R1 eller GLM
  måste reasoning/tool-call-formatet mappas korrekt — se
  [ARCHITECTURE.md](ARCHITECTURE.md).
- Ingen inbyggd motsvarighet till schemalagda uppgifter (cron-agents) eller
  computer use (skärm-/browserautomation) hittades i koden — dessa är riktiga
  gap, inte bara UI-polish. Se ROADMAP fas 4–5.
- "Claude Docs" och "Claude Slides" är nya produkter (lanserade 16 sep 2026) utan
  motsvarighet i LibreChat — flaggat som stretch goal, inte MVP.
