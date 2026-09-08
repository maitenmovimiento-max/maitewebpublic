import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const guideStatus = pgEnum("guide_status", ["draft", "published", "archived"]);

export const guides = pgTable(
  "guides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    contentHtml: text("content_html").notNull(),
    coverImageUrl: text("cover_image_url"),
    coverImageAlt: text("cover_image_alt"),
    category: text("category").notNull(),
    status: guideStatus("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    readTime: integer("read_time").notNull().default(5),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("guides_status_published_idx").on(table.status, table.publishedAt),
    index("guides_category_idx").on(table.category),
  ],
);

export type Guide = typeof guides.$inferSelect;
export type NewGuide = typeof guides.$inferInsert;
