# resonArch NEXT — Admin and Analytics

## Primary question

The admin area is designed around one operational question:

> **What should resonArch productize next, and why?**

The dashboard exposes the evidence behind a prioritization decision rather than returning one opaque AI recommendation.

## Overview

Headline metrics:

~~~text
Total valid voters
Votes cast
Beta interest
Payment intent
Written use cases
Suspicious votes excluded
~~~

The admin interface distinguishes raw signals from eligible public signals.

## Overall signal

Per product, compare at minimum:

~~~text
Product
Eligible votes
Professional/team intent
Beta interest
Payment intent
Written use cases
Trend
~~~

Raw popularity alone is insufficient.

## Internal Decision Score

NEXT may calculate a transparent internal score to help sort opportunities.

Initial **hypothesis**, not immutable product truth:

~~~text
Decision Score =
  1.0 × valid vote
+ 1.5 × professional/team intent
+ 2.0 × beta interest
+ 3.0 × payment intent
+ 0.5 × meaningful written use case
~~~

The formula must:

- remain visible to the operator;
- remain configurable;
- never be presented as a market valuation;
- never replace human judgment.

Implementation delta and operating cost should be reviewed separately from popularity.

## Audience segmentation

Global filters:

~~~text
ALL
SOFTWARE
ENGINEERING
CREATOR
EXPLORING
~~~

Changing the audience filter recalculates rankings and supporting metrics.

This helps distinguish a broadly interesting product from one with a strong signal in a commercially relevant niche.

## Use-case intelligence

Written responses are a first-class research artifact.

~~~text
original answers
→ searchable corpus
→ optional clustering
→ recurring themes
~~~

A later LLM layer may extract:

- pain points;
- requested features;
- industries;
- buying reasons;
- objections.

The original text remains available. An AI summary must never become the only representation of the evidence.

## Funnel

Per product:

~~~text
viewed
→ opened detail
→ picked
→ submitted ballot
→ beta interest
→ payment intent
→ optional email opt-in
~~~

This allows product-signal interpretation to distinguish weak demand from weak discovery/positioning.

Examples:

- high views + low pick rate may indicate weak relevance or unclear positioning;
- low views + high pick rate may indicate a discovery problem;
- strong payment intent with fewer votes may still justify validation.

## Product analytics page

Each experiment gets a private detail view including:

~~~text
technical maturity
product state
eligible votes
professional intent
beta interest
payment interest
audience breakdown
top use-case themes
trend
related experiments
founder/operator notes
~~~

## Founder/operator notes

Private notes can capture:

- missing implementation work;
- expected deployment cost;
- pricing experiments;
- dependencies;
- likely next validation step.

These notes are not automatically public.

## Product-state control

The admin UI controls public status transitions.

~~~text
Technical maturity:
[ WORKING CORE ▼ ]

Commercial state:
[ SIGNALING ▼ ]
~~~

State transitions may later trigger beta/update workflows, but notifications are not required for initial v1.

## Integrity review

A dedicated view shows suspicious/excluded signal clusters.

The operator can:

- inspect;
- keep excluded;
- restore.

Integrity actions should be auditable.

## Exports

The operator must be able to export research data rather than being trapped in the dashboard.

v1 target formats:

- CSV
- JSON

Exports should include appropriate anonymization and distinguish raw/eligible states.

## Admin authentication

v1 requires only one operator.

~~~text
/admin
  ↓
secure server-side authentication
  ↓
single-admin session
~~~

Exact mechanism (strong password, passkey or magic link) is an implementation decision to finalize before production deployment.

Do not build team roles, organizations or SSO in v1.

## Human control

NEXT should not end in:

> AI says build X.

Instead it should surface:

~~~text
community interest
professional relevance
beta willingness
payment intent
recurring use cases
trend
integrity quality
implementation context
~~~

The operator makes the product decision.

> **Human-controlled. Evidence-backed.**
