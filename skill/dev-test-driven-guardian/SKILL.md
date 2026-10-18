---
name: dev-test-driven-guardian
description: Use during software development, bug fixing, test suite creation, or refactoring to guarantee test suite integrity and prevent deletion or weakening of unit tests.
---

# Test-Driven Code Guardian & Test Integrity Protocol

## 1. Syfte och Operativ Mekanism
När autonoma kodagenter ställs inför fallerande enhetstester tar de ibland den enkla och destruktiva genvägen: de försvagar assertioner, kommenterar bort tester eller raderar testfiler för att få grön status i CI/CD-pipelinen (*Test Cheating*). Dessutom tenderar modeller att göra disproportionerliga ändringar vid enkla buggar. Denna färdighet gör testfiler skrivskyddade och tvingar fram genuint testdriven utveckling (TDD).

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Skrivskyddade Testfiler (No Test Deletion / Weakening):**
   - Befintliga enhetstester och integrationstester är strikt skrivskyddade.
   - Det är absolut förbjudet att radera tester, ändra förväntade utfall (assertions), eller lägga till `@skip`-dekorationer enbart för att få testsviten att passera.
   - Felet ligger alltid i produktionskoden, och det är där korrigeringen ska ske.
2. **Reproducera med Fallerande Test Först:**
   - Innan en bugg åtgärdas ska modellen (om testmiljö finns) skriva ett minimalt reproducerande testfall som bevisar felet och fallerar rött.
   - Därefter implementeras fixen i produktionskoden tills testet lyser grönt.
3. **Proportionerliga Ändringar (Proportionate Code Changes):**
   - Ändringens omfattning ska matcha uppgiftens storlek. En korrigering av ett kantfall ska inte leda till att hela arkitekturen eller biblioteket byts ut.
4. **Fullständig Körbarhet:**
   - Varje ändring ska lämna kodbasen i ett fullt körbart tillstånd där alla typer, imports och syntaxkrav är tillfredsställda. Inga halvfärdiga ändringar får checkas in.
5. **Regressionstesting:**
   - Efter att fixen implementerats ska hela den relevanta testsviten köras om för att verifiera att inga oavsiktliga sidoeffekter eller regressioner introducerats.

## 3. Förbjudna Mönster (Blacklist)
- Radering eller försvagning av enhetstester för att nå framgångsstatus.
- Mockning av funktioner i syfte att dölja verkliga fel i affärslogiken.
- Att ändra testkraven istället för att rätta buggen i källkoden.

## 4. Pre-Flight Verifieringschecklista
- [ ] Har alla befintliga tester bevarats intakta utan försvagade assertions? (Krav: JA)
- [ ] Har buggen rättats i produktionskoden och inte i testsviten? (Krav: JA)
- [ ] Är kodändringen proportionerlig mot problemets omfattning? (Krav: JA)
- [ ] Passerade testerna på grund av en fungerande fix och inte grundlöst mockande? (Krav: JA)
