# Architecture and Review Guidelines

## Invariant Rules
- Keep controllers and routes thin: business logic belongs in domain services.
- Never leak database types across public API and client contracts.
- Always validate incoming payloads at boundaries.
- Error handling must be explicit and informative without exposing sensitive internal state.
