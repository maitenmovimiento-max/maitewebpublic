import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listPublishedGuides } from "@/lib/guides";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guías",
  description: "Guías prácticas de movimiento, bienestar, embarazo y postparto creadas por MaitenMovimiento.",
  alternates: { canonical: "/guias" },
};

export default async function GuidesPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const allGuides = await listPublishedGuides();
  const categories = [...new Set(allGuides.map((guide) => guide.category))];
  const guides = categoria ? allGuides.filter((guide) => guide.category === categoria) : allGuides;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="shell page-hero__inner">
            <p className="eyebrow">Biblioteca Maiten</p>
            <h1>Guías para sentirte más <em>informada y acompañada.</em></h1>
            <p>Recursos claros y prácticos para leer desde cualquier dispositivo. Cada guía puede actualizarse sin que cambie su enlace.</p>
          </div>
        </section>
        <section className="section guides-page">
          <div className="shell">
            <nav className="guides-toolbar" aria-label="Filtrar guías por categoría">
              <Link className={`filter-chip${!categoria ? " filter-chip--active" : ""}`} href="/guias">Todas</Link>
              {categories.map((category) => (
                <Link className={`filter-chip${categoria === category ? " filter-chip--active" : ""}`} href={`/guias?categoria=${encodeURIComponent(category)}`} key={category}>{category}</Link>
              ))}
            </nav>
            {guides.length ? <div className="guides-grid">{guides.map((guide, index) => <GuideCard key={guide.id} guide={guide} priority={index === 0} />)}</div> : <div className="empty-state"><h2>Aún no hay guías en esta categoría</h2><p>Prueba con otra categoría o vuelve pronto.</p></div>}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
