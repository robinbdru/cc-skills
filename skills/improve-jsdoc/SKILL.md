---
description: Add or update JSDoc comments on TypeScript/JavaScript files without touching logic. Use when asked to document, add JSDoc, annotate, or improve code comments on .ts/.tsx/.js/.jsx files.
---

# JSDoc

Add or update JSDoc comments on the target file(s). Never alter logic, signatures, or
formatting outside comment blocks.

## Workflow

1. Read the file — identify every documentable symbol (functions, classes, methods,
   exported constants, types).
2. For each symbol, check whether JSDoc already exists and is accurate — only touch it
   if incomplete or wrong.
3. Write or update the JSDoc block directly above the symbol.
4. Edit the file in place to apply the change — don't just print the updated code as chat output.

## Format

- `@param` with name and type for every parameter
- `@returns` with type and description (omit for `void`)
- `@throws` if the function can throw
- `@example` for non-trivial functions — realistic usage, not toy examples
- `@deprecated` if applicable
- `@template` for generic type parameters

## Rules

- Skip re-export barrel files (`index.ts` that only does `export *`) — adds no value
- Skip empty files
- Upgrade inline `// ...` comments on constants to JSDoc blocks for IDE hover support
- Use the file's actual TypeScript types in `@param`/`@returns` — don't restate what the
  signature already makes obvious, document the *why* when it isn't obvious
- In plain JavaScript files with no static types, infer the type from default values,
  usage, and runtime checks — give a conservative type (e.g. `string|undefined`) rather
  than `any`
- If runtime validation exists, note accepted value shapes in the `@param` description
