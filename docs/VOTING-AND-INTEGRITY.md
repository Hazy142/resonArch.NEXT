# resonArch NEXT — Voting and Integrity

## Goal

NEXT needs voting that is:

- anonymous by default;
- extremely low friction;
- difficult to spam casually;
- privacy-conscious;
- auditable enough to explain how public rankings were derived.

It does **not** need election-grade identity proof. The system measures product-interest signals.

## Ballot model

A visitor may choose **one to three distinct services**.

~~~text
visitor
  ├─ Architecture Guard
  ├─ Godot Agent Workspace
  └─ Evidence Bundle Seal
~~~

A fourth active selection is rejected until another is removed.

## Anonymous visitor token

On first use, generate a cryptographically random token, e.g. 256 bits.

The browser receives the token through a secure session mechanism. The database stores only a derived hash.

~~~text
random browser token
      ↓
    SHA-256
      ↓
anonymous_token_hash
~~~

If the visitor deliberately clears browser state, they may be able to create a new identity. v1 accepts this limitation rather than deploying invasive fingerprinting.

## Results unlock

Community counts and rankings are hidden before voting.

~~~text
before valid ballot:
Community Signal locked

after committed ballot:
Community Signal unlocked
~~~

The unlock persists for that anonymous visitor/session.

This reduces herd effects and asks visitors to contribute their own signal before seeing the aggregate.

## Optional qualitative signal

### What makes this interesting?

Suggested options:

- I'd use it myself
- My team/company could use it
- I'd integrate the API
- I'm mostly curious

### What would you use it for?

Free text, capped at approximately 500 characters.

### Additional intent

- I'd like to test an early version
- I'd consider paying for this if it works

These are declared intent signals, not customer or revenue counts.

## Email is separate

A valid vote never requires an email address.

~~~text
anonymous ballot
      │
      └──── optional explicit opt-in ──── email record
~~~

Email must not be stored directly in the vote row.

For marketing/update use in the EU, implementation should support appropriate explicit consent and, where used, double opt-in.

## Abuse protection

NEXT combines several weak signals rather than one invasive identity mechanism:

~~~text
anonymous browser token
        +
request rate limits
        +
server-side session
        +
ephemeral network abuse key
        +
basic timing/behavior checks
~~~

### Ephemeral network abuse key

Do not retain raw IP addresses as a durable visitor history merely for voting.

Preferred approach:

~~~text
IP address
+
rotating server secret
↓
HMAC
↓
temporary abuse key
~~~

Rotation prevents the value from becoming a long-lived cross-day identifier while still allowing short-window abuse detection.

Retention duration and exact implementation require privacy/security review before production.

## Suggested rate-limit intent

~~~text
per anonymous visitor:
max 3 distinct accepted service votes

per temporary abuse key:
limit rapid creation of many visitor identities

per session:
reasonable request burst limits
~~~

Exact numbers should be tested rather than treated as fixed product truth.

## Eligibility state

Suspicious activity should not require destructive deletion.

~~~text
NORMAL
SUSPICIOUS
EXCLUDED_FROM_PUBLIC_RESULT
~~~

The raw event remains while the aggregation decides whether the signal is eligible.

~~~text
raw event
→ integrity decision
→ eligible vote set
→ public aggregate
~~~

## Public aggregates

Community rankings are built from **eligible votes**, not blindly from raw database rows.

Public results may include:

- eligible vote count;
- audience breakdown;
- beta-interest count;
- payment-interest count;
- time trend.

Language must remain accurate. Example:

> 17 visitors indicated willingness to pay.

not:

> 17 customers.

## Free-text handling

User-submitted free text:

- is length-limited;
- is sanitized/escaped on output;
- is not automatically published;
- remains internal by default.

If NEXT later publishes community use cases, separate consent/moderation should be added.

## Integrity review

The admin UI exposes suspicious clusters with enough context to review and restore/exclude them manually.

~~~text
Cluster #31
17 anonymous identities
same temporary abuse key
4 minute window
same product combination

[inspect]
[keep excluded]
[restore]
~~~

No destructive auto-delete is required for v1.

## Future evidence integration

A later NEXUS integration could produce hashed/receipted snapshots describing a public ranking at a point in time.

This is explicitly optional after v1.
