-- Remove CREATE theater_groups as it exists
-- CREATE TABLE "theater_groups" ...

CREATE TABLE IF NOT EXISTS "theaters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "theaters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"theater_group_id" integer NOT NULL,
    -- tax_rule_id removed for 0015 migration
	"name" varchar(150) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(80) NOT NULL,
	"province" varchar(80),
	"latitude" numeric(9, 6) NOT NULL,
	"longitude" numeric(9, 6) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "theaters" ADD CONSTRAINT "theaters_theater_group_id_theater_groups_id_fk" FOREIGN KEY ("theater_group_id") REFERENCES "public"."theater_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;