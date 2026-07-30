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
];
