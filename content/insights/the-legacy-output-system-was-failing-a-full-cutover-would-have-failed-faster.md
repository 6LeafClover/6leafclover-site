---
title: The Legacy Output System Was Failing. A Full Cutover Would Have Failed Faster.
seo_title: The Legacy Output System Was Failing. A Full Cutover Would Have Failed Faster.
description: A Legacy System is Not Just for Christmas
category: objectif-lune
date: 2026-09-15T17:00:00.000+01:00
summary: An illustrative case study on the appeal, and the real risk, of the
  big-bang approach to retiring a critical legacy system.
---
# The Situation

Kestrel Utilities was running document output for customer billing and communications through a legacy system that was, by any reasonable measure, on borrowed time — ageing infrastructure, increasingly difficult to patch, and supported by a shrinking number of people who genuinely understood its inner workings. The urgency was real. The instinct, understandably, was to move fast: a single, planned cutover weekend, migrating everything to Objectif Lune at once.

# Why We Recommended Against It

Kestrel's legacy system fed more than a dozen distinct customer-facing document types, each with its own downstream dependencies — billing systems, customer portals, regulatory reporting feeds. A single-weekend cutover meant every one of those dependencies would be tested in production, simultaneously, for the first time, with customers directly affected if anything went wrong. Given the number of moving parts, the probability of at least one significant issue surfacing at scale was high.

# The Phased Approach

We proposed migrating one document type at a time, in order of complexity and risk, each following the same pattern:

- Build and configure the new workflow in Objectif Lune
- Run it in parallel with the legacy system for a defined period, comparing output directly
- Cut over that single document type once parallel running confirmed a match
- Move to the next document type only once the previous one was stable in production

# The Result

The full migration took roughly five months, considerably longer than a single-weekend cutover. It also meant that when an issue did surface — a formatting discrepancy affecting one specific document type, caught during parallel running — it was contained to that one process and resolved before any customer ever saw it, rather than surfacing across the entire document estate simultaneously. The legacy system was fully and safely retired on schedule, with zero customer-facing incidents across the entire migration.

# The Lesson

A big-bang cutover feels decisive because it happens quickly. A phased migration is usually the genuinely more decisive choice, because it keeps control in your hands at every step, rather than surrendering all of it to a single weekend and hoping nothing breaks.
