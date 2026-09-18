Se [AGENTS.md](AGENTS.md) — samma instruktioner gäller för Claude Code som för andra
kodningsagenter i det här repot.

Specifikt för Claude Code/Orca-orkestrering: varje uppgift i `docs/tasks/` är avsedd
att köras i en egen worktree. Spawna inte flera agenter mot samma task-fil samtidigt,
och rör inte filer utanför task-filens "Rör inte"-avsnitt utan att flagga det.
