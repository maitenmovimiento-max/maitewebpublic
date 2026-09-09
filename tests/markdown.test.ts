import { describe, expect, it } from "vitest";
import { markdownToSafeHtml } from "@/lib/markdown";

describe("Markdown de guías", () => {
  it("convierte estructura Markdown a HTML seguro", () => {
    const html = markdownToSafeHtml("# Título\n\n- Uno\n- Dos\n\n[Más información](https://example.com)");
    expect(html).toContain("<h1>Título</h1>");
    expect(html).toContain("<ul>");
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("elimina HTML peligroso pegado dentro del Markdown", () => {
    const html = markdownToSafeHtml("Texto\n\n<script>alert('x')</script>\n\n[enlace](javascript:alert(1))");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("javascript:");
  });
});
