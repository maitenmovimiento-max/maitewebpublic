import { z } from "zod";

const allowedUrl = z.union([
  z.literal(""),
  z.string().url().refine((url) => url.startsWith("https://"), "La imagen debe usar HTTPS"),
  z.string().regex(/^\/images\/[a-zA-Z0-9/_\-.]+$/, "Ruta de imagen inválida"),
]);

export const guideInputSchema = z.object({
  title: z.string().trim().min(5).max(120),
  slug: z.string().trim().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(20).max(280),
  contentMarkdown: z.string().trim().min(40).max(100_000),
  coverImageUrl: allowedUrl.optional().default(""),
  coverImageAlt: z.string().trim().max(180).optional().default(""),
  category: z.string().trim().min(2).max(50),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().default(false),
  readTime: z.coerce.number().int().min(1).max(90),
  seoTitle: z.string().trim().max(70).optional().default(""),
  seoDescription: z.string().trim().max(170).optional().default(""),
});

export type GuideInput = z.infer<typeof guideInputSchema>;

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
