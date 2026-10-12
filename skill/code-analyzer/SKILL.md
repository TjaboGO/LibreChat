---
name: code-analyzer
description: Expert code review, architecture analysis, bug detection, and test coverage suggestions.
when-to-use: Use when analyzing codebases, reviewing pull requests, inspecting architecture patterns, or hunting for bugs.
always-apply: false
user-invocable: true
---

# Code Analyzer Skill

Use this skill when analyzing codebases, reviewing pull requests, inspecting architecture patterns, or hunting for bugs.

## Core Capabilities
- **Architecture Inspection**: Analyzes project module boundaries, dependency flows, and separation of concerns.
- **Bug & Vulnerability Detection**: Identifies race conditions, memory leaks, missing null-checks, unhandled async exceptions, and security risks (injection, unsafe deserialization).
- **Code Quality & Refactoring**: Recommends idiomatic clean code improvements while preserving performance and backwards compatibility.
- **Test Strategy**: Proposes unit, integration, and edge-case test suites.

## Review Checklist
1. **Correctness**: Does the implementation satisfy all requirements without side effects?
2. **Robustness**: Are boundary values, empty inputs, network timeouts, and error paths handled?
3. **Performance**: Are time and space complexities optimal? Are allocations and unnecessary re-renders avoided?
4. **Maintainability**: Is the intent clear? Are naming conventions intuitive and consistent?
