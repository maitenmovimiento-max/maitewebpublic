import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { Brand } from "@/components/brand";

type SiteFooterProps = {
  description?: string;
  ctaTitle?: string;
  ctaCopy?: string;
  ctaHref?: string;
  bottomLabel?: string;
};

export function SiteFooter({
  description = "Movimiento con amor y conocimiento para acompañarte durante el embarazo y el postparto.",
  ctaTitle = "Tu proceso merece cuidado",
  ctaCopy = "Cuéntame en qué etapa estás y diseñemos juntas el acompañamiento que necesitas.",
  ctaHref = "/#contacto",
  bottomLabel = "Bienestar prenatal y postparto",
}: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div className="site-footer__intro">
          <Brand light />
          <p>{description}</p>
        </div>
        <div>
          <p className="footer-title">Explora</p>
          <Link href="/#servicios">Servicios</Link>
          <Link href="/guias">Biblioteca de guías</Link>
          <Link href="/#sobre-maite">Sobre Maite</Link>
        </div>
        <div>
          <p className="footer-title">Conversemos</p>
          <a href="https://www.instagram.com/maitenmovimiento/" target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram</a>
          <a href="https://wa.me/56987572067" target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>
        </div>
        <div className="site-footer__cta">
          <p className="footer-title">{ctaTitle}</p>
          <p>{ctaCopy}</p>
          <Link className="button button--gold" href={ctaHref}>Conversemos</Link>
        </div>
      </div>
      <div className="shell site-footer__bottom">
        <span>© {new Date().getFullYear()} MaitenMovimiento</span>
        <span>{bottomLabel}</span>
      </div>
    </footer>
  );
}
