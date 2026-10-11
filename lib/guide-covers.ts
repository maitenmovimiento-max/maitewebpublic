import type { Guide } from "@/db/schema";

type GuideCover = Pick<Guide, "coverImageUrl" | "coverImageAlt">;

const publishedGuideCovers: Record<string, GuideCover> = {
  "cuidar-tu-alimentacion-en-el-posparto": {
    coverImageUrl: "/images/guias/alimentacion-postparto.png",
    coverImageAlt: "Ilustración editorial de alimentos, agua y objetos de autocuidado para el postparto",
  },
  "volver-a-conectarte-contigo-en-la-maternidad": {
    coverImageUrl: "/images/guias/conexion-maternidad.png",
    coverImageAlt: "Ilustración editorial de un rincón tranquilo con una libreta, una taza y una manta",
  },
  "adaptar-el-entrenamiento-segun-tu-energia": {
    coverImageUrl: "/images/guias/energia-entrenamiento.png",
    coverImageAlt: "Ilustración editorial de objetos de movimiento y piedras que representan niveles de energía",
  },
  "entrenamiento-mes-a-mes": {
    coverImageUrl: "/images/guias/entrenamiento-mes-a-mes.png",
    coverImageAlt: "Ilustración editorial de una planificación circular y una planta en crecimiento",
  },
  "movilidad-suave-al-final-del-dia": {
    coverImageUrl: "/images/guias/movilidad-final-del-dia.png",
    coverImageAlt: "Ilustración editorial de una colchoneta, cojín y luz de atardecer para movilidad suave",
  },
  "empezar-a-moverte-a-los-7-meses-de-embarazo": {
    coverImageUrl: "/images/guias/moverse-7-meses.png",
    coverImageAlt: "Ilustración editorial de zapatos, agua y un camino de pasos suaves durante el embarazo",
  },
  "hasta-cuanto-peso-puedo-levantar-durante-el-embarazo": {
    coverImageUrl: "/images/guias/carga-embarazo.png",
    coverImageAlt: "Ilustración editorial de una pesa y bloques de apoyo que sugieren fuerza gradual",
  },
  "mover-el-cuerpo-en-el-embarazo-una-forma-realista-de-empezar": {
    coverImageUrl: "/images/guias/empezar-moverse-embarazo.png",
    coverImageAlt: "Ilustración editorial de una colchoneta, banda elástica y primeros pasos de movimiento",
  },
  "adaptar-ejercicio-embarazo": {
    coverImageUrl: "/images/guias/adaptar-ejercicio-embarazo.png",
    coverImageAlt: "Ilustración editorial de implementos de ejercicio adaptables y formas modulares",
  },
  "entrenar-con-peso-en-el-embarazo": {
    coverImageUrl: "/images/guias/fuerza-embarazo.png",
    coverImageAlt: "Ilustración editorial de una pesa, una colchoneta y una libreta para entrenar con criterio",
  },
};

export function getGuideCover(guide: Guide): GuideCover {
  return publishedGuideCovers[guide.slug] ?? {
    coverImageUrl: guide.coverImageUrl,
    coverImageAlt: guide.coverImageAlt,
  };
}
