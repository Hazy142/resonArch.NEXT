# resonArch.NEXT

Open-source product discovery, voting and community-signal platform for resonArch projects, prototypes and upcoming services.

> **Help decide what resonArch builds next.**

**Real tools. Agent-operated. Human-controlled.**

resonArch NEXT is designed to make the difference between **proven implementation**, **prototype/research**, and **future product vision** visible — while letting the community signal which concrete services should be productized next.

## Current phase

Design specification approved and recorded. Implementation has not started yet.

## Core decisions

- Apache-2.0 source license
- official instance target: next.resonarch.app
- Next.js / React
- PostgreSQL on resonArch-controlled IONOS infrastructure
- anonymous voting without accounts
- up to 3 product picks per visitor
- community results hidden until a valid ballot is submitted
- optional beta / payment-intent feedback
- optional email opt-in stored separately from votes
- transparent integrity filtering instead of invasive fingerprinting
- technical maturity separated from product/commercial state
- 6 product families / 20 initial vote targets
- single-admin analytics dashboard for v1

## Documentation

- [Product Vision](docs/PRODUCT-VISION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Voting and Integrity](docs/VOTING-AND-INTEGRITY.md)
- [Content Model](docs/CONTENT-MODEL.md)
- [Admin and Analytics](docs/ADMIN-ANALYTICS.md)
- [Privacy Design Notes](docs/PRIVACY.md)
- [Approved Design Specification](docs/superpowers/specs/2026-09-21-resonarch-next-design.md)

## Visual reference

The repository root contains the approved screenshot-style design reference:

**Codex-Bild 21. Sept. 2026, 21_29_53.png**

Implementation must preserve one important correction to that mockup: **vote counts remain hidden until the visitor has submitted a valid ballot.**

## Status vocabulary

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

These are intentionally separate.

## License and branding

The source code is licensed under **Apache-2.0**.

The resonArch name, logos and associated branding are not granted under this license.
