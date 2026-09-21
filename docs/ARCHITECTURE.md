# resonArch NEXT — Architecture

## v1 architecture decision

NEXT v1 stays deliberately compact:

~~~text
Browser
  ↓
Next.js / React
  ↓
server-side domain + API layer
  ↓
Drizzle ORM
  ↓
PostgreSQL on resonArch-controlled IONOS infrastructure
~~~

Deployment:

~~~text
Docker
  ↓
nginx / reverse proxy
  ↓
NEXT application
  ↓
PostgreSQL
~~~

The first version does **not** require a separate backend microservice.

## Why this shape

The product needs:

- server-rendered/public pages with good discoverability;
- anonymous sessions;
- transactional voting;
- privacy-aware abuse protection;
- protected community-result access;
- an authenticated admin area;
- simple Docker deployment on the existing IONOS stack.

A single full-stack application keeps deployment and authentication surfaces small while retaining clean internal boundaries that can later be extracted.

## Runtime layers

~~~text
UI / routes
  ↓
application services
  ↓
domain rules
  ↓
repositories / persistence
  ↓
PostgreSQL
~~~

Business rules such as maximum vote count, result unlocking and eligibility decisions must live in the domain/service layer rather than only in UI code.

## Initial persistence model

Core tables:

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

### visitors

Suggested fields:

~~~text
id
anonymous_token_hash
first_seen_at
last_seen_at
role_segment
locale
consent_version
~~~

The raw anonymous browser token is not stored.

### services

Suggested fields:

~~~text
id
slug
family
title
summary
technical_maturity
product_state
evidence_metadata
repo_url
is_public
sort_weight
~~~

The public catalogue should initially be source-controlled data, not a mandatory dependency on Notion or another external CMS.

### votes

Suggested fields:

~~~text
id
visitor_id
service_id
created_at
eligibility_state
~~~

A uniqueness constraint should prevent duplicate votes for the same visitor/service pair.

### vote_feedback

Suggested fields:

~~~text
ballot_id or vote_id
interest_type
use_case_text
beta_interest
payment_interest
~~~

### email_opt_ins

Email is optional and logically separate from the anonymous ballot.

Suggested fields:

~~~text
id
email
created_at
verified_at
consent_text_version
~~~

### email_vote_links

If a visitor explicitly chooses to connect beta/update interest with their vote, the link is stored separately.

## Voting transaction

A valid submission is atomic:

~~~text
BEGIN

validate visitor
validate selected service ids
validate services are public
validate no duplicates
validate total selection <= 3
write votes
write optional feedback

COMMIT
~~~

Only after the transaction commits does the API return that community results are unlocked.

## Community result access

Pre-vote:

~~~text
Community Signal: locked
~~~

Post-vote:

~~~text
Community Signal: unlocked for this anonymous visitor
~~~

The result endpoint validates anonymous visitor/session state server-side. This is primarily a research-bias and UX boundary, not a high-security secret system.

## Illustrative API boundaries

~~~text
GET  /api/catalog
POST /api/session
POST /api/vote
GET  /api/community-signal
POST /api/opt-in

GET  /api/admin/overview
GET  /api/admin/products/:slug
GET  /api/admin/integrity
GET  /api/admin/export
~~~

Exact routing may change during implementation, but the domain boundaries should remain.

## Admin boundary

The public site requires no user account.

~~~text
/admin
  ↓
server-side authentication
  ↓
admin session
  ↓
analytics / product controls
~~~

v1 only needs a single operator account. Team roles and SSO are explicitly deferred.

## Future adapters

The architecture leaves room for, but does not require in v1:

- GitHub metadata synchronization;
- NEXUS evidence receipts;
- email/beta campaign delivery;
- richer product analytics;
- public API access;
- PLEXUS / Nether Bridge project context;
- deterministic aggregate snapshots.

These should be adapters around the core domain, not required dependencies of the initial application.
