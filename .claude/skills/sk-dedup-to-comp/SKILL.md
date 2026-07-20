---
description: Finds duplicated or near-duplicate SvelteKit frontend code — markup, load/fetch logic, form handling, reactive derivations — and proposes reusable components or snippets to make it DRY. Use when asked to deduplicate, find repeated code, or make Svelte components/logic reusable — reports a prioritized plan and only refactors when explicitly asked.
---

# Dedupe to components

Turn repeated Svelte/SvelteKit code into a prioritized DRY-up plan, then refactor only on request.

## Workflow

1. **Scope the sweep.** Use the files/routes the user pointed to, or scan
   `src/routes/` and `src/lib/components/` if unspecified. Check the project's Svelte
   version (`package.json`) — Svelte 5's `{#snippet}` and `{@render}` are only available
   there and change what "reusable" should mean.
2. **Find real duplication, not just matching filenames.** Read the actual markup and
   logic across candidate files. Look for:
   - Repeated markup blocks that differ only in prop values or text content
   - Repeated `load`/fetch logic, form handling, or validation across routes
   - Repeated reactive derivations (`$derived`, `$effect`, or legacy reactive statements)
     doing the same computation on different inputs
   Structural similarity counts even when variable names or minor branches differ —
   don't limit the search to byte-identical copies.
3. **Pick the smallest viable extraction shape** for each duplication found:
   - Repeated markup within one file/route, no cross-file reuse, no complex state →
     a local `{#snippet}` (Svelte 5) instead of a new component file
   - Reused across multiple routes/components → a new `.svelte` component, placed
     alongside the project's existing component conventions
   - Reused non-markup logic (fetch, validation, derivation) → a plain function, store,
     or util under `src/lib`
   Don't force-merge blocks that are only superficially similar — an abstraction with
   props for every difference isn't DRY, it's indirection. Keep props to what actually
   varies.
4. **Report, prioritized by impact** (frequency × size). For each duplication: file:line
   locations, what's duplicated, the proposed extraction with its sketched interface
   (props / snippet params / function signature), and a before/after snippet.
5. **Refactor only if asked.** Move scoped styles along with the markup they apply to,
   preserve existing naming and file-organization conventions, verify no visual or
   behavioral regression, and run typecheck/tests if available.

## Anti-patterns

Don't: extract a block used only once, over-generalize props to force a merge between
blocks that just look alike, move markup without its scoped CSS, or assume `{#snippet}`
is available without checking the Svelte version.
