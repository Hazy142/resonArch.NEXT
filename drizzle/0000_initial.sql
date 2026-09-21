CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visitors" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "anonymous_token_hash" text NOT NULL,
  "first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
  "last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
  "role_segment" text,
  "locale" text,
  "consent_version" text,
  "results_unlocked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "visitors_token_hash_uq" ON "visitors" ("anonymous_token_hash");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "family" text NOT NULL,
  "title" text NOT NULL,
  "promise" text NOT NULL,
  "summary" text NOT NULL,
  "technical_maturity" text NOT NULL,
  "product_state" text NOT NULL,
  "source_repo" text NOT NULL,
  "evidence" jsonb NOT NULL,
  "audiences" jsonb NOT NULL,
  "known_limitations" text NOT NULL,
  "is_public" boolean DEFAULT true NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "services_slug_uq" ON "services" ("slug");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ballots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "visitor_id" uuid NOT NULL REFERENCES "visitors"("id") ON DELETE cascade,
  "audience" text NOT NULL,
  "integrity_state" text DEFAULT 'NORMAL' NOT NULL,
  "abuse_key" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ballots_visitor_uq" ON "ballots" ("visitor_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ballots_abuse_idx" ON "ballots" ("abuse_key", "created_at");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "votes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "ballot_id" uuid NOT NULL REFERENCES "ballots"("id") ON DELETE cascade,
  "service_id" text NOT NULL REFERENCES "services"("id") ON DELETE restrict,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "votes_ballot_service_uq" ON "votes" ("ballot_id", "service_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vote_feedback" (
  "ballot_id" uuid PRIMARY KEY NOT NULL REFERENCES "ballots"("id") ON DELETE cascade,
  "interest_type" text NOT NULL,
  "use_case_text" text,
  "beta_interest" boolean DEFAULT false NOT NULL,
  "payment_interest" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_opt_ins" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "verified_at" timestamp with time zone,
  "consent_text_version" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_opt_ins_email_uq" ON "email_opt_ins" ("email");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_vote_links" (
  "email_opt_in_id" uuid NOT NULL REFERENCES "email_opt_ins"("id") ON DELETE cascade,
  "visitor_id" uuid NOT NULL REFERENCES "visitors"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integrity_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "ballot_id" uuid REFERENCES "ballots"("id") ON DELETE cascade,
  "event_type" text NOT NULL,
  "detail" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integrity_decisions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "ballot_id" uuid NOT NULL REFERENCES "ballots"("id") ON DELETE cascade,
  "decision" text NOT NULL,
  "reason" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
