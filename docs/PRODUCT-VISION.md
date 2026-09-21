# resonArch NEXT — Product Vision

## Purpose

resonArch NEXT is the public product-discovery and community-validation layer for the resonArch ecosystem.

It gives visitors a structured way to explore real projects, prototypes and research systems, choose the ideas that matter most to them, explain why, and help determine what should be productized next.

> **Help decide what resonArch builds next.**

NEXT is not a generic corporate homepage, a simple like-counter, or a catalogue that presents every research idea as a finished product.

It exists to separate and connect:

1. what resonArch has already built or proven;
2. what could become a usable product;
3. what real users actually want next.

## Brand principles

- **Real tools. Agent-operated. Human-controlled.**
- **Every action leaves a receipt.**
- Evidence is shown separately from vision.
- Technical maturity is shown separately from commercial/product maturity.
- Community interest is a signal, not proof of product-market fit.
- Humans make the final product decisions.

## Audience contexts

- **I build software**
- **I work in engineering**
- **I create things**
- **I'm exploring**

The selected context influences discovery and analytics segmentation without hiding the rest of the catalogue.

## Product structure

~~~text
Product family
  -> concrete experiment/service
  -> evidence and maturity
  -> community signal
  -> validation
  -> productization
~~~

Families are for navigation. Concrete experiments/services are the actual vote targets.

## Status contract

### Technical maturity

~~~text
IDEA
PROTOTYPE
WORKING CORE
RESEARCH PILOT
~~~

### Product/commercial state

~~~text
SIGNALING
VALIDATING
BUILDING
BETA
AVAILABLE
~~~

These dimensions remain separate. A system can be a WORKING CORE while commercially still only SIGNALING.

## Evidence model

Where applicable, product pages expose a **PROVEN BY** section. Possible evidence types include:

- GitHub repository
- working prototype
- automated tests / acceptance gates
- deterministic verification
- deterministic replay
- physical run
- real-world usage
- research evidence

Only evidence that actually exists for a product should be shown.

## Public experience

~~~text
Hero
-> audience context
-> short resonArch system explanation
-> product families
-> featured experiments
-> maturity/status explanation
-> persistent Top-3 selection
-> vote
-> optional qualitative feedback
-> Community Signal unlock
-> roadmap
-> open-source / self-hosting section
~~~

Vote counts and community rankings stay hidden before the visitor submits a valid vote.

## Voting principle

Visitors choose **up to three** concrete experiments/services. The limit is intentional: NEXT should measure relative priority, not just broad curiosity.

After a valid vote, community results unlock for that anonymous visitor.

## Open-source model

The NEXT source code is licensed under **Apache-2.0**.

Official hosted instance target:

~~~text
next.resonarch.app
~~~

The code may be self-hosted and forked under the license terms. The resonArch name, logos and associated branding are not granted by the software license.

The productive vote database, beta leads, analytics and official resonArch roadmap are operational data of the official instance and are not part of the source-code distribution.

## Non-goals for v1

v1 should not become:

- a general social network;
- a public comment forum;
- a multi-tenant enterprise analytics suite;
- a complex account platform;
- a giant AI-generated prioritization engine;
- an attempt to claim market demand from raw votes alone.

NEXT should remain a focused, evidence-backed product-discovery and validation system.
