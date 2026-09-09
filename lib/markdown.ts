import { marked } from "marked";
import { sanitizeGuideHtml } from "@/lib/sanitize";

marked.setOptions({
  gfm: true,
  breaks: false,
  async: false,
});

export function markdownToSafeHtml(markdown: string) {
  const html = marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
  return sanitizeGuideHtml(html);
}
