import sanitizeHtml from "sanitize-html";

export function sanitizeGuideHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "em", "u", "s", "blockquote",
      "ul", "ol", "li", "a", "hr", "figure", "figcaption", "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading", "referrerpolicy"],
    },
    allowedSchemes: ["https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: { ...attribs, rel: "noopener noreferrer", target: "_blank" },
      }),
      img: (_tagName, attribs) => ({
        tagName: "img",
        attribs: { ...attribs, loading: "lazy", referrerpolicy: "no-referrer" },
      }),
    },
  });
}
