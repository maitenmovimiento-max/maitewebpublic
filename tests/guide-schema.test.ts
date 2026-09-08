import { describe, expect, it } from "vitest";
import { guideInputSchema, slugify } from "@/lib/guide-schema";

const valid = {
  title: "Movimiento seguro en el embarazo",
  slug: "movimiento-seguro-embarazo",
  excerpt: "Una descripción útil y suficientemente completa para la guía.",
  contentHtml: "<p>Este es un contenido suficientemente extenso para poder guardar la guía.</p>",
  category: "Embarazo",
  status: "published" as const,
  featured: true,
  readTime: 5,
};

describe("guideInputSchema", () => {
  it("acepta una guía válida", () => expect(guideInputSchema.safeParse(valid).success).toBe(true));
  it("rechaza slugs inseguros", () => expect(guideInputSchema.safeParse({ ...valid, slug: "Guía con espacios" }).success).toBe(false));
  it("rechaza imágenes sin HTTPS", () => expect(guideInputSchema.safeParse({ ...valid, coverImageUrl: "http://example.com/img.jpg" }).success).toBe(false));
  it("acepta imágenes locales", () => expect(guideInputSchema.safeParse({ ...valid, coverImageUrl: "/images/guias/portada.webp" }).success).toBe(true));
  it("limita el tiempo de lectura", () => expect(guideInputSchema.safeParse({ ...valid, readTime: 0 }).success).toBe(false));
});

describe("slugify", () => {
  it("produce enlaces consistentes en español", () => expect(slugify("  Respiración y Movimiento  ")).toBe("respiracion-y-movimiento"));
});
