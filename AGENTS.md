# Instruktioner till kodningsagenter i det här repot

Det här är ett personligt fork av [LibreChat](https://github.com/danny-avila/LibreChat)
(remote `upstream`) som byggs om till en Claude-liknande app kopplad till OpenRouter.
Vi bidrar INTE tillbaka uppströms — ingen anledning att följa LibreChats
branch-mot-`dev`-policy för egna commits, men deras tekniska konventioner
(modulgränser, typecheck, temasystem) gäller fortfarande eftersom vi delar kodbas.

**Innan du läser något annat: kolla efter en avbruten föregående session.**
Claude Code och Orca/Antigravity jobbar båda i samma worktree, och en session kan
avbrytas abrupt (t.ex. en usage limit) utan att hinna committa. Kör alltid detta
allra först:

```bash
git status
git log --oneline -5
```

Om `git status` visar okommitterade ändringar: **rör dem inte blint.** Läs igenom
diffen (`git diff`), avgör om det är ett halvfärdigt arbete värt att slutföra
eller trasigt skräp värt att kasta, och committa eller återställ *innan* du börjar
på något nytt — annars blandas ditt arbete ihop med en annan agents. Om du själv
riskerar att bli avbruten utan förvarning (osäker budget/tid kvar): committa
hellre en fungerande delbit tidigt än att sitta på en stor okommitterad ändring.

**Läs sedan i den här ordningen innan du skriver kod:**

1. [docs/ROADMAP.md](docs/ROADMAP.md) — vilken fas är vi i, vad är nästa uppgift.
2. Motsvarande fil i [docs/tasks/](docs/tasks/) för den specifika uppgiften du fått.
3. [docs/FEATURES.md](docs/FEATURES.md) — kolla ALLTID om det du ska bygga redan finns
   innan du börjar. LibreChat har mer inbyggt än det ser ut som vid en första titt
   (Skills, Subagents, Memory, MCP, Artifacts finns redan som riktig kod).
4. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — tekniska beslut och kända fallgropar.
5. [docs/upstream/LIBRECHAT_AGENTS.md](docs/upstream/LIBRECHAT_AGENTS.md) och
   [docs/upstream/LIBRECHAT_CLAUDE.md](docs/upstream/LIBRECHAT_CLAUDE.md) — LibreChats
   egna, mycket detaljerade tekniska konventioner (modulgränser, typecheck-kommandon,
   Jotai/Recoil-migrering, tema-tokens). Dessa gäller fortfarande för HUR man skriver
   kod i den här kodbasen, även om vi inte skickar PRs uppströms.

## Grundregler för det här projektet specifikt

- **Bygg inte om det som redan finns.** Innan du skapar ett nytt system, sök i koden
  (`grep`/`find`) efter om LibreChat redan har en mekanism för det. Exempel: en
  schemaläggare för agenter ska byggas ovanpå det existerande "Subagent completion
  wakeup"-mönstret (se ARCHITECTURE.md), inte som ett fristående cron-system.
- **Hemligheter går aldrig in i git.** `.env` och `librechat.yaml` (med riktiga
  API-nycklar) ska vara gitignorade. Om du behöver en nyckel (OpenRouter, DeepSeek)
  som inte finns i miljön: fråga, gissa aldrig och skriv aldrig in en
  placeholder-sträng som ser ut som en riktig nyckel.
- **Modellagnostiskt by default.** Anta aldrig att modellen bakom en konversation är
  Anthropic eller OpenAI. Reasoning/tool-call-format varierar mellan OpenRouter-
  modeller — verifiera, anta inte (se `docs/tasks/002-verify-model-layer.md`).
- **Typecheck per workspace:** `packages/api`, `packages/client` och
  `packages/data-schemas` byggs med `tsdown`, som INTE typechecker. Kör alltid
  `npx tsc --noEmit` i varje workspace du ändrat.
- **Formatering:** `npm run sort-imports <ändrade paths>` — kör aldrig utan argument
  om du bara ändrat några filer (det skriver om hela källträd).
- **Temaändringar** går i det delade tokens-registret, aldrig som hårdkodade färger
  i en enskild komponent — se `docs/tasks/003-claude-look-rebrand.md`.

## När du är klar med en uppgift

Uppdatera bockrutan för den i `docs/ROADMAP.md` och lägg ett kort resultat-avsnitt
längst ner i motsvarande `docs/tasks/NNN-*.md`-fil (vad som faktiskt gjordes, vilka
beslut som togs, vad som återstår) — så nästa agent (eller Orca) inte behöver läsa hela
diffen för att veta var vi står.
