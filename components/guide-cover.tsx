import Image from "next/image";

export function GuideCover({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 960px) 92vw, 40vw" />;
  }

  // External images are loaded by the browser, never fetched by our server.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} referrerPolicy="no-referrer" />;
}
