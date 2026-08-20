---
title: The claims team wanted automation live in ten weeks. The architecture
  needed more time than that.
seo_title: The claims team wanted automation live in ten weeks. The architecture
  needed more time than that.
description: What comes first.  Speed or Accuracy?
category: process-automation
date: 2026-08-20T14:07:00.000+01:00
thumbnail: ""
summary: A case study on the tension between visible speed and durable delivery
  — and why the slower path is often the faster one, once you count properly.
---
# The Pressure

In My Time Insurance's leadership wanted a visible early win on claims automation, and had set a ten-week deadline for something to be live. The claims operations team, under pressure themselves, were ready to move straight into building against the current claims system as it existed on paper.

# Why We Paused

Before any build work began, we ran a two-week architecture and discovery phase — deliberately short, but non-negotiable. The goal was simple: understand the real end-to-end claims workflow as it actually happened, not as it was described in process documentation that turned out to be roughly six years out of date.

That discovery surfaced something the ten-week plan would have missed entirely: a data quality issue in how claim types were being categorised at intake, inconsistent enough that any automation built on top of it would have misrouted a meaningful percentage of claims within its first few weeks live.

# What Changed as a Result

- The intake categorisation issue was corrected before automation went anywhere near it, rather than being discovered in production
- The workflow design was built around how claims handlers actually worked, including several manual exception-handling steps the original documentation didn't mention
- A phased rollout plan replaced the original single "go live" moment, starting with the highest-confidence claim type and expanding only once it was proven stable

# The Result

The revised plan launched nine weeks later than the original ten-week ambition. Eighteen months on, it is still running without a significant incident — an outcome the original plan, built on an outdated understanding of the workflow, would very likely not have achieved.

# The Lesson

A visible early win that breaks in production is more expensive, in cost and in trust, than a slightly later launch that holds. Two weeks spent understanding how work actually happens, before any building begins, is rarely wasted time — it's usually the difference between automation that lasts and automation that has to be quietly unwound.
