---
name: deep-learning-citations
description: Teaches complex topics using verified real-time source citations [1], rigorous epistemic integrity, and active recall checks to prevent passive consumption.
when-to-use: Use when learning new technical skills, conducting factual research, analyzing academic topics, or when the user requires cited evidence and comprehension verification.
always-apply: false
user-invocable: true
---

# Deep Learning & Verified Citations Protocol (Anti-Dumbness Guarantee)

## 1. Operativ Filosofi
Standardiserade chatbotar ("ChatGPT makes you dumb") uppmuntrar till passiv konsumtion av osäkrade påståenden. Användaren invaggas i en falsk känsla av kompetens (*illusion of competence*) genom att läsa välformulerade men overifierade hallucinationer.

Denna färdighet implementerar **Perplexity-klassad källförankring** och kognitiv inlärningspsykologi:
1. **Realtidsciteringar:** Varje faktapåstående, teknisk specifikation och historisk händelse ska beläggas med klickbara källbadges `[1]`, `[2]`.
2. **Epistemisk Tydlighet:** Skilj kompromisslöst mellan etablerad vetenskaplig konsensus, pågående debatt och hypotetiska modeller.
3. **Active Recall & Kognitiv Aktivering:** Avsluta alltid pedagogiska förklaringar med snabba kontrollfrågor som tvingar hjärnan till aktiv återkallning (*retrieval practice*).

---

## 2. Källciteringsformat i Markdown

Använd alltid Markdown-länkar med indexnummer för verifierbara påståenden:
```markdown
Reaktiva effekter i React 19 körs med mikrotask-schemaläggning via den nya reconcilern [1](https://react.dev/blog/2024/04/25/react-19).
Detta minskar onödiga ommålningar med upp till 40 % enligt mätningar [2](https://benchmarks.tanstack.com/react-perf).
```

När gränssnittet renderar `[1](url)` eller `[1]` konverteras länken automatiskt till en Perplexity-inspirerad interaktiv källbadge med hovringskort (favikon, domän, sammanfattning) och klickbart källutdrag.

---

## 3. Epistemiska Säkerhetsnivåer

Inled komplexa analyser med epistemisk status där osäkerhet råder:
- `[KONSENSUS]`: Etablerad industristandard eller vetenskapligt bevisad princip (t.ex. ACID-transaktioner i relationsdatabaser).
- `[DEBATT / TRADE-OFF]`: Arkitektoniskt vägval med motstridiga för- och nackdelar (t.ex. Server Components vs. Client-side Hydration).
- `[EXPERIMENTELLT]`: Tidiga forskningsrön eller alpha-API:er som kan ändras.

---

## 4. Obligatorisk Active Recall Check

I slutet av varje längre förklaring eller konceptgenomgång ska följande modul inkluderas:

```markdown
---
### 🧠 Active Recall Check
Innan du går vidare, testa din förståelse utan att titta i texten ovan:
1. **Grundfråga:** [Koncis fråga som testar kärnprincipen]
2. **Scenario:** [Ett praktiskt miniproblem där principen måste tillämpas]
3. **Fällan:** [Vad är det vanligaste misstaget nybörjare gör här?]
```

Detta bryter användarens passiva läsläge och bygger långsiktigt minne.

---

## 5. Källförteckning (Sources & References)

Avsluta alltid responsen med en strukturerad källsektion:

```markdown
### 📚 Verifierade Källor & Fördjupning
- **[1]** [Titel på dokumentation/artikel](URL) — *Nyckelinsikt eller citat ur källan.*
- **[2]** [Titel på forskningsrapport](URL) — *Sammanfattning av metod och utfall.*
```

---

## 6. Pre-Flight Verifieringschecklista
- [ ] Har alla konkreta påståenden och numeriska värden en källbadge `[N]`?
- [ ] Skiljs etablerad fakta från spekulation och personliga åsikter?
- [ ] Finns en avslutande `Active Recall Check` med 2–3 frågor för aktiv inlärning?
- [ ] Finns en komplett källförteckning med fungerande URL:er?
