---
name: self-healing-dev-server
description: Autonomous full-stack web application generator and self-healing development server with real-time browser console error feedback loops, inspired by Windsurf and Lovable.
when-to-use: Use when building full-stack web apps, running local dev servers, diagnosing browser console errors, and executing autonomous self-healing fix cycles.
always-apply: false
user-invocable: true
---

# Full-Stack Generator & Self-Healing Dev Server

## 1. Systemöversikt & Filosofi
Denna färdighet implementerar den kraftfulla utvecklingsloopen från **Windsurf (Cascade AI Flow)** och **Lovable (Live Preview & Console Error Healing)**:

1. **Full-Stack Web App Scaffolding:**
   - Skapar omedelbart körbara webbapplikationer baserade på modern React, Vite, Tailwind CSS och TypeScript.
   - Genererar rena, moduluppdelade komponenter med responsiv layout och god UX utan onödig boilerplate.

2. **Live Browser Preview:**
   - Kör applikationen mot en lokal dev-server (port 5173 eller 3000) med omedelbar HMR (Hot Module Replacement).
   - Tillhandahåller responsiv multi-viewport förhandsgranskning (Desktop, Tablet, Mobil).

3. **Web Console Error Feedback Loop (Self-Healing Loop):**
   - Övervakar webbläsarens `console.error`, unhandled runtime exceptions och Vite-kompileringsfel.
   - Extraherar källfil, radnummer och rotorsak (`diagnoseConsoleError`).
   - Matar automatiskt AI-agenten med en åtgärdsbar felrapport (`[Self-Healing Dev Server Error Detected]`).
   - Agenten applicerar minimal korrekt fix, servern uppdateras live och felet verifieras vara läkt!

---

## 2. Felkategorier & Åtgärdsstrategier

När ett fel fångas i webbläsarens konsol tillämpas följande diagnostik:

### 2.1 ModuleResolutionError
- **Symptom:** `[vite] Internal server error: Failed to resolve import "canvas-confetti" from "src/App.tsx"`
- **Rotorsak:** Paketet är inte installerat i `package.json` eller har felaktig relativ sökväg.
- **Åtgärd:** Installera paketet eller justera import-sökvägen.

### 2.2 TypeError (Undefined Property Access)
- **Symptom:** `TypeError: Cannot read properties of undefined (reading 'map')`
- **Rotorsak:** Försök att loopa över eller läsa data innan asynkron laddning är slutförd.
- **Åtgärd:** Lägg till optional chaining (`items?.map(...)`) eller ett fallback-värde (`(items || []).map(...)`).

### 2.3 ReferenceError
- **Symptom:** `ReferenceError: activeTab is not defined in src/components/Nav.tsx:14`
- **Rotorsak:** En variabel, hook eller funktion används utan att deklareras eller importeras.
- **Åtgärd:** Deklarera eller importera den saknade symbolen i källfilen.

### 2.4 SyntaxError / JSX Parse Error
- **Symptom:** `SyntaxError: Unexpected token, expected "}"`
- **Rotorsak:** Obalanserade klamrar, trasiga taggar eller felaktiga tecken i JSX.
- **Åtgärd:** Rätta syntaxen på den angivna raden.

---

## 3. Self-Healing Exekveringsprotokoll

När agenten tar emot en `[Self-Healing Dev Server Error Detected]`-prompt:
1. **Inspektera den identifierade filen och raden:**
   - Läs raderna kring felet (`file_read` eller context).
2. **Tillämpa en fokuserad patch:**
   - Använd `file_str_replace` för att utföra en kirurgisk ändring (skriv inte om hela filen i onödan).
3. **Verifiera HMR och konsol:**
   - Vite applicerar ändringen på under 100 ms.
   - När felet försvinner från konsolen markeras sessionen som `✓ Healed`.

---

## 4. Riktlinjer för Full-Stack Kodning (Lovable & Windsurf)
- **Show, Don't Tell:** Skriv direkt fungerande kod till filerna utan långa förklaringar.
- **Omedelbart Körbar:** Alla nödvändiga imports och komponentberoenden ska inkluderas direkt.
- **Smidig UI:** Använd moderna Tailwind CSS-klasser, transitions och rena färger.
