---
name: long-context-discipline
description: Use in any LLM session (Claude, Gemini, ChatGPT) when processing contexts exceeding 10,000 tokens, working with large documents, or managing multi-turn conversation memory.
---

# Long Context Discipline & Memory Hygiene Protocol

## 1. Syfte och Operativ Mekanism
I långa konversationer och stora kontextfönster uppvisar alla språkmodeller varierande grader av prestandaförsämring: information i mitten av fönstret glöms bort (*Lost in the Middle*), systeminstruktioner späds ut (*Instruction Dilution*), och föråldrade antaganden från tidigare turer fortsätter att påverka nya beslut (*Context Rot*). Denna färdighet upprätthåller rigorös kontextdisciplin och minneshygien över alla tre plattformar.

## 2. Tvingande Beteenderegler (Prioritetsordning)
1. **Strategisk Placering (Början & Slutet):**
   - Kritiska regler, bivillkor och leveranskrav ska alltid placeras antingen i promptens absoluta början eller absoluta slut — aldrig begravas i mitten av massiva datamängder.
2. **Re-Grounding var Femte Tur:**
   - I trådar som överskrider 5 samtalsvändor eller 10 000 tokens ska modellen genomföra en intern synkronisering mot projektets ursprungliga syfte och beslutade arkitekturregler.
3. **Direkt Citering framför Diffust Minne:**
   - När modellen refererar till tidigare beslut, variabelnamn eller krav ska den citera direkt ur historiken istället för att lita på en diffus helhetsbild.
4. **Strikt Hierarki vid Minneskonflikt:**
   - Om det uppstår en konflikt mellan olika informationskällor gäller alltid följande ordning:
     * Nivå 1 (Högst): Användarens explicita instruktion i det pågående meddelandet.
     * Nivå 2: Korrigeringar och beslut fattade tidigare i samma chatt-session.
     * Nivå 3: Grundläggande systeminstruktioner och projektregler.
     * Nivå 4 (Lägst): Automatiskt sparade "minnen" eller antaganden från tidigare sessioner.
5. **Aktiv Utfasning av Utdaterad Kontext (Context Cleaning):**
   - När ett arkitekturval eller en bugghypotes har förkastats i samtalet ska modellen explicit behandla det spåret som förlegat och inte återuppliva det i efterföljande turer.

## 3. Förbjudna Mönster (Blacklist)
- Att låta gamla minnen från förra månaden trumfa nya instruktioner i chatten.
- Att förlora greppet om variabelnamn eller databasscheman i långa sessioner.
- Att begrava affärskritiska instruktioner mitt i en 50-sidig referensfil.

## 4. Pre-Flight Verifieringschecklista
- [ ] Har de viktigaste kraven placerats strategiskt i kontextfönstret? (Krav: JA)
- [ ] Har eventuella förlegade antaganden från tidigare i chatten rensats bort? (Krav: JA)
- [ ] Följs den strikta prioritetshierarkin vid informationskonflikt? (Krav: JA)
