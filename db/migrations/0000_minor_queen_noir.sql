CREATE TYPE "public"."guide_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "guides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content_html" text NOT NULL,
	"cover_image_url" text,
	"cover_image_alt" text,
	"category" text NOT NULL,
	"status" "guide_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"read_time" integer DEFAULT 5 NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guides_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "guides_status_published_idx" ON "guides" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "guides_category_idx" ON "guides" USING btree ("category");