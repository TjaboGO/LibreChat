---
name: perplexity-connector-hub
description: Dynamic on-demand tool discovery, authentication, and execution hub for external cloud services, databases, and APIs, reverse engineered from Perplexity Computer and Meta Muse Agent.
when-to-use: Use when accessing user-connected external tools (GitHub, Slack, Notion, Jira, Linear, Stripe, PostgreSQL, Figma, Google Drive, Spotify) without overloading model context with static schemas.
always-apply: false
user-invocable: true
---

# Perplexity Computer Connector Hub (MCP Dynamic Tool Hub)

## 1. Systemöversikt & Filosofi
Denna färdighet och tillhörande körtidsmotor reverse-engineerar den revolutionerande arkitekturen från **Perplexity Computer** och **Meta Muse Agent**.

I traditionella LLM-lösningar tvingas utvecklare dumpa dussintals eller hundratals verktygsscheman direkt i systemprompten. Detta orsakar:
- Enorm token-konsumtion (10 000 – 40 000 tokens i varje anrop).
- Långsammare svarstider (Time-To-First-Token).
- Kontextförvirring och hallucinationer mellan likartade verktyg.

**Perplexity Computer-modellen** löser detta genom **on-demand dynamisk verktygsupptäckt**:
1. Modellen har initialt enbart ett minimalistiskt verktyg: `list_external_tools`.
2. Vid behov söker agenten efter relevanta kopplingar baserat på användarens fråga eller `@mentions`.
3. Endast de specifika parametrarna för de relevanta verktygen hämtas via `describe_external_tools`.
4. Verktyget exekveras säkert via `call_external_tool`.

---

## 2. Grundreglerna (Cardinal Invariants)

1. **Säg ALDRIG "Jag har inte åtkomst" utan att först ha anropat `list_external_tools`:**
   - Det är förbjudet att neka åtkomst till intern data, databaser, Jira-ärenden, Stripe-intäkter eller GitHub-kod utan att först kontrollera katalogen.
   - FEL: *"Jag har inte tillgång till ditt GitHub-repo eller dina Slack-meddelanden."*
   - RÄTT: Anropa `list_external_tools(queries: ["github", "slack"])` och meddela därefter användaren om tjänsten är ansluten eller behöver godkännas.

2. **Automatiska `@mention`-triggere:**
   - När en användare skriver `@GitHub`, `@Slack`, `@Notion`, `@Jira`, `@Stripe`, `@Postgres`, eller `@Figma`, tolkas det som en explicit instruktion att använda den externa tjänsten.

3. **Hantering av frånkopplade tjänster (`DISCONNECTED`):**
   - Om en tjänst är frånkopplad, anropa inte alternativa webbsökningsverktyg i smyg.
   - Visa istället det interaktiva anslutningskortet i chatten (`needsAuth: true`) så användaren kan autentisera med ett klick.

---

## 3. De 3 Kärnverktygen

### 1. `list_external_tools`
Söker igenom katalogen av connectors efter matchande verktyg och CLI-kommandon.
```json
{
  "name": "list_external_tools",
  "arguments": {
    "queries": ["stripe", "mrr", "subscription"],
    "category": "finance",
    "status": "ALL"
  }
}
```

### 2. `describe_external_tools`
Hämtar fullständigt JSON-schema och parametrar för de identifierade verktygen:
```json
{
  "name": "describe_external_tools",
  "arguments": {
    "tool_names": ["stripe_get_balance", "stripe_list_subscriptions"]
  }
}
```

### 3. `call_external_tool`
Exekverar den faktiska handlingen med validerade argument:
```json
{
  "name": "call_external_tool",
  "arguments": {
    "source_id": "stripe",
    "tool_name": "stripe_get_balance",
    "arguments": { "currency": "usd" }
  }
}
```

---

## 4. CLI Hint Fallback
Vissa tjänster stöder direkt exekvering via terminalen (`bash_tool`) om användaren har CLI-verktyg installerade:
- **GitHub:** `gh repo list --limit 10`
- **Slack:** `slack-cli chat post --channel general`
- **PostgreSQL:** `psql $DATABASE_URL -c "SELECT ..."`
- **Stripe:** `stripe balance retrieve`
- **Jira:** `jira issue list -q "project = ENG"`
- **Linear:** `linear issue list --team ENG`

---

## 5. Interaktiva UI-komponenter

1. **`ConnectorHubModal.tsx`:**
   - Fullständig katalog över alla tillgängliga connectors (GitHub, Slack, Notion, Jira, Linear, Stripe, Postgres, Figma, Google Drive, Spotify, Tavily, Filesystem).
   - Filtrera efter kategori (`Developer`, `Productivity`, `Communication`, `Finance`, `Data`, `Design`, `Storage`).
   - Direkt växling mellan Anslut / Koppla från med omedelbar statusindikering.

2. **`InteractiveConnectorCard.tsx` i chatten:**
   - Renderas vid verktygsanrop eller auth-blockering.
   - Visar ikon, status (Aktiv / Kräver Autentisering), inmatade argument, formaterat utdata samt CLI-alternativ.
   - Ersätter råa felmeddelanden med ett interaktivt "Anslut"-gränssnitt.

3. **Attach (+) Menyn (`AttachPlusMenu.tsx`):**
   - Direkt genväg under *Connectors* till "Perplexity Connector Hub (On-Demand)".
