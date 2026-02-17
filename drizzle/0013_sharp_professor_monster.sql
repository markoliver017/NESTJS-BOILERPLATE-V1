DO $$ BEGIN
 CREATE TYPE "public"."cultural_tax_amount_type" AS ENUM('fixed_amount', 'percentage_of_discounted_price');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TYPE "public"."user_role" ADD VALUE 'user';
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
ALTER TABLE "cinemas" DROP CONSTRAINT IF EXISTS "cinemas_agency_id_agencies_id_fk";
--> statement-breakpoint
ALTER TABLE "cinemas" ALTER COLUMN "name" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "title" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "distributor" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "distributor" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "end_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ticket_types" ALTER COLUMN "name" SET DATA TYPE varchar(80);--> statement-breakpoint
ALTER TABLE "hourly_ticket_entries" ALTER COLUMN "gross_amount" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "hourly_ticket_entries" ALTER COLUMN "tax_amount" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "hourly_ticket_entries" ALTER COLUMN "net_amount" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "cinemas" ADD COLUMN IF NOT EXISTS "theater_id" integer;--> statement-breakpoint
ALTER TABLE "cinemas" ADD COLUMN IF NOT EXISTS "geofence_radius" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "cinemas" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" ADD COLUMN IF NOT EXISTS "production_company_id" integer;--> statement-breakpoint
ALTER TABLE "ticket_types" ADD COLUMN IF NOT EXISTS "discount_pct" numeric(5, 4);--> statement-breakpoint
ALTER TABLE "ticket_types" ADD COLUMN IF NOT EXISTS "cultural_tax_id" integer;--> statement-breakpoint
ALTER TABLE "hourly_ticket_entries" ADD COLUMN IF NOT EXISTS "discount_snapshot" numeric(10, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "hourly_ticket_entries" ADD COLUMN IF NOT EXISTS "cultural_tax_snapshot" numeric(10, 4) DEFAULT '0.0000' NOT NULL;--> statement-breakpoint
ALTER TABLE "hourly_ticket_entries" ADD COLUMN IF NOT EXISTS "effective_price" numeric(10, 2) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cinemas" ADD CONSTRAINT "cinemas_theater_id_theaters_id_fk" FOREIGN KEY ("theater_id") REFERENCES "public"."theaters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movies" ADD CONSTRAINT "movies_production_company_id_movie_production_companies_id_fk" FOREIGN KEY ("production_company_id") REFERENCES "public"."movie_production_companies"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_cultural_tax_id_cultural_taxes_id_fk" FOREIGN KEY ("cultural_tax_id") REFERENCES "public"."cultural_taxes"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
ALTER TABLE "cinemas" DROP COLUMN IF EXISTS "agency_id";--> statement-breakpoint
ALTER TABLE "cinemas" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "cinemas" DROP COLUMN IF EXISTS "latitude";--> statement-breakpoint
ALTER TABLE "cinemas" DROP COLUMN IF EXISTS "longitude";