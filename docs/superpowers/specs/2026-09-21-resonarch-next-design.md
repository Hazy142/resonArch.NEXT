# resonArch NEXT — Approved Design Specification

**Date:** 2026-09-21  
**Repository:** Hazy142/resonArch.NEXT  
**License:** Apache-2.0  
**Official instance target:** next.resonarch.app

## 1. Product identity

resonArch NEXT is an open-source product-discovery, voting and community-signal platform for resonArch projects, prototypes and upcoming services.

Primary tagline:

> **Help decide what we build next.**

Brand framing:

> **Real tools. Agent-operated. Human-controlled.**

Supporting principle:

> **Every action leaves a receipt.**

## 2. Purpose

NEXT gives the public a way to:

1. understand the resonArch ecosystem through concrete product families;
2. inspect individual technical experiments/services;
3. distinguish proven implementation from prototype, research and vision;
4. select up to three products they most want to see productized;
5. optionally explain why;
6. optionally signal beta and willingness-to-pay interest;
7. see Community Signal only after contributing a valid ballot.

Internally, NEXT converts these signals into evidence for human product-prioritization decisions.

## 3. Audience entry points

The homepage supports four visitor contexts:

- I build software
- I work in engineering
- I create things
- I'm exploring

All products remain discoverable; the context influences featured ordering and later analytics segmentation.

## 4. Product families and v1 catalogue

### Workspaces & Bridges
- Godot Agent Workspace
- Godot Web Build
- Remote Computer Bridge

### Engineering & Knowledge
- Architecture Guard
- CI Failure Investigator
- Private Repo Brain
- Repo Relationship Map

### Proof & Trust
- Evidence Bundle Seal
- NEXUS Verify
- Calculation Receipt

### CAD & Industry
- CAD Agent
- CAD Export API
- Mechanics API
- Bearing Damage Frequencies

### Creator & Media
- DAWMind
- Plugin Vision
- Whisper Subtitle Studio

### Compute & Runtime
- GPU Verification
- Deterministic Replay
- FiberCast

Total initial vote targets: **20**.

## 5. Status contract

Technical maturity:

~~~text
IDEA
PROTOTYPE
WORKING CORE
RESEARCH PILOT
~~~

Product/commercial state:

~~~text
SIGNALING
VALIDATING
BUILDING
BETA
AVAILABLE
~~~

These dimensions must never be collapsed into one misleading status.

## 6. Evidence contract

Each product can expose PROVEN BY evidence such as:

- repository;
- prototype;
- tests/gates;
- deterministic verification;
- deterministic replay;
- physical run;
- real-world usage;
- research evidence.

Only evidence actually supported by the underlying project may be displayed.

Each detail page must distinguish:

~~~text
WHAT IT DOES
WHY IT EXISTS
WHAT ALREADY WORKS
WHAT IS STILL MISSING
WHAT IT COULD BECOME
PROVEN BY
~~~

## 7. Homepage UX

Approved conceptual order:

~~~text
Hero
→ audience selector
→ short resonArch explanation
→ six product families
→ featured experiments
→ maturity/status explanation
→ persistent Top-3 selection
→ ballot review
→ optional feedback
→ Community Signal unlock
→ public roadmap
→ open-source/self-hosting
→ footer
~~~

Community vote counts must not be exposed before a valid vote, even if the visual reference mockup contains example counts.

## 8. Ballot behavior

- No account required.
- Email not required.
- One anonymous visitor selects one to three distinct services.
- More than three active selections are rejected until one is removed.
- Ballot is committed atomically.
- Results unlock only after a successful commit.
- Unlock persists for that anonymous visitor/session.

## 9. Optional intent capture

Structured options may include:

- I'd use it myself
- My team/company could use it
- I'd integrate the API
- I'm mostly curious

Optional additions:

- free-text use case, approximately 500 characters maximum;
- beta-interest flag;
- payment-interest flag.

Payment intent is described as declared intent, never as a customer count or revenue forecast.

## 10. Runtime architecture

v1 target:

~~~text
Next.js / React
+ server-side domain/API layer
+ Drizzle ORM
+ PostgreSQL
+ Docker
+ nginx
+ resonArch-controlled IONOS deployment
~~~

No separate backend microservice is required for v1.

External systems such as Notion, GitHub synchronization, NEXUS receipts or email automation are optional adapters, not mandatory runtime dependencies.

## 11. Core data model

Conceptual tables:

~~~text
visitors
services
votes
vote_feedback
email_opt_ins
email_vote_links
integrity_events
integrity_decisions
~~~

Votes do not contain email addresses.

The public catalogue should initially be source-controlled.

## 12. Anonymous identity

Generate a cryptographically random browser token.

Store only a derived token hash in the database.

Do not use invasive durable device fingerprinting in v1.

Browser reset may allow a new anonymous identity; this is an accepted tradeoff for privacy and low friction.

## 13. Abuse/integrity model

Combine:

- anonymous browser token;
- rate limiting;
- server session;
- temporary network-abuse key;
- basic timing/behavior checks.

Preferred temporary network-abuse concept:

~~~text
IP/network address
+ rotating secret
→ HMAC
→ temporary abuse identifier
~~~

Avoid durable raw-IP history purely for voting.

Integrity states:

~~~text
NORMAL
SUSPICIOUS
EXCLUDED_FROM_PUBLIC_RESULT
~~~

Keep raw evidence and record the eligibility decision instead of destructively deleting suspicious votes.

## 14. Community Signal

Public aggregates are calculated from eligible votes.

After unlock, the visitor may see:

- product ranking;
- eligible vote counts;
- audience breakdown;
- time trend;
- beta-interest signal;
- payment-interest signal;
- personal “you voted for” context.

## 15. Admin dashboard

Primary operator question:

> **What should resonArch productize next, and why?**

Overview metrics:

- valid voters;
- votes cast;
- beta interest;
- payment intent;
- written use cases;
- suspicious/excluded votes.

Admin filters:

~~~text
ALL
SOFTWARE
ENGINEERING
CREATOR
EXPLORING
~~~

## 16. Transparent internal prioritization

An initial, configurable scoring hypothesis may be:

~~~text
1.0 × eligible vote
1.5 × professional/team intent
2.0 × beta interest
3.0 × payment intent
0.5 × meaningful written use case
~~~

This score is an operator aid, not market truth.

Implementation delta and operating cost should be reviewed separately when making product decisions.

NEXT must not reduce the decision to an opaque “AI says build X” output.

## 17. Use-case intelligence

Free-text feedback remains available as original source material.

Optional AI clustering may later surface:

- pain points;
- industries;
- feature requests;
- buying reasons;
- objections.

AI summaries do not replace the underlying user responses.

## 18. Funnel analytics

Per product:

~~~text
viewed
→ detail opened
→ picked
→ ballot submitted
→ beta interest
→ payment intent
→ optional email opt-in
~~~

This allows NEXT to distinguish demand problems from discovery/positioning problems.

## 19. Admin product controls

Operator can edit:

- technical maturity;
- product/commercial state;
- public catalogue metadata;
- private founder notes;
- integrity decisions.

v1 is single-admin. Teams, roles, organizations and SSO are deferred.

## 20. Exports

The operator can export anonymized/research data as:

- CSV
- JSON

Raw and eligible states must remain distinguishable.

## 21. Privacy baseline

Public voting works without name, account or email.

Email is collected only as an optional separate opt-in.

Do not collect by default:

- real name;
- company;
- phone;
- exact location;
- social profiles;
- unnecessary persistent fingerprinting.

A production privacy review must finalize retention windows, cookie/session documentation, abuse-key lifetime and email-consent workflow.

## 22. Open-source model

Source code: **Apache-2.0**.

The resonArch name, logo and associated branding are not granted by the software license.

The official instance's productive vote database, leads and analytics are operational data, not part of the repository.

Desired public positioning:

> **Self-host it. Fork it. Or use the official resonArch instance.**

## 23. Visual direction

Canonical repository reference:

**Codex-Bild 21. Sept. 2026, 21_29_53.png**

Direction:

- dark near-black canvas;
- controlled cyan electric accents;
- thin technical borders;
- restrained glow;
- engineering control room × research lab;
- premium but not generic SaaS;
- product cards presented as technical systems/experiments.

## 24. Deferred work

Not required before initial product validation:

- multi-tenant accounts;
- team RBAC;
- SSO;
- public comments;
- social networking;
- complex CMS;
- full email automation;
- NEXUS-receipted community snapshots;
- separate microservice backend;
- external hosted database dependency;
- opaque AI product-prioritization engine.

## 25. Implementation gate

This document records the product/architecture decisions approved during the design discussion.

Implementation should preserve the boundaries above and treat any material change to voting semantics, privacy model, status semantics or evidence claims as an explicit architecture decision rather than an incidental UI change.
