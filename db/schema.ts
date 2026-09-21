import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

export const visitors = pgTable(
  "visitors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    anonymousTokenHash: text("anonymous_token_hash").notNull(),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    roleSegment: text("role_segment"),
    locale: text("locale"),
    consentVersion: text("consent_version"),
    resultsUnlockedAt: timestamp("results_unlocked_at", { withTimezone: true })
  },
  (table) => ({
    tokenHashUnique: uniqueIndex("visitors_token_hash_uq").on(table.anonymousTokenHash)
  })
);

export const services = pgTable(
  "services",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    family: text("family").notNull(),
    title: text("title").notNull(),
    promise: text("promise").notNull(),
    summary: text("summary").notNull(),
    technicalMaturity: text("technical_maturity").notNull(),
    productState: text("product_state").notNull(),
    sourceRepo: text("source_repo").notNull(),
    evidence: jsonb("evidence").$type<string[]>().notNull(),
    audiences: jsonb("audiences").$type<string[]>().notNull(),
    knownLimitations: text("known_limitations").notNull(),
    isPublic: boolean("is_public").default(true).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    slugUnique: uniqueIndex("services_slug_uq").on(table.slug)
  })
);

export const ballots = pgTable(
  "ballots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    visitorId: uuid("visitor_id").notNull().references(() => visitors.id, { onDelete: "cascade" }),
    audience: text("audience").notNull(),
    integrityState: text("integrity_state").default("NORMAL").notNull(),
    abuseKey: text("abuse_key"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    visitorUnique: uniqueIndex("ballots_visitor_uq").on(table.visitorId),
    abuseIndex: index("ballots_abuse_idx").on(table.abuseKey, table.createdAt)
  })
);

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ballotId: uuid("ballot_id").notNull().references(() => ballots.id, { onDelete: "cascade" }),
    serviceId: text("service_id").notNull().references(() => services.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    ballotServiceUnique: uniqueIndex("votes_ballot_service_uq").on(table.ballotId, table.serviceId)
  })
);

export const voteFeedback = pgTable("vote_feedback", {
  ballotId: uuid("ballot_id").primaryKey().references(() => ballots.id, { onDelete: "cascade" }),
  interestType: text("interest_type").notNull(),
  useCaseText: text("use_case_text"),
  betaInterest: boolean("beta_interest").default(false).notNull(),
  paymentInterest: boolean("payment_interest").default(false).notNull()
});

export const emailOptIns = pgTable(
  "email_opt_ins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    consentTextVersion: text("consent_text_version").notNull()
  },
  (table) => ({
    emailUnique: uniqueIndex("email_opt_ins_email_uq").on(table.email)
  })
);

export const emailVoteLinks = pgTable("email_vote_links", {
  emailOptInId: uuid("email_opt_in_id").notNull().references(() => emailOptIns.id, { onDelete: "cascade" }),
  visitorId: uuid("visitor_id").notNull().references(() => visitors.id, { onDelete: "cascade" })
});

export const integrityEvents = pgTable("integrity_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  ballotId: uuid("ballot_id").references(() => ballots.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  detail: jsonb("detail").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const integrityDecisions = pgTable("integrity_decisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  ballotId: uuid("ballot_id").notNull().references(() => ballots.id, { onDelete: "cascade" }),
  decision: text("decision").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
