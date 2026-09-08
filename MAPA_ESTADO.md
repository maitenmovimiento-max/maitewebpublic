# Mapa de estado del proyecto

## Listo en el repositorio

- **Frontend:** Next.js 16, React 19, TypeScript y una identidad editorial premium que mantiene morado, lavanda, salvia y dorado.
- **Guías:** una guía se guarda como `content_markdown` en Neon. El panel acepta pegar Markdown o cargar un archivo `.md` de hasta 150 KB.
- **Publicación:** cada guía publicada tiene su enlace `/guias/<slug>`, metadatos SEO y tarjetas sociales generadas dinámicamente.
- **Seguridad:** Markdown convertido a HTML sanitizado, cookies de sesión firmadas, comprobación de origen, límite de intentos persistente y archivado en vez de borrado físico.
- **Base:** Drizzle mantiene migraciones versionadas en `db/migrations/`; `DIRECT_DATABASE_URL` es para migrar y `DATABASE_URL` para la aplicación.
- **Calidad:** lint, TypeScript, pruebas unitarias, pruebas de accesibilidad y pruebas E2E de escritorio/móvil.

Los archivos estáticos históricos (`index.html`, `css/`, `js/` y `admin/`) se conservan como referencia de migración; la aplicación nueva se sirve desde `app/` y sus componentes.

## Falta completar fuera del código

1. Iniciar sesión en GitHub para subir la rama `codex/neon-guides-redesign`.
2. Crear el proyecto gratuito de Neon y copiar las URLs pooled/directa.
3. Configurar las variables privadas en Netlify.
4. Ejecutar `pnpm db:migrate` y `pnpm db:seed` contra Neon.
5. Desplegar y comprobar `https://maitenmovimiento.cl/api/health`.

No se debe poner la contraseña de Neon en GitHub ni dentro de un archivo versionado.
