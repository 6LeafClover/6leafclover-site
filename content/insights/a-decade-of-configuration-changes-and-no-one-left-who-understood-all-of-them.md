---
title: A decade of configuration changes, and no one left who understood all of them.
seo_title: A decade of configuration changes, and no one left who understood all of them.
description: Changes, changes, changes...
category: objectif-lune
date: 2026-08-04T09:53:00.000+01:00
summary: "An illustrative case study on a challenge that grows quietly over
  years: a mature Objectif Lune estate that has become too complex for anyone
  currently on staff to fully explain."
---
## The situation

Millbrook Communications (names have been changed etc..) had run Objectif Lune successfully for over a decade. Successfully but also cumulatively — workflows had been added, adjusted and layered on by a succession of administrators over the years, several of whom had since left the business. When a platform upgrade became necessary, the team responsible for it found they couldn't confidently predict what the upgrade might affect, because nobody fully understood everything currently running.

## The audit before the upgrade

Rather than attempting the migration directly against an undocumented estate, we ran a structured configuration audit first:

- **Full workflow inventory** — cataloguing every configured workflow, connector and output process currently in the system
- **Usage tracing** — checking actual recent activity against each workflow to establish which were genuinely still in use, versus quietly present but dormant
- **Provenance investigation**, where possible, into why certain older or unusual configurations existed, to distinguish deliberate design decisions from accumulated workarounds nobody had ever cleaned up

## What the audit found

Of the full workflow inventory, close to a third turned out to be entirely redundant — built years earlier to solve a problem that no longer existed, quietly still running, consuming processing resource and adding complexity to every subsequent change, without producing anything anyone still needed.

## The migration

With a clear, validated picture of what genuinely needed to move, the migration itself was considerably simpler than originally scoped, because a third of the estate never needed migrating at all. It was decommissioned in place. The remaining workflows were migrated with a full understanding of their purpose and dependencies, and the upgrade went live with zero unplanned downtime.

## The lesson

A mature platform estate accumulates complexity the way any long-running system does — gradually, reasonably, one small addition at a time, until nobody can see the whole picture anymore. Before migrating or upgrading a legacy estate, the more valuable question often isn't "how do we move this safely?" but "does everything we're about to move still need to exist?"
