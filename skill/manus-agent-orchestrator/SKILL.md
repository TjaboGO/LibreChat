---
name: manus-agent-orchestrator
description: Autonomous task execution across 30+ discretionary tools, interactive background process management (shell_write_to_process), and network port exposure.
when-to-use: Use for long-running autonomous tasks, interactive CLI apps, building and previewing dev servers, multi-step internet research, or complex full-stack workflows.
always-apply: false
user-invocable: true
---

# Manus-Grade Agent Orchestrator & Process Management Protocol

## 1. Systemöversikt & Arkitektur
Denna färdighet implementerar den fullständiga arkitekturen från **Manus Agent** — branschens mest autonoma agent-motor för generell dator- och internetanvändning.

### Kärnkapaciteter:
- **30+ Diskreta Verktyg:** Komplett uppsättning för meddelanden, filer, interaktiva processer, webbläsare, nätverk och distribution.
- **Interaktiv Processhantering:** Starta bakgrundsprocesser (`shell_exec`), inspektera loggar (`shell_view`), skicka interaktiv standard input (`shell_write_to_process`), vänta in status (`shell_wait`) och terminera (`shell_kill_process`).
- **Deterministisk Nätverks- och Portexponering:** Exponera lokala portar (`deploy_expose_port`) för omedelbar extern/lokal förhandsgranskning av webbservrar (Vite, Next.js, FastAPI, Flask).
- **Händelsedriven Agent-Loop:** Bearbetar en händelseström (*Event Stream*) med Message, Action, Observation, Plan, Knowledge och Datasource.

---

## 2. Den 6-Stegade Agent-Loopen

Modellen arbetar strikt iterativt genom följande cykel:

1. **Analysera Händelser (Analyze Events):**
   - Läs den kronologiska händelseströmmen.
   - Identifiera senaste användarmeddelanden och verktygsobservationer.
2. **Välj Verktyg (Select Tool — Single-Tool Discipline):**
   - Välj **exakt ett verktygsanrop per iteration**.
   - Parallelliserade gissningar är förbjudna; varje steg måste invänta verklig observation.
3. **Invänta Exekvering (Wait for Execution):**
   - Sandlådan och servern kör det valda verktyget och returnerar observationen.
4. **Iterera (Iterate):**
   - Utvärdera observationen mot delmålet. Upprepa tålmodigt tills hela uppgiften är löst.
5. **Skicka Resultat (Submit Results):**
   - Skicka slutleveransen och eventuella filer/artefakter till användaren via meddelandeverktyg.
6. **Gå till Beredskap (Enter Standby):**
   - Anropa verktyget `idle` först när alla delmoment i checklistan är verifierade.

---

## 3. Verktygskatalog (30+ Manus-Grade Tools)

### 3.1 Meddelanden & Användarinteraktion
- `message_notify_user(text, attachments?)`: Skicka icke-blockerande framstegsrapport eller förklaring till användaren.
- `message_ask_user(text, attachments?, suggest_user_takeover?)`: Ställ en fråga och invänta svar vid kritiska vägval eller säkerhetskänslig inloggning.

### 3.2 Fil- och Kodoperationer
- `file_read(file, start_line?, end_line?, sudo?)`: Läs filinnehåll eller loggar.
- `file_write(file, content, append?, sudo?)`: Skapa ny fil eller konkatenera text.
- `file_str_replace(file, old_str, new_str, sudo?)`: Kirurgisk ersättning av unika textblock.
- `file_find_in_content(dir, pattern, case_sensitive?)`: Regex-sökning i filer.
- `file_find_by_name(dir, pattern, max_depth?)`: Hitta filer efter namnmönster.

### 3.3 Interaktiv Process- & Shellhantering
- `shell_exec(id, command, cwd?, background?)`: Starta kommando i namngiven session. Sätt `background: true` för långvariga servrar eller bakgrundsjobb.
- `shell_view(id, tail_lines?)`: Inspektera senaste stdout/stderr-raderna i en pågående eller avslutad session.
- `shell_write_to_process(id, input)`: Skriv interaktiv indata till processens `stdin` (t.ex. svara på `y/n`-frågor, skicka lösenord, interagera med Python REPL eller debugger).
- `shell_wait(id, timeout_ms?)`: Invänta att en process slutförs eller når timeout.
- `shell_kill_process(id, signal?)`: Skicka `SIGTERM` eller `SIGKILL` för att avsluta hängande processer.

### 3.4 Webbläsarautomation & Konsol
- `browser_view(include_markdown?)`: Visa aktuell webbläsarsida och extraherad text.
- `browser_navigate(url)`: Navigera till webbadress.
- `browser_restart(url)`: Starta om webbläsarsessionen vid trasigt tillstånd.
- `browser_click(index?, x?, y?)`: Klicka på interaktivt element eller koordinater.
- `browser_input(text, index?, press_enter?)`: Mata in text i formulärfält.
- `browser_move_mouse(x, y)`: Hovra över koordinat.
- `browser_press_key(key)`: Simulera tangenttryck (`Enter`, `Escape`, `Tab`).
- `browser_select_option(index, value)`: Välj alternativ i dropdown.
- `browser_scroll_up(pixels?)` / `browser_scroll_down(pixels?)`: Skrolla vyn.
- `browser_console_exec(code)`: Kör JavaScript direkt i sidans konsol.
- `browser_console_view(tail_lines?)`: Inspektera JavaScript-fel och loggar.

### 3.5 Informationssökning & Nätverksexponering
- `info_search_web(query, num_results?)`: Sök på webben efter officiell dokumentation och fakta.
- `deploy_expose_port(port, protocol?, ttl_minutes?)`: Exponera en lokal dev-server (t.ex. port 3000 eller 5173) och returnera förhandsgranskningsadress.
- `deploy_get_exposed_ports()`: Lista alla för närvarande aktiva exponerade portar.
- `deploy_close_port(port)`: Stäng en exponerad port.
- `deploy_apply_deployment(dir, title)`: Publicera webbplats till produktionsmiljö.
- `make_manus_page(file, title?)`: Kompilera MDX-fil till interaktiv leveranssida.
- `idle(summary)`: Markera uppdraget som fullständigt slutfört och gå i standby.

---

## 4. Checklista & Todo-Protokoll

1. Skapa alltid en fil `todo.md` i arbetskatalogen vid uppdragets början:
   ```markdown
   - [ ] 1. Samla in krav och inspektera miljön
   - [ ] 2. Installera beroenden och starta server i bakgrunden
   - [ ] 3. Exponera port och verifiera med webbläsare
   - [ ] 4. Leverera slutresultat och gå till standby
   ```
2. Uppdatera markörerna i `todo.md` med `file_str_replace` direkt efter varje delmoment (`- [ ]` -> `- [x]`).
3. Avsluta med att säkerställa att inga oavslutade moment återstår innan `idle` anropas.

---

## 5. Pre-Flight Verifiering
- [ ] Väljs exakt ett verktyg i taget med disciplinerad observation?
- [ ] Används `shell_write_to_process` för interaktiva prompts istället för att fastna?
- [ ] Exponeras relevanta dev-portar med `deploy_expose_port` så användaren kan kika live?
- [ ] Uppdateras `todo.md` löpande under arbetets gång?
