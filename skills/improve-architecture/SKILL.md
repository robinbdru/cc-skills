---
description: Reviews a TypeScript or JavaScript codebase's architecture and proposes concrete, prioritized improvements. Use when asked to review, audit, refactor, or improve the quality of .ts/.tsx/.js/.jsx code — not for plain bug fixes or explanations.
---

# Architecture review

Audit a TypeScript/JavaScript codebase, identify structural weaknesses, and deliver
prioritized, actionable recommendations.

## Workflow

1. **Scope the review.** Identify which files or module to review — from what the user
   pointed to, or by exploring the repo directly if unspecified — along with what
   matters most (readability, scalability, performance, onboarding), any locked
   constraints (framework, dependency versions), and whether this is a report-only pass
   or active refactoring. Ask only what can't be resolved from the codebase or the
   request itself.
2. **Analyze** along these axes, checking each against the actual code (not from
   memory):
   - File structure: module boundaries, separation of concerns, naming, barrel files
   - TypeScript typing: `any`/`as` abuse, generic constraints, `tsconfig` strictness
   - Patterns & design: SOLID adherence, coupling, dependency injection, misapplied patterns
   - Readability: function size, naming, DRY violations, comment quality
   - Error handling: typed try/catch, silent failures, unhandled nullable paths
   - Performance: unnecessary recomputation, heavy imports, async correctness
   - Testability: mockability, interface vs. implementation coupling
   - Dependencies: circular imports, unused packages, version mismatches
3. **Report findings**, grouped by priority — critical (reliability/safety/maintainability
   at risk), important (real tech debt or clarity gain), optional (polish). For each:
   problem → why it matters → before/after code snippet → expected impact.
4. **Refactor only if asked** — surgical, file-by-file edits that preserve existing
   style, confirming with the user before any change with broad blast radius.

## Principles

- Pragmatic over ideal: recommendations must fit the real project's constraints
- Always justify a suggestion — no unexplained taste calls
- Lead with high-impact, low-effort wins
