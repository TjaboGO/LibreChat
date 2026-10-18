---
name: core-full-output
description: Use when generating long-form documents, complete code files, exhaustive specifications, translations, or data tables where truncation, omission, or summarization would degrade quality.
---

# Complete Output & Anti-Truncation Protocol

## 1. Syfte och Operativ Mekanism
Modellen är i standardläge tränad att minimera utdata-tokens och förkorta texter för att spara GPU-cykler och latens. Denna färdighet upphäver modellernas komprimeringsbias genom att tvinga fram en 100 % uttömmande utmatning. Den tvingar fram längdbevarande vid översättning och textbearbetning samt förhindrar platshållare och kapade kodblock.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Noll Trunkering (Zero Truncation):** Leverera hela det efterfrågade arbetet i full skala. Sammanfatta, förkorta eller utelämna aldrig avsnitt, tabeller eller förbehåll såvida inte användaren uttryckligen beordrat en sammanfattning.
2. **Noll Platshållare i Kod:** I all genererad kod är platshållare såsom `// resten oförändrad`, `/* TODO */`, `...` eller `# implementera här` absolut förbjudna. Skriv ut 100 % av raderna med samtliga imports, hjälpfunktioner och felhanteringsblock.
3. **Uttömmande Uppräkning:** Om en frågeställning eller specifikation omfattar $N$ punkter, skriv ut samtliga $N$ punkter med fullständigt substansinnehåll. Använd aldrig avkortande fraser som "etc.", "med mera" eller "bland andra".
4. **Längdbevarande vid Bearbetning:** Vid översättning, transkribering eller omarbetning av text ska utdata motsvara 95–110 % av källtextens volym. Bearbeta stycke för stycke och säkerställ att alla nyanser, exempel och sidoanteckningar bevaras intakta.
5. **Faktisk Artefakt framför Plan:** Leverera alltid själva slutartefakten i samma meddelande. Att endast presentera en disposition eller beskriva hur man kan skriva texten godkänns inte.
6. **Intern Kontrollräkning:** Före sändning ska antalet informationskrav i användarens instruktion räknas och matchas mot det genererade svaret.
7. **Hantering av Tokengräns (Continuation Protocol):** Om svaret riskerar att nå modellens maximala utdatagräns, avbryt kontrollerat vid en naturlig rubrik- eller funktionsgräns och avsluta med: `[DEL 1 AV N SLUTFÖRD — Svara 'fortsätt' för Del 2]`. Återuppta nästa del utan att upprepa redan genererat material eller lägga till artighetsfraser.

## 3. Förbjudna Mönster (Blacklist)
- Platshållarkommentarer i kod (`// ...`, `/* rest unchanged */`, `# logic goes here`).
- Sammanfattande avslutningar ("Kort sagt", "I sammandrag", "Sammanfattningsvis kan sägas").
- Trunkering av tabeller med ellips-rader (`| ... | ... |`).
- Erbjudanden om framtida leverans ("Jag kan utveckla punkt 4 senare om du vill").

## 4. Pre-Flight Verifieringschecklista
Innan svaret skickas ska följande kontroller genomföras internt:
- [ ] Finns det några platshållare eller TODO-kommentarer i koden? (Krav: NEJ)
- [ ] Motsvarar textens längd och djup källmaterialets fulla komplexitet? (Krav: JA)
- [ ] Har samtliga begärda delmoment och underfrågor besvarats med färdigt innehåll? (Krav: JA)
- [ ] Avslutas svaret utan avhuggna meningar eller ofullständig syntax? (Krav: JA)
