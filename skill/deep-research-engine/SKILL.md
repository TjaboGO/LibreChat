---
name: deep-research-engine
description: Recursive multi-hop research planner, source authority collector, and sentence-level citation badge synthesis engine, reverse engineered from Perplexity Computer and OpenAI Deep Research.
when-to-use: Use when investigating complex questions, conducting deep market or academic analyses, executing multi-hop recursive web searches, and producing grounded reports with verified citation badges.
always-apply: false
user-invocable: true
---

# Deep Research Engine & Citation Badges

## 1. Systemöversikt & Filosofi
Denna färdighet implementerar det moderna autonomiska forskningsprotokollet från **Perplexity Computer** och **OpenAI Deep Research (Astra / Atlas / o3)**:

1. **Rekursiv Multi-Hop Sökplanering:**
   - Ersätter naiv ensides-sökning med ett hierarkiskt träd av sökfrågor.
   - **Hop 0 (Broad Discovery):** Identifierar primära entiteter, myndigheter, tidslinjer och auktoriteter.
   - **Hop 1 (Subqueries & Facets):** Bryter ner ämnet i arkitektur, prestandamätningar, marknadsantagande och begränsningar.
   - **Hop 2 (Gap Queries & Verification):** Letar aktivt efter motbevis, kritik, debunking och oberoende tredjepartsgranskningar.

2. **Källhierarki & Auktoritets-Tiering:**
   - **Academic:** arXiv, Nature, IEEE, ACM, `.edu` (högsta trovärdighet för vetenskapliga påståenden).
   - **Primary:** Officiell dokumentation, GitHub-källkod, Anthropic/OpenAI/Google engineering-bloggar.
   - **Official:** Reglerande myndigheter (`.gov`), standardiseringsorgan (`w3.org`, `ietf.org`).
   - **News:** Auktoritativa nyhets- och finansiella redaktioner (Bloomberg, Reuters, Financial Times).
   - **Community:** Forum och bloggar (används endast med explicit brasklapp).

3. **Mening-för-Mening Källcitat (`[1]`, `[2]`):**
   - Inga påståenden lämnas ogrundade. Varje siffra, benchmark, tidsangivelse eller påstående förankras med en citatbadge `[1](url)`.
   - Hovercard visar källdomän, favicon, tillförlitlighetstier, full titel, källcitat och direktlänk.

---

## 2. Forskningsarbetsflöde & Exekvering

### Steg 1: Formulera Frågeträd (`generateResearchPlan`)
Vid en djupforskningsförfrågan skapar agenten ett strukturerat frågeträd:
```json
{
  "queries": [
    { "id": "q-root", "depth": 0, "category": "broad", "query": "Ämne översikt trender aktörer" },
    { "id": "q-sub-1", "depth": 1, "category": "subquery", "query": "Ämne teknisk arkitektur benchmark protokoll", "parent": "q-root" },
    { "id": "q-sub-2", "depth": 1, "category": "subquery", "query": "Ämne produktionsproblem felmoder begränsningar", "parent": "q-root" },
    { "id": "q-ver-1", "depth": 2, "category": "verification", "query": "Ämne kritik kontroverser debunked oberoende granskning", "parent": "q-sub-2" }
  ]
}
```

### Steg 2: Källinsamling & URL-Kanonisering
Alla källor normaliseras via `cleanUrl`:
- Spårningsparametrar (`utm_*`, `fbclid`, `gclid`, `ref`) tas bort deterministiskt.
- Domäner klassificeras i tillförlitlighetstiers.
- Duplicerade källor slås samman under samma numeriska citat-ID (`[1]`).

### Steg 3: Djupforskningsrapport med 6 Dimensioner
Rapporten struktureras enligt Frontier Research-standarden:
1. **Executive Summary:** Koncis syntes med primära citatankare.
2. **Key Thematic Findings:** Djupdykning uppdelad i 3-5 teman med direkta hänvisningar (`[1]`, `[2]`).
3. **Comparative Matrix:** Markdown-tabell som ställer dimensioner, traditionella metoder och nya genombrott mot varandra.
4. **Chronological Milestones:** Tidslinje med datum och tillhörande källor.
5. **Knowledge Gaps & Open Questions:** Oidentifierade faktorer, motstridiga källor eller områden som kräver vidare analys.
6. **Annotated Bibliography:** Fullständig källförteckning med domän, titel, utdrag och klickbara länkar.

---

## 3. Riktlinjer mot Hallucinationer
- **Citat-grounding:** Skriv aldrig en siffra eller ett resultat utan ett explicit `[X]`-citat till en insamlad källa.
- **Motbevis:** Om två källor motsäger varandra, dölj inte konflikten. Belys båda sidor i rapporten under en separat underrubrik.
- **Tidsangivelser:** Specificera alltid publiceringsdatum eller tidsram för benchmarks (t.ex. "Per Q1 2026").
