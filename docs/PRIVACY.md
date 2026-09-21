# resonArch NEXT — Privacy Design Notes

> This document records the intended technical/privacy design. It is not legal advice and does not by itself establish regulatory compliance.

## Core principle

NEXT should collect only the information needed to measure useful product-interest signals and protect the integrity of the vote.

Public voting does not require an account or email address.

## Data categories

### Anonymous visitor data

Potentially stored:

- random anonymous visitor identifier in hashed/derived form;
- selected audience segment;
- locale;
- first/last seen timestamps;
- consent/version metadata where required.

The raw browser token should not be persisted server-side.

### Vote data

Stored independently from email:

- anonymous visitor reference;
- selected service;
- timestamp;
- eligibility/integrity state.

### Optional qualitative feedback

May include:

- declared interest type;
- short use-case text;
- beta-interest flag;
- payment-interest flag.

Free-text responses must be treated as potentially containing personal data even if the form does not request it.

### Optional email opt-in

Email collection is separate from ballot submission.

The system should store:

- email;
- timestamp;
- verification state where used;
- version of the consent text.

If a user explicitly asks to connect beta/update interest to their ballot, that connection should be a separate record.

## No invasive fingerprinting

v1 should not attempt durable device fingerprinting across browser resets.

The product accepts that determined users may be able to recreate an anonymous identity.

This is preferable to collecting disproportionate tracking data for a product-research vote.

## Network abuse protection

Raw IP addresses should not be retained as a long-lived voting identity merely for convenience.

Preferred concept:

~~~text
network address
+ rotating secret
→ HMAC / temporary abuse key
→ short-window integrity checks
~~~

Before production, define and document:

- exact purpose;
- retention duration;
- rotation period;
- access controls;
- deletion schedule.

## Cookies/session storage

Only technically necessary session state should be used for the anonymous visitor flow unless additional consent-dependent features are intentionally introduced.

The implementation should document which storage mechanism is used and why.

## Results unlock

The anonymous visitor state also records whether a valid ballot has been committed so that community results can be unlocked without creating an account.

## Email communications

If the official instance sends marketing/product-update email to EU users, explicit consent and the appropriate verification/withdrawal process should be implemented.

The ballot itself must continue to work without that consent.

## Data minimization

Do not collect by default:

- real name;
- company;
- phone number;
- exact physical location;
- social profile;
- unnecessary device fingerprint;
- persistent raw IP history.

Additional fields require a concrete product purpose and an updated privacy review.

## Public display

Raw free-text submissions are not automatically public.

Public analytics should use aggregates and avoid exposing identifiable individual behavior.

## Deletion and retention

Production implementation must define explicit retention policies for:

- anonymous visitor records;
- temporary abuse signals;
- raw/eligible votes;
- free-text feedback;
- email opt-ins;
- audit/integrity decisions.

Retention should be purpose-driven rather than indefinite by default.
