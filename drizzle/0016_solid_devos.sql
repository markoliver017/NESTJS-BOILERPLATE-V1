ALTER TABLE "cinemas" DROP CONSTRAINT "cinemas_tax_rule_id_tax_rules_id_fk";
--> statement-breakpoint
ALTER TABLE "cinemas" DROP COLUMN "tax_rule_id";