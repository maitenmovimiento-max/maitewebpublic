import { marked } from "marked";
import { sanitizeGuideHtml } from "@/lib/sanitize";

marked.setOptions({
  gfm: true,
  breaks: false,
  async: false,
});

function addEditorialSections(html: string) {
  const sections = html.split(/(?=<h2\b)/i);

  if (sections.length === 1) {
    return `<section class="guide-section guide-section--single">${html}</section>`;
  }

  const [introduction, ...contentSections] = sections;
  const introductionCard = introduction.trim()
    ? `<div class="guide-intro">${introduction}</div>`
    : "";

  return introductionCard + contentSections
    .map((section) => `<section class="guide-section">${section}</section>`)
    .join("");
}

export function markdownToSafeHtml(markdown: string) {
  const html = marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
  return addEditorialSections(sanitizeGuideHtml(html));
}
