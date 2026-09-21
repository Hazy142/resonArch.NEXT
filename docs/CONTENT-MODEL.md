# resonArch NEXT — Content Model

## Principle

NEXT organizes the ecosystem in two layers:

~~~text
Family = discovery context
Experiment/service = actual vote target
~~~

v1 starts with six families and twenty concrete experiments.

The list is a product-discovery catalogue, not a claim that every item is production-ready.

## 1. Workspaces & Bridges

**Leitidee:** Give AI somewhere real to work.

Initial experiments:

1. **Godot Agent Workspace**
2. **Godot Web Build**
3. **Remote Computer Bridge**

## 2. Engineering & Knowledge

**Leitidee:** Give agents the context engineers actually use.

Initial experiments:

4. **Architecture Guard**
5. **CI Failure Investigator**
6. **Private Repo Brain**
7. **Repo Relationship Map**

## 3. Proof & Trust

**Leitidee:** Every action leaves a receipt.

Initial experiments:

8. **Evidence Bundle Seal**
9. **NEXUS Verify**
10. **Calculation Receipt**

## 4. CAD & Industry

**Leitidee:** AI working with real engineering systems.

Initial experiments:

11. **CAD Agent**
12. **CAD Export API**
13. **Mechanics API**
14. **Bearing Damage Frequencies**

## 5. Creator & Media

**Leitidee:** AI inside real creative workflows.

Initial experiments:

15. **DAWMind**
16. **Plugin Vision**
17. **Whisper Subtitle Studio**

## 6. Compute & Runtime

**Leitidee:** Run it on real hardware. Prove what happened.

Initial experiments:

18. **GPU Verification**
19. **Deterministic Replay**
20. **FiberCast**

## Product card schema

Every public experiment should follow the same conceptual schema:

~~~text
id
slug
family
title
one-line promise
short explanation
technical maturity
product state
source project(s)
evidence
repo link(s)
use cases
known limitations
vote eligibility
featured audiences
~~~

## Card presentation

Cards should read like technical experiments/systems, not e-commerce products.

Example:

~~~text
03 / PROOF & TRUST

EVIDENCE BUNDLE SEAL                 WORKING CORE

Turn a pile of evidence files
into one verifiable object.

Built from:
NEXUS

PROVEN BY
● repository
● deterministic verification

Product status:
SIGNALING

[ EXPLORE ]                    [ ↑ PICK ]
~~~

## Detail page contract

Each experiment page should clearly answer:

~~~text
WHAT IT DOES
WHY IT EXISTS
WHAT ALREADY WORKS
WHAT IS STILL MISSING
WHAT IT COULD BECOME
PROVEN BY
~~~

This separation is mandatory. Vision must not be written as if it were already validated implementation.

## Homepage composition

Recommended v1 order:

1. Hero
2. Audience selector
3. Short resonArch system explanation
4. Explore the Lab / family navigation
5. Featured experiments based on audience
6. Maturity/status explanation
7. Persistent Top-3 selection
8. Vote review and optional feedback
9. Community Signal results after unlock
10. Public roadmap
11. Open-source/self-hosting section
12. Footer

## Persistent Top-3 UI

Desktop concept:

~~~text
┌─────────────────────────────┐
│ YOUR SIGNAL              2/3│
│                             │
│ ↑ Architecture Guard       │
│ ↑ Godot Agent Workspace    │
│                             │
│ One pick remaining         │
│                             │
│ [ CAST VOTE → ]            │
└─────────────────────────────┘
~~~

Mobile concept:

~~~text
↑ 2 / 3 selected              Review →
~~~

## Community results

Results are not shown before voting.

After unlock they may show:

- ranking and eligible vote counts;
- selected audience/segment breakdown;
- time filters/trends;
- “You voted for…” context;
- beta-interest signal;
- payment-interest signal;
- curiosity/professional-use signal.

## Public roadmap

The public productization path is:

~~~text
SIGNALING → VALIDATING → BUILDING → BETA → AVAILABLE
~~~

A simple explanatory flow can also be shown:

~~~text
1 Community votes
2 We validate
3 We build
4 You get early access
~~~

## Visual direction

The canonical visual reference currently stored in the repository is:

**Codex-Bild 21. Sept. 2026, 21_29_53.png**

Target qualities:

- near-black technical canvas;
- restrained cyan/electric accents;
- thin borders and controlled glow;
- research-lab × engineering-control-room feel;
- premium but not generic SaaS;
- product cards feel like experiments/technical systems;
- no pricing-grid-first aesthetic;
- no stock-illustration look.

Important correction for implementation: the visual reference contains example vote counts on cards, but **v1 must hide counts before the visitor submits a valid vote**.
