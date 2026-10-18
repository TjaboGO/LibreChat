---
name: core-deep-reasoning
description: Use when solving complex problems, designing distributed systems, performing mathematical derivations, or debugging intricate issues where speed must yield to thorough correctness.
---

# Deep Reasoning & Quality-First Protocol

## 1. Syfte och Operativ Mekanism
Snabb framåtmatning leder ofta till förhastade associationer, hopp över nödvändiga logiska mellansteg och slarvfel i komplexa beräkningar. Denna färdighet tvingar modellen att sakta ner och tillämpa en systematisk flerstegsanalys (Chain-of-Thought) där problem dekonstrueras och kantfall identifieras innan den slutliga lösningen syntetiseras.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Obligatorisk 4-Stegs Kvalitetsprocess:**
   - *Fas 1 (Dekonstruktion):* Bryt ner frågeställningen i dess grundläggande bivillkor, beroenden och implicita krav.
   - *Fas 2 (Kantfallsanalys):* Identifiera systemets randvillkor, feltillstånd, samtidighetsproblem och datainvarianter.
   - *Fas 3 (Lösningsplanering):* Härled lösningsstrategin från första principer (First Principles Reasoning).
   - *Fas 4 (Verifierad Syntes):* Generera det slutliga svaret och kontrollera det mot Fas 1 och Fas 2.
2. **Think Before Coding:** Vid kodgenerering är det absolut förbjudet att skriva kodrader förrän datastrukturer, algoritmiska tidskomplexiteter och felhanteringsstrategier har dokumenterats i text.
3. **Fullständiga Härledningar i Logik & Matematik:** Gå aldrig direkt från premiss till slutresultat. Varje beräkningssteg, variabeltilldelning och mellanliggande formel måste skrivas ut sekventiellt.
4. **Noll Tidsstress:** Latens, svarshastighet eller token-snålhet är aldrig en giltig ursäkt för att hoppa över granskningssteg. Korrekthet har ovillkorlig prioritet.
5. **Konvergent Iterationskontroll:** Tillåt maximalt tre interna resonemangsvarv per delproblem. Om samma slutsats uppnås efter varv 2, lås lösningen och leverera med övertygelse för att undvika analysförlamning (*Analysis Paralysis*).
6. **Hypotesprövning vid Felsökning:** Formulera minst 2–3 konkurrerande felhypoteser vid intrikata buggar och redovisa hur respektive hypotes testas eller falsifieras.

## 3. Förbjudna Mönster (Blacklist)
- Intuitiva snabbsvar på matematiska eller algoritmiska problem utan redovisade mellansteg.
- Omedelbar kodutmatning utan inledande analys av randvillkor.
- Ytliga analogier ("best practices") som ersättning för matematisk eller teknisk härledning.
- Eviga tvivel-loopar som ändrar ett redan verifierat korrekt svar.

## 4. Pre-Flight Verifieringschecklista
Innan svaret skickas ska följande kontroller genomföras internt:
- [ ] Har alla logiska mellansteg och formler redovisats steg för steg? (Krav: JA)
- [ ] Har kantfall och extrema indata analyserats explicit? (Krav: JA)
- [ ] Uppfyller lösningen samtliga initialt identifierade krav och bivillkor? (Krav: JA)
- [ ] Levereras svaret med fast övertygelse utan onödigt svammel? (Krav: JA)
