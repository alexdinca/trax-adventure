/**
 * The schema as executable DDL, bundled rather than read from disk.
 *
 * Vercel marks integration-created variables (DATABASE_URL among them) as
 * sensitive, so the connection string cannot be pulled to a laptop. The tables
 * therefore get created from inside the deployment, where the variable exists.
 * These statements are the generated migration, made idempotent so running the
 * route twice is harmless.
 *
 * Keep in step with lib/app/db/schema.ts. It is the source of truth.
 */
export const BOOTSTRAP_SQL: string[] = [
  `CREATE TABLE IF NOT EXISTS "riders" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" text NOT NULL,
     "phone" text,
     "rung" text DEFAULT 'Collective' NOT NULL,
     "created_at" timestamp with time zone DEFAULT now() NOT NULL
   )`,

  `CREATE TABLE IF NOT EXISTS "experiences" (
     "id" serial PRIMARY KEY NOT NULL,
     "slug" text NOT NULL,
     "name" text NOT NULL,
     "year" integer NOT NULL,
     "finished_at" timestamp with time zone NOT NULL,
     CONSTRAINT "experiences_slug_unique" UNIQUE("slug")
   )`,

  `CREATE TABLE IF NOT EXISTS "aftermath_lines" (
     "id" serial PRIMARY KEY NOT NULL,
     "rider_id" integer NOT NULL,
     "experience_id" integer NOT NULL,
     "took" text DEFAULT '' NOT NULL,
     "gave" text DEFAULT '' NOT NULL,
     "may_publish" boolean DEFAULT false NOT NULL,
     "selected" boolean DEFAULT false NOT NULL,
     "submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
     "updated_at" timestamp with time zone DEFAULT now() NOT NULL
   )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS "aftermath_one_each"
     ON "aftermath_lines" ("rider_id","experience_id")`,

  `DO $$ BEGIN
     ALTER TABLE "aftermath_lines"
       ADD CONSTRAINT "aftermath_lines_rider_id_riders_id_fk"
       FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
     ALTER TABLE "aftermath_lines"
       ADD CONSTRAINT "aftermath_lines_experience_id_experiences_id_fk"
       FOREIGN KEY ("experience_id") REFERENCES "experiences"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  // ── Added after the first release ────────────────────────────────────────

  `ALTER TABLE "experiences"
     ADD COLUMN IF NOT EXISTS "auto_expire" boolean DEFAULT true NOT NULL`,

  `ALTER TABLE "experiences" ADD COLUMN IF NOT EXISTS "note_slug" text`,

  `CREATE TABLE IF NOT EXISTS "participations" (
     "id" serial PRIMARY KEY NOT NULL,
     "rider_id" integer NOT NULL,
     "experience_id" integer NOT NULL,
     "created_at" timestamp with time zone DEFAULT now() NOT NULL
   )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS "participation_once"
     ON "participations" ("rider_id","experience_id")`,

  `DO $$ BEGIN
     ALTER TABLE "participations"
       ADD CONSTRAINT "participations_rider_id_riders_id_fk"
       FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
     ALTER TABLE "participations"
       ADD CONSTRAINT "participations_experience_id_experiences_id_fk"
       FOREIGN KEY ("experience_id") REFERENCES "experiences"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  // ── Phase 3: the Record ──────────────────────────────────────────────────

  `CREATE TABLE IF NOT EXISTS "completions" (
     "id" serial PRIMARY KEY NOT NULL,
     "rider_id" integer NOT NULL,
     "experience_id" integer NOT NULL,
     "completed_at" timestamp with time zone NOT NULL,
     "created_at" timestamp with time zone DEFAULT now() NOT NULL
   )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS "completion_once"
     ON "completions" ("rider_id","experience_id")`,

  `DO $$ BEGIN
     ALTER TABLE "completions"
       ADD CONSTRAINT "completions_rider_id_riders_id_fk"
       FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
     ALTER TABLE "completions"
       ADD CONSTRAINT "completions_experience_id_experiences_id_fk"
       FOREIGN KEY ("experience_id") REFERENCES "experiences"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  // The serial is the key: the object in the world is the record, and the row
  // describes it. rider_id clears rather than cascades, so a rider erasing
  // themselves never deletes an object whose provenance is public.
  `CREATE TABLE IF NOT EXISTS "artifacts" (
     "serial" text PRIMARY KEY NOT NULL,
     "rider_id" integer,
     "experience_id" integer,
     "tier" text DEFAULT 'Rider' NOT NULL,
     "year" integer NOT NULL,
     "issued_at" timestamp with time zone NOT NULL,
     "status" text DEFAULT 'held' NOT NULL,
     "handed_by" text,
     "photo" text,
     "created_at" timestamp with time zone DEFAULT now() NOT NULL
   )`,

  `CREATE INDEX IF NOT EXISTS "artifact_by_rider" ON "artifacts" ("rider_id")`,

  `DO $$ BEGIN
     ALTER TABLE "artifacts"
       ADD CONSTRAINT "artifacts_rider_id_riders_id_fk"
       FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE set null;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `DO $$ BEGIN
     ALTER TABLE "artifacts"
       ADD CONSTRAINT "artifacts_experience_id_experiences_id_fk"
       FOREIGN KEY ("experience_id") REFERENCES "experiences"("id") ON DELETE set null;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  // A dated entry holding nothing, by design (LG-07). No description column:
  // giving it one would defeat the only thing the row is for.
  `CREATE TABLE IF NOT EXISTS "blanks" (
     "id" serial PRIMARY KEY NOT NULL,
     "rider_id" integer NOT NULL,
     "occurred_at" timestamp with time zone NOT NULL,
     "created_at" timestamp with time zone DEFAULT now() NOT NULL
   )`,

  `DO $$ BEGIN
     ALTER TABLE "blanks"
       ADD CONSTRAINT "blanks_rider_id_riders_id_fk"
       FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  `CREATE TABLE IF NOT EXISTS "invites" (
     "jti" text PRIMARY KEY NOT NULL,
     "rider_id" integer NOT NULL,
     "purpose" text DEFAULT 'bind' NOT NULL,
     "expires_at" timestamp with time zone NOT NULL,
     "redeemed_at" timestamp with time zone,
     "created_at" timestamp with time zone DEFAULT now() NOT NULL
   )`,

  `CREATE INDEX IF NOT EXISTS "invite_by_rider" ON "invites" ("rider_id")`,

  `DO $$ BEGIN
     ALTER TABLE "invites"
       ADD CONSTRAINT "invites_rider_id_riders_id_fk"
       FOREIGN KEY ("rider_id") REFERENCES "riders"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
];
