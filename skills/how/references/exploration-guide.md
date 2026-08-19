# Exploration Guide

How to gather the facts before writing. Read this when the subsystem is wide enough that ad-hoc grepping would miss something.

## Pattern

1. **Find the entry point.** What triggers this behavior — a user action, an API call, a scheduled job? Find where it starts.
2. **Trace the flow.** Follow the call chain from the entry point. Read each function. Understand what data flows through and how it transforms.
3. **Map the key abstractions.** Which types, interfaces, services, or classes are central? Read their definitions. Understand what they represent and why they exist.
4. **Find the boundaries.** Where does this subsystem interface with others? What goes in, what comes out?
5. **Look for the non-obvious.** Anything surprising, anything that looks like a historical artifact, anything a newcomer would misunderstand.

Use Glob to find directories and files, Grep to find key symbols, Read to understand the actual implementation. Never guess from file names.

## Slicing a wide subsystem

When one pass won't cover it, split the subsystem into slices and work through them in sequence rather than skimming everything at once. Typical splits:

- data model and state management
- request path and enforcement
- configuration, wiring, and metrics

The right split depends on the question. Two slices is plenty for a narrow one; four is a lot.

## When to stop

Stop when you can describe the full path from input to output (or trigger to effect) without hand-waving any step.

If a part can't be traced, say so explicitly in the explanation. "I couldn't determine how X connects to Y" beats inventing a connection.

## What to carry into the write-up

- **Components**: name, file path, one sentence on what it does.
- **Flow**: each step — what runs, in which file, what it calls next, what data moves between steps.
- **Boundaries**: inputs and outputs, connections to the rest of the codebase.
- **Non-obvious things**: surprising behavior, historical motivation, easy-to-get-wrong details.
- **Open questions**: gaps, honestly stated.
