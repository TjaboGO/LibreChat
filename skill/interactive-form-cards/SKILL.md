---
name: interactive-form-cards
description: Interactive in-chat form cards (AskUserQuestions / Generative UI) for gathering user decisions, clarifying requirements, and presenting multi-choice configuration options directly in the conversation flow.
when-to-use: Use when you need user clarification, need to validate architecture or technology assumptions, or present multiple choice trade-offs during planning or building.
always-apply: false
user-invocable: true
---

# Interactive In-Chat Form Cards (AskUserQuestions / Generative UI)

## 1. Systemöversikt & Filosofi
Interactive Form Cards implementerar det ledande användargränssnittsmönstret för interaktiva AI-beslut, hämtat från **v0** (`AskUserQuestions`) och **Google Antigravity** (`ask_question`).

Istället för att ställa ostrukturerade frågor som ren text där användaren måste skriva långa förklaringar, genererar agenten ett **interaktivt formulärkort direkt i chatten**:
- Klickbara knappar/kort med radioval eller kryssrutor (`is_multi_select`).
- Automatisk framhävning av rekommenderade val med `✦ Recommended`-badge.
- Fritextfält ("Write custom answer...") för användare som vill specificera något utanför alternativen.
- Direkt inlämning som formaterar svaret och återupptar modellens exekvering.

---

## 2. Användning: Function Calling Tool (`ask_question` / `AskUserQuestions`)

När du anropar verktyget `ask_question` eller `AskUserQuestions`:
- Samla **alla relaterade frågor i ett och samma anrop** (1 till 4 frågor).
- Anropa ALDRIG `ask_question` parallellt med andra verktyg — nästa steg beror på användarens svar.
- Sätt alltid det mest lämpliga svaret först och prefixa det med `(Recommended)`.
- Inkludera aldrig tidsuppskattningar i alternativen — fokusera på vad varje val innebär tekniskt eller funktionellt.

### JSON-exempel för Tool Call:
```json
{
  "title": "Databas & Autentisering",
  "questions": [
    {
      "id": "database",
      "question": "Vilken databas ska vi konfigurera för projektet?",
      "options": [
        "PostgreSQL med Prisma (Recommended)",
        "MongoDB med Mongoose",
        "SQLite (lokal snabbstart)"
      ],
      "is_multi_select": false
    },
    {
      "id": "auth_providers",
      "question": "Vilka inloggningsmetoder vill du erbjuda?",
      "options": [
        "Google OAuth (Recommended)",
        "GitHub OAuth",
        "E-post & Lösenord"
      ],
      "is_multi_select": true
    }
  ]
}
```

---

## 3. Användning: Markdown Container Syntax (`:::form-card`)

För modeller eller miljöer som kommunicerar via Markdown (t.ex. Claude, DeepSeek eller OpenRouter-modeller utan dedikerade interrupts), stöds Generative UI direkt via `:::form-card`- eller `:::question`-block:

```markdown
Jag har förberett grundstrukturen för din applikation. Innan vi sätter upp API-lagret behöver vi bestämma följande:

:::form-card
{
  "title": "Arkitektur & State Management",
  "questions": [
    {
      "question": "Hur vill du hantera globalt state i klienten?",
      "options": [
        "Zustand (Recommended)",
        "TanStack Query + Context",
        "Redux Toolkit"
      ],
      "is_multi_select": false
    },
    {
      "question": "Vilka UI-komponenter ska vi inkludera i första versionen?",
      "options": [
        "Dashboard med statistik (Recommended)",
        "Inställningspanel",
        "Mörkt/ljust temabyte"
      ],
      "is_multi_select": true
    }
  ]
}
:::

Välj alternativen ovan så bygger jag klart modulerna direkt.
```

---

## 4. Användarens Svarsflöde & Återupptagande

När användaren klickar på "Submit Answers":
1. Formuläret låses och visar en permanent grön bock `✓ Answers Submitted`.
2. Svaren levereras tillbaka till modellen i formatet:
   ```markdown
   [Interactive Form Response]
   - **Arkitektur & State Management**: Zustand (Recommended)
   - **UI-komponenter**: Dashboard med statistik, Mörkt/ljust temabyte
   ```
3. Modellen fortsätter därefter omedelbart med implementationen baserat på användarens val.

---

## 5. Riktlinjer för Bäst Upplevelse
- **Använd inte för triviala frågor:** För enkla ja/nej-frågor (t.ex. "Vill du att jag fortsätter?"), använd vanlig text.
- **2 till 6 alternativ:** Håll antalet val rimligt så att användaren inte överväldigas.
- **Koncisa etiketter:** Formulera alternativen kortfattat och placera teknisk kontext i frågans beskrivning.
