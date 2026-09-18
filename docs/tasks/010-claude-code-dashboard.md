# Task 010 — Claude Code Dashboard (claude.ai/code)

**Förutsättning:** Task 001–009 klara. Läs `docs/ui-reference/batch-1-screenshots.md` (rad 100–195) och `batch-4-screenshots.md` (rad 258–300).

**Mål:** Implementera Claude Code-produktytan under `/code`:
1. **Dashboard ("What's up next?"):**
   - Välkomstrad med orange solburst-ikon och "What's up next, {Name}?".
   - Analytics-widget med "Overview" / "Models"-flikar och tidsintervall ("All" / "30d" / "7d").
   - 3×2 grid med statistikkort: Sessions, Messages, Total tokens, Active days, Peak hour, Favorite model.
   - GitHub-liknande aktivitets-heatmap med färgade rutor och lekfull token-jämförelse under.
   - Persistenta environment-chips: Environment ("Local"), Repo/projekt-pill, Branch-pill, "worktree"-checkbox, samt orange maskot-ikon.
   - Statusbanner ("Session limit reached / Turn on usage credits").
   - Kodningsagent-composer med "Auto"-läge, "Sonnet 5", "Medium"-effort och statusindikator.
2. **Routines (`CodeRoutinesView.tsx`):**
   - Vyn under fliken "Routines".
   - Flikar: "Yours" och "Templates".
   - "+ New routine" med dropdown för "Local" och "Cloud".
   - Mallkort: Briefing, Email triage, System health check, Issue triage, PR review digest, Dependency update check, Release notes drafter, Flaky test tracker.
3. **Folders-modal (`CodeFoldersModal.tsx`):**
   - Modal för att hantera mappar och projektkataloger.
   - "+ Add Folder"-knapp, "Hide foldered chats"-kryssruta med orange accent, sökfält.
   - Tomt läge med orange mappikon: "No folders yet / Create folders to organize your chats."
4. **Prompts/Chains-modal (`CodePromptsChainsModal.tsx`):**
   - Segmenterade flikar med orange fyllning för aktiv flik ("Prompts" / "Chains").
   - "+ Add Prompt" / "+ Add Chain", sökfält, listrader med variabelantal och steg, orange "📋 Use"-knapp.

---

## Resultat

### Genomförda åtgärder

1. **Claude Code Dashboard (`CodeDashboard.tsx`):**
   - Välkomsthuvud med orange solburst (`Flame`) och "What's up next, {Name}?".
   - Analytics-widget med "Overview" / "Models" och "All" / "30d" / "7d" filter.
   - 3×2 grid med mätvärden: Sessions, Messages, Total tokens, Active days, Peak hour, Favorite model.
   - GitHub-liknande 16×7 aktivitets-heatmap med orange nyanser och bokjämförelse-citat.
   - Environment-chips för Local/Repo/Branch/worktree-checkbox och bot-ikon.
   - Usage limits statusbanner med "Turn on credits".
   - Composer med Auto-läge, modellindikator och snabbknappar.

2. **Routines (`CodeRoutinesView.tsx`):**
   - "Yours" och "Templates"-flikar med sökning, filter och sortering.
   - "+ New routine" dropdown med val för "Local" och "Cloud".
   - Mallar för Briefing, Email triage, System health check, Issue triage, PR review digest, Dependency update check, Release notes drafter och Flaky test tracker.
   - Tomt läge med tidtagarur-ikon och streckad skiljelinje.

3. **Folders (`CodeFoldersModal.tsx`):**
   - Hantering av mappar för Claude Code med "+ Add Folder", inline skapande och "Hide foldered chats"-kryssruta med orange accent.

4. **Prompts & Chains (`CodePromptsChainsModal.tsx`):**
   - Segmenterade flikar för Prompts och Chains med orange aktiv flikindikator.
   - Variabelräkning, stegräkning, multi-delete och orange "📋 Use"-knapp.

5. **App-layout & Routing:**
   - `CodeAppView.tsx` sammanfogar dashboard, routines och modaler med sidopanelsnavigering.
   - Rutt `/code` monterad i `client/src/routes/index.tsx`.

6. **Kvalitetssäkring:**
   - 4 testsviter med 14 enhetstester gröna (`npm --prefix client run test:ci -- client/src/components/Code/__tests__/`).
   - `tsc --noEmit` felfri.
   - `eslint --max-warnings=0` och `prettier` validerade.
