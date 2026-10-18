---
name: meta-skill-orchestrator
description: Use to manage the skill catalog, optimize token budgets in Progressive Disclosure, resolve rule conflicts between skills, and route tasks to optimal model tiers.
---

# Meta-Skill Orchestrator & Progressive Disclosure Protocol

## 1. Syfte och Operativ Mekanism
När ett agent-system växer till tiotals skills uppstår allvarliga arkitektoniska problem: systemprompten sväller och äter upp användarens kontextbudget, modeller drabbas av routing-kollisioner mellan snarlika moduler, och motstridiga regler skapar kognitiv dissonans. Denna meta-modul hanterar katalogens livscykel, optimerar Progressive Disclosure (Nivå 1–3) och löser regelkonflikter deterministiskt.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Progressive Disclosure Takgränser:**
   - Alla färdigheter i katalogen ska hållas inom strikta storleksramar:
     * *Nivå 1 (Metadata):* `name` och `description` i YAML-frontmatter får maximalt omfatta 100 tokens per modul. Beskrivningen ska exakt specificera VAD modulen gör och NÄR den triggas.
     * *Nivå 2 (Instruktionskropp):* Själva `SKILL.md` ska hållas under 500 rader och under 5 000 tokens.
     * *Nivå 3 (Resurser):* Stora databasscheman, externa skript och tunga referensdokument ska isoleras i underkatalogerna `references/` eller `scripts/` och läsas in on-demand via verktyg.
2. **Deterministisk Konfliktlösning (Priority Enforcer):**
   - Om två eller flera aktiva färdigheter ger motstridiga instruktioner, tillämpas ovillkorligen följande hierarki:
     1. `SÄKERHET & INTEGRITET:` Säkerhetsfilter och injektionsskydd (vinner alltid).
     2. `ANVÄNDARENS DIREKTA INSTRUKTION:` Specifika krav i användarens prompt.
     3. `EPISTEMISK STRINGENS:` Förbud mot gissningar och krav på verifiering.
     4. `FULLSTÄNDIGHET:` Förbud mot sammanfattningar och platshållare.
     5. `STIL OCH FORMAT:` Formateringsregler, språkton och klarspråk.
3. **Deterministisk Routing:**
   - Vid otydliga promptar ska routern aktivera den mest specialiserade modulen framför den mest generella, för att undvika överlapp och instruktionsutspädning.
4. **Modell- & Kostnadsoptimering (Advisor Pattern):**
   - Tillämpa intelligenta modellval för att minimera kostnad och latens:
     * *Planering och Slutgranskning:* Delegeras till resonemangsmodeller i toppklassen (Claude Opus / GPT-5 / Gemini Pro).
     * *Massiv Kodgenerering och Dataextraktion:* Delegeras till snabba, kostnadseffektiva modeller (Claude Sonnet / Gemini Flash).
5. **Korsplattformskompatibilitet:**
   - Alla färdigheter ska följa den öppna specifikationen från `agentskills.io` och standardiseras för placering i `~/.agent/skills/` eller repots `.agent/skills/`.

## 3. Förbjudna Mönster (Blacklist)
- Monolitiska skills som överskrider 500 rader eller 5 000 tokens.
- Vaga metadata-beskrivningar som leder till felaktig eller icke-deterministisk aktivering.
- Tyst ignorering av motstridiga regler utan formell konfliktlösning.

## 4. Pre-Flight Verifieringschecklista
- [ ] Uppfyller alla ingående skills gränserna för Progressive Disclosure? (Krav: JA)
- [ ] Har regelkonflikter lösts enligt den formella prioritetshierarkin? (Krav: JA)
- [ ] Är routing-beslutet entydigt och deterministiskt? (Krav: JA)
