import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Guide } from "@/db/schema";
import { GuideCover } from "@/components/guide-cover";

export function GuideCard({ guide, priority = false }: { guide: Guide; priority?: boolean }) {
  return (
    <article className="guide-card">
      <Link className="guide-card__media" href={`/guias/${guide.slug}`} aria-label={`Leer ${guide.title}`}>
        {guide.coverImageUrl ? (
          <GuideCover src={guide.coverImageUrl} alt={guide.coverImageAlt || ""} priority={priority} />
        ) : (
          <span className="guide-card__monogram" aria-hidden="true">M</span>
        )}
        <span className="guide-card__category">{guide.category}</span>
      </Link>
      <div className="guide-card__body">
        <div className="guide-card__meta"><Clock3 size={15} /> {guide.readTime} min de lectura</div>
        <h3><Link href={`/guias/${guide.slug}`}>{guide.title}</Link></h3>
        <p>{guide.excerpt}</p>
        <Link className="text-link" href={`/guias/${guide.slug}`}>Leer guía <ArrowUpRight size={17} /></Link>
      </div>
    </article>
  );
}
