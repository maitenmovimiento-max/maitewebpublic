CREATE TABLE "guide_slug_redirects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"old_slug" text NOT NULL,
	"guide_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guide_slug_redirects_old_slug_unique" UNIQUE("old_slug")
);
--> statement-breakpoint
ALTER TABLE "guide_slug_redirects" ADD CONSTRAINT "guide_slug_redirects_guide_id_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;