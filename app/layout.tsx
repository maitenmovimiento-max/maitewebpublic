import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maitenmovimiento.cl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "MaitenMovimiento · Embarazo y postparto en movimiento", template: "%s · MaitenMovimiento" },
  description: "Acompañamiento profesional, cálido y personalizado para moverte con seguridad durante el embarazo y el postparto.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "MaitenMovimiento",
    title: "MaitenMovimiento · Tu cuerpo cambia. Tu fuerza también.",
    description: "Movimiento con amor y conocimiento para acompañarte durante el embarazo y el postparto.",
  },
  twitter: { card: "summary_large_image", title: "MaitenMovimiento", description: "Movimiento prenatal y postparto con acompañamiento humano." },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
