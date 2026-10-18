---
name: core-surgical-code
description: Use when modifying existing codebases, fixing bugs, adding targeted features, or refactoring code to ensure minimal diffs and eliminate over-engineering.
---

# Surgical Coding & Minimal Diff Protocol

## 1. Syfte och Operativ Mekanism
Modeller drabbas ofta av abstraktionsmani (over-engineering) och oombedd refaktorering när de ska utföra enkla kodändringar. De skriver om fungerande funktioner, ändrar namngivningsstandarder och skapar onödiga designmönster, vilket leder till gigantiska git-diffar och tysta regressioner. Denna färdighet tvingar modellen att agera kirurgiskt: förändra enbart det som är absolut nödvändigt för uppgiften och lämna all omgivande kod orörd.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Kirurgisk Minimal Diff:** Rör uteslutande de rader som krävs för att implementera den begärda rättningen eller funktionaliteten. All omgivande kod, formatering, kommentarer och namngivning ska förbli 100 % identisk.
2. **Noll Onödiga Abstraktioner:** Skapa aldrig nya fabriksklasser, strategimönster, interfaces, generiska hjälpmoduler eller konfigurationsfiler såvida inte användaren uttryckligen specificerat det. En rå, läsbar funktion på fem rader slår alltid en klasshierarki på femtio rader.
3. **Noll Oombedd Refaktorering:** Även om du identifierar "code smell" eller suboptimal kod i närheten av den kod du redigerar: rör den inte. Notera iakttagelsen kortfattat som en separat kommentar i slutet, men ändra ingenting utan användarens godkännande.
4. **Lös det Omedelbara Problemet:** Bygg inte generaliserade system för hypotetiska framtida use cases. Implementera den enklaste lösningen som fullt ut tillfredsställer de aktuella kraven (YAGNI – You Aren't Gonna Need It).
5. **Fullständig Körbarhet vid Leverans:** När en hel fil eller funktion levereras ska den vara 100 % komplett och körbar. Alla nödvändiga typdeklarationer, imports och felhanteringsblock ska skrivas ut fullständigt.
6. **Bevara Existerande Konventioner:** Anpassa koden strikt efter repots etablerade stil, indrag (tabs/spaces), variabelnamngivning (camelCase/snake_case) och arkitekturmönster. Inför inte egna stilpreferenser.
7. **Proportionerliga Ändringar:** Omfattningen på kodändringen ska vara strikt proportionerlig mot uppgiftens storlek. En 1-rads buggfix ska resultera i en 1-rads git-diff, aldrig en omskrivning av 150 rader.

## 3. Förbjudna Mönster (Blacklist)
- Oombedda namnbyten på variabler eller funktioner som fungerar.
- Skapande av nya filer när ändringen ryms i en befintlig modul.
- Omskrivning av fullt fungerande funktioner bara för att använda ett modernare bibliotek.
- Radering av kommentarer eller docstrings som inte berörs av ändringen.

## 4. Pre-Flight Verifieringschecklista
Innan svaret skickas ska följande kontroller genomföras internt:
- [ ] Visar diffen uteslutande ändringar som direkt krävs för uppgiften? (Krav: JA)
- [ ] Har befintlig omgivande kod och namngivning lämnats intakt? (Krav: JA)
- [ ] Har onödiga klasser, mönster och abstraktioner undvikits? (Krav: JA)
- [ ] Är all levererad kod 100 % körbar med korrekta imports? (Krav: JA)
