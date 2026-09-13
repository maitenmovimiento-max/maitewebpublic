import { and, desc, eq } from "drizzle-orm";
import { guideSlugRedirects, guides, type Guide } from "@/db/schema";
import { getDb } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import type { GuideInput } from "@/lib/guide-schema";
import { sampleGuides } from "@/lib/sample-guides";

const allowDemoData = process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_DATA === "true";

export async function listPublishedGuides(): Promise<Guide[]> {
  if (!isDatabaseConfigured) {
    return allowDemoData ? sampleGuides.filter((guide) => guide.status === "published") : [];
  }
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
    return allowDemoData
      ? sampleGuides.find((guide) => guide.slug === slug && guide.status === "published") ?? null
      : null;
  }
  const [guide] = await getDb().select().from(guides)
    .where(and(eq(guides.slug, slug), eq(guides.status, "published")))
    .limit(1);
  return guide ?? null;
}

export async function getPublishedGuideRedirect(slug: string): Promise<string | null> {
  if (!isDatabaseConfigured) return null;
  const [match] = await getDb().select({ slug: guides.slug })
    .from(guideSlugRedirects)
    .innerJoin(guides, eq(guideSlugRedirects.guideId, guides.id))
    .where(and(eq(guideSlugRedirects.oldSlug, slug), eq(guides.status, "published")))
    .limit(1);
  return match?.slug ?? null;
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

  if (current[0].slug !== input.slug) {
    await getDb().insert(guideSlugRedirects).values({ oldSlug: current[0].slug, guideId: id })
      .onConflictDoUpdate({ target: guideSlugRedirects.oldSlug, set: { guideId: id } });
  }

  const [guide] = await getDb().update(guides).set({
    ...normalizeInput(input),
    publishedAt: input.status === "published" ? current[0].publishedAt ?? new Date() : null,
    updatedAt: new Date(),
  }).where(eq(guides.id, id)).returning();
  return guide ?? null;
}

export async function archiveGuide(id: string): Promise<boolean> {
  const archived = await getDb().update(guides).set({ status: "archived", updatedAt: new Date() })
    .where(eq(guides.id, id)).returning({ id: guides.id });
  return archived.length > 0;
}

function normalizeInput(input: GuideInput) {
  return {
    ...input,
    contentMarkdown: input.contentMarkdown.trim(),
    coverImageUrl: input.coverImageUrl || null,
    coverImageAlt: input.coverImageAlt || null,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
  };
}
