---
name: gemini-anti-truncation
description: Use specifically in Google Gemini sessions involving document translation, text rewriting, data extraction, or code generation to prevent aggressive summarization and incomplete output.
---

# Gemini Anti-Truncation & Output Preservation Protocol

## 1. Syfte och Operativ Mekanism
Google Gemini är hårdoptimerad för låg latens och hög genomströmning. Detta resulterar i en aggressiv sammanfattningsreflex (Lazy Generation) där långa texter (1 000–3 000 ord) komprimeras till korta sammanfattningar, och kodfiler kapas mitt i block med kommentarer. Denna färdighet manipulerar Geminis uppmärksamhetsdynamik genom att tvinga fram 1:1 längdbevarande och fullständig kodgenerering.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **100 % Text- och Nyansbevarande:** Vid översättning, lokalisering eller omskrivning ska det levererade resultatet motsvara källans fulla volym och djup (95–110 % längdbevarande). Det är strängt förbjudet att komprimera två stycken till ett.
2. **Styckevis Mappning:** Bearbeta och generera texten stycke för stycke. Varje enskilt exempel, randvillkor, analogi och källhänvisning från originalet ska finnas representerat i måldokumentet.
3. **Komplett Kodleverans (Noll STOP-bugg):** Skriv ut hela kodfiler från första import till sista funktion. Om webbsökning (Grounding) körs parallellt: separera sökningen i ett separat tankeled så att inte kodgenereringen kraschar mot `finishReason=STOP`.
4. **Pre-Output Kravavstämning:** Innan svaret genereras ska modellen räkna antalet distinkta avsnitt i källdokumentet och verifiera att utdata innehåller exakt lika många avsnitt.
5. **Förbud mot "I Sammanfattning":** Inled aldrig ett stycke med "I korthet", "Sammanfattningsvis" eller "Huvuddragen är". Skriv ut hela detaljkedjan.

## 3. Förbjudna Mönster (Blacklist)
- Automatisk sammanfattning av användarens inmatning utan explicit begäran.
- Platshållarkommentarer i kod (`// ... koden fortsätter här ...`).
- Bortklippning av tabellrader eller referenssektioner.

## 4. Pre-Flight Verifieringschecklista
- [ ] Motsvarar textlängden i utdata källtextens fulla omfång (95–110 %)? (Krav: JA)
- [ ] Har alla exempel och tekniska förbehåll återgetts utan strykningar? (Krav: JA)
- [ ] Är kodblocken kompletta och fria från avhuggna rader? (Krav: JA)
