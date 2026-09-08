import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GuideCover } from "@/components/guide-cover";
import { getPublishedGuide } from "@/lib/guides";
import { sanitizeGuideHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getPublishedGuide(slug);
  if (!guide) return { title: "Guía no encontrada" };

  const title = guide.seoTitle || guide.title;
  const description = guide.seoDescription || guide.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/guias/${guide.slug}` },
    openGraph: { type: "article", title, description, publishedTime: guide.publishedAt?.toISOString() },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getPublishedGuide(slug);
  if (!guide) notFound();

  const formattedDate = guide.publishedAt
    ? new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" }).format(guide.publishedAt)
    : null;

  return (
    <>
      <SiteHeader />
      <main>
        <article>
          <header className="article-hero">
            <div className="shell">
              <nav className="breadcrumbs" aria-label="Migas de pan"><Link href="/">Inicio</Link><span>/</span><Link href="/guias">Guías</Link><span>/</span><span>{guide.category}</span></nav>
              <div className="article-hero__grid">
                <div>
                  <p className="eyebrow">{guide.category}</p>
                  <h1>{guide.title}</h1>
                  <p className="article-hero__excerpt">{guide.excerpt}</p>
                  <div className="article-meta"><span><Clock3 size={16} /> {guide.readTime} min</span>{formattedDate && <span><CalendarDays size={16} /> {formattedDate}</span>}</div>
                </div>
                <div className="article-cover">
                  {guide.coverImageUrl ? <GuideCover src={guide.coverImageUrl} alt={guide.coverImageAlt || ""} priority /> : <span className="article-cover__letter" aria-hidden="true">M</span>}
                </div>
              </div>
            </div>
          </header>
          <div className="article-body-wrap">
            <aside className="article-aside"><p>Biblioteca Maiten</p><Link href="/guias"><ArrowLeft size={16} /> Todas las guías</Link></aside>
            <div>
              <div className="prose" dangerouslySetInnerHTML={{ __html: sanitizeGuideHtml(guide.contentHtml) }} />
              <p className="medical-note"><strong>Nota de cuidado:</strong> este contenido es educativo y no reemplaza la evaluación ni las indicaciones de tu profesional de salud.</p>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
