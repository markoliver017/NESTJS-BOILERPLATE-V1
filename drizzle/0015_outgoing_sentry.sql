-- Add column as nullable first
ALTER TABLE "theaters" ADD COLUMN IF NOT EXISTS "tax_rule_id" integer;

-- Backfill existing rows
DO $$
DECLARE
    default_tax_rule_id integer;
BEGIN
    SELECT id INTO default_tax_rule_id FROM tax_rules LIMIT 1;
    IF default_tax_rule_id IS NOT NULL THEN
        UPDATE theaters SET tax_rule_id = default_tax_rule_id WHERE tax_rule_id IS NULL;
    END IF;
END $$;

-- Enforce NOT NULL
ALTER TABLE "theaters" ALTER COLUMN "tax_rule_id" SET NOT NULL;

-- Add FK Constraint
DO $$ BEGIN
 ALTER TABLE "theaters" ADD CONSTRAINT "theaters_tax_rule_id_tax_rules_id_fk" FOREIGN KEY ("tax_rule_id") REFERENCES "public"."tax_rules"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;