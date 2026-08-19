# Writing Guide

Target reader: a senior engineer unfamiliar with this area, who should walk away able to start working in it confidently.

## Structure

Adapt to the question. Not every section is needed every time.

### Overview

1-2 paragraphs. What it is, what it does, why it exists. Someone should be able to read only this and decide whether to keep reading.

### Key Concepts

The types, services, or abstractions needed to follow the rest. Brief definitions, not an inventory.

### How It Works

The core, and the longest section. What triggers it, what happens step by step, where data goes, what the decision points are.

Prose, not pseudocode. Reference specific files and functions so the reader knows where to look; no large code blocks unless a snippet is genuinely essential to a point.

When multiple components talk to each other, or data transforms through stages, include a diagram: mermaid (```mermaid) for sequences, flowcharts, and component graphs; ASCII for simple relationships where mermaid is overkill. A diagram should clarify, not decorate. If prose already covers the flow, skip it.

### Where Things Live

A short file/directory map. Only what someone needs to start working here.

### Gotchas

Non-obvious behavior, historical context, sharp edges. Omit the section if there's nothing to call out.

## Style

Apply the **unslop** skill throughout.

- Concrete language, not abstractions-about-abstractions.
- "The `UserService` calls `AuthClient.refresh()`", not "the service delegates to the client".
- When something is complex, explain _why_ it's complex rather than just describing the complexity.
- When something is simple, don't pad it.
- Use an analogy if a good one exists; don't force one.
- Acknowledge gaps and open questions honestly instead of papering over them.
