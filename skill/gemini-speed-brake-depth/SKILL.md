---
name: gemini-speed-brake-depth
description: Use in Google Gemini (Flash, Pro, Argon) sessions involving complex logic, financial calculations, systems engineering, or debugging to force deep analytical reasoning and prevent rush errors.
---

# Gemini Speed Brake & Analytical Depth Protocol

## 1. Syfte och Operativ Mekanism
Geminis standard-tänkenivå och inferensprofil är kalibrerad mot snabb respons. När modellen möter svåra matematiska problem eller mångstegsberoenden svarar den ofta på det första statistiska mönstret och hoppar över beräkningssteg, vilket orsakar logiska haverier. Denna färdighet tvingar modellen att "lägga i handbromsen" och exekvera interna analyspass.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Obligatorisk 4-Stegs Tänkeprocess:**
   - *Steg 1 (Dekonstruktion):* Läs och lista samtliga implicita och explicita krav i uppgiften.
   - *Steg 2 (Hypotes- och Kantfallsprövning):* Kartlägg vad som händer vid gränsvärden, nollvärden och samtidighet.
   - *Steg 3 (Stegvis Härledning):* Genomför beräkningen eller logiken med synliga delsteg inuti källmaterialet.
   - *Steg 4 (Kvalitetsgranskning):* Verifiera resultatet mot Steg 1 innan svaret skrivs ut.
2. **Beräkna inuti Källan (Calculate inside the Source):** Alla matematiska operationer ska härledas sekventiellt med siffror tagna direkt från indata. Förbjudet att utföra huvudräkning i ett enda steg.
3. **Budgetera Tänketokens:** Vid användning av Gemini med extended thinking: balansera tankebudgeten så att tillräckligt med utrymme reserveras för det slutliga svaret. Förhindra att tankeprocessen förbrukar hela tokenfönstret.
4. **Analytiskt Djupkrav:** Svar på systemdesignfrågor ska täcka minst fem lager: 1. Vad, 2. Varför, 3. Hur, 4. Implikationer och 5. Alternativa tillvägagångssätt.

## 3. Förbjudna Mönster (Blacklist)
- Omedelbara slutsiffror i beräkningar utan redovisade formler.
- Snabba en-meningssvar på flerstegsfrågor.
- Att anta att en algoritm fungerar utan att torrköra den mot minst två testfall.

## 4. Pre-Flight Verifieringschecklista
- [ ] Har beräkningen visat alla matematiska delsteg? (Krav: JA)
- [ ] Har alla 4 faser i tänkeprocessen genomförts före slutgenerering? (Krav: JA)
- [ ] Har analysen nått tillräckligt tekniskt djup (arkitektur, kantfall, felmoder)? (Krav: JA)
