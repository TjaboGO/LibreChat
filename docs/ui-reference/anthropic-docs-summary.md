# Anthropic reference docs summary

Source: PDFs exported from anthropic.com/claude.com, saved in
`Claude Screenshots/anthropic documents/`. Read on 2026-09-18. All Anthropic
copy below is paraphrased; quotes are marked and kept under 15 words.

## Claude Cowork and chat are now one Claude (blog, Sep 16 2026)

This is the single most important document for our rebuild. It announces that
**Claude Cowork (the separate "bigger work" surface) and normal chat have
merged into one interface** — there is no more mode picker.

- Anthropic's own framing of the old problem: Cowork was "a separate place
  for bigger work," Design was "for visual work," and users had to decide
  where a task belonged; context didn't carry over between the two. Their
  fix: "We stopped making you choose."
- **What the unified interface actually is:** a single conversation surface.
  Any chat can now do what used to require switching into Cowork or Design —
  hand off a long/messy task, and Claude uses whatever connectors, skills,
  and context are already attached to that conversation. There is no
  separate "Cowork mode" to enter.
- **New same-day product launches that live inside chat, not in their own
  tab:**
  - **Claude Docs** (beta) — ask for a document, you and Claude co-write it
    in the conversation.
  - **Claude Slides** (beta) — ask for a presentation, Claude drafts the
    deck in the conversation.
  - **Claude Design** — previously a standalone product, now *also* works
    inline inside conversations (the standalone Design surface still works
    unchanged for people who use it on its own).
  - Anything made with Docs/Slides/Design lives at one shareable link,
    editable on the phone; you can click an element and move it, or just
    tell Claude what to change. Outputs are downloadable as PowerPoint or
    PDF, or presented straight from Claude.
- **Autonomy control, not a mode toggle:** by default Claude asks before
  taking actions; the user can flip a setting so Claude keeps working
  independently and only checks in when something needs a closer look. The
  user always keeps final say.
- **Continuity on migration:** chat-only users notice nothing different.
  Former Cowork users keep everything — chats, projects, artifacts,
  connectors, skills — in the same unified app; nothing is walled off by
  surface anymore.
- **Rollout mechanics (important nuance):** this ships first to Pro/Max on
  web/desktop/mobile, with Team and Free "to follow soon," and Enterprise
  admins get 30 days' notice before it changes for their org. This explains
  why other documents dated after Sep 16 (ecosystem page, footers) still
  list "Claude Cowork" as a distinct product name — the merge is a rolling
  migration, not an instant rename, and Cowork's brand may persist for
  plans/tenants that haven't been migrated yet.
- A related, adjacent change referenced from this same page: **"Projects
  redesigned: from folder to conversation"** (Sep 17, 2026) — Anthropic is
  moving Projects away from a folder/file-tree metaphor toward a
  conversation-centric structure. This is directly relevant to how we should
  model Projects.

## Claude ecosystem (claude.com/ecosystem)

Describes how third-party tools attach to Claude, and gives clean
user-facing definitions for two commonly-confused concepts:

- **Connectors**: "bring your apps and data into Claude to complete tasks"
  — i.e., a connector is a live link to one external app/data source (Slack,
  Google Workspace, Microsoft Office, Figma, Gmail, Drive, DocuSign, etc.).
- **Plugins**: "combine connectors and skills to complete workflows" — a
  plugin is a bundle (one or more connectors + one or more skills) packaged
  to accomplish a repeatable job, not just a single link.
- Connectors/plugins are shared infrastructure: "your tools can be connected
  to Claude Code, Cowork, and Claude on web, desktop, and mobile" — same
  connector works everywhere Claude runs.
- Enterprise framing: admins control which tools each team can use and what
  those tools can do (permissioned, per-team connector/plugin access).
- There's a **directory** (browsable list of connectors/plugins) distinct
  from a **marketplace** (partner-built products/solutions built on top of
  Claude, sold or bundled separately) — the FAQ explicitly calls out "What's
  the difference between the directory and the marketplace?" as a real user
  question, implying these are two separate surfaces in their nav.
- Top-level nav/footer categories confirmed on this page:
  - **Capabilities**: Artifacts, Design, Connectors, Plugins, Skills
  - **Extensions**: Claude in Chrome, Claude for Microsoft 365
  - **Models**: Mythos, Fable, Opus, Sonnet, Haiku

## Blog index (claude.com/blog, ~20 pages of post titles, late 2025–2026)

This is a listing page (titles + categories only, no article bodies), but at
scale it's the richest source of exact terminology. Grouped by theme:

**Cowork lifecycle (shows Cowork's history right up to the merger):**
- Cowork began as a **Claude in Chrome side panel**, then became its own
  surface: "The Claude in Chrome side panel is now Claude Cowork" (Aug 12,
  2026); "Claude gets its own browser in Cowork" (Aug 26, 2026); "Claude in
  Chrome is generally available" (same day, as a separate, still-standalone
  extension).
- Cowork had its own onboarding/marketing content up to the merge: "The
  Claude Cowork product guide," "Best practices for getting started with
  Claude Cowork," "Customize Cowork with plugins," "Claude Cowork is coming
  to mobile and web," "How people are using Claude Cowork," "Making Claude
  Cowork ready for enterprise," "Bringing Claude Code and Claude Cowork to
  government."
- "Put Claude to work on your computer" (Mar 23, 2026) reads as the
  precursor announcement that introduced Cowork-style autonomous task
  handling before Cowork had its final brand name.

**Projects, Artifacts, Skills, MCP — user-facing explainers:**
- "Skills explained: How Skills compares to prompts, Projects, MCP, and
  subagents" — Anthropic's own framing puts **Skills, Projects, and MCP on
  the same conceptual level** as things a user chooses between/combines.
- "What is Model Context Protocol? Connect AI to your world" — MCP's
  consumer-facing tagline is about *connecting* Claude to outside tools/data,
  not a technical protocol description.
- "Introducing Agent Skills" (Oct 16, 2025) is the formal launch; official
  name is **"Agent Skills"** (often shortened to "Skills" in later posts).
- "How to create Skills: Key steps, limitations, and examples," "A complete
  guide to building skills for Claude" — skills are user-authorable, not
  just built-in.
- "Claude Code now supports artifacts" (Jun 18, 2026) — confirms Artifacts
  is a cross-surface concept (chat and Claude Code both produce/support
  them), not chat-only.
- "Claude now creates interactive charts, diagrams and visualizations" (Mar
  12, 2026) — describes Artifacts' output types in plain language.
- "Your favorite work tools are now interactive connectors inside Claude" —
  consumer framing of connectors as "your tools," not "integrations."

**Memory:**
- "Bringing memory to Claude" (Sep 11, 2025) — initial launch.
- "Claude's memory works everywhere, and you decide what's in it" (Aug 25,
  2026) — the mature framing: memory is cross-surface (web/desktop/mobile/
  Code) and user-controlled/editable, not a silent background feature.

**Other named products/surfaces seen repeatedly:**
- **Claude Tag** — Claude's presence inside Slack (per system context: "Claude
  Tag (Claude in Slack)"); posts describe it handling CI/CD alerts, ad-hoc
  data questions, and health-org workflows.
- **Claude Managed Agents** — a distinct product for deploying/hosting
  agents: scheduling, environment variable vaults, self-hosted sandboxes,
  MCP tunnels, multi-agent orchestration, built-in memory.
- **@Claude** — listed repeatedly in nav/footers as its own product line
  (an at-mention-style invocation of Claude inside third-party tools).
- **Claude Design** — originally "Claude Design by Anthropic Labs," a
  visual/design-canvas product that now also runs inline in chat (see first
  doc above).
- **"Analysis tool"** (Oct 2024) — the original name for what became
  Claude's code-execution/data-analysis capability in chat.
- Vertical/industry product pages exist as their own named entities:
  Claude for Financial Advisors, Claude for Small Business, Claude for
  Teachers, Claude for Nonprofits, Claude for Life Sciences, Claude for
  Financial Services, Claude for Education — each is a landing page/bundle
  of settings + connectors for that audience, not a separate app.
- **Voice mode** — "Think through hard problems in voice mode" (Jul 23,
  2026), a conversational voice input/output mode inside chat.
- Claude Code-specific UI concepts (not relevant to end-user chat UI but
  worth knowing): "Agent view," "auto mode" (default execution mode for
  Pro/Max/Team), "dynamic workflows," "routines," subagents, hooks,
  CLAUDE.md.

## Newsroom (anthropic.com/news, press-release index)

Mostly company/policy news, not UI description, but confirms exact model and
product naming over time:

- Confirms current model family names as of Sep 2026: **Claude Fable 5.1**
  and **Claude Mythos 5.1** are top-line model names (alongside the existing
  Opus/Sonnet/Haiku line — e.g. Claude Opus 5, Claude Sonnet 5, Claude
  Sonnet 4.6, Claude Opus 4.8/4.7/4.6/4.5). Fable and Mythos read as
  additional model families, not replacements for Opus/Sonnet/Haiku.
- **"Claude's extended thinking"** (Feb 24, 2025) is confirmed as the
  official, lowercase-in-use feature name (paired with the Claude 3.7 Sonnet
  / Claude Code launch).
- **"Introducing computer use"** (Oct 22, 2024) is the official name for
  screen/mouse/keyboard control by Claude — this predates and underlies the
  later Cowork "own browser" feature.
- "Claude Science" — described as "an AI workbench for scientists" (launched
  Jun 30, 2026), a distinct research-oriented product.
- "Introducing Labs" (Jan 13, 2026) — **Anthropic Labs** is confirmed as an
  experimental-features umbrella (Claude Design first shipped under this
  label).
- "Introducing Claude Tag" (Jun 23, 2026) is the formal Slack-integration
  launch.
- Footer product list (confirms full current naming set): Claude, Claude
  Code, Claude Code Enterprise, Claude Cowork, @Claude, Claude Design,
  Claude Science, Claude Security, Claude in Chrome, Claude for Microsoft
  365, Skills. Models: Mythos, Fable, Opus, Sonnet, Haiku.

## Screenshot: "Keep thinking." (anthropic.com/path-to-hope)

- This is Anthropic's policy/thought-leadership hub page, not a product UI
  screen. It groups the company's public writing into five theme buckets:
  "Who should govern AI?", "How should I use AI?", "How does AI work?",
  "How does AI affect the economy?", and "What is AI's impact on society?"
- Not directly reusable as product navigation — it's editorial content
  categorization, not app structure — but the tone ("Keep thinking.") is
  useful as a brand-voice data point: calm, understated, not hype-driven.
- No new product/feature names appeared in this screenshot beyond what the
  other documents already cover.

## Key implications for our UI rebuild

1. **Do not build a separate "Cowork" tab or mode.** Anthropic explicitly
   killed the mode-picker problem ("we stopped making you choose"). Our
   LibreChat fork should have exactly one conversation surface. Long-running/
   background-style tasks, connector use, and file/browser work should all
   be things *any* conversation can do — triggered by what the user asks
   for, not by which UI section they're in.
2. **Model "Cowork" capabilities as conversation-level affordances, not a
   destination.** Concretely: a settings toggle per-conversation (or
   globally) for "ask before every action" vs. "work autonomously, check in
   only when needed" — mirroring Anthropic's default-ask/opt-in-autonomy
   pattern — rather than a whole separate app screen.
3. **Docs/Slides/Design should be output types, not top-level apps.**
   Treat them like Artifacts with a specific renderer (document canvas,
   slide canvas, design canvas) that any chat can produce, each shareable at
   its own link, each exportable (PowerPoint/PDF equivalents), each
   editable in place (click an element / describe the change). Don't build
   them as separate navigation destinations.
4. **Redesign Projects around conversations, not folders.** Anthropic's own
   Sep 17, 2026 change ("Projects redesigned: from folder to conversation")
   is a strong signal: a Project should feel like a persistent thread/
   context container that conversations live inside, not a file-manager-style
   tree the user has to navigate into before chatting.
5. **Keep Connectors and Plugins as two distinct, layered concepts**, exactly
   as Anthropic defines them: Connectors = one link to one external app/data
   source; Plugins = a packaged bundle of connectors + skills for a
   workflow. Our settings/integrations UI should reflect this two-tier
   model rather than flattening everything into "integrations."
6. **Give Skills, Projects, and MCP equal billing as composable building
   blocks** the user can reach for and combine (per Anthropic's own "Skills
   vs. prompts vs. Projects vs. MCP vs. subagents" framing), rather than
   burying any one of them as a hidden power-user setting.
7. **Memory should be cross-surface and user-editable**, not a silent log —
   surface a visible "what Claude remembers" view the user can edit/delete
   from, consistent with "you decide what's in it."
8. **Terminology to adopt verbatim** where we build equivalent features:
   Artifacts, Projects, Skills (or "Agent Skills" in fuller contexts),
   Connectors, Plugins, Extended thinking, Memory, Computer use, Voice mode,
   Analysis tool (if we ever add code execution). Avoid inventing our own
   names for these concepts since matching Anthropic's exact vocabulary is
   the point of this rebuild.
9. **Treat the Cowork brand name itself as legacy/in-transition** — it's
   still visible in nav footers and older blog titles because Anthropic's
   own rollout is gradual (Pro/Max first, Team/Free later, Enterprise last).
   For our clone, we don't need a "Cowork" label anywhere; we should design
   directly for the destination state (one unified Claude) rather than
   replicating the transitional branding.
