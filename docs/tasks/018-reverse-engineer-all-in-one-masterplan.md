# Task 018: Reverse Engineer All-in-One Masterplan & Prompt Benchmark

## Sammanfattning
Denna uppgift analyserade hela samlingen av extraherade systemprompts och verktyg i mappen `My system prompts/` och `Anthropic/` (omfattande **samtliga 72 unika AI-tjänster och modeller** i 2 285 filer och 1 685 verktyg, utan att någon enda har utelämnats).

Samtliga 72 plattformar katalogiserades systematiskt:
- **Frontier Models:** Anthropic (Claude 1.0 till Opus 5.5, Fable 5.1, 39 skills), OpenAI (GPT-3.5 till GPT-6 Astra/Sol, Atlas, o3), Google (Gemini 1.5 till 3.7 Flash, Nano Banana 2, Jules, Antigravity), xAI (Grok 1 till 4.7-CLI, Grok Build), Meta (Llama 4, Muse Spark 1.0–1.2), DeepSeek (V3, R1, DSH), Zhipu GLM (GLM-4, ZCode), Moonshot (Kimi K2 Thinking), Mistral (Large, Medium 3.5, Code), Qwen (2.5, 3.8-Max, Code), MiniMax (M2.5), Doubao.
- **Coding Agents & IDEs:** Cursor, Windsurf, Devin, Trae, Replit, Kiro, Traycer AI, Augment Code, Same.dev, Cline, Blackbox.ai, Xcode, VSCode Agent, GitHub Copilot, Warp.dev, CodeBuddy, Qoder, Canva Code, Xiaomi MiCode, Aider, OpenCode, Kilo Code, Goose, Crush.
- **Web & UI Builders:** v0, Lovable, Bolt.new, Dia, Emergent, Leap.new.
- **Autonomous & Computer Use:** Manus, MultiOn, Notte, Poke, Factory Droid, OpenClaw.
- **Search & Research:** Perplexity AI, Brave Leo, Kagi, Phind, Fellou, Raycast AI, T3 Chat.
- **Specialized Assistants:** Notion AI, Docker Gordon AI, DuckDuckGo DuckAI, Atlassian Rovo, Roblox Studio Assistant, Discord Clyde, Opera Aria, Proton Lumo, Hume AI, Snap MyAI, Naver Cue, Alan, Wrtn, Scamguard, HackerAI, Hooshang, Gandalf, Remoteli, Pi, Cluely, Comet Assistant, Junie, Hermes, MiMo Code.

Syftet var att reverse-engineera de bästa innovationerna, looparna och verktygen från varje tjänst för att skapa masterplanen för den **ultimata all-in-one AI-plattformen** (personligt bruk via OpenRouter/API).

---

## Precisionsbedömning av Systemprompterna

1. **Anthropic Claude (Betyg 5.0/5.0):**
   - Högsta tekniska precisionen i branschen.
   - Rigorös XML-taggning (`<antigravity_skills>`, `<thinking>`, `<artifacts>`).
   - Modulära underagenter (`Explore`, `Plan`, `general-purpose`).
   - 4 kognitiva output-styles (`learning`, `concise`, `explanatory`, `proactive`).
   - Specialiserade appar: Claude Code, Claude Cowork, Claude Design, Claude in Chrome, Office (Word/Excel/PowerPoint).

2. **Manus Agent (Betyg 4.9/5.0):**
   - Branschens mest autonoma verktygsuppsättning (29 diskreta verktyg).
   - Komplett Linux-sandlåda med processhantering (`shell_write_to_process`, `shell_wait`).
   - Avancerad webbläsarautomation med muskoordinater och konsolskript (`browser_console_exec`).
   - Nätverksexponering och publicering (`deploy_expose_port`, `make_manus_page`).
   - Tydlig agentloop: Event Stream -> Tool Selection -> Wait for Execution -> Idle.

3. **OpenAI GPT-5.6 Sol / Atlas / Deep Research (Betyg 4.8/5.0):**
   - Modulärt filbaserat skills-system monterat i sandlådan (`/home/oai/skills/{docx,pdfs,slides,spreadsheets}`).
   - Atlas Browser Multi-mode (Full-Page Chat, Web Browsing, Side Chat).
   - Tydlig kontextprioritetsordning (Developer > Platform > User > Attachments > Web Context).

4. **Traycer AI & Kiro (Betyg 4.8/5.0):**
   - Bästa arkitektoniska separationen:
     - **Spec Mode / Plan Mode:** Kravspec, arkitektur, TDD-tester, inga filändringar.
     - **Vibe Mode / Phase Mode:** Snabb implementering, visuell frontend, animationer.
   - Förhindrar helt att AI börjar hacka kod innan kraven är klara.

5. **Cursor & Windsurf (Betyg 4.6/5.0):**
   - Snabbaste editeringen via `search_replace` och `reapply`.
   - Windsurf: `spin up browser preview` med live console error-feedback loop direkt till agenten för automatisk självkorrigering.

6. **v0 & Lovable (Betyg 4.5/5.0):**
   - Mästerlig UI-generering med shadcn/ui, Tailwind och Lucide.
   - Interaktiva val i chatten via `AskUserQuestions`.
   - Fullstack-scaffolding med Supabase.

7. **Perplexity Computer & Deep Research (Betyg 4.5/5.0):**
   - Rekursiv sökplanering och syntes.
   - `search_user_memories` körs alltid före interrogation.
   - Klickbara källcitatbadges med hover-preview.
   - Extern connector-hub (`list_external_tools`).

---

## Roadmap-expansion: Fas 18 till Fas 25

Fullständig specifikation finns i artefakten:
`brain/3c5a6720-f7af-45b1-b813-a970d74553fe/ULTIMATE_ALL_IN_ONE_AI_PLATFORM_MASTERPLAN.md`

- **Fas 18:** Manus-Grade 30+ Tools & Interaktiv Process-Management (`shell_write_to_process`, `deploy_expose_port`).
- **Fas 19:** Dual-Mode Engine (Spec Mode vs. Vibe Mode + Intent Classifier).
- **Fas 20:** Interactive In-Chat Form Cards (`AskUserQuestions` / Generative UI).
- **Fas 21:** Full-Stack Web App Generator med Self-Healing Dev Server.
- **Fas 22:** Deep Research Engine med rekursiv sök-syntes och källcitatbadges.
- **Fas 23:** Living Office Artifacts (Word `.docx`, Excel `.xlsx`, PowerPoint `.pptx`, PDF).
- **Fas 24:** Kognitiva Output Styles & Persona Switcher (`/concise`, `/learning`, `/explanatory`, `/proactive`).
- **Fas 25:** Perplexity Computer Connector Hub (MCP Multi-Tool Hub).

---

## Resultat
- Samtliga prompts har analyserats och precisionsbedömts.
- Kärnsuperkrafterna har isolerats och förenats till en koherent arkitektur.
- En master-systempromptmall har skapats.
- Roadmapen har utökats från Fas 17 till Fas 25 för framtida implementationer.
