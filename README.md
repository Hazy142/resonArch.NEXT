# resonArch.NEXT

Open-source product discovery, voting and community-signal platform for resonArch projects, prototypes and upcoming services.

> **Help decide what resonArch builds next.**

**Real tools. Agent-operated. Human-controlled.**

resonArch NEXT makes the difference between **proven implementation**, **prototype/research**, and **future product vision** visible — while letting the community signal which concrete services should be productized next.

## Current phase

**v1 is implemented on `main` and gated by CI.**

Implemented surfaces:

- public Next.js/React Product Lab
- audience selector
- 6 product families / 20 bounded vote targets
- technical maturity and commercial state shown separately
- evidence badges with explicit limitations
- persistent Top-3 picker
- anonymous ballot flow without accounts
- Community Signal locked until a valid ballot is committed
- PostgreSQL / Drizzle persistence
- rotating HMAC-based abuse key and integrity states
- optional qualitative feedback, beta interest and payment intent
- optional email opt-in stored separately from ballots
- protected single-admin analytics dashboard
- transparent Decision Score
- product-status controls
- manual integrity review with auditable restore/exclude decisions
- CSV / JSON exports
- Docker Compose + nginx deployment
- database migration, tests, typecheck and production-build gates

## Quick start

### Docker Compose

~~~bash
cp .env.example .env
# Set strong values for ADMIN_PASSWORD, ADMIN_SESSION_SECRET,
# ABUSE_SECRET and POSTGRES_PASSWORD.

docker compose up --build
~~~

The Compose stack publishes **both** the Next app directly and the nginx proxy so local debugging is unambiguous:

~~~text
http://localhost:3000        # Next.js directly
http://localhost:8080        # nginx -> Next.js
~~~

Ports can be changed with:

~~~text
NEXT_APP_PORT=3000
NEXT_HTTP_PORT=8080
~~~

Admin through nginx:

~~~text
http://localhost:8080/admin
~~~

Health checks:

~~~text
http://localhost:3000/api/health
http://localhost:8080/api/health
~~~

If `localhost:3000` works but `localhost:8080` does not, the application is healthy and the problem is isolated to the proxy/published nginx path.

### Local Node development

Requirements:

- Node.js 22
- PostgreSQL 16 or compatible

~~~bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run dev
~~~

## Build gates

~~~bash
npm run db:migrate
npm run typecheck
npm test
npm run build
~~~

GitHub Actions runs the same migration/typecheck/test/build path against PostgreSQL.

## Runtime architecture

~~~text
Browser
  ↓
Next.js / React
  ↓
server-side API + domain rules
  ↓
Drizzle ORM
  ↓
PostgreSQL
~~~

Self-hosted deployment:

~~~text
Internet
  ↓
nginx
  ↓
NEXT app
  ↓
PostgreSQL
~~~

## Voting contract

- no account required
- email not required
- one anonymous ballot per browser identity
- 1–3 distinct services per ballot
- results remain hidden before a valid vote
- raw suspicious ballots are retained
- public aggregates use eligible ballots
- operator integrity decisions are auditable

The system intentionally does **not** use durable invasive device fingerprinting.

## Product catalogue

NEXT v1 contains six families:

1. Workspaces & Bridges
2. Engineering & Knowledge
3. Proof & Trust
4. CAD & Industry
5. Creator & Media
6. Compute & Runtime

The source-controlled catalogue contains 20 concrete vote targets. Runtime admin overrides can change technical maturity and product/commercial state without rewriting the source catalogue.

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

## Evidence contract

Each product page explicitly separates:

~~~text
WHAT IT DOES
WHY IT EXISTS
WHAT ALREADY WORKS
WHAT IS STILL MISSING
PROVEN BY
~~~

NEXT must not turn product vision into an implementation claim.

## Email note

The v1 opt-in endpoint stores explicit consent separately from anonymous ballots and reports that verification is required.

**An outbound email provider / double-opt-in delivery transport is intentionally not configured yet.** Add that before using the official instance for production marketing email.

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

The implementation preserves the required correction to that mockup: **vote counts remain hidden until the visitor submits a valid ballot.**

## License and branding

The source code is licensed under **Apache-2.0**.

The resonArch name, logos and associated branding are not granted under this license.
