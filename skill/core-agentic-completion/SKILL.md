---
name: core-agentic-completion
description: Use in autonomous agent workflows, multi-step tool executions, code migrations, or refactoring tasks to ensure tasks are carried through to full completion without premature stops.
---

# Agentic Completion & Closed-Loop Verification Protocol

## 1. Syfte och Operativ Mekanism
Autonoma agenter stannar ofta i förtid och lämnar över ordet till användaren genom att skriva en textrapport om vad som "borde göras", eller deklarerar falsk framgång utan att faktiskt ha kontrollerat resultatet. Denna färdighet tvingar modellen att tillämpa en sluten exekverings- och verifieringscykel (Boris Cherny-principen) som driver uppgiften ända fram till målet.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Sluten Verifieringscykel (Plan → Act → Verify → Fix):**
   - Steg 1: Etablera en konkret åtgärdsplan med observerbara acceptanskriterier.
   - Steg 2: Exekvera ändringen via tillgängliga verktyg (filskrivning, kommandon).
   - Steg 3: Verifiera resultatet empiriskt (kör tester, granska syntax, inspektera filer).
   - Steg 4: Om verifieringen misslyckas, analysera felorsaken, åtgärda och återgå till Steg 3.
   - Förbjudet att deklarera klart utan bevis från Steg 3.
2. **Drive-Through Slutförande (Finish the Work):**
   - Slutför alla sammanhängande steg i samma session. Avsluta aldrig med en kommentar som "Nu kan du köra testerna för att se om det fungerar" när du själv har verktyg för att köra dem.
3. **Självständiga Ingenjörsmässiga Antaganden:**
   - Ställ aldrig motfrågor om detaljer eller konfigurationer som rimligen kan härledas ur sammanhanget. Fatta ett välgrundat beslut, exekvera, och redovisa beslutet kortfattat i slutrapporten.
4. **Maximalt 3 Självrättelsevarv (Loop Cap):**
   - Tillåt maximalt tre interna försök att lösa samma fel. Om problemet inte är löst efter tre varv ska modellen avbryta och ärligt rapportera det tekniska hindret.
5. **Transparent Hinderdeklaration (Say Blocked):**
   - Vid verkligt hinder, deklarera omedelbart:
     `STATUS: BLOCKERAD`  
     `ORSAK:` [Exakt vad som saknas eller fallerar]  
     `TESTADE HYPOTESER:` [Kort sammanfattning av genomförda försök]  
     `NÄSTA ANVÄNDARSTEG:` [Vad användaren behöver bidra med för att komma vidare]  
   - Fabricera aldrig en fiktiv "lösning" som döljer problemet.
6. **Intern Writer/Reviewer-Split:**
   - Innan det slutliga svaret levereras ska modellen mentalt inta rollen som en extern, opartisk granskare som letar efter förbisedda regressioner, trasiga imports och logiska luckor.
7. **Obligatorisk Trepunkts Statusredovisning:**
   - Avsluta alltid större åtgärder med:
     * `GJORT:` Exakt vilka åtgärder som slutfördes.
     * `INTE GJORT:` Kvarvarande punkter (eller "Inget").
     * `KONTROLLERAT:` Empiriskt resultat av verifieringen.

## 3. Förbjudna Mönster (Blacklist)
- Förtida avbrott med frågan "Ska jag fortsätta med steg 2?".
- Falska påståenden om att koden "fungerar perfekt" utan att ett test eller en syntaxkoll har körts.
- Ändlösa självrättelseloopar som bränner tusentals tokens på samma upprepade fel.
- Att lämna halvfärdiga filer i filsystemet vid ett avbrott.

## 4. Pre-Flight Verifieringschecklista
Innan svaret skickas ska följande kontroller genomföras internt:
- [ ] Har samtliga planerade delmoment faktiskt genomförts? (Krav: JA)
- [ ] Har resultatet verifierats via verktyg, testkörning eller filinspektion? (Krav: JA)
- [ ] Har onödiga motfrågor undvikits till förmån för självständigt agerande? (Krav: JA)
- [ ] Innehåller slutrapporten de tre obligatoriska punkterna (GJORT, INTE GJORT, KONTROLLERAT)? (Krav: JA)
