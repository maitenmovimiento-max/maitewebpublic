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

  it("organiza cada título principal en una sección editorial", () => {
    const html = markdownToSafeHtml("Introducción\n\n## Primera sección\n\nTexto uno.\n\n## Segunda sección\n\nTexto dos.");

    expect(html).toContain('<div class="guide-intro">');
    expect(html.match(/class="guide-section"/g)).toHaveLength(2);
    expect(html).toContain("<h2>Primera sección</h2>");
    expect(html).toContain("<h2>Segunda sección</h2>");
  });

  it("presenta como tarjeta una guía sin títulos de segundo nivel", () => {
    const html = markdownToSafeHtml("Una guía breve y directa.");

    expect(html).toContain('class="guide-section guide-section--single"');
  });
});
