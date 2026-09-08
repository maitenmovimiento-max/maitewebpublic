import { and, desc, eq } from "drizzle-orm";
import { guides, type Guide } from "@/db/schema";
import { getDb } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import type { GuideInput } from "@/lib/guide-schema";
import { sampleGuides } from "@/lib/sample-guides";
import { sanitizeGuideHtml } from "@/lib/sanitize";

const allowDemoData = process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_DATA === "true";

export async function listPublishedGuides(): Promise<Guide[]> {
  if (!isDatabaseConfigured) return allowDemoData ? sampleGuides : [];
  return getDb().select().from(guides)
    .where(eq(guides.status, "published"))
    .orderBy(desc(guides.featured), desc(guides.publishedAt));
}

export async function listFeaturedGuides(limit = 3): Promise<Guide[]> {
  const items = await listPublishedGuides();
  return items.filter((guide) => guide.featured).slice(0, limit);
}

export async function getPublishedGuide(slug: string): Promise<Guide | null> {
  if (!isDatabaseConfigured) {
    return allowDemoData ? sampleGuides.find((guide) => guide.slug === slug) ?? null : null;
  }
  const [guide] = await getDb().select().from(guides)
    .where(and(eq(guides.slug, slug), eq(guides.status, "published")))
    .limit(1);
  return guide ?? null;
}

export async function listAllGuides(): Promise<Guide[]> {
  if (!isDatabaseConfigured) return allowDemoData ? sampleGuides : [];
  return getDb().select().from(guides).orderBy(desc(guides.updatedAt));
}

export async function createGuide(input: GuideInput): Promise<Guide> {
  const [guide] = await getDb().insert(guides).values({
    ...normalizeInput(input),
    publishedAt: input.status === "published" ? new Date() : null,
  }).returning();
  return guide;
}

export async function updateGuide(id: string, input: GuideInput): Promise<Guide | null> {
  const current = await getDb().select().from(guides).where(eq(guides.id, id)).limit(1);
  if (!current[0]) return null;

  const [guide] = await getDb().update(guides).set({
    ...normalizeInput(input),
    publishedAt: input.status === "published" ? current[0].publishedAt ?? new Date() : null,
    updatedAt: new Date(),
  }).where(eq(guides.id, id)).returning();
  return guide ?? null;
}

export async function deleteGuide(id: string): Promise<boolean> {
  const deleted = await getDb().delete(guides).where(eq(guides.id, id)).returning({ id: guides.id });
  return deleted.length > 0;
}

function normalizeInput(input: GuideInput) {
  return {
    ...input,
    contentHtml: sanitizeGuideHtml(input.contentHtml),
    coverImageUrl: input.coverImageUrl || null,
    coverImageAlt: input.coverImageAlt || null,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
  };
}
