CREATE TABLE "audit_trails" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "audit_trails_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"controller" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"is_error" boolean DEFAULT false,
	"details" text,
	"ip_address" varchar(255),
	"user_agent" varchar(255),
	"stack_trace" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "audit_trails" ADD CONSTRAINT "audit_trails_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;