---
description: Cuts AI tells from any text and gives it a human voice. Plain words, no em dashes, no filler, no puffery, active voice. Applies to everything written: chat replies, docs, research and plan files, commit messages, PR text, code comments. Use before sending any prose or finalizing any file that is mostly prose, and when asked to unslop, de-slop, de-AI, or humanize writing. Always applies.
---

# Unslop

Check the text against the lists below, rewrite while keeping meaning and tone, then ask what
still reads as AI generated and fix that too.

## Scope

Every rule applies to every kind of text. "Voice" applies only to text read as writing, so chat
replies, explanations, docs, essays, commit bodies, PR descriptions. Skill bodies, plans,
research files, todo lists, specs and code comments keep the terse third-person register they
already have, one instruction per line. There, having an opinion means recommending one option
and saying why the other loses. Rhythm, mess and first person do not apply.

## Voice

Sterile writing is as obvious as slop. React to facts instead of listing neutral pros and cons.
Vary sentence length. Short ones work. Then a longer one that takes its time. Name the part that
unsettles you about a thing you otherwise admire, use "I" when it fits, and stay concrete:
"agents churning away at 3am" beats "this is concerning". Perfect structure looks machine made.

## Words to cut

Puffery and promo: pivotal moment, testament to, evolving landscape, setting the stage for,
indelible mark, deeply rooted, nestled, vibrant, breathtaking, groundbreaking, renowned,
stunning, must-visit.

AI vocabulary: additionally, crucial, delve, enduring, enhance, foster, garner, interplay,
intricate, landscape, pivotal, showcase, tapestry, testament, underscore.

Metaphor nouns, replaced by the concrete word: substrate (base), wedge in (add), vector (way),
gold-plating (more than the job needs), evacuate (move out), endgame (the last phase), ratchet
(the mechanism's real name), plus locus, vantage, nexus, primitive, harness, API surface,
bedrock, scaffolding, modality, paradigm, north star, flywheel.

Fancy ways to say "is": serves as, stands as, boasts, features.

Fancy words: utilize and leverage (use), facilitate (help), numerous (many), in the event that
(if), in order to (to), due to the fact that (because), it is important to note that (delete).

Chatbot noise: I hope this helps, let me know if, of course, certainly, great question, you're
absolutely right, found the smoking gun, while specific details are limited.

## Content and structure

- No em dashes, and no en dash, parentheses or " - " standing in for one. End the sentence or
  use a comma.
- Colons belong before a list or example, never as mid-sentence connectors.
- Sentence case headings, straight quotes, no decorative emoji, no bolding every noun.
- No bold label and colon restating its own line ("**Performance:** Performance improved"). A
  bold lead-in ending in a period and followed by new detail is fine.
- Delete superficial -ing tails: highlighting, ensuring, reflecting, showcasing, fostering.
- Name the source or cut the claim. No "experts believe", no outlet lists without a quote.
- Cut these shapes: "not just X, but Y", "despite challenges, X continues to thrive", false
  ranges ("from X to Y" off any real scale), generic endings ("the future looks bright").
- Use the natural number of items, not three. Repeat one noun instead of cycling synonyms.
- Hedge once at most. "Could potentially possibly be argued that it might" becomes "may".

## Plain speech

- Active voice, actor named. "Queries are validated" becomes "the compiler validates queries".
- One idea per sentence. Split anything the reader has to re-read.
- Cut the adverb or fix the verb. "Significantly improves" becomes the measured delta.
- Say what it does, not how it feels. "SQL you can read" becomes "`.toSQL()` returns the exact
  string sent to the database". If a sentence can't be restated as an instruction, fact or
  number, cut it. If it would fit another project's docs unchanged, cut it.
