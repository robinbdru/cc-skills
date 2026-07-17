---
description: Fixes a reported bug by reproducing it, finding the actual root cause, applying the smallest correct fix, and verifying it. Use when the user reports a crash, error, exception, stack trace, incorrect output, or broken behavior and wants it fixed — not for feature requests, refactors, or architecture reviews.
---

# Fix bug

Turn a bug report into a verified fix, not a guess.

## Workflow

1. **Reproduce or trace precisely.** Get the exact repro steps, input, stack trace, or
   failing test. If none exists, write the smallest one that triggers the bug (a failing
   test or a manual repro command) before touching source — a fix that isn't observed
   failing first can't be confirmed as fixed. If reproduction genuinely isn't possible
   (e.g. no access to the failing environment), say so explicitly and fall back to static
   tracing from the stack trace/logs.
2. **Find the root cause, not the symptom.** Trace the failure to where the wrong
   assumption or wrong state actually originates — read the real code path, don't guess
   from naming or memory. Distinguish "where it throws" from "where it went wrong"; they
   are often different places. If the bug is a symptom of a broader design flaw, fix the
   immediate bug and note the broader issue separately rather than expanding scope.
3. **Apply the smallest correct fix.** Match existing style and patterns, touch only what
   the root cause requires, and avoid opportunistic refactors or unrelated cleanup in the
   same change. Don't paper over the symptom (e.g. a defensive null check) when the root
   cause is fixable at the source.
4. **Verify.** Confirm the original repro/failing test now passes, run the project's
   typecheck and test suite, and check nearby call sites the fix could affect for
   regressions. State plainly what couldn't be run or verified rather than claiming
   success.
5. **Report.** Root cause, the fix, and what was verified — including anything not
   covered by the verification above.

## Anti-patterns

Don't: patch the first line in the stack trace without tracing further back, fix by
adding a guard/try-catch that hides the real defect, expand into unrelated refactoring,
or report a fix as done without running the checks in step 4.
