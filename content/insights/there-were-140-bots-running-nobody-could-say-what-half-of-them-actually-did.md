---
title: There Were 140 Bots Running. Nobody Could Say What Half of Them Actually Did.
seo_title: There Were 140 Bots Running. Nobody Could Say What Half of Them Actually Did.
description: Its a Bot Alert!
category: process-automation
date: 2026-09-23T11:56:00.000+01:00
summary: A case study on a problem that develops quietly, over years, in almost
  any organisation that adopts RPA enthusiastically and governs it loosely.
---
# How It Got There

Underground Financial had encouraged RPA adoption across multiple teams over several years, with genuinely good intentions — reducing the burden of manual, repetitive work wherever a team identified the opportunity. What it hadn't built was a central register, consistent development standards, or a single point of ownership for the automation estate as a whole.

By the time anyone conducted a full audit, 140 bots were running in production. Roughly half had no clearly documented owner. Several were found to be automating processes that had since changed — the underlying manual workflow had moved on, but nobody had updated, or in some cases even remembered, the bot quietly still running the old version underneath it.

# The Rationalisation

We ran a structured, three-stage review of the entire bot estate:

- **Discovery and cataloguing** — identifying every bot in production, what it was supposed to do, and who, if anyone, currently owned it
- **Validation** — checking what each bot actually did today against its original documented purpose, surfacing the ones quietly automating processes that no longer matched reality
- **Decision** — for every bot, a clear call: retain under new governance, retire, or rebuild against the current process

# The Outcome

Sixty of the 140 bots were decommissioned, either because they duplicated processes that had changed or because nobody could establish they were still needed. The remaining eighty were brought under a single governance framework — a named owner, defined monitoring, and a change-control process requiring any future modification to the underlying process to trigger a review of the bot built on top of it.

Support incidents linked to automation failures fell by roughly 70% within the following quarter.

# The Lesson

RPA sprawl rarely announces itself. Each individual bot, built to solve a real local problem, looks like progress at the time. It's only when someone tries to count the whole estate — what's running, why, and who's accountable for it — that the true cost of ungoverned growth becomes visible. A periodic audit is far cheaper than the incident that eventually forces one.
