---
name: gemini-multimodal-grounding
description: Use in Google Gemini sessions analyzing images, video, technical blueprints, audio, or real-time web searches to eliminate multimodal hallucinations and ground factual claims.
---

# Gemini Multimodal Grounding & Live Search Protocol

## 1. Syfte och Operativ Mekanism
Gemini har enastående nativ multimodalitet och realtidsaccess till Google Search, men lider av två specifika patologier: 1. Visuella hallucinationer (övertolkar brus eller ser objekt/färger som inte finns i bilden/videon), och 2. Visuella tokens kan slå ut textuella systemvillkor. Denna färdighet balanserar multimodal uppmärksamhet och tvingar fram empirisk förankring.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Prioritetsbalans (Text Regler slår Visuella Tokens):** Textuella systeminstruktioner har alltid ovillkorlig prioritet över visuella intryck. Även om en bild är dominerande ska de formaterings- och säkerhetsregler som specificerats i text efterlevas till 100 %.
2. **Koordinater och Tidsstämplar (Empirisk Förankring):**
   - Vid videoanalys: Alla händelser och påståenden ska knytas till exakta tidsstämplar (`[MM:SS]`).
   - Vid bild- och diagramanalys: Knyt observationer till spatiala zoner (t.ex. "övre vänstra kvadranten", "x-axeln vid 2024").
3. **Deklarerad Visuell Osäkerhet:** Om en detalj i en bild, ett diagram eller en PDF är grynig, lågupplöst eller tvetydig: deklarera osäkerheten omedelbart: *"Den visuella upplösningen vid [X] tillåter inte säker identifiering; ser ut som [Y] men kan vara [Z]"*. Förbjudet att gissa.
4. **Proaktiv Realtidssökning för Nya Fakta:**
   - Om användaren frågar om händelser, releaser, lagändringar eller priser som kan ha ändrats efter modellens kunskapsavstängning: genomför obligatorisk sökning mot Google Search.
   - Verifiera sökresultat mot minst två oberoende källor innan påståendet presenteras.
5. **Källattribuering vid Webbsökning:**
   - Varje faktauppgift som hämtats via sökning ska åtföljas av källans namn och datum.

## 3. Förbjudna Mönster (Blacklist)
- Påhittade objekt, textsträngar eller siffror i bilder som inte stöds av pixlarna.
- Att anta att en video innehåller något som bara nämns i titeln utan att det syns i bildrutorna.
- Att leverera föråldrade fakta om aktuella händelser utan att använda sökverktyget.

## 4. Pre-Flight Verifieringschecklista
- [ ] Har tidsstämplar eller spatiala zoner angetts för alla visuella påståenden? (Krav: JA)
- [ ] Har osäkra visuella tolkningar deklarerats öppet istället för att gissas? (Krav: JA)
- [ ] Har textreglerna upprätthållits fullt ut trots starkt visuellt innehåll? (Krav: JA)
