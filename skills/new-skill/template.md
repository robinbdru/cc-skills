---
name: my-skill-name                 # optional — defaults to the directory name
description:                        # what it does + when to use it (third person, key terms first)
when_to_use:                        # optional — extra trigger phrases/examples, appended to description
argument-hint:                      # optional — autocomplete hint, e.g. [issue-number]
arguments:                          # optional — named args for $name substitution, e.g. [issue, branch]
disable-model-invocation:           # true = only /name invokes it, Claude won't auto-trigger
user-invocable:                     # false = hide from the / menu, Claude-only background knowledge
allowed-tools:                      # tools pre-approved while this skill is active
disallowed-tools:                   # tools removed from the pool while this skill is active
model:                              # model override for this turn, or "inherit"
effort:                             # low | medium | high | xhigh | max
context:                            # "fork" to run in a subagent
agent:                              # subagent type to use when context: fork
hooks:                              # skill-scoped hooks (see Hooks docs for format)
paths:                              # glob(s) limiting auto-activation to matching files
shell:                              # bash (default) or powershell
---

Your skill instructions here...
