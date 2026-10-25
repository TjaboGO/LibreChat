#!/usr/bin/env python3
import html

def create_svg():
    blocks = [
        {
            "id": "BLOCK 1",
            "title": "BLOCK 1: APPS REGISTRY, PROMPT STORE & DATA ARCHITECTURE",
            "color": "#e11d48",
            "bg": "#1e131d",
            "phases": [
                {
                    "num": "FAS 26",
                    "title": "Unified App Registry & Types",
                    "path": "packages/data-provider/src/apps/types.ts",
                    "items": ["AppDefinition, AppSection, AppCapability", "Manifest register för samtliga 20+ appar", "Valideringsregler & enhetstester"]
                },
                {
                    "num": "FAS 27",
                    "title": "Authentic Prompt Store & Engine",
                    "path": "packages/data-provider/src/apps/promptStore.ts",
                    "items": ["Inbäddade systemprompter från 'My system prompts/'", "Variabel-injektion ({{DATE}}, {{USER}}, {{OS}})", "100% isolering: raderas från synlig chatt-array"]
                },
                {
                    "num": "FAS 28",
                    "title": "Databas & Session Scoping (appId)",
                    "path": "packages/data-schemas/src/schema/conversation.ts",
                    "items": ["Fältet 'appId' i Conversation-schemat", "MongoDB-indexering för snabb filtrering per app", "Smidig bakåtkompatibilitet (default: 'chat')"]
                },
                {
                    "num": "FAS 29",
                    "title": "Backend Hidden Prompt Dispatcher",
                    "path": "packages/api/src/endpoints/chat/index.ts",
                    "items": ["Intercept av appId i Express API-anrop", "Injektion som äkta 'system' / 'developer'-roll", "Automatisk tool-schemamappning mot OpenRouter"]
                }
            ]
        },
        {
            "id": "BLOCK 2",
            "title": "BLOCK 2: UNIFIED SIDEBAR, NAVIGATION & SCOPED ROUTING",
            "color": "#0284c7",
            "bg": "#111c26",
            "phases": [
                {
                    "num": "FAS 30",
                    "title": "Sidomeny med 4 Sektioner",
                    "path": "client/src/components/UnifiedSidebar/SidebarNavList.tsx",
                    "items": ["Core, Agents, Builders, Research-kategorier", "Lucide-ikoner matchade för alla 20+ appar", "Statusbadges ('Active Task', 'Compiling', 'Idle')"]
                },
                {
                    "num": "FAS 31",
                    "title": "Favoriter & Pinning System",
                    "path": "client/src/store/pinnedApps.ts",
                    "items": ["Pinna favoritappar till toppen av sidomenyn", "Persistering i localStorage och användarinställningar", "Drag-and-drop eller stjärnmarkering för omordning"]
                },
                {
                    "num": "FAS 32",
                    "title": "Scoped Routing & App Shell",
                    "path": "client/src/routes/AppRoute.tsx",
                    "items": ["Rutter: /app/:appId och /app/:appId/:conversationId", "AppLayout med global useCurrentApp() hook", "Dynamisk sidtitel, header och kontextmeny"]
                },
                {
                    "num": "FAS 33",
                    "title": "Isolerad Historik vs. All Activity",
                    "path": "client/src/components/UnifiedSidebar/HistoryList.tsx",
                    "items": ["Isolerad trådlista i /app/:appId-vyer", "Startsida /all med samlad aktivitet från alla appar", "App-specifika färgbrickor och ikoner i historiken"]
                }
            ]
        },
        {
            "id": "BLOCK 3",
            "title": "BLOCK 3: CORE APPS & FRONTIER PROMPTS INTEGRATION",
            "color": "#d97706",
            "bg": "#211a12",
            "phases": [
                {
                    "num": "FAS 34",
                    "title": "Core Claude Suite (Chat, Cowork, Design, Code)",
                    "path": "Anthropic/official/ & claude-*/",
                    "items": ["Opus 5.5 / Fable 5.1 dolda prompts monterade", "Subagent activity stream & Cowork task dispatcher", "Monaco diff-editor för Claude Code-läget"]
                },
                {
                    "num": "FAS 35",
                    "title": "OpenAI Frontier (Atlas Browser, GPT-5.6 Sol, o3)",
                    "path": "My system prompts/OpenAI/",
                    "items": ["ChatGPT Atlas: full-page & side-chat web research", "GPT-5.6 Sol: coding & reasoning scaffold", "Modulära docx/xlsx/slides sandlådedirektiv"]
                },
                {
                    "num": "FAS 36",
                    "title": "Frontier Open-Source (DeepSeek R1, Grok Build, Qwen)",
                    "path": "My system prompts/DeepSeek/ & xAI/",
                    "items": ["DeepSeek R1 tankekedjeprompt & resonemangsregler", "xAI Grok Build: parallella verktygsanrop & Jinja2", "Moonshot Kimi K2 & Qwen 2.5 Coder direktiv"]
                }
            ]
        },
        {
            "id": "BLOCK 4",
            "title": "BLOCK 4: AUTONOMOUS AGENTS WORKSPACES",
            "color": "#2563eb",
            "bg": "#121a29",
            "phases": [
                {
                    "num": "FAS 37",
                    "title": "Manus Workspace (/app/manus)",
                    "path": "packages/data-provider/src/manus/",
                    "items": ["Autentisk Manus Agent Loop prompt aktiverad", "Alla 31 Manus-verktyg: shell_write_to_process & ports", "Manus Live Dashboard med terminal & browser preview"]
                },
                {
                    "num": "FAS 38",
                    "title": "Cognition Devin & DeepWiki (/app/devin)",
                    "path": "My system prompts/Devin AI/",
                    "items": ["Devin AI systemprompt och arkitekturlogik", "DeepWiki sidopanel: automatisk kodbas-dokumentation", "Persistent arkitekturträd över repot"]
                },
                {
                    "num": "FAS 39",
                    "title": "Coding Studios (Cursor, Windsurf, Kiro/Traycer)",
                    "path": "My system prompts/Cursor Prompts/ & Windsurf/",
                    "items": ["Cursor Studio (/app/cursor): Fast diff & codebase_search", "Windsurf (/app/windsurf): Cascade Wave 11 & auto-healing", "Kiro/Traycer (/app/kiro): Spec vs Vibe TDD kontrakt"]
                }
            ]
        },
        {
            "id": "BLOCK 5",
            "title": "BLOCK 5: BUILDERS & LIVING OFFICE WORKSPACES",
            "color": "#7c3aed",
            "bg": "#1d1429",
            "phases": [
                {
                    "num": "FAS 40",
                    "title": "v0 Studio Integration (/app/v0)",
                    "path": "client/src/components/v0Studio/",
                    "items": ["v0 officiella prompt & shadcn/ui komponentstandarder", "AskUserQuestions interaktiva formulärkort i chatten", "React 19 Sandpack multi-viewport (Desktop/Tablet/Mobile)"]
                },
                {
                    "num": "FAS 41",
                    "title": "Lovable & Bolt Full-Stack (/app/lovable, /app/bolt)",
                    "path": "My system prompts/Lovable/ & Bolt/",
                    "items": ["Lovable Agent prompt: fullstack Supabase & SQL schema", "Bolt.new instant sandbox deployment", "Realtids preview i isolerad iframe"]
                },
                {
                    "num": "FAS 42",
                    "title": "Living Office & Notion AI (/app/office, /app/notion)",
                    "path": "client/src/components/Artifacts/OfficeStudio/",
                    "items": ["Word (.docx), Excel (.xlsx) och PowerPoint (.pptx)", "Inbyggd formelberäkning och PDF-export", "Notion AI databaser & hierarkiska dokument"]
                }
            ]
        },
        {
            "id": "BLOCK 6",
            "title": "BLOCK 6: RESEARCH, INTELLIGENCE & VERIFICATION HUB",
            "color": "#059669",
            "bg": "#10221c",
            "phases": [
                {
                    "num": "FAS 43",
                    "title": "Perplexity Deep Research (/app/research)",
                    "path": "packages/data-provider/src/research/",
                    "items": ["Autentisk Perplexity Deep Research systemprompt", "Multi-hop query planner (Hop 0, Hop 1, Hop 2)", "Klickbara citatbadges [1] och källbibliografi-kort"]
                },
                {
                    "num": "FAS 44",
                    "title": "Web Intelligence & Connectors (/app/search, /app/atlas)",
                    "path": "packages/data-provider/src/connectors/",
                    "items": ["Perplexity Computer Connector Hub (list_external_tools)", "Automatiska @mentions (@GitHub, @Slack, @Notion)", "Brave Leo & DuckAI privacy-first sökmotor"]
                },
                {
                    "num": "FAS 45",
                    "title": "Master Smoke Test, Säkerhet & Release",
                    "path": "packages/api/ & packages/client/",
                    "items": ["100% verifiering: Ingen prompttext läcker någonsin till UI", "Modellagnostisk testning mot OpenRouter (R1, Sonnet, GPT-5)", "Noll TypeScript/Lint-fel i hela monorepot"]
                }
            ]
        }
    ]

    width = 1600
    # Calculate height
    y_start = 220
    block_gap = 30
    block_heights = []
    for b in blocks:
        # number of phases: 4 phases -> 2x2 grid (height ~270) or 3 phases -> 3 cols (height ~200)
        num_phases = len(b["phases"])
        if num_phases == 4:
            h = 320
        else:
            h = 240
        block_heights.append(h)
    
    total_height = y_start + sum(block_heights) + len(blocks) * block_gap + 100

    svg = []
    svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {total_height}" width="100%" height="100%" style="background-color: #0b0d13; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;">')
    svg.append('''  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#121622" />
      <stop offset="50%" stop-color="#0a0c10" />
      <stop offset="100%" stop-color="#10141d" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>''')
    svg.append(f'  <rect width="{width}" height="{total_height}" fill="url(#bgGrad)" />')

    # Header Card
    header_subtitle = html.escape('Komplett exekveringsplan för integration av världens alla 72 AI-plattformar | 20 Granulära Faser (Fas 26 till Fas 45)')
    header_quote = html.escape('"In order to trust the output, one must understand the input." • 100% Dolda Prompter • Fri Modell via OpenRouter • Isolerade App-Sessioner')
    svg.append(f'''  <g transform="translate(60, 45)">
    <rect width="1480" height="135" rx="16" fill="#151a26" stroke="#232d40" stroke-width="1.5" filter="url(#shadow)" />
    <circle cx="50" cy="50" r="18" fill="#d97706" />
    <text x="50" y="56" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">✦</text>
    <text x="82" y="48" fill="#f8fafc" font-size="26" font-weight="800" letter-spacing="-0.5">ALL-IN-ONE MULTI-APP SUITE: FAS-KARTA &amp; MASTER-ARKITEKTUR</text>
    <text x="82" y="78" fill="#94a3b8" font-size="15">{header_subtitle}</text>
    <text x="82" y="104" fill="#fbbf24" font-size="13" font-weight="600">{header_quote}</text>
    
    <rect x="1270" y="42" width="180" height="42" rx="21" fill="#22c55e1a" stroke="#22c55e" stroke-width="1.5" />
    <circle cx="1292" cy="63" r="5" fill="#22c55e" />
    <text x="1308" y="68" fill="#4ade80" font-size="14" font-weight="700">FAS 26 &#8594; FAS 45</text>
  </g>''')

    cur_y = y_start
    for i, b in enumerate(blocks):
        b_color = b["color"]
        b_bg = b["bg"]
        h = block_heights[i]
        
        # Block container
        svg.append(f'  <!-- {b["id"]} -->')
        svg.append(f'  <g transform="translate(60, {cur_y})">')
        svg.append(f'    <rect width="1480" height="{h}" rx="14" fill="{b_bg}" stroke="{b_color}44" stroke-width="1.5" filter="url(#shadow)" />')
        
        # Block Title bar
        svg.append(f'    <rect x="0" y="0" width="1480" height="42" rx="14" fill="{b_color}22" />')
        svg.append(f'    <rect x="0" y="0" width="6" height="{h}" rx="3" fill="{b_color}" />')
        svg.append(f'    <text x="25" y="27" fill="{b_color}" font-size="14" font-weight="800" letter-spacing="1">{html.escape(b["id"])}</text>')
        svg.append(f'    <text x="120" y="27" fill="#f8fafc" font-size="15" font-weight="700">{html.escape(b["title"])}</text>')
        
        # Phases inside block
        phases = b["phases"]
        num_phases = len(phases)
        
        if num_phases == 4:
            # 2x2 grid
            card_w = 705
            card_h = 118
            coords = [
                (25, 55),
                (750, 55),
                (25, 185),
                (750, 185)
            ]
        elif num_phases == 3:
            # 3 columns
            card_w = 460
            card_h = 168
            coords = [
                (25, 55),
                (510, 55),
                (995, 55)
            ]
            
        for p_idx, p in enumerate(phases):
            cx, cy = coords[p_idx]
            svg.append(f'    <g transform="translate({cx}, {cy})">')
            svg.append(f'      <rect width="{card_w}" height="{card_h}" rx="10" fill="#131722" stroke="#252d3d" stroke-width="1" />')
            
            # Phase badge
            svg.append(f'      <rect x="14" y="14" width="70" height="22" rx="5" fill="{b_color}2a" stroke="{b_color}66" stroke-width="1" />')
            svg.append(f'      <text x="49" y="29" fill="{b_color}" font-size="11" font-weight="800" text-anchor="middle">{html.escape(p["num"])}</text>')
            
            # Phase Title
            svg.append(f'      <text x="94" y="30" fill="#f1f5f9" font-size="14" font-weight="700">{html.escape(p["title"])}</text>')
            
            # File path
            svg.append(f'      <text x="16" y="52" fill="#64748b" font-size="11" font-family="monospace">📁 {html.escape(p["path"])}</text>')
            
            # Bullet items
            item_y = 70
            for item in p["items"]:
                svg.append(f'      <circle cx="20" cy="{item_y-4}" r="2" fill="{b_color}" />')
                svg.append(f'      <text x="28" y="{item_y}" fill="#94a3b8" font-size="11.5">{html.escape(item)}</text>')
                item_y += 18
            
            svg.append('    </g>')

        svg.append('  </g>')
        cur_y += h + block_gap

    # Footer note
    footer_text = html.escape('Arkitektur: Modellen styr resonemang och tokens; Appen styr dold systemprompt och verktyg. Se docs/tasks/026-all-in-one-app-suite-execution-plan.md för fullständig kodspecifikation.')
    svg.append(f'''  <g transform="translate(60, {cur_y})">
    <rect width="1480" height="60" rx="10" fill="#131722" stroke="#252d3d" stroke-width="1" />
    <text x="30" y="35" fill="#64748b" font-size="13">{footer_text}</text>
  </g>''')

    svg.append('</svg>')
    return '\n'.join(svg)

if __name__ == '__main__':
    svg_data = create_svg()
    with open('docs/images/all-in-one-master-phases.svg', 'w', encoding='utf-8') as f:
        f.write(svg_data)
    print(f"SVG roadmap generated successfully: docs/images/all-in-one-master-phases.svg ({len(svg_data)} bytes)")
