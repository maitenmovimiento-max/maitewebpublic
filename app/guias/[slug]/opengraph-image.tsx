import { ImageResponse } from "next/og";
import { getPublishedGuide } from "@/lib/guides";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function GuideOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getPublishedGuide(slug);
  const title = guide?.title ?? "Guía Maite en Movimiento";
  const category = guide?.category ?? "Bienestar";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "stretch",
        background: "#fbf7ee",
        color: "#32163d",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ width: 22, background: "#7a1fa1" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "66px 76px", flex: 1 }}>
        <div style={{ display: "flex", fontFamily: "Arial, sans-serif", color: "#7a1fa1", fontSize: 23, letterSpacing: 4, textTransform: "uppercase" }}>
          {category} · Guía práctica
        </div>
        <div style={{ display: "flex", fontSize: title.length > 54 ? 57 : 68, lineHeight: 1.05, maxWidth: 980 }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Arial, sans-serif", fontSize: 24 }}>
          <span style={{ width: 42, height: 3, background: "#c9a04e" }} />
          maitenmovimiento.cl
        </div>
      </div>
    </div>,
    size,
  );
}
