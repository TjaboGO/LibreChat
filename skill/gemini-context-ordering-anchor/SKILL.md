---
name: gemini-context-ordering-anchor
description: Use in Google Gemini sessions working with large documents, RAG systems, or extended multi-turn conversations to cure the Context Ordering Trap, source blindness, and correction looping.
---

# Gemini Context Ordering & RAG Grounding Protocol

## 1. Syfte och Operativ Mekanism
Enligt Googles officiella *Prompt Design Strategies* lider Gemini av *Context Ordering Trap*: modellen tappar fokus och missar krav om instruktionerna placeras före bifogad referensdata. Dessutom uppvisar modellen *Severe Source Blindness* (prioriterar träningsdata framför uppladdade filer) och *Correction Looping* (ber om ursäkt för fel men upprepar dem tre turer senare). Denna färdighet strukturerar kontextflödet för maximal precision.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Data Först — Direktiven Sist (Context Ordering):**
   - I alla anrop och interna resonemang ska referensmaterial, källdokument och kodfiler placeras FÖRE frågan och reglerna.
   - Strukturen ska alltid vara: `[BIFOGAD KÄLLDATA / DOKUMENT]` → `[UPPDRAG / ANALYSKRAV]` → `[REGLER OCH SVARSFORMAT]`.
2. **Källan är Primär Sanning (Context is the Source):**
   - Användarens uppladdade dokument har absolut företräde framför Geminis interna träningskunskap. Om dokumentet säger att en produkt lanseras 2028, gäller detta oavsett vad allmän webbdata säger.
3. **Bekräfta Faktisk Åtgärd vid Korrigering (Anti-Correction-Looping):**
   - När användaren påpekar ett fel: Det är förbjudet att enbart skriva en ursäkt.
   - Modellen måste: (a) identifiera den exakta raden/orsaken, (b) genomföra den faktiska ändringen, (c) visa det korrigerade kodblocket/texten, och (d) bekräfta att det gamla felaktiga mönstret raderats.
4. **Re-Grounding var Femte Tur:**
   - I konversationer som överskrider 5 samtalsvändor ska modellen genomföra en intern synkronisering mot projektets ursprungliga regler och datastrukturer för att förhindra kontext-amnesi.
5. **Sekventiell Textsyntes:**
   - Vid sökning och syntes i stora dokument: referera alltid till specifika avsnittsrubriker och sidonummer. Syntetisera hela dokumentet, inte bara det första kapitlet.

## 3. Förbjudna Mönster (Blacklist)
- Att prioritera allmän internetkunskap framför innehållet i användarens bifogade fil.
- Tomma ursäkter utan omedelbar, faktisk rättning i samma meddelande.
- Att placera systemregler överst och klistra in en 50-sidig fil underst utan avslutande instruktion.

## 4. Pre-Flight Verifieringschecklista
- [ ] Ligger källdata före instruktionerna i analyskedjan? (Krav: JA)
- [ ] Har faktauppgifter hämtats direkt från den bifogade filen istället för träningsminnet? (Krav: JA)
- [ ] Är rättelsen faktiskt genomförd och inte bara utlovad? (Krav: JA)
