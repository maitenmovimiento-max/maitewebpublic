import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><div><p className="eyebrow">404</p><h1>Esta página no está disponible.</h1><p>Puede que el enlace haya cambiado o que la guía todavía sea un borrador.</p><Link className="button" href="/">Volver al inicio</Link></div></main>;
}
