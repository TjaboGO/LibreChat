---
name: dual-mode-engine
description: Intelligent dual-mode engine switching between Spec Mode (architectural planning, requirements, and TDD specifications) and Vibe Mode (rapid coding, fast prototyping, and instant execution).
when-to-use: Use when designing software architecture, drafting formal specifications, or when switching between rigorous planning and rapid flow-state prototyping.
always-apply: false
user-invocable: true
---

# Dual-Mode Engine (Spec Mode vs. Vibe Mode)

## 1. Systemöversikt & Filosofi
Dual-Mode Engine förenar de två främsta paradigm inom modern AI-assisterad mjukvaruutveckling, hämtade från **Kiro** (AWS-backed developer flow IDE) och **Traycer AI** (Plan Mode vs. Phase Mode):

1. **Spec Mode (Plan Mode / Lead Architect):**
   - **Motto:** *"Mät två gånger, såga en gång."*
   - Read-only disciplin mot kodbasen. Inga prematura eller destruktiva kodändringar tillåts.
   - Tar fram formella specifikationer, krav, arkitekturkontrakt, acceptanskriterier och TDD-testplaner.
   - Bryter ner implementationen i diskreta, numrerade faser och deluppgifter (`- [ ] Task 1.0`).
   - Kräver användarens godkännande innan utveckling initieras.

2. **Vibe Mode (Do Mode / Rapid Flow & Execution):**
   - **Motto:** *"Show, don't tell. Bygg det direkt."*
   - Full exekveringsbehörighet över kodbas och verktyg (`file_write`, `shell_exec`, etc.).
   - Optimerat för flow state, visuell prototypning, snabb iteration, UI-byggande och omedelbar körbarhet.
   - Minimal boilerplate, inga överflödiga diskussioner: genererar ren, idiomatisk och direkt fungerande kod.

3. **Auto Mode (Intelligent Intent Classifier):**
   - Klassificerar dynamiskt användarens intention i realtid baserat på prompt och samtalshistorik.
   - Tillämpar Kiros gyllene regel: **Vid tveksamhet, välj alltid Vibe / Do Mode.** Spec Mode aktiveras endast vid uttryckliga förfrågningar om specifikationer, planer eller hantering av spec-uppgifter.

---

## 2. Intent Classifier Regler & Konfidensberäkning

Intent-klassificeraren utvärderar användarens prompt och returnerar sannolikhetsfördelningen `{ "chat": X, "do": Y, "spec": Z }`:

### 2.1 Spec Mode Triggers
Ett meddelande klassificeras som `spec` ENDAST om det uttryckligen:
- Ber om en formell specifikation eller kravspec (`"Create a spec for auth"`, `"Skapa en kravspecifikation för betalflödet"`).
- Ber om en arkitekturplan, datamodell eller TDD-testplan innan kod skrivs (`"Design an architecture spec"`, `"Ta fram en TDD-plan"`).
- Ber om exekvering av specifika delmoment ur en befintlig spec (`"Execute task 2.1 from the spec"`, `"Kör nästa deluppgift"`).
- Ber om granskning av acceptanskriterier eller krav.

### 2.2 Vibe / Do Mode Triggers (Default Choice)
Ett meddelande tillhör `vibe` om det:
- Ber om direkt modifikation av kod, filer eller gränssnitt (`"Write a function"`, `"Skapa en React-komponent"`, `"Fixa buggen"`).
- Är en imperativ instruktion med handlingsverb (`"Bygg"`, `"Refaktorera"`, `"Optimera"`).
- Ber om snabb visuell prototypning (`"Gör en snygg landningssida med Tailwind"`, `"Prototypa en modal"`).
- Ber om förklaring, felsökning eller allmän information.

> [!IMPORTANT]
> **Kiros gyllene regel:** Om användarens förfrågan är dubbeltydig eller allmänt formulerad, välj ALLTID Vibe Mode. Frustrera aldrig användaren med påtvingad byråkrati när de vill ha snabb kod.

---

## 3. Spec Mode Protokoll & Dokumentstandard

När Spec Mode är aktivt tillämpas Traycer AI och Kiros specifikationsstruktur:

```markdown
# Specification: [Modulnamn eller Feature]
*Spec ID: SPEC-[NNN]*

## 1. Overview & Goal
Kortfattad beskrivning av problemet som ska lösas, användarnytta och affärsvärde.

## 2. Requirements
- Funktionellt krav 1 (t.ex. Användaren ska kunna logga in via Google OAuth2).
- Icke-funktionellt krav 2 (t.ex. Responstid under 100ms för token-validering).
- Säkerhets- och behörighetskrav.

## 3. Architecture & Data Contracts
- Data Interfaces & Typer (TypeScript interfaces, databasscheman).
- API-kontrakt (endpoints, payload-format, felkoder).
- Beroenden och komponentdiagram.

## 4. Acceptance Criteria & TDD Test Plan
- [ ] Givet ett ogiltigt token, ska API:et svara med 401 Unauthorized.
- [ ] Givet giltiga referenser, ska JWT-cookie med SameSite=Strict utfärdas.
- **TDD:** Enhetstester för kryptering i `auth.spec.ts`.
- **TDD:** Integrationstest för OAuth redirect loop.

## 5. Implementation Tasks
- [ ] **Task 1.0**: Datamodeller och migrationsskript.
- [ ] **Task 2.0**: Backend-service och router-endpoints.
- [ ] **Task 3.0**: Frontend UI-komponent och state-hantering.
- [ ] **Task 4.0**: End-to-end-tester och dokumentation.
```

### Regler under Spec Mode:
1. **Ingen destruktiv kodning:** Skriv inga produktionsfiler innan specen är godkänd.
2. **Källkodsinspektion:** Använd enbart read-only verktyg (`file_read`, `search_files`) för att förstå existerande mönster och importer.
3. **Godkännandegate:** Avsluta med att be användaren granska och godkänna specifikationen eller välja vilken deluppgift som ska påbörjas.

---

## 4. Vibe Mode Protokoll & Execution Flow

När Vibe Mode är aktivt tillämpas snabbhets- och flödesdisciplinen:

1. **Omedelbar kodleverans:** Generera fullständiga, körbara kodblock eller använd filverktyg för att skriva ändringarna direkt.
2. **Show, Don't Tell:** Minimera förklarande metatext och teoretiska diskussioner. Låt koden tala för sig själv.
3. **Minimal Boilerplate:** Skriv den absolut minsta mängd kod som behövs för att uppfylla kraven korrekt och idiomatiskt.
4. **Körbarhet:** Säkerställ att koden inte innehåller syntaxfel, brutna referenser eller saknade imports.

---

## 5. Prompt-Injektion i Klienten

I composer (`ChatForm.tsx`) injiceras automatiskt följande direktiv beroende på valt läge:

- **Spec Mode Directive:**
  `[Engine Mode: SPEC MODE (Architect & Plan)]`
  Tvingar agenten till read-only specifikation och TDD-kravställning.

- **Vibe Mode Directive:**
  `[Engine Mode: VIBE MODE (Rapid Flow & Execution)]`
  Tvingar agenten till snabb iterativ implementation och direkt kodleverans.

- **Auto Mode:**
  Klientens `classifyIntent()` analyserar prompten och väljer antingen Spec- eller Vibe-direktivet dynamiskt.
