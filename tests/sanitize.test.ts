import { describe, expect, it } from "vitest";
import { sanitizeGuideHtml } from "@/lib/sanitize";

describe("sanitizeGuideHtml", () => {
  it("elimina scripts y controladores de eventos", () => {
    const result = sanitizeGuideHtml('<p onclick="alert(1)">Hola</p><script>alert(1)</script><img src="https://example.com/a.jpg" onerror="alert(1)">');
    expect(result).not.toContain("script");
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("onerror");
  });
  it("elimina protocolos javascript", () => expect(sanitizeGuideHtml('<a href="javascript:alert(1)">mal</a>')).not.toContain("javascript:"));
  it("conserva estructura editorial segura", () => {
    const result = sanitizeGuideHtml("<h2>Título</h2><p><strong>Texto</strong></p><ul><li>Paso</li></ul>");
    expect(result).toContain("<h2>Título</h2>");
    expect(result).toContain("<strong>Texto</strong>");
  });
});
