import type { MetadataRoute } from "next";
import { listPublishedGuides } from "@/lib/guides";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://maitenmovimiento.cl";
  const guides = await listPublishedGuides();
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/guias`, changeFrequency: "weekly", priority: .8 },
    ...guides.map((guide) => ({ url: `${base}/guias/${guide.slug}`, lastModified: guide.updatedAt, changeFrequency: "monthly" as const, priority: .7 })),
  ];
}
