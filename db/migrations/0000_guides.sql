CREATE TYPE "guide_status" AS ENUM ('draft', 'published', 'archived');

CREATE TABLE "guides" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "excerpt" text NOT NULL,
  "content_html" text NOT NULL,
  "cover_image_url" text,
  "cover_image_alt" text,
  "category" text NOT NULL,
  "status" "guide_status" DEFAULT 'draft' NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "read_time" integer DEFAULT 5 NOT NULL,
  "seo_title" text,
  "seo_description" text,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "guides_status_published_idx" ON "guides" ("status", "published_at");
CREATE INDEX "guides_category_idx" ON "guides" ("category");

INSERT INTO "guides" (
  "slug", "title", "excerpt", "content_html", "category", "status", "featured", "read_time", "published_at"
) VALUES
(
  'movimiento-seguro-primer-trimestre',
  'Movimiento seguro durante el primer trimestre',
  'Una guía amable para mantenerte activa, reducir molestias y escuchar tu cuerpo durante las primeras semanas.',
  '<p>El primer trimestre trae cambios profundos. El movimiento puede ayudarte a transitar esta etapa con más energía y confianza, siempre que tu equipo de salud no haya indicado lo contrario.</p><h2>Principios para comenzar</h2><ul><li>Prioriza la regularidad por sobre la intensidad.</li><li>Busca una respiración cómoda durante toda la sesión.</li><li>Detente ante dolor, sangrado, mareos o falta de aire inusual.</li></ul><h2>Una rutina simple</h2><p>Combina caminatas suaves, movilidad de cadera, ejercicios de fuerza con tu propio peso y respiración diafragmática. Comienza con 15 minutos y ajusta según cómo te sientas.</p><blockquote>Tu cuerpo no necesita exigencia: necesita acompañamiento, seguridad y progresión.</blockquote><p><strong>Importante:</strong> esta guía es educativa y no reemplaza una evaluación médica individual.</p>',
  'Embarazo', 'published', true, 6, now()
),
(
  'respiracion-consciente-embarazo',
  'Respiración consciente para volver a tu centro',
  'Tres prácticas breves para disminuir tensión y reconectar contigo y con tu bebé.',
  '<p>Respirar de forma consciente crea una pausa real en medio del día. No necesitas experiencia ni equipamiento: solo un lugar cómodo y unos minutos.</p><h2>Respiración 4–6</h2><p>Inhala suavemente durante cuatro tiempos y exhala durante seis. Repite entre cinco y ocho ciclos sin forzar.</p><h2>Respiración lateral</h2><p>Apoya tus manos en las costillas. Siente cómo se expanden hacia los lados al inhalar y cómo regresan al exhalar.</p><h2>Cuándo practicar</h2><p>Úsala antes de dormir, al comenzar una sesión de movimiento o cuando necesites bajar el ritmo.</p>',
  'Bienestar', 'published', true, 4, now()
),
(
  'regreso-amable-movimiento-postparto',
  'Un regreso amable al movimiento después del parto',
  'Señales, prioridades y pasos progresivos para acompañar tu recuperación sin compararte.',
  '<p>El postparto no es una carrera. Antes de volver a entrenar, tu cuerpo necesita recuperar descanso, respiración, movilidad y confianza.</p><h2>Empieza por la base</h2><ol><li>Respiración diafragmática.</li><li>Conexión suave con el suelo pélvico.</li><li>Caminatas breves según tolerancia.</li><li>Evaluación profesional antes de aumentar impacto.</li></ol><p>Cada recuperación es distinta. Ajusta los tiempos a tu parto, tu descanso y las indicaciones de tu equipo de salud.</p>',
  'Postparto', 'published', false, 5, now()
);
