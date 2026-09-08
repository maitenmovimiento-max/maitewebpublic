import { ImageResponse } from "next/og";

export const alt = "Maite en Movimiento — ejercicio y bienestar en embarazo y postparto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2f123a 0%, #6b257c 58%, #a987b5 100%)",
        color: "#fffaf2",
        padding: 72,
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, letterSpacing: 5, textTransform: "uppercase" }}>
          <span style={{ width: 54, height: 3, background: "#d5b269" }} />
          Maite en Movimiento
        </div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.04, maxWidth: 940 }}>
          Movimiento que acompaña cada etapa de tu maternidad.
        </div>
        <div style={{ display: "flex", fontFamily: "Arial, sans-serif", fontSize: 26, color: "#eadff0" }}>
          Embarazo · Postparto · Bienestar
        </div>
      </div>
    </div>,
    size,
  );
}
